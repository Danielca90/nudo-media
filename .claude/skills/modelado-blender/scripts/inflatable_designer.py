#!/usr/bin/env python3
"""
inflatable_designer.py  -  Inverse design of inflatable structures
==================================================================

Give it the INFLATED 3D shape you want, split into panels, and it computes the
FLAT pieces you have to cut so that, once sealed together and inflated, they
take that shape. It is an independent, simplified re-implementation of the
idea in "Designing Inflatable Structures" (Skouras et al., SIGGRAPH 2014):

  1. Flatten every panel (conformal flattening + as-rigid-as-possible).
  2. Inflate the sewn panels in a physics simulation that uses a
     tension-field (wrinkle-aware) membrane: the material resists stretching
     but offers no resistance to compression (it wrinkles instead).
  3. Compare the inflated shape with the target and correct the panel
     shapes; repeat until the inflated shape matches the target.
  4. Export the panels at real size as SVG for a laser / plotter cutter,
     with seam allowance, seam labels and alignment notches.

Differences from the paper (on purpose, to keep it simple and robust):
  - No interactive seam drawing: panels come from your 3D model (Blender
    materials or OBJ groups) or from the built-in demos.
  - The pattern correction is a fixed-point "simulate, measure, correct"
    loop instead of their constrained SQP solver.
  - Simple linear tension-only membrane instead of incompressible
    neo-Hookean.

Requirements:  Python 3.9+,  numpy, scipy, matplotlib
    python3 -m pip install numpy scipy matplotlib

Examples:
    python3 inflatable_designer.py --demo sphere
    python3 inflatable_designer.py --demo pillow --size 40
    python3 inflatable_designer.py --input my_shape.obj --size 60 --allowance 12

Output (in the --out folder):
    patterns_all.svg     all panels laid out on sheets of --sheet-width
    panel_P1.svg ...     one file per panel
    preview.png          target vs simulated shape, wrinkles, flat patterns
    simulated.obj        the simulated inflated shape (open in Blender)
    report.txt           accuracy, seam lengths, material area
"""

import argparse
import math
import os
import sys
import time

import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla
from scipy.optimize import minimize


# ----------------------------------------------------------------------------
# Mesh loading / demo shapes
# ----------------------------------------------------------------------------

def load_obj(path):
    verts, faces, fg, fm = [], [], [], []
    cur_g, cur_m = None, None
    with open(path, errors="ignore") as fh:
        for line in fh:
            s = line.strip()
            if not s or s.startswith("#"):
                continue
            parts = s.split()
            tag = parts[0]
            if tag == "v":
                verts.append([float(t) for t in parts[1:4]])
            elif tag in ("g", "o"):
                cur_g = " ".join(parts[1:]) or "default"
            elif tag == "usemtl":
                cur_m = " ".join(parts[1:]) or "default"
            elif tag == "f":
                idx = []
                for t in parts[1:]:
                    i = int(t.split("/")[0])
                    idx.append(i - 1 if i > 0 else len(verts) + i)
                for k in range(1, len(idx) - 1):
                    faces.append([idx[0], idx[k], idx[k + 1]])
                    fg.append(cur_g)
                    fm.append(cur_m)
    if not faces:
        sys.exit("ERROR: no faces found in " + path)
    if len(set(fm)) > 1:
        names = fm
    elif len(set(fg)) > 1:
        names = fg
    else:
        sys.exit("ERROR: the model has only ONE panel. In Blender, give each panel "
                 "its own material (select faces > Material > Assign), then export "
                 "OBJ with 'Materials' enabled.")
    uniq = []
    for n in names:
        if n not in uniq:
            uniq.append(n)
    labels = np.array([uniq.index(n) for n in names])
    return np.array(verts, float), np.array(faces, int), labels, [str(u) for u in uniq]


def weld(V, F, tol_rel=1e-6):
    """Merge duplicated vertices and drop unused ones."""
    size = np.ptp(V, axis=0).max()
    key = np.round(V / (size * tol_rel)).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    inv = inv.ravel()
    F2 = inv[F]
    V2 = V[first]
    keep = (F2[:, 0] != F2[:, 1]) & (F2[:, 1] != F2[:, 2]) & (F2[:, 2] != F2[:, 0])
    used = np.unique(F2[keep])
    remap = -np.ones(len(V2), int)
    remap[used] = np.arange(len(used))
    return V2[used], remap[F2], keep


def uv_sphere(nlat, nlon, scale=(1, 1, 1)):
    """UV sphere. Returns V, F and for each face (ring index, longitude index)."""
    V = [[0, 0, 1]]
    for i in range(1, nlat):
        th = math.pi * i / nlat
        for j in range(nlon):
            ph = 2 * math.pi * j / nlon
            V.append([math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)])
    V.append([0, 0, -1])
    V = np.array(V) * np.array(scale)
    S = len(V) - 1
    ring = lambda i, j: 1 + (i - 1) * nlon + (j % nlon)
    F, info = [], []
    for j in range(nlon):
        F.append([0, ring(1, j), ring(1, j + 1)]); info.append((0, j))
    for i in range(1, nlat - 1):
        for j in range(nlon):
            a, b, c, d = ring(i, j), ring(i, j + 1), ring(i + 1, j), ring(i + 1, j + 1)
            F.append([a, c, d]); info.append((i, j))
            F.append([a, d, b]); info.append((i, j))
    for j in range(nlon):
        F.append([S, ring(nlat - 1, j + 1), ring(nlat - 1, j)]); info.append((nlat - 1, j))
    return V, np.array(F), np.array(info)


def demo_shape(name):
    if name == "sphere":       # beach-ball: 6 gores
        nlat, nlon, g = 24, 48, 6
        V, F, info = uv_sphere(nlat, nlon)
        labels = info[:, 1] * g // nlon
        names = [f"gore{k+1}" for k in range(g)]
    elif name == "pillow":     # two panels top/bottom, flattened ellipsoid
        nlat, nlon = 24, 48
        V, F, info = uv_sphere(nlat, nlon, (1, 1, 0.45))
        labels = (info[:, 0] >= nlat // 2).astype(int)
        names = ["top", "bottom"]
    elif name == "egg":        # elongated ellipsoid, 4 gores around the long axis
        nlat, nlon, g = 28, 48, 4
        V, F, info = uv_sphere(nlat, nlon, (0.65, 0.65, 1.0))
        labels = info[:, 1] * g // nlon
        names = [f"gore{k+1}" for k in range(g)]
    else:
        sys.exit("Unknown demo: " + name)
    return V, F, labels, names


# ----------------------------------------------------------------------------
# Mesh checks and pattern topology
# ----------------------------------------------------------------------------

def check_closed(F):
    he = {}
    for f, (a, b, c) in enumerate(F):
        for u, v in ((a, b), (b, c), (c, a)):
            if (u, v) in he:
                sys.exit("ERROR: inconsistent face orientation or non-manifold edge. "
                         "In Blender: Mesh > Normals > Recalculate Outside, and Mesh > Clean Up.")
            he[(u, v)] = f
    for (u, v) in he:
        if (v, u) not in he:
            sys.exit("ERROR: the mesh has holes (it must be closed/watertight to hold air). "
                     "In Blender: select all, Mesh > Clean Up > Fill Holes.")
    return he


def signed_volume(V, F):
    a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
    return np.einsum("ij,ij->i", a, np.cross(b, c)).sum() / 6.0


class Pattern:
    """Splits the 3D mesh into separate flat panels (vertices duplicated on seams)."""

    def __init__(self, V, F, labels, names, he):
        self.V, self.F, self.labels, self.names = V, F, labels, names
        self.np = len(names)
        self.pv_of = []          # pattern vertex -> 3D vertex
        self.pv_panel = []
        key = {}
        PF = np.zeros_like(F)
        for f in range(len(F)):
            p = labels[f]
            for k in range(3):
                v = F[f, k]
                if (p, v) not in key:
                    key[(p, v)] = len(self.pv_of)
                    self.pv_of.append(v)
                    self.pv_panel.append(p)
                PF[f, k] = key[(p, v)]
        self.PF = PF
        self.key = key
        self.pv_of = np.array(self.pv_of)
        self.pv_panel = np.array(self.pv_panel)
        self.n_pv = len(self.pv_of)

        # per-panel data
        self.panels = []
        for p in range(self.np):
            faces = np.where(labels == p)[0]
            if len(faces) == 0:
                sys.exit(f"ERROR: panel {names[p]} has no faces")
            pverts = np.unique(PF[faces])
            loc = -np.ones(self.n_pv, int)
            loc[pverts] = np.arange(len(pverts))
            # boundary half-edges (3D ids) of this panel
            nxt, nb = {}, {}
            for f in faces:
                a, b, c = F[f]
                for u, v in ((a, b), (b, c), (c, a)):
                    g = he[(v, u)]
                    if labels[g] != p:
                        if u in nxt:
                            sys.exit(f"ERROR: panel '{names[p]}' touches itself at a single point. "
                                     "Add or move a seam so each panel is one simple piece.")
                        nxt[u] = v
                        nb[(u, v)] = labels[g]
            if not nxt:
                sys.exit(f"ERROR: panel '{names[p]}' has no boundary (it is the whole surface).")
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
                sys.exit(f"ERROR: panel '{names[p]}' is not a single disk-like piece "
                         "(it has a hole or several boundaries). Add a seam to cut it open.")
            nE = len({tuple(sorted(e)) for f in faces for e in
                      ((F[f, 0], F[f, 1]), (F[f, 1], F[f, 2]), (F[f, 2], F[f, 0]))})
            chi = len(pverts) - nE + len(faces)
            if chi != 1:
                sys.exit(f"ERROR: panel '{names[p]}' is not a disk (Euler characteristic {chi}). "
                         "Panels must be flattenable pieces without holes or handles.")
            nbs = [nb[(loop[i], loop[(i + 1) % len(loop)])] for i in range(len(loop))]
            self.panels.append(dict(faces=faces, pverts=pverts, loc=loc,
                                    loop3d=loop, loop_nb=nbs,
                                    loop_pv=[key[(p, v)] for v in loop]))

        # seam edges: (pv_a1, pv_b1) on panel p, (pv_a2, pv_b2) on panel q, same 3D edge
        self.seam_pairs = {}
        for p, P in enumerate(self.panels):
            L = P["loop3d"]
            for i in range(len(L)):
                u, v = L[i], L[(i + 1) % len(L)]
                q = P["loop_nb"][i]
                if p < q:
                    self.seam_pairs.setdefault((p, q), []).append(
                        (key[(p, u)], key[(p, v)], key[(q, u)], key[(q, v)]))
        self.seam_names = {pq: chr(65 + i) if i < 26 else f"S{i+1}"
                           for i, pq in enumerate(sorted(self.seam_pairs))}


# ----------------------------------------------------------------------------
# Geometry helpers
# ----------------------------------------------------------------------------

def face_edge_lengths(X, F):
    """(m,3) lengths; edge k is opposite vertex k: e0=(1,2), e1=(2,0), e2=(0,1)."""
    a, b, c = X[F[:, 0]], X[F[:, 1]], X[F[:, 2]]
    return np.stack([np.linalg.norm(b - c, axis=1),
                     np.linalg.norm(c - a, axis=1),
                     np.linalg.norm(a - b, axis=1)], axis=1)


def triangles_from_lengths(L):
    """Canonical CCW 2D triangles (m,3,2) with given edge lengths."""
    l0, l1, l2 = L[:, 0], L[:, 1], L[:, 2]
    # enforce triangle inequality
    l0 = np.minimum(l0, 0.98 * (l1 + l2)); l1 = np.minimum(l1, 0.98 * (l0 + l2))
    l2 = np.minimum(l2, 0.98 * (l0 + l1))
    x = (l1 ** 2 + l2 ** 2 - l0 ** 2) / (2 * l2)
    y = np.sqrt(np.maximum(l1 ** 2 - x ** 2, 1e-12 * l2 ** 2))
    Q = np.zeros((len(L), 3, 2))
    Q[:, 1, 0] = l2
    Q[:, 2, 0] = x
    Q[:, 2, 1] = y
    return Q


def cot_weights(Q):
    """Cotangent of the angle opposite each edge k (at vertex k). (m,3)"""
    W = np.zeros((len(Q), 3))
    for k in range(3):
        a = Q[:, (k + 1) % 3] - Q[:, k]
        b = Q[:, (k + 2) % 3] - Q[:, k]
        cr = np.abs(a[:, 0] * b[:, 1] - a[:, 1] * b[:, 0])
        W[:, k] = np.einsum("ij,ij->i", a, b) / np.maximum(cr, 1e-12)
    return np.clip(W, 1e-3, 1e3)


def kabsch_distance(X, T):
    xc, tc = X.mean(0), T.mean(0)
    H = (X - xc).T @ (T - tc)
    U, _, Vt = np.linalg.svd(H)
    d = np.sign(np.linalg.det(Vt.T @ U.T))
    D = np.diag([1, 1, d])
    R = Vt.T @ D @ U.T
    Xa = (X - xc) @ R.T + tc
    return np.linalg.norm(Xa - T, axis=1), Xa


# ----------------------------------------------------------------------------
# Flattening: LSCM initial guess + ARAP to desired edge lengths
# ----------------------------------------------------------------------------

def lscm_panel(V3, Fl):
    n = int(Fl.max()) + 1
    a, b, c = V3[Fl[:, 0]], V3[Fl[:, 1]], V3[Fl[:, 2]]
    e1, e2 = b - a, c - a
    l1 = np.linalg.norm(e1, axis=1)
    x_axis = e1 / l1[:, None]
    nrm = np.cross(e1, e2)
    area = 0.5 * np.linalg.norm(nrm, axis=1)
    y_axis = np.cross(nrm / np.linalg.norm(nrm, axis=1)[:, None], x_axis)
    P = np.zeros((len(Fl), 2, 2))           # columns = local edge vectors
    P[:, 0, 0] = l1
    P[:, 0, 1] = np.einsum("ij,ij->i", e2, x_axis)
    P[:, 1, 1] = np.einsum("ij,ij->i", e2, y_axis)
    Pinv = np.linalg.inv(P)
    G = np.zeros((len(Fl), 3, 2))
    G[:, 1, :] = Pinv[:, 0, :]
    G[:, 2, :] = Pinv[:, 1, :]
    G[:, 0, :] = -(G[:, 1, :] + G[:, 2, :])
    w = np.sqrt(area)
    rows, cols, vals = [], [], []
    m = len(Fl)
    for k in range(3):
        vk = Fl[:, k]
        # r1 = sum G[k,0] ux - G[k,1] uy ; r2 = sum G[k,1] ux + G[k,0] uy
        rows += [np.arange(m), np.arange(m), m + np.arange(m), m + np.arange(m)]
        cols += [vk, n + vk, vk, n + vk]
        vals += [w * G[:, k, 0], -w * G[:, k, 1], w * G[:, k, 1], w * G[:, k, 0]]
    M = sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))),
                      shape=(2 * m, 2 * n))
    # pin the two most distant vertices
    i0 = 0
    d = np.linalg.norm(V3 - V3[i0], axis=1)
    i1 = int(np.argmax(d))
    i0 = int(np.argmax(np.linalg.norm(V3 - V3[i1], axis=1)))
    dist = np.linalg.norm(V3[i0] - V3[i1])
    fixed = {i0: (0.0, 0.0), i1: (dist, 0.0)}
    fidx = np.array([i0, n + i0, i1, n + i1])
    fval = np.array([0.0, 0.0, dist, 0.0])
    free = np.setdiff1d(np.arange(2 * n), fidx)
    Mf, Mc = M[:, free], M[:, fidx]
    rhs = -Mc @ fval
    sol = spla.spsolve((Mf.T @ Mf).tocsc(), Mf.T @ rhs)
    u = np.zeros(2 * n)
    u[free] = sol
    u[fidx] = fval
    U = np.stack([u[:n], u[n:]], axis=1)
    # make orientation CCW (same as 3D outward orientation)
    A = signed_areas_2d(U, Fl)
    if (A < 0).sum() > (A > 0).sum():
        U[:, 1] *= -1
    return U


def signed_areas_2d(U, Fl):
    a, b, c = U[Fl[:, 0]], U[Fl[:, 1]], U[Fl[:, 2]]
    return 0.5 * ((b[:, 0] - a[:, 0]) * (c[:, 1] - a[:, 1]) - (b[:, 1] - a[:, 1]) * (c[:, 0] - a[:, 0]))


def arap_panel(U, Fl, Ldes, iters=40):
    """Find 2D positions whose triangles best match the desired edge lengths."""
    n = len(U)
    Q = triangles_from_lengths(Ldes)
    W = cot_weights(Q)                       # weight of edge k (opposite vertex k)
    rows, cols, vals = [], [], []
    for k in range(3):
        i, j = Fl[:, (k + 1) % 3], Fl[:, (k + 2) % 3]
        w = W[:, k]
        rows += [i, j, i, j]; cols += [i, j, j, i]; vals += [w, w, -w, -w]
    Lap = sp.csr_matrix((np.concatenate(vals), (np.concatenate(rows), np.concatenate(cols))),
                        shape=(n, n))
    free = np.arange(1, n)
    solve = spla.factorized(Lap[free][:, free].tocsc())
    Lap_c = Lap[free][:, [0]]
    U = U.copy()
    for _ in range(iters):
        # local step: best rotation per triangle
        S = np.zeros((len(Fl), 2, 2))
        for k in range(3):
            i, j = (k + 1) % 3, (k + 2) % 3
            du = U[Fl[:, i]] - U[Fl[:, j]]
            dq = Q[:, i] - Q[:, j]
            S += W[:, k, None, None] * du[:, :, None] * dq[:, None, :]
        Us, _, Vt = np.linalg.svd(S)
        R = Us @ Vt
        neg = np.linalg.det(R) < 0
        if neg.any():
            Us[neg, :, 1] *= -1
            R = Us @ Vt
        # global step
        b = np.zeros((n, 2))
        for k in range(3):
            i, j = (k + 1) % 3, (k + 2) % 3
            rq = np.einsum("fab,fb->fa", R, Q[:, i] - Q[:, j]) * W[:, k, None]
            np.add.at(b, Fl[:, i], rq)
            np.add.at(b, Fl[:, j], -rq)
        for d in range(2):
            U[free, d] = solve(b[free, d] - (Lap_c @ U[[0], d]))
    return U


# ----------------------------------------------------------------------------
# Inflation simulation (tension-field membrane + pressure)
# ----------------------------------------------------------------------------

class InflationSim:
    def __init__(self, F, n, strain, compression_stiffness=1e-3):
        self.F = F
        self.n = n
        self.strain = strain
        self.comp = compression_stiffness
        self.pressure = 2.0 * strain          # sphere of radius 1 -> ~strain stretch

    def set_rest(self, Urest):               # Urest: (m,3,2)
        Dm = np.stack([Urest[:, 1] - Urest[:, 0], Urest[:, 2] - Urest[:, 0]], axis=2)
        det = Dm[:, 0, 0] * Dm[:, 1, 1] - Dm[:, 0, 1] * Dm[:, 1, 0]
        det = np.where(np.abs(det) < 1e-14, 1e-14, det)
        self.Dminv = np.linalg.inv(Dm)
        self.A = 0.5 * np.abs(det)

    def stretches(self, x):
        F = self.F
        Ds = np.stack([x[F[:, 1]] - x[F[:, 0]], x[F[:, 2]] - x[F[:, 0]]], axis=2)
        Fd = Ds @ self.Dminv
        C = np.einsum("mia,mib->mab", Fd, Fd)
        a, b, c = C[:, 0, 0], C[:, 0, 1], C[:, 1, 1]
        mean = 0.5 * (a + c)
        rad = np.sqrt((0.5 * (a - c)) ** 2 + b ** 2)
        l1 = np.sqrt(np.maximum(mean + rad, 1e-12))
        l2 = np.sqrt(np.maximum(mean - rad, 1e-12))
        th = 0.5 * np.arctan2(2 * b, a - c)
        return Fd, l1, l2, th

    def energy_grad(self, xf):
        x = xf.reshape(-1, 3)
        F = self.F
        Fd, l1, l2, th = self.stretches(x)
        cs, sn = np.cos(th), np.sin(th)
        n1 = np.stack([cs, sn], 1)
        n2 = np.stack([-sn, cs], 1)
        e1, e2 = l1 - 1, l2 - 1
        k1 = np.where(e1 > 0, 1.0, self.comp)
        k2 = np.where(e2 > 0, 1.0, self.comp)
        W = 0.5 * (k1 * e1 ** 2 + k2 * e2 ** 2)
        g1, g2 = k1 * e1 / (2 * l1), k2 * e2 / (2 * l2)
        dWdC = g1[:, None, None] * n1[:, :, None] * n1[:, None, :] + \
               g2[:, None, None] * n2[:, :, None] * n2[:, None, :]
        P = 2 * Fd @ dWdC
        H = self.A[:, None, None] * (P @ np.transpose(self.Dminv, (0, 2, 1)))
        s2 = self.strain ** 2
        f1, f2 = H[:, :, 0], H[:, :, 1]
        f0 = -(f1 + f2)
        x0, x1, x2 = x[F[:, 0]], x[F[:, 1]], x[F[:, 2]]
        vol = np.einsum("ij,ij->i", x0, np.cross(x1, x2)).sum() / 6.0
        c = self.pressure / 6.0
        p0, p1, p2 = np.cross(x1, x2) * c, np.cross(x2, x0) * c, np.cross(x0, x1) * c
        E = ((self.A * W).sum() - self.pressure * vol) / s2
        g = np.zeros((self.n, 3))
        for col, fm, pm in ((0, f0, p0), (1, f1, p1), (2, f2, p2)):
            idx = F[:, col]
            for d in range(3):
                g[:, d] += np.bincount(idx, weights=fm[:, d] - pm[:, d], minlength=self.n)
        return E, (g / s2).ravel()

    def solve(self, x0, maxiter=4000):
        res = minimize(self.energy_grad, x0.ravel(), jac=True, method="L-BFGS-B",
                       options=dict(maxiter=maxiter, maxcor=30, gtol=1e-9, ftol=1e-14))
        return res.x.reshape(-1, 3)


# ----------------------------------------------------------------------------
# Main design loop
# ----------------------------------------------------------------------------

def realize_patterns(pat, Ldes, U):
    U = U.copy()
    for P in pat.panels:
        faces, pv = P["faces"], P["pverts"]
        Fl = P["loc"][pat.PF[faces]]
        U[pv] = arap_panel(U[pv], Fl, Ldes[faces])
    return U


def seam_mismatch(pat, U):
    out = {}
    for pq, edges in pat.seam_pairs.items():
        e = np.array(edges)
        la = np.linalg.norm(U[e[:, 0]] - U[e[:, 1]], axis=1).sum()
        lb = np.linalg.norm(U[e[:, 2]] - U[e[:, 3]], axis=1).sum()
        out[pq] = (la, lb)
    return out


def equalize_seams(pat, Ldes, U, F):
    """Nudge desired boundary edge lengths so both sides of every seam match."""
    # map pattern edge -> (face, k)
    lookup = {}
    for f in range(len(F)):
        for k in range(3):
            a, b = pat.PF[f, (k + 1) % 3], pat.PF[f, (k + 2) % 3]
            lookup[(a, b)] = (f, k)
            lookup[(b, a)] = (f, k)
    for pq, edges in pat.seam_pairs.items():
        for a1, b1, a2, b2 in edges:
            l1 = np.linalg.norm(U[a1] - U[b1])
            l2 = np.linalg.norm(U[a2] - U[b2])
            m = 0.5 * (l1 + l2)
            f1, k1 = lookup[(a1, b1)]
            f2, k2 = lookup[(a2, b2)]
            Ldes[f1, k1] *= (m / l1) ** 0.7
            Ldes[f2, k2] *= (m / l2) ** 0.7
    return Ldes


def design(V, F, labels, names, strain, iterations, log):
    he = check_closed(F)
    if signed_volume(V, F) < 0:
        F = F[:, ::-1].copy()
        he = check_closed(F)
    pat = Pattern(V, F, labels, names, he)
    n = len(V)
    T = face_edge_lengths(V, F)

    # 1) initial flattening
    U = np.zeros((pat.n_pv, 2))
    for P in pat.panels:
        faces, pv = P["faces"], P["pverts"]
        Fl = P["loc"][pat.PF[faces]]
        U[pv] = lscm_panel(V[pat.pv_of[pv]], Fl)

    Ldes = T / (1.0 + strain)
    sim = InflationSim(F, n, strain)
    x = V.copy()
    best = None
    log(f"{'iter':>4} {'mean dev':>10} {'max dev':>10} {'seam err':>9}   (deviation in % of size)")
    for it in range(iterations):
        U = realize_patterns(pat, Ldes, U)
        for _ in range(2):
            Ldes = equalize_seams(pat, Ldes, U, F)
            U = realize_patterns(pat, Ldes, U)
        sim.set_rest(U[pat.PF])
        x = sim.solve(x)
        dist, xa = kabsch_distance(x, V)
        S = face_edge_lengths(x, F)
        sm = seam_mismatch(pat, U)
        serr = max(abs(a - b) / max(a, b) for a, b in sm.values()) * 100
        size = np.ptp(V, axis=0).max()
        mdev, xdev = dist.mean() / size * 100, dist.max() / size * 100
        log(f"{it+1:>4} {mdev:>9.3f}% {xdev:>9.3f}% {serr:>8.3f}%")
        score = mdev + 0.5 * xdev
        if best is None or score < best[0]:
            best = (score, U.copy(), xa.copy(), dist.copy(), it + 1)
        ratio = np.clip(T / S, 0.95, 1.05)
        Ldes = np.clip(Ldes * ratio, 0.7 * T, 1.3 * T)

    _, U, xa, dist, it_best = best
    sim.set_rest(U[pat.PF])
    _, l1, l2, _ = sim.stretches(xa)
    return dict(pat=pat, F=F, U=U, x=xa, dist=dist, l1=l1, l2=l2, best_iter=it_best)


# ----------------------------------------------------------------------------
# Output: SVG patterns, preview, report
# ----------------------------------------------------------------------------

def offset_polygon(P, d):
    """Outward mitered offset of a CCW polygon."""
    if d <= 0:
        return P.copy()
    n = len(P)
    out = np.zeros_like(P)
    for i in range(n):
        a, b, c = P[i - 1], P[i], P[(i + 1) % n]
        d0 = b - a; d0 /= np.linalg.norm(d0) + 1e-12
        d1 = c - b; d1 /= np.linalg.norm(d1) + 1e-12
        n0 = np.array([d0[1], -d0[0]]); n1 = np.array([d1[1], -d1[0]])
        bis = n0 + n1
        nb = np.linalg.norm(bis)
        bis = n1 if nb < 1e-9 else bis / nb
        out[i] = b + bis * d / max(np.dot(bis, n1), 0.35)
    return out


def panel_layout(res, mm_per_unit, allowance, sheet_w, margin=6.0):
    pat, U = res["pat"], res["U"]
    items = []
    for p, P in enumerate(pat.panels):
        loop = U[P["loop_pv"]] * mm_per_unit
        c = loop.mean(0)
        cov = np.cov((loop - c).T)
        w, vec = np.linalg.eigh(cov)
        ax = vec[:, 1]
        ang = math.atan2(ax[1], ax[0])
        R = np.array([[math.cos(-ang), -math.sin(-ang)], [math.sin(-ang), math.cos(-ang)]])
        T = lambda pts: (pts - c) @ R.T
        seal = T(loop)
        cut = offset_polygon(seal, allowance)
        lo, hi = cut.min(0), cut.max(0)
        items.append(dict(p=p, T=T, seal=seal, cut=cut, lo=lo, hi=hi,
                          w=hi[0] - lo[0], h=hi[1] - lo[1]))
    # shelf packing (order by height)
    order = sorted(range(len(items)), key=lambda i: -items[i]["h"])
    x = y = margin
    row_h = 0
    for i in order:
        it = items[i]
        if x + it["w"] + margin > sheet_w and x > margin:
            x = margin; y += row_h + margin; row_h = 0
        it["off"] = np.array([x, y]) - it["lo"]
        x += it["w"] + margin
        row_h = max(row_h, it["h"])
        if it["w"] + 2 * margin > sheet_w:
            print(f"  WARNING: panel {pat.names[it['p']]} ({it['w']:.0f} mm) is wider than the sheet")
    total_h = y + row_h + margin
    return items, total_h


def svg_panel(res, it, allowance, mm_per_unit, flip_h):
    """Returns SVG elements for one laid-out panel (y flipped so we see it from outside)."""
    pat, U = res["pat"], res["U"]
    p = it["p"]
    P = pat.panels[p]
    tf = lambda pts: np.stack([pts[:, 0] + it["off"][0], flip_h - (pts[:, 1] + it["off"][1])], 1)
    seal = it["seal"]
    els = []
    path = lambda pts: "M " + " L ".join(f"{a:.3f},{b:.3f}" for a, b in pts) + " Z"
    els.append(f'<path d="{path(tf(it["cut"]))}" fill="none" stroke="#ff0000" stroke-width="0.1"/>')
    if allowance > 0:
        els.append(f'<path d="{path(tf(seal))}" fill="none" stroke="#0000ff" stroke-width="0.2" '
                   f'stroke-dasharray="3,2"/>')
    # seam chains
    loop3d, nbs = P["loop3d"], P["loop_nb"]
    nL = len(loop3d)
    starts = [i for i in range(nL) if nbs[i] != nbs[i - 1]]
    chains = []
    if not starts:
        chains.append((list(range(nL)) + [0], nbs[0], True))
    else:
        for si, s in enumerate(starts):
            e = starts[(si + 1) % len(starts)]
            idx = [s]
            k = s
            while k != e:
                k = (k + 1) % nL
                idx.append(k)
            chains.append((idx, nbs[s], False))
    centroid = seal.mean(0)
    orient = 1.0 if (np.dot(seal[:, 0], np.roll(seal[:, 1], -1)) -
                     np.dot(seal[:, 1], np.roll(seal[:, 0], -1))) > 0 else -1.0
    for idx, q, closed in chains:
        rev = 1.0
        pts = seal[idx]
        ids3 = [loop3d[i] for i in idx]
        if closed:
            r = int(np.argmin(ids3[:-1]))
            pts = np.vstack([pts[r:-1], pts[:r + 1]])
        elif ids3[-1] < ids3[0]:
            pts = pts[::-1]
            rev = -1.0
        sgn = orient * rev          # +1: interior is on the left of the walking direction
        seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
        cum = np.concatenate([[0], np.cumsum(seg)])
        total = cum[-1]
        sname = pat.seam_names[tuple(sorted((p, q)))]

        def at(s):
            k = min(np.searchsorted(cum, s) - 1, len(seg) - 1)
            k = max(k, 0)
            t = (s - cum[k]) / max(seg[k], 1e-9)
            pt = pts[k] + t * (pts[k + 1] - pts[k])
            d = pts[k + 1] - pts[k]; d /= np.linalg.norm(d) + 1e-12
            return pt, d
        # notches at 25/50/75% and a dot at the chain start
        for frac in (0.25, 0.5, 0.75):
            pt, d = at(frac * total)
            out = -sgn * np.array([-d[1], d[0]])
            L = allowance if allowance > 0 else 4.0
            a = pt if allowance > 0 else pt - out * L
            b = pt + out * L if allowance > 0 else pt
            ab = tf(np.array([a, b]))
            els.append(f'<line x1="{ab[0,0]:.3f}" y1="{ab[0,1]:.3f}" x2="{ab[1,0]:.3f}" '
                       f'y2="{ab[1,1]:.3f}" stroke="#000000" stroke-width="0.3"/>')
        st = tf(pts[:1])[0]
        els.append(f'<circle cx="{st[0]:.3f}" cy="{st[1]:.3f}" r="1.2" fill="none" '
                   f'stroke="#000000" stroke-width="0.3"/>')
        pt, d = at(0.5 * total)
        inward = sgn * np.array([-d[1], d[0]])
        lab = tf((pt + inward * 9)[None])[0]
        els.append(f'<text x="{lab[0]:.2f}" y="{lab[1]:.2f}" font-size="5" text-anchor="middle" '
                   f'font-family="Arial" fill="#000000">{sname} → {pat.names[q]}</text>')
    c = tf(centroid[None])[0]
    els.append(f'<text x="{c[0]:.2f}" y="{c[1]:.2f}" font-size="9" text-anchor="middle" '
               f'font-family="Arial" font-weight="bold" fill="#000000">{pat.names[p]}</text>')
    return els


def write_svgs(res, outdir, mm_per_unit, allowance, sheet_w):
    items, total_h = panel_layout(res, mm_per_unit, allowance, sheet_w)
    head = lambda w, h: (f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" '
                         f'width="{w:.2f}mm" height="{h:.2f}mm" viewBox="0 0 {w:.2f} {h:.2f}">\n')
    els = []
    for it in items:
        els += svg_panel(res, it, allowance, mm_per_unit, total_h)
    with open(os.path.join(outdir, "patterns_all.svg"), "w") as fh:
        fh.write(head(sheet_w, total_h) + "\n".join(els) + "\n</svg>\n")
    pat = res["pat"]
    for it in items:
        w, h = it["w"] + 12, it["h"] + 12
        it2 = dict(it); it2["off"] = np.array([6, 6]) - it["lo"]
        e = svg_panel(res, it2, allowance, mm_per_unit, h)
        safe = "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in pat.names[it["p"]])
        with open(os.path.join(outdir, f"panel_{safe}.svg"), "w") as fh:
            fh.write(head(w, h) + "\n".join(e) + "\n</svg>\n")
    return items, total_h


def write_preview(res, V, outdir, mm_per_unit, items, allowance):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    pat, F, x = res["pat"], res["F"], res["x"]
    cmap = plt.get_cmap("tab10")
    fig = plt.figure(figsize=(16, 11))

    def show(ax, X, colors, title):
        tri = X[F]
        pc = Poly3DCollection(tri, facecolors=colors, edgecolors=(0, 0, 0, 0.08), linewidths=0.2)
        ax.add_collection3d(pc)
        lo, hi = V.min(0), V.max(0)
        c, r = (lo + hi) / 2, (hi - lo).max() / 2 * 1.05
        ax.set_xlim(c[0] - r, c[0] + r); ax.set_ylim(c[1] - r, c[1] + r); ax.set_zlim(c[2] - r, c[2] + r)
        ax.set_box_aspect((1, 1, 1)); ax.set_axis_off(); ax.set_title(title)
        ax.view_init(22, -60)

    show(fig.add_subplot(2, 2, 1, projection="3d"), V,
         [cmap(l % 10) for l in pat.labels], "Target shape and panels")
    dmm = res["dist"] * mm_per_unit
    fdev = dmm[F].mean(1)
    norm = plt.Normalize(0, max(fdev.max(), 1e-9))
    ax2 = fig.add_subplot(2, 2, 2, projection="3d")
    show(ax2, x, plt.get_cmap("viridis")(norm(fdev)),
         f"Simulated inflation - deviation from target (max {dmm.max():.1f} mm)")
    sm = plt.cm.ScalarMappable(norm=norm, cmap="viridis"); sm.set_array([])
    fig.colorbar(sm, ax=ax2, shrink=0.6, label="mm")
    wr = res["l2"] < 0.998
    cols = np.where(wr[:, None], np.array([[0.85, 0.2, 0.2, 1]]), np.array([[0.85, 0.85, 0.85, 1]]))
    show(fig.add_subplot(2, 2, 3, projection="3d"), x, cols,
         "Wrinkle zones (red = compressed, will wrinkle)")
    ax4 = fig.add_subplot(2, 2, 4)
    for it in items:
        cut = it["cut"] + it["off"]; seal = it["seal"] + it["off"]
        ax4.fill(cut[:, 0], cut[:, 1], color=cmap(it["p"] % 10), alpha=0.25)
        ax4.plot(*np.vstack([cut, cut[:1]]).T, "r-", lw=0.6)
        ax4.plot(*np.vstack([seal, seal[:1]]).T, "b--", lw=0.5)
        c = seal.mean(0)
        ax4.text(c[0], c[1], pat.names[it["p"]], ha="center", va="center", fontsize=9)
    ax4.set_aspect("equal"); ax4.set_title("Flat patterns (mm) - red: cut, blue: seal line")
    ax4.invert_yaxis()
    fig.tight_layout()
    fig.savefig(os.path.join(outdir, "preview.png"), dpi=110)
    plt.close(fig)


def write_obj(path, X, F, labels, names, scale):
    with open(path, "w") as fh:
        for v in X * scale:
            fh.write(f"v {v[0]:.5f} {v[1]:.5f} {v[2]:.5f}\n")
        for p, nm in enumerate(names):
            fh.write(f"g {nm}\n")
            for f in np.where(labels == p)[0]:
                a, b, c = F[f] + 1
                fh.write(f"f {a} {b} {c}\n")


# ----------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="Compute flat cutting patterns for an inflatable shape.")
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--input", help="OBJ file of the INFLATED target shape; panels = materials or groups")
    src.add_argument("--demo", choices=["sphere", "pillow", "egg"], help="built-in example")
    ap.add_argument("--size", type=float, default=40.0,
                    help="real size (cm) of the largest dimension of the inflated object (default 40)")
    ap.add_argument("--allowance", type=float, default=10.0,
                    help="seam allowance in mm added around each panel for sealing (default 10)")
    ap.add_argument("--strain", type=float, default=0.01,
                    help="how much the material stretches when inflated, e.g. 0.01 = 1%% (default)")
    ap.add_argument("--iterations", type=int, default=12, help="optimization rounds (default 12)")
    ap.add_argument("--sheet-width", type=float, default=600.0,
                    help="width of your material / cutter bed in mm for the layout (default 600)")
    ap.add_argument("--out", default=None, help="output folder")
    a = ap.parse_args()

    if a.demo:
        V, F, labels, names = demo_shape(a.demo)
        tag = a.demo
    else:
        V, F, labels, names = load_obj(a.input)
        tag = os.path.splitext(os.path.basename(a.input))[0]
    V, F, keep = weld(V, F)
    labels = labels[keep]
    out = a.out or f"inflatable_{tag}"
    os.makedirs(out, exist_ok=True)

    # normalise: centre, radius-1 equivalent volume
    extent = np.ptp(V, axis=0).max()
    mm_per_orig = a.size * 10.0 / extent
    V = V - V.mean(0)
    vol = abs(signed_volume(V, F))
    R = (3 * vol / (4 * math.pi)) ** (1 / 3)
    V = V / R
    mm_per_unit = mm_per_orig * R

    lines = []
    def log(s):
        print(s); lines.append(s)

    log(f"Inflatable designer - {tag}: {len(V)} vertices, {len(F)} triangles, {len(names)} panels")
    log(f"Real size: {a.size:.1f} cm   material stretch: {a.strain*100:.2f}%   "
        f"seam allowance: {a.allowance:.0f} mm")
    t0 = time.time()
    res = design(V, F, labels, names, a.strain, a.iterations, log)
    log(f"Best result at iteration {res['best_iter']}  ({time.time()-t0:.1f} s)")

    items, _ = write_svgs(res, out, mm_per_unit, a.allowance, a.sheet_width)
    write_preview(res, V, out, mm_per_unit, items, a.allowance)
    write_obj(os.path.join(out, "simulated.obj"), res["x"], res["F"], labels, names, mm_per_unit / 10)

    pat = res["pat"]
    dmm = res["dist"] * mm_per_unit
    log("")
    log(f"Shape accuracy: mean deviation {dmm.mean():.1f} mm, max {dmm.max():.1f} mm")
    A = res["pat"]
    wr = (res["l2"] < 0.998)
    area3 = 0.5 * np.linalg.norm(np.cross(V[res['F'][:, 1]] - V[res['F'][:, 0]],
                                          V[res['F'][:, 2]] - V[res['F'][:, 0]]), axis=1)
    log(f"Wrinkle zones: {area3[wr].sum()/area3.sum()*100:.0f}% of the surface")
    log("")
    log("Seams (length on each side, mm):")
    for pq, (la, lb) in seam_mismatch(pat, res["U"]).items():
        nm = pat.seam_names[pq]
        log(f"  {nm}: {pat.names[pq[0]]:>10} {la*mm_per_unit:8.1f}  |  {pat.names[pq[1]]:<10} "
            f"{lb*mm_per_unit:8.1f}   diff {abs(la-lb)*mm_per_unit:.1f}")
    log("")
    log("Panels (sealed area / with allowance, cm^2):")
    tot = 0
    for it in items:
        def area(P):
            return 0.5 * abs(np.dot(P[:, 0], np.roll(P[:, 1], -1)) - np.dot(P[:, 1], np.roll(P[:, 0], -1)))
        a1, a2 = area(it["seal"]) / 100, area(it["cut"]) / 100
        tot += a2
        log(f"  {pat.names[it['p']]:>10}: {a1:8.0f}  /  {a2:8.0f}   bbox {it['w']:.0f} x {it['h']:.0f} mm")
    log(f"  total material: {tot:.0f} cm^2")
    log("")
    log("SVG colours: red = cut line, blue dashed = seal line, black = notches/labels.")
    log("Match notches and the small circle at the start of each seam between panels.")
    log("Patterns are drawn as seen from the OUTSIDE of the inflatable.")
    with open(os.path.join(out, "report.txt"), "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"\nDone. Files written to: {os.path.abspath(out)}")


if __name__ == "__main__":
    main()
