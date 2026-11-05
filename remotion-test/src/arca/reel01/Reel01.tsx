// Reel 01 – "Despedir sin demanda: revisa 3 cosas". Técnica: 2D motion graphics (ver GUION.md).
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {COLOR, FUENTES} from '../marca';
import palabrasJson from './palabras.json';
import {Bodega} from '../escenarios/Bodega';
import {
  TituloFijo, MarcaEsquina, Subtitulos, Sello, Hoja, Check, Cierre, Camara, Paso, CierreServicios,
  useT, usePop, tramo, ventana, useSacudida, Palabra,
} from '../kit';

const PALABRAS = palabrasJson as Palabra[];
const FIN_VOZ = 44.05;
export const DURACION_SEG = 46.5;
const CLAVES = ['regalando', 'demanda', 'tres', 'estabilidad', 'reforzada?', 'autorización', 'descargos', 'hechos', 'concretos',
  'carta.', 'alegar', 'liquidación', 'completa', 'día', 'solo.', 'revisamos', 'Redactamos', 'Hacemos', 'seguimiento', 'defendemos', 'Escríbenos', 'blindamos'];

const Escena: React.FC<{r: [number, number]; children: React.ReactNode}> = ({r, children}) => {
  const t = useT();
  const o = ventana(t, r[0], r[1], 0.2);
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Centro visual entre el título (≈330 px) y la marca (≈1360 px).
const Centro: React.FC<{children: React.ReactNode; top?: number}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 190}}>{children}</AbsoluteFill>
);

// ---------- piezas ----------
const Telefono: React.FC = () => {
  const t = useT();
  const p = usePop(0, 200, 16);
  const msg = usePop(0.35, 260, 14);
  const visto = tramo(t, 0.9, 1.1);
  return (
    <div style={{transform: `translateY(${(1 - p) * 500}px) rotate(-4deg)`, width: 430, height: 760, borderRadius: 60,
      background: '#16302F', padding: 18, boxShadow: '0 40px 80px rgba(0,0,0,.35)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 48, background: '#ECE8DF', overflow: 'hidden', position: 'relative'}}>
        <div style={{background: COLOR.teal2, height: 130, display: 'flex', alignItems: 'flex-end', padding: '0 30px 22px', gap: 18}}>
          <div style={{width: 62, height: 62, borderRadius: 31, background: COLOR.tealClaro}} />
          <div>
            <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 30, color: '#fff'}}>Carlos · Bodega</div>
            <div style={{fontFamily: FUENTES.sans, fontSize: 22, color: '#CFE0DC'}}>en línea</div>
          </div>
        </div>
        <div style={{position: 'absolute', right: 26, top: 300, maxWidth: 340, transform: `scale(${msg})`, transformOrigin: '100% 100%',
          background: '#DCEFE6', borderRadius: '28px 28px 6px 28px', padding: '22px 26px', boxShadow: '0 4px 10px rgba(0,0,0,.08)'}}>
          <div style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 34, color: COLOR.tinta, lineHeight: 1.25}}>
            Desde mañana no vuelvas. Estás despedido.
          </div>
          <div style={{textAlign: 'right', fontFamily: FUENTES.sans, fontSize: 20, color: visto > 0.5 ? '#2F7AB8' : '#8A9A98', marginTop: 6}}>6:42 p. m. ✓✓</div>
        </div>
      </div>
    </div>
  );
};

const Regalo: React.FC = () => {
  const t = useT();
  const p = usePop(1.45, 230, 12);
  const tag = usePop(2.2, 260, 13);
  const dx = useSacudida(2.25, 12);
  const tapa = tramo(t, 2.7, 3.1);
  return (
    <div style={{position: 'relative', transform: `translateX(${dx}px) scale(${p})`, width: 520, height: 520}}>
      {/* caja */}
      <div style={{position: 'absolute', left: 30, top: 180, width: 460, height: 330, background: COLOR.teal, borderRadius: 14, boxShadow: '0 40px 70px rgba(0,0,0,.3)'}} />
      <div style={{position: 'absolute', left: 230, top: 180, width: 60, height: 330, background: COLOR.dorado}} />
      {/* tapa */}
      <div style={{position: 'absolute', left: 10, top: 120, width: 500, height: 90, background: COLOR.teal2, borderRadius: 12,
        transform: `translateY(${-tapa * 90}px) rotate(${-tapa * 12}deg)`, transformOrigin: '0% 100%'}}>
        <div style={{position: 'absolute', left: 220, top: 0, width: 60, height: 90, background: COLOR.dorado}} />
        <svg width={240} height={130} viewBox="0 0 240 130" style={{position: 'absolute', left: 130, top: -110}}>
          <ellipse cx={70} cy={80} rx={66} ry={38} fill="none" stroke={COLOR.dorado} strokeWidth={22} transform="rotate(-20 70 80)" />
          <ellipse cx={170} cy={80} rx={66} ry={38} fill="none" stroke={COLOR.dorado} strokeWidth={22} transform="rotate(20 170 80)" />
        </svg>
      </div>
      {/* etiqueta */}
      <div style={{position: 'absolute', left: 300, top: 320, transform: `rotate(${12 - tag * 4}deg) scale(${tag})`, transformOrigin: '0 0',
        background: COLOR.papel, border: `5px solid ${COLOR.alerta}`, borderRadius: 12, padding: '14px 26px', boxShadow: '0 16px 30px rgba(0,0,0,.25)'}}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 24, color: COLOR.tinta}}>Para: tu trabajador</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 56, color: COLOR.alerta, letterSpacing: 2}}>DEMANDA</div>
      </div>
    </div>
  );
};

const FILAS = ['Estabilidad reforzada', 'Descargos y carta', 'Liquidación completa'];
const Lista: React.FC<{entradas: number[]; checks: number[]; titulo: string}> = ({entradas, checks, titulo}) => {
  const t = useT();
  return (
    <div style={{width: 820, background: COLOR.papel, borderRadius: 20, padding: '40px 48px', boxSizing: 'border-box',
      boxShadow: '0 34px 70px rgba(0,0,0,.25)', borderTop: `16px solid ${COLOR.teal}`}}>
      <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 50, color: COLOR.teal}}>{titulo}</div>
      <div style={{height: 4, width: 110, background: COLOR.dorado, margin: '18px 0 26px'}} />
      {FILAS.map((f, i) => {
        const e = tramo(t, entradas[i], entradas[i] + 0.3);
        return (
          <div key={f} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '20px 0', borderBottom: i < 2 ? '2px solid #E4E9E7' : 'none',
            opacity: e, transform: `translateX(${(1 - e) * 80}px)`}}>
            <div style={{width: 74, height: 74, borderRadius: 37, background: COLOR.teal, color: COLOR.dorado, fontFamily: FUENTES.serif,
              fontWeight: 700, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={{flex: 1, fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 42, color: COLOR.tinta}}>{f}</div>
            <div style={{width: 90, height: 90, borderRadius: 14, border: `4px solid ${COLOR.tealClaro}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Check p={tramo(t, checks[i], checks[i] + 0.35)} size={76} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Icono: React.FC<{tipo: 'corazon' | 'coche' | 'cruz' | 'grupo'}> = ({tipo}) => (
  <svg width={110} height={110} viewBox="0 0 100 100">
    {tipo === 'corazon' && <path d="M50 86 C 20 64, 8 46, 18 28 C 28 12, 46 16, 50 30 C 54 16, 72 12, 82 28 C 92 46, 80 64, 50 86 Z" fill={COLOR.dorado} />}
    {tipo === 'coche' && (<g fill={COLOR.dorado}><path d="M14 40 h56 a 22 22 0 0 1 -22 26 h-12 a 22 22 0 0 1 -22 -26z" /><path d="M48 40 V 16 a 26 26 0 0 1 26 24 z" opacity={0.75} />
      <circle cx={30} cy={80} r={9} /><circle cx={62} cy={80} r={9} /><path d="M70 40 L 86 22" stroke={COLOR.dorado} strokeWidth={6} strokeLinecap="round" /></g>)}
    {tipo === 'cruz' && <path d="M38 12 h24 v26 h26 v24 h-26 v26 h-24 v-26 h-26 v-24 h26z" fill={COLOR.dorado} />}
    {tipo === 'grupo' && (<g fill={COLOR.dorado}><circle cx={50} cy={30} r={13} /><path d="M28 78 a 22 22 0 0 1 44 0z" />
      <circle cx={20} cy={40} r={10} opacity={0.75} /><path d="M2 82 a 18 18 0 0 1 34 -6 v6z" opacity={0.75} />
      <circle cx={80} cy={40} r={10} opacity={0.75} /><path d="M64 76 a 18 18 0 0 1 34 6 h-34z" opacity={0.75} /></g>)}
  </svg>
);

const Casos: React.FC = () => {
  const items: {txt: string; en: number; ic: 'corazon' | 'coche' | 'cruz' | 'grupo'}[] = [
    {txt: 'Embarazo', en: 9.5, ic: 'corazon'},
    {txt: 'Licencia de maternidad', en: 10.45, ic: 'coche'},
    {txt: 'Condición de salud', en: 12.0, ic: 'cruz'},
    {txt: 'Fuero sindical', en: 13.2, ic: 'grupo'},
  ];
  const t = useT();
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, width: 860}}>
      {items.map((it, i) => {
        const p = tramo(t, it.en, it.en + 0.35);
        const pop = 0.6 + 0.4 * p + Math.sin(Math.min(1, p) * Math.PI) * 0.06;
        return (
          <div key={it.txt} style={{opacity: p, transform: `scale(${pop}) translateY(${(1 - p) * 40}px)`, background: COLOR.teal,
            borderRadius: 22, padding: '30px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            boxShadow: '0 24px 50px rgba(0,0,0,.25)', border: `3px solid ${COLOR.dorado}`, height: 260, boxSizing: 'border-box', justifyContent: 'center'}}>
            <Icono tipo={it.ic} />
            <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 38, color: COLOR.crema, textAlign: 'center', lineHeight: 1.15}}>{it.txt}</div>
          </div>
        );
      })}
    </div>
  );
};

const Autorizacion: React.FC = () => {
  const p = usePop(14.3, 200, 15);
  return (
    <div style={{transform: `translateY(${(1 - p) * 600}px) rotate(${(1 - p) * 8 + 2}deg)`, position: 'relative'}}>
      <Hoja titulo="AUTORIZACIÓN PREVIA" lineas={3} alto={560}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 30, color: COLOR.tinta, lineHeight: 1.4}}>
          Inspector de trabajo<br />o juez, según el caso
        </div>
      </Hoja>
      <div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', justifyContent: 'center'}}>
        <Sello texto="ANTES DE DESPEDIR" en={15.75} color={COLOR.ok} rot={-8} size={50} />
      </div>
    </div>
  );
};

const Descargos: React.FC = () => {
  const t = useT();
  const p = usePop(18.8, 220, 15);
  const b1 = usePop(19.3, 260, 14);
  const b2 = usePop(19.75, 260, 14);
  const orden = tramo(t, 20.4, 20.8);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, transform: `scale(${p})`}}>
      <div style={{width: 820, background: COLOR.papel, borderRadius: 22, padding: '36px 40px', boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,.25)'}}>
        <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 42, color: COLOR.teal, marginBottom: 26}}>Diligencia de descargos</div>
        <div style={{display: 'flex', justifyContent: 'flex-start', transform: `scale(${b1})`, transformOrigin: '0 50%'}}>
          <div style={{background: '#E4ECEA', borderRadius: '26px 26px 26px 6px', padding: '18px 26px', fontFamily: FUENTES.sans, fontSize: 32, fontWeight: 600, color: COLOR.tinta}}>
            ¿Qué pasó esos días?
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20, transform: `scale(${b2})`, transformOrigin: '100% 50%'}}>
          <div style={{background: COLOR.teal, borderRadius: '26px 26px 6px 26px', padding: '18px 26px', fontFamily: FUENTES.sans, fontSize: 32, fontWeight: 600, color: COLOR.crema}}>
            Le explico mi versión…
          </div>
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: orden, transform: `translateY(${(1 - orden) * 30}px)`}}>
        {['Primero: descargos', 'Después: carta'].map((s, i) => (
          <React.Fragment key={s}>
            {i === 1 && <svg width={70} height={40} viewBox="0 0 70 40"><path d="M4 20 H 56 M 42 6 L 60 20 L 42 34" fill="none" stroke={COLOR.dorado} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></svg>}
            <div style={{background: i === 0 ? COLOR.dorado : COLOR.teal, color: i === 0 ? COLOR.teal : COLOR.crema, fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 34, padding: '14px 24px', borderRadius: 12}}>{s}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Carta: React.FC = () => {
  const t = useT();
  const p = usePop(20.5, 200, 15);
  const marca = tramo(t, 20.95, 21.9);
  const fuera = usePop(22.8, 200, 14);
  const rebote = tramo(t, 23.6, 24.0);
  const x = tramo(t, 23.95, 24.2);
  const hecho = (txt: string, w: number) => (
    <div style={{position: 'relative', display: 'inline-block', marginBottom: 14}}>
      <div style={{position: 'absolute', left: -6, top: 4, bottom: 0, width: `${w * marca}%`, background: 'rgba(198,169,107,.55)', borderRadius: 6}} />
      <span style={{position: 'relative', fontFamily: FUENTES.sans, fontSize: 30, fontWeight: 600, color: COLOR.tinta}}>{txt}</span>
    </div>
  );
  return (
    <div style={{position: 'relative', transform: `translateY(${(1 - p) * 700}px)`}}>
      <Hoja titulo="CARTA DE TERMINACIÓN" lineas={2} alto={800} ancho={640}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 28, color: COLOR.teal, margin: '4px 0 14px', letterSpacing: 2}}>HECHOS CONCRETOS</div>
        {hecho('3, 10 y 17 de octubre: llegó', 100)}<br />
        {hecho('más de una hora tarde sin', 100)}<br />
        {hecho('justificación (ver registros).', 100)}<br />
        <div style={{fontFamily: FUENTES.sans, fontSize: 26, color: '#6B7B79', marginTop: 10}}>Causa: art. 62 CST · Descargos: 24/10</div>
      </Hoja>
      {/* causa nueva que intenta entrar y rebota */}
      <div style={{position: 'absolute', right: -170 + rebote * 130, top: 560 - rebote * 40, transform: `scale(${fuera}) rotate(${8 + rebote * 18}deg)`,
        background: COLOR.papel, border: `5px dashed ${COLOR.alerta}`, borderRadius: 14, padding: '16px 24px', boxShadow: '0 16px 30px rgba(0,0,0,.2)',
        opacity: 1 - x * 0.35}}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 34, color: COLOR.alerta}}>+ otra causa</div>
        <div style={{fontFamily: FUENTES.sans, fontSize: 24, color: COLOR.tinta}}>que no está en la carta</div>
        <svg width={120} height={120} viewBox="0 0 100 100" style={{position: 'absolute', right: -40, top: -50, opacity: x}}>
          <circle cx={50} cy={50} r={44} fill={COLOR.alerta} />
          <path d="M32 32 L 68 68 M 68 32 L 32 68" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center'}}>
        <Sello texto="NO VALE DESPUÉS" en={24.7} size={54} rot={-6} />
      </div>
    </div>
  );
};

const Liquidacion: React.FC = () => {
  const t = useT();
  const p = usePop(26.6, 200, 15);
  const filas = ['Salario pendiente', 'Cesantías e intereses', 'Prima proporcional', 'Vacaciones'];
  const dia = usePop(28.4, 240, 12);
  return (
    <div style={{position: 'relative', transform: `translateY(${(1 - p) * 700}px)`}}>
      <div style={{width: 700, background: COLOR.papel, borderRadius: 18, padding: '44px 46px 36px', boxSizing: 'border-box',
        boxShadow: '0 34px 70px rgba(0,0,0,.25)', borderTop: `16px solid ${COLOR.teal}`,
        clipPath: 'polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)'}}>
        <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 46, color: COLOR.teal}}>LIQUIDACIÓN FINAL</div>
        <div style={{height: 4, width: 100, background: COLOR.dorado, margin: '16px 0 22px'}} />
        {filas.map((f, i) => (
          <div key={f} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '2px dashed #DCE3E1'}}>
            <span style={{fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 34, color: COLOR.tinta}}>{f}</span>
            <Check p={tramo(t, 27.0 + i * 0.3, 27.35 + i * 0.3)} size={58} />
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 38, color: COLOR.teal}}>
          <span>COMPLETA</span><span style={{color: COLOR.ok}}>✓ PAGADA</span>
        </div>
      </div>
      <div style={{position: 'absolute', right: -60, top: -70, transform: `scale(${dia}) rotate(8deg)`, background: COLOR.dorado, color: COLOR.teal,
        borderRadius: 18, padding: '16px 26px', textAlign: 'center', boxShadow: '0 18px 36px rgba(0,0,0,.25)'}}>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2}}>EL MISMO</div>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 52}}>DÍA</div>
      </div>
    </div>
  );
};

export const Reel01: React.FC = () => {
  const t = useT();
  const foco = tramo(t, 3.5, 4.0);
  const zoom = 1 + tramo(t, 0, 3.8) * 0.05 + foco * 0.06;
  return (
    <AbsoluteFill style={{background: COLOR.pared}}>
      <Audio src={staticFile('arca/voz-reel01-v2.mp3')} />
      <Bodega foco={foco} zoom={zoom} />
      <AbsoluteFill style={{background: COLOR.crema, opacity: foco * 0.22, height: 1240}} />

      {/* 1. Gancho: mensaje de despido → "regalo" de demanda (plano general → acercamiento) */}
      <Escena r={[-1, 1.55]}>
        <Camara claves={[{t: 0, s: 1}, {t: 1.5, s: 1.12, y: 40}]}><Centro top={160}><Telefono /></Centro></Camara>
      </Escena>
      <Escena r={[1.4, 3.8]}>
        <Camara claves={[{t: 1.4, s: 0.95}, {t: 3.8, s: 1.08}]}><Centro top={160}><Regalo /></Centro></Camara>
      </Escena>

      {/* 2. Lista de 3 cosas (plano general) */}
      <Escena r={[3.8, 7.15]}>
        <Camara claves={[{t: 3.8, s: 0.92}, {t: 7.1, s: 1.0}]}><Centro><Lista titulo="Antes de despedir" entradas={[5.85, 6.05, 6.25]} checks={[99, 99, 99]} /></Centro></Camara>
      </Escena>

      {/* 3. Paso 1: estabilidad reforzada */}
      <Paso n={1} en={7.15} hasta={16.5} etiqueta="Estabilidad reforzada" />
      <Escena r={[8.2, 14.3]}>
        <Camara claves={[{t: 8.2, s: 0.94, y: 30}, {t: 14.2, s: 1.04, y: 0}]}><Centro top={200}><Casos /></Centro></Camara>
      </Escena>
      <Escena r={[14.25, 16.55]}>
        <Camara claves={[{t: 14.25, s: 0.9}, {t: 16.5, s: 1.08, y: 30}]}><Centro top={200}><Autorizacion /></Centro></Camara>
      </Escena>

      {/* 4. Paso 2: descargos y carta */}
      <Paso n={2} en={16.55} hasta={25.85} etiqueta="Justa causa" />
      <Escena r={[18.6, 20.6]}>
        <Camara claves={[{t: 18.6, s: 0.96}, {t: 20.6, s: 1.04}]}><Centro top={200}><Descargos /></Centro></Camara>
      </Escena>
      <Escena r={[20.45, 25.85]}>
        {/* primerísimo plano a los hechos y luego se abre para ver la causa que rebota */}
        <Camara claves={[{t: 20.45, s: 1}, {t: 21.0, s: 1.3, y: 40}, {t: 22.4, s: 1.3, y: 40}, {t: 23.0, s: 0.92, y: 0}]}>
          <Centro top={200}><Carta /></Centro>
        </Camara>
      </Escena>

      {/* 5. Paso 3: liquidación el mismo día */}
      <Paso n={3} en={25.85} hasta={29.35} etiqueta="Liquidación" />
      <Escena r={[26.5, 29.4]}>
        <Camara claves={[{t: 26.5, s: 0.95, x: 40}, {t: 29.4, s: 1.06, x: -20}]}><Centro top={200}><Liquidacion /></Centro></Camara>
      </Escena>

      {/* 6. Remate de venta: Arca se encarga (propuesta de valor) */}
      <CierreServicios desde={29.45} hasta={FIN_VOZ} arcaEn={31.4} escribenosEn={41.2}
        documentos={['Carta de terminación', 'Diligencia de descargos', 'Liquidación final']}
        servicios={[
          {texto: 'Revisamos cada requisito', en: 32.2},
          {texto: 'Redactamos carta, descargos y liquidación', en: 34.6},
          {texto: 'Hacemos el seguimiento', en: 37.66},
          {texto: 'Te defendemos si llega una demanda', en: 39.12},
        ]} />

      <MarcaEsquina hasta={FIN_VOZ} />
      <TituloFijo lineas={['Despedir sin demanda:', 'revisa 3 cosas']} hasta={FIN_VOZ} />
      <Subtitulos palabras={PALABRAS} claves={CLAVES} y={1452} max={3} hasta={FIN_VOZ} />
      <Cierre desde={FIN_VOZ} />
    </AbsoluteFill>
  );
};
