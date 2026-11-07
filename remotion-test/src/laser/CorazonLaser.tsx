import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {C, FPS, HANDLE, WEB} from './tema';
import {Fondo, Subtitulos, Logo, PuntoLaser, puntoEn, pl, Texturas, useFuentes, SCRIPT, SANS, ease, seg} from './comunes';
import T from './tiempos.json';
import D from './datos.json';

const V = T.v2;
export const DURACION_V2 = Math.round(V.duracion * FPS);
const K = 14.2; // px por mm
const H = D.corazon;

// zigzag de corte entre las dos mitades (x≈0, de arriba a abajo)
const ZZ: number[][] = (() => { const y0 = -28, y1 = 30; const p: number[][] = []; for (let i = 0; i <= 8; i++) p.push([i === 0 || i === 8 ? 0 : (i % 2 ? 4.2 : -4.2), y0 + (y1 - y0) * i / 8]); return p; })();

export const CorazonLaser: React.FC = () => {
  useFuentes();
  const f = useCurrentFrame(); const t = f / FPS;
  const E = (a: number, b: number) => ease(seg(f, a, b));
  const pulso = Math.sin(f / 6) * 0.5 + 0.5;
  // fases
  const kc = E(0.5, 2.0);          // contorno del corazón
  const kz = E(3.3, 4.7);          // zigzag
  const sep = E(4.75, 5.5) * (1 - E(6.35, 6.6)); // separación de mitades
  const kn = E(5.0, 6.4);          // grabado de nombres
  const fin = t >= 9.5;
  const heart = puntoEn(H.completoPts as number[][], kc);
  const zz = puntoEn(ZZ, kz);
  const lift = E(1.9, 2.4);
  const nombres = ['Ana', 'Luis'];
  const click = Math.max(0, 1 - Math.abs(t - 6.6) / 0.18);
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Fondo pulso={pulso} />
      {!fin && <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: E(0.1, 0.6)}}>
        <div style={{fontWeight: 700, fontSize: 40, letterSpacing: 12, color: C.ambar}}>LLAVEROS DE PAREJA</div>
        <div style={{fontFamily: SCRIPT, fontSize: 150, color: C.crema, lineHeight: 1.05}}>Un corazón,<br />dos llaveros</div>
      </div>}
      {!fin && <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', justifyContent: 'center', opacity: 1 - E(9.0, 9.5)}}>
        <svg width={H.w * K + 200} height={H.h * K + 240} viewBox={`${-H.w / 2 - 7} ${-H.h / 2 - 8} ${H.w + 14} ${H.h + 22}`} style={{overflow: 'visible'}}>
          <defs><Texturas id="tx" madera="cedro" />
            <filter id="gl"><feGaussianBlur stdDeviation="0.5" /></filter>
            <filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy={0.8 + 2.2 * lift} stdDeviation={1 + 1.6 * lift} floodColor="#000" floodOpacity="0.75" /></filter>
            {[0, 1].map((i) => <clipPath key={i} id={`cn${i}`}><rect x={i === 0 ? -33 : -1} y={-32} width={34 * kn} height={64} /></clipPath>)}
          </defs>
          {/* tablón detrás: se ve cuando el corazón sale */}
          <g opacity={1 - E(1.9, 2.3) * 0.0}>
            <rect x={-H.w / 2 - 4} y={-H.h / 2 - 5} width={H.w + 8} height={H.h + 10} rx={4} fill="url(#tx)" opacity={1 - E(5.6, 6.2)} />
            <rect x={-H.w / 2 - 4} y={-H.h / 2 - 5} width={H.w + 8} height={H.h + 10} rx={4} fill="#000" opacity={0.2 * (1 - E(5.6, 6.2))} />
          </g>
          {/* corazón: dos mitades */}
          {[0, 1].map((i) => {
            const m = H.mitades[i]; const dir = i === 0 ? -1 : 1;
            const dx = dir * (sep * 9 + (1 - E(6.35, 6.6)) * 0); const rot = dir * sep * 7;
            return <g key={i} transform={`translate(${dx} ${-sep * 2}) rotate(${rot})`} filter="url(#sh)">
              <path d={m.cutD} fill="url(#tx)" fillRule="evenodd" />
              <path d={m.cutD} fill="none" stroke="#3a1a08" strokeWidth={0.4} />
              <g clipPath={`url(#cn${i})`}><path d={m.fillD} fill={C.quema} fillOpacity={0.92} fillRule="evenodd" /></g>
              {t > 6.4 && <circle cx={m.ring[0]} cy={m.ring[1]} r={4.6} fill="none" stroke="#9aa0a8" strokeWidth={1.3} />}
            </g>;
          })}
          {/* trazos del láser */}
          {kc > 0 && kc < 1 && <><polyline points={pl(heart.parcial)} fill="none" stroke="#3a1a08" strokeWidth={0.6} /><polyline points={pl(puntoEn(H.completoPts as number[][], Math.max(0, kc - 0.06)).parcial)} fill="none" stroke="#ffb066" strokeWidth={1} filter="url(#gl)" /></>}
          {kc > 0 && kc < 1 && <PuntoLaser x={heart.p[0]} y={heart.p[1]} r={0.9} />}
          {kz > 0 && kz < 1 && <><polyline points={pl(zz.parcial)} fill="none" stroke="#ffb066" strokeWidth={0.9} filter="url(#gl)" /><PuntoLaser x={zz.p[0]} y={zz.p[1]} r={0.9} /></>}
          {kn > 0 && kn < 1 && t > 5.0 && <PuntoLaser x={-20 + 40 * kn} y={4 + Math.sin(f * 1.7) * 6} r={0.8} />}
          {click > 0 && <circle cx={0} cy={0} r={10 + (1 - click) * 40} fill="none" stroke={C.ambar} strokeWidth={0.8} opacity={click} />}
        </svg>
      </div>}
      {fin && <div style={{position: 'absolute', inset: 0, opacity: E(9.5, 10.0)}}>
        <div style={{position: 'absolute', top: 130, left: 0, right: 0}}><Logo /></div>
        <img src={staticFile('laser/mockups/01_llaveros_pareja.png')} style={{position: 'absolute', left: 100, top: 640, width: 880, height: 880, WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 52%, transparent 71%)', transform: `scale(${1 + 0.02 * pulso})`}} />
        <div style={{position: 'absolute', top: 1470, left: 0, right: 0, textAlign: 'center', fontFamily: SCRIPT, fontSize: 110, color: C.ambar}}>con sus nombres grabados</div>
        <div style={{position: 'absolute', top: 1620, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 52, color: C.crema, WebkitTextStroke: '9px #000', paintOrder: 'stroke fill'} as React.CSSProperties}>{WEB}</div>
      </div>}
      <Subtitulos segmentos={V.segmentos} y={fin ? 450 : 760} />
      <Audio src={staticFile('laser/audio/mix_v2.mp3')} />
    </AbsoluteFill>
  );
};
