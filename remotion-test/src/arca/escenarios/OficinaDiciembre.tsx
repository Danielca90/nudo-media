// Escenario del reel 02 (contratos que vencen el 31 de diciembre): oficina al atardecer de fin de año.
// Luces de diciembre en la ventana, flor de pascua, archivador de contratos, calendario de pared y lámpara.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLOR, W, H} from '../marca';
import {useT} from '../kit';

const rnd = (i: number, n: number) => Math.abs((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1);
const edificios = Array.from({length: 13}, (_, i) => ({x: 100 + i * 66, w: 54 + rnd(i, 1) * 30, h: 180 + rnd(i, 2) * 320}));
const BOMBILLOS = ['#F2C230', '#E8734A', '#7FC4A4', '#F7E7B0', '#C8313B'];

export const OficinaDiciembre: React.FC<{foco?: number; zoom?: number}> = ({foco = 0, zoom = 1}) => {
  const t = useT();
  const deriva = Math.sin(t * 0.35) * 8;
  return (
    <AbsoluteFill style={{background: '#EFE6DA'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${deriva}px)`, filter: `blur(${foco * 10}px)`}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id="od-cielo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3E6670" /><stop offset="0.55" stopColor="#D9997A" /><stop offset="1" stopColor="#F3C99B" />
            </linearGradient>
            <linearGradient id="od-pared" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#EADFD0" /><stop offset="1" stopColor="#DCCFBD" />
            </linearGradient>
            <radialGradient id="od-lampara" cx="0.5" cy="0" r="1">
              <stop offset="0" stopColor="#FFE7B0" stopOpacity={0.55} /><stop offset="1" stopColor="#FFE7B0" stopOpacity={0} />
            </radialGradient>
          </defs>
          <rect width={W} height={H} fill="url(#od-pared)" />
          {/* ventana al atardecer */}
          <rect x={250} y={300} width={760} height={740} rx={6} fill="url(#od-cielo)" />
          <circle cx={760} cy={880} r={70} fill="#F8D9A8" opacity={0.8} />
          {edificios.map((e, i) => (
            <g key={i}>
              <rect x={e.x + 180} y={1040 - e.h} width={e.w} height={e.h} fill={i % 2 ? '#35545A' : '#2C474D'} />
              {Array.from({length: Math.floor(e.h / 40)}, (_, k) => (
                <rect key={k} x={e.x + 190} y={1040 - e.h + 14 + k * 40} width={e.w - 20} height={10}
                  fill="#F5C46B" opacity={rnd(i * 7 + k, 3) > 0.45 ? 0.85 : 0.12} />
              ))}
            </g>
          ))}
          <rect x={250} y={300} width={760} height={740} rx={6} fill="none" stroke="#FFFFFF" strokeWidth={24} />
          <rect x={620} y={300} width={18} height={740} fill="#FFFFFF" />
          {/* guirnalda de luces de diciembre */}
          <path d="M240 330 Q 430 430 630 340 T 1020 340" fill="none" stroke="#3C4A43" strokeWidth={4} />
          {Array.from({length: 14}, (_, i) => {
            const u = i / 13;
            const x = 240 + u * 780;
            const y = 336 + Math.sin(u * Math.PI * 2) * -2 + (u < 0.5 ? Math.sin(u * 2 * Math.PI) * 50 : Math.sin((u - 0.5) * 2 * Math.PI) * 0);
            const brillo = 0.55 + 0.45 * Math.max(0, Math.sin(t * 3 + i * 1.7));
            const c = BOMBILLOS[i % BOMBILLOS.length];
            return (
              <g key={i}>
                <circle cx={x} cy={y + 18} r={22} fill={c} opacity={brillo * 0.35} />
                <ellipse cx={x} cy={y + 18} rx={9} ry={13} fill={c} opacity={0.6 + brillo * 0.4} />
              </g>
            );
          })}
          {/* calendario de pared */}
          <g transform="translate(40 360)">
            <rect width={170} height={210} rx={10} fill="#FFFFFF" />
            <rect width={170} height={56} rx={10} fill={COLOR.alerta} />
            <text x={85} y={40} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={800} fontSize={30} fill="#fff">DIC</text>
            <text x={85} y={160} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={800} fontSize={86} fill={COLOR.tinta}>31</text>
          </g>
          {/* archivador de contratos */}
          <g transform="translate(40 700)">
            <rect width={200} height={540} rx={8} fill={COLOR.teal2} />
            {[0, 1, 2].map((k) => (
              <g key={k} transform={`translate(14 ${20 + k * 172})`}>
                <rect width={172} height={156} rx={6} fill={COLOR.teal} />
                <rect x={56} y={24} width={60} height={12} rx={6} fill={COLOR.dorado} />
                <rect x={26} y={56} width={120} height={44} rx={4} fill="#F4EFE4" />
                <text x={86} y={86} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={700} fontSize={20} fill={COLOR.teal}>
                  {['CONTRATOS', 'AVISOS', '2027'][k]}
                </text>
              </g>
            ))}
          </g>
          {/* escritorio, lámpara y flor de pascua */}
          <rect x={0} y={1240} width={W} height={H - 1240} fill={COLOR.teal} />
          <rect x={0} y={1240} width={W} height={10} fill={COLOR.dorado} />
          <rect x={0} y={1420} width={W} height={60} fill={COLOR.teal2} />
          <polygon points="880,1010 1080,1240 680,1240" fill="url(#od-lampara)" />
          <g transform="translate(880 1240)">
            <rect x={-6} y={-200} width={12} height={200} fill="#2A3B38" />
            <path d="M-70 -200 L 70 -200 L 40 -260 L -40 -260 Z" fill={COLOR.dorado} />
            <rect x={-50} y={-10} width={100} height={12} rx={6} fill="#2A3B38" />
          </g>
          <g transform="translate(450 1240)">
            <path d="M-48 0 h96 l-12 -90 h-72z" fill="#B23A3A" transform="scale(1 -1)" />
            {Array.from({length: 8}, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <ellipse key={i} cx={Math.cos(a) * 50} cy={-140 + Math.sin(a) * 30} rx={44} ry={16} fill={i % 2 ? '#C8313B' : '#D94545'}
                transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 50} ${-140 + Math.sin(a) * 30})`} />;
            })}
            <circle cx={0} cy={-140} r={12} fill="#F2C230" />
            {[-1, 1].map((s) => <ellipse key={s} cx={s * 70} cy={-100} rx={40} ry={14} fill="#2F5E49" transform={`rotate(${s * 20} ${s * 70} -100)`} />)}
          </g>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
