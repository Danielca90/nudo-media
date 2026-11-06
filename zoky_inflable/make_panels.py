#!/usr/bin/env python3
"""
make_panels.py - Stage 2: split a closed triangle mesh into DISK-SHAPED panels
for inflatable_designer.py (geodesic Voronoi regions + repair), write an OBJ with one
group `g` per panel.

    python3 make_panels.py simple.obj panels.obj [n_panels] [smooth_iters]

Regions grow from farthest-point seeds over the surface (Dijkstra on edge lengths).
Then each region is checked the same way the designer checks it (one connected piece, one
boundary loop, Euler characteristic 1, no pinch points). Regions that fail are merged into
the neighbour they share the longest border with, until all panels are valid disks.
"""
import sys
from collections import defaultdict
import heapq
import numpy as np


def load(path):
    V, F = [], []
    for line in open(path):
        p = line.split()
        if not p:
            continue
        if p[0] == "v":
            V.append([float(t) for t in p[1:4]])
        elif p[0] == "f":
            idx = [int(t.split("/")[0]) - 1 for t in p[1:]]
            for k in range(1, len(idx) - 1):
                F.append([idx[0], idx[k], idx[k + 1]])
    return np.array(V), np.array(F)


def weld(V, F):
    key = np.round(V / (np.ptp(V, axis=0).max() * 1e-6)).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    inv = inv.ravel()
    return V[first], inv[F]


def dijkstra(V, adj, seeds):
    """Multi-source geodesic-ish distance over the edge graph; returns (dist, owner)."""
    n = len(V)
    dist = np.full(n, np.inf)
    owner = -np.ones(n, int)
    pq = []
    for k, s in enumerate(seeds):
        dist[s] = 0
        owner[s] = k
        pq.append((0.0, s, k))
    heapq.heapify(pq)
    while pq:
        d, u, k = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for w in adj[u]:
            nd = d + np.linalg.norm(V[u] - V[w])
            if nd < dist[w]:
                dist[w] = nd
                owner[w] = k
                heapq.heappush(pq, (nd, w, k))
    return dist, owner


def farthest_seeds(V, adj, k, first):
    seeds = [first]
    dist, _ = dijkstra(V, adj, seeds)
    while len(seeds) < k:
        s = int(np.argmax(dist))
        seeds.append(s)
        d2, _ = dijkstra(V, adj, [s])
        dist = np.minimum(dist, d2)
    return seeds


def region_ok(F, lab, r):
    """Mirror of the checks in inflatable_designer.Pattern. Returns (ok, reason)."""
    faces = np.where(lab == r)[0]
    if len(faces) == 0:
        return False, "empty"
    he = {}
    for f in range(len(F)):
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            he[(u, v)] = f
    nxt = {}
    for f in faces:
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            if lab[he[(v, u)]] != r:
                if u in nxt:
                    return False, "pinch"
                nxt[u] = v
    if not nxt:
        return False, "whole surface"
    start = min(nxt)
    loop = [start]
    while True:
        n = nxt[loop[-1]]
        if n == start:
            break
        loop.append(n)
        if len(loop) > len(nxt):
            break
    if len(loop) != len(nxt):
        return False, "several boundaries"
    pv = np.unique(F[faces])
    edges = {tuple(sorted(e)) for f in faces for e in ((F[f, 0], F[f, 1]), (F[f, 1], F[f, 2]), (F[f, 2], F[f, 0]))}
    chi = len(pv) - len(edges) + len(faces)
    if chi != 1:
        return False, f"euler {chi}"
    return True, ""


def neighbours(F, lab):
    he = {}
    for f in range(len(F)):
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            he[(u, v)] = f
    nb = defaultdict(lambda: defaultdict(int))
    for (u, v), f in he.items():
        g = he[(v, u)]
        if lab[f] != lab[g]:
            nb[lab[f]][lab[g]] += 1
    return nb


def components(F, lab, r):
    faces = set(np.where(lab == r)[0])
    he = {}
    for f in range(len(F)):
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            he[(u, v)] = f
    comps = []
    while faces:
        s = faces.pop()
        comp, st = [s], [s]
        while st:
            f = st.pop()
            a, b, c = F[f]
            for u, v in ((a, b), (b, c), (c, a)):
                g = he[(v, u)]
                if g in faces:
                    faces.remove(g)
                    comp.append(g)
                    st.append(g)
        comps.append(comp)
    return comps


def main():
    src, dst = sys.argv[1], sys.argv[2]
    k = int(sys.argv[3]) if len(sys.argv) > 3 else 12
    smooth_iters = int(sys.argv[4]) if len(sys.argv) > 4 else 8
    V, F = load(src)
    V, F = weld(V, F)
    adj = defaultdict(set)
    for a, b, c in F:
        adj[a] |= {b, c}
        adj[b] |= {a, c}
        adj[c] |= {a, b}
    top = int(np.argmax(V[:, 2]))
    seeds = farthest_seeds(V, adj, k, top)
    _, own = dijkstra(V, adj, seeds)
    lab = np.array([np.bincount(own[f]).argmax() if len(set(own[f])) < 3 else own[f][0] for f in F])
    print(f"{len(V)} vertices, {len(F)} triangles, {k} seeds")

    # smooth the region borders: a triangle whose neighbours mostly belong to another region
    # joins that region (removes the zig-zag / spikes that would show up in the flat patterns)
    he0 = {}
    for f in range(len(F)):
        a, b, c = F[f]
        for u, v in ((a, b), (b, c), (c, a)):
            he0[(u, v)] = f
    nbf = [[he0[(F[f][(i + 1) % 3], F[f][i])] for i in range(3)] for f in range(len(F))]
    for _ in range(smooth_iters):
        new_lab = lab.copy()
        for f in range(len(F)):
            ls = [lab[g] for g in nbf[f]]
            for cand in set(ls):
                if cand != lab[f] and ls.count(cand) >= 2:
                    new_lab[f] = cand
        # also vertex-based pass: pinch vertices are smoothed by the repair stage below
        lab = new_lab

    for it in range(200):
        changed = False
        # 1) reconnect stray components to their neighbours
        for r in sorted(set(lab)):
            comps = components(F, lab, r)
            if len(comps) > 1:
                comps.sort(key=len, reverse=True)
                nb = neighbours(F, lab)
                for c in comps[1:]:
                    cl = np.zeros(len(F), bool)
                    cl[c] = True
                    cnt = defaultdict(int)
                    he = {}
                    for f in range(len(F)):
                        a, b, cc = F[f]
                        for u, v in ((a, b), (b, cc), (cc, a)):
                            he[(u, v)] = f
                    for f in c:
                        a, b, cc = F[f]
                        for u, v in ((a, b), (b, cc), (cc, a)):
                            g = he[(v, u)]
                            if lab[g] != r:
                                cnt[lab[g]] += 1
                    lab[c] = max(cnt, key=cnt.get)
                changed = True
        if changed:
            continue
        # 2) merge invalid regions into their longest-border neighbour
        bad = [(r, why) for r in sorted(set(lab)) for ok, why in [region_ok(F, lab, r)] if not ok]
        if not bad:
            break
        nb = neighbours(F, lab)
        r, why = min(bad, key=lambda t: int((lab == t[0]).sum()))
        tgt = max(nb[r], key=nb[r].get)
        print(f"  merging region {r} ({why}, {int((lab == r).sum())} tris) into {tgt}")
        lab[lab == r] = tgt
    ids = sorted(set(lab))
    print(f"{len(ids)} valid disk panels:", [int((lab == r).sum()) for r in ids])
    with open(dst, "w") as fh:
        for v in V:
            fh.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
        for n, r in enumerate(ids, 1):
            fh.write(f"g panel{n}\n")
            for f in np.where(lab == r)[0]:
                a, b, c = F[f] + 1
                fh.write(f"f {a} {b} {c}\n")


if __name__ == "__main__":
    main()
