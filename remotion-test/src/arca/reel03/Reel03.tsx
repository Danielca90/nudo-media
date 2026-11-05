// Reel 03 – "No los despidas sin permiso": 4 trabajadores con protección que exige autorización previa.
// Técnica mixta: plano 3D de HyperFrames (vidrio sobre "PERMISO") + 2D con escenario propio (pasillo). Ver GUION.md.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, interpolate, Easing, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {COLOR, FUENTES} from '../marca';
import palabrasJson from './palabras.json';
import {Pasillo, PUERTAS, PASILLO_ANCHO} from '../escenarios/Pasillo';
import {
  TituloFijo, MarcaEsquina, Subtitulos, Sello, Check, Cierre, CierreServicios, Avatar,
  useT, usePop, tramo, ventana, Palabra,
} from '../kit';

const PALABRAS = palabrasJson as Palabra[];
const FIN_VOZ = 44.75;
export const DURACION_SEG = 47.2;
const CLAVES = ['permiso.', 'vale.', 'embarazada.', 'maternidad.', 'inspector', 'salud', 'presunta.', 'Ministerio', 'fuero', 'sindical.',
  'juez', 'reintegro,', 'salarios', 'indemnización.', 'solo.', 'revisamos', 'tramitamos', 'redactamos', 'defendemos', 'Escríbenos', 'blindamos'];

// Cámara a lo largo del pasillo: se detiene en la puerta de cada protección.
const centro = (cx: number) => Math.min(Math.max(cx - 540, 0), PASILLO_ANCHO - 1080 - 40);
const CAMARA: [number, number][] = [
  [5.0, centro(PUERTAS.talento)], [5.6, centro(PUERTAS.lactancia)], [12.9, centro(PUERTAS.lactancia)],
  [13.6, centro(PUERTAS.sst)], [21.8, centro(PUERTAS.sst)], [22.5, centro(PUERTAS.sindicato)],
  [26.2, centro(PUERTAS.sindicato)], [27.2, centro(PUERTAS.talento)],
];

const Escena: React.FC<{r: [number, number]; children: React.ReactNode}> = ({r, children}) => {
  const t = useT();
  const o = ventana(t, r[0], r[1], 0.2);
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Tarjeta de persona protegida: número, avatar, quién es y qué autorización exige.
const Persona: React.FC<{n: number; en: number; semilla: string; mujer?: boolean; quien: string; nota?: [string, number]; dx?: number}> = ({n, en, semilla, mujer, quien, nota, dx = 0}) => {
  const t = useT();
  const p = usePop(en, 210, 14);
  const np = nota ? tramo(t, nota[1], nota[1] + 0.35) : 0;
  return (
    <div style={{transform: `translateX(${dx + (1 - p) * 500}px)`, opacity: Math.min(1, p * 1.4), width: 860, background: COLOR.papel, borderRadius: 24,
      padding: '26px 30px', boxSizing: 'border-box', boxShadow: '0 26px 54px rgba(0,0,0,.26)', display: 'flex', alignItems: 'center', gap: 26}}>
      <div style={{position: 'relative'}}>
        <Avatar semilla={semilla} mujer={mujer} size={150} />
        <div style={{position: 'absolute', left: -14, top: -14, width: 62, height: 62, borderRadius: 31, background: COLOR.teal, color: COLOR.dorado,
          fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `4px solid ${COLOR.papel}`}}>{n}</div>
      </div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 42, color: COLOR.tinta, lineHeight: 1.12}}>{quien}</div>
        {nota && (
          <div style={{marginTop: 12, opacity: np, transform: `translateY(${(1 - np) * 14}px)`, display: 'inline-block', background: COLOR.dorado, color: COLOR.teal,
            fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 26, padding: '8px 14px', borderRadius: 8}}>{nota[0]}</div>
        )}
      </div>
    </div>
  );
};

// Ficha de autorización que se sella.
const Autorizacion: React.FC<{en: number; quien: string; selloEn: number}> = ({en, quien, selloEn}) => {
  const t = useT();
  const p = usePop(en, 220, 15);
  return (
    <div style={{transform: `scale(${p})`, display: 'flex', alignItems: 'center', gap: 22, background: COLOR.teal, borderRadius: 18, padding: '20px 30px',
      boxShadow: '0 20px 40px rgba(0,0,0,.25)', border: `3px solid ${COLOR.dorado}`}}>
      <svg width={60} height={72} viewBox="0 0 60 72"><rect x={4} y={4} width={52} height={64} rx={6} fill={COLOR.crema} />
        {[18, 30, 42].map((y) => <rect key={y} x={14} y={y} width={32} height={5} rx={2} fill="#C9D3D1" />)}</svg>
      <div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 24, color: COLOR.dorado, letterSpacing: 2}}>AUTORIZACIÓN PREVIA</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 36, color: COLOR.crema}}>{quien}</div>
      </div>
      <Check p={tramo(t, selloEn, selloEn + 0.4)} size={70} />
    </div>
  );
};

const Consecuencias: React.FC = () => {
  const t = useT();
  const items: [string, number][] = [['Reintegro', 28.6], ['Salarios', 29.7], ['Indemnización', 30.6]];
  const h = usePop(26.5, 220, 15);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
      <div style={{transform: `scale(${h})`, background: COLOR.alerta, color: '#fff', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 40,
        padding: '14px 30px', borderRadius: 12}}>SI NO PIDES EL PERMISO…</div>
      {items.map(([s, en]) => {
        const p = tramo(t, en, en + 0.3);
        return (
          <div key={s} style={{opacity: p, transform: `scale(${0.7 + 0.3 * p})`, width: 640, background: COLOR.papel, borderRadius: 18, padding: '22px 30px',
            boxSizing: 'border-box', borderLeft: `14px solid ${COLOR.alerta}`, boxShadow: '0 18px 36px rgba(0,0,0,.2)', fontFamily: FUENTES.sans,
            fontWeight: 800, fontSize: 48, color: COLOR.tinta}}>{s}</div>
        );
      })}
    </div>
  );
};

export const Reel03: React.FC = () => {
  const t = useT();
  const x = interpolate(t, CAMARA.map((c) => c[0]), CAMARA.map((c) => c[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const foco = 0.35 + tramo(t, 26.3, 27.0) * 0.4 + tramo(t, 31.4, 32) * 0.25;
  const tresD = 1 - tramo(t, 4.9, 5.4);
  return (
    <AbsoluteFill style={{background: COLOR.pared}}>
      <Audio src={staticFile('arca/voz-reel03.mp3')} />
      <Pasillo x={x} foco={foco} zoom={1.02} />

      {/* 1-2. Embarazo y licencia de maternidad — puerta Sala Amiga de la Familia Lactante */}
      <Escena r={[5.3, 13.1]}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 590, gap: 24}}>
          <Persona n={1} en={5.9} semilla="Laura" mujer quien="Trabajadora embarazada" />
          <Persona n={2} en={8.0} semilla="Diana" mujer quien="En licencia de maternidad" />
          <Autorizacion en={10.4} quien="Inspector de trabajo" selloEn={12.3} />
        </AbsoluteFill>
      </Escena>
      {/* 3. Condición de salud — puerta Enfermería / SST */}
      <Escena r={[13.1, 22.0]}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 640, gap: 26}}>
          <Persona n={3} en={13.8} semilla="Jorge" quien="Condición de salud que limita su trabajo" nota={['Incluso discapacidad presunta · SL1015-2026', 16.5]} />
          <Autorizacion en={19.2} quien="Ministerio del Trabajo" selloEn={21.0} />
        </AbsoluteFill>
      </Escena>
      {/* 4. Fuero sindical — puerta Sindicato */}
      <Escena r={[22.0, 26.45]}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 640, gap: 26}}>
          <Persona n={4} en={22.6} semilla="Mauricio" quien="Fuero sindical" />
          <Autorizacion en={24.6} quien="Un juez levanta el fuero" selloEn={25.6} />
        </AbsoluteFill>
      </Escena>
      {/* Consecuencias — de vuelta a Talento Humano */}
      <Escena r={[26.45, 31.5]}>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 190}}><Consecuencias /></AbsoluteFill>
      </Escena>

      <CierreServicios desde={31.5} hasta={FIN_VOZ} arcaEn={33.2} escribenosEn={42.0}
        documentos={['Solicitud de autorización', 'Concepto médico laboral', 'Demanda de levantamiento de fuero']}
        servicios={[
          {texto: 'Revisamos si tiene alguna protección', en: 34.05},
          {texto: 'Tramitamos la autorización', en: 36.7},
          {texto: 'Redactamos cada documento', en: 38.25},
          {texto: 'Te defendemos si llega una demanda', en: 40.1},
        ]} />

      {/* 0-5 s: plano 3D de HyperFrames (lente de vidrio sobre "PERMISO") */}
      {tresD > 0 && (
        <AbsoluteFill style={{opacity: tresD}}>
          <OffthreadVideo src={staticFile('arca/3d/vidrio-permiso.mp4')} muted style={{width: '100%', height: '100%'}} />
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 640}}>
            <Sello texto="EL DESPIDO NO VALE" en={3.85} size={60} rot={-5} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      <MarcaEsquina hasta={FIN_VOZ} />
      <TituloFijo lineas={['No los despidas', 'sin permiso']} hasta={FIN_VOZ} />
      <Subtitulos palabras={PALABRAS} claves={CLAVES} y={1452} max={3} hasta={FIN_VOZ} />
      <Cierre desde={FIN_VOZ} />
    </AbsoluteFill>
  );
};
