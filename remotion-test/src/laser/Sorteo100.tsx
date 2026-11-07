import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {Audio} from '@remotion/media';
import {C, FPS, HANDLE} from './tema';
import {Fondo, Subtitulos, Logo, PuntoLaser, puntoEn, pl, Texturas, useFuentes, SCRIPT, SANS, ease, seg, rnd} from './comunes';
import T from './tiempos.json';
import D from './datos.json';

const V = T.v1;
export const DURACION_V1 = Math.round(V.duracion * FPS);

// Llavero con corte trazado y grabado por barrido de láser. kc = progreso de corte, kg = progreso de grabado
const Llavero: React.FC<{kc: number; kg: number; num?: string; escala: number; id: string}> = ({kc, kg, num, escala, id}) => {
  const L = D.llavero;
  const {p, parcial} = puntoEn(L.cutPts as number[][], kc);
  const reciente = puntoEn(L.cutPts as number[][], Math.max(0, kc - 0.07)).parcial;
  const barrido = kg * L.w;
  const yz = L.h / 2 + Math.sin(kg * 60) * (L.h * 0.4);
  return (
    <svg width={L.w * escala} height={L.h * escala} viewBox={`-3 -3 ${L.w + 6} ${L.h + 6}`} style={{overflow: 'visible'}}>
      <defs><Texturas id={id} madera="cedro" />
        <filter id={id + 'b'}><feGaussianBlur stdDeviation="0.5" /></filter>
        <filter id={id + 's'} x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="1.4" stdDeviation="1.6" floodColor="#000" floodOpacity="0.7" /></filter>
        <clipPath id={id + 'c'}><rect x="-5" y="-5" width={Math.max(0, barrido + 5)} height={L.h + 10} /></clipPath>
      </defs>
      <g filter={`url(#${id}s)`}><path d={L.cutD} fill={`url(#${id})`} fillRule="evenodd" /></g>
      <polyline points={pl(parcial)} fill="none" stroke="#3a1a08" strokeWidth={0.55} strokeLinejoin="round" />
      {kc > 0 && kc < 1 && <polyline points={pl(reciente)} fill="none" stroke="#ffb066" strokeWidth={0.9} filter={`url(#${id}b)`} />}
      <g clipPath={`url(#${id}c)`}>
        <path d={L.fillD} fill={C.quema} fillOpacity={0.92} fillRule="evenodd" />
        {num !== undefined && <path d={num} fill={C.quema} fillOpacity={0.92} />}
        <path d={L.scoreD} fill="none" stroke={C.quema} strokeWidth={0.4} />
      </g>
      {kc > 0 && kc < 1 && <PuntoLaser x={p[0]} y={p[1]} r={0.9} />}
      {kg > 0 && kg < 1 && <PuntoLaser x={barrido} y={yz} r={0.9} />}
    </svg>
  );
};

const Mini: React.FC<{i: number; aparece: number}> = ({i, aparece}) => {
  const k = ease(aparece);
  return <div style={{width: 92, height: 54, opacity: k, transform: `scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * 25}deg)`}}>
    <svg width="92" height="54" viewBox="-1 -1 62 36"><defs><Texturas id={`m${i}`} madera="cedro" /></defs>
      <path d={D.llavero.cutD} fill={`url(#m${i})`} fillRule="evenodd" />
      <path d={D.llavero.fillD} fill={C.quema} fillOpacity={0.9} /></svg></div>;
};

const Burbuja: React.FC<{t: number; n: string; texto: string; color: string; y: number}> = ({t, n, texto, color, y}) => {
  const k = ease(t);
  return <div style={{position: 'absolute', left: 90, top: y, transform: `translateX(${(1 - k) * -300}px) scale(${0.8 + 0.2 * k})`, opacity: k, display: 'flex', alignItems: 'center', gap: 22}}>
    <div style={{width: 84, height: 84, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.fondo}}>{texto[0] === '¡' ? texto[1] : texto[0]}</div>
    <div style={{background: 'rgba(246,240,232,.96)', color: C.fondo, borderRadius: 40, padding: '22px 36px', fontFamily: SANS, fontWeight: 700, fontSize: 42, boxShadow: '0 12px 30px rgba(0,0,0,.45)'}}>{texto}</div>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.ambar, WebkitTextStroke: '7px #000', paintOrder: 'stroke fill'} as React.CSSProperties}>{n}</div>
  </div>;
};

export const Sorteo100: React.FC = () => {
  useFuentes();
  const f = useCurrentFrame(); const t = f / FPS;
  const E = (a: number, b: number) => ease(seg(f, a, b));
  // encabezado persistente: 100 enorme
  const cuenta = t < 5.9 ? 100 : Math.min(100, Math.round(100 * E(5.9, 8.5)));
  const hk = E(0.05, 0.6);
  const A = t < 5.7 ? 1 : 0;
  const escA = 0.9 + 0.1 * E(0.3, 1);
  const grid = t >= 5.6 && t < 9.5;
  const comentarios = t >= 9.4 && t < 13.5;
  const reglas = t >= 13.3 && t < 17.7;
  const fin = t >= 17.4;
  const pulso = Math.sin(f / 5) * 0.5 + 0.5;
  const salida = (a: number, b: number) => 1 - E(a, b);
  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Fondo pulso={pulso} />
      {/* encabezado */}
      {!fin && <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', transform: `scale(${0.7 + 0.3 * hk})`, opacity: hk}}>
        <div style={{fontWeight: 700, fontSize: 40, letterSpacing: 12, color: C.ambar}}>CORTÉ EN LÁSER</div>
        <div style={{fontWeight: 800, fontSize: 330, lineHeight: 0.95, color: C.crema, textShadow: `0 0 60px ${C.laser}55`, WebkitTextStroke: '0'}}>{cuenta}</div>
        <div style={{fontFamily: SCRIPT, fontSize: 92, color: C.ambar, marginTop: -12}}>productos para regalar</div>
      </div>}
      {/* A: llavero grande cortándose */}
      {t < 5.9 && <div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center', opacity: salida(5.4, 5.8), transform: `scale(${escA})`}}>
        <Llavero id="a" escala={15} kc={E(0.7, 2.5)} kg={E(2.6, 4.8)} num={D.llavero.numD} />
      </div>}
      {/* B: cuadrícula de 100 */}
      {grid && <div style={{position: 'absolute', left: 50, top: 1000, width: 980, display: 'flex', flexWrap: 'wrap', gap: '10px 6px', opacity: t > 9.0 ? salida(9.0, 9.5) : 1}}>
        {Array.from({length: 100}).map((_, i) => <Mini key={i} i={i} aparece={seg(f, 5.9 + (V.pops.hasta - V.pops.desde) * i / 100, 5.9 + (V.pops.hasta - V.pops.desde) * i / 100 + 0.25)} />)}
      </div>}
      {/* C: número en cada llavero + comentarios */}
      {comentarios && <div style={{position: 'absolute', inset: 0, opacity: t > 13.0 ? salida(13.0, 13.4) : E(9.4, 9.8)}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center', transform: `rotate(${-4 + E(9.4, 10) * 4}deg) scale(${0.85 + 0.15 * E(9.5, 10.2)})`}}>
          <Llavero id="c" escala={11} kc={1} kg={1} num={D.llavero_nums['1']} />
        </div>
        <Burbuja t={seg(f, 11.3, 11.6)} n="#001" texto="¡Quiero el mío!" color={C.ambar} y={1330} />
        <Burbuja t={seg(f, 12.25, 12.55)} n="#002" texto="Yo también" color={C.arena} y={1440} />
        <Burbuja t={seg(f, 12.65, 12.95)} n="#003" texto="¡Me anoto!" color={C.cobre} y={1550} />
      </div>}
      {/* D: reglas */}
      {reglas && <div style={{position: 'absolute', left: 70, right: 70, top: 1010, opacity: t > 17.2 ? salida(17.2, 17.6) : 1}}>
        {[['1', `Sigue ${HANDLE}`, 14.1], ['2', 'Comenta en este video', 14.8], ['3', 'Los primeros 100 comentarios válidos', 15.5], ['✓', 'Envío gratis a toda Colombia', 16.2]].map(([n, txt, ti], i) => {
          const k = ease(seg(f, ti as number, (ti as number) + 0.35));
          return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 26, opacity: k, transform: `translateX(${(1 - k) * 160}px)`, background: 'rgba(246,240,232,.07)', border: `2px solid ${C.ambar}66`, borderRadius: 34, padding: '22px 34px'}}>
            <div style={{width: 76, height: 76, flex: 'none', borderRadius: '50%', background: C.ambar, color: C.fondo, fontWeight: 800, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
            <div style={{fontWeight: 700, fontSize: 45, color: C.crema, lineHeight: 1.15}}>{txt}</div></div>;
        })}
        <div style={{textAlign: 'center', fontFamily: SCRIPT, fontSize: 64, color: C.ambar, opacity: ease(seg(f, 16.7, 17.1))}}>Bases completas en el perfil</div>
      </div>}
      {/* Final */}
      {fin && <div style={{position: 'absolute', inset: 0, opacity: E(17.4, 17.9)}}>
        <div style={{position: 'absolute', top: 330, left: 0, right: 0}}><Logo escala={0.95 + 0.05 * pulso} /></div>
        <div style={{position: 'absolute', top: 830, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 96, color: C.crema, lineHeight: 1.1}}>100 LLAVEROS<br /><span style={{fontFamily: SCRIPT, fontWeight: 400, color: C.ambar, fontSize: 130}}>para ti</span></div>
        <div style={{position: 'absolute', top: 1260, left: 0, right: 0, textAlign: 'center', fontSize: 70, fontWeight: 800, color: C.fondo}}>
          <span style={{background: C.ambar, padding: '18px 52px', borderRadius: 60, display: 'inline-block', transform: `scale(${1 + 0.05 * pulso})`}}>COMENTA AHORA ↓</span></div>
        <div style={{position: 'absolute', top: 1570, left: 0, right: 0, textAlign: 'center', fontWeight: 800, fontSize: 60, color: C.crema, WebkitTextStroke: '9px #000', paintOrder: 'stroke fill'} as React.CSSProperties}>{HANDLE}</div>
      </div>}
      {!fin && <Subtitulos segmentos={V.segmentos} />}
      <Audio src={staticFile('laser/audio/mix_v1.mp3')} />
    </AbsoluteFill>
  );
};
