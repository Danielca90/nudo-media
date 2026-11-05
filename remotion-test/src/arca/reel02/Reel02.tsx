// Reel 02 – "¿Tu contrato vence el 31 de diciembre?" (preaviso del contrato a término fijo)
// Motion graphics automático: voz clonada "Andrea Arca" (ElevenLabs) + escenas sincronizadas con la voz.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';
import {COLOR, FUENTES} from '../marca';
import palabrasJson from './palabras.json';
import {
  Oficina, TituloFijo, MarcaEsquina, Subtitulos, Sello, Hoja, Ciclo, Check, Cierre, CierreServicios,
  useT, usePop, tramo, ventana, useSacudida, Palabra,
} from '../kit';

const PALABRAS = palabrasJson as Palabra[];
export const DURACION_SEG = 41.1;
const FIN_VOZ = 38.7;
const CLAVES = ['31', 'diciembre?', 'renuevan', 'solos.', 'escrito,', '30', 'días', '1', 'renueva', 'prueba:', 'firma', 'correo.', 'último', 'solo.', 'revisamos', 'contratos,', 'redactamos', 'aviso,', 'control', 'fechas', 'defendemos', 'Escríbenos', 'blindamos'];

// Escenas (segundos, según la voz)
const S = {
  gancho: [0, 3.9],
  contrato: [3.9, 7.4],
  aviso: [7.4, 11.8],
  linea: [11.8, 17.3],
  renueva: [17.3, 21.0],
  prueba: [21.0, 24.35],
  ultimo: [24.35, 26.0],
  cta: [25.95, FIN_VOZ],
} as const;

const Escena: React.FC<{r: readonly [number, number]; children: React.ReactNode}> = ({r, children}) => {
  const t = useT();
  const o = ventana(t, r[0], r[1], 0.22);
  if (o <= 0) return null;
  const sale = tramo(t, r[1] - 0.22, r[1]);
  return (
    <AbsoluteFill style={{opacity: o, transform: `scale(${1 + sale * 0.06}) translateY(${sale * -30}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

// ---------- calendario de diciembre de 2026 (empieza martes) ----------
const Calendario: React.FC<{marcas: {dia: number; en: number; color: string}[]; pulso?: number; ancho?: number}> = ({marcas, pulso, ancho = 780}) => {
  const t = useT();
  const celda = ancho / 7;
  const dias = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <div style={{width: ancho, background: COLOR.papel, borderRadius: 18, overflow: 'hidden', boxShadow: '0 34px 70px rgba(10,30,30,.28)'}}>
      <div style={{background: COLOR.teal, color: COLOR.crema, padding: '26px 0 22px', textAlign: 'center', position: 'relative'}}>
        <div style={{fontFamily: FUENTES.serif, fontSize: 54, letterSpacing: 4}}>DICIEMBRE</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 26, color: COLOR.dorado, letterSpacing: 8}}>2026</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '18px 10px 22px'}}>
        {dias.map((d, i) => (
          <div key={'h' + i} style={{textAlign: 'center', fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 24, color: COLOR.teal3, height: 44}}>{d}</div>
        ))}
        {Array.from({length: 1 + 31}, (_, k) => k).map((k) => {
          if (k === 0) return <div key="vacio" />;
          const dia = k;
          const m = marcas.find((x) => x.dia === dia);
          const p = m ? tramo(t, m.en, m.en + 0.45) : 0;
          const late = m && pulso !== undefined && dia === 1 ? 1 + Math.max(0, Math.sin((t - pulso) * 9)) * 0.08 : 1;
          return (
            <div key={dia} style={{height: celda * 0.82, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <span style={{fontFamily: FUENTES.sans, fontWeight: m && p > 0.5 ? 800 : 600, fontSize: 34,
                color: m && p > 0.5 ? m.color : COLOR.tinta, transform: `scale(${(1 + p * 0.25) * late})`}}>{dia}</span>
              {m && (
                <svg width={celda} height={celda} viewBox="0 0 100 100" style={{position: 'absolute'}}>
                  <circle cx={50} cy={50} r={40} fill="none" stroke={m.color} strokeWidth={7} strokeLinecap="round"
                    strokeDasharray={252} strokeDashoffset={252 * (1 - p)} transform="rotate(-80 50 50)" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- escenas ----------
const Gancho: React.FC = () => {
  const p = usePop(0, 190, 15);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 140}}>
      <div style={{transform: `translateY(${(1 - p) * -500}px) rotate(${(1 - p) * -8}deg)`}}>
        <Calendario marcas={[{dia: 31, en: 2.2, color: COLOR.alerta}]} />
      </div>
    </AbsoluteFill>
  );
};

const Contrato: React.FC = () => {
  const t = useT();
  const p = usePop(3.9, 170, 15);
  const ojo = usePop(3.92, 300, 12);
  const ciclo = tramo(t, 6.05, 7.4);
  const dx = useSacudida(6.2, 16);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 120, transform: `translateX(${dx}px)`}}>
      <div style={{position: 'relative', transform: `translateY(${(1 - p) * 700}px)`}}>
        {t > 6.0 && (
          <div style={{position: 'absolute', left: -200, top: -60, opacity: tramo(t, 6.0, 6.25)}}>
            <Ciclo size={1000} vuelta={ciclo * 0.6} />
          </div>
        )}
        <Hoja titulo="CONTRATO A TÉRMINO FIJO" lineas={5}>
          <div style={{fontFamily: FUENTES.sans, fontSize: 32, color: COLOR.tinta, fontWeight: 600}}>
            Vence: <span style={{color: COLOR.alerta, fontWeight: 800}}>31 / 12 / 2026</span>
          </div>
        </Hoja>
        <div style={{position: 'absolute', right: -70, top: -70, transform: `scale(${ojo}) rotate(8deg)`,
          background: COLOR.dorado, color: COLOR.teal, fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 64,
          padding: '14px 30px', borderRadius: 999, boxShadow: '0 14px 30px rgba(0,0,0,.2)'}}>¡OJO!</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
          <Sello texto="SE RENUEVA SOLO" en={6.15} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Aviso: React.FC = () => {
  const t = useT();
  const p = usePop(7.4, 170, 15);
  const trazo = tramo(t, 7.7, 9.3);
  const chip = usePop(8.6, 260, 14);
  const n = usePop(9.75, 200, 13);
  const cuenta = Math.round(interpolate(t, [9.8, 10.6], [0, 30], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 120}}>
      <div style={{position: 'relative', transform: `translateX(${(1 - p) * 900}px) rotate(${(1 - p) * 10 - 3}deg)`}}>
        <Hoja titulo="AVISO DE NO RENOVACIÓN" lineas={6} trazo={trazo}>
          <svg width={260} height={70} viewBox="0 0 260 70" style={{position: 'absolute', right: 50, bottom: 46}}>
            <path d="M5 50 C 40 10, 60 70, 90 35 S 140 20, 160 45 S 220 30, 255 25" fill="none" stroke={COLOR.teal}
              strokeWidth={5} strokeLinecap="round" strokeDasharray={330} strokeDashoffset={330 * (1 - tramo(t, 9.0, 9.6))} />
          </svg>
        </Hoja>
        <div style={{position: 'absolute', left: -50, top: 170, transform: `scale(${chip}) rotate(-6deg)`, background: COLOR.teal,
          color: COLOR.crema, fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 44, padding: '12px 26px', borderRadius: 10,
          borderLeft: `8px solid ${COLOR.dorado}`}}>POR ESCRITO</div>
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 520, transform: `scale(${n})`, width: 330, height: 330, borderRadius: '50%',
        background: COLOR.dorado, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 24px 50px rgba(0,0,0,.25)', border: `10px solid ${COLOR.crema}`}}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 30, color: COLOR.teal, letterSpacing: 3}}>MÍNIMO</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 150, color: COLOR.teal, lineHeight: 0.95, fontVariantNumeric: 'tabular-nums'}}>{cuenta}</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 44, color: COLOR.teal, letterSpacing: 4}}>DÍAS</div>
      </div>
    </AbsoluteFill>
  );
};

const Linea: React.FC = () => {
  const t = useT();
  const fin = usePop(12.95, 220, 13);
  const barra = tramo(t, 13.7, 15.4);
  const ini = usePop(15.95, 240, 11);
  const cinta = usePop(16.3, 220, 14);
  const dx = useSacudida(16.0, 10);
  const Ficha: React.FC<{dia: string; color: string; s: number; etiqueta: string}> = ({dia, color, s, etiqueta}) => (
    <div style={{transform: `scale(${s})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
      <div style={{width: 210, height: 230, background: COLOR.papel, borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.2)'}}>
        <div style={{background: color, color: '#fff', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 34, textAlign: 'center', padding: '10px 0'}}>DIC</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 120, textAlign: 'center', color: COLOR.tinta, lineHeight: 1.35}}>{dia}</div>
      </div>
      <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 30, color: COLOR.teal, background: 'rgba(255,255,255,.85)', padding: '6px 16px', borderRadius: 8}}>{etiqueta}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 120, transform: `translateX(${dx}px)`}}>
      <div style={{position: 'relative', width: 940, height: 600}}>
        {/* barra de 30 días (crece de derecha a izquierda) */}
        <div style={{position: 'absolute', left: 150, right: 150, top: 120, height: 26, background: '#D6DEDB', borderRadius: 13}} />
        <div style={{position: 'absolute', right: 150, top: 120, height: 26, width: `${640 * barra}px`, background: COLOR.dorado, borderRadius: 13}} />
        {Array.from({length: 31}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 150 + (640 / 30) * i - 2, top: 108, width: 4, height: 50,
            background: COLOR.teal, opacity: barra > 1 - i / 30 ? 0.9 : 0.15, borderRadius: 2}} />
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center', opacity: barra,
          fontFamily: FUENTES.serif, fontSize: 56, color: COLOR.teal, fontWeight: 700}}>30 días antes</div>
        <div style={{position: 'absolute', left: 0, top: -20}}>
          <Ficha dia="1" color={COLOR.dorado} s={ini} etiqueta="Avisa aquí" />
        </div>
        <div style={{position: 'absolute', right: 0, top: -20}}>
          <Ficha dia="31" color={COLOR.alerta} s={fin} etiqueta="Vence" />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center',
          transform: `scale(${cinta})`}}>
          <div style={{background: COLOR.teal, color: COLOR.crema, fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 58,
            padding: '18px 40px', borderRadius: 12, borderBottom: `8px solid ${COLOR.dorado}`, boxShadow: '0 18px 40px rgba(0,0,0,.25)'}}>
            FECHA LÍMITE: <span style={{color: COLOR.dorado}}>1 DIC</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Renueva: React.FC = () => {
  const t = useT();
  const a = usePop(17.35, 180, 15);
  const b = usePop(18.85, 200, 14);
  const flecha = tramo(t, 18.6, 19.2);
  const Tarjeta: React.FC<{titulo: string; sub: string; color: string; s: number; x: number}> = ({titulo, sub, color, s, x}) => (
    <div style={{transform: `translateX(${x}px) scale(${s})`, width: 400, background: COLOR.papel, borderRadius: 16,
      borderTop: `14px solid ${color}`, padding: '30px 34px', boxShadow: '0 24px 50px rgba(0,0,0,.22)', boxSizing: 'border-box'}}>
      <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 40, color}}>{titulo}</div>
      <div style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 30, color: COLOR.tinta, marginTop: 8}}>{sub}</div>
      {[90, 75, 82].map((w, i) => <div key={i} style={{height: 12, width: `${w}%`, background: '#DCE3E1', borderRadius: 6, marginTop: 20}} />)}
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 60}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
        <Tarjeta titulo="Contrato actual" sub="1 año · vence 31 dic" color={COLOR.teal} s={a} x={-150} />
        <svg width={300} height={110} viewBox="0 0 300 110" style={{opacity: flecha}}>
          <path d="M40 10 C 40 90, 220 90, 250 60" fill="none" stroke={COLOR.alerta} strokeWidth={12} strokeLinecap="round"
            strokeDasharray={330} strokeDashoffset={330 * (1 - flecha)} />
          <path d="M232 40 L 270 52 L 246 86 Z" fill={COLOR.alerta} opacity={flecha > 0.9 ? 1 : 0} />
        </svg>
        <Tarjeta titulo="Se renueva" sub="otro año igual, sin avisarte" color={COLOR.alerta} s={b} x={150} />
      </div>
      <div style={{position: 'absolute', top: 1010, left: 50, display: 'flex', zIndex: 2}}>
        <Sello texto="MISMO TIEMPO" en={19.6} rot={-6} size={46} />
      </div>
    </AbsoluteFill>
  );
};

const Prueba: React.FC = () => {
  const t = useT();
  const h = usePop(21.05, 220, 15);
  const f = usePop(22.4, 200, 14);
  const c = usePop(23.75, 200, 14);
  const firma = tramo(t, 22.5, 23.3);
  const Fila: React.FC<{s: number; ok: number; titulo: string; icono: React.ReactNode}> = ({s, ok, titulo, icono}) => (
    <div style={{transform: `translateX(${(1 - s) * 600}px)`, opacity: Math.min(1, s * 1.5), display: 'flex', alignItems: 'center', gap: 34,
      width: 820, background: COLOR.papel, borderRadius: 20, padding: '30px 40px', boxSizing: 'border-box', boxShadow: '0 20px 44px rgba(0,0,0,.18)'}}>
      <div style={{width: 170, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icono}</div>
      <div style={{flex: 1, fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 46, color: COLOR.teal, lineHeight: 1.1}}>{titulo}</div>
      <Check p={ok} />
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 120, gap: 40}}>
      <div style={{transform: `scale(${h})`, fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 70, color: COLOR.teal,
        background: 'rgba(255,255,255,.8)', padding: '10px 34px', borderRadius: 12}}>Guarda la prueba</div>
      <Fila s={f} ok={tramo(t, 23.0, 23.5)} titulo="Firma de recibido" icono={
        <svg width={170} height={110} viewBox="0 0 170 110">
          <line x1={10} y1={90} x2={160} y2={90} stroke={COLOR.tealClaro} strokeWidth={4} />
          <path d="M14 70 C 30 20, 50 100, 70 55 S 100 30, 112 62 S 150 48, 160 40" fill="none" stroke={COLOR.teal} strokeWidth={6}
            strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - firma)} />
        </svg>} />
      <Fila s={c} ok={tramo(t, 24.0, 24.3)} titulo="o un correo" icono={
        <svg width={150} height={110} viewBox="0 0 150 110">
          <rect x={6} y={10} width={138} height={92} rx={10} fill={COLOR.dorado} />
          <path d="M8 16 L 75 64 L 142 16" fill="none" stroke={COLOR.papel} strokeWidth={8} strokeLinejoin="round" />
        </svg>} />
    </AbsoluteFill>
  );
};

const UltimoDia: React.FC = () => {
  const p = usePop(24.35, 200, 15);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: 140}}>
      <div style={{transform: `scale(${0.85 + 0.15 * p})`, position: 'relative'}}>
        <Calendario marcas={[{dia: 1, en: 24.4, color: COLOR.dorado}, {dia: 31, en: 24.4, color: COLOR.alerta}]} pulso={24.6} ancho={720} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
          <Sello texto="¡NO ESPERES!" en={25.4} size={72} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel02: React.FC = () => {
  const t = useT();
  const foco = tramo(t, 3.6, 4.2);
  const zoom = 1 + tramo(t, 0, 3.9) * 0.06 + foco * 0.06;
  return (
    <AbsoluteFill style={{background: COLOR.pared}}>
      <Audio src={staticFile('arca/voz-reel02-v2.mp3')} />
      <Oficina foco={foco} zoom={zoom} />
      <AbsoluteFill style={{background: COLOR.crema, opacity: foco * 0.3, height: 1240}} />
      <Escena r={S.gancho}><Gancho /></Escena>
      <Escena r={S.contrato}><Contrato /></Escena>
      <Escena r={S.aviso}><Aviso /></Escena>
      <Escena r={S.linea}><Linea /></Escena>
      <Escena r={S.renueva}><Renueva /></Escena>
      <Escena r={S.prueba}><Prueba /></Escena>
      <Escena r={S.ultimo}><UltimoDia /></Escena>
      <CierreServicios desde={S.cta[0]} hasta={FIN_VOZ} arcaEn={27.96} escribenosEn={35.94}
        documentos={['Contrato a término fijo', 'Aviso de no renovación', 'Constancia de recibido']}
        servicios={[
          {texto: 'Revisamos tus contratos', en: 28.86},
          {texto: 'Redactamos cada aviso', en: 30.44},
          {texto: 'Llevamos el control de las fechas', en: 32.14},
          {texto: 'Te defendemos si llega una demanda', en: 33.86},
        ]} />
      <MarcaEsquina hasta={FIN_VOZ} />
      <TituloFijo lineas={['¿Tu contrato vence', 'el 31 de diciembre?']} hasta={FIN_VOZ} />
      <Subtitulos palabras={PALABRAS} claves={CLAVES} y={1452} max={3} hasta={FIN_VOZ} />
      <Cierre desde={FIN_VOZ} />
    </AbsoluteFill>
  );
};
