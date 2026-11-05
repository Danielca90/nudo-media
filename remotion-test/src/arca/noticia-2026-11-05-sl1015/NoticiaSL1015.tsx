// Actualidad laboral – SL1015-2026: discapacidad presunta y despido discriminatorio. Ver GUION.md.
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {COLOR, FUENTES} from '../marca';
import palabrasJson from './palabras.json';
import {Porteria} from '../escenarios/Porteria';
import {
  TituloFijo, MarcaEsquina, Subtitulos, Sello, Hoja, Check, Cierre, Camara, CierreServicios, Fuente,
  useT, usePop, tramo, ventana, useSacudida, Palabra,
} from '../kit';

const PALABRAS = palabrasJson as Palabra[];
const FIN_VOZ = 50.15;
export const DURACION_SEG = 52.6;
const CLAVES = ['Corte', 'Suprema', 'ampliar', 'protección', 'rodilla,', 'recomendaciones.', 'despidieron.', 'discriminatorio.',
  'tuvo,', 'presunta', 'vinculado', 'clínico', 'especializado', 'presume', 'revisa', 'documenta', 'solo.', 'revisamos',
  'Documentamos', 'seguimiento', 'defendemos', 'Escríbenos', 'blindamos'];

const Escena: React.FC<{r: [number, number]; children: React.ReactNode}> = ({r, children}) => {
  const t = useT();
  const o = ventana(t, r[0], r[1], 0.2);
  if (o <= 0) return null;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
const Centro: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 190}}>{children}</AbsoluteFill>
);

// 1. Gancho: fuente + sello
const Gancho: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
    <Fuente entidad="Corte Suprema de Justicia" detalle="Sala de Casación Laboral" numero="SL1015-2026" fecha="Comunicado · 5 nov 2026" en={0} />
    <Sello texto="PROTECCIÓN AMPLIADA" en={1.5} color={COLOR.ok} rot={-5} size={58} />
  </div>
);

// 2. El caso: rodilla + concepto de retorno
const Caso: React.FC = () => {
  const t = useT();
  const rod = usePop(6.6, 220, 14);
  const hoja = usePop(7.9, 200, 15);
  const marca = tramo(t, 9.1, 9.8);
  const r1 = tramo(t, 9.6, 9.9);
  const r2 = tramo(t, 9.85, 10.15);
  return (
    <div style={{position: 'relative', width: 900, height: 820}}>
      <div style={{position: 'absolute', left: 0, top: 30, transform: `scale(${rod}) rotate(-6deg)`, background: COLOR.teal, borderRadius: 24,
        padding: '26px 30px', width: 300, boxShadow: '0 24px 50px rgba(0,0,0,.28)', border: `3px solid ${COLOR.dorado}`, zIndex: 2}}>
        <svg width={240} height={200} viewBox="0 0 240 200">
          <path d="M90 0 C 96 60, 92 90, 110 110 C 128 132, 128 160, 120 200 L 160 200 C 168 160, 170 126, 150 100 C 136 82, 140 50, 136 0 Z" fill="#E8C7A6" />
          <circle cx={128} cy={108} r={34} fill="none" stroke={COLOR.alerta} strokeWidth={8} strokeDasharray="10 8" />
          <path d="M60 60 L 96 92 M 190 150 L 160 122" stroke={COLOR.alerta} strokeWidth={8} strokeLinecap="round" />
        </svg>
        <div style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 32, color: COLOR.crema, textAlign: 'center'}}>Accidente en la rodilla</div>
      </div>
      <div style={{position: 'absolute', right: 0, top: 120, transform: `translateX(${(1 - hoja) * 700}px) rotate(3deg)`}}>
        <Hoja titulo="CONCEPTO DE RETORNO LABORAL" lineas={2} ancho={560} alto={640}>
          <div style={{position: 'relative', display: 'inline-block', marginTop: 6}}>
            <div style={{position: 'absolute', left: -8, right: `${(1 - marca) * 100}%`, top: 6, bottom: -2, background: 'rgba(198,169,107,.55)', borderRadius: 6}} />
            <span style={{position: 'relative', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 36, color: COLOR.teal}}>APTO CON RECOMENDACIONES</span>
          </div>
          <div style={{marginTop: 24, display: 'grid', gap: 14}}>
            {[['Evitar subir y bajar escaleras', r1], ['Limitar caminatas largas', r2]].map(([s, o]) => (
              <div key={s as string} style={{opacity: o as number, transform: `translateX(${(1 - (o as number)) * 40}px)`, fontFamily: FUENTES.sans,
                fontWeight: 600, fontSize: 28, color: COLOR.tinta}}>• {s as string}</div>
            ))}
          </div>
        </Hoja>
      </div>
    </div>
  );
};

// 3. Día 1 vuelve, día 2 despedido → despido discriminatorio
const Despido: React.FC = () => {
  const t = useT();
  const d1 = usePop(10.4, 220, 15);
  const d2 = usePop(11.35, 260, 13);
  const linea = tramo(t, 10.8, 11.4);
  const dx = useSacudida(13.45, 16);
  const Dia: React.FC<{s: number; n: string; txt: string; color: string}> = ({s, n, txt, color}) => (
    <div style={{transform: `scale(${s})`, width: 330, background: COLOR.papel, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,.25)'}}>
      <div style={{background: color, color: '#fff', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 34, padding: '12px 0', textAlign: 'center'}}>{n}</div>
      <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 30, color: COLOR.tinta, padding: '24px 20px', textAlign: 'center', lineHeight: 1.2}}>{txt}</div>
    </div>
  );
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60, transform: `translateX(${dx}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
        <Dia s={d1} n="DÍA 1" txt="Regresa: apto con recomendaciones" color={COLOR.teal} />
        <svg width={110} height={40} viewBox="0 0 110 40"><path d="M4 20 H 96 M 80 6 L 100 20 L 80 34" fill="none" stroke={COLOR.alerta} strokeWidth={7}
          strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * (1 - linea)} /></svg>
        <Dia s={d2} n="DÍA 2" txt="Lo despiden" color={COLOR.alerta} />
      </div>
      <Sello texto="DESPIDO DISCRIMINATORIO" en={13.4} size={56} rot={-4} />
    </div>
  );
};

// 4. A quién cubre la protección (Observación n.º 6, Comité ONU)
const Cubre: React.FC = () => {
  const t = useT();
  const obs = usePop(15.2, 220, 15);
  const items: [string, number, boolean][] = [
    ['Tiene una discapacidad', 17.9, false],
    ['La tuvo en el pasado', 19.45, false],
    ['Discapacidad presunta', 20.85, true],
    ['Está vinculado a una persona con discapacidad', 23.6, false],
  ];
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, width: 860}}>
      <div style={{transform: `scale(${obs})`, background: COLOR.teal, color: COLOR.crema, borderRadius: 14, padding: '16px 30px',
        fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 36, borderBottom: `6px solid ${COLOR.dorado}`}}>LA PROTECCIÓN CUBRE A QUIEN…</div>
      {items.map(([txt, en, clave]) => {
        const p = tramo(t, en, en + 0.35);
        return (
          <div key={txt} style={{opacity: p, transform: `translateX(${(1 - p) * 120}px) scale(${clave ? 1 + Math.sin(p * Math.PI) * 0.06 : 1})`,
            width: '100%', display: 'flex', alignItems: 'center', gap: 22, background: clave ? COLOR.dorado : COLOR.papel, borderRadius: 18,
            padding: '22px 30px', boxSizing: 'border-box', boxShadow: '0 18px 36px rgba(0,0,0,.2)'}}>
            <Check p={p} size={62} />
            <span style={{fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 38, color: clave ? COLOR.teal : COLOR.tinta, lineHeight: 1.15}}>{txt}</span>
          </div>
        );
      })}
      <div style={{opacity: obs * 0.9, fontFamily: FUENTES.sans, fontWeight: 600, fontSize: 24, color: COLOR.teal, background: 'rgba(255,255,255,.85)',
        padding: '6px 16px', borderRadius: 8}}>Con apoyo en la Observación n.º 6 del Comité de la ONU</div>
    </div>
  );
};

// 5. Error frecuente vs criterio de la Corte
const Comparacion: React.FC = () => {
  const t = useT();
  const a = usePop(25.9, 220, 15);
  const b = usePop(27.0, 220, 15);
  const x = tramo(t, 26.9, 27.3);
  const presume = usePop(29.7, 260, 12);
  const Col: React.FC<{s: number; titulo: string; color: string; texto: string; children?: React.ReactNode}> = ({s, titulo, color, texto, children}) => (
    <div style={{transform: `scale(${s})`, width: 400, background: COLOR.papel, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,.25)',
      position: 'relative', alignSelf: 'stretch'}}>
      <div style={{background: color, color: '#fff', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 28, padding: '16px 20px', textAlign: 'center', letterSpacing: 1}}>{titulo}</div>
      <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 34, color: COLOR.tinta, padding: '28px 26px', lineHeight: 1.25}}>{texto}</div>
      {children}
    </div>
  );
  return (
    <div style={{display: 'flex', gap: 30, alignItems: 'stretch'}}>
      <Col s={a} titulo="ERROR FRECUENTE" color={COLOR.alerta} texto="“No tiene calificación de pérdida de capacidad: lo puedo despedir.”">
        <svg width={400} height={300} viewBox="0 0 400 300" style={{position: 'absolute', left: 0, top: 70, opacity: x}}>
          <path d="M40 40 L 360 260 M 360 40 L 40 260" stroke={COLOR.alerta} strokeWidth={14} strokeLinecap="round" opacity={0.75} />
        </svg>
      </Col>
      <Col s={b} titulo="CRITERIO DE LA CORTE" color={COLOR.teal} texto="Sin soporte clínico especializado sobre su condición…">
        <div style={{margin: '0 26px 26px', transform: `scale(${presume})`, background: COLOR.dorado, color: COLOR.teal, borderRadius: 12,
          padding: '14px 18px', fontFamily: FUENTES.sans, fontWeight: 800, fontSize: 34, textAlign: 'center'}}>SE PRESUME LA DISCRIMINACIÓN</div>
      </Col>
    </div>
  );
};

// 6. Qué hacer
const QueHacer: React.FC = () => {
  const t = useT();
  const h = usePop(31.4, 220, 15);
  const filas: [string, number][] = [['Revisa el caso antes de despedir', 34.4], ['Documenta el soporte médico', 35.4]];
  return (
    <div style={{transform: `scale(${h})`, width: 820, background: COLOR.papel, borderRadius: 22, padding: '36px 42px', boxSizing: 'border-box',
      boxShadow: '0 30px 60px rgba(0,0,0,.25)', borderTop: `16px solid ${COLOR.teal}`}}>
      <div style={{fontFamily: FUENTES.serif, fontWeight: 700, fontSize: 44, color: COLOR.teal, lineHeight: 1.2}}>¿Alguien vuelve de una incapacidad?</div>
      <div style={{height: 4, width: 110, background: COLOR.dorado, margin: '18px 0 20px'}} />
      {filas.map(([f, en], i) => (
        <div key={f} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 0', borderBottom: i === 0 ? '2px solid #E4E9E7' : 'none'}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: COLOR.teal, color: COLOR.dorado, fontFamily: FUENTES.serif, fontWeight: 700,
            fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
          <div style={{flex: 1, fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 38, color: COLOR.tinta}}>{f}</div>
          <Check p={tramo(t, en, en + 0.35)} size={66} />
        </div>
      ))}
    </div>
  );
};

export const NoticiaSL1015: React.FC = () => {
  const t = useT();
  const foco = tramo(t, 3.9, 4.4);
  const zoom = 1 + tramo(t, 0, 4.2) * 0.05 + foco * 0.06;
  return (
    <AbsoluteFill style={{background: COLOR.pared}}>
      <Audio src={staticFile('arca/voz-noticia-sl1015.mp3')} />
      <Porteria foco={foco} zoom={zoom} />
      <AbsoluteFill style={{background: COLOR.crema, opacity: foco * 0.22, height: 1240}} />

      <Escena r={[-1, 4.25]}><Camara claves={[{t: 0, s: 0.96}, {t: 4.2, s: 1.04}]}><Centro><Gancho /></Centro></Camara></Escena>
      <Escena r={[4.2, 10.35]}><Camara claves={[{t: 4.2, s: 0.94}, {t: 8.6, s: 0.98}, {t: 9.6, s: 1.06, x: -40, y: 20}, {t: 10.3, s: 1.06, x: -40, y: 20}]}><Centro><Caso /></Centro></Camara></Escena>
      <Escena r={[10.3, 15.0]}><Camara claves={[{t: 10.3, s: 0.96}, {t: 15, s: 1.04}]}><Centro><Despido /></Centro></Camara></Escena>
      <Escena r={[14.95, 25.9]}><Camara claves={[{t: 14.95, s: 0.94, y: 30}, {t: 25.9, s: 1.0, y: 0}]}><Centro><Cubre /></Centro></Camara></Escena>
      <Escena r={[25.85, 31.35]}><Camara claves={[{t: 25.85, s: 0.95, x: 30}, {t: 31.3, s: 1.03, x: -30}]}><Centro><Comparacion /></Centro></Camara></Escena>
      <Escena r={[31.3, 36.65]}><Camara claves={[{t: 31.3, s: 0.94}, {t: 36.6, s: 1.02}]}><Centro><QueHacer /></Centro></Camara></Escena>
      <CierreServicios desde={36.6} hasta={FIN_VOZ} arcaEn={38.3} escribenosEn={47.45}
        documentos={['Concepto de retorno laboral', 'Soporte médico especializado', 'Carta de terminación']}
        servicios={[
          {texto: 'Revisamos cada caso antes de que decidas', en: 39.1},
          {texto: 'Documentamos el soporte médico y legal', en: 41.85},
          {texto: 'Hacemos el seguimiento', en: 44.1},
          {texto: 'Te defendemos si llega una demanda', en: 45.5},
        ]} />

      <MarcaEsquina hasta={FIN_VOZ} />
      <TituloFijo ante="ACTUALIDAD LABORAL · 5 NOV 2026" lineas={['Corte Suprema amplía', 'protección por discapacidad']} hasta={FIN_VOZ} />
      <Subtitulos palabras={PALABRAS} claves={CLAVES} y={1452} max={3} hasta={FIN_VOZ} />
      <Cierre desde={FIN_VOZ} />
    </AbsoluteFill>
  );
};
