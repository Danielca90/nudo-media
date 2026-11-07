import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C, EST, SERIF, SANS} from '../carrusel-incapacidades/tema';
import {Aparece, Aurora, Deco, Guirnalda, Linea, Logo, Modo, tinta, useAp, useFuentes} from '../carrusel-incapacidades/Base';

export const VW = 1080;
export const VH = 1920;
export const FPS = 30;
export const FRAMES = 450;
export const s2f = (s: number) => Math.round(s * FPS);

const fondoDe = (m: Modo) =>
  m === 'claro'
    ? C.hueso
    : m === 'verde'
      ? `radial-gradient(ellipse 130% 70% at 80% 10%, ${C.glowVerde} 0%, ${C.verde} 45%, ${C.baseVerde} 100%)`
      : `radial-gradient(ellipse 130% 70% at 80% 10%, ${C.glowNavy} 0%, ${C.navy} 45%, ${C.navyOsc} 100%)`;

// Escena: ventana con fondo propio; entra con fade rápido y desenfoque
export const Escena: React.FC<{desde: number; hasta: number; modo: Modo; children: React.ReactNode; marca?: string}> = ({desde, hasta, modo, children, marca}) => {
  return (
    <Sequence from={s2f(desde)} durationInFrames={s2f(hasta - desde) + 6} layout="none">
      <EscenaInt modo={modo} marca={marca}>{children}</EscenaInt>
    </Sequence>
  );
};
const EscenaInt: React.FC<{modo: Modo; marca?: string; children: React.ReactNode}> = ({modo, marca, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const claro = modo === 'claro';
  return (
    <AbsoluteFill style={{background: fondoDe(modo), opacity: o, color: tinta(modo), fontFamily: SANS, overflow: 'hidden'}}>
      {marca && <div style={{position: 'absolute', left: -60 - f * 0.9, bottom: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 700, lineHeight: 0.8, letterSpacing: -24, color: claro ? C.navy : '#fff', opacity: 0.06, whiteSpace: 'nowrap'}}>{marca}</div>}
      <Aurora claro={claro} alto={VH} />
      <Deco claro={claro} alto={VH} />
      <Guirnalda modo={modo} />
      <div style={{position: 'absolute', top: 128, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Logo claro={claro} h={128} />
      </div>
      {children}
    </AbsoluteFill>
  );
};

export const Grande: React.FC<{t: string; size: number; d?: number; color?: string; italic?: boolean; style?: React.CSSProperties}> = ({t, size, d = 0, color, italic, style}) => (
  <div style={{position: 'absolute', fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: -2, fontStyle: italic ? 'italic' : 'normal', color, ...style}}>
    <Linea d={d}>{t}</Linea>
  </div>
);

export const Chip: React.FC<{t: string; nota: string; d: number; icono?: string; top: number; dorado?: boolean; oscuro?: boolean; grande?: boolean}> = ({t, nota, d, icono = '✓', top, dorado, oscuro, grande}) => {
  const k = grande ? 1.3 : 1;
  const p = useAp(d, 16, 140);
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top, transform: `translateX(${(1 - p) * 420}px) scale(${0.96 + 0.04 * p})`, opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * 14}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, background: dorado ? C.oro : oscuro ? C.panelOsc : C.hueso, color: dorado ? C.navyOsc : oscuro ? C.hueso : C.navy, borderRadius: EST.chip === 'tarjeta' ? 44 : 80, padding: `${26 * k}px 40px`, boxShadow: '0 24px 50px #0000004d'}}>
        <div style={{width: 84 * k, height: 84 * k, borderRadius: EST.chip === 'tarjeta' ? 22 : '50%', background: dorado ? C.navyOsc : C.oro, color: C.hueso, fontSize: 46 * k, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icono}</div>
        <div>
          <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 56 * k, lineHeight: 1.05}}>{t}</div>
          <div style={{fontSize: 32 * k, fontWeight: 600, opacity: 0.85, marginTop: 4}}>{nota}</div>
        </div>
      </div>
    </div>
  );
};

// Subtítulos palabra por palabra (zona media, borde negro, palabra clave resaltada)
export const Subs: React.FC<{caps: Caption[]; claves: string[]}> = ({caps, claves}) => {
  useFuentes();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / FPS;
  const bloques: number[][] = [];
  let cur: number[] = [];
  caps.forEach((c, i) => {
    cur.push(i);
    if (/[.,:?!]$/.test(c.text) || cur.length >= 4) {
      bloques.push(cur);
      cur = [];
    }
  });
  if (cur.length) bloques.push(cur);
  const ini = (i: number) => caps[i].startMs / 1000 - 0.05;
  const idx = bloques.findIndex((b, k) => {
    const fin = bloques[k + 1] ? ini(bloques[k + 1][0]) : caps[b[b.length - 1]].endMs / 1000 + 0.8;
    return t >= ini(b[0]) && t < fin;
  });
  if (idx < 0) return null;
  const vis = bloques[idx].filter((i) => ini(i) <= t);
  const activa = vis[vis.length - 1];
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: VH * 0.41 - 70, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 70, lineHeight: 1.25}}>
      {vis.map((i) => {
        const w = caps[i];
        const sp = spring({frame: f - Math.round(ini(i) * FPS), fps, config: {damping: 14, stiffness: 260}});
        const clave = claves.includes(w.text);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 10px',
              padding: clave ? '0 16px 6px' : 0,
              borderRadius: 10,
              background: clave ? C.oro : 'transparent',
              color: i === activa || clave ? '#fff' : '#d4d4d4',
              WebkitTextStroke: '8px #000',
              paintOrder: 'stroke fill',
              transform: `scale(${0.85 + 0.15 * sp + (i === activa ? 0.04 : 0)})`,
              opacity: Math.min(1, sp * 1.5),
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const Boton: React.FC<{t: string; d: number; top: number}> = ({t, d, top}) => {
  const f = useCurrentFrame();
  const pulso = 1 + 0.025 * Math.sin(f / 5);
  return (
    <Aparece d={d} style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `scale(${pulso})`, background: C.oro, color: C.navyOsc, padding: '34px 70px', borderRadius: 80, fontSize: 52, fontWeight: 700, boxShadow: '0 24px 60px #00000066'}}>{t}</div>
    </Aparece>
  );
};

export const Aviso: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 1620, textAlign: 'center', fontSize: 24, opacity: 0.6, color: C.hueso}}>Orientación general, no es asesoría legal.</div>
);

export const LogoCierre: React.FC<{top: number; d?: number}> = ({top, d = 24}) => (
  <Aparece d={d} style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center'}}>
    <Logo h={400} />
  </Aparece>
);
