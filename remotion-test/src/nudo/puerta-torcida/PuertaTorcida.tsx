// Reel Nudo Design – "¿La puerta de tu cocina quedó torcida?" (bisagra de cazoleta, 3 tornillos). Ver GUION.md.
import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {Camara} from '../../madera-verde/Madera3D';
import {camaraEn, proyectar, Clave, Vec} from '../../madera-verde/camara';
import {Etiqueta} from '../../madera-verde/Overlays';
import {FONDOS} from '../../madera-verde/fondo';
import {NUDO_FUENTES} from '../fuentes';
import palabrasJson from './palabras.json';
import {Cocina, Luces, Destornillador, EstadoPuerta, GirosTornillos, tornillosBisagra, puntoPuerta, Y_BISAGRAS, PUERTA, V3} from './Cocina3D';

type Palabra = {text: string; start: number; end: number};
const PALABRAS = palabrasJson as Palabra[];
const FPS = 30;
const FIN_VOZ = 28.45;
export const DURACION_SEG = 31.0;

const AMARILLO = '#f5c518'; // amarillo de herramienta (anotaciones)
const VERDE = '#3ddc84';
const ROJO = '#ff4d4d';

const useT = () => useCurrentFrame() / FPS;
const tramo = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const vent = (t: number, a: number, b: number, d = 0.25) => Math.min(tramo(t, a, a + d), 1 - tramo(t, b - d, b));

// ---------- estado de la puerta en el tiempo ----------
const ABIERTA = 1.62; // ≈ 93°
const estadoPuerta = (t: number): EstadoPuerta => {
  const abre =
    ABIERTA *
    Math.max(
      tramo(t, 5.2, 6.2) * (1 - tramo(t, 11.45, 11.95)),
      tramo(t, 13.85, 14.35) * (1 - tramo(t, 16.25, 16.7)),
      tramo(t, 18.0, 18.45) * (1 - tramo(t, 20.3, 20.75)),
    );
  const corrLado = tramo(t, 12.0, 13.1);
  const corrProf = tramo(t, 16.85, 17.5);
  const corrAlto = tramo(t, 18.85, 19.6);
  return {
    abre,
    inclina: 0.05 * (1 - corrLado),
    lado: -0.006 * (1 - corrLado),
    prof: 0.014 * (1 - corrProf),
    alto: -0.007 * (1 - corrAlto),
  };
};
const girosTornillos = (t: number): GirosTornillos => ({
  lado: tramo(t, 9.85, 11.3) * Math.PI * 1.5,
  prof: tramo(t, 14.45, 15.9) * Math.PI * 1.5,
  base: tramo(t, 18.6, 19.6) * Math.PI,
});

// ---------- cámara ----------
const VISTA_GENERAL = {pos: [0.06, 0.74, 2.3] as Vec, mira: [0.04, 0.55, 0.3] as Vec};
const VISTA_BISAGRA = {pos: [0.2, 0.86, 0.9] as Vec, mira: [0.43, 0.71, 0.52] as Vec};
const VISTA_FRENTE = {pos: [0.12, 0.52, 2.3] as Vec, mira: [0.12, 0.52, 0.5] as Vec};
const VISTA_LADO = {pos: [0.78, 0.44, 1.2] as Vec, mira: [0.08, 0.46, 0.57] as Vec};
const CLAVES: Clave[] = [
  {t: 0, ...VISTA_GENERAL},
  {t: 0.2, pos: [0.1, 0.68, 2.0], mira: [0.07, 0.52, 0.32]},
  {t: 2.3, pos: [0.14, 0.64, 1.8], mira: [0.1, 0.5, 0.36]},
  {t: 5.3, ...VISTA_BISAGRA},
  {t: 8.2, pos: [0.22, 0.84, 0.86], mira: [0.43, 0.71, 0.52]},
  {t: 11.45, ...VISTA_FRENTE},
  {t: 13.75, ...VISTA_BISAGRA},
  {t: 16.2, ...VISTA_LADO},
  {t: 17.95, ...VISTA_BISAGRA},
  {t: 20.3, ...VISTA_FRENTE},
  {t: 23.4, ...VISTA_GENERAL},
];
const camara = (t: number) => camaraEn(t, CLAVES.map((c, i) => (i === 1 ? {...c} : c)), 0.85);

// ---------- subtítulos (estilo Nudo: media altura, borde negro, palabra clave en recuadro) ----------
const CLAVE = new Set(['torcida?', 'destornillador.', 'tres', 'lados:', 'atrás', 'ras.', 'base', 'cuartos', 'igual.', 'comentarios', 'Escríbelo']);
const Subtitulos: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  if (t > FIN_VOZ) return null;
  const bloques: number[][] = [];
  let a: number[] = [];
  PALABRAS.forEach((p, i) => {
    a.push(i);
    if (/[.,:?!]$/.test(p.text) || a.length >= 4) { bloques.push(a); a = []; }
  });
  if (a.length) bloques.push(a);
  const b = bloques.find((bl, i) => {
    const ini = PALABRAS[bl[0]].start - 0.05;
    const sig = bloques[i + 1];
    const fin = sig ? PALABRAS[sig[0]].start - 0.05 : PALABRAS[bl[bl.length - 1]].end + 0.5;
    return t >= ini && t < fin;
  });
  if (!b) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 720, textAlign: 'center', fontFamily: NUDO_FUENTES.sans, fontWeight: 800, fontSize: 62, lineHeight: 1.3}}>
      {b.map((i) => {
        const p = PALABRAS[i];
        const vis = p.start - 0.05 <= t;
        const s = spring({frame: frame - Math.round((p.start - 0.05) * FPS), fps: FPS, config: {damping: 14, stiffness: 260}});
        const clave = CLAVE.has(p.text);
        return (
          <span key={i} style={{display: 'inline-block', margin: '0 8px', padding: clave ? '0 12px 4px' : 0, borderRadius: 8,
            color: clave ? '#111' : '#fff', background: clave ? AMARILLO : 'transparent', opacity: vis ? Math.min(1, s * 1.5) : 0.35,
            transform: `scale(${vis ? 0.88 + s * 0.12 : 0.9})`, ...(clave ? {} : {WebkitTextStroke: '9px #000', paintOrder: 'stroke fill'})}}>
            {p.text}
          </span>
        );
      })}
    </div>
  );
};

// ---------- piezas 2D ----------
const Gancho: React.FC = () => {
  const t = useT();
  const o = 1 - tramo(t, 4.6, 5.1);
  if (o <= 0) return null;
  const linea = (txt: React.ReactNode, size: number) => (
    <div style={{fontFamily: NUDO_FUENTES.titular, fontSize: size, lineHeight: 1.0, color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill',
      textAlign: 'center', letterSpacing: 1}}>{txt}</div>
  );
  return (
    <div style={{position: 'absolute', top: 210, left: 40, right: 40, opacity: o}}>
      {linea('¿LA PUERTA DE TU COCINA', 92)}
      {linea(<>QUEDÓ <span style={{color: AMARILLO}}>TORCIDA?</span></>, 124)}
    </div>
  );
};

/** Anillo 2D alrededor de un punto proyectado. */
const Aro: React.FC<{x: number; y: number; r: number; p: number; color: string}> = ({x, y, r, p, color}) =>
  p <= 0 ? null : (
    <svg style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'visible'}}>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#000" strokeWidth={13} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - p)} transform={`rotate(-90 ${x} ${y})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - p)} transform={`rotate(-90 ${x} ${y})`} />
    </svg>
  );

/** Flecha doble 2D (dirección del ajuste). */
const FlechaDoble: React.FC<{x: number; y: number; ang: number; largo: number; op: number}> = ({x, y, ang, largo, op}) =>
  op <= 0 ? null : (
    <svg style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'visible', opacity: op}}>
      <g transform={`translate(${x} ${y}) rotate(${ang})`}>
        <path d={`M ${-largo / 2} 0 H ${largo / 2}`} stroke="#000" strokeWidth={16} strokeLinecap="round" />
        <path d={`M ${-largo / 2} 0 H ${largo / 2}`} stroke={AMARILLO} strokeWidth={9} strokeLinecap="round" />
        {[1, -1].map((s) => (
          <path key={s} d={`M ${s * largo / 2} 0 l ${-s * 30} -22 M ${s * largo / 2} 0 l ${-s * 30} 22`} stroke={AMARILLO} strokeWidth={9} strokeLinecap="round"
            style={{filter: 'drop-shadow(0 0 2px #000) drop-shadow(0 0 2px #000)'}} />
        ))}
      </g>
    </svg>
  );

const Chip: React.FC<{texto: string; top: number; op: number; color?: string; fondo?: string}> = ({texto, top, op, color = '#111', fondo = AMARILLO}) =>
  op <= 0 ? null : (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: op, transform: `scale(${0.85 + 0.15 * op})`}}>
      <div style={{fontFamily: NUDO_FUENTES.titular, fontSize: 64, color, background: fondo, padding: '8px 26px', borderRadius: 12, border: '4px solid #000',
        letterSpacing: 1}}>{texto}</div>
    </div>
  );

export const PuertaTorcida: React.FC = () => {
  const t = useT();
  const e = estadoPuerta(t);
  const g = girosTornillos(t);
  const cam = camara(t);
  const tor = tornillosBisagra(Y_BISAGRAS[0], e);

  // destornillador: va al tornillo activo
  const objetivo: V3 | null = t >= 9.7 && t < 11.45 ? tor.lado : t >= 14.3 && t < 16.2 ? tor.prof : t >= 18.45 && t < 20.25 ? tor.base : null;
  const giroDest = t < 12 ? g.lado : t < 17 ? g.prof : g.base;
  const pres = objetivo ? tramo(t, t < 12 ? 9.7 : t < 17 ? 14.3 : 18.45, (t < 12 ? 9.7 : t < 17 ? 14.3 : 18.45) + 0.3) : 0;

  // puntos de interés proyectados
  const pBrecha = proyectar(puntoPuerta([-(PUERTA.xDer - PUERTA.xIzq) + 0.01, PUERTA.yIni + 0.04, 0.018], e) as Vec, cam);
  const p1 = proyectar(tor.lado as Vec, cam);
  const p2 = proyectar(tor.prof as Vec, cam);
  const p3 = proyectar(tor.base as Vec, cam);
  const bisSup = proyectar([PUERTA.xDer - 0.02, Y_BISAGRAS[0], 0.6] as Vec, cam);
  const bisInf = proyectar([PUERTA.xDer - 0.02, Y_BISAGRAS[1], 0.6] as Vec, cam);
  const canto = proyectar([0.004, 0.46, 0.578 + e.prof] as Vec, cam);
  const cantoAdelante = proyectar([0.004, 0.46, 0.678 + e.prof] as Vec, cam);
  const angProf = (Math.atan2(cantoAdelante.y - canto.y, cantoAdelante.x - canto.x) * 180) / Math.PI;
  const centroPuerta = proyectar([0.225, 0.46, 0.6] as Vec, cam);

  // etiquetas de los 3 tornillos en la vista de bisagra
  const etqVis = (a: number) => vent(t, a, 9.55, 0.3);

  return (
    <AbsoluteFill style={{background: FONDOS.grafito.fondo}}>
      <Audio src={staticFile('nudo/voz-puerta-torcida.mp3')} />
      <ThreeCanvas width={1080} height={1920} shadows>
        <Camara pos={cam.pos} mira={cam.mira} />
        <Luces />
        <Cocina e={e} giros={g} />
        {/* destornillador héroe en el gancho (se presenta) */}
        {t >= 2.2 && t < 5.4 && (
          <Destornillador punta={[0.36 - (1 - tramo(t, 2.2, 3.0)) * 0.6, 0.47, 0.86]} giro={t * 2.4} escala={2.4} />
        )}
        {/* destornillador trabajando en el tornillo activo */}
        {objetivo && <Destornillador punta={[objetivo[0] - 0.002 - (1 - pres) * 0.06, objetivo[1], objetivo[2]]} giro={giroDest} />}
      </ThreeCanvas>

      {/* gancho: la puerta torcida, abertura en V */}
      <Aro x={pBrecha.x} y={pBrecha.y} r={80} p={tramo(t, 1.3, 1.8) * (1 - tramo(t, 4.8, 5.1))} color={ROJO} />
      <Gancho />
      <Chip texto="SOLO NECESITAS ESTO" top={1240} op={vent(t, 3.6, 5.1, 0.25)} />

      {/* vista de la bisagra: los 3 tornillos */}
      <Etiqueta punto={p1} texto="1 · LADOS" dx={120} dy={-300} op={etqVis(6.6)} color={AMARILLO} />
      <Etiqueta punto={p2} texto="2 · PROFUNDIDAD" dx={-340} dy={-330} op={etqVis(7.15)} color={AMARILLO} />
      <Etiqueta punto={p3} texto="3 · ALTURA" dx={-320} dy={260} op={etqVis(7.7)} color={AMARILLO} />

      {/* tornillo 1: lados */}
      <Aro x={p1.x} y={p1.y} r={46} p={vent(t, 9.6, 11.4, 0.3)} color={AMARILLO} />
      <FlechaDoble x={centroPuerta.x} y={centroPuerta.y + 120} ang={0} largo={360} op={vent(t, 11.9, 13.75)} />
      <Chip texto="ALINEADA CON LA DE AL LADO" top={1260} op={vent(t, 12.6, 13.75)} color="#111" fondo={VERDE} />

      {/* tornillo 2: profundidad */}
      <Aro x={p2.x} y={p2.y} r={46} p={vent(t, 14.3, 16.2, 0.3)} color={AMARILLO} />
      <FlechaDoble x={canto.x} y={canto.y} ang={angProf} largo={200} op={vent(t, 16.75, 17.95)} />
      <Chip texto="CIERRA AL RAS" top={1260} op={vent(t, 17.2, 17.95)} color="#111" fondo={VERDE} />
      <div style={{position: 'absolute', bottom: 470, width: '100%', textAlign: 'center', fontFamily: NUDO_FUENTES.sans, fontSize: 24, color: 'rgba(255,255,255,.6)',
        opacity: vent(t, 16.4, 17.95)}}>Desnivel exagerado para que se vea</div>

      {/* tornillos de la base: altura */}
      <Aro x={p3.x} y={p3.y} r={44} p={vent(t, 18.45, 20.25, 0.3)} color={AMARILLO} />
      <FlechaDoble x={p3.x + 210} y={p3.y - 40} ang={90} largo={260} op={vent(t, 18.8, 20.25)} />

      {/* cuartos de vuelta + las dos bisagras por igual */}
      <Chip texto="¼ DE VUELTA A LA VEZ" top={1230} op={vent(t, 20.4, 21.4)} />
      <Aro x={bisSup.x} y={bisSup.y} r={56} p={vent(t, 21.5, 23.45, 0.3)} color={AMARILLO} />
      <Aro x={bisInf.x} y={bisInf.y} r={56} p={vent(t, 21.6, 23.45, 0.3)} color={AMARILLO} />
      <Chip texto="LAS DOS BISAGRAS IGUAL" top={1230} op={vent(t, 21.5, 23.45)} />

      {/* cierre: así sí + pregunta para comentar */}
      <Chip texto="✓ ASÍ SÍ" top={1180} op={vent(t, 23.5, 31.5)} color="#111" fondo={VERDE} />
      <div style={{position: 'absolute', top: 230, left: 50, right: 50, textAlign: 'center', opacity: tramo(t, 23.6, 24.0),
        transform: `scale(${0.9 + 0.1 * tramo(t, 23.6, 24.0)})`}}>
        <div style={{fontFamily: NUDO_FUENTES.titular, fontSize: 120, color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill', lineHeight: 1}}>
          ¿COCINA O <span style={{color: AMARILLO}}>CLÓSET?</span>
        </div>
        <div style={{marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 16, background: '#fff', color: '#111', borderRadius: 40, padding: '12px 30px',
          border: '4px solid #000', fontFamily: NUDO_FUENTES.sans, fontWeight: 800, fontSize: 40}}>
          <svg width={46} height={42} viewBox="0 0 46 42"><path d="M4 4 h38 v26 h-22 l-10 9 v-9 h-6z" fill="none" stroke="#111" strokeWidth={4} strokeLinejoin="round" /></svg>
          Escríbelo en comentarios
        </div>
      </div>
      <Subtitulos />
      {/* @ pequeño con borde negro, abajo al centro */}
      <div style={{position: 'absolute', bottom: 360, width: '100%', textAlign: 'center', opacity: tramo(t, 23.6, 24.0), fontFamily: NUDO_FUENTES.sans,
        fontWeight: 800, fontSize: 36, color: '#fff', WebkitTextStroke: '7px #000', paintOrder: 'stroke fill'}}>@somos_nudodesign</div>
    </AbsoluteFill>
  );
};
