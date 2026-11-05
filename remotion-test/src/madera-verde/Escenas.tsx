import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Tabla, Gotas, Flecha, Anillo, Camara, Luces} from './Madera3D';
import {ESCENAS, f} from './tiempos';
import {ANOTACIONES, VIDEO} from '../estilo';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
// tiempo absoluto (s) -> frame relativo a la escena que empieza en `ini`
const rel = (seg: number, ini: number) => f(seg - ini);
const ease = Easing.inOut(Easing.cubic);

// Fondo de taller: cálido, desenfocado, menos saturado que la madera.
export const FondoTaller: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at 50% 62%, #5a4632 0%, #3a2c20 38%, #1c1510 75%, #120d09 100%)',
    }}
  >
    {/* banco de trabajo desenfocado en la parte baja */}
    <AbsoluteFill
      style={{
        top: '70%',
        background: 'linear-gradient(180deg, rgba(110,80,50,0) 0%, rgba(110,80,50,0.35) 30%, rgba(60,42,28,0.6) 100%)',
        filter: 'blur(6px)',
      }}
    />
  </AbsoluteFill>
);

const Chip: React.FC<{children: React.ReactNode; top: number; opacidad: number; color?: string}> = ({
  children,
  top,
  opacidad,
  color = '#ffffff',
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      opacity: opacidad,
    }}
  >
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: 44,
        color,
        background: 'rgba(15,12,10,0.55)',
        border: '2px solid rgba(255,255,255,0.18)',
        borderRadius: 999,
        padding: '10px 30px',
      }}
    >
      {children}
    </div>
  </div>
);

// ---------- Escenas 1-3: una sola tabla verde que se seca y se encoge ----------
export const EscenaTabla: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ini = ESCENAS.gancho;
  const t = (s: number) => rel(s, ini);

  // agua: aparecen gotas con "cortada", se van con "seca"/"diez"
  const gotasIn = spring({frame: frame - t(3.4), fps, config: {damping: 16}});
  const gotasOut = interpolate(frame, [t(7.2), t(9.0)], [1, 0], clamp);
  const humedad = interpolate(frame, [t(7.36), t(8.96)], [35, 10], {...clamp, easing: ease});
  const chipIn = interpolate(frame, [t(4.7), t(4.95)], [0, 1], clamp);
  const chipOut = interpolate(frame, [t(10.6), t(10.85)], [1, 0], clamp);
  const seca = interpolate(frame, [t(7.2), t(10.2)], [0, 1], clamp);
  const encoge = interpolate(frame, [t(10.08), t(10.7)], [0, 1], {...clamp, easing: ease});
  const flechasEncoge = interpolate(frame, [t(9.95), t(10.15), t(10.7), t(10.85)], [0, 1, 1, 0], clamp);

  // cámara: acercamiento lento y continuo
  const z = interpolate(frame, [0, t(10.85)], [6.6, 5.4], clamp);
  const giro = interpolate(frame, [0, t(10.85)], [-0.55, 0.15], clamp);

  return (
    <AbsoluteFill>
      <ThreeCanvas width={VIDEO.width} height={VIDEO.height}>
        <Camara pos={[0.6, 2.6, z]} mira={[0, 0.95, 0]} />
        <Luces />
        <group rotation={[0, giro, 0]}>
          <Tabla seca={seca} encoge={encoge} />
          <Gotas cantidad={gotasIn * gotasOut} y={0.1} />
          {/* el agua sale de la madera: flechas azules hacia arriba mientras se seca */}
          {[-0.5, 0, 0.5].map((x, i) =>
            [-1.2, 0.2, 1.4].map((zz, j) => {
              const p = interpolate(frame, [t(7.0) + (i + j) * 3, t(8.4) + (i + j) * 3], [0, 1], clamp);
              if (p <= 0 || p >= 1) return null;
              return (
                <Flecha
                  key={`${i}-${j}`}
                  position={[x, 0.15 + p * 0.9, zz]}
                  color={ANOTACIONES.agua}
                  largo={0.35}
                  opacidad={Math.sin(p * Math.PI)}
                />
              );
            }),
          )}
          {/* se encoge: flechas desde los bordes hacia adentro */}
          {flechasEncoge > 0 &&
            [-1.2, 0, 1.2].map((zz) => (
              <React.Fragment key={zz}>
                <Flecha position={[1.55, 0, zz]} rotation={[0, 0, Math.PI / 2]} color={ANOTACIONES.fuerza[0]} largo={0.35} opacidad={flechasEncoge} />
                <Flecha position={[-1.55, 0, zz]} rotation={[0, 0, -Math.PI / 2]} color={ANOTACIONES.fuerza[0]} largo={0.35} opacidad={flechasEncoge} />
              </React.Fragment>
            ))}
        </group>
      </ThreeCanvas>
      <Chip top={1500} opacidad={chipIn * chipOut} color={humedad > 13 ? '#93c5fd' : '#ffffff'}>
        💧 Humedad: {Math.round(humedad)}%
      </Chip>
    </AbsoluteFill>
  );
};

// ---------- Escena 4: largo vs ancho (vista desde arriba) ----------
const Cota: React.FC<{x: number; y: number; w: number; h: number; vertical?: boolean; texto: string; op: number; color: string}> = ({
  x,
  y,
  w,
  h,
  vertical,
  texto,
  op,
  color,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: op}}>
    <div
      style={{
        position: 'absolute',
        ...(vertical
          ? {left: w / 2 - 2, top: 0, width: 4, height: h}
          : {top: h / 2 - 2, left: 0, height: 4, width: w}),
        background: color,
        borderRadius: 2,
      }}
    />
    <div
      style={{
        position: 'absolute',
        ...(vertical ? {left: w / 2 + 22, top: h / 2 - 34} : {left: 0, right: 0, top: h / 2 + 14, textAlign: 'center'}),
        fontFamily: 'Inter, sans-serif',
        fontWeight: 800,
        fontSize: 52,
        color,
        whiteSpace: 'nowrap',
        textShadow: '0 2px 10px rgba(0,0,0,0.6)',
      }}
    >
      {texto}
    </div>
  </div>
);

export const EscenaDirecciones: React.FC = () => {
  const frame = useCurrentFrame();
  const ini = ESCENAS.direcciones;
  const t = (s: number) => rel(s, ini);
  const largoOp = interpolate(frame, [t(12.3), t(12.6)], [0, 1], clamp);
  const anchoOp = interpolate(frame, [t(13.9), t(14.2)], [0, 1], clamp);
  const encoge = interpolate(frame, [t(13.95), t(14.8)], [0, 1], {...clamp, easing: ease});
  const y = interpolate(frame, [0, t(14.96)], [7.6, 7.2], clamp);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={VIDEO.width} height={VIDEO.height}>
        <Camara pos={[0, y, 0.01]} mira={[0, 0, 0]} />
        <Luces />
        <Tabla seca={1} encoge={encoge} rotation={[0, Math.PI / 2, 0]} position={[0, 0, 1.3]} ancho={1.6} largo={4.4} />
        {anchoOp > 0 &&
          [-1.3, 0, 1.3].map((x) => (
            <React.Fragment key={x}>
              <Flecha position={[x, 0.15, 1.3 - 1.6]} rotation={[Math.PI / 2, 0, 0]} color={ANOTACIONES.fuerza[0]} largo={0.3} opacidad={anchoOp} />
              <Flecha position={[x, 0.15, 1.3 + 1.6]} rotation={[-Math.PI / 2, 0, 0]} color={ANOTACIONES.fuerza[0]} largo={0.3} opacidad={anchoOp} />
            </React.Fragment>
          ))}
      </ThreeCanvas>
      <Cota x={150} y={1060} w={780} h={60} texto="largo: ≈ 0,1 %" op={largoOp} color="#ffffff" />
      <div
        style={{
          position: 'absolute',
          top: 1490,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 800,
          fontSize: 52,
          color: ANOTACIONES.fuerza[0],
          opacity: anchoOp,
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        }}
      >
        ancho: hasta ≈ 5 %
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 5: curvan, juntas, grietas (vista desde la testa) ----------
export const EscenaDefectos: React.FC = () => {
  const frame = useCurrentFrame();
  const ini = ESCENAS.defectos;
  const t = (s: number) => rel(s, ini);
  const curva = interpolate(frame, [t(15.9), t(16.6)], [0, 1], {...clamp, easing: ease});
  const junta = interpolate(frame, [t(16.75), t(17.5)], [0, 1], {...clamp, easing: ease});
  const grieta = interpolate(frame, [t(18.3), t(18.9)], [0, 1], {...clamp, easing: ease});
  const anillo = interpolate(frame, [t(18.45), t(18.95)], [0, 1], clamp);
  const giro = interpolate(frame, [0, t(19.16)], [0.55, 0.35], clamp);
  const notaOp = interpolate(frame, [t(15.9), t(16.2)], [0, 0.85], clamp);
  const sep = 0.22 * junta;
  return (
    <AbsoluteFill>
      <ThreeCanvas width={VIDEO.width} height={VIDEO.height}>
        <Camara pos={[2.0, 1.9, 4.9]} mira={[0, 0.7, 0]} />
        <Luces />
        <group rotation={[0, giro, 0]}>
          {[-1, 0, 1].map((k) => (
            <Tabla
              key={k}
              ancho={1.1}
              largo={4}
              seca={1}
              curva={curva * (k === 0 ? -1 : 1)}
              grieta={k === 0 ? grieta : 0}
              position={[k * (1.1 + sep), 0, 0]}
            />
          ))}
          <Anillo position={[0.18, 0.12, 2.0]} progreso={anillo} radio={0.4} />
        </group>
      </ThreeCanvas>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 1560,
          fontFamily: 'Inter, sans-serif',
          fontSize: 30,
          color: 'rgba(255,255,255,0.7)',
          opacity: notaOp,
        }}
      >
        Deformación exagerada para que se vea
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 6: medir la humedad ----------
const Higrometro: React.FC<{valor: number; enRango: boolean}> = ({valor, enRango}) => (
  <svg width="300" height="560" viewBox="0 0 300 560">
    {/* púas */}
    <rect x="105" y="470" width="12" height="90" rx="4" fill="#c8ccd0" />
    <rect x="183" y="470" width="12" height="90" rx="4" fill="#c8ccd0" />
    {/* cuerpo amarillo/negro como un higrómetro de púas real */}
    <rect x="20" y="0" width="260" height="490" rx="44" fill="#1f2125" />
    <rect x="34" y="14" width="232" height="462" rx="36" fill="#f2b705" />
    <rect x="62" y="60" width="176" height="120" rx="12" fill="#1f2125" />
    <rect x="72" y="70" width="156" height="100" rx="8" fill="#b9c7a3" />
    <text x="150" y="146" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="64" fontWeight="700" fill="#1e2a14">
      {valor.toFixed(1)}
    </text>
    <text x="214" y="164" textAnchor="middle" fontFamily="Inter" fontSize="20" fontWeight="700" fill="#1e2a14">%</text>
    <circle cx="110" cy="260" r="26" fill="#1f2125" />
    <circle cx="190" cy="260" r="26" fill="#1f2125" />
    <circle cx="150" cy="380" r="16" fill={enRango ? '#22c55e' : '#3a3a3a'} />
  </svg>
);

export const EscenaMedir: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ini = ESCENAS.medir;
  const t = (s: number) => rel(s, ini);
  const entra = spring({frame: frame - t(20.2), fps, config: {damping: 15}});
  const valor = interpolate(frame, [t(20.9), t(22.1)], [0, 10.2], {...clamp, easing: Easing.out(Easing.cubic)});
  const rango = interpolate(frame, [t(21.5), t(21.8)], [0, 1], clamp);
  const giro = interpolate(frame, [0, t(23.24)], [-0.3, -0.15], clamp);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={VIDEO.width} height={VIDEO.height}>
        <Camara pos={[0, 2.9, 5.6]} mira={[0, 1.05, 0]} />
        <Luces />
        <group rotation={[0, giro, 0]}>
          <Tabla seca={1} />
        </group>
      </ThreeCanvas>
      <div
        style={{
          position: 'absolute',
          left: 390,
          top: 810 + (1 - entra) * -500,
          opacity: entra,
          transform: 'scale(0.9)',
        }}
      >
        <Higrometro valor={valor} enRango={valor >= 8 && valor <= 12} />
      </div>
      <div style={{position: 'absolute', top: 1500, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: rango}}>
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 46,
            color: '#ffffff',
            background: 'rgba(34,197,94,0.85)',
            borderRadius: 999,
            padding: '10px 32px',
          }}
        >
          ✓ Ideal para muebles: 8–12 %
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Escena 7: cierre, tablero seco y plano ----------
export const EscenaCierre: React.FC = () => {
  const frame = useCurrentFrame();
  const ini = ESCENAS.cierre;
  const t = (s: number) => rel(s, ini);
  const giro = interpolate(frame, [0, t(26.5)], [0.6, -0.1], clamp);
  const marca = interpolate(frame, [t(24.6), t(25.2)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <ThreeCanvas width={VIDEO.width} height={VIDEO.height}>
        <Camara pos={[0, 2.6, 5.8]} mira={[0, 0.95, 0]} />
        <Luces />
        <group rotation={[0, giro, 0]}>
          {[-1, 0, 1].map((k) => (
            <Tabla key={k} ancho={1.1} largo={4} seca={1} position={[k * 1.1, 0, 0]} />
          ))}
        </group>
      </ThreeCanvas>
      <div
        style={{
          position: 'absolute',
          top: 1520,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 36,
          color: 'rgba(255,255,255,0.85)',
          opacity: marca,
          letterSpacing: 1,
        }}
      >
        @somos_nudodesign
      </div>
    </AbsoluteFill>
  );
};
