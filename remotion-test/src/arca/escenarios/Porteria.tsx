// Escenario de la noticia SL1015-2026 (vigilante despedido tras incapacidad):
// portería / lobby de un edificio con recepción, monitores de cámaras, torniquetes, ascensor y escalera.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLOR, W, H} from '../marca';
import {useT} from '../kit';

export const Porteria: React.FC<{foco?: number; zoom?: number}> = ({foco = 0, zoom = 1}) => {
  const t = useT();
  const deriva = Math.sin(t * 0.3) * 8;
  const rec = Math.floor(t * 2) % 2 === 0;
  return (
    <AbsoluteFill style={{background: '#E9E6DF'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${deriva}px)`, filter: `blur(${foco * 10}px)`}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="pt-muro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E4E0D6" /><stop offset="1" stopColor="#D5D0C4" />
            </linearGradient>
            <linearGradient id="pt-piso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#D9D4CA" /><stop offset="0.12" stopColor="#8D9C97" /><stop offset="0.3" stopColor={COLOR.teal} /><stop offset="1" stopColor={COLOR.teal} />
            </linearGradient>
            <linearGradient id="pt-reflejo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.45} /><stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect width={W} height={1260} fill="url(#pt-muro)" />
          {/* paneles de madera y logo del edificio */}
          {Array.from({length: 7}, (_, i) => <rect key={i} x={i * 160} y={260} width={150} height={1000} fill={i % 2 ? '#CDBFA8' : '#D6C9B3'} opacity={0.55} />)}
          <text x={540} y={470} textAnchor="middle" fontFamily="Libre Baskerville, Georgia" fontSize={34} fill={COLOR.teal} letterSpacing={8} opacity={0.8}>EDIFICIO TORRE 80</text>
          {/* escalera a la izquierda */}
          <g transform="translate(0 700)">
            {Array.from({length: 9}, (_, i) => (
              <g key={i}>
                <rect x={0} y={i * 62} width={60 + i * 34} height={62} fill={i % 2 ? '#BDB6A8' : '#C9C2B4'} />
                <rect x={0} y={i * 62} width={60 + i * 34} height={8} fill="#E8E3D8" />
              </g>
            ))}
            <path d="M40 -60 L 380 500" stroke={COLOR.doradoOsc} strokeWidth={10} />
            {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={60 + k * 68} y={-30 + k * 112} width={6} height={90} fill={COLOR.doradoOsc} />)}
          </g>
          {/* ascensor */}
          <g transform="translate(700 520)">
            <rect x={-20} y={-30} width={320} height={770} fill="#B9B3A6" />
            <rect x={0} y={0} width={140} height={740} fill="#C9CDCB" /><rect x={140} y={0} width={140} height={740} fill="#BFC4C2" />
            <rect x={136} y={0} width={8} height={740} fill="#9AA09E" />
            <rect x={110} y={-80} width={60} height={34} rx={6} fill={COLOR.teal} />
            <text x={140} y={-55} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={700} fontSize={22} fill={COLOR.dorado}>1</text>
          </g>
          {/* monitores de cámaras */}
          <g transform="translate(330 560)">
            <rect x={-10} y={-10} width={360} height={250} rx={10} fill="#2A3533" />
            {[0, 1, 2, 3].map((k) => (
              <g key={k} transform={`translate(${(k % 2) * 172} ${Math.floor(k / 2) * 116})`}>
                <rect width={164} height={108} fill="#5E7A74" />
                <rect x={10} y={60} width={60} height={40} fill="#46605B" /><rect x={90} y={30} width={50} height={70} fill="#4F6B65" />
                <circle cx={150} cy={12} r={5} fill={rec ? '#E5484D' : '#5E7A74'} />
              </g>
            ))}
          </g>
          {/* mostrador de portería */}
          <g transform="translate(250 940)">
            <rect x={0} y={0} width={560} height={300} fill={COLOR.teal} />
            <rect x={-20} y={-24} width={600} height={30} rx={6} fill="#3E5F5E" />
            <rect x={0} y={6} width={560} height={8} fill={COLOR.dorado} />
            <text x={280} y={150} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={800} fontSize={44} fill={COLOR.crema} letterSpacing={6}>PORTERÍA</text>
            {/* radio y gorra del vigilante */}
            <rect x={430} y={-90} width={34} height={70} rx={6} fill="#1E2A28" /><rect x={442} y={-120} width={8} height={34} fill="#1E2A28" />
            <path d="M90 -24 a 60 40 0 0 1 120 0 z" fill="#20314A" /><rect x={80} y={-30} width={150} height={10} rx={5} fill="#16253A" />
            <rect x={140} y={-62} width={20} height={14} rx={3} fill={COLOR.dorado} />
          </g>
          {/* torniquetes */}
          {[900, 990].map((x) => (
            <g key={x} transform={`translate(${x} 1060)`}>
              <rect x={0} y={0} width={46} height={180} rx={8} fill="#A8AFAC" />
              <rect x={10} y={20} width={26} height={12} rx={4} fill="#3FB37F" />
              <rect x={-60} y={70} width={60} height={8} fill="#8D9592" />
            </g>
          ))}
          {/* piso de mármol con reflejo */}
          <rect x={0} y={1240} width={W} height={H - 1240} fill="url(#pt-piso)" />
          <rect x={250} y={1244} width={560} height={90} fill="url(#pt-reflejo)" opacity={0.5} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
