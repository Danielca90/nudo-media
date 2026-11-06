"""Demo: maceta low poly + subdivision y tabla de pino procedural. Render, horneado y exportación.
blender -b -P demo_maceta_madera.py -- <carpeta_salida>"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
from nudo_bpy import *

OUT = sys.argv[-1]
escena_nueva(muestras=32, resolucion=(900, 700))
perfil = [(0,0),(.066,0),(.098,.02),(.112,.045),(.106,.07),(.094,.086),(.112,.094),(.112,.104),
          (.092,.104),(.084,.092),(.092,.06),(.082,.014),(0,.014)]          # metros: maceta de 22 cm
maceta = revolucion("maceta", perfil, segmentos=12)
subdivision(maceta, 2)
asignar(maceta, material_simple("ceramica", (0.72, 0.36, 0.22), rugosidad=0.45))
tabla = caja("tabla", -0.30, -0.15, 0, 0.30, 0.15, 0.018, bisel=0.002)
asignar(tabla, material_madera("pino", "pino", direccion="X"))
maceta.location.z = 0.018
piso(4); sol()
cam = camara(lente=60); encuadrar(cam, [maceta, tabla], direccion=(0.9, -1.4, 0.9), margen=1.05)
render(os.path.join(OUT, "demo.png"))
hornear_textura(tabla, os.path.join(OUT, "pino_color.png"), "DIFFUSE", 512)
exportar([maceta, tabla], os.path.join(OUT, "demo.glb"))
guardar_blend(os.path.join(OUT, "demo.blend"))
