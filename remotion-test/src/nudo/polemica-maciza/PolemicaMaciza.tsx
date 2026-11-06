// Reel polémico Nudo Design – "La madera maciza NO es la mejor para tu cocina". Ver GUION.md.
import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {Camara} from '../../madera-verde/Madera3D';
import {camaraEn, proyectar, Clave, Vec} from '../../madera-verde/camara';
import {FONDOS} from '../../madera-verde/fondo';
import {NUDO_FUENTES} from '../fuentes';
import palabrasJson from './palabras.json';
import {PuertaMaciza, Contrachapado, Hidrofugo, OllaVapor, Luces, Cocina, MACIZA, P_MACIZA, P_CONTRA, P_HIDRO, useMats, useTexturas, Texturas} from './Cocina3D';

type Palabra = {text: string; start: number; end: number};
const PALABRAS = palabrasJson as Palabra[];
const FPS = 30;
const FIN_VOZ = 28.35;
export const DURACION_SEG = 31.0;
const AMARILLO = '#f5c518';
const VERDE = '#3ddc84';
const ROJO = '#ff4d4d';

const useT = () => useCurrentFrame() / FPS;
const tramo = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
const vent = (t: number, a: number, b: number, d = 0.25) => Math.min(tramo(t, a, a + d), 1 - tramo(t, b - d, b));

// ---------- escena (posiciones en Cocina3D) ----------
// humedad: ciclo de hincharse y encogerse cuando la voz lo dice; luego vuelve a reposo
const humedad = (t: number) => {
  if (t < 11.0) return -0.35 * tramo(t, 0, 0.6); // ya un poco encogida en el gancho (junta abierta)
  if (t < 11.75) return -0.35 + 1.35 * tramo(t, 11.0, 11.6); // se hincha
  if (t < 13.2) return 1 - 2 * tramo(t, 11.75, 12.5); // se encoge
  if (t < 20.9) return -1;
  return -1 + 0.8 * tramo(t, 20.9, 21.6);
};
const tuerce = (t: number) => 0.35 * tramo(t, 0, 0.6) * (1 - tramo(t, 4.4, 5.0)) + tramo(t, 13.7, 14.5) * (1 - tramo(t, 20.9, 21.6));

const CLAVES: Clave[] = [
  {t: 0, pos: [-0.3, 1.5, 2.2], mira: [-0.33, 1.64, 0.2]},
  {t: 0.15, pos: [-0.31, 1.52, 1.98], mira: [-0.34, 1.66, 0.2]},
  {t: 4.4, pos: [-0.28, 1.86, 0.86], mira: [-0.34, 1.82, 0.3]},
  {t: 6.1, pos: [-0.3, 1.38, 1.9], mira: [-0.34, 1.4, 0.2]},
  {t: 9.9, pos: [-0.35, 1.8, 1.38], mira: [-0.35, 1.78, 0.3]},
  {t: 13.2, pos: [0.15, 2.02, 1.28], mira: [-0.35, 1.78, 0.3]},
  {t: 15.8, pos: [0.86, 1.36, 0.98], mira: [0.5, 1.2, 0.12]},
  {t: 17.1, pos: [1.32, 1.36, 0.98], mira: [0.98, 1.2, 0.12]},
  {t: 18.6, pos: [0.76, 1.32, 1.65], mira: [0.74, 1.2, 0.1]},
  {t: 20.9, pos: [-0.15, 1.9, 1.28], mira: [-0.35, 1.8, 0.3]},
  {t: 25.3, pos: [0.22, 1.5, 3.1], mira: [0.22, 1.95, 0]},
];

// ---------- 2D ----------
const CLAVE = new Set(['maciza', 'cocina.', 'maciza.', 'vapor,', 'agua', 'calor', 'hincha', 'encoge', 'tuercen', 'abren.', 'contrachapado', 'hidrófugo,',
  'sellados,', 'menos.', 'hermosa,', 'acuerdo', 'comentarios.']);
const Subtitulos: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  if (t > FIN_VOZ) return null;
  const bloques: number[][] = [];
  let a: number[] = [];
  PALABRAS.forEach((p, i) => { a.push(i); if (/[.,:?!]$/.test(p.text) || a.length >= 4) { bloques.push(a); a = []; } });
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
          <span key={i} style={{display: 'inline-block', margin: '0 8px', padding: clave ? '0 12px 4px' : 0, borderRadius: 8, color: clave ? '#111' : '#fff',
            background: clave ? AMARILLO : 'transparent', opacity: vis ? Math.min(1, s * 1.5) : 0.35, transform: `scale(${vis ? 0.88 + s * 0.12 : 0.9})`,
            ...(clave ? {} : {WebkitTextStroke: '9px #000', paintOrder: 'stroke fill'})}}>{p.text}</span>
        );
      })}
    </div>
  );
};

const Titular: React.FC<{lineas: React.ReactNode[]; tam: number[]; op: number; top?: number}> = ({lineas, tam, op, top = 200}) =>
  op <= 0 ? null : (
    <div style={{position: 'absolute', top, left: 30, right: 30, opacity: op, textAlign: 'center'}}>
      {lineas.map((l, i) => (
        <div key={i} style={{fontFamily: NUDO_FUENTES.titular, fontSize: tam[i], lineHeight: 1.0, color: '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke fill'}}>{l}</div>
      ))}
    </div>
  );

const Chip: React.FC<{texto: string; x?: number; y: number; op: number; fondo?: string; color?: string}> = ({texto, x, y, op, fondo = AMARILLO, color = '#111'}) =>
  op <= 0 ? null : (
    <div style={{position: 'absolute', top: y, left: x !== undefined ? x : 0, right: x !== undefined ? undefined : 0, display: 'flex',
      justifyContent: x !== undefined ? 'flex-start' : 'center', opacity: op, transform: `scale(${0.85 + 0.15 * op})`, transformOrigin: 'center'}}>
      <div style={{fontFamily: NUDO_FUENTES.titular, fontSize: 60, color, background: fondo, padding: '6px 24px', borderRadius: 12, border: '4px solid #000', whiteSpace: 'nowrap'}}>{texto}</div>
    </div>
  );

const Aro: React.FC<{x: number; y: number; r: number; p: number; color: string}> = ({x, y, r, p, color}) =>
  p <= 0 ? null : (
    <svg style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, overflow: 'visible'}}>
      {[13, 7].map((w, k) => (
        <circle key={k} cx={x} cy={y} r={r} fill="none" stroke={k ? color : '#000'} strokeWidth={w} strokeDasharray={2 * Math.PI * r}
          strokeDashoffset={2 * Math.PI * r * (1 - p)} transform={`rotate(-90 ${x} ${y})`} />
      ))}
    </svg>
  );

/** Medidor de humedad (sube y baja con la animación). */
const Humedad: React.FC<{h: number; op: number}> = ({h, op}) =>
  op <= 0 ? null : (
    <div style={{position: 'absolute', top: 1180, left: 140, right: 140, opacity: op, background: 'rgba(12,13,16,.88)', border: '2px solid rgba(255,255,255,.15)',
      borderRadius: 18, padding: '18px 26px', fontFamily: NUDO_FUENTES.sans, color: '#fff'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 30, letterSpacing: 2}}>
        <span>HUMEDAD</span><span style={{color: h > 0 ? '#6ec1ff' : AMARILLO}}>{h > 0 ? 'SE HINCHA' : 'SE ENCOGE'}</span>
      </div>
      <div style={{height: 22, background: 'rgba(255,255,255,.1)', borderRadius: 11, marginTop: 12, overflow: 'hidden'}}>
        <div style={{width: `${50 + h * 45}%`, height: '100%', background: '#6ec1ff', borderRadius: 11}} />
      </div>
      <div style={{fontSize: 20, color: 'rgba(255,255,255,.5)', marginTop: 8}}>Movimiento exagerado para que se vea</div>
    </div>
  );

export const PolemicaMaciza: React.FC = () => {
  const tx = useTexturas();
  if (!tx) return <AbsoluteFill style={{background: FONDOS.grafito.fondo}} />;
  return <Contenido tx={tx} />;
};

const Contenido: React.FC<{tx: Texturas}> = ({tx}) => {
  const t = useT();
  const m = useMats(tx);
  const cam = camaraEn(t, CLAVES, 0.85);
  const h = humedad(t);
  const tu = tuerce(t);
  const vapor = Math.max(0.55 * (1 - tramo(t, 4.4, 4.8)), tramo(t, 6.1, 7.2) * (1 - tramo(t, 15.7, 16.3)), 0.6 * tramo(t, 20.9, 21.5));
  const gotas = tramo(t, 7.9, 9.0) * (1 - tramo(t, 15.7, 16.2));
  const calor = tramo(t, 8.4, 8.9) * (1 - tramo(t, 15.7, 16.2)) + 0.5 * tramo(t, 20.9, 21.5);

  const w = MACIZA.ancho / MACIZA.n;
  const juntas = [1, 2, 3].map((k) => proyectar([P_MACIZA[0] - MACIZA.ancho / 2 + k * w, P_MACIZA[1] - 0.12, P_MACIZA[2] + 0.012] as Vec, cam));
  const junta = juntas[1];
  const pCanto1 = proyectar([P_CONTRA[0] + 0.183, P_CONTRA[1] + 0.12, P_CONTRA[2] + 0.082] as Vec, cam);
  const pCanto2 = proyectar([P_HIDRO[0] + 0.183, P_HIDRO[1] + 0.12, P_HIDRO[2] + 0.082] as Vec, cam);
  const pMaciza = proyectar([P_MACIZA[0], P_MACIZA[1], P_MACIZA[2]] as Vec, cam);
  const pContra = proyectar([P_CONTRA[0], P_CONTRA[1], P_CONTRA[2]] as Vec, cam);
  const pHidro = proyectar([P_HIDRO[0], P_HIDRO[1] - 0.1, P_HIDRO[2]] as Vec, cam);

  return (
    <AbsoluteFill style={{background: FONDOS.grafito.fondo}}>
      <Audio src={staticFile('nudo/voz-polemica-maciza.mp3')} />
      <ThreeCanvas width={1080} height={1920} shadows>
        <Camara pos={cam.pos} mira={cam.mira} />
        <Luces tx={tx} calida={tramo(t, 20.9, 21.6) * (1 - tramo(t, 25.2, 25.8))} />
        <Cocina m={m} />
        <PuertaMaciza m={m} humedad={h} tuerce={tu} gotas={gotas} />
        <OllaVapor m={m} t={t} vapor={vapor} calor={calor} />
        <Contrachapado m={m} />
        <Hidrofugo m={m} sellado={tramo(t, 18.6, 19.3)} />
      </ThreeCanvas>

      {/* gancho: afirmación que divide */}
      <Titular op={1 - tramo(t, 4.3, 4.7)} tam={[96, 132, 96]}
        lineas={['LA MADERA MACIZA', <><span style={{color: ROJO}}>NO</span> ES LA MEJOR</>, 'PARA TU COCINA']} />
      <Aro x={junta.x} y={junta.y} r={64} p={tramo(t, 2.0, 2.5) * (1 - tramo(t, 4.3, 4.6))} color={ROJO} />
      <Chip texto="SÍ, LA MACIZA" y={1200} op={vent(t, 4.5, 6.1)} fondo={ROJO} color="#fff" />

      {/* vapor, agua y calor */}
      <Chip texto="VAPOR" x={90} y={1150} op={vent(t, 7.2, 9.95)} fondo="#fff" />
      <Chip texto="AGUA" x={410} y={1150} op={vent(t, 7.95, 9.95)} fondo="#6ec1ff" />
      <Chip texto="CALOR" x={700} y={1150} op={vent(t, 8.45, 9.95)} fondo="#ff9a3c" />
      <Humedad h={h} op={vent(t, 10.9, 13.2)} />

      {/* se tuerce y se abren las juntas */}
      {juntas.map((j, k) => <Aro key={k} x={j.x} y={j.y} r={48} p={vent(t, 15.1 + k * 0.12, 15.85, 0.3)} color={ROJO} />)}
      <Chip texto="SE TUERCE" y={1200} op={vent(t, 13.8, 15.2)} fondo={ROJO} color="#fff" />
      <Chip texto="JUNTAS ABIERTAS" y={1200} op={vent(t, 15.2, 15.85)} fondo={ROJO} color="#fff" />

      {/* contrachapado e hidrófugo */}
      <Aro x={pCanto1.x} y={pCanto1.y} r={70} p={vent(t, 16.0, 17.1, 0.3)} color={VERDE} />
      <Chip texto="CONTRACHAPADO" y={1200} op={vent(t, 16.0, 17.1)} fondo={VERDE} />
      <Aro x={pCanto2.x} y={pCanto2.y} r={70} p={vent(t, 17.6, 18.6, 0.3)} color={VERDE} />
      <Chip texto="AGLOMERADO HIDRÓFUGO" y={1200} op={vent(t, 17.6, 18.6)} fondo={VERDE} />
      <Chip texto="CANTOS SELLADOS" y={1200} op={vent(t, 18.65, 19.5)} fondo={VERDE} />
      <Chip texto="✓ SE MUEVEN MUCHO MENOS" y={1200} op={vent(t, 19.5, 20.95)} fondo={VERDE} />
      {/* "hermosa, pero…" */}
      <Chip texto="HERMOSA ✓" y={1200} op={vent(t, 21.7, 22.55)} fondo="#fff" />
      <Chip texto="¿PARA LA COCINA? NO SIEMPRE" y={1200} op={vent(t, 22.55, 25.4)} fondo={ROJO} color="#fff" />

      {/* cierre: pregunta para comentar */}
      <Titular op={tramo(t, 25.4, 25.8)} top={220} tam={[110]} lineas={[<>¿ESTÁS DE <span style={{color: AMARILLO}}>ACUERDO</span>?</>]} />
      {t > 25.4 && (
        <div style={{position: 'absolute', top: 380, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
          {[['SÍ', VERDE, 25.7], ['NO', ROJO, 26.3]].map(([s, c, en]) => {
            const p = spring({frame: useCurrentFrameSafe(t) - Math.round((en as number) * FPS), fps: FPS, config: {stiffness: 240, damping: 11}});
            return (
              <div key={s as string} style={{transform: `scale(${p})`, width: 260, height: 170, borderRadius: 28, background: c as string, border: '6px solid #000',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NUDO_FUENTES.titular, fontSize: 120, color: '#111'}}>{s as string}</div>
            );
          })}
        </div>
      )}
      <div style={{position: 'absolute', top: 590, width: '100%', textAlign: 'center', opacity: tramo(t, 26.9, 27.3)}}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 14, background: '#fff', color: '#111', borderRadius: 40, padding: '10px 28px', border: '4px solid #000',
          fontFamily: NUDO_FUENTES.sans, fontWeight: 800, fontSize: 38}}>
          <svg width={44} height={40} viewBox="0 0 46 42"><path d="M4 4 h38 v26 h-22 l-10 9 v-9 h-6z" fill="none" stroke="#111" strokeWidth={4} strokeLinejoin="round" /></svg>
          Te leo en los comentarios
        </span>
      </div>
      {/* etiquetas sobre los tableros en el plano final */}
      <Chip texto="MACIZA" x={Math.max(20, pMaciza.x - 110)} y={pMaciza.y - 40} op={tramo(t, 25.6, 26.0)} fondo={ROJO} color="#fff" />
      <Chip texto="CONTRACHAPADO" x={Math.max(20, Math.min(600, pContra.x - 190))} y={pContra.y - 70} op={tramo(t, 25.8, 26.2)} fondo={VERDE} />
      <Chip texto="HIDRÓFUGO" x={Math.max(20, Math.min(720, pHidro.x - 140))} y={pHidro.y + 40} op={tramo(t, 26.0, 26.4)} fondo={VERDE} />
      <Subtitulos />
      <div style={{position: 'absolute', bottom: 360, width: '100%', textAlign: 'center', opacity: tramo(t, 25.6, 26.0), fontFamily: NUDO_FUENTES.sans, fontWeight: 800,
        fontSize: 36, color: '#fff', WebkitTextStroke: '7px #000', paintOrder: 'stroke fill'}}>@somos_nudodesign</div>
    </AbsoluteFill>
  );
};


const useCurrentFrameSafe = (t: number) => Math.round(t * FPS);
