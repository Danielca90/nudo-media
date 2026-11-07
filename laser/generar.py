#!/usr/bin/env python3
"""Genera TODO: SVG + proyectos LightBurn (.lbrn2) + mockups PNG + hoja de ajustes.
Uso:  python3 laser/generar.py                      (todo)
      python3 laser/generar.py --solo 01 --set nombre1=Sofía nombre2=Juan
"""
import argparse, os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.disenos import DISENOS, sorteo, sorteo_escena
from lib.export import normalizar, svg_hoja, lbrn2, mockup_svg

AQUI = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('--solo', default=None); ap.add_argument('--set', nargs='*', default=[])
ap.add_argument('--sin-mockups', action='store_true'); ap.add_argument('--salida', default=AQUI)
a = ap.parse_args()
P = dict(s.split('=', 1) for s in a.set)
for sub in ('svg', 'lightburn', 'mockups'): os.makedirs(os.path.join(a.salida, sub), exist_ok=True)

lista = [f(P) for f in DISENOS if not a.solo or f.__name__[1:3] == a.solo[-2:]]
if not a.solo: lista += [sorteo(1), sorteo(2)]
res = []
for d in lista:
    hoja, size = normalizar(d['hoja'])
    open(os.path.join(a.salida, 'svg', d['id'] + '.svg'), 'w').write(svg_hoja(hoja, size))
    open(os.path.join(a.salida, 'lightburn', d['id'] + '.lbrn2'), 'w').write(lbrn2(hoja, d['id']))
    if d['escena'] and not a.sin_mockups:
        open(os.path.join(a.salida, 'mockups', d['id'] + '.svg'), 'w').write(mockup_svg(d))
    res.append(dict(id=d['id'], titulo=d['titulo'], madera=d['madera'], ancho_mm=round(size[0], 1), alto_mm=round(size[1], 1), nota=d['nota']))
    print('✓', d['id'], '%.0f×%.0f mm' % size)
json.dump(res, open(os.path.join(a.salida, 'catalogo.json'), 'w'), ensure_ascii=False, indent=1)

if not a.solo and not a.sin_mockups:
    d = sorteo_escena()
    open(os.path.join(a.salida, 'mockups', d['id'] + '.svg'), 'w').write(mockup_svg(d))
