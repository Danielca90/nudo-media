import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {C, FPS, HANDLE, WEB} from './tema';
import {Fondo, Subtitulos, Logo, Mockup, useFuentes, SCRIPT, SANS, ease, seg} from './comunes';
import T from './tiempos.json';

const V = T.v3;
export const DURACION_V3 = Math.round(V.duracion * FPS);

export const NavidadCinco: React.FC = () => {
  useFuentes();
  const f = useCurrentFrame(); const t = f / FPS;
  const E = (a: number, b: number) => ease(seg(f, a, b));
  const pulso = Math.sin(f / 6) * 0.5 + 0.5;
  const items = V.items;
  const idx = items.reduce((a, it, i) => (t >= it.t ? i : a), -1);
  const fin = t >= V.fin;
  const intro = t < items[0].t;
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Fondo pulso={pulso} />
      {/* intro con adornos */}
      {intro && <div style={{position: 'absolute', inset: 0, opacity: 1 - E(3.2, 3.5)}}>
        <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.8 + 0.2 * E(0.2, 0.8)})`, opacity: E(0.2, 0.8)}}>
          <div style={{fontWeight: 700, fontSize: 40, letterSpacing: 12, color: C.ambar}}>ESTA NAVIDAD</div>
          <div style={{fontWeight: 800, fontSize: 240, color: C.crema, lineHeight: 1}}>5</div>
          <div style={{fontFamily: SCRIPT, fontSize: 120, color: C.ambar, marginTop: -6}}>regalos grabados en láser</div>
        </div>
        <Mockup img="05_adornos_navidad" y={900} size={1020} escala={0.95 + 0.05 * E(0.3, 1.2)} />
      </div>}
      {/* ítems */}
      {!fin && idx >= 0 && items.map((it, i) => {
        if (i !== idx) return null;
        const a = E(it.t, it.t + 0.45);
        const fade = i < items.length - 1 ? 1 - E(items[i + 1].t - 0.05, items[i + 1].t + 0.2) : 1 - E(V.fin - 0.1, V.fin + 0.2);
        return <div key={i} style={{position: 'absolute', inset: 0, opacity: Math.min(a, fade)}}>
          <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.5 + 0.5 * a})`}}>
            <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 230, height: 230, borderRadius: '50%', background: C.ambar, color: C.fondo, fontWeight: 800, fontSize: 150, boxShadow: `0 0 80px ${C.laser}66`}}>{it.n}</div>
          </div>
          <div style={{position: 'absolute', top: 410, left: 0, right: 0, textAlign: 'center', fontFamily: SCRIPT, fontSize: 108, color: C.crema}}>{it.nombre}</div>
          <Mockup img={it.img} y={930} size={1000} escala={0.92 + 0.08 * a + 0.03 * seg(f, it.t, it.t + 2)} />
        </div>;
      })}
      {fin && <div style={{position: 'absolute', inset: 0, opacity: E(V.fin, V.fin + 0.4)}}>
        <div style={{position: 'absolute', top: 200, left: 0, right: 0}}><Logo /></div>
        <div style={{position: 'absolute', top: 800, left: 0, right: 0, textAlign: 'center', fontFamily: SCRIPT, fontSize: 150, color: C.ambar, lineHeight: 1}}>Elige el tuyo</div>
        <div style={{position: 'absolute', top: 1010, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 64, color: C.crema}}>Escríbenos y lo grabamos<br />con tu nombre, foto o frase</div>
        <div style={{position: 'absolute', top: 1360, left: 0, right: 0, textAlign: 'center', fontSize: 58, fontWeight: 800, color: C.fondo}}>
          <span style={{background: C.ambar, padding: '18px 48px', borderRadius: 60, display: 'inline-block', transform: `scale(${1 + 0.05 * pulso})`}}>{WEB}</span></div>
        <div style={{position: 'absolute', top: 1560, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 60, color: C.crema, WebkitTextStroke: '9px #000', paintOrder: 'stroke fill'} as React.CSSProperties}>{HANDLE}</div>
      </div>}
      <Subtitulos segmentos={V.segmentos} y={fin ? 580 : 760} />
      <Audio src={staticFile('laser/audio/mix_v3.mp3')} />
    </AbsoluteFill>
  );
};
