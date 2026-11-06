#!/usr/bin/env python3
"""
auto_seams.py - automatic FIRST seam layout for inflatable_designer.py

In "Designing Inflatable Structures" (Skouras et al. 2014) a designer sketches the seams and the
optimizer refines the panel shapes. This script plays the designer for a closed triangle mesh,
following the rules that the paper's examples (Teddy 17 panels, Fox 22, Elephant 40, Tentacle 21),
Julius et al. 2005 (D-Charts) and Jao et al. 2015 (appearance-aware seams) share:

  1. PART SEAMS ON CONCAVE CREASES. Limbs, ears, head and torso are separated where the surface
     folds inward (limb/torso joints). Done with a geodesic Voronoi partition whose edge costs
     are raised across concave edges, so borders settle in the valleys.
  2. COMPACT PATCHES. Every panel must be small and round: a region is bisected (two geodesic
     seeds at the ends of its longest dimension) while it is too big, or too elongated
     (geodesic diameter^2 / area large). Long tubes therefore get ring seams, fat parts get
     front/back style cuts.
  3. NO ZIG-ZAGS. Region borders are smoothed (triangles follow the majority of their neighbours).
  4. VALID DISKS. Every panel must be a single piece, topologically a disk with one boundary loop
     (the checks of inflatable_designer.Pattern); invalid ones are merged into a neighbour.

    python3 auto_seams.py mesh.obj panels.obj [--panels 28] [--preview seams.png]

Writes an OBJ with one group `g panelN` per panel (read by inflatable_designer.py --input).
Mesh orientation is only used for the preview.
"""
import argparse
import heapq
import math
import sys
from collections import defaultdict

import numpy as np

from make_panels import components, load, neighbours, region_ok, weld


# ----------------------------------------------------------------------------
# Mesh helpers
# ----------------------------------------------------------------------------

def keep_largest(V, F):
    """Drop floating specks: keep only the largest connected piece (and reindex)."""
    adj = defaultdict(set)
    for a, b, c in F:
        adj[a] |= {b, c}
        adj[b] |= {a, c}
        adj[c] |= {a, b}
    seen, best = set(), []
    for v in adj:
        if v in seen:
            continue
        comp, st = [v], [v]
        seen.add(v)
        while st:
            x = st.pop()
            for w in adj[x]:
                if w not in seen:
                    seen.add(w)
                    comp.append(w)
                    st.append(w)
        if len(comp) > len(best):
            best = comp
    keep = np.zeros(len(V), bool)
    keep[best] = True
    if keep.all():
        return V, F
    print(f"dropped {int((~keep).sum())} vertices of floating pieces")
    remap = -np.ones(len(V), int)
    remap[keep] = np.arange(keep.sum())
    F2 = remap[F]
    return V[keep], F2[(F2 >= 0).all(axis=1)]


def build(V, F):
    he = {}
    for f in range(len(F)):
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            he[(u, v)] = f
    nbf = [[he[(F[f][(i + 1) % 3], F[f][i])] for i in range(3)] for f in range(len(F))]
    P = V[F]
    cen = P.mean(1)
    nrm = np.cross(P[:, 1] - P[:, 0], P[:, 2] - P[:, 0])
    area = 0.5 * np.linalg.norm(nrm, axis=1)
    nrm /= np.linalg.norm(nrm, axis=1)[:, None] + 1e-20
    if np.einsum("ij,ij->i", cen - cen.mean(0), nrm).mean() < 0:      # outward orientation
        F[:] = F[:, ::-1]
        return build(V, F)
    return he, nbf, cen, nrm, area


def concave_edge_angle(V, F, he, cen, nrm):
    """Angle between face normals across each edge, only when the edge is concave (valley)."""
    conc = {}
    for (u, v), f in he.items():
        g = he[(v, u)]
        if u < v:
            ang = math.acos(max(-1.0, min(1.0, float(nrm[f] @ nrm[g]))))
            concave = float((cen[g] - cen[f]) @ nrm[f]) > 1e-9
            conc[(u, v)] = conc[(v, u)] = ang if concave else 0.0
    return conc


def graph(V, F, conc=None, w=0.0, faces=None):
    """Weighted vertex graph (optionally restricted to some faces)."""
    adj = defaultdict(dict)
    it = range(len(F)) if faces is None else faces
    for f in it:
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            l = float(np.linalg.norm(V[u] - V[v]))
            if conc is not None:
                l *= 1.0 + w * conc.get((u, v), 0.0)
            adj[u][v] = l
            adj[v][u] = l
    return adj


def dijkstra(adj, seeds):
    dist, owner = {}, {}
    pq = []
    for k, s in enumerate(seeds):
        dist[s], owner[s] = 0.0, k
        pq.append((0.0, s, k))
    heapq.heapify(pq)
    while pq:
        d, u, k = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for w, l in adj[u].items():
            nd = d + l
            if nd < dist.get(w, 1e300):
                dist[w], owner[w] = nd, k
                heapq.heappush(pq, (nd, w, k))
    return dist, owner


def faces_from_vertex_owner(F, owner, K):
    lab = np.zeros(len(F), int)
    for f, (a, b, c) in enumerate(F):
        o = [owner[a], owner[b], owner[c]]
        lab[f] = max(set(o), key=o.count) if len(set(o)) < 3 else o[0]
    return lab


# ----------------------------------------------------------------------------
# 1) parts: seeds at the extremities, borders pushed into concave valleys
# ----------------------------------------------------------------------------

def farthest_seeds(V, F, k, first):
    adj = graph(V, F)
    seeds = [first]
    dist, _ = dijkstra(adj, seeds)
    while len(seeds) < k:
        s = max(dist, key=dist.get)
        seeds.append(s)
        d2, _ = dijkstra(adj, [s])
        dist = {v: min(dist[v], d2[v]) for v in dist}
    return seeds


def split_parts(V, F, conc, k_parts, valley_weight):
    top = int(np.argmax(V[:, 2]))
    seeds = farthest_seeds(V, F, k_parts, top)
    _, owner = dijkstra(graph(V, F, conc, valley_weight), seeds)
    return faces_from_vertex_owner(F, owner, k_parts)


# ----------------------------------------------------------------------------
# 2) compactness: bisect big / elongated regions
# ----------------------------------------------------------------------------

def region_metrics(V, F, faces, area):
    adj = graph(V, F, faces=faces)
    verts = list(adj)
    d0, _ = dijkstra(adj, [verts[0]])
    a = max(d0, key=d0.get)
    da, _ = dijkstra(adj, [a])
    b = max(da, key=da.get)
    diam = da[b]
    A = float(area[faces].sum())
    return adj, a, b, diam, A


def bisect(V, F, faces, area):
    adj, a, b, diam, A = region_metrics(V, F, faces, area)
    _, owner = dijkstra(adj, [a, b])
    side = np.array([max(set([owner[x] for x in F[f]]), key=[owner[x] for x in F[f]].count) for f in faces])
    return faces[side == 0], faces[side == 1]


def refine(V, F, lab, area, a_max, compact_max, n_max, min_tris):
    lab = lab.copy()
    nxt = lab.max() + 1
    for _ in range(400):
        worst, wv = None, 0.0
        for r in sorted(set(lab)):
            faces = np.where(lab == r)[0]
            if len(faces) < 2 * min_tris:
                continue
            _, _, _, diam, A = region_metrics(V, F, faces, area)
            score = max(A / a_max, (diam * diam / A) / compact_max)
            if score > 1.0 and score > wv:
                worst, wv = r, score
        if worst is None or len(set(lab)) >= n_max:
            break
        faces = np.where(lab == worst)[0]
        f0, f1 = bisect(V, F, faces, area)
        if len(f0) < min_tris or len(f1) < min_tris:
            break
        lab[f1] = nxt
        nxt += 1
    return lab


# ----------------------------------------------------------------------------
# 3) smooth borders, 4) enforce valid disks
# ----------------------------------------------------------------------------

def smooth_labels(F, nbf, lab, iters):
    for _ in range(iters):
        new = lab.copy()
        for f in range(len(F)):
            ls = [lab[g] for g in nbf[f]]
            for cand in set(ls):
                if cand != lab[f] and ls.count(cand) >= 2:
                    new[f] = cand
        lab = new
    return lab


def smooth_labels_vertex(F, lab, iters):
    """Stronger border smoothing: a triangle takes the majority label of every triangle that
    touches any of its vertices (about 12 triangles). Removes saw-tooth borders."""
    vf = defaultdict(list)
    for f, tri in enumerate(F):
        for v in tri:
            vf[v].append(f)
    for _ in range(iters):
        new = lab.copy()
        for f, tri in enumerate(F):
            cnt = defaultdict(int)
            for v in tri:
                for g in vf[v]:
                    cnt[lab[g]] += 1
            best = max(cnt, key=cnt.get)
            if best != lab[f] and cnt[best] > 1.25 * cnt.get(lab[f], 0):
                new[f] = best
        lab = new
    return lab


def border_length(V, F, lab):
    he = {}
    for f in range(len(F)):
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            he[(u, v)] = f
    tot = 0.0
    for (u, v), f in he.items():
        if u < v and lab[he[(v, u)]] != lab[f]:
            tot += float(np.linalg.norm(V[u] - V[v]))
    return tot


def make_valid(F, lab):
    for _ in range(400):
        changed = False
        for r in sorted(set(lab)):
            comps = components(F, lab, r)
            if len(comps) > 1:
                comps.sort(key=len, reverse=True)
                he = {}
                for f in range(len(F)):
                    a, b, c = F[f]
                    for u, v in ((a, b), (b, c), (c, a)):
                        he[(u, v)] = f
                for comp in comps[1:]:
                    cnt = defaultdict(int)
                    for f in comp:
                        a, b, c = F[f]
                        for u, v in ((a, b), (b, c), (c, a)):
                            g = he[(v, u)]
                            if lab[g] != r:
                                cnt[lab[g]] += 1
                    lab[comp] = max(cnt, key=cnt.get)
                changed = True
        if changed:
            continue
        bad = [(r, why) for r in sorted(set(lab)) for ok, why in [region_ok(F, lab, r)] if not ok]
        if not bad:
            return lab
        nb = neighbours(F, lab)
        r, why = min(bad, key=lambda t: int((lab == t[0]).sum()))
        tgt = max(nb[r], key=nb[r].get)
        print(f"  merging region {r} ({why}, {int((lab == r).sum())} tris) into {tgt}")
        lab[lab == r] = tgt
    return lab


def absorb_tiny(F, lab, min_tris):
    for _ in range(100):
        sizes = {r: int((lab == r).sum()) for r in set(lab)}
        tiny = [r for r, s in sizes.items() if s < min_tris]
        if not tiny:
            return lab
        r = min(tiny, key=sizes.get)
        nb = neighbours(F, lab)
        if not nb[r]:
            return lab
        lab[lab == r] = max(nb[r], key=nb[r].get)
    return lab


# ----------------------------------------------------------------------------

def preview(V, F, lab, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection
    ids = sorted(set(lab))
    rng = np.random.RandomState(3)
    cols = {r: plt.cm.tab20(i % 20) for i, r in enumerate(ids)}
    fig = plt.figure(figsize=(15, 9))
    lo, hi = V.min(0), V.max(0)
    c, rad = (lo + hi) / 2, (hi - lo).max() / 2 * 1.02
    for k, (el, az) in enumerate(((5, -90), (5, -25), (5, 90))):
        ax = fig.add_subplot(1, 3, k + 1, projection="3d")
        pc = Poly3DCollection(V[F], facecolors=[cols[l] for l in lab], edgecolors=(0, 0, 0, 0.12), linewidths=0.15)
        ax.add_collection3d(pc)
        ax.set_xlim(c[0] - rad * .62, c[0] + rad * .62); ax.set_ylim(c[1] - rad * .62, c[1] + rad * .62); ax.set_zlim(c[2] - rad, c[2] + rad)
        ax.set_box_aspect((.62, .62, 1)); ax.set_axis_off(); ax.view_init(el, az)
    fig.suptitle(f"{len(ids)} panels", fontsize=12)
    fig.tight_layout()
    fig.savefig(path, dpi=100)
    plt.close(fig)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--panels", type=int, default=28, help="target number of panels (default 28)")
    ap.add_argument("--parts", type=int, default=14, help="seeds for the part segmentation (default 14)")
    ap.add_argument("--valley-weight", type=float, default=8.0, help="how strongly seams are pulled into concave valleys")
    ap.add_argument("--compactness", type=float, default=2.6, help="max geodesic diameter^2/area per panel (a disk is 1.27)")
    ap.add_argument("--smooth", type=int, default=6, help="border smoothing passes (default 6)")
    ap.add_argument("--preview", default=None)
    a = ap.parse_args()

    V, F = load(a.src)
    V, F = weld(V, F)
    V, F = keep_largest(V, F)
    he, nbf, cen, nrm, area = build(V, F)
    conc = concave_edge_angle(V, F, he, cen, nrm)
    n_conc = sum(1 for k, v in conc.items() if k[0] < k[1] and v > 0.15)
    print(f"{len(V)} vertices, {len(F)} triangles, {n_conc} strongly concave edges")

    lab = split_parts(V, F, conc, a.parts, a.valley_weight)
    lab = smooth_labels_vertex(F, lab, a.smooth)
    lab = make_valid(F, lab)
    print(f"parts: {len(set(lab))}")

    total = area.sum()
    a_max = 1.35 * total / a.panels
    min_tris = max(25, int(0.18 * len(F) / a.panels))
    lab = refine(V, F, lab, area, a_max, a.compactness, int(1.4 * a.panels), min_tris)
    print(f"border length before smoothing: {border_length(V, F, lab):.2f}")
    lab = smooth_labels_vertex(F, lab, a.smooth)
    print(f"border length after smoothing:  {border_length(V, F, lab):.2f}")
    lab = absorb_tiny(F, lab, min_tris)
    lab = make_valid(F, lab)
    ids = sorted(set(lab))
    sizes = [int((lab == r).sum()) for r in ids]
    print(f"{len(ids)} valid disk panels; triangles per panel: min {min(sizes)} / median {int(np.median(sizes))} / max {max(sizes)}")

    if a.preview:
        preview(V, F, lab, a.preview)
    with open(a.dst, "w") as fh:
        for v in V:
            fh.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
        for n, r in enumerate(ids, 1):
            fh.write(f"g panel{n}\n")
            for f in np.where(lab == r)[0]:
                x, y, z = F[f] + 1
                fh.write(f"f {x} {y} {z}\n")


if __name__ == "__main__":
    main()
