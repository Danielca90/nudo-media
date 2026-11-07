"""10 diseños + sorteo de 100 llaveros. Todo en mm, Y hacia abajo.
Cada diseño devuelve: dict(id, titulo, material, madera, hoja=piezas en hoja de corte, escena=piezas armadas para mockup)
Una pieza = dict(cut=[geoms], fill=[geoms], score=[geoms], deco=[svg opcional]) en coordenadas locales."""
import math, random
from shapely.geometry import Polygon, Point, LineString, box
from shapely.ops import unary_union
from .geom import *

def pieza(cut=None, fill=None, score=None, deco=None):
    return dict(cut=cut or [], fill=fill or [], score=score or [], deco=deco or [])

def poner(p, dx=0, dy=0, rot=0, o=(0, 0)):
    f = lambda g: mover(rotar(g, rot, o) if rot else g, dx, dy)
    def fd(d):
        if d[0] == 'ring':
            from shapely.geometry import Point
            q = f(Point(d[1], d[2]))
            return ('ring', q.x, q.y)
        return d
    return dict(cut=[f(g) for g in p['cut']], fill=[f(g) for g in p['fill']],
                score=[f(g) for g in p['score']], deco=[fd(d) for d in p['deco']])

def agujero(g, *huecos):
    for h in huecos: g = g.difference(h)
    return g

# ------------------------------------------------------------------ 01
def d01(P):
    n1, n2 = P.get('nombre1', 'Ana'), P.get('nombre2', 'Luis')
    h = corazon(62)
    y0, y1 = h.bounds[1], h.bounds[3]
    pts = []
    N = 8
    for i in range(N + 1):
        y = y0 - 2 + (y1 - y0 + 4) * i / N
        x = 0 if i in (0, N) else (4.2 if i % 2 else -4.2)
        pts.append((x, y))
    izq = h.intersection(Polygon(pts + [(-90, y1 + 2), (-90, y0 - 2)]))
    der = h.intersection(Polygon(pts + [(90, y1 + 2), (90, y0 - 2)]))
    def mitad(g, signo, nombre):
        if hasattr(g, 'geoms'): g = max(g.geoms, key=lambda q: q.area)
        hx = signo * 20
        hy = y0 + 10
        hole = circ(hx, hy, 2.3)
        cut = [agujero(g.buffer(-0.08), hole)]
        t = texto(nombre, 'script', 11, signo * 13.5, 3, max_w=17)
        corazoncito = corazon(4.5, signo * 13.5, 12.5)
        return pieza(cut=cut, fill=[t, corazoncito],
                     deco=[('ring', hx, hy)])
    A, B = mitad(izq, -1, n1), mitad(der, 1, n2)
    hoja = [poner(A, 36, 34), poner(B, 98, 34)]
    escena = [poner(A, -2.5, 0, -4), poner(B, 2.5, 0, 4)]
    return dict(id='01_llaveros_pareja', titulo='Llaveros de pareja', madera='cedro', hoja=hoja, escena=escena,
                nota='Corazón partido en zigzag: las dos mitades solo encajan entre sí. 3 mm. Cambia nombres con --set nombre1=.. nombre2=..')

# ------------------------------------------------------------------ 02
def d02(P):
    R = 47.5
    def base():
        return circ(0, 0, R)
    pats = []
    # A: flor de la vida
    r = 11
    cs = [circ(0, 0, r)]
    for i in range(6):
        a = math.radians(60*i); cs.append(circ(r*math.cos(a), r*math.sin(a), r))
    for i in range(6):
        a = math.radians(60*i + 30); cs.append(circ(2*r*math.cos(a)*0.866*1.1547*0.866*1.0, 2*r*math.sin(a)*0.866*1.1547*0.866*1.0, r))
    for i in range(6):
        a = math.radians(60*i); cs.append(circ(2*r*math.cos(a), 2*r*math.sin(a), r))
    clip = circ(0, 0, 38)
    A = [c.exterior.intersection(clip) for c in cs] + [circ(0, 0, 38).exterior, circ(0, 0, 41).exterior]
    # B: pétalos
    B = []
    for i in range(16):
        a = 360*i/16
        l1 = circ(0, -19, 20); l2 = circ(0, -19 + 0, 20)
        lente = circ(-9, -22, 17).intersection(circ(9, -22, 17))
        lente = mover(lente, 0, 4)
        B.append(rotar(lente, a, (0, 0)).exterior)
    B += [circ(0, 0, 9).exterior, circ(0, 0, 41).exterior, circ(0, 0, 38).exterior]
    # C: ondas
    C = []
    for k, rr in enumerate([8, 12.5, 17, 21.5, 26, 30.5, 35]):
        pts = []
        for j in range(361):
            th = math.radians(j)
            pts.append(((rr + 1.4*math.sin(24*th + (k % 2)*math.pi))*math.cos(th), (rr + 1.4*math.sin(24*th + (k % 2)*math.pi))*math.sin(th)))
        C.append(LineString(pts))
    C += [circ(0, 0, 41).exterior, circ(0, 0, 3).buffer(0)]
    # D: estrella {12/5}
    pts = [(38*math.cos(math.radians(-90 + 150*i)), 38*math.sin(math.radians(-90 + 150*i))) for i in range(12)]
    D = [LineString(pts + [pts[0]]), circ(0, 0, 38).exterior, circ(0, 0, 41).exterior, circ(0, 0, 13).exterior, circ(0, 0, 20.5).exterior]
    marca = texto('NUDO', 'black', 4.2, 0, 31.5, espaciado=1.2)
    items = []
    for i, sc in enumerate([A, B, C, D]):
        sc = [g for g in sc if not g.is_empty]
        items.append(pieza(cut=[base()], fill=[mover(marca, 0, 0)] if i == 0 else [], score=sc))
    hoja = [poner(items[i], R + 4 + (i % 2)*(2*R + 8), R + 4 + (i // 2)*(2*R + 8)) for i in range(4)]
    escena = [poner(items[0], -50, -50, 0), poner(items[1], 50, -46, 8), poner(items[2], -46, 52, -6), poner(items[3], 52, 50, 4)]
    return dict(id='02_posavasos_mandala', titulo='Posavasos mandala (set de 4)', madera='pino', hoja=hoja, escena=escena,
                nota='4 posavasos Ø95 mm, cada uno con un mandala distinto. Sellar con aceite/cera para uso con vasos.')

# ------------------------------------------------------------------ 03
def d03(P):
    titulo = P.get('cancion', 'Nuestra canción'); artista = P.get('artista', 'Para siempre contigo')
    W, H = 200, 110
    cut = agujero(rrect(100, 55, W, H, 6), circ(100, 7, 2.2))
    # foto de ejemplo: medios tonos en forma de corazón
    heart = corazon(68, 55, 56)
    dots = []
    cxh, cyh = 55, 56
    step = 2.3
    for i in range(-18, 19):
        for j in range(-18, 19):
            x = cxh + i*step + (j % 2)*step/2; y = cyh + j*step*0.866
            if heart.buffer(-0.8).contains(Point(x, y)):
                d = math.hypot(x - cxh, (y - cyh)*1.05) / 34
                rr = 0.35 + 0.8*(1 - min(1, d))**0.9
                dots.append(circ(x, y, rr, 16))
    marco = rrect(55, 55, 84, 84, 3).exterior
    rnd = random.Random(7)
    bars = []; x = 105; k = 0
    env = []
    for i in range(30):
        env.append(0.25 + 0.75*abs(math.sin(i*0.55) * math.cos(i*0.23) + 0.35*math.sin(i*1.9)) * (0.6 + 0.4*rnd.random()))
    for i, e in enumerate(env):
        hh = max(2, min(20, e*20))
        w = 1.7 if i < 12 else 1.0
        bars.append(box(105 + i*2.95, 66 - hh/2, 105 + i*2.95 + w, 66 + hh/2))
    knob = circ(105 + 12*2.95 + 0.5, 66, 2.6)
    tri = lambda pts: Polygon(pts)
    play = tri([(143.5, 83), (143.5, 93), (151.5, 88)])
    prev_ = unary_union([tri([(122, 88), (130, 83), (130, 93)]), box(120, 83, 121.4, 93)])
    next_ = unary_union([tri([(173, 88), (165, 83), (165, 93)]), box(173.6, 83, 175, 93)])
    fill = [unary_union(dots), texto(titulo, 'black', 9, 105, 36, 'inicio', max_w=82),
            texto(artista, 'regular', 5, 105, 46, 'inicio', max_w=82),
            unary_union(bars), knob, play, prev_, next_,
            texto('1:24', 'regular', 3.3, 105, 78, 'inicio'), texto('3:42', 'regular', 3.3, 187.5, 78, 'fin')]
    score = [marco, circ(147.5, 88, 7.5).exterior]
    p = pieza(cut=[cut], fill=fill, score=score)
    return dict(id='03_placa_cancion', titulo='Placa de tu canción', madera='pino', hoja=[poner(p, 5, 5)], escena=[poner(p, -100, -55, -2)],
                nota='Onda de sonido estilo reproductor (sin marcas de terceros). La foto es de ejemplo: reemplázala por tu imagen en LightBurn (capa de imagen, Jarvis/Stucki).')

# ------------------------------------------------------------------ 04
def d04(P):
    r = 30
    nombres = ['Nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente', 'Llena', 'Gibosa menguante', 'Cuarto menguante', 'Menguante']
    # iluminacion: (lado, tipo, k)
    cfg = [('d', 'nueva', 0), ('d', 'cresc', 0.55), ('d', 'cuarto', 0), ('d', 'gibosa', 0.55), ('d', 'llena', 0),
           ('i', 'gibosa', 0.55), ('i', 'cuarto', 0), ('i', 'cresc', 0.55)]
    disc = circ(0, 0, r)
    der = box(0, -r - 1, r + 1, r + 1).intersection(disc); izq = box(-r - 1, -r - 1, 0, r + 1).intersection(disc)
    craters = [(-8, -12, 4.2), (10, -4, 3), (-12, 8, 3.4), (6, 14, 2.6), (14, -16, 2), (-3, 2, 2.2)]
    piezas = []
    for lado, tipo, k in cfg:
        mitad = der if lado == 'd' else izq
        ell = circ(0, 0, r).intersection(box(-r*k, -r, r*k, r)) if False else Polygon([(k*r*math.cos(t), r*math.sin(t)) for t in [i*math.pi/60 for i in range(120)]])
        if tipo == 'nueva': lit = Polygon()
        elif tipo == 'llena': lit = disc
        elif tipo == 'cuarto': lit = mitad
        elif tipo == 'cresc': lit = mitad.difference(ell)
        else: lit = mitad.union(ell)
        sombra = disc.difference(lit).buffer(-1.0).buffer(1.0) if not lit.is_empty else disc
        sombra = sombra.intersection(disc.buffer(-1.2))
        cr = [circ(x, y, rr).exterior.intersection(lit.buffer(-1.5)) for x, y, rr in craters if lit.contains(circ(x, y, rr + 1))]
        piezas.append(pieza(cut=[agujero(disc, circ(0, -r + 4, 1.4), circ(0, r - 4, 1.4))], fill=[sombra], score=[c for c in cr if not c.is_empty] + [circ(0, 0, r - 2.2).exterior]))
    hoja = [poner(piezas[i], 34 + (i % 4)*68, 34 + (i // 4)*68) for i in range(8)]
    escena = []
    for i in range(8):
        c, r = i % 4, i // 4
        x, y = (c - 1.5)*66, r*92
        escena.append(poner(piezas[i], x, y))
        escena.append(pieza(cut=[LineString([(x, y - 27), (x, y - 47)]).buffer(0.45)]))
    for r in range(2):
        escena.append(pieza(cut=[rrect(0, r*92 - 48, 280, 4, 2)]))
    return dict(id='04_fases_lunares', titulo='Guirnalda de fases lunares', madera='pino', hoja=hoja, escena=escena,
                nota='8 discos Ø60 mm con las fases de la luna. Dos agujeros por disco para enhebrar hilo de cáñamo.')

# ------------------------------------------------------------------ 05
def d05(P):
    nombre = P.get('nombre', 'Familia'); anio = P.get('anio', '2026')
    # estrella
    st = redondear(estrella(38, 17), 2.2)
    star = pieza(cut=[agujero(st, circ(0, -29, 1.6))], fill=[circ(0, 2, 2.4)], score=[redondear(estrella(24, 10.5), 1.2).exterior, circ(0, -29, 3.2).exterior])
    # arbol
    t1 = Polygon([(0, -44), (20, -18), (-20, -18)]); t2 = Polygon([(0, -30), (28, 0), (-28, 0)]); t3 = Polygon([(0, -14), (36, 22), (-36, 22)])
    trunk = box(-5, 22, 5, 33)
    tree_g = redondear(unary_union([t1, t2, t3, trunk]), 1.8)
    orn = [circ(-8, -4, 2.3), circ(10, 6, 2.3), circ(-18, 14, 2.3), circ(2, 14, 2.3), circ(22, 16, 2.3), circ(0, -22, 2.0), circ(-9, -15, 1.6)]
    tree = pieza(cut=[agujero(tree_g, circ(0, -39, 1.5))], fill=orn + [estrella(5, 2.2, 5, 0, -40) if False else circ(0, 27, 0.01)], score=[])
    # copo
    arms = []
    for i in range(6):
        a = math.radians(60*i - 90)
        d = (math.cos(a), math.sin(a))
        L = lambda s, e, ang, ln: LineString([(d[0]*s, d[1]*s), (d[0]*s + math.cos(a+ang)*ln, d[1]*s + math.sin(a+ang)*ln)])
        arms += [LineString([(0, 0), (d[0]*38, d[1]*38)]), L(20, 0, math.radians(55), 11), L(20, 0, -math.radians(55), 11), L(30, 0, math.radians(55), 7.5), L(30, 0, -math.radians(55), 7.5)]
    flake_g = unary_union(arms).buffer(2.1, 8)
    flake = pieza(cut=[agujero(flake_g, circ(0, -32, 1.3))], fill=[], score=[circ(0, 0, 5.5).exterior])
    # bola
    bola_g = unary_union([circ(0, 0, 32), rrect(0, -35, 14, 9, 2)])
    bola = pieza(cut=[agujero(bola_g, circ(0, -37, 1.6))],
                 fill=[texto(nombre, 'script', 16, 0, 4, max_w=44), texto(anio, 'bold', 5, 0, 17, espaciado=1.5), texto('NUDO', 'black', 2.8, 0, -15, espaciado=1.4)],
                 score=[circ(0, 0, 27).exterior, LineString([(-13, 8.5), (13, 8.5)])])
    hoja = [poner(star, 40, 40), poner(tree, 118, 44), poner(flake, 200, 40), poner(bola, 280, 44)]
    escena = [poner(star, -108, -30, -10), poner(tree, -32, -10, 7), poner(flake, 45, -34, 0), poner(bola, 122, -14, -5)]
    for i, e in enumerate(escena): e['deco'] = [('cinta', 0)]
    return dict(id='05_adornos_navidad', titulo='Adornos navideños personalizados', madera='cedro', hoja=hoja, escena=escena,
                nota='Estrella, árbol, copo y bola con nombre. Cuelgan con cinta o hilo. Cambia nombre/año con --set nombre=.. anio=..')

# ------------------------------------------------------------------ 06
def d06(P):
    board = rrect(75, 75, 150, 150, 5)
    gr = [box(48.75, 14, 51.25, 136), box(98.75, 14, 101.25, 136), box(14, 48.75, 136, 51.25), box(14, 98.75, 136, 101.25)]
    grid = unary_union(gr).buffer(0.0)
    grid = unary_union([g.buffer(1.25, 4) for g in [LineString([(50, 14), (50, 136)]), LineString([(100, 14), (100, 136)]), LineString([(14, 50), (136, 50)]), LineString([(14, 100), (136, 100)])]])
    Bp = pieza(cut=[board], fill=[grid], score=[rrect(75, 75, 142, 142, 3).exterior])
    def X():
        l = [rotar(LineString([(-9, 0), (9, 0)]), a).buffer(2.5, cap_style=2) for a in (45, -45)]
        return pieza(cut=[unary_union(l)], fill=[], score=[])
    def O():
        return pieza(cut=[circ(0, 0, 13).difference(circ(0, 0, 7.5))], fill=[], score=[])
    hoja = [poner(Bp, 4, 4)]
    for i in range(5):
        hoja.append(poner(X(), 18 + i*31, 175)); hoja.append(poner(O(), 18 + i*31, 207))
    escena = [poner(Bp, -75, -75)]
    pos = {(0, 0): 'X', (1, 1): 'X', (0, 1): 'O', (2, 0): 'O', (2, 2): 'X', (1, 0): 'O'}
    # partida: X gana en diagonal (0,0),(1,1),(2,2)
    for (c, r), t in pos.items():
        escena.append(poner(X() if t == 'X' else O(), -75 + 25 + c*50, -75 + 25 + r*50, 0))
    escena.append(poner(X(), 100, 40, 12)); escena.append(poner(O(), 108, 76, 0)); escena.append(poner(X(), 130, 58, -8))
    return dict(id='06_triqui_viaje', titulo='Triqui de viaje', madera='pino', hoja=hoja, escena=escena,
                nota='Tablero 150 mm + 5 X y 5 O. Las fichas encajan sobre el tablero (casillas de 50 mm).')

# ------------------------------------------------------------------ 07
FRASES = [('Un abrazo', 'eterno'), ('Una cena', 'a mi cargo'), ('Un masaje', 'de 10 minutos'), ('Elegir la peli', 'sin quejas'),
          ('Un desayuno', 'en la cama'), ('Un día', 'sin discutir'), ('Una escapada', 'los dos solos'), ('Un postre', 'a tu elección'),
          ('Una serenata', 'desafinada'), ('Lavar los platos', 'por ti'), ('Un sí', 'a tu plan'), ('Un beso', 'bien largo')]
def d07(P):
    cards = []
    for a, b in FRASES:
        cut = rrect(0, 0, 85, 50, 4)
        fill = [texto('VALE POR', 'bold', 3.6, 0, -11, espaciado=1.6), texto(a, 'script', 9.5, 0, 2, max_w=66), texto(b, 'script', 9.5, 0, 13, max_w=66), corazon(4.2, 0, 20.5)]
        cards.append(pieza(cut=[cut], fill=fill, score=[rrect(0, 0, 79, 44, 2.5).exterior]))
    hoja = [poner(cards[i], 43.5 + (i % 3)*91, 27 + (i // 3)*56) for i in range(12)]
    pil = [poner(cards[i], 0, 0, 0) for i in range(5)]
    escena = [poner(cards[0], -47, -62, -7), poner(cards[1], 47, -58, 6), poner(cards[2], -45, 0, 4), poner(cards[3], 47, 4, -4), poner(cards[4], 0, 64, 2)]
    return dict(id='07_vales_pareja', titulo='Vales de pareja (12)', madera='pino', hoja=hoja, escena=escena,
                nota='12 vales 85×50 mm. Se guardan en una bolsita o cajita; cambia las frases en lib/disenos.py (FRASES).')

# ------------------------------------------------------------------ 08
def d08(P):
    nombre = P.get('mascota', 'Luna'); tel = P.get('telefono', '300 000 0000')
    hueso = unary_union([box(-30, -9, 30, 9)] + [circ(sx*34, sy*8.5, 10.5) for sx in (-1, 1) for sy in (-1, 1)])
    hueso = redondear(hueso, 0.5)
    hb = pieza(cut=[agujero(hueso, circ(-36, -9, 2.6))],
               fill=[texto(nombre, 'script', 14, 3, 4.5, max_w=50), texto(tel, 'bold', 3.6, 3, 13.6, espaciado=0.6)],
               score=[circ(-36, -9, 4.6).exterior])
    # chapa redonda con huella
    pata = [circ(0, 4, 5.2)] + [circ(x, y, 2.6) for x, y in [(-7, -3), (-2.8, -8), (2.8, -8), (7, -3)]]
    rd = pieza(cut=[agujero(unary_union([circ(0, 0, 20), rrect(0, -21, 9, 6, 1.5)]), circ(0, -22, 1.6))],
               fill=[unary_union(pata).buffer(0), texto(nombre, 'script', 10, 0, 16.5, max_w=27)], score=[circ(0, 0, 17.3).exterior])
    hoja = [poner(hb, 50, 26), poner(hb, 50, 62), poner(rd, 122, 32), poner(rd, 170, 32)]
    escena = [poner(hb, -26, -12, -8), poner(rd, 38, 4, 10)]
    for e in escena: e['deco'] = [('anilla_aguj', 0)]
    return dict(id='08_placa_mascota', titulo='Placa para mascota', madera='cedro', hoja=hoja, escena=escena,
                nota='Hueso 92×38 mm y chapa Ø40 mm. Cambia nombre/teléfono con --set mascota=.. telefono=..')

# ------------------------------------------------------------------ 09
def d09(P):
    textos = [('Una página', 'más'), ('Lee', 'más'), ('Nunca dejes', 'de leer'), ('Mi lugar', 'favorito')]
    def mk(t):
        W, H = 46, 150
        out = rrect(0, 0, W, H, 4)
        holes = [circ(0, -H/2 + 8, 2.0)]
        for i in range(5):
            y = -44 + i*17.5
            fl = unary_union([circ(dx, dy, 3.6) for dx, dy in [(3.5, 0), (-3.5, 0), (0, 3.5), (0, -3.5)]])
            holes.append(mover(fl, 0, y))
            if i < 4: holes.append(circ(0, y + 8.7, 1.5))
        holes += [mover(box(-16, -0.4, -9, 0.4), 0, y) for y in ()]
        cut = agujero(out, *holes)
        fill = [texto(t[0], 'script', 7.8, 0, 52, max_w=36), texto(t[1], 'script', 7.8, 0, 61, max_w=36), estrella(2.5, 1, 4, 0, 67)]
        return pieza(cut=[cut], fill=fill, score=[rrect(0, 0, 40, 144, 2.5).exterior])
    ps = [mk(t) for t in textos]
    hoja = [poner(p, 27 + i*54, 79) for i, p in enumerate(ps)]
    escena = [poner(ps[0], -52, 0, -6), poner(ps[1], 0, -8, 0), poner(ps[2], 52, 0, 6)]
    for e in escena: e['deco'] = [('borla_top', 0)]
    return dict(id='09_marcapaginas', titulo='Marcapáginas filigrana', madera='cedro', hoja=hoja, escena=escena,
                nota='4 marcapáginas 46×150 mm con calados florales. Añade borla de hilo en el agujero superior.')

# ------------------------------------------------------------------ 10
def d10(P):
    lugar = P.get('lugar', 'Nuestro lugar'); coords = P.get('coordenadas', '4.7110° N · 74.0721° O'); fecha = P.get('fecha', '14 · 02 · 2019')
    W, H = 200, 150
    cut = agujero(rrect(100, 75, W, H, 6), circ(100, 8, 2.2))
    nav = Polygon([(100, 117), (103.2, 130), (100, 127.5), (96.8, 130)])
    fill = [texto('EL LUGAR DONDE TODO EMPEZÓ', 'bold', 5, 100, 30, espaciado=1.1, max_w=160), texto(lugar, 'script', 26, 100, 66, max_w=150),
            texto(coords, 'regular', 6, 100, 100, espaciado=0.6), texto(fecha, 'bold', 5.2, 100, 112, espaciado=1.4),
            corazon(6, 100, 80), nav, texto('N', 'bold', 3.6, 100, 116)]
    score = [LineString([(40, 80), (92, 80)]), LineString([(108, 80), (160, 80)]), rrect(100, 75, 190, 140, 3.5).exterior, circ(100, 125, 7.8).exterior]
    p = pieza(cut=[cut], fill=fill, score=score)
    return dict(id='10_placa_coordenadas', titulo='Placa de coordenadas', madera='pino', hoja=[poner(p, 5, 5)], escena=[poner(p, -100, -75, 1.5)],
                nota='Placa 200×150 mm: lugar, coordenadas y fecha. Parámetros: --set lugar=.. coordenadas=.. fecha=..')

# ------------------------------------------------------------------ Sorteo
def llavero(num):
    cut = agujero(rrect(30, 17, 60, 34, 6), circ(8, 17, 2.4))
    fill = [texto('NUDO', 'black', 9.5, 37, 17.2, espaciado=1.1, max_w=33), texto('DESIGN · GRABADO LÁSER', 'bold', 2.3, 37, 22.5, espaciado=0.4, max_w=33),
            texto('#%03d' % num, 'bold', 4.2, 55, 31, 'fin', espaciado=0.4)]
    score = [rrect(30, 17, 56, 30, 4).exterior, circ(8, 17, 4.6).exterior]
    return pieza(cut=[cut], fill=fill, score=score)

def sorteo(hoja_n):
    base = (hoja_n - 1)*50
    hoja = []
    for i in range(50):
        c, r = i % 5, i // 5
        hoja.append(poner(llavero(base + i + 1), 4 + c*66, 6 + r*38))
    return dict(id='sorteo_100_llaveros_hoja%d' % hoja_n, titulo='Sorteo: llaveros #%03d–#%03d' % (base + 1, base + 50), madera='cedro', hoja=hoja, escena=[], nota='', w=330, h=380)

DISENOS = [d01, d02, d03, d04, d05, d06, d07, d08, d09, d10]


def sorteo_escena():
    """Mockup del sorteo: abanico de llaveros numerados."""
    ps = []
    for i, (x, y, rot) in enumerate([(-34, -30, -14), (36, -34, 11), (-38, 16, 8), (34, 14, -9), (0, 56, 3)]):
        p = llavero(i + 1)
        p = dict(p, deco=[('ring', 8, 17)])
        ps.append(poner(p, x - 30, y - 17, rot, (30, 17)) if False else poner(p, x - 30, y - 17))
    return dict(id='sorteo_llaveros', titulo='Llaveros del sorteo', madera='cedro', hoja=[], escena=ps, nota='')
