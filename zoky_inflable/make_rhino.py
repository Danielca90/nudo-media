#!/usr/bin/env python3
"""
make_rhino.py - export the inflatable design for Rhino 7 (Mac or Windows).

    python3 make_rhino.py <designer_out_folder> <panels.obj> <out_folder> [--height-mm 600]

Reads:  <designer_out>/patterns_all.svg   flat cut patterns (mm)
        <designer_out>/simulated.obj      simulated inflated shape (cm)
        <panels.obj>                      target mesh, one `g` group per panel
Writes: zoky_inflable_rhino7.3dm   everything, saved in Rhino 7 file format, units mm
        patrones_corte.dxf         flat patterns only (CUT / SEAL / MARKS / LABELS layers)
        objetivo_paneles_mm.obj    target mesh, one group per panel, mm
        inflado_simulado_mm.obj    simulated inflated shape, mm

Needs: pip install rhino3dm ezdxf
"""
import argparse
import colorsys
import math
import os
import re
import sys

import ezdxf
import numpy as np
import rhino3dm as r3


def load_obj_groups(path):
    V, groups, cur = [], {}, "default"
    order = []
    for line in open(path):
        p = line.split()
        if not p:
            continue
        if p[0] == "v":
            V.append([float(t) for t in p[1:4]])
        elif p[0] in ("g", "o"):
            cur = " ".join(p[1:]) or "default"
        elif p[0] == "f":
            idx = [int(t.split("/")[0]) - 1 for t in p[1:]]
            if cur not in groups:
                groups[cur] = []
                order.append(cur)
            for k in range(1, len(idx) - 1):
                groups[cur].append([idx[0], idx[k], idx[k + 1]])
    return np.array(V), {g: np.array(groups[g]) for g in order}


def write_obj(path, V, groups):
    with open(path, "w") as fh:
        fh.write("# exported for Rhino, units: mm\n")
        for v in V:
            fh.write(f"v {v[0]:.4f} {v[1]:.4f} {v[2]:.4f}\n")
        for g, F in groups.items():
            fh.write(f"g {g}\n")
            for a, b, c in F + 1:
                fh.write(f"f {a} {b} {c}\n")


def parse_svg(path):
    txt = open(path).read()
    H = float(re.search(r'viewBox="0 0 [\d.]+ ([\d.]+)"', txt).group(1))
    cut, seal, lines, circles, texts, green = [], [], [], [], [], []
    for m in re.finditer(r"<path d=\"([^\"]+)\"([^>]*)/>", txt):
        pts = [tuple(map(float, p.split(","))) for p in re.findall(r"[-\d.]+,[-\d.]+", m.group(1))]
        (seal if "#0000ff" in m.group(2) else cut).append(pts)
    for m in re.finditer(r"<line x1=\"([-\d.]+)\" y1=\"([-\d.]+)\" x2=\"([-\d.]+)\" y2=\"([-\d.]+)\"[^>]*stroke=\"(#[0-9a-f]+)\"", txt):
        x1, y1, x2, y2 = map(float, m.groups()[:4])
        (green if m.group(5) == "#00a000" else lines).append(((x1, y1), (x2, y2)))
    for m in re.finditer(r"<circle cx=\"([-\d.]+)\" cy=\"([-\d.]+)\" r=\"([-\d.]+)\"[^>]*stroke=\"(#[0-9a-f]+)\"", txt):
        circles.append((float(m.group(1)), float(m.group(2)), float(m.group(3)), m.group(4)))
    for m in re.finditer(r"<text x=\"([-\d.]+)\" y=\"([-\d.]+)\" font-size=\"([\d.]+)\"[^>]*>([^<]*)</text>", txt):
        t = m.group(4).replace("&#8594;", "->").replace("→", "->")
        texts.append((float(m.group(1)), float(m.group(2)), float(m.group(3)), t))
    return H, cut, seal, lines, circles, texts, green


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("designer_out")
    ap.add_argument("panels_obj")
    ap.add_argument("out")
    ap.add_argument("--height-mm", type=float, default=600.0)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    # ------------------------------------------------------------ meshes (mm)
    Vt, Gt = load_obj_groups(a.panels_obj)
    ext = np.ptp(Vt, axis=0).max()
    Vt = (Vt - Vt.mean(0)) * (a.height_mm / ext)
    Vt[:, 2] -= Vt[:, 2].min()
    write_obj(os.path.join(a.out, "objetivo_paneles_mm.obj"), Vt, Gt)

    Vs, Gs = load_obj_groups(os.path.join(a.designer_out, "simulated.obj"))
    Vs = Vs * 10.0                                     # cm -> mm
    Vs[:, 2] -= Vs[:, 2].min()
    Vs[:, 0] += a.height_mm * 0.9                      # placed next to the target
    write_obj(os.path.join(a.out, "inflado_simulado_mm.obj"), Vs, Gs)

    # ------------------------------------------------------------ patterns
    H, cut, seal, lines, circles, texts, green = parse_svg(os.path.join(a.designer_out, "patterns_all.svg"))
    fy = lambda y: H - y                               # SVG y is down, Rhino y is up

    # DXF
    doc = ezdxf.new("R2010", setup=True)
    doc.units = ezdxf.units.MM
    doc.layers.add("CUT", color=1)
    doc.layers.add("SEAL", color=5, linetype="DASHED")
    doc.layers.add("MARKS", color=7)
    doc.layers.add("INTERNAL", color=3)
    doc.layers.add("LABELS", color=8)
    msp = doc.modelspace()
    for pts in cut:
        msp.add_lwpolyline([(x, fy(y)) for x, y in pts], close=True, dxfattribs={"layer": "CUT"})
    for pts in seal:
        msp.add_lwpolyline([(x, fy(y)) for x, y in pts], close=True, dxfattribs={"layer": "SEAL"})
    for (x1, y1), (x2, y2) in lines:
        msp.add_line((x1, fy(y1)), (x2, fy(y2)), dxfattribs={"layer": "MARKS"})
    for (x1, y1), (x2, y2) in green:
        msp.add_line((x1, fy(y1)), (x2, fy(y2)), dxfattribs={"layer": "INTERNAL"})
    for cx, cy, r, col in circles:
        msp.add_circle((cx, fy(cy)), r, dxfattribs={"layer": "CUT" if col == "#ff0000" else "MARKS"})
    for x, y, sz, t in texts:
        msp.add_text(t, height=max(sz, 2.0), dxfattribs={"layer": "LABELS"}).set_placement((x, fy(y)))
    doc.saveas(os.path.join(a.out, "patrones_corte.dxf"))

    # ------------------------------------------------------------ 3dm (Rhino 7)
    model = r3.File3dm()
    model.Settings.ModelUnitSystem = r3.UnitSystem.Millimeters

    def layer(name, rgb):
        L = r3.Layer()
        L.Name = name
        L.Color = (rgb[0], rgb[1], rgb[2], 255)
        return model.Layers.Add(L)

    def attrs(idx):
        at = r3.ObjectAttributes()
        at.LayerIndex = idx
        return at

    li_cut = layer("PATRONES::CORTE", (255, 0, 0))
    li_seal = layer("PATRONES::COSTURA", (0, 0, 255))
    li_mark = layer("PATRONES::PIQUETES", (0, 0, 0))
    li_int = layer("PATRONES::INTERNO", (0, 160, 0))
    li_lab = layer("PATRONES::ETIQUETAS", (120, 120, 120))

    def poly(pts, close):
        # (Polyline.ToPolylineCurve crashes in rhino3dm 8.x; PolylineCurve(Point3dList) is safe)
        pl = r3.Point3dList()
        for x, y in pts:
            pl.Add(x, fy(y), 0.0)
        if close:
            pl.Add(pts[0][0], fy(pts[0][1]), 0.0)
        return r3.PolylineCurve(pl)

    for pts in cut:
        model.Objects.AddCurve(poly(pts, True), attrs(li_cut))
    for pts in seal:
        model.Objects.AddCurve(poly(pts, True), attrs(li_seal))
    for (p1, p2) in lines:
        model.Objects.AddCurve(poly([p1, p2], False), attrs(li_mark))
    for (p1, p2) in green:
        model.Objects.AddCurve(poly([p1, p2], False), attrs(li_int))
    for cx, cy, r, col in circles:
        c = r3.Circle(r3.Point3d(cx, fy(cy), 0), r)
        model.Objects.AddCurve(c.ToNurbsCurve(), attrs(li_cut if col == "#ff0000" else li_mark))
    for x, y, sz, t in texts:
        if sz >= 8:                                   # panel names only (big text)
            model.Objects.AddTextDot(t, r3.Point3d(x, fy(y), 0), attrs(li_lab))

    def add_mesh(V, F, li):
        m = r3.Mesh()
        for v in V:
            m.Vertices.Add(float(v[0]), float(v[1]), float(v[2]))
        for f in F:
            m.Faces.AddFace(int(f[0]), int(f[1]), int(f[2]))
        m.Normals.ComputeNormals()
        m.Compact()
        model.Objects.AddMesh(m, attrs(li))

    n = len(Gt)
    for i, (g, F) in enumerate(Gt.items()):
        r, gg, b = [int(255 * c) for c in colorsys.hsv_to_rgb(i / max(n, 1), 0.45, 0.95)]
        used = np.unique(F)
        remap = -np.ones(len(Vt), int)
        remap[used] = np.arange(len(used))
        add_mesh(Vt[used], remap[F], layer(f"OBJETIVO::{g}", (r, gg, b)))
    li_sim = layer("INFLADO_SIMULADO", (247, 147, 30))
    allF = np.concatenate(list(Gs.values()))
    add_mesh(Vs, allF, li_sim)

    out3dm = os.path.join(a.out, "zoky_inflable_rhino7.3dm")
    ok = model.Write(out3dm, 7)
    print("3dm written:", ok, out3dm)

    # ------------------------------------------------------------ verify
    back = r3.File3dm.Read(out3dm)
    kinds = {}
    for ob in back.Objects:
        k = type(ob.Geometry).__name__
        kinds[k] = kinds.get(k, 0) + 1
    print("3dm read-back:", kinds, "| layers:", len(back.Layers), "| units:", back.Settings.ModelUnitSystem)
    d2 = ezdxf.readfile(os.path.join(a.out, "patrones_corte.dxf"))
    cnt = {}
    for e in d2.modelspace():
        cnt[e.dxftype()] = cnt.get(e.dxftype(), 0) + 1
    print("dxf read-back:", cnt)


if __name__ == "__main__":
    main()
