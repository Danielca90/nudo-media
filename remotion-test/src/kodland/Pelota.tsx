import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// Pieza 1 · 2D animada: "Pelota que rebota" (squash & stretch). Loop de 3 s.
const C = {cieloA: '#BFE6F5', cieloB: '#FFF4DC', suelo: '#2F9E8F', sueloClaro: '#6FD0BF', pelota: '#FF5A4F', brillo: '#FFFFFF', sombra: '#12304A', sol: '#FFC857'};
const P = 45; // fotogramas por rebote

export const Pelota: React.FC = () => {
  const f = useCurrentFrame();
  const u = (f % P) / P;
  const h = 4 * u * (1 - u);
  const R = 105;
  const piso = 820;
  const alto = 420;
  const vel = Math.abs(1 - 2 * u);
  const contacto = u < 0.1 ? 1 - u / 0.1 : u > 0.9 ? (u - 0.9) / 0.1 : 0;
  const estira = 1 + 0.24 * vel * (contacto > 0 ? 0 : 1);
  const sy = estira * (1 - 0.4 * contacto);
  const sx = (1 / estira) * (1 + 0.4 * contacto);
  const cy = piso - R * sy - h * alto;
  const giro = (f * 8) % 360;
  const nube = (bx: number, by: number, s: number, ph: number) => (
    <g transform={`translate(${bx + 50 * Math.sin((2 * Math.PI * f) / 90 + ph)} ${by}) scale(${s})`} fill="#fff" opacity={0.9}>
      <ellipse cx={0} cy={0} rx={90} ry={34} />
      <ellipse cx={-40} cy={-24} rx={44} ry={40} />
      <ellipse cx={30} cy={-32} rx={52} ry={46} />
    </g>
  );
  return (
    <AbsoluteFill>
      <svg width={1080} height={1080} viewBox="0 0 1080 1080">
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.cieloA} /><stop offset="1" stopColor={C.cieloB} /></linearGradient>
          <radialGradient id="bola" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#FF9A8F" /><stop offset="0.55" stopColor={C.pelota} /><stop offset="1" stopColor="#C73A33" /></radialGradient>
        </defs>
        <rect width={1080} height={1080} fill="url(#cielo)" />
        <circle cx={880} cy={190} r={86} fill={C.sol} />
        <circle cx={880} cy={190} r={130} fill={C.sol} opacity={0.2} />
        {nube(250, 230, 1.2, 0)}
        {nube(640, 330, 0.9, 2)}
        <rect y={piso} width={1080} height={260} fill={C.suelo} />
        <rect y={piso} width={1080} height={26} fill={C.sueloClaro} />
        <ellipse cx={540} cy={piso + 34} rx={R * (1.25 - 0.55 * h)} ry={22 - 8 * h} fill={C.sombra} opacity={0.38 - 0.2 * h} />
        {/* destellos al tocar el piso */}
        {contacto > 0 &&
          [-1, 1].map((d) =>
            [0, 1, 2].map((k) => (
              <line key={`${d}${k}`} x1={540 + d * (R * 1.3 + k * 6)} y1={piso - 8 - k * 34} x2={540 + d * (R * 1.3 + 40 + k * 14)} y2={piso - 22 - k * 44} stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={contacto} />
            )),
          )}
        <g transform={`translate(540 ${cy}) scale(${sx} ${sy})`}>
          <g transform={`rotate(${giro})`}>
            <circle r={R} fill="url(#bola)" />
            <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`} fill="none" stroke="#fff" strokeWidth={14} opacity={0.55} />
          </g>
          <ellipse cx={-38} cy={-44} rx={26} ry={16} fill={C.brillo} opacity={0.6} transform="rotate(-30 -38 -44)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
