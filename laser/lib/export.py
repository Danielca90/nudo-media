"""Exportadores: SVG (para LightBurn), .lbrn2 (proyecto LightBurn) y mockups SVG."""
import math
from shapely.ops import unary_union
from shapely.geometry import box
from .geom import anillos, lineas, mover

# Ajustes de partida Creality Falcon2 22 W (LightBurn: velocidad en mm/s). SIEMPRE hacer una prueba de material.
CAPAS = [
    dict(i=0, nombre='01 CORTE', tipo='Cut', color='#FF0000', vel=7, pot=100, pasadas=2, nota='Corte 3 mm: 420 mm/min, 100 %, 2 pasadas, aire activado'),
    dict(i=1, nombre='02 GRABADO RELLENO', tipo='Scan', color='#000000', vel=100, pot=45, pasadas=1, interval=0.1, nota='Relleno: 6000 mm/min, 45 %, 0,1 mm (254 LPI), bidireccional'),
    dict(i=2, nombre='03 LINEA MARCADO', tipo='Cut', color='#0000FF', vel=40, pot=22, pasadas=1, nota='Línea fina: 2400 mm/min, 22 %'),
]

def normalizar(hoja, margen=5, w=None, h=None):
    gs = [g for p in hoja for k in ('cut', 'fill', 'score') for g in p[k] if not g.is_empty]
    x0, y0, x1, y1 = unary_union(gs).bounds
    dx, dy = margen - x0, margen - y0
    nh = [dict(cut=[mover(g, dx, dy) for g in p['cut']], fill=[mover(g, dx, dy) for g in p['fill']],
               score=[mover(g, dx, dy) for g in p['score']], deco=p['deco']) for p in hoja]
    return nh, (x1 - x0 + 2*margen, y1 - y0 + 2*margen)

def _d(rings, cerrar=True):
    s = []
    for r in rings:
        if len(r) < 2: continue
        s.append('M' + ' L'.join('%.2f %.2f' % (x, y) for x, y in r) + (' Z' if cerrar else ''))
    return ' '.join(s)

def _d_geom(g, cerrar=True):
    out = []
    for r in lineas(g):
        closed = len(r) > 2 and abs(r[0][0]-r[-1][0]) < 1e-6 and abs(r[0][1]-r[-1][1]) < 1e-6
        out.append(_d([r], closed))
    return ' '.join(out)

def svg_hoja(hoja, size):
    W, H = size
    cut = ' '.join(_d_geom(g) for p in hoja for g in p['cut'])
    fill = ' '.join(_d_geom(g) for p in hoja for g in p['fill'])
    score = ' '.join(_d_geom(g) for p in hoja for g in p['score'])
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.2fmm" height="%.2fmm" viewBox="0 0 %.2f %.2f">\n'
            '  <!-- Rojo = CORTE · Negro relleno = GRABADO · Azul = LÍNEA DE MARCADO. 1 unidad = 1 mm -->\n'
            '  <g id="02_GRABADO_RELLENO"><path d="%s" fill="#000000" fill-rule="evenodd" stroke="none"/></g>\n'
            '  <g id="03_LINEA_MARCADO"><path d="%s" fill="none" stroke="#0000FF" stroke-width="0.1"/></g>\n'
            '  <g id="01_CORTE"><path d="%s" fill="none" stroke="#FF0000" stroke-width="0.1"/></g>\n'
            '</svg>\n') % (W, H, W, H, fill, score, cut)

def _shape(rings, cut_index):
    verts, prims = [], []
    for r in rings:
        if len(r) < 2: continue
        pts = list(r)
        closed = len(pts) > 2 and abs(pts[0][0]-pts[-1][0]) < 1e-6 and abs(pts[0][1]-pts[-1][1]) < 1e-6
        if closed: pts = pts[:-1]
        base = len(verts)
        for x, y in pts:
            verts.append('V%.2f %.2fc0x%.2fc0y%.2fc1x%.2fc1y%.2f' % (x, y, x, y, x, y))
        n = len(pts)
        for k in range(n - 1): prims.append('L%d %d' % (base + k, base + k + 1))
        if closed: prims.append('L%d %d' % (base + n - 1, base))
    if not verts: return ''
    return ('    <Shape Type="Path" CutIndex="%d" PowerScale="100">\n        <XForm>1 0 0 1 0 0</XForm>\n'
            '        <VertList>%s</VertList>\n        <PrimList>%s</PrimList>\n    </Shape>\n') % (cut_index, ''.join(verts), ''.join(prims))

def lbrn2(hoja, nombre='Nudo'):
    o = ['<?xml version="1.0" encoding="UTF-8"?>\n',
         '<LightBurnProject AppVersion="1.7.00" DeviceName="Creality Falcon2 22W" FormatVersion="1" MaterialHeight="3" MirrorX="False" MirrorY="False">\n',
         '    <VariableText>\n        <Start Value="0"/>\n        <End Value="999"/>\n        <Current Value="0"/>\n        <Increment Value="1"/>\n        <AutoAdvance Value="0"/>\n    </VariableText>\n']
    for c in CAPAS:
        o.append('    <CutSetting type="%s">\n        <index Value="%d"/>\n        <name Value="%s"/>\n' % (c['tipo'], c['i'], c['nombre']))
        o.append('        <minPower Value="%d"/>\n        <maxPower Value="%d"/>\n        <minPower2 Value="%d"/>\n        <maxPower2 Value="%d"/>\n' % (c['pot'], c['pot'], c['pot'], c['pot']))
        o.append('        <speed Value="%s"/>\n        <numPasses Value="%d"/>\n        <priority Value="%d"/>\n' % (c['vel'], c['pasadas'], c['i']))
        if c['tipo'] == 'Scan':
            o.append('        <interval Value="%s"/>\n        <bidir Value="1"/>\n        <overscan Value="1"/>\n        <overScanning Value="0"/>\n' % c['interval'])
        o.append('        <enableAirAssist Value="1"/>\n' if False else '')
        o.append('    </CutSetting>\n')
    # Orden de ejecución: primero grabados, luego líneas, y al final el corte (priority)
    for p in hoja:
        for g in p['fill']:
            for pol in (g.simplify(0.012).geoms if hasattr(g, 'geoms') else [g.simplify(0.012)]):
                if pol.is_empty or pol.geom_type != 'Polygon': continue
                o.append(_shape(anillos(pol), 1))
        for g in p['score']:
            for r in lineas(g.simplify(0.012)): o.append(_shape([r], 2))
    for p in hoja:
        for g in p['cut']:
            for pol in (g.geoms if hasattr(g, 'geoms') else [g]):
                if pol.is_empty: continue
                pol = pol.simplify(0.01); o.append(_shape(anillos(pol) if pol.geom_type == 'Polygon' else lineas(pol), 0))
    o.append('</LightBurnProject>\n')
    return ''.join(o)

# ------------------------------------------------------------ mockup
MADERAS = dict(pino=('#e6c994', '#d4ac6e'), cedro=('#c98d62', '#a96c43'))

def mockup_svg(d, W=1200, H=1200):
    esc = d['escena']
    gs = [g for p in esc for g in p['cut'] if not g.is_empty]
    x0, y0, x1, y1 = unary_union(gs).bounds
    pad = 0.16
    sc = min(W*(1-2*pad)/(x1-x0), H*(1-2*pad)/(y1-y0))
    cx, cy = (x0+x1)/2, (y0+y1)/2
    c1, c2 = MADERAS[d['madera']]
    defs = ['''<defs>
  <radialGradient id="bg" cx="50%%" cy="42%%" r="75%%"><stop offset="0" stop-color="#3a2210"/><stop offset=".55" stop-color="#1E120A"/><stop offset="1" stop-color="#0d0603"/></radialGradient>
  <radialGradient id="luz" cx="50%%" cy="40%%" r="55%%"><stop offset="0" stop-color="#D9A27E" stop-opacity=".30"/><stop offset="1" stop-color="#D9A27E" stop-opacity="0"/></radialGradient>
  <filter id="grain" x="0" y="0" width="100%%" height="100%%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.20" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .32  0 0 0 0 .18  0 0 0 0 .07  0 0 0 1.6 -.55"/></filter>
  <filter id="fino" x="0" y="0" width="100%%" height="100%%"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.05" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .3  0 0 0 0 .17  0 0 0 0 .06  0 0 0 1.2 -.5"/></filter>
  <filter id="sombra" x="-20%%" y="-20%%" width="140%%" height="140%%"><feDropShadow dx="0" dy="%.2f" stdDeviation="%.2f" flood-color="#000" flood-opacity=".65"/></filter>
  <filter id="quema" x="-5%%" y="-5%%" width="110%%" height="110%%"><feGaussianBlur stdDeviation="0.12"/></filter>
  <linearGradient id="brillo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
</defs>''' % (3.2/sc*6, 7/sc*3)]
    body = ['<rect width="%d" height="%d" fill="url(#bg)"/><rect width="%d" height="%d" fill="url(#luz)"/>' % (W, H, W, H)]
    # vetas de fondo (tablones oscuros)
    body.append('<g opacity=".13">' + ''.join('<rect x="0" y="%d" width="%d" height="2" fill="#D9A27E"/>' % (i*160 + 40, W) for i in range(8)) + '</g>')
    clips, items = [], []
    k = 0
    ring_defs = []
    for p in esc:
        paths_cut = ' '.join(_d_geom(g) for g in p['cut'])
        cid = 'c%d' % k; k += 1
        clips.append('<clipPath id="%s"><path d="%s" clip-rule="evenodd"/></clipPath>' % (cid, paths_cut))
        bx = unary_union(p['cut']).bounds
        item = ['<g filter="url(#sombra)"><path d="%s" fill="%s" fill-rule="evenodd"/></g>' % (paths_cut, c1),
                '<g clip-path="url(#%s)"><rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" opacity=".35"/>' % (cid, bx[0]-2, bx[1]-2, bx[2]-bx[0]+4, bx[3]-bx[1]+4, c2),
                '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" filter="url(#grain)" opacity=".75"/>' % (bx[0]-2, bx[1]-2, bx[2]-bx[0]+4, bx[3]-bx[1]+4),
                '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" filter="url(#fino)" opacity=".30"/>' % (bx[0]-2, bx[1]-2, bx[2]-bx[0]+4, bx[3]-bx[1]+4),
                '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="url(#brillo)"/></g>' % (bx[0]-2, bx[1]-2, bx[2]-bx[0]+4, bx[3]-bx[1]+4),
                '<path d="%s" fill="none" stroke="#4a2810" stroke-width="0.35" opacity=".75" stroke-linejoin="round"/>' % paths_cut,
                '<path d="%s" fill="none" stroke="#fff" stroke-width="0.18" opacity=".18" transform="translate(-0.12,-0.12)"/>' % paths_cut]
        if p['fill']:
            item.append('<g filter="url(#quema)"><path d="%s" fill="#2b1406" fill-opacity=".9" fill-rule="evenodd"/></g>' % ' '.join(_d_geom(g) for g in p['fill']))
        if p['score']:
            item.append('<path d="%s" fill="none" stroke="#2b1406" stroke-opacity=".85" stroke-width="0.4" stroke-linecap="round"/>' % ' '.join(_d_geom(g) for g in p['score']))
        items.append((bx, p, ''.join(item)))
    deco_back, deco_front = [], []
    out = []
    for bx, p, svg in items:
        extra = ''
        for dc in p['deco']:
            if dc[0] == 'ring':
                x, y = dc[1], dc[2]
                extra += ('<circle cx="%.2f" cy="%.2f" r="4.6" fill="none" stroke="#6e737a" stroke-width="1.5"/><circle cx="%.2f" cy="%.2f" r="4.6" fill="none" stroke="#d8dce0" stroke-width=".7" stroke-dasharray="7 3"/>' % (x, y, x, y))
            if dc[0] == 'cinta':
                top = bx[1]
                extra += '<path d="M%.2f %.2f Q%.2f %.2f %.2f %.2f" fill="none" stroke="#a8332a" stroke-width="1.1"/>' % ((bx[0]+bx[2])/2, top+1.5, (bx[0]+bx[2])/2, top-22, (bx[0]+bx[2])/2 + 4, top-34)
            if dc[0] == 'anilla_aguj':
                extra += ''
            if dc[0] == 'borla_top':
                extra += '<path d="M%.2f %.2f q-3 8 0 16 q3 8 0 14" fill="none" stroke="#a8332a" stroke-width="1.3"/>' % ((bx[0]+bx[2])/2, bx[1]+8)
        out.append(svg + extra)
    cuerda = ''
    for p in esc:
        for dc in p['deco']:
            if dc[0] == 'cuerda':
                pass
    if any(dc[0] == 'cuerda' for p in esc for dc in p['deco']):
        ys = (y0 - 14)
        cuerda = '<path d="M%.1f %.1f Q%.1f %.1f %.1f %.1f" fill="none" stroke="#b79a6b" stroke-width="0.9"/>' % (x0 - 6, ys + 4, (x0+x1)/2, ys - 10, x1 + 6, ys + 4)
    g = ('<g transform="translate(%.2f %.2f) scale(%.4f) translate(%.2f %.2f)">%s%s</g>' % (W/2, H/2, sc, -cx, -cy, cuerda, ''.join(out)))
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">%s%s%s</svg>'
            % (W, H, W, H, defs[0].replace('</defs>', ''.join(clips) + '</defs>'), ''.join(body), g))
