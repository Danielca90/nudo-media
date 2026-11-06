"""Maceta low poly por pasos (cilindro -> loop cuts -> borde -> escalar -> subdivision). Uso:
blender -b -P maceta.py -- <carpeta_salida>
"""
import bpy, bmesh, math, os, sys
from mathutils import Vector

OUT = sys.argv[-1]
os.makedirs(OUT, exist_ok=True)
SEG = 12

# Perfiles (radio, altura) de abajo hacia arriba; si es hueca, sigue por la pared interior hacia abajo.
PASOS = [
 ("1_cilindro",       [(0,0),(1,0),(1,1),(0,1)], False),
 ("2_loop_cut",       [(0,0),(1,0),(1,.5),(1,1),(0,1)], False),
 ("3_borde",          [(0,0),(1,0),(1,.5),(1,.88),(1.14,.94),(1.14,1.04),(.93,1.04),(.89,.94),(.86,.12),(0,.12)], False),
 ("4_escalar_base",   [(0,0),(.68,0),(1,.5),(1,.88),(1.14,.94),(1.14,1.04),(.93,1.04),(.89,.94),(.86,.12),(0,.12)], False),
 ("5_mas_loops",      [(0,0),(.68,0),(.9,.22),(1,.5),(.98,.72),(1,.88),(1.14,.94),(1.14,1.04),(.93,1.04),(.89,.94),(.86,.12),(0,.12)], False),
 ("6_ajustar_medio",  [(0,0),(.66,0),(.98,.2),(1.12,.45),(1.06,.7),(.94,.86),(1.12,.94),(1.12,1.04),(.92,1.04),(.84,.92),(.92,.6),(.82,.14),(0,.14)], False),
 ("7_subdivision",    [(0,0),(.66,0),(.98,.2),(1.12,.45),(1.06,.7),(.94,.86),(1.12,.94),(1.12,1.04),(.92,1.04),(.84,.92),(.92,.6),(.82,.14),(0,.14)], True),
]

def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def malla_por_perfil(nombre, perfil):
    bm = bmesh.new()
    anillos = []
    for r, z in perfil:
        if r == 0:
            anillos.append([bm.verts.new((0, 0, z))])
        else:
            anillos.append([bm.verts.new((r*math.cos(2*math.pi*i/SEG), r*math.sin(2*math.pi*i/SEG), z)) for i in range(SEG)])
    for a, b in zip(anillos, anillos[1:]):
        if len(a) == 1:
            for i in range(SEG): bm.faces.new((a[0], b[i], b[(i+1) % SEG]))
        elif len(b) == 1:
            for i in range(SEG): bm.faces.new((a[i], a[(i+1) % SEG], b[0]))
        else:
            for i in range(SEG): bm.faces.new((a[i], a[(i+1) % SEG], b[(i+1) % SEG], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(nombre); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nombre, me); bpy.context.scene.collection.objects.link(ob)
    return ob

def material(nombre, color, emision=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = 0.6
    if emision:
        bsdf.inputs["Emission Color"].default_value = (*color, 1)
        bsdf.inputs["Emission Strength"].default_value = emision
    return m

def escena(nombre, perfil, subdiv):
    limpiar()
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 48
    sc.render.resolution_x = sc.render.resolution_y = 480
    sc.render.film_transparent = False
    w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (0.32, 0.33, 0.35, 1)
    w.node_tree.nodes["Background"].inputs[1].default_value = 0.8
    ob = malla_por_perfil("maceta", perfil)
    ob.data.materials.append(material("gris", (0.62, 0.62, 0.64)))
    if subdiv:
        md = ob.modifiers.new("Subdivision", 'SUBSURF'); md.levels = md.render_levels = 2
        for p in ob.data.polygons: p.use_smooth = True
    # jaula azul (como el overlay de Edit Mode)
    jaula = malla_por_perfil("jaula", perfil)
    wf = jaula.modifiers.new("wf", 'WIREFRAME'); wf.thickness = 0.018; wf.use_replace = True
    jaula.data.materials.append(material("azul", (0.1, 0.55, 1.0), emision=2.5))
    # piso, luz y cámara
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0)); bpy.context.object.data.materials.append(material("piso", (0.25, 0.26, 0.28)))
    sun = bpy.data.objects.new("sol", bpy.data.lights.new("sol", 'SUN')); sun.data.energy = 3.5
    sun.rotation_euler = (math.radians(40), math.radians(15), math.radians(30)); sc.collection.objects.link(sun)
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
    cam.location = (3.1, -3.1, 2.6)
    d = Vector((0, 0, 0.5)) - cam.location; cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = 50
    sc.render.filepath = os.path.join(OUT, nombre + ".png")
    bpy.ops.render.render(write_still=True)

for nombre, perfil, sub in PASOS:
    escena(nombre, perfil, sub)

# guardar el .blend del resultado final, sin la jaula
bpy.data.objects.remove(bpy.data.objects["jaula"])
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "maceta.blend"))
