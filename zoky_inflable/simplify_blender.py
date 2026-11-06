"""Stage 1 (Blender): Meshy OBJ -> chunky closed low-poly OBJ (Z up, facing -Y)."""
import bpy, sys, os, bmesh
obj_path, out_obj, voxel, target = sys.argv[sys.argv.index("--")+1:][:4]
voxel, target = float(voxel), int(target)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath=obj_path)
ob = [o for o in bpy.context.scene.objects if o.type == "MESH"][0]
bpy.context.view_layer.objects.active = ob
ob.select_set(True)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for m in list(ob.data.materials): pass
ob.data.materials.clear()
def vol(o):
    bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.triangulate(bm, faces=bm.faces)
    v = sum(f.verts[0].co.dot(f.verts[1].co.cross(f.verts[2].co)) for f in bm.faces)/6; bm.free(); return v
print("orig dims", tuple(round(d,3) for d in ob.dimensions), "tris", len(ob.data.polygons))
# 1) fewer polys first so the remesh is fast
dm = ob.modifiers.new("d0", "DECIMATE"); dm.ratio = 0.05
bpy.ops.object.modifier_apply(modifier="d0")
v0 = vol(ob)
# 2) voxel remesh = one closed, clean, chunky surface (fine details disappear)
ob.data.remesh_voxel_size = voxel
bpy.ops.object.voxel_remesh()
# 3) round it off like a balloon, keeping the volume
sm = ob.modifiers.new("s", "SMOOTH"); sm.factor = 0.7; sm.iterations = 12
bpy.ops.object.modifier_apply(modifier="s")
v1 = vol(ob)
# restore the volume lost by smoothing (inflated things are plump)
import mathutils
if v1 > 0:
    k = (v0 / v1) ** (1/3)
    c = sum((v.co for v in ob.data.vertices), mathutils.Vector()) / len(ob.data.vertices)
    for v in ob.data.vertices: v.co = c + (v.co - c) * k
tris = sum(len(p.vertices)-2 for p in ob.data.polygons)
if target > 0:
    dm = ob.modifiers.new("d1", "DECIMATE"); dm.ratio = min(1.0, target / tris)
    bpy.ops.object.modifier_apply(modifier="d1")
bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.triangulate(bm, faces=bm.faces)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bm.to_mesh(ob.data); 
nm = sum(1 for e in bm.edges if not e.is_manifold); print("non-manifold edges:", nm, "tris:", len(bm.faces), "verts:", len(bm.verts)); bm.free()
print("vol ratio", v1/v0, "final dims", tuple(round(d,3) for d in ob.dimensions))
bpy.ops.wm.obj_export(filepath=out_obj, export_materials=False, export_uv=False, export_normals=False,
                      forward_axis="Y", up_axis="Z", export_selected_objects=True)
