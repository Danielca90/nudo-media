// Escenario del reel 01 (despidos): el lugar de trabajo del empleado.
// Bodega con estanterías, cajas, reloj de marcación, portón de carga y letrero de SALIDA.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLOR, W, H} from '../marca';
import {useT} from '../kit';

const CARTON = ['#C9A27A', '#B88D63', '#D6B48C', '#A97F58'];
const r = (i: number, n: number) => (Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1;
const rnd = (i: number, n: number) => Math.abs(r(i, n));

const Estante: React.FC<{x: number; ancho: number; semilla: number}> = ({x, ancho, semilla}) => {
  const niveles = [520, 760, 1000, 1220];
  return (
    <g>
      {[0, ancho].map((dx) => <rect key={dx} x={x + dx - 10} y={420} width={20} height={840} fill={COLOR.teal} />)}
      {niveles.map((y, k) => (
        <g key={y}>
          <rect x={x - 12} y={y} width={ancho + 24} height={22} fill={COLOR.doradoOsc} />
          {Array.from({length: 4}, (_, i) => {
            const w = 70 + rnd(semilla * 10 + k * 4 + i, 1) * 50;
            const h = 90 + rnd(semilla * 10 + k * 4 + i, 2) * 90;
            const bx = x + 14 + i * (ancho / 4);
            if (bx + w > x + ancho - 6) return null;
            const c = CARTON[Math.floor(rnd(semilla + k + i, 3) * 4)];
            return (
              <g key={i}>
                <rect x={bx} y={y - h} width={w} height={h} fill={c} rx={3} />
                <rect x={bx} y={y - h + h * 0.18} width={w} height={8} fill="#E8D6B8" opacity={0.8} />
                <rect x={bx + w * 0.2} y={y - h * 0.55} width={w * 0.5} height={h * 0.22} fill="#F6F1E6" />
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
};

/** `foco` 0 = nítida, 1 = desenfocada detrás de la explicación. */
export const Bodega: React.FC<{foco?: number; zoom?: number}> = ({foco = 0, zoom = 1}) => {
  const t = useT();
  const deriva = Math.sin(t * 0.3) * 10;
  const polvo = Array.from({length: 26}, (_, i) => ({
    x: 300 + rnd(i, 4) * 520 + Math.sin(t * 0.4 + i) * 14,
    y: 300 + ((rnd(i, 5) * 900 + t * (8 + rnd(i, 6) * 10)) % 900),
    s: 2 + rnd(i, 7) * 3,
  }));
  return (
    <AbsoluteFill style={{background: '#E3DED2'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${deriva}px)`, filter: `blur(${foco * 10}px)`}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="bg-muro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D9D4C7" /><stop offset="1" stopColor="#E9E4D8" />
            </linearGradient>
            <linearGradient id="bg-piso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#BDB6A6" /><stop offset="0.14" stopColor="#5E716C" /><stop offset="0.32" stopColor={COLOR.teal} /><stop offset="1" stopColor={COLOR.teal} />
            </linearGradient>
            <linearGradient id="bg-luz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFF8E6" stopOpacity={0.7} /><stop offset="1" stopColor="#FFF8E6" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* muro con paneles y ventanas altas */}
          <rect width={W} height={1260} fill="url(#bg-muro)" />
          {Array.from({length: 9}, (_, i) => <rect key={i} x={0} y={180 + i * 120} width={W} height={3} fill="#CBC5B7" />)}
          {[120, 400, 680].map((x) => <rect key={x} x={x} y={230} width={240} height={90} rx={4} fill="#F4F2EA" stroke="#BFB8A8" strokeWidth={6} />)}
          {[150, 430, 710].map((x) => <polygon key={x} points={`${x},320 ${x + 180},320 ${x + 380},1260 ${x + 40},1260`} fill="url(#bg-luz)" />)}
          {/* portón de carga, medio abierto */}
          <rect x={340} y={560} width={400} height={700} fill="#9DB7B1" />
          <rect x={340} y={560} width={400} height={330} fill="#7E918C" />
          {Array.from({length: 11}, (_, i) => <rect key={i} x={340} y={560 + i * 30} width={400} height={4} fill="#6B7D79" />)}
          <rect x={326} y={548} width={428} height={18} fill={COLOR.teal} />
          <rect x={326} y={548} width={14} height={712} fill={COLOR.teal} /><rect x={740} y={548} width={14} height={712} fill={COLOR.teal} />
          {/* letrero de SALIDA */}
          <g transform="translate(450 470)">
            <rect width={180} height={62} rx={8} fill="#2F8A4E" />
            <text x={96} y={43} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={800} fontSize={30} fill="#fff">SALIDA</text>
            <path d="M18 46 l10 -14 l8 6 l6 -12 M 30 20 a 4 4 0 1 0 0.1 0" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
          {/* estanterías */}
          <Estante x={-40} ancho={330} semilla={1} />
          <Estante x={790} ancho={330} semilla={7} />
          {/* reloj de marcación en la columna */}
          <g transform="translate(780 640)">
            <rect x={-6} y={-60} width={12} height={60} fill="#9A9488" />
            <rect x={-70} y={0} width={140} height={180} rx={12} fill="#F4F2EA" stroke={COLOR.teal} strokeWidth={6} />
            <rect x={-50} y={20} width={100} height={42} rx={6} fill={COLOR.teal} />
            <text x={0} y={52} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={700} fontSize={26} fill={COLOR.dorado}>06:58</text>
            {[0, 1, 2].map((k) => <rect key={k} x={-46 + k * 32} y={84} width={24} height={70} rx={3} fill="#D8D2C3" />)}
          </g>
          {/* piso con líneas de seguridad */}
          <rect x={0} y={1240} width={W} height={H - 1240} fill="url(#bg-piso)" />
          <polygon points="250,1240 300,1240 120,1500 40,1500" fill="#E2B53A" opacity={0.85} />
          <polygon points="780,1240 830,1240 1040,1500 960,1500" fill="#E2B53A" opacity={0.85} />
          {/* estiba con cajas y transpaleta en primer plano */}
          <g transform="translate(40 1130)">
            <rect x={0} y={120} width={260} height={26} fill="#A97F58" />
            {[0, 1, 2].map((k) => <rect key={k} x={10 + k * 84} y={146} width={40} height={20} fill="#8C6A49" />)}
            <rect x={14} y={10} width={120} height={110} fill={CARTON[0]} /><rect x={140} y={30} width={110} height={90} fill={CARTON[1]} />
            <rect x={60} y={-80} width={120} height={90} fill={CARTON[2]} />
            <rect x={14} y={30} width={120} height={8} fill="#E8D6B8" /><rect x={60} y={-62} width={120} height={8} fill="#E8D6B8" />
          </g>
          {/* polvo en los haces de luz (da vida al lugar, se mueve lento) */}
          {polvo.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.s} fill="#FFF6DA" opacity={0.55} />)}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
