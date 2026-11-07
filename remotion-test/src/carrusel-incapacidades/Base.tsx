import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, W, H, FUENTE} from './tema';

// Nieve determinista (solo depende del frame)
export const Nieve: React.FC<{n?: number}> = ({n = 70}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: n}).map((_, i) => {
        const r = (s: string) => random(`${s}${i}`);
        const size = 3 + r('s') * 7;
        const vel = 1.2 + r('v') * 2.6;
        const x0 = r('x') * W;
        const y = ((r('y') * H + f * vel * 2) % (H + 40)) - 20;
        const x = x0 + Math.sin((f + r('p') * 100) / 22) * 18;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: '#fff', opacity: 0.25 + r('o') * 0.5}} />
        );
      })}
    </AbsoluteFill>
  );
};

// Guirnalda de luces con parpadeo
export const Luces: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [C.rojoClaro, C.dorado, '#5FD0A0', C.doradoClaro];
  const n = 12;
  return (
    <svg width={W} height={170} style={{position: 'absolute', top: 0, left: 0}}>
      <path d={`M -10 20 Q ${W / 2} 150 ${W + 10} 20`} stroke="#1d2b44" strokeWidth={5} fill="none" />
      {Array.from({length: n}).map((_, i) => {
        const t = (i + 0.5) / n;
        const x = -10 + t * (W + 20);
        const y = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 150 + t * t * 20;
        const on = 0.55 + 0.45 * Math.sin(f / 5 + i * 1.7);
        const col = cols[i % cols.length];
        return (
          <g key={i}>
            <circle cx={x} cy={y + 16} r={22} fill={col} opacity={on * 0.28} />
            <rect x={x - 3} y={y - 2} width={6} height={10} fill="#1d2b44" />
            <ellipse cx={x} cy={y + 16} rx={8} ry={12} fill={col} opacity={0.5 + on * 0.5} />
          </g>
        );
      })}
    </svg>
  );
};

export const Fondo: React.FC<{acento?: 'noche' | 'pino' | 'rojo'}> = ({acento = 'noche'}) => {
  const f = useCurrentFrame();
  const mezcla = {noche: C.nocheClaro, pino: C.pino, rojo: '#4A1220'}[acento];
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 120% 90% at 50% 25%, ${mezcla} 0%, ${C.noche} 70%)`}}>
      <div style={{position: 'absolute', inset: 36, border: `2px solid ${C.dorado}55`, borderRadius: 8}} />
      <div style={{position: 'absolute', inset: 48, border: `1px solid ${C.dorado}25`, borderRadius: 4}} />
      <Nieve />
      <Luces />
      <div style={{position: 'absolute', left: -200, top: 500 + Math.sin(f / 40) * 20, width: 500, height: 500, borderRadius: '50%', background: `${C.dorado}10`, filter: 'blur(60px)'}} />
    </AbsoluteFill>
  );
};

export const useAp = (delay = 0, damping = 18) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness: 120}});
};

export const Revela: React.FC<{d?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d = 0, y = 40, children, style}) => {
  const p = useAp(d);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style}}>{children}</div>;
};

// Marco de lámina: marca arriba, contador y pie
export const Marco: React.FC<{n: number; children: React.ReactNode; acento?: 'noche' | 'pino' | 'rojo'}> = ({n, children, acento}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{fontFamily: FUENTE, color: C.nieve}}>
      <Fondo acento={acento} />
      <div style={{position: 'absolute', top: 190, left: 90, right: 90, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: interpolate(f, [0, 12], [0, 1], {extrapolateRight: 'clamp'})}}>
        <div style={{fontSize: 28, letterSpacing: 8, fontWeight: 700, color: C.dorado}}>ARCA JURÍDICA</div>
        <div style={{display: 'flex', gap: 10}}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{width: i === n ? 38 : 12, height: 12, borderRadius: 6, background: i === n ? C.dorado : '#ffffff40'}} />
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', top: 280, left: 90, right: 90, bottom: 170}}>{children}</div>
      <div style={{position: 'absolute', bottom: 78, left: 90, right: 90, fontSize: 21, color: C.gris, display: 'flex', justifyContent: 'space-between'}}>
        <span>Orientación general, no es asesoría legal.</span>
        <span>{n < 6 ? 'Desliza →' : ''}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Titulo: React.FC<{lineas: string[]; d?: number; size?: number; resaltar?: number[]}> = ({lineas, d = 6, size = 96, resaltar = []}) => (
  <div style={{fontSize: size, fontWeight: 900, lineHeight: 1.04, letterSpacing: -2}}>
    {lineas.map((l, i) => (
      <Revela key={i} d={d + i * 7} style={{color: resaltar.includes(i) ? C.dorado : C.nieve}}>{l}</Revela>
    ))}
  </div>
);
