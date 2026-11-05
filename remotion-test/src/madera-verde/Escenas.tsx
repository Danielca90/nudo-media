import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Tabla, Flecha, Anillo, Camara, Luces, Mesa, Tronco, xTabla, ALTO_MESA, LARGO_MESA, ANCHO_TABLA} from './Madera3D';
import {ESCENAS, FPS} from './tiempos';
import {camaraEn, proyectar, Clave, Vec} from './camara';
import {Etiqueta, Tarjeta, Barra, Valor} from './Overlays';
import {ANOTACIONES, VIDEO} from '../estilo';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
// segundos absolutos de la voz dentro de una escena
const useSeg = (ini: number) => ini + useCurrentFrame() / FPS;
const tramo = (seg: number, a: number, b: number, e = true) =>
  interpolate(seg, [a, b], [0, 1], e ? {...clamp, easing: ease} : clamp);
const pulso = (seg: number, t: number) => spring({frame: Math.round((seg - t) * FPS), fps: FPS, config: {damping: 15}});

export const FondoTaller: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, #4a3a2b 0%, #2b211a 40%, #15100c 78%, #0e0b08 100%)'}} />
);

const Lienzo: React.FC<{cam: {pos: Vec; mira: Vec}; children: React.ReactNode}> = ({cam, children}) => (
  <ThreeCanvas width={VIDEO.width} height={VIDEO.height}>
    <Camara pos={cam.pos} mira={cam.mira} />
    <Luces />
    {children}
  </ThreeCanvas>
);

const NotaExagerada: React.FC<{op: number}> = ({op}) => (
  <div style={{position: 'absolute', left: 70, top: 1560, fontFamily: 'Inter', fontSize: 26, color: 'rgba(255,255,255,0.6)', opacity: op}}>
    Deformación exagerada para que se vea
  </div>
);

// ============ 1. Gancho: la mesa hecha con madera verde ============
export const EscenaGancho: React.FC = () => {
  const seg = useSeg(ESCENAS.gancho);
  const claves: Clave[] = [
    {t: 0, pos: [4.4, 3.8, 7.2], mira: [0, 1.0, 0]},
    {t: 0.4, pos: [2.9, 2.7, 4.9], mira: [0, 1.15, 0.3]},
  ];
  const cam = camaraEn(seg, claves, 2.2);
  const etq = tramo(seg, 1.95, 2.35, false);
  return (
    <AbsoluteFill>
      <Lienzo cam={cam}>
        <Mesa seca={0} />
      </Lienzo>
      <Etiqueta punto={proyectar([0.9, ALTO_MESA, 1.3], cam)} texto="MADERA VERDE = RECIÉN CORTADA" dx={-60} dy={330} op={etq} />
    </AbsoluteFill>
  );
};

// ============ 2. De dónde sale: el tronco recién cortado ============
export const EscenaTronco: React.FC = () => {
  const seg = useSeg(ESCENAS.agua);
  const sube = tramo(seg, 3.05, 3.75);
  const yTabla = 0.42 + sube * 1.35;
  const claves: Clave[] = [
    {t: 2.68, pos: [3.0, 1.9, 5.6], mira: [0, 0.45, 0.4]},
    {t: 3.0, pos: [2.5, 2.4, 5.0], mira: [0, 0.8, 0.6]},
    {t: 3.82, pos: [0.15, yTabla + 0.08, 2.35], mira: [0, yTabla, 1.75]},
  ];
  const cam = camaraEn(seg, claves.slice(0, 2), 0.9);
  const zoom = tramo(seg, 3.82, 4.04);
  const camFinal = {
    pos: cam.pos.map((v, i) => v + (claves[2].pos[i] - v) * zoom) as Vec,
    mira: cam.mira.map((v, i) => v + (claves[2].mira[i] - v) * zoom) as Vec,
  };
  return (
    <AbsoluteFill>
      <Lienzo cam={camFinal}>
        <Tronco />
        <Tabla ancho={1.4} largo={3.52} espesor={0.22} seca={0} position={[0, yTabla, 0]} />
      </Lienzo>
      <Etiqueta punto={proyectar([-0.82, 0.82, 1.3], camFinal)} texto="CORTEZA" dx={-120} dy={-150} op={tramo(seg, 2.75, 3.05, false) * (1 - zoom)} />
      <Etiqueta punto={proyectar([0, -0.02, 1.71], camFinal)} texto="CENTRO (MÉDULA)" dx={-60} dy={300} op={tramo(seg, 2.9, 3.2, false) * (1 - zoom)} />
    </AbsoluteFill>
  );
};

// ============ 3. Vista ampliada: agua dentro de las células ============
const Celulas: React.FC<{agua: number; encoge: number; seg: number}> = ({agua, encoge, seg}) => {
  const cols = 6;
  const rows = 4;
  const k = 1 - 0.16 * encoge; // exagerado
  const w = 140 * k;
  const h = 112;
  const gx = 12 * k;
  const ancho = cols * w + (cols - 1) * gx;
  const x0 = (1000 - ancho) / 2;
  const pared = 16 * (1 - 0.35 * encoge);
  const celdas = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * (w + gx) + (r % 2 ? 8 : 0);
      const y = 30 + r * (h + 10);
      celdas.push(
        <g key={`${r}-${c}`}>
          <rect x={x} y={y} width={w} height={h} rx={26} fill="#caa46c" />
          <rect x={x + pared} y={y + pared} width={w - pared * 2} height={h - pared * 2} rx={18} fill="#3a2a1c" />
          <rect
            x={x + pared}
            y={y + pared + (h - pared * 2) * (1 - agua)}
            width={w - pared * 2}
            height={(h - pared * 2) * agua}
            rx={14}
            fill={ANOTACIONES.agua}
            opacity={0.85}
          />
        </g>,
      );
    }
  }
  // gotas que salen mientras se seca
  const gotas = [0, 1, 2, 3, 4, 5].map((i) => {
    const p = interpolate(seg, [6.9 + i * 0.18, 7.9 + i * 0.18], [0, 1], clamp);
    if (p <= 0 || p >= 1) return null;
    return <circle key={i} cx={x0 + 60 + i * 150} cy={30 - p * 120} r={12} fill={ANOTACIONES.agua} opacity={1 - p} />;
  });
  return (
    <svg width={1000} height={520} viewBox="0 -100 1000 620" style={{overflow: 'visible'}}>
      {celdas}
      {gotas}
      {encoge > 0.02 &&
        [0, 1, 2].map((i) => (
          <g key={i} opacity={Math.min(1, encoge * 3)}>
            <path d={`M ${x0 - 70} ${80 + i * 120} l 50 0 m -16 -14 l 16 14 l -16 14`} stroke={ANOTACIONES.fuerza[0]} strokeWidth={8} fill="none" />
            <path d={`M ${1000 - x0 + 70} ${80 + i * 120} l -50 0 m 16 -14 l -16 14 l 16 14`} stroke={ANOTACIONES.fuerza[0]} strokeWidth={8} fill="none" />
          </g>
        ))}
    </svg>
  );
};

export const EscenaCelulas: React.FC = () => {
  const seg = useSeg(4.04);
  const entra = tramo(seg, 4.04, 4.3);
  const agua = 1 - tramo(seg, 7.2, 8.3);
  const encoge = tramo(seg, 9.3, 10.6);
  const humedad = interpolate(seg, [7.36, 8.96], [60, 10], {...clamp, easing: ease});
  const tarjeta = tramo(seg, 4.75, 5.0, false);
  const etqPared = tramo(seg, 4.3, 4.6, false) * (1 - tramo(seg, 6.3, 6.5, false));
  const etqAgua = tramo(seg, 5.8, 6.1, false) * (1 - tramo(seg, 7.1, 7.3, false));
  const bajo30 = humedad <= 30;
  return (
    <AbsoluteFill style={{transform: `scale(${1.25 - 0.25 * entra})`, opacity: entra}}>
      <div style={{position: 'absolute', left: 60, top: 860, fontFamily: 'Inter', fontWeight: 800, fontSize: 26, letterSpacing: 4, color: 'rgba(255,255,255,0.7)'}}>
        🔍 VISTA AMPLIADA · CÉLULAS DE LA MADERA
      </div>
      <div style={{position: 'absolute', left: 40, top: 910}}>
        <Celulas agua={agua} encoge={encoge} seg={seg} />
      </div>
      <Etiqueta punto={{x: 40 + 92, y: 910 + 100 + 30 + 8}} texto="PARED CELULAR" dx={40} dy={-115} op={etqPared} />
      <Etiqueta punto={{x: 40 + 520, y: 910 + 100 + 30 + 260}} texto="AGUA" dx={180} dy={60} op={etqAgua} color="#93c5fd" />
      <Tarjeta titulo="HUMEDAD DE LA MADERA" top={1390} op={tarjeta} fuente={bajo30 ? 'Bajo ~30 % las paredes pierden agua y se encogen' : 'Madera recién cortada: más de 30 % (puede pasar de 100 %)'}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
          <Valor texto={`${Math.round(humedad)} %`} color={humedad > 30 ? '#93c5fd' : '#fff'} />
          <div style={{flex: 1, height: 22, background: 'rgba(255,255,255,0.08)', borderRadius: 11, position: 'relative'}}>
            <div style={{width: `${(humedad / 60) * 100}%`, height: '100%', background: humedad > 30 ? ANOTACIONES.agua : '#e5e7eb', borderRadius: 11}} />
            <div style={{position: 'absolute', left: '50%', top: -10, width: 3, height: 42, background: '#f5b942'}} />
          </div>
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

// ============ 4. Largo vs ancho ============
const Cota: React.FC<{a: {x: number; y: number}; b: {x: number; y: number}; texto: string; op: number; color: string; dy?: number}> = ({a, b, texto, op, color, dy = -50}) => {
  if (op <= 0) return null;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'visible', opacity: op}}>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#000" strokeWidth={9} strokeLinecap="round" />
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <circle cx={a.x} cy={a.y} r={9} fill={color} stroke="#000" strokeWidth={2} />
        <circle cx={b.x} cy={b.y} r={9} fill={color} stroke="#000" strokeWidth={2} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: mx - 200,
          width: 400,
          top: my + dy,
          textAlign: 'center',
          fontFamily: 'Inter',
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: 2,
          color,
          opacity: op,
          WebkitTextStroke: '8px #000',
          paintOrder: 'stroke fill',
        }}
      >
        {texto}
      </div>
    </>
  );
};

export const EscenaDirecciones: React.FC = () => {
  const seg = useSeg(ESCENAS.direcciones);
  const encoge = tramo(seg, 14.35, 14.9);
  const claves: Clave[] = [
    {t: 10.85, pos: [4.0, 3.6, 5.6], mira: [0, -0.3, 0]},
    {t: 12.2, pos: [5.4, 3.2, 1.6], mira: [0, -0.35, 0]},
    {t: 13.75, pos: [1.6, 2.2, 5.0], mira: [0, -0.35, 1.4]},
  ];
  const cam = camaraEn(seg, claves, 0.8);
  const sx = 1 - 0.12 * encoge;
  const opL = tramo(seg, 12.4, 12.7, false);
  const opA = tramo(seg, 13.95, 14.25, false);
  const tarjeta = tramo(seg, 12.35, 12.6, false);
  return (
    <AbsoluteFill>
      <Lienzo cam={cam}>
        <Tabla seca={1} encoge={encoge} />
        {opA > 0 &&
          [-1.2, 0, 1.2].map((zz) => (
            <React.Fragment key={zz}>
              <Flecha position={[1.25, 0, zz]} rotation={[0, 0, Math.PI / 2]} color={ANOTACIONES.fuerza[0]} largo={0.3} opacidad={opA} />
              <Flecha position={[-1.25, 0, zz]} rotation={[0, 0, -Math.PI / 2]} color={ANOTACIONES.fuerza[0]} largo={0.3} opacidad={opA} />
            </React.Fragment>
          ))}
      </Lienzo>
      <Cota a={proyectar([0.95, 0.12, -2.2], cam)} b={proyectar([0.95, 0.12, 2.2], cam)} texto="LARGO" op={opL * (1 - opA * 0.6)} color="#ffffff" />
      <Cota a={proyectar([-0.8 * sx, 0.12, 2.45], cam)} b={proyectar([0.8 * sx, 0.12, 2.45], cam)} texto="ANCHO" op={opA} color={ANOTACIONES.fuerza[0]} dy={20} />
      <Tarjeta titulo="CUÁNTO SE ENCOGE (DE VERDE A 10 %)" top={1360} op={tarjeta} fuente="Promedio, varía según la especie · Wood Handbook (USDA)">
        <Barra etiqueta="Largo" valor={opL * 0.1} max={6} color="#ffffff" texto="0,1 %" />
        <Barra etiqueta="Ancho" valor={opA * 5} max={6} color={ANOTACIONES.fuerza[0]} texto={opA > 0 ? '≈ 5 %' : '—'} />
      </Tarjeta>
    </AbsoluteFill>
  );
};

// ============ 5. La mesa: se curva, se abren juntas, grietas ============
export const EscenaDefectos: React.FC = () => {
  const seg = useSeg(ESCENAS.defectos);
  const curva = tramo(seg, 16.0, 16.6);
  const junta = tramo(seg, 16.8, 17.5);
  const grieta = tramo(seg, 18.3, 18.9);
  const sep = 0.07 * junta;
  const claves: Clave[] = [
    {t: 14.96, pos: [4.6, 3.8, 7.0], mira: [0, 1.0, 0]},
    {t: 15.45, pos: [0.9, 2.25, 4.9], mira: [0, 1.4, 1.6]},
    {t: 16.65, pos: [0.85, 1.85, 3.25], mira: [0.45, 1.42, 1.6]},
    {t: 17.75, pos: [1.6, 1.8, 3.05], mira: [1.1, 1.42, 1.6]},
  ];
  const cam = camaraEn(seg, claves, 0.6);
  const zFrente = LARGO_MESA / 2;
  const xGrieta = xTabla(1, sep) + 0.18;
  return (
    <AbsoluteFill>
      <Lienzo cam={cam}>
        <Mesa seca={1} curva={curva} junta={junta} grieta={grieta} />
        <Anillo position={[xGrieta, ALTO_MESA - 0.04, zFrente + 0.02]} progreso={tramo(seg, 18.4, 18.9, false)} radio={0.16} />
      </Lienzo>
      <Etiqueta punto={proyectar([xTabla(1, sep) + ANCHO_TABLA / 2, ALTO_MESA + 0.07 * curva, zFrente], cam)} texto="SE CURVA" dx={-40} dy={-160} op={tramo(seg, 16.15, 16.45, false) * (1 - tramo(seg, 16.7, 16.8, false))} />
      <Etiqueta punto={proyectar([(xTabla(0, sep) + xTabla(1, sep)) / 2, ALTO_MESA - 0.05, zFrente], cam)} texto="JUNTA ABIERTA" dx={-60} dy={300} op={tramo(seg, 17.3, 17.6, false) * (1 - tramo(seg, 17.75, 17.85, false))} />
      <Etiqueta punto={proyectar([xGrieta, ALTO_MESA - 0.06, zFrente], cam)} texto="GRIETA" dx={-80} dy={300} op={tramo(seg, 18.5, 18.8, false)} color="#facc15" />
      <NotaExagerada op={tramo(seg, 15.9, 16.2, false) * 0.9} />
    </AbsoluteFill>
  );
};

// ============ 6. Medir la humedad ============
const Higrometro: React.FC<{valor: number; enRango: boolean}> = ({valor, enRango}) => (
  <svg width="300" height="560" viewBox="0 0 300 560">
    <rect x="105" y="470" width="12" height="90" rx="4" fill="#c8ccd0" />
    <rect x="183" y="470" width="12" height="90" rx="4" fill="#c8ccd0" />
    <rect x="20" y="0" width="260" height="490" rx="44" fill="#1f2125" />
    <rect x="34" y="14" width="232" height="462" rx="36" fill="#f2b705" />
    <rect x="62" y="60" width="176" height="120" rx="12" fill="#1f2125" />
    <rect x="72" y="70" width="156" height="100" rx="8" fill="#b9c7a3" />
    <text x="146" y="146" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="62" fontWeight="700" fill="#1e2a14">
      {valor.toFixed(1)}
    </text>
    <text x="214" y="164" textAnchor="middle" fontFamily="Inter" fontSize="20" fontWeight="700" fill="#1e2a14">%</text>
    <text x="150" y="226" textAnchor="middle" fontFamily="Inter" fontSize="20" fontWeight="800" fill="#1f2125" letterSpacing="3">MADERA</text>
    <circle cx="110" cy="300" r="26" fill="#1f2125" />
    <circle cx="190" cy="300" r="26" fill="#1f2125" />
    <circle cx="150" cy="400" r="16" fill={enRango ? '#22c55e' : '#3a3a3a'} />
  </svg>
);

export const EscenaMedir: React.FC = () => {
  const seg = useSeg(ESCENAS.medir);
  const entra = spring({frame: Math.round((seg - 20.2) * FPS), fps: FPS, config: {damping: 14}});
  const valor = interpolate(seg, [20.9, 22.1], [0, 10.2], {...clamp, easing: Easing.out(Easing.cubic)});
  const zoom = tramo(seg, 21.0, 21.5);
  const tarjeta = tramo(seg, 21.3, 21.6, false);
  const banda = tramo(seg, 22.1, 22.4, false);
  const cam = camaraEn(seg, [
    {t: 19.16, pos: [0.6, 3.4, 5.6], mira: [0, -0.2, 0]},
    {t: 19.3, pos: [0.3, 2.6, 4.2], mira: [0, -0.1, 0.3]},
  ], 3);
  return (
    <AbsoluteFill>
      <Lienzo cam={cam}>
        <Tabla seca={1} />
      </Lienzo>
      <div style={{position: 'absolute', left: 390, top: 820 + (1 - entra) * -600, transformOrigin: '150px 120px', transform: `scale(${0.85 + zoom * 0.35})`}}>
        <Higrometro valor={valor} enRango={valor >= 8 && valor <= 12} />
      </div>
      <Tarjeta titulo="HUMEDAD IDEAL · MUEBLES DE INTERIOR" top={1380} op={tarjeta} fuente="Medidor de púas: se clava en la madera y da el % de agua">
        <div style={{position: 'relative', height: 70, marginTop: 18}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 22, height: 22, background: 'rgba(255,255,255,0.1)', borderRadius: 11}} />
          <div style={{position: 'absolute', left: `${(8 / 30) * 100}%`, width: `${(4 / 30) * 100}%`, top: 22, height: 22, background: '#22c55e', borderRadius: 6, opacity: 0.4 + banda * 0.6}} />
          <div style={{position: 'absolute', left: `calc(${(valor / 30) * 100}% - 3px)`, top: 8, width: 6, height: 50, background: '#fff', borderRadius: 3}} />
          {[0, 8, 12, 30].map((v) => (
            <div key={v} style={{position: 'absolute', left: `calc(${(v / 30) * 100}% - 30px)`, width: 60, textAlign: 'center', top: 52, fontFamily: 'JetBrains Mono', fontSize: 22, color: v === 8 || v === 12 ? '#86efac' : 'rgba(255,255,255,0.5)'}}>
              {v}%
            </div>
          ))}
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

// ============ 7. Cierre: la mesa seca, plana ============
export const EscenaCierre: React.FC = () => {
  const seg = useSeg(ESCENAS.cierre);
  const cam = camaraEn(seg, [
    {t: 23.24, pos: [-4.0, 3.2, 6.0], mira: [0, 1.0, 0]},
    {t: 23.3, pos: [3.6, 3.0, 5.6], mira: [0, 1.1, 0]},
  ], 3.2);
  const ok = tramo(seg, 23.8, 24.1, false);
  const marca = tramo(seg, 24.8, 25.3, false);
  return (
    <AbsoluteFill>
      <Lienzo cam={cam}>
        <Mesa seca={1} />
      </Lienzo>
      <Etiqueta punto={proyectar([0, ALTO_MESA, 0.4], cam)} texto="✓ SECA, PLANA Y ESTABLE" dx={-200} dy={330} op={ok} color="#86efac" />
      <div style={{position: 'absolute', top: 1540, left: 0, right: 0, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700, fontSize: 36, color: 'rgba(255,255,255,0.9)', opacity: marca}}>
        @somos_nudodesign
      </div>
    </AbsoluteFill>
  );
};
