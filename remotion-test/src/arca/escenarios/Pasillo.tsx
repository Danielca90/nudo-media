// Escenario del reel 03 (trabajadores con protección especial): pasillo de una empresa con
// una puerta por cada protección. La cámara recorre el pasillo y se detiene en la puerta del tema:
// Talento Humano · Sala Amiga de la Familia Lactante · Enfermería / SST · Sindicato.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLOR, H} from '../marca';

export const PASILLO_ANCHO = 2600;
/** Centro horizontal (en px del pasillo) de cada puerta, para mover la cámara. */
export const PUERTAS = {talento: 420, lactancia: 1040, sst: 1660, sindicato: 2260};

const Puerta: React.FC<{x: number; letrero: string; sub?: string; color: string; children?: React.ReactNode}> = ({x, letrero, sub, color, children}) => (
  <g transform={`translate(${x - 170} 560)`}>
    {/* marco y puerta */}
    <rect x={-16} y={110} width={372} height={580} fill="#CFC7B6" />
    <rect x={0} y={126} width={340} height={564} fill={color} />
    <rect x={24} y={150} width={292} height={250} rx={6} fill="#FFFFFF" opacity={0.12} />
    <rect x={24} y={420} width={292} height={250} rx={6} fill="#FFFFFF" opacity={0.08} />
    <circle cx={300} cy={420} r={12} fill={COLOR.dorado} />
    {/* letrero */}
    <rect x={-10} y={0} width={360} height={sub ? 92 : 70} rx={10} fill={COLOR.papel} stroke={COLOR.teal} strokeWidth={5} />
    <text x={170} y={sub ? 40 : 46} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={800} fontSize={sub ? 24 : 30} fill={COLOR.teal}>{letrero}</text>
    {sub && <text x={170} y={74} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={600} fontSize={20} fill={COLOR.doradoOsc}>{sub}</text>}
    {children}
  </g>
);

/** `x` = desplazamiento de la cámara a lo largo del pasillo; `foco` 0 nítido → 1 desenfocado. */
export const Pasillo: React.FC<{x: number; foco?: number; zoom?: number}> = ({x, foco = 0, zoom = 1}) => (
  <AbsoluteFill style={{background: '#E7E1D5', overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `scale(${zoom})`, filter: `blur(${foco * 8}px)`}}>
      <svg width={PASILLO_ANCHO} height={H} viewBox={`0 0 ${PASILLO_ANCHO} ${H}`} style={{transform: `translateX(${-x}px)`}}>
        <defs>
          <linearGradient id="pa-muro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EFEAE0" /><stop offset="1" stopColor="#E2DBCC" />
          </linearGradient>
          <linearGradient id="pa-piso" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#B9B2A3" /><stop offset="0.15" stopColor="#5E716C" /><stop offset="0.32" stopColor={COLOR.teal} /><stop offset="1" stopColor={COLOR.teal} />
          </linearGradient>
        </defs>
        <rect width={PASILLO_ANCHO} height={1250} fill="url(#pa-muro)" />
        {/* luces de techo */}
        {Array.from({length: 9}, (_, i) => (
          <g key={i}>
            <rect x={120 + i * 290} y={250} width={180} height={18} rx={9} fill="#FFFDF4" />
            <polygon points={`${120 + i * 290},268 ${300 + i * 290},268 ${340 + i * 290},520 ${80 + i * 290},520`} fill="#FFF9E6" opacity={0.35} />
          </g>
        ))}
        {/* franja de color corporativa en la pared */}
        <rect x={0} y={1080} width={PASILLO_ANCHO} height={14} fill={COLOR.dorado} opacity={0.7} />
        <rect x={0} y={1094} width={PASILLO_ANCHO} height={156} fill="#D6CEBD" />

        <Puerta x={PUERTAS.talento} letrero="TALENTO HUMANO" color={COLOR.teal2} />
        <Puerta x={PUERTAS.lactancia} letrero="SALA AMIGA DE LA" sub="FAMILIA LACTANTE" color="#7FA99B">
          {/* ícono de biberón */}
          <g transform="translate(140 220)"><rect x={14} y={20} width={32} height={70} rx={10} fill="#FFFFFF" opacity={0.85} /><rect x={20} y={6} width={20} height={16} rx={4} fill="#FFFFFF" opacity={0.85} /></g>
        </Puerta>
        <Puerta x={PUERTAS.sst} letrero="ENFERMERÍA · SST" color="#5E8C86">
          <path d="M150 220 h40 v40 h40 v40 h-40 v40 h-40 v-40 h-40 v-40 h40z" fill="#FFFFFF" opacity={0.9} />
        </Puerta>
        <Puerta x={PUERTAS.sindicato} letrero="SINDICATO" color="#3D5E6B">
          {/* cartelera con aviso de asamblea */}
          <g transform="translate(-230 160)">
            <rect width={190} height={250} rx={8} fill="#B88D63" />
            <rect x={16} y={20} width={158} height={110} fill="#FFFFFF" />
            <text x={95} y={62} textAnchor="middle" fontFamily="Montserrat, Arial" fontWeight={800} fontSize={20} fill={COLOR.alerta}>ASAMBLEA</text>
            <rect x={34} y={80} width={122} height={8} fill="#D9D9D9" /><rect x={34} y={98} width={90} height={8} fill="#D9D9D9" />
            <rect x={30} y={150} width={70} height={80} fill="#F2E9C9" transform="rotate(-6 65 190)" />
            <rect x={110} y={146} width={60} height={70} fill="#DCEFE6" transform="rotate(5 140 180)" />
          </g>
        </Puerta>
        {/* bancas y plantas para dar vida al pasillo */}
        {[720, 1340, 1960].map((bx) => (
          <g key={bx} transform={`translate(${bx} 1150)`}>
            <rect x={-70} y={0} width={140} height={22} rx={8} fill={COLOR.doradoOsc} />
            <rect x={-60} y={22} width={10} height={70} fill="#4A4A42" /><rect x={50} y={22} width={10} height={70} fill="#4A4A42" />
            <rect x={-22} y={-110} width={44} height={60} fill={COLOR.dorado} />
            <ellipse cx={0} cy={-140} rx={50} ry={46} fill="#3F7058" /><ellipse cx={-20} cy={-170} rx={26} ry={40} fill="#2F5E49" />
          </g>
        ))}
        <rect x={0} y={1250} width={PASILLO_ANCHO} height={H - 1250} fill="url(#pa-piso)" />
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>
);
