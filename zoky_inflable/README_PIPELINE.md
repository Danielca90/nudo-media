# Meshy model → inflatable patterns → Rhino 7

Run everything in **Terminal on the Mac** (CPython 3.9+). Rhino 7's built-in Python is IronPython 2.7
and can't run these scripts. Keep all the `.py` files below **in one folder** (`auto_seams.py` imports
`make_panels.py`).

```bash
python3 -m pip install numpy scipy matplotlib rhino3dm ezdxf
```

## Files
| File | What it does |
|---|---|
| `inflatable_designer.py` | **The optimizer.** Closed OBJ with one group/material per panel → flat cut patterns (SVG), simulated inflated shape, report. Options: `--size` (cm, largest dimension), `--allowance` (seam, mm), `--sheet-width` (mm), `--iterations`, `--diaphragm z:0.5` (neck), `--flat-cap z:0.1` (flat lid). |
| `simplify_blender.py` | Stage 1, run in Blender: dense Meshy OBJ → chunky closed low-poly OBJ. |
| `auto_seams.py` | Stage 2: automatic first seam layout (30 compact panels). |
| `make_panels.py` | Helpers used by `auto_seams.py` (and the first, plain-Voronoi attempt). |
| `make_rhino.py` | Stage 4: designer output → `.3dm` (Rhino 7 format), DXF, mm OBJs. |

## Pipeline
```bash
# 0) Meshy "OBJ" downloads are really a ZIP: unzip it and use the .obj inside.

# 1) simplify (Blender 4.5, no GUI). Arguments: input.obj output.obj voxel_size target_tris(0 = keep uniform voxel mesh)
blender -b -P simplify_blender.py -- meshy.obj simple.obj 0.05 0

# 2) automatic seams -> OBJ with one group per panel (+ a preview image of the seams)
python3 auto_seams.py simple.obj panels.obj --panels 28 --preview seams.png

# 3) the optimizer (about 2-3 minutes for ~6000 triangles)
python3 inflatable_designer.py --input panels.obj --size 60 --allowance 12 --sheet-width 1500 --iterations 8 --out out

# 4) export for Rhino 7
python3 make_rhino.py out panels.obj rhino
```

To adjust the seams by hand: edit the panels in Blender (one material per panel), export OBJ with
materials, and run step 3 on that file.

## Known limits (v3 demo)
- Best optimizer result is still its first iteration; later iterations don't improve it.
- Flat outlines are serrated (mesh-resolution zig-zag): smooth the curves in Rhino before cutting.
- The simplified mesh loses ears, arms and tail: not cut-ready.
