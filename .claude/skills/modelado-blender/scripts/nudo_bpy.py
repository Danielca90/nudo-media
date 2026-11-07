"""
nudo_bpy.py - funciones probadas para modelar en Blender por código (headless).

Uso dentro de un script que corre Blender:
    import sys; sys.path.insert(0, "<ruta>/scripts")
    from nudo_bpy import *
    escena_nueva()
    ob = revolucion("maceta", [(0,0),(1,0),(1,1),(0,1)], segmentos=12)
    ...
Correr:  blender -b -P mi_script.py -- <argumentos>
Unidades: metros (Blender). Ejes: Z arriba; el frente mira a -Y (vista Front).
"""
import math
import os

import bmesh
import bpy
from mathutils import Vector


# --------------------------------------------------------------------------- escena
def escena_nueva(motor="CYCLES", muestras=48, resolucion=(1080, 1080), fondo=(0.32, 0.33, 0.35), fuerza_fondo=0.8):
    """Escena vacía con mundo de color plano. Cycles en CPU (no hay GPU en la nube)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = motor
    if motor == "CYCLES":
        sc.cycles.device = "CPU"
        sc.cycles.samples = muestras
        sc.cycles.use_denoising = True
    sc.render.resolution_x, sc.render.resolution_y = resolucion
    sc.unit_settings.system = "METRIC"
    w = bpy.data.worlds.new("mundo"); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*fondo, 1)
    bg.inputs[1].default_value = fuerza_fondo
    return sc


def piso(tamano=10, color=(0.25, 0.26, 0.28)):
    bpy.ops.mesh.primitive_plane_add(size=tamano, location=(0, 0, 0))
    ob = bpy.context.object; ob.name = "piso"
    ob.data.materials.append(material_simple("piso", color, rugosidad=0.9))
    return ob


def sol(energia=3.5, rot_grados=(40, 15, 30)):
    s = bpy.data.objects.new("sol", bpy.data.lights.new("sol", "SUN"))
    s.data.energy = energia
    s.rotation_euler = tuple(math.radians(a) for a in rot_grados)
    bpy.context.scene.collection.objects.link(s)
    return s


def camara(objetivo=(0, 0, 0.5), posicion=(3, -3, 2.5), lente=50):
    """Cámara apuntando a 'objetivo'. Usa encuadrar() para ajustarla a objetos."""
    sc = bpy.context.scene
    cam = bpy.data.objects.new("camara", bpy.data.cameras.new("camara"))
    sc.collection.objects.link(cam); sc.camera = cam
    cam.data.lens = lente
    apuntar(cam, posicion, objetivo)
    return cam


def apuntar(cam, posicion, objetivo):
    cam.location = Vector(posicion)
    cam.rotation_euler = (Vector(objetivo) - cam.location).to_track_quat("-Z", "Y").to_euler()


def encuadrar(cam, objetos, direccion=(1, -1, 0.75), margen=1.25):
    """Coloca la cámara para que los objetos entren completos, mirando desde 'direccion'."""
    pts = [o.matrix_world @ Vector(c) for o in objetos for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    centro, radio = (lo + hi) / 2, (hi - lo).length / 2
    sc = bpy.context.scene
    asp = sc.render.resolution_x / sc.render.resolution_y
    # sensor_fit AUTO: el sensor cubre el lado largo; usar el ángulo del lado corto
    fov_largo = 2 * math.atan(cam.data.sensor_width / (2 * cam.data.lens))
    fov = 2 * math.atan(math.tan(fov_largo / 2) / max(asp, 1 / asp))
    dist = radio * margen / math.sin(fov / 2)
    apuntar(cam, centro + Vector(direccion).normalized() * dist, centro)


# --------------------------------------------------------------------------- geometría
def revolucion(nombre, perfil, segmentos=32, suave=False):
    """Sólido de revolución (torno). perfil = [(radio, z), ...] de abajo hacia arriba.
    r = 0 en un extremo cierra con un abanico (tapa). Para objetos huecos, el perfil sigue
    por la pared interior hacia abajo. Orientación de caras consistente (normales afuera)."""
    bm = bmesh.new()
    anillos = []
    for r, z in perfil:
        if r == 0:
            anillos.append([bm.verts.new((0, 0, z))])
        else:
            anillos.append([bm.verts.new((r * math.cos(2 * math.pi * i / segmentos),
                                          r * math.sin(2 * math.pi * i / segmentos), z))
                            for i in range(segmentos)])
    n = segmentos
    for a, b in zip(anillos, anillos[1:]):
        if len(a) == 1 and len(b) == 1:
            continue
        if len(a) == 1:
            for i in range(n): bm.faces.new((a[0], b[(i + 1) % n], b[i]))
        elif len(b) == 1:
            for i in range(n): bm.faces.new((a[i], a[(i + 1) % n], b[0]))
        else:
            for i in range(n): bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return _a_objeto(nombre, bm, suave)


def caja(nombre, x0, y0, z0, x1, y1, z1, bisel=0.0):
    """Caja alineada a ejes entre dos esquinas (metros). Útil para tableros de muebles."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=(abs(x1 - x0), abs(y1 - y0), abs(z1 - z0)), verts=bm.verts)
    bmesh.ops.translate(bm, vec=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), verts=bm.verts)
    ob = _a_objeto(nombre, bm, False)
    if bisel > 0:
        md = ob.modifiers.new("bisel", "BEVEL"); md.width = bisel; md.segments = 2
    return ob


def malla(nombre, vertices, caras, suave=False):
    """Malla desde listas: vertices [(x,y,z)], caras [(i,j,k,...)]."""
    me = bpy.data.meshes.new(nombre)
    me.from_pydata(vertices, [], caras); me.update()
    ob = bpy.data.objects.new(nombre, me); bpy.context.scene.collection.objects.link(ob)
    if suave:
        for p in me.polygons: p.use_smooth = True
    return ob


def _a_objeto(nombre, bm, suave):
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nombre, me); bpy.context.scene.collection.objects.link(ob)
    if suave:
        for p in me.polygons: p.use_smooth = True
    return ob


# --------------------------------------------------------------------------- modificadores
def subdivision(ob, niveles=2):
    md = ob.modifiers.new("Subdivision", "SUBSURF"); md.levels = md.render_levels = niveles
    for p in ob.data.polygons: p.use_smooth = True
    return md


def espesor(ob, grosor=0.01, desplazamiento=-1):
    md = ob.modifiers.new("Solidify", "SOLIDIFY"); md.thickness = grosor; md.offset = desplazamiento
    return md


def jaula(ob_o_perfil, grosor=0.012, color=(0.1, 0.55, 1.0)):
    """Copia en alambre azul del objeto (como el overlay de Edit Mode) para renders didácticos."""
    j = ob_o_perfil.copy(); j.data = ob_o_perfil.data.copy(); j.name = ob_o_perfil.name + "_jaula"
    j.modifiers.clear()
    bpy.context.scene.collection.objects.link(j)
    wf = j.modifiers.new("wf", "WIREFRAME"); wf.thickness = grosor; wf.use_replace = True
    j.data.materials.clear(); j.data.materials.append(material_simple("jaula", color, emision=2.5))
    return j


def aplicar_modificadores(ob):
    bpy.context.view_layer.objects.active = ob
    for md in list(ob.modifiers):
        bpy.ops.object.modifier_apply(modifier=md.name)


# --------------------------------------------------------------------------- materiales (nodos)
def material_simple(nombre, color, rugosidad=0.6, metal=0.0, emision=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rugosidad
    b.inputs["Metallic"].default_value = metal
    if emision:
        b.inputs["Emission Color"].default_value = (*color, 1)
        b.inputs["Emission Strength"].default_value = emision
    return m


MADERAS = {  # (veta clara, veta oscura, anillos por metro, distorsión)
    "pino":   ((0.80, 0.60, 0.38), (0.62, 0.40, 0.20), 18, 6.0),
    "roble":  ((0.66, 0.48, 0.30), (0.45, 0.30, 0.17), 26, 8.0),
    "nogal":  ((0.36, 0.22, 0.13), (0.20, 0.11, 0.06), 22, 7.0),
    "cedro":  ((0.72, 0.42, 0.26), (0.52, 0.27, 0.15), 20, 6.5),
}


def material_madera(nombre="madera", tipo="pino", escala=1.0, direccion="X", rugosidad=0.55, relieve=0.15):
    """Madera procedural con nodos: Wave (anillos) + Noise (distorsión y poro) -> ColorRamp -> BSDF + Bump.
    direccion = eje de la veta ('X', 'Y' o 'Z'). Usa coordenadas Object, así la veta no se estira."""
    claro, oscuro, anillos, dist = MADERAS[tipo]
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    nt = m.node_tree; N, L = nt.nodes, nt.links
    bsdf = N["Principled BSDF"]
    tc = N.new("ShaderNodeTexCoord"); tc.location = (-1200, 0)
    mp = N.new("ShaderNodeMapping"); mp.location = (-1000, 0)
    # estirar a lo largo de la veta: escala baja en el eje de la veta
    s = {"X": (0.08, 1, 1), "Y": (1, 0.08, 1), "Z": (1, 1, 0.08)}[direccion]
    mp.inputs["Scale"].default_value = tuple(v * escala for v in s)
    ns = N.new("ShaderNodeTexNoise"); ns.location = (-800, -250)
    ns.inputs["Scale"].default_value = 1.5; ns.inputs["Detail"].default_value = 8.0
    wv = N.new("ShaderNodeTexWave"); wv.location = (-600, 0)
    wv.wave_type = "RINGS"; wv.rings_direction = "Z" if direccion != "Z" else "X"
    wv.inputs["Scale"].default_value = anillos
    wv.inputs["Distortion"].default_value = dist * 0.8
    wv.wave_profile = "SAW"
    wv.inputs["Detail"].default_value = 3.0
    poro = N.new("ShaderNodeTexNoise"); poro.location = (-600, -350)
    poro.inputs["Scale"].default_value = 180.0; poro.inputs["Detail"].default_value = 2.0
    cr = N.new("ShaderNodeValToRGB"); cr.location = (-350, 0)
    cr.color_ramp.elements[0].color = (*claro, 1); cr.color_ramp.elements[0].position = 0.0
    cr.color_ramp.elements[1].color = (*claro, 1); cr.color_ramp.elements[1].position = 0.55
    e = cr.color_ramp.elements.new(0.92); e.color = (*oscuro, 1)
    mix = N.new("ShaderNodeMix"); mix.location = (-100, 0); mix.data_type = "RGBA"; mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 0.12
    bump = N.new("ShaderNodeBump"); bump.location = (-100, -300); bump.inputs["Strength"].default_value = relieve
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    L.new(mp.outputs["Vector"], ns.inputs["Vector"])
    # deformar las coordenadas con ruido: anillos ondulados y separación irregular
    warp = N.new("ShaderNodeMix"); warp.location = (-800, 100); warp.data_type = "VECTOR"
    warp.inputs["Factor"].default_value = 0.35
    L.new(mp.outputs["Vector"], warp.inputs["A"])
    L.new(ns.outputs["Color"], warp.inputs["B"])
    L.new(warp.outputs["Result"], wv.inputs["Vector"])
    L.new(mp.outputs["Vector"], poro.inputs["Vector"])
    L.new(wv.outputs["Fac"], cr.inputs["Fac"])
    L.new(cr.outputs["Color"], mix.inputs["A"])
    L.new(poro.outputs["Color"], mix.inputs["B"])
    L.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    L.new(wv.outputs["Fac"], bump.inputs["Height"])
    L.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Roughness"].default_value = rugosidad
    return m


def asignar(ob, mat):
    ob.data.materials.clear(); ob.data.materials.append(mat)


# --------------------------------------------------------------------------- salida
def render(ruta):
    os.makedirs(os.path.dirname(os.path.abspath(ruta)), exist_ok=True)
    bpy.context.scene.render.filepath = ruta
    bpy.ops.render.render(write_still=True)
    return ruta


def hornear_textura(ob, ruta_png, tipo="DIFFUSE", lado=1024):
    """Hornea el material procedural a imagen (para SketchUp / web). tipo: DIFFUSE, ROUGHNESS, NORMAL.
    Crea UVs con Smart UV Project si el objeto no tiene."""
    sc = bpy.context.scene
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.selected_objects: o.select_set(False)
    ob.select_set(True)
    if not ob.data.uv_layers:
        bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.02)
        bpy.ops.object.mode_set(mode="OBJECT")
    img = bpy.data.images.new(os.path.basename(ruta_png), lado, lado)
    for mat in ob.data.materials:
        n = mat.node_tree.nodes.new("ShaderNodeTexImage"); n.image = img
        mat.node_tree.nodes.active = n
    sc.render.engine = "CYCLES"
    if tipo == "DIFFUSE":
        sc.render.bake.use_pass_direct = sc.render.bake.use_pass_indirect = False
        sc.render.bake.use_pass_color = True
    bpy.ops.object.bake(type=tipo)
    img.filepath_raw = ruta_png; img.file_format = "PNG"; img.save()
    return ruta_png


def exportar(ob_lista, ruta):
    """Exporta según extensión: .glb/.gltf, .obj, .fbx, .stl. Solo los objetos dados."""
    for o in bpy.context.scene.objects: o.select_set(False)
    for o in ob_lista: o.select_set(True)
    ext = os.path.splitext(ruta)[1].lower()
    if ext in (".glb", ".gltf"):
        bpy.ops.export_scene.gltf(filepath=ruta, use_selection=True, export_format="GLB" if ext == ".glb" else "GLTF_SEPARATE")
    elif ext == ".obj":
        bpy.ops.wm.obj_export(filepath=ruta, export_selected_objects=True, export_materials=True)
    elif ext == ".fbx":
        bpy.ops.export_scene.fbx(filepath=ruta, use_selection=True)
    elif ext == ".stl":
        bpy.ops.wm.stl_export(filepath=ruta, export_selected_objects=True)
    else:
        raise ValueError("Extensión no soportada: " + ext)
    return ruta


def guardar_blend(ruta):
    bpy.ops.wm.save_as_mainfile(filepath=ruta)
    return ruta
