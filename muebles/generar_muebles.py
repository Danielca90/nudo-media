"""
Generador paramétrico de muebles de referencia (Nudo Design).

Unidades: milímetros. Ejes (internos): X = ancho, Y = profundidad (0 = pared, + hacia el frente), Z = alto.
Al exportar se invierte Y para que el frente del mueble mire a la vista Front de Rhino (-Y).
Cambia los parámetros de cada mueble en PARAMS y vuelve a correr:

    python3 generar_muebles.py

Salida en ./modelos: un .3dm por mueble (Rhino, capas por pieza), un .glb por mueble,
y despiece.json con la lista de cortes que usa MEDIDAS.md.
"""
import json
import math
import os
import sys

import rhino3dm as r3
import trimesh

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "modelos")

# ---------------------------------------------------------------------------
# PARÁMETROS (todo en mm)
# ---------------------------------------------------------------------------
PARAMS = {
    "cocina": {
        "titulo": "Alacena de cocina",
        "hueco": (490, 200, 2000),       # espacio disponible: muro a muro, fondo, alto
        "ancho": 480,                    # 5 mm de holgura por lado
        "fondo_total": 200,              # incluye puertas
        "alto": 500,
        "altura_montaje": 1400,          # base del mueble desde el piso (colgado)
        "espesor": 18,                   # tablero
        "espesor_fondo": 6,              # trasera (triplex / MDF delgado)
        "entrepanos": 3,                 # entrepaños interiores (+ la base = 4 niveles)
        "puertas": 2,
        "luz_puertas": 3,                # separación entre puertas y bordes
    },
    "comoda": {
        "titulo": "Cómoda del cuarto",
        "hueco": (1200, 500, 1400),      # ancho de trabajo, pared→cama, alto hasta la puerta
        "ancho": 1000,
        "fondo_total": 320,
        "alto": 1200,
        "espesor": 18,
        "espesor_fondo": 6,
        "zocalo": 80,
        "cajones": 5,
        "luz_frentes": 3,
    },
    "closet": {
        "titulo": "Clóset del cuarto principal",
        "hueco": (1500, 400, 2000),
        "fondo_total": 400,
        "altura_piso": 200,              # volado: separación del piso
        "alto_total": 2000,              # borde superior desde el piso
        "ancho_modulo": 720,             # cada módulo
        "separacion_modulos": 0,         # 0 = módulos pegados
        "espesor": 18,
        "espesor_fondo": 6,
        # Módulo A (colgar): de abajo hacia arriba
        "alto_cajon": 200,               # frente del cajoncito
        "alto_espacio_ropa": 300,        # hueco abierto entre cajón y entrepaño
        "barra_desde_piso": 1750,        # eje de la barra (alcanzable)
        "maletero_sobre_barra": 70,      # entrepaño superior por encima del eje de la barra
        "diametro_barra": 25,
        # Módulo B: entrepaños
        "entrepanos_b": 5,
        "luz_frentes": 3,
    },
}

COLORES = {  # RGBA para capas / glb
    "estructura": (217, 179, 130, 255),   # pino claro
    "entrepano": (205, 165, 115, 255),
    "trasera": (176, 138, 90, 255),
    "frente": (196, 152, 100, 255),       # puertas y frentes de cajón
    "cajon": (230, 205, 165, 255),        # cajas de cajón
    "herraje": (150, 150, 155, 255),
    "hueco": (120, 170, 230, 60),         # espacio disponible (referencia)
}


class Mueble:
    def __init__(self, clave, titulo):
        self.clave = clave
        self.titulo = titulo
        self.piezas = []   # dicts: nombre, cat, caja (x0,y0,z0,x1,y1,z1) | cilindro
        self.cotas = []    # (p0, p1, texto) para el visor

    def tablero(self, nombre, cat, x0, y0, z0, x1, y1, z1):
        a = (min(x0, x1), min(y0, y1), min(z0, z1), max(x0, x1), max(y0, y1), max(z0, z1))
        self.piezas.append({"nombre": nombre, "cat": cat, "tipo": "caja", "caja": a})

    def barra(self, nombre, x0, x1, y, z, d):
        self.piezas.append({"nombre": nombre, "cat": "herraje", "tipo": "barra",
                            "x0": x0, "x1": x1, "y": y, "z": z, "d": d})

    def cota(self, p0, p1, texto):
        self.cotas.append({"p0": p0, "p1": p1, "texto": texto})


# ---------------------------------------------------------------------------
# Constructores
# ---------------------------------------------------------------------------
def cuerpo(m, x0, z0, W, D, H, t, tf, nombre=""):
    """Caja estándar: laterales de piso a techo, base y techo entre laterales, trasera embutida."""
    p = (nombre + " ") if nombre else ""
    m.tablero(p + "Lateral izq", "estructura", x0, 0, z0, x0 + t, D, z0 + H)
    m.tablero(p + "Lateral der", "estructura", x0 + W - t, 0, z0, x0 + W, D, z0 + H)
    m.tablero(p + "Base", "estructura", x0 + t, 0, z0, x0 + W - t, D, z0 + t)
    m.tablero(p + "Techo", "estructura", x0 + t, 0, z0 + H - t, x0 + W - t, D, z0 + H)
    m.tablero(p + "Trasera", "trasera", x0 + t, 0, z0 + t, x0 + W - t, tf, z0 + H - t)


def hacer_cocina(P):
    m = Mueble("cocina", P["titulo"])
    W, H, t, tf = P["ancho"], P["alto"], P["espesor"], P["espesor_fondo"]
    D = P["fondo_total"] - t                  # cuerpo; las puertas van por delante
    hw = P["hueco"]
    x0 = (hw[0] - W) / 2
    z0 = P["altura_montaje"]
    m.tablero("Espacio disponible", "hueco", 0, 0, 0, hw[0], hw[1], hw[2])
    cuerpo(m, x0, z0, W, D, H, t, tf)
    n = P["entrepanos"]
    libre = H - 2 * t
    paso = (libre - n * t) / (n + 1)
    for i in range(n):
        z = z0 + t + paso * (i + 1) + t * i
        m.tablero(f"Entrepaño {i+1}", "entrepano", x0 + t, tf, z, x0 + W - t, D - 10, z + t)
    g, k = P["luz_puertas"], P["puertas"]
    wp = (W - g * (k + 1)) / k
    for i in range(k):
        xa = x0 + g + i * (wp + g)
        m.tablero(f"Puerta {i+1}", "frente", xa, D, z0 + g, xa + wp, D + t, z0 + H - g)
    m.cota((x0, D + t + 40, z0 + H + 40), (x0 + W, D + t + 40, z0 + H + 40), f"{W/10:g} cm")
    m.cota((x0 + W + 40, D + t + 40, z0), (x0 + W + 40, D + t + 40, z0 + H), f"{H/10:g} cm")
    m.cota((x0 + W + 40, 0, z0 - 40), (x0 + W + 40, D + t, z0 - 40), f"{(D+t)/10:g} cm")
    m.cota((-60, hw[1], 0), (-60, hw[1], z0), f"montaje {z0/10:g} cm")
    m.info = {"compartimentos_mm": round(paso), "ancho_puerta_mm": round(wp)}
    return m


def hacer_comoda(P):
    m = Mueble("comoda", P["titulo"])
    W, H, t, tf = P["ancho"], P["alto"], P["espesor"], P["espesor_fondo"]
    D = P["fondo_total"] - t
    hw = P["hueco"]
    x0 = (hw[0] - W) / 2
    zc = P["zocalo"]
    m.tablero("Espacio disponible", "hueco", 0, 0, 0, hw[0], hw[1], hw[2])
    # laterales al piso, base elevada sobre zócalo
    m.tablero("Lateral izq", "estructura", x0, 0, 0, x0 + t, D, H)
    m.tablero("Lateral der", "estructura", x0 + W - t, 0, 0, x0 + W, D, H)
    m.tablero("Base", "estructura", x0 + t, 0, zc, x0 + W - t, D, zc + t)
    m.tablero("Techo", "estructura", x0 + t, 0, H - t, x0 + W - t, D, H)
    m.tablero("Zócalo", "estructura", x0 + t, D - 40 - t, 0, x0 + W - t, D - 40, zc)
    m.tablero("Trasera", "trasera", x0 + t, 0, zc + t, x0 + W - t, tf, H - t)
    n, g = P["cajones"], P["luz_frentes"]
    z_ini, z_fin = zc, H
    hf = (z_fin - z_ini - g * (n + 1)) / n
    gap_corr = 13                               # holgura por lado para correderas
    cb_t = 15
    prof_caja = math.floor((D - tf - 20) / 50) * 50  # múltiplo de 50 (largos de corredera)
    for i in range(n):
        za = z_ini + g + i * (hf + g)
        m.tablero(f"Frente cajón {i+1}", "frente", x0 + g, D, za, x0 + W - g, D + t, za + hf)
        # caja del cajón (simplificada)
        cx0, cx1 = x0 + t + gap_corr, x0 + W - t - gap_corr
        cy0, cy1 = D - prof_caja, D
        cz0, cz1 = za + 20, za + hf - 30
        m.tablero(f"Cajón {i+1} lateral izq", "cajon", cx0, cy0, cz0, cx0 + cb_t, cy1, cz1)
        m.tablero(f"Cajón {i+1} lateral der", "cajon", cx1 - cb_t, cy0, cz0, cx1, cy1, cz1)
        m.tablero(f"Cajón {i+1} trasera", "cajon", cx0 + cb_t, cy0, cz0, cx1 - cb_t, cy0 + cb_t, cz1)
        m.tablero(f"Cajón {i+1} contrafrente", "cajon", cx0 + cb_t, cy1 - cb_t, cz0, cx1 - cb_t, cy1, cz1)
        m.tablero(f"Cajón {i+1} fondo", "trasera", cx0 + cb_t, cy0 + cb_t, cz0, cx1 - cb_t, cy1 - cb_t, cz0 + 6)
    m.cota((x0, D + t + 40, H + 40), (x0 + W, D + t + 40, H + 40), f"{W/10:g} cm")
    m.cota((x0 + W + 40, D + t + 40, 0), (x0 + W + 40, D + t + 40, H), f"{H/10:g} cm")
    m.cota((x0 + W + 40, 0, -40), (x0 + W + 40, D + t, -40), f"{(D+t)/10:g} cm")
    m.info = {"alto_frente_mm": round(hf), "prof_caja_cajon_mm": prof_caja,
              "paso_libre_a_cama_mm": hw[1] - (D + t)}
    return m


def hacer_closet(P):
    m = Mueble("closet", P["titulo"])
    t, tf = P["espesor"], P["espesor_fondo"]
    D = P["fondo_total"]
    hw = P["hueco"]
    W = P["ancho_modulo"]
    sep = P["separacion_modulos"]
    total = 2 * W + sep
    z0 = P["altura_piso"]
    H = P["alto_total"] - z0
    m.tablero("Espacio disponible", "hueco", 0, 0, 0, hw[0], hw[1], hw[2])
    xa = (hw[0] - total) / 2
    xb = xa + W + sep
    g = P["luz_frentes"]

    # Módulo A: colgar
    cuerpo(m, xa, z0, W, D, H, t, tf, "Mód. A")
    za = z0 + t
    hc = P["alto_cajon"]
    m.tablero("Mód. A Frente cajón", "frente", xa + t + g, D - t, za + g, xa + W - t - g, D, za + hc - g)
    # caja de cajón embutida
    cx0, cx1 = xa + t + 13, xa + W - t - 13
    prof = math.floor((D - t - tf - 20) / 50) * 50
    cy1 = D - t
    cy0 = cy1 - prof
    cz0, cz1 = za + 15, za + hc - 35
    m.tablero("Mód. A Cajón lateral izq", "cajon", cx0, cy0, cz0, cx0 + 15, cy1, cz1)
    m.tablero("Mód. A Cajón lateral der", "cajon", cx1 - 15, cy0, cz0, cx1, cy1, cz1)
    m.tablero("Mód. A Cajón trasera", "cajon", cx0 + 15, cy0, cz0, cx1 - 15, cy0 + 15, cz1)
    m.tablero("Mód. A Cajón fondo", "trasera", cx0 + 15, cy0 + 15, cz0, cx1 - 15, cy1, cz0 + 6)
    z = za + hc
    m.tablero("Mód. A Entrepaño sobre cajón", "entrepano", xa + t, tf, z, xa + W - t, D, z + t)
    z += t + P["alto_espacio_ropa"]
    m.tablero("Mód. A Entrepaño ropa", "entrepano", xa + t, tf, z, xa + W - t, D, z + t)
    z_colgar = z + t
    zr = P["barra_desde_piso"]
    zm = zr + P["maletero_sobre_barra"]
    m.tablero("Mód. A Maletero", "entrepano", xa + t, tf, zm, xa + W - t, D, zm + t)
    m.barra("Mód. A Barra de colgar", xa + t, xa + W - t, D / 2, zr, P["diametro_barra"])

    # Módulo B: entrepaños
    cuerpo(m, xb, z0, W, D, H, t, tf, "Mód. B")
    n = P["entrepanos_b"]
    libre = H - 2 * t
    paso = (libre - n * t) / (n + 1)
    for i in range(n):
        zz = z0 + t + paso * (i + 1) + t * i
        m.tablero(f"Mód. B Entrepaño {i+1}", "entrepano", xb + t, tf, zz, xb + W - t, D - 10, zz + t)

    m.cota((xa, D + 60, P["alto_total"] + 40), (xb + W, D + 60, P["alto_total"] + 40), f"{total/10:g} cm")
    m.cota((xb + W + 40, D + 60, z0), (xb + W + 40, D + 60, P["alto_total"]), f"{H/10:g} cm")
    m.cota((xb + W + 40, D + 60, 0), (xb + W + 40, D + 60, z0), f"{z0/10:g} cm")
    m.cota((xb + W + 40, 0, z0 - 40), (xb + W + 40, D, z0 - 40), f"{D/10:g} cm")
    m.info = {"colgado_libre_mm": round(zr - z_colgar), "barra_desde_piso_mm": round(zr),
              "paso_entrepanos_b_mm": round(paso), "prof_caja_cajon_mm": prof,
              "margen_lateral_mm": round(xa)}
    return m


# ---------------------------------------------------------------------------
# Exportación
# ---------------------------------------------------------------------------
def a_3dm(m, path):
    model = r3.File3dm()
    model.Settings.ModelUnitSystem = r3.UnitSystem.Millimeters
    capas = {}
    for cat, (r, g, b, a) in COLORES.items():
        L = r3.Layer()
        L.Name = cat
        L.Color = (r, g, b, 255)
        capas[cat] = model.Layers.Add(L)
    for p in m.piezas:
        attr = r3.ObjectAttributes()
        attr.LayerIndex = capas[p["cat"]]
        attr.Name = p["nombre"]
        if p["tipo"] == "caja":
            x0, y0, z0, x1, y1, z1 = p["caja"]
            if p["cat"] == "hueco":
                # el espacio disponible como caja de líneas
                pts = [(x0, -y0, z0), (x1, -y0, z0), (x1, -y1, z0), (x0, -y1, z0)]
                for zz in (z0, z1):
                    pl = r3.Polyline([r3.Point3d(a, b, zz) for a, b, _ in pts + pts[:1]])
                    model.Objects.AddPolyline(pl, attr)
                for a, b, _ in pts:
                    model.Objects.AddLine(r3.Point3d(a, b, z0), r3.Point3d(a, b, z1), attr)
                continue
            bb = r3.BoundingBox(r3.Point3d(x0, -y1, z0), r3.Point3d(x1, -y0, z1))
            brep = r3.Brep.CreateFromBox(r3.Box(bb))
            model.Objects.AddBrep(brep, attr)
        else:
            pl = r3.Plane(r3.Point3d(p["x0"], -p["y"], p["z"]), r3.Vector3d(1, 0, 0))
            c = r3.Circle(p["d"] / 2)
            c.Plane = pl
            cyl = r3.Cylinder(c, p["x1"] - p["x0"])
            model.Objects.AddBrep(cyl.ToBrep(True, True), attr)
    model.Write(path, 6)  # formato Rhino 6


def a_glb(m, path):
    scene = trimesh.Scene()
    for i, p in enumerate(m.piezas):
        if p["cat"] == "hueco":
            continue
        if p["tipo"] == "caja":
            x0, y0, z0, x1, y1, z1 = p["caja"]
            mesh = trimesh.creation.box(extents=(x1 - x0, y1 - y0, z1 - z0))
            mesh.apply_translation(((x0 + x1) / 2, -(y0 + y1) / 2, (z0 + z1) / 2))
        else:
            mesh = trimesh.creation.cylinder(radius=p["d"] / 2, height=p["x1"] - p["x0"], sections=24)
            mesh.apply_transform(trimesh.transformations.rotation_matrix(math.pi / 2, (0, 1, 0)))
            mesh.apply_translation(((p["x0"] + p["x1"]) / 2, -p["y"], p["z"]))
        mat = trimesh.visual.material.PBRMaterial(
            name=p["cat"], baseColorFactor=COLORES[p["cat"]], roughnessFactor=0.8, metallicFactor=0.0)
        mesh.visual = trimesh.visual.TextureVisuals(material=mat)
        scene.add_geometry(mesh, node_name=f"{i:03d} {p['nombre']}", geom_name=f"{i:03d}_{p['cat']}")
    # Z-up (mm) -> Y-up (m) para glTF
    T = trimesh.transformations.rotation_matrix(-math.pi / 2, (1, 0, 0))
    T = trimesh.transformations.scale_matrix(0.001) @ T
    scene.apply_transform(T)
    scene.export(path)


def despiece(m):
    """Agrupa tableros por medidas (largo x ancho x espesor)."""
    grupos = {}
    for p in m.piezas:
        if p["tipo"] != "caja" or p["cat"] == "hueco":
            continue
        x0, y0, z0, x1, y1, z1 = p["caja"]
        d = sorted([round(x1 - x0), round(y1 - y0), round(z1 - z0)], reverse=True)
        base = p["nombre"].split(" ")
        nombre = " ".join(w for w in base if not w.isdigit())
        for pre in ("Mód. A ", "Mód. B "):
            nombre = nombre.replace(pre, "")
        nombre = nombre.replace(" izq", "").replace(" der", "")
        key = (d[2], d[0], d[1], p["cat"], nombre)
        grupos[key] = grupos.get(key, 0) + 1
    filas = [{"pieza": k[4], "cant": v, "largo": k[1], "ancho": k[2], "espesor": k[0], "cat": k[3]}
             for k, v in grupos.items()]
    filas.sort(key=lambda f: (-f["espesor"], -f["largo"] * f["ancho"]))
    return filas


def main():
    os.makedirs(OUT, exist_ok=True)
    resumen = {}
    for m in (hacer_cocina(PARAMS["cocina"]), hacer_comoda(PARAMS["comoda"]), hacer_closet(PARAMS["closet"])):
        a_3dm(m, os.path.join(OUT, f"{m.clave}.3dm"))
        a_glb(m, os.path.join(OUT, f"{m.clave}.glb"))
        resumen[m.clave] = {"titulo": m.titulo, "info": m.info, "despiece": despiece(m),
                            "cotas": m.cotas, "params": PARAMS[m.clave]}
        print(m.clave, m.info, len(m.piezas), "piezas")
    with open(os.path.join(OUT, "despiece.json"), "w") as f:
        json.dump(resumen, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    sys.exit(main())
