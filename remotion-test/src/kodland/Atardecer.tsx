import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ConFuentes, FUENTE} from './comun';

// Pieza 3 · 2D: "Atardecer en 5 colores". Estudio de color, capas de profundidad y composición. Loop de 6 s.
export const PALETA = [
  ['#2D1E5F', 'Índigo', 'la noche que llega'],
  ['#7A3E9D', 'Morado', 'montañas lejanas'],
  ['#FF6F91', 'Rosa', 'nubes y cielo'],
  ['#FFB86B', 'Naranja', 'la luz cálida'],
  ['#FFE29A', 'Amarillo claro', 'el sol'],
];
const [INDIGO, MORADO, ROSA, NARANJA, AMARILLO] = PALETA.map((p) => p[0]);
const LOOP = 180;

export const EscenaAtardecer: React.FC<{f: number}> = ({f}) => {
  const a = (2 * Math.PI * f) / LOOP;
  const solY = 575 + 14 * Math.sin(a);
  const nube = (x: number, y: number, s: number, ph: number, c: string) => (
    <g transform={`translate(${x + 70 * Math.sin(a + ph)} ${y}) scale(${s})`} fill={c} opacity={0.85}>
      <ellipse rx={120} ry={30} />
      <ellipse cx={-50} cy={-22} rx={56} ry={38} />
      <ellipse cx={40} cy={-30} rx={68} ry={44} />
    </g>
  );
  const ave = (x: number, y: number, ph: number) => {
    const ala = 14 * Math.sin(a * 4 + ph);
    return <path d={`M ${x - 26} ${y + ala} Q ${x - 12} ${y - 10} ${x} ${y} Q ${x + 12} ${y - 10} ${x + 26} ${y + ala}`} fill="none" stroke={INDIGO} strokeWidth={5} strokeLinecap="round" />;
  };
  return (
    <svg width={1080} height={1080} viewBox="0 0 1080 1080">
      <defs>
        <linearGradient id="cielo2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={INDIGO} />
          <stop offset="0.38" stopColor={MORADO} />
          <stop offset="0.62" stopColor={ROSA} />
          <stop offset="0.86" stopColor={NARANJA} />
          <stop offset="1" stopColor={AMARILLO} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1080} fill="url(#cielo2)" />
      {[[130, 110], [300, 200], [470, 80], [660, 170], [860, 100], [980, 230], [210, 330], [760, 300]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4 + (i % 3)} fill="#fff" opacity={0.35 + 0.35 * Math.sin(a * 2 + i)} />
      ))}
      <circle cx={540} cy={solY} r={250} fill={AMARILLO} opacity={0.14} />
      <circle cx={540} cy={solY} r={185} fill={AMARILLO} opacity={0.22} />
      <circle cx={540} cy={solY} r={125} fill={AMARILLO} />
      {nube(230, 360, 1.2, 0, ROSA)}
      {nube(780, 440, 1.0, 2, NARANJA)}
      {nube(520, 300, 0.7, 4, ROSA)}
      {ave(430, 250, 0)}
      {ave(500, 215, 1)}
      {ave(580, 262, 2)}
      <path d="M0 650 L170 520 L330 620 L520 480 L720 610 L890 510 L1080 640 L1080 1080 L0 1080 Z" fill={MORADO} />
      <path d="M0 760 L230 620 L430 740 L650 600 L860 730 L1080 660 L1080 1080 L0 1080 Z" fill="#53307F" />
      <path d="M0 880 Q270 780 540 860 T1080 830 L1080 1080 L0 1080 Z" fill={INDIGO} />
      {/* pinos de la primera capa */}
      {[[120, 840, 1.1], [230, 860, 0.8], [880, 835, 1.2], [980, 850, 0.9]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#1A1142">
          <polygon points="0,-140 40,-60 -40,-60" />
          <polygon points="0,-100 55,-10 -55,-10" />
          <rect x={-8} y={-10} width={16} height={36} />
        </g>
      ))}
    </svg>
  );
};

export const Atardecer: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill><EscenaAtardecer f={f} /></AbsoluteFill>;
};

export const AtardecerPaleta: React.FC = () => (
  <ConFuentes>
    <AbsoluteFill style={{background: '#FFF8EC', fontFamily: FUENTE}}>
      <div style={{position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center', fontSize: 50, fontWeight: 800, color: INDIGO}}>Atardecer en 5 colores</div>
      <div style={{position: 'absolute', top: 120, left: 120, width: 840, height: 840, borderRadius: 44, overflow: 'hidden', boxShadow: '0 20px 50px #2D1E5F44'}}>
        <div style={{position: 'absolute', inset: 0, transform: 'scale(0.7778)', transformOrigin: 'top left', width: 1080, height: 1080}}><EscenaAtardecer f={30} /></div>
      </div>
      <div style={{position: 'absolute', top: 990, left: 60, right: 60, display: 'flex', gap: 16}}>
        {PALETA.map(([hex, nombre, uso]) => (
          <div key={hex} style={{flex: 1, textAlign: 'center'}}>
            <div style={{height: 90, borderRadius: 24, background: hex, boxShadow: '0 6px 16px #0002'}} />
            <div style={{fontSize: 22, fontWeight: 800, color: INDIGO, marginTop: 8}}>{nombre}</div>
            <div style={{fontSize: 17, fontWeight: 600, color: '#6b5b8f'}}>{hex}</div>
            <div style={{fontSize: 17, color: '#6b5b8f'}}>{uso}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </ConFuentes>
);
