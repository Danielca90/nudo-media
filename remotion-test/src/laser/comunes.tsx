import React from 'react';
import {AbsoluteFill, delayRender, continueRender, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {C, FPS} from './tema';

// ---------- fuentes ----------
const FUENTES = [
  ['Parisienne', 'parisienne-latin-400-normal.woff2', '400'],
  ['Montserrat', 'montserrat-latin-400-normal.woff2', '400'],
  ['Montserrat', 'montserrat-latin-700-normal.woff2', '700'],
  ['Montserrat', 'montserrat-latin-800-normal.woff2', '800'],
];
export const useFuentes = () => {
  const [h] = React.useState(() => delayRender('fuentes'));
  React.useEffect(() => {
    Promise.all(FUENTES.map(([fam, f, w]) => {
      const ff = new FontFace(fam, `url(${staticFile('laser/fuentes/' + f)})`, {weight: w});
      return ff.load().then((x) => document.fonts.add(x));
    })).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};
export const SCRIPT = '"Parisienne", cursive';
export const SANS = '"Montserrat", "Inter", Arial, sans-serif';

export const rnd = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const ease = (t: number) => Easing.bezier(0.22, 1, 0.36, 1)(Math.min(1, Math.max(0, t)));
export const seg = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f / FPS - a) / (b - a)));

// ---------- fondo: café oscuro, luz ámbar y brasas ----------
export const Fondo: React.FC<{pulso?: number}> = ({pulso = 0}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 55% at 50% 58%, #3a2210 0%, ${C.fondo2} 55%, #0d0603 100%)`}}>
      <AbsoluteFill style={{opacity: 0.1 + pulso * 0.05}}>
        {Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 150 + 30, height: 2, background: C.ambar}} />)}
      </AbsoluteFill>
      {Array.from({length: 26}).map((_, i) => {
        const x = rnd(i) * 1080, v = 18 + rnd(i + 50) * 40, s = 2 + rnd(i + 9) * 5;
        const y = (1920 + 100 - ((frame * v / 30 * 6 + rnd(i + 3) * 2000) % 2020));
        return <div key={i} style={{position: 'absolute', left: x + Math.sin(frame / 25 + i) * 18, top: y, width: s, height: s, borderRadius: '50%', background: C.ambar, opacity: 0.12 + rnd(i + 20) * 0.35, boxShadow: `0 0 ${s * 4}px ${C.laser}`}} />;
      })}
    </AbsoluteFill>
  );
};

// ---------- subtítulos palabra por palabra (media altura, borde negro, palabra clave resaltada) ----------
type Seg = {t0: number; t1: number; texto: string; claves: string[]};
export const Subtitulos: React.FC<{segmentos: Seg[]; y?: number}> = ({segmentos, y = 790}) => {
  const frame = useCurrentFrame(); const t = frame / FPS;
  const s = segmentos.find((q) => t >= q.t0 - 0.05 && t < q.t1 + 0.45);
  if (!s) return null;
  const palabras = s.texto.split(' ');
  const total = palabras.reduce((a, w) => a + w.length + 2, 0);
  let acc = 0;
  const tiempos = palabras.map((w) => { const a = s.t0 + (s.t1 - s.t0) * acc / total; acc += w.length + 2; return a; });
  // bloques de ≤ 4 palabras, cortando en puntuación
  const bloques: number[][] = []; let cur: number[] = [];
  palabras.forEach((w, i) => { cur.push(i); if (/[.,?!]$/.test(w) || cur.length >= 4) { bloques.push(cur); cur = []; } });
  if (cur.length) bloques.push(cur);
  const b = [...bloques].reverse().find((bl) => tiempos[bl[0]] - 0.04 <= t) || bloques[0];
  const activa = [...b].reverse().find((i) => tiempos[i] - 0.04 <= t) ?? b[0];
  return (
    <div style={{position: 'absolute', left: 60, right: 160, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px', fontFamily: SANS, fontWeight: 800, fontSize: 74, textTransform: 'uppercase', lineHeight: 1.1, textAlign: 'center'}}>
      {b.map((i) => {
        if (tiempos[i] - 0.04 > t) return null;
        const w = palabras[i]; const clave = s.claves.some((k) => k.toLowerCase() === w.toLowerCase());
        const k = ease((t - tiempos[i] + 0.04) / 0.15);
        return <span key={i} style={{display: 'inline-block', transform: `scale(${0.85 + 0.15 * k})`, opacity: k, color: clave ? C.fondo : (i === activa ? '#fff' : 'rgba(255,255,255,.62)'),
          background: clave ? C.ambar : 'none', padding: clave ? '0 14px' : 0, borderRadius: 14,
          WebkitTextStroke: clave ? '0' : '10px #000', paintOrder: 'stroke fill', textShadow: clave ? 'none' : '0 6px 18px rgba(0,0,0,.5)'} as React.CSSProperties}>{w}</span>;
      })}
    </div>
  );
};

// ---------- logo Nudo (como en la web) ----------
export const Logo: React.FC<{escala?: number}> = ({escala = 1}) => (
  <div style={{textAlign: 'center', transform: `scale(${escala})`}}>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 120, letterSpacing: 26, color: C.crema, paddingLeft: 26}}>NUDO</div>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 12, color: C.ambar, marginTop: -4}}>DESIGN · GRABADO LÁSER</div>
  </div>
);

// ---------- punto láser con halo ----------
export const PuntoLaser: React.FC<{x: number; y: number; on?: boolean; r?: number}> = ({x, y, on = true, r = 16}) => !on ? null : (
  <g>
    <circle cx={x} cy={y} r={r * 5} fill={C.laser} opacity={0.16} />
    <circle cx={x} cy={y} r={r * 2.4} fill="#ffb066" opacity={0.45} />
    <circle cx={x} cy={y} r={r} fill="#fff4e0" />
  </g>
);

// punto sobre polilínea a fracción f ∈ [0,1]
export const puntoEn = (pts: number[][], f: number) => {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1]; const d = Math.min(1, Math.max(0, f)) * tot;
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / (L[i] - L[i - 1] || 1);
  const parcial = [...pts.slice(0, i), [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]];
  return {p: parcial[parcial.length - 1], parcial};
};
export const pl = (pts: number[][]) => pts.map((p) => p.join(',')).join(' ');

// madera: patrón con la textura renderizada
export const Texturas: React.FC<{id: string; madera: 'pino' | 'cedro'}> = ({id, madera}) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={140} height={93} x={-20} y={-20}>
    <image href={staticFile(`laser/madera_${madera}.png`)} width={140} height={93} preserveAspectRatio="none" />
  </pattern>
);

// cuadro con mockup (mismo fondo oscuro, bordes difuminados)
export const Mockup: React.FC<{img: string; size?: number; escala?: number; y?: number}> = ({img, size = 1020, escala = 1, y = 0}) => (
  <img src={staticFile(`laser/mockups/${img}.png`)} style={{position: 'absolute', left: (1080 - size) / 2, top: y, width: size, height: size, transform: `scale(${escala})`,
    WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 52%, transparent 71%)', maskImage: 'radial-gradient(circle at 50% 50%, #000 52%, transparent 71%)'}} />
);
