"""
zoky.py  -  Modelo 3D de "Zöky Só" (mascota zorro/shiba con hoodie) en Blender, por código.

Uso (sin pantalla):
    blender -b -P zoky.py -- <carpeta_salida> [muestras]

Genera: zoky.blend, zoky.glb y renders (frente, lateral, trasera, 3/4, superior).
Unidades en metros (altura total ~1.05 m), frente del personaje hacia -Y.
Todo es paramétrico: cambiar los números de abajo y volver a correr.
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector

OUT = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else os.getcwd()
SAMPLES = int(sys.argv[sys.argv.index("--") + 2]) if "--" in sys.argv and len(sys.argv) > sys.argv.index("--") + 2 else 48
os.makedirs(OUT, exist_ok=True)

# --------------------------------------------------------------------------
# Paleta (de la hoja de referencia)
# --------------------------------------------------------------------------
PAL = dict(
    naranja="#F7931E", crema="#F5E6D0", negro="#182028", tan="#E8C9A0",
    naranja_osc="#E46A2E", azul_osc="#0F1A2E", rosa="#E8607A", rojo="#8B1A2B",
    blanco="#FFFFFF", ojo="#101418",
)


def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hexc(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return (lin(r), lin(g), lin(b), 1.0)


# --------------------------------------------------------------------------
# Escena y utilidades
# --------------------------------------------------------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
coll = bpy.data.collections.new("Zoky")
scene.collection.children.link(coll)

MATS = {}


def mat(key, rough=0.55):
    if key not in MATS:
        m = bpy.data.materials.new(key)
        m.use_nodes = True
        b = m.node_tree.nodes["Principled BSDF"]
        b.inputs["Base Color"].default_value = hexc(PAL[key])
        b.inputs["Roughness"].default_value = rough
        b.inputs["Specular IOR Level"].default_value = 0.25
        MATS[key] = m
    return MATS[key]


def _link(name, me, m, loc, rot, smooth=True):
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = rot
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob.data.materials.append(mat(m) if isinstance(m, str) else m)
    return ob


def ell(name, loc, r, m, rot=(0, 0, 0), seg=40, rings=20):
    """Elipsoide de radios r=(rx,ry,rz) centrado en loc."""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0)
    bmesh.ops.scale(bm, vec=Vector(r), verts=bm.verts)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    return _link(name, me, m, loc, rot)


def cone(name, base, r1, r2, depth, m, rot=(0, 0, 0), sy=1.0, seg=24):
    """Cono/cilindro con la base en `base`, eje local +Z girado por rot. r1=(rx) base, r2 punta."""
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg,
                          radius1=r1, radius2=r2, depth=depth)
    bmesh.ops.translate(bm, vec=(0, 0, depth / 2), verts=bm.verts)       # base en el origen
    bmesh.ops.scale(bm, vec=Vector((1, sy, 1)), verts=bm.verts)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    return _link(name, me, m, base, rot)


def mirror(fn, **kw):
    """Llama fn(side=+1) y fn(side=-1): +X = izquierda del personaje, -X = derecha."""
    return [fn(s=1, **kw), fn(s=-1, **kw)]


# --------------------------------------------------------------------------
# Medidas principales
# --------------------------------------------------------------------------
HEAD_C = Vector((0, 0.0, 0.70))
HEAD_R = (0.235, 0.205, 0.195)
TORSO_C = Vector((0, 0.0, 0.375))
TORSO_R = (0.178, 0.142, 0.190)


def head_front_y(x, z):
    """y de la superficie frontal de la cabeza en (x,z) (para apoyar detalles)."""
    t = 1 - ((x - HEAD_C.x) / HEAD_R[0]) ** 2 - ((z - HEAD_C.z) / HEAD_R[2]) ** 2
    return HEAD_C.y - HEAD_R[1] * math.sqrt(max(t, 0.0))


def torso_front_y(x, z):
    t = 1 - ((x - TORSO_C.x) / TORSO_R[0]) ** 2 - ((z - TORSO_C.z) / TORSO_R[2]) ** 2
    return TORSO_C.y - TORSO_R[1] * math.sqrt(max(t, 0.0))


# --------------------------------------------------------------------------
# Cabeza
# --------------------------------------------------------------------------
ell("cabeza", HEAD_C, HEAD_R, "naranja")

# Hocico y mejillas crema
ell("hocico", (0, -0.158, 0.632), (0.125, 0.104, 0.088), "crema")
for s in (1, -1):
    ell(f"mejilla_{'L' if s > 0 else 'R'}", (0.140 * s, -0.118, 0.628), (0.092, 0.088, 0.082), "crema")
    ell(f"rubor_{'L' if s > 0 else 'R'}", (0.150 * s, -0.196, 0.640), (0.040, 0.016, 0.040), "naranja")

# Antifaz negro: parche por ojo + puente
for s in (1, -1):
    ell(f"antifaz_{'L' if s > 0 else 'R'}", (0.082 * s, -0.172, 0.722), (0.092, 0.036, 0.072), "negro",
        rot=(0, math.radians(8 * -s), math.radians(0)))
ell("antifaz_puente", (0, -0.186, 0.730), (0.095, 0.030, 0.040), "negro")

# Ojos
for s in (1, -1):
    sd = "L" if s > 0 else "R"
    ell(f"ojo_{sd}", (0.080 * s, -0.188, 0.722), (0.054, 0.032, 0.060), "blanco")
    ell(f"pupila_{sd}", (0.083 * s, -0.212, 0.722), (0.040, 0.022, 0.045), "ojo")
    ell(f"brillo_a_{sd}", (0.094 * s, -0.232, 0.738), (0.013, 0.008, 0.015), "blanco", seg=16, rings=8)
    ell(f"brillo_b_{sd}", (0.070 * s, -0.230, 0.704), (0.007, 0.006, 0.008), "blanco", seg=12, rings=6)
    # cejas / manchas crema sobre el ojo
    ell(f"ceja_{sd}", (0.085 * s, -0.150, 0.802), (0.034, 0.014, 0.017), "crema",
        rot=(0, 0, math.radians(-12 * s)))

# Nariz y boca abierta
ell("nariz", (0, -0.252, 0.668), (0.036, 0.024, 0.026), "ojo")
ell("boca", (0, -0.236, 0.603), (0.060, 0.022, 0.034), "rojo")
ell("lengua", (0, -0.248, 0.590), (0.034, 0.014, 0.018), "rosa")
ell("sonrisa_L", (0.050, -0.240, 0.622), (0.020, 0.008, 0.007), "ojo", rot=(0, math.radians(-25), math.radians(0)))
ell("sonrisa_R", (-0.050, -0.240, 0.622), (0.020, 0.008, 0.007), "ojo", rot=(0, math.radians(25), math.radians(0)))

# Orejas (cono aplanado + interior crema); base sobre la cabeza
for s in (1, -1):
    sd = "L" if s > 0 else "R"
    rot = Euler((math.radians(-8), math.radians(22 * s), 0), "XYZ")
    base = Vector((0.140 * s, -0.005, 0.815))
    cone(f"oreja_{sd}", base, 0.100, 0.004, 0.255, "naranja", rot=rot, sy=0.55)
    inner_base = base + rot.to_matrix() @ Vector((-0.002 * s, -0.036, 0.030))
    cone(f"oreja_int_{sd}", inner_base, 0.066, 0.004, 0.185, "tan", rot=rot, sy=0.38)

# --------------------------------------------------------------------------
# Cuerpo: hoodie
# --------------------------------------------------------------------------
ell("torso", TORSO_C, TORSO_R, "negro")
ell("torso_bajo", (0, 0.0, 0.265), (0.168, 0.136, 0.095), "negro")
ell("dobladillo", (0, 0.0, 0.212), (0.150, 0.122, 0.030), "azul_osc")
ell("cuello", (0, -0.005, 0.540), (0.150, 0.120, 0.060), "negro")
ell("capucha", (0, 0.095, 0.545), (0.165, 0.095, 0.085), "negro", rot=(math.radians(-15), 0, 0))
ell("capucha_borde", (0, 0.075, 0.585), (0.150, 0.075, 0.040), "azul_osc", rot=(math.radians(-15), 0, 0))
ell("bolsillo", (0, -0.110, 0.268), (0.090, 0.026, 0.040), "azul_osc")

# Cordones y medallón
for s in (1, -1):
    sd = "L" if s > 0 else "R"
    x = 0.048 * s
    cone(f"cordon_{sd}", (x, torso_front_y(x, 0.46) - 0.006, 0.372), 0.008, 0.008, 0.10, "naranja_osc",
         rot=(0, 0, 0), seg=10)
    ell(f"cordon_punta_{sd}", (x, torso_front_y(x, 0.37) - 0.006, 0.366), (0.014, 0.012, 0.020), "naranja")
    ell(f"cordon_cuello_{sd}", (x, torso_front_y(x, 0.48) - 0.004, 0.485), (0.017, 0.012, 0.020), "naranja")
ell("medallon", (0, torso_front_y(0, 0.425) - 0.010, 0.425), (0.042, 0.012, 0.042), "naranja")

# Brazos (mangas) + puños + manos
for s in (1, -1):
    sd = "L" if s > 0 else "R"
    rot = (0, math.radians(-12 * s), 0)
    ell(f"manga_{sd}", (0.205 * s, 0.0, 0.360), (0.060, 0.066, 0.130), "negro", rot=rot)
    ell(f"punio_{sd}", (0.226 * s, 0.0, 0.248), (0.063, 0.069, 0.026), "azul_osc", rot=rot)
    ell(f"punio_naranja_{sd}", (0.232 * s, -0.004, 0.228), (0.054, 0.060, 0.022), "naranja", rot=rot)
    ell(f"mano_{sd}", (0.237 * s, -0.012, 0.200), (0.054, 0.054, 0.056), "crema", rot=rot)

# --------------------------------------------------------------------------
# Piernas, patas
# --------------------------------------------------------------------------
for s in (1, -1):
    sd = "L" if s > 0 else "R"
    ell(f"pierna_{sd}", (0.080 * s, 0.0, 0.115), (0.072, 0.074, 0.125), "naranja")
    ell(f"pata_{sd}", (0.080 * s, -0.040, 0.040), (0.086, 0.115, 0.042), "crema")
    for k, dx in enumerate((-0.026, 0.026)):
        ell(f"dedo_{sd}{k}", (0.080 * s + dx, -0.146, 0.052), (0.0045, 0.012, 0.026), "tan",
            rot=(0, 0, 0), seg=12, rings=8)

# --------------------------------------------------------------------------
# Cola esponjosa (cadena de elipsoides) con punta crema y "llamas"
# --------------------------------------------------------------------------
TAIL_C = Vector((0.0, 0.225, 0.285))
TAIL_ROT = Euler((math.radians(-42), 0, 0), "XYZ")
TAIL_DIR = TAIL_ROT.to_matrix() @ Vector((0, 0, 1))
ell("cola", TAIL_C, (0.096, 0.108, 0.185), "naranja", rot=TAIL_ROT)
ell("cola_punta", TAIL_C + TAIL_DIR * 0.135, (0.094, 0.104, 0.085), "crema", rot=TAIL_ROT)
for i, dx in enumerate((-0.042, 0.0, 0.042)):
    cone(f"cola_flama_{i}", TAIL_C + TAIL_DIR * (0.075 + 0.0) + Vector((dx, 0, 0)), 0.028, 0.002,
         0.075 + 0.02 * (i == 1), "naranja", rot=TAIL_ROT, sy=1.0, seg=12)

# --------------------------------------------------------------------------
# Texto del hoodie (curvado sobre el torso) y medallón
# --------------------------------------------------------------------------
dg = bpy.context.evaluated_depsgraph_get()


def text_mesh(name, body, size, center, color, wrap_fn=None, extrude=0.006):
    tcu = bpy.data.curves.new(name, "FONT")
    tcu.body = body
    tcu.size = size
    tcu.align_x = "CENTER"
    tcu.align_y = "CENTER"
    tcu.extrude = extrude
    tob = bpy.data.objects.new(name, tcu)
    coll.objects.link(tob)
    tob.rotation_euler = (math.pi / 2, 0, 0)       # texto de pie, mirando a -Y
    tob.location = center
    bpy.context.view_layer.update()
    ev = tob.evaluated_get(bpy.context.evaluated_depsgraph_get())
    me = bpy.data.meshes.new_from_object(ev)
    me.transform(tob.matrix_world)
    bpy.data.objects.remove(tob)
    bpy.data.curves.remove(tcu)
    if wrap_fn:
        for v in me.vertices:
            v.co.y += wrap_fn(v.co.x, v.co.z) - center[1]
    return _link(name, me, color, (0, 0, 0), (0, 0, 0), smooth=False)


text_mesh("texto_hoodie", "ZÖKY·SÓ", 0.050, (0, -0.130, 0.335), "blanco",
          wrap_fn=lambda x, z: torso_front_y(x, z) - 0.003, extrude=0.007)
text_mesh("texto_medallon", "Zoky", 0.024, (0, -0.164, 0.425), "negro", extrude=0.004)

# --------------------------------------------------------------------------
# Suelo, luces, cámara
# --------------------------------------------------------------------------
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=6)
me = bpy.data.meshes.new("piso")
bm.to_mesh(me)
bm.free()
floor_m = bpy.data.materials.new("piso")
floor_m.use_nodes = True
fb = floor_m.node_tree.nodes["Principled BSDF"]
fb.inputs["Base Color"].default_value = hexc("#DADADA")
fb.inputs["Roughness"].default_value = 0.9
_link("piso", me, floor_m, (0, 0, 0), (0, 0, 0), smooth=False)

world = bpy.data.worlds.new("w")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = hexc("#DADADA")
bg.inputs["Strength"].default_value = 0.55
scene.world = world


def luz(name, kind, loc, energy, size=1.0, target=(0, 0, 0.5)):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    if kind == "AREA":
        ld.size = size
    elif kind == "SUN":
        ld.angle = math.radians(8)
    ob = bpy.data.objects.new(name, ld)
    coll.objects.link(ob)
    ob.location = loc
    d = Vector(target) - Vector(loc)
    ob.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return ob


luz("sol", "SUN", (-2.5, -3.0, 4.0), 1.3)
luz("relleno", "AREA", (2.5, -2.5, 1.6), 90, size=3.0)
luz("contra", "AREA", (0.0, 3.0, 2.2), 60, size=3.0)

cam_d = bpy.data.cameras.new("cam")
cam_d.lens = 80
cam = bpy.data.objects.new("cam", cam_d)
coll.objects.link(cam)
scene.camera = cam
target = bpy.data.objects.new("objetivo", None)
coll.objects.link(target)
target.location = (0, 0, 0.52)
tc = cam.constraints.new("TRACK_TO")
tc.target = target
tc.track_axis = "TRACK_NEGATIVE_Z"
tc.up_axis = "UP_Y"

# --------------------------------------------------------------------------
# Render: Cycles en CPU + contorno Freestyle
# --------------------------------------------------------------------------
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = 700, 900
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = True
scene.view_settings.view_transform = "Standard"

scene.render.use_freestyle = True
scene.render.line_thickness_mode = "ABSOLUTE"
scene.render.line_thickness = 1.6
vl = bpy.context.view_layer
vl.use_freestyle = True
fs = vl.freestyle_settings
for old in list(fs.linesets):
    fs.linesets.remove(old)
ls = fs.linesets.new("contorno")
ls.select_silhouette = True
ls.select_border = False
ls.select_crease = True
ls.select_by_collection = True
ls.collection = coll
lsty = bpy.data.linestyles.new("contorno")
lsty.color = hexc("#2A1405")[:3]
lsty.thickness = 1.6
ls.linestyle = lsty

# Texto, brillos, dedos, sonrisa, piso, luces y cámara quedan fuera del contorno
det = bpy.data.collections.new("Zoky_sin_contorno")
scene.collection.children.link(det)
for o in list(coll.objects):
    if o.name.startswith(("texto_", "brillo_", "dedo_", "sonrisa_", "piso", "sol", "relleno", "contra", "cam", "objetivo")):
        coll.objects.unlink(o)
        det.objects.link(o)


# Que el piso no dibuje contorno
bpy.data.objects["piso"].is_shadow_catcher = True
for o in coll.objects:
    if o.type == "MESH" and o.name == "piso":
        o.hide_viewport = False


def vista(nombre, loc, tgt=(0, 0, 0.52), res=None, lens=80):
    cam.location = loc
    target.location = tgt
    cam_d.lens = lens
    if res:
        scene.render.resolution_x, scene.render.resolution_y = res
    scene.render.filepath = os.path.join(OUT, nombre + ".png")
    bpy.ops.render.render(write_still=True)
    print("render:", scene.render.filepath)


if "--no-render" not in sys.argv:
    vista("frente", (0, -3.6, 0.55))
    vista("lateral", (-3.6, 0, 0.55))
    vista("trasera", (0, 3.6, 0.55))
    vista("tres_cuartos", (-2.1, -2.7, 0.85))
    bpy.data.objects["piso"].hide_render = True          # vista superior sin piso ni sombra
    vista("superior", (0, -0.4, 4.2), tgt=(0, 0.1, 0.5), res=(700, 700), lens=70)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "zoky.blend"))
try:
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, "zoky.glb"), export_format="GLB")
except Exception as e:                                        # noqa
    print("glb no exportado:", e)
