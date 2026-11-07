"""Geometría en milímetros (Y hacia abajo) para los diseños de grabado láser de Nudo."""
import math, os
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from shapely.geometry import Polygon, Point, LineString, MultiLineString, box
from shapely.ops import unary_union
from shapely import affinity

AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTES = os.path.join(AQUI, '..', 'fuentes')
_cache = {}
FONT_FILES = {
    'script': 'parisienne-latin-400-normal.woff',
    'regular': 'montserrat-latin-400-normal.woff',
    'bold': 'montserrat-latin-700-normal.woff',
    'black': 'montserrat-latin-800-normal.woff',
}

def _font(k):
    if k not in _cache:
        _cache[k] = TTFont(os.path.join(FUENTES, FONT_FILES[k]))
    return _cache[k]

def _bez(pts, n=10):
    # pts: lista de puntos de control (2 = línea, 3 = cuadrática, 4 = cúbica)
    out = []
    for i in range(1, n + 1):
        t = i / n
        if len(pts) == 3:
            x = (1-t)**2*pts[0][0] + 2*(1-t)*t*pts[1][0] + t*t*pts[2][0]
            y = (1-t)**2*pts[0][1] + 2*(1-t)*t*pts[1][1] + t*t*pts[2][1]
        else:
            x = (1-t)**3*pts[0][0] + 3*(1-t)**2*t*pts[1][0] + 3*(1-t)*t*t*pts[2][0] + t**3*pts[3][0]
            y = (1-t)**3*pts[0][1] + 3*(1-t)**2*t*pts[1][1] + 3*(1-t)*t*t*pts[2][1] + t**3*pts[3][1]
        out.append((x, y))
    return out

def _qcurve(pts, cur):
    # qCurveTo con varios puntos off-curve (TrueType): descomponer
    res = []
    offs = pts[:-1]; end = pts[-1]
    p0 = cur
    for i, c in enumerate(offs):
        if i < len(offs) - 1:
            nxt = ((c[0]+offs[i+1][0])/2, (c[1]+offs[i+1][1])/2)
        else:
            nxt = end
        res += _bez([p0, c, nxt], 8)
        p0 = nxt
    return res

def _contours(glyph_set, name):
    pen = DecomposingRecordingPen(glyph_set)
    glyph_set[name].draw(pen)
    contours, cur, start = [], [], None
    for op, args in pen.value:
        if op == 'moveTo':
            cur = [args[0]]; start = args[0]
        elif op == 'lineTo':
            cur.append(args[0])
        elif op == 'curveTo':
            cur += _bez([cur[-1], *args], 10)
        elif op == 'qCurveTo':
            if args[-1] is None:
                offs = list(args[:-1])
                st = ((offs[-1][0]+offs[0][0])/2, (offs[-1][1]+offs[0][1])/2)
                cur = [st]
                cur += _qcurve(offs + [st], st)
            else:
                cur += _qcurve(list(args), cur[-1])
        elif op in ('closePath', 'endPath'):
            if len(cur) > 2: contours.append(cur)
            cur = []
    return contours

def _area(c):
    return sum(c[i][0]*c[(i+1) % len(c)][1] - c[(i+1) % len(c)][0]*c[i][1] for i in range(len(c))) / 2

def texto(s, fuente, em, x, y, ancla='centro', espaciado=0.0, max_w=None):
    """Texto convertido a polígonos. em = alto del em en mm; (x,y) = línea base. Devuelve geometría shapely."""
    f = _font(fuente)
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f['hmtx']
    upm = f['head'].unitsPerEm
    def ancho(sc):
        return sum(hmtx[cmap[ord(ch)]][0] * sc + espaciado for ch in s) - espaciado
    sc = em / upm
    if max_w and ancho(sc) > max_w:
        sc *= max_w / ancho(sc)
    w = ancho(sc)
    x0 = x - (w/2 if ancla == 'centro' else (w if ancla == 'fin' else 0))
    pos = x0; polys = []
    for ch in s:
        if ch == ' ':
            pos += hmtx[cmap[32]][0] * sc + espaciado; continue
        gname = cmap[ord(ch)]
        cs = _contours(gs, gname)
        if cs:
            areas = [_area(c) for c in cs]
            outer_sign = 1 if max(areas, key=abs) > 0 else -1
            add, sub = [], []
            for c, a in zip(cs, areas):
                pg = Polygon([(pos + px*sc, y - py*sc) for px, py in c]).buffer(0)
                (add if (a > 0) == (outer_sign > 0) else sub).append(pg)
            g = unary_union(add)
            if sub: g = g.difference(unary_union(sub))
            polys.append(g)
        pos += hmtx[gname][0] * sc + espaciado
    return unary_union(polys) if polys else Polygon()

def ancho_texto(s, fuente, em):
    f = _font(fuente); cmap = f.getBestCmap(); hmtx = f['hmtx']
    return sum(hmtx[cmap[ord(ch)]][0] for ch in s) * em / f['head'].unitsPerEm

# ---------- primitivas ----------
def rrect(cx, cy, w, h, r):
    return box(cx - w/2 + r, cy - h/2 + r, cx + w/2 - r, cy + h/2 - r).buffer(r, 24)

def circ(cx, cy, r, n=96):
    return Point(cx, cy).buffer(r, n // 4)

def corazon(ancho, cx=0, cy=0):
    pts = []
    for i in range(240):
        t = 2*math.pi*i/240
        pts.append((16*math.sin(t)**3, -(13*math.cos(t) - 5*math.cos(2*t) - 2*math.cos(3*t) - math.cos(4*t))))
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    k = ancho / (max(xs) - min(xs))
    mx, my = (max(xs)+min(xs))/2, (max(ys)+min(ys))/2
    return Polygon([(cx + (x-mx)*k, cy + (y-my)*k) for x, y in pts])

def estrella(R, r, n=5, cx=0, cy=0, rot=-90):
    pts = []
    for i in range(n*2):
        a = math.radians(rot + i*180/n)
        rr = R if i % 2 == 0 else r
        pts.append((cx + rr*math.cos(a), cy + rr*math.sin(a)))
    return Polygon(pts)

def redondear(g, r):
    return g.buffer(-r, 16).buffer(r, 16)

def mover(g, dx, dy): return affinity.translate(g, dx, dy)
def rotar(g, deg, origen=(0, 0)): return affinity.rotate(g, deg, origin=origen)

def anillos(g):
    """Polígono/multi → lista de líneas cerradas (exterior + huecos)."""
    out = []
    for p in (g.geoms if hasattr(g, 'geoms') else [g]):
        if p.is_empty: continue
        if p.geom_type == 'Polygon':
            out.append(list(p.exterior.coords))
            out += [list(i.coords) for i in p.interiors]
        elif p.geom_type == 'LineString':
            out.append(list(p.coords))
    return out

def lineas(g):
    """Cualquier geometría → lista de polilíneas abiertas/cerradas."""
    if g.is_empty: return []
    if g.geom_type in ('Polygon',): return anillos(g)
    if g.geom_type in ('LineString', 'LinearRing'): return [list(g.coords)]
    out = []
    for p in g.geoms: out += lineas(p)
    return out
