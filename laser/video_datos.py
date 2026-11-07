#!/usr/bin/env python3
"""Exporta a Remotion la geometría real de los diseños (mismos trazos que el archivo del láser) + texturas de madera."""
import os, sys, json, shutil, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.disenos import *
from lib.export import _d_geom
from lib.geom import lineas
from shapely.ops import unary_union

AQUI = os.path.dirname(os.path.abspath(__file__))
REM = os.path.join(AQUI, '..', 'remotion-test')

def pts(g, tol=0.03):
    out = []
    for r in lineas(g.simplify(tol)):
        out.append([[round(x, 2), round(y, 2)] for x, y in r])
    return out

def dpath(gs, tol=0.03):
    return ' '.join(_d_geom(g.simplify(tol) if not g.is_empty else g) for g in gs).replace('.000', '')

datos = {}
# llavero del sorteo
p = llavero(1)
cut = unary_union(p['cut'])
datos['llavero'] = dict(w=60, h=34, cutD=dpath(p['cut']), cutPts=pts(p['cut'][0].exterior.__class__ and cut.exterior if cut.geom_type == 'Polygon' else cut)[0],
                        holePts=pts(cut)[1] if len(pts(cut)) > 1 else [], fillD=dpath(p['fill'][:2]), numD=dpath([p['fill'][2]]), scoreD=dpath(p['score']))
datos['llavero_nums'] = {str(n): dpath([llavero(n)['fill'][2]]) for n in range(1, 6)}
# corazón de pareja
d = d01({})
mitades = []
for pc, (tx, ty) in zip(d['hoja'], [(36, 34), (98, 34)]):
    q = poner(pc, -tx, -ty)
    c = unary_union(q['cut'])
    mitades.append(dict(cutD=dpath(q['cut']), cutPts=pts(c)[0], fillD=dpath(q['fill']), holePts=pts(c)[1] if len(pts(c)) > 1 else [], ring=q['deco'][0][1:]))
datos['corazon'] = dict(mitades=mitades, completoD=dpath([corazon(62)]), completoPts=pts(corazon(62))[0], w=62, h=56)
json.dump(datos, open(os.path.join(REM, 'src', 'laser', 'datos.json'), 'w'))
print('datos.json', os.path.getsize(os.path.join(REM, 'src', 'laser', 'datos.json')), 'bytes')

# mockups → public
for f in os.listdir(os.path.join(AQUI, 'mockups')):
    if f.endswith('.png'): shutil.copy(os.path.join(AQUI, 'mockups', f), os.path.join(REM, 'public', 'laser', 'mockups', f))

# texturas de madera (PNG 1200×800)
def tex(nombre, c1, c2, seed):
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs>'
           '<filter id="g" x="0" y="0" width="100%%" height="100%%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.075" numOctaves="4" seed="%d"/>'
           '<feColorMatrix values="0 0 0 0 .30  0 0 0 0 .16  0 0 0 0 .05  0 0 0 1.7 -.6"/></filter>'
           '<filter id="f" x="0" y="0" width="100%%" height="100%%"><feTurbulence type="fractalNoise" baseFrequency="0.7 0.03" numOctaves="2" seed="%d"/>'
           '<feColorMatrix values="0 0 0 0 .30  0 0 0 0 .16  0 0 0 0 .05  0 0 0 1.1 -.45"/></filter></defs>'
           '<rect width="1200" height="800" fill="%s"/><rect width="1200" height="800" fill="%s" opacity=".25"/>'
           '<rect width="1200" height="800" filter="url(#g)" opacity=".85"/><rect width="1200" height="800" filter="url(#f)" opacity=".35"/></svg>') % (seed, seed + 3, c1, c2)
    open('/tmp/tex_%s.svg' % nombre, 'w').write(svg)
    return ['/tmp/tex_%s.svg' % nombre, os.path.join(REM, 'public', 'laser', 'madera_%s.png' % nombre), 1200, 800, 1]
jobs = [tex('pino', '#e6c994', '#d4ac6e', 3), tex('cedro', '#c98d62', '#a96c43', 8)]
subprocess.run(['node', os.path.join(AQUI, 'lib', 'render.js'), json.dumps(jobs)], check=True, env=dict(os.environ, NODE_PATH=subprocess.check_output(['npm', 'root', '-g']).decode().strip()))
print('texturas ok')
