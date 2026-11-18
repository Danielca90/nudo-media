import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ConFuentes, FUENTE, pop} from './comun';

// Pieza 2 · 2D: "Robot de formas". Se arma con rectángulos y círculos (pensado para explicar el paso a paso).
const C = {marino: '#112D4E', azul: '#3F72AF', amarillo: '#F9C74F', coral: '#EF476F', crema: '#FFF5E1', blanco: '#FFFFFF', turquesa: '#4ECDC4'};

// etapa estática (1..7) o animada (f)
export const RobotDibujo: React.FC<{p: (i: number) => number; f: number; vivo: boolean}> = ({p, f, vivo}) => {
  const rebote = vivo ? 8 * Math.sin(f / 9) : 0;
  const onda = vivo ? -25 + 38 * Math.sin(f / 4.5) : -20;
  const parpadeo = vivo && ([138, 139, 140, 172, 173, 174].includes(f)) ? 0.12 : 1;
  const e = (i: number, ox: number, oy: number) => `translate(${ox} ${oy}) scale(${p(i)}) translate(${-ox} ${-oy})`;
  return (
    <g transform={`translate(0 ${rebote})`}>
      {/* 1 cuerpo */}
      <g transform={e(0, 540, 700)}>
        <rect x={360} y={520} width={360} height={340} rx={60} fill={C.azul} />
        <rect x={430} y={590} width={220} height={130} rx={26} fill={C.crema} />
        <circle cx={480} cy={655} r={22} fill={C.coral} />
        <circle cx={540} cy={655} r={22} fill={C.amarillo} />
        <circle cx={600} cy={655} r={22} fill={C.turquesa} />
      </g>
      {/* 2 cabeza */}
      <g transform={e(1, 540, 405)}>
        <rect x={380} y={290} width={320} height={235} rx={58} fill={C.amarillo} />
        <circle cx={376} cy={410} r={26} fill={C.azul} />
        <circle cx={704} cy={410} r={26} fill={C.azul} />
      </g>
      {/* 3 ojos */}
      <g transform={e(2, 540, 395)}>
        <g transform={`translate(470 395) scale(1 ${parpadeo}) translate(-470 -395)`}>
          <circle cx={470} cy={395} r={40} fill={C.blanco} />
          <circle cx={474} cy={398} r={17} fill={C.marino} />
        </g>
        <g transform={`translate(610 395) scale(1 ${parpadeo}) translate(-610 -395)`}>
          <circle cx={610} cy={395} r={40} fill={C.blanco} />
          <circle cx={606} cy={398} r={17} fill={C.marino} />
        </g>
      </g>
      {/* 4 boca */}
      <g transform={e(3, 540, 470)}>
        <path d="M 480 462 Q 540 512 600 462" fill="none" stroke={C.marino} strokeWidth={14} strokeLinecap="round" />
      </g>
      {/* 5 antena */}
      <g transform={e(4, 540, 290)}>
        <line x1={540} y1={290} x2={540} y2={215} stroke={C.marino} strokeWidth={14} strokeLinecap="round" />
        <circle cx={540} cy={196} r={30} fill={C.coral} />
      </g>
      {/* 6 brazos */}
      <g transform={e(5, 540, 640)}>
        <rect x={296} y={570} width={56} height={230} rx={28} fill={C.marino} />
        <g transform={`rotate(${onda} 748 590)`}>
          <rect x={720} y={570} width={56} height={230} rx={28} fill={C.marino} />
        </g>
      </g>
      {/* 7 pies */}
      <g transform={e(6, 540, 880)}>
        <rect x={400} y={850} width={110} height={56} rx={26} fill={C.coral} />
        <rect x={570} y={850} width={110} height={56} rx={26} fill={C.coral} />
      </g>
    </g>
  );
};

export const Robot: React.FC = () => {
  const f = useCurrentFrame();
  const inicio = [0, 22, 46, 62, 74, 90, 108];
  const p = (i: number) => pop((f - inicio[i]) / 16);
  const sombra = interpolate(f, [0, 120], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.crema}}>
      <svg width={1080} height={1080} viewBox="0 0 1080 1080">
        <circle cx={540} cy={560} r={430} fill="#FFE8B8" />
        <ellipse cx={540} cy={930} rx={210} ry={26} fill={C.marino} opacity={0.16 * sombra} />
        <RobotDibujo p={p} f={f} vivo={f >= 125} />
      </svg>
    </AbsoluteFill>
  );
};

// Hoja de pasos: 6 recuadros, cada uno con una forma más (ideal para explicarle a un niño)
const PASOS = [
  ['1', 'El cuerpo', 'un rectángulo redondeado'],
  ['2', 'La cabeza', 'otro rectángulo, más chico'],
  ['3', 'Los ojos', 'dos círculos'],
  ['4', 'La boca y la antena', 'una línea curva y un círculo'],
  ['5', 'Los brazos', 'dos rectángulos largos'],
  ['6', 'Los pies', 'dos rectángulos achatados'],
];
export const RobotPasos: React.FC = () => (
  <ConFuentes>
    <AbsoluteFill style={{background: C.crema, fontFamily: FUENTE}}>
      <div style={{position: 'absolute', top: 38, left: 0, right: 0, textAlign: 'center', fontSize: 52, fontWeight: 800, color: C.marino}}>Un robot con solo 2 formas</div>
      <div style={{position: 'absolute', top: 112, left: 40, right: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18}}>
        {PASOS.map(([n, t, d], i) => (
          <div key={n} style={{background: '#fff', borderRadius: 32, padding: 12, boxShadow: '0 10px 30px #112D4E1f', textAlign: 'center'}}>
            <svg viewBox="260 140 560 800" style={{width: '100%', height: 330}}>
              <RobotDibujo p={(k: number) => (k <= [0, 1, 2, 4, 5, 6][i] ? 1 : 0)} f={0} vivo={false} />
            </svg>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4}}>
              <span style={{width: 42, height: 42, borderRadius: '50%', background: C.coral, color: '#fff', fontWeight: 800, fontSize: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>{n}</span>
              <span style={{fontSize: 28, fontWeight: 800, color: C.marino}}>{t}</span>
            </div>
            <div style={{fontSize: 21, color: C.azul, fontWeight: 600, marginTop: 4}}>{d}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </ConFuentes>
);
