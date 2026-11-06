// Reel 04 – Cuánto cuesta despedir sin justa causa. Estilo documental (ver GUION.md).
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {COLOR, FUENTES} from '../marca';
import palabrasJson from './palabras.json';
import {Subtitulos, Cierre, Check, useT, usePop, tramo, ventana, useSacudida, Palabra} from '../kit';
import {DOC, Mesa, Pelicula, Papel, Plano, Escribe, Resalta, Rotulo, Firma, cop} from '../documental';

const palabras = palabrasJson as Palabra[];
export const FIN_VOZ = 32.4;
export const DUR_ARCA04 = 35;

const sans = (peso: number, size: number, color = '#fff', extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: FUENTES.sans, fontWeight: peso, fontSize: size, color, ...extra,
});

// ---------- la carta de despido ----------
const Carta: React.FC<{conFirma?: boolean}> = ({conFirma}) => {
  const linea = (w: number, i: number) => (
    <div key={i} style={{height: 13, width: w, background: 'rgba(31,36,35,.16)', borderRadius: 3, marginBottom: 20}} />
  );
  return (
    <div style={{padding: '70px 74px', color: DOC.tinta, fontFamily: FUENTES.serif}}>
      <div style={{fontSize: 24, opacity: 0.7}}>Bogotá, 17 de noviembre de 2026</div>
      <div style={{fontSize: 26, marginTop: 34}}>Señora</div>
      <div style={{width: 300, height: 34, background: '#141414', marginTop: 8}} />
      <div style={{fontSize: 30, fontWeight: 700, marginTop: 42, letterSpacing: 1}}>Asunto: TERMINACIÓN DEL CONTRATO DE TRABAJO</div>
      <div style={{fontSize: 27, lineHeight: 1.55, marginTop: 26}}>
        Por medio de la presente le informamos que la empresa ha decidido dar por terminado su contrato de trabajo a término
        indefinido, <b style={{background: 'rgba(180,83,42,.18)', padding: '0 6px'}}>sin justa causa</b>, a partir de la fecha.
      </div>
      <div style={{marginTop: 34}}>{[640, 690, 520, 660, 430].map(linea)}</div>
      <div style={{marginTop: 50, fontSize: 24}}>Atentamente,</div>
      <div style={{marginTop: 70, width: 380, borderTop: `2px solid ${DOC.tinta}`, paddingTop: 10, fontSize: 22, opacity: 0.75}}>
        {conFirma ? 'Firma del empleador' : 'Firma del empleador'}
      </div>
    </div>
  );
};

// ---------- 1. gancho ----------
const Gancho: React.FC = () => {
  const t = useT();
  const golpe = usePop(1.42, 260, 10);
  const pulso = t > 1.42 ? 1 + (1 - golpe) * 0.12 + Math.max(0, 0.08 - (t - 1.42) * 0.2) : 1;
  return (
    <Plano ini={-1} fin={3.25} zoom={[1, 1.07]} desde={[0, 0]} hasta={[0, -30]}>
      <Mesa lx={0.5} ly={0.62} />
      <Papel ancho={880} alto={1180} rot={-3.5} style={{left: 100, top: 760}}>
        <Carta />
      </Papel>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,22,22,.92) 0%, rgba(11,22,22,.7) 30%, rgba(11,22,22,0) 46%)'}} />
      <div style={{position: 'absolute', top: 250, left: 60, right: 60, textAlign: 'center'}}>
        <div style={sans(900, 70, '#F4EFE4', {letterSpacing: 2, lineHeight: 1.1})}>ESTE DESPIDO<br />TE VA A COSTAR</div>
        <div style={sans(900, 148, COLOR.dorado, {marginTop: 18, transform: `scale(${pulso})`, letterSpacing: -2,
          textShadow: '0 10px 40px rgba(0,0,0,.6)', fontVariantNumeric: 'tabular-nums'})}>{cop(7000000)}</div>
      </div>
    </Plano>
  );
};

// ---------- 2. el expediente ----------
const Expediente: React.FC = () => {
  const t = useT();
  const sacude = useSacudida(8.02, 12);
  const sello = usePop(8.02, 300, 12);
  const campo = (etiqueta: string, valor: string, a: number, b: number) => (
    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '2px dashed rgba(31,36,35,.25)', padding: '22px 0'}}>
      <span style={sans(600, 30, '#5B5F5C', {letterSpacing: 1})}>{etiqueta}</span>
      <Escribe texto={valor} a={a} b={b} style={sans(800, 38, DOC.tinta, {fontVariantNumeric: 'tabular-nums'})} />
    </div>
  );
  return (
    <Plano ini={3.05} fin={9.35} zoom={[1.08, 1.0]} desde={[0, 30]} hasta={[0, 0]}>
      <Mesa lx={0.45} ly={0.4} />
      <div style={{position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center', ...sans(700, 28, COLOR.dorado, {letterSpacing: 10})}}>EL CASO</div>
      {/* carpeta */}
      <div style={{position: 'absolute', left: 70, top: 310, width: 940, height: 1000, background: 'linear-gradient(170deg,#D9C18E,#C2A56E)',
        borderRadius: 10, boxShadow: '0 40px 90px rgba(0,0,0,.6)', transform: 'rotate(1.5deg)'}} />
      <Papel ancho={880} alto={940} rot={-1} style={{left: 100, top: 340}}>
        <div style={{padding: '56px 64px'}}>
          <div style={{display: 'flex', gap: 40, alignItems: 'center'}}>
            <div style={{width: 210, height: 260, background: '#9AA3A0', position: 'relative', overflow: 'hidden', filter: 'grayscale(1) blur(1.5px)'}}>
              <div style={{position: 'absolute', left: 60, top: 40, width: 90, height: 100, borderRadius: '50%', background: '#5E6866'}} />
              <div style={{position: 'absolute', left: 20, top: 150, width: 170, height: 160, borderRadius: '50% 50% 0 0', background: '#5E6866'}} />
            </div>
            <div>
              <div style={sans(700, 24, '#7A7E7B', {letterSpacing: 6})}>EXPEDIENTE LABORAL</div>
              <div style={{width: 380, height: 46, background: '#141414', marginTop: 18}} />
              <div style={sans(600, 30, DOC.tinta, {marginTop: 18})}>Analista administrativa</div>
              <div style={sans(700, 22, COLOR.alerta, {marginTop: 12, letterSpacing: 4})}>DATOS RESERVADOS</div>
            </div>
          </div>
          <div style={{marginTop: 40}}>
            {campo('Salario mensual', cop(3000000), 4.1, 4.6)}
            {campo('Antigüedad', '3 años', 5.44, 5.9)}
            {campo('Contrato', 'A término indefinido', 6.24, 6.9)}
            {campo('Terminación', 'Sin justa causa', 8.02, 8.5)}
          </div>
        </div>
      </Papel>
      {t > 8.0 && (
        <div style={{position: 'absolute', left: 360, top: 1150, transform: `translateX(${sacude}px) rotate(-12deg) scale(${2 - sello})`,
          opacity: Math.min(1, sello * 1.5), border: `8px solid ${COLOR.alerta}`, borderRadius: 10, padding: '14px 26px',
          ...sans(900, 50, COLOR.alerta, {letterSpacing: 3}), mixBlendMode: 'multiply'}}>SIN JUSTA CAUSA</div>
      )}
    </Plano>
  );
};

// ---------- 3. la ley ----------
const Ley: React.FC = () => (
  <Plano ini={9.3} fin={15.75} zoom={[1.04, 1.13]} desde={[0, 60]} hasta={[-10, -90]}>
    <Mesa lx={0.5} ly={0.35} foco={0.6} />
    <Papel ancho={960} alto={1250} rot={0.6} style={{left: 60, top: 190}}>
      <div style={{padding: '70px 70px', fontFamily: FUENTES.serif, color: DOC.tinta}}>
        <div style={sans(700, 24, '#6B6F6C', {letterSpacing: 6, textAlign: 'center'})}>CÓDIGO SUSTANTIVO DEL TRABAJO</div>
        <div style={{fontSize: 40, fontWeight: 700, textAlign: 'center', marginTop: 22}}>ARTÍCULO 64</div>
        <div style={{fontSize: 27, fontStyle: 'italic', textAlign: 'center', marginTop: 8, opacity: 0.8}}>Terminación unilateral del contrato sin justa causa</div>
        <div style={{fontSize: 31, lineHeight: 1.62, marginTop: 44}}>
          4. En los contratos a término indefinido la indemnización se pagará así:
          <br />a) Para trabajadores que devenguen un salario inferior a diez (10) salarios mínimos mensuales legales:
          <br />1. <Resalta a={11.24} b={11.95}>Treinta (30) días de salario</Resalta> cuando el trabajador tuviere un tiempo de servicio no mayor de un (1) año.
          <br />2. Si el trabajador tuviere más de un (1) año de servicio continuo se le pagarán <Resalta a={13.44} b={14.1}>veinte (20) días adicionales de salario</Resalta> sobre
          los treinta (30) básicos del numeral 1, <Resalta a={14.28} b={15.1}>por cada uno de los años de servicio subsiguientes al primero</Resalta> y
          proporcionalmente por fracción.
        </div>
      </div>
    </Papel>
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(11,22,22,.95) 0%, rgba(11,22,22,.75) 28%, rgba(11,22,22,0) 42%)'}} />
  </Plano>
);

// ---------- 4. la cuenta ----------
const Cuenta: React.FC = () => {
  const t = useT();
  const seg = [{d: 30, en: 15.98, l: 'Año 1', c: COLOR.teal}, {d: 20, en: 16.3, l: 'Año 2', c: COLOR.teal2}, {d: 20, en: 16.55, l: 'Año 3', c: COLOR.teal3}];
  const total = usePop(16.78, 220, 14);
  const monto = interpolate(t, [17.94, 18.6], [0, 7000000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const res = tramo(t, 17.9, 18.15);
  const lq = tramo(t, 19.7, 20.1);
  const ancho = 760;
  return (
    <Plano ini={15.7} fin={21.15} zoom={[1, 1.05]}>
      <Mesa lx={0.5} ly={0.4} />
      <Papel ancho={960} alto={1040} rot={-0.8} style={{left: 60, top: 250}}>
        <div style={{padding: '60px 70px'}}>
          <div style={{fontFamily: FUENTES.serif, fontSize: 48, color: DOC.tinta}}>La cuenta</div>
          <div style={sans(600, 28, '#5B5F5C', {marginTop: 14, fontVariantNumeric: 'tabular-nums'})}>
            Salario diario: {cop(3000000)} ÷ 30 = <b style={{color: DOC.tinta}}>{cop(100000)}</b>
          </div>
          {/* línea de tiempo */}
          <div style={{display: 'flex', marginTop: 56, height: 120}}>
            {seg.map((s, i) => {
              const p = tramo(t, s.en, s.en + 0.3);
              return (
                <div key={i} style={{width: (ancho * s.d) / 70, height: '100%', position: 'relative', marginRight: 6}}>
                  <div style={{position: 'absolute', inset: 0, background: s.c, transformOrigin: 'left', transform: `scaleX(${p})`, borderRadius: 4}} />
                  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: p,
                    ...sans(800, 40, COLOR.crema, {fontVariantNumeric: 'tabular-nums'})}}>{i === 0 ? '30' : '+20'}</div>
                  <div style={{position: 'absolute', top: 132, left: 0, right: 0, textAlign: 'center', opacity: p, ...sans(600, 24, '#5B5F5C')}}>{s.l}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 80, display: 'flex', alignItems: 'baseline', gap: 20, opacity: total, transform: `translateY(${(1 - total) * 20}px)`}}>
            <span style={sans(900, 96, DOC.tinta, {fontVariantNumeric: 'tabular-nums'})}>70</span>
            <span style={sans(700, 44, DOC.tinta)}>días de salario</span>
          </div>
          <div style={{marginTop: 28, background: COLOR.teal, borderRadius: 8, padding: '26px 34px', opacity: res, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={sans(600, 34, COLOR.crema, {fontVariantNumeric: 'tabular-nums'})}>70 × {cop(100000)}</span>
            <span style={sans(900, 64, COLOR.dorado, {fontVariantNumeric: 'tabular-nums'})}>{cop(monto)}</span>
          </div>
          <div style={{marginTop: 34, borderTop: '3px dashed rgba(31,36,35,.3)', paddingTop: 26, opacity: lq, display: 'flex', alignItems: 'center', gap: 22}}>
            <span style={sans(800, 34, DOC.tinta)}>+ Liquidación</span>
            <span style={sans(500, 26, '#5B5F5C')}>cesantías, intereses, prima, vacaciones</span>
          </div>
          <div style={{marginTop: 16, opacity: lq, ...sans(800, 26, COLOR.alerta, {letterSpacing: 4})}}>SE PAGA APARTE</div>
        </div>
      </Papel>
    </Plano>
  );
};

// ---------- 5. antes de firmar ----------
const AntesDeFirmar: React.FC = () => {
  const t = useT();
  const l2 = tramo(t, 22.45, 22.7);
  return (
    <Plano ini={21.1} fin={23.35} zoom={[1.12, 1.0]}>
      <Mesa lx={0.5} ly={0.66} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'scale(.62) translate(0px, 230px)'}}>
        <Papel ancho={880} alto={1180} rot={-3.5} style={{left: 100, top: 760}}><Carta /></Papel>
        {/* bolígrafo */}
        <div style={{position: 'absolute', left: 560, top: 1700, width: 520, height: 34, borderRadius: 17, transform: 'rotate(-28deg)',
          background: 'linear-gradient(180deg,#3A4442,#111816 60%,#0A0E0D)', boxShadow: '0 24px 40px rgba(0,0,0,.6)'}}>
          <div style={{position: 'absolute', left: -50, top: 9, width: 60, height: 16, background: 'linear-gradient(180deg,#D8C089,#A8843F)', clipPath: 'polygon(100% 0,100% 100%,0 50%)'}} />
          <div style={{position: 'absolute', right: 40, top: -6, width: 140, height: 10, background: COLOR.dorado, borderRadius: 4}} />
        </div>
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,22,22,.9) 0%, rgba(11,22,22,.6) 34%, rgba(11,22,22,0) 50%)'}} />
      <div style={{position: 'absolute', top: 290, left: 60, right: 60, textAlign: 'center'}}>
        <div style={sans(900, 84, '#F4EFE4', {letterSpacing: 1})}>ANTES DE DESPEDIR,</div>
        <div style={sans(900, 110, COLOR.dorado, {opacity: l2, transform: `scale(${0.9 + 0.1 * l2})`})}>HAZ LA CUENTA</div>
      </div>
    </Plano>
  );
};

// ---------- 6. remate de venta ----------
const Remate: React.FC = () => {
  const t = useT();
  const o = ventana(t, 23.3, FIN_VOZ + 0.25, 0.35);
  if (o <= 0) return null;
  const servicios = [
    {txt: 'Revisamos cada caso', en: 24.84},
    {txt: 'Redactamos los documentos', en: 26.32},
    {txt: 'Te defendemos si llega una demanda', en: 27.78},
  ];
  const lema = tramo(t, 23.35, 23.8);
  const boton = usePop(29.54, 240, 12);
  const cierre = tramo(t, 30.42, 30.9);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Mesa lx={0.5} ly={0.3} foco={1} />
      <AbsoluteFill style={{background: 'rgba(11,22,22,.72)'}} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 250}}>
        <Img src={staticFile('arca/emblema-claro.png')} style={{height: 120, opacity: lema}} />
        <div style={{fontFamily: FUENTES.serif, fontStyle: 'italic', fontSize: 62, color: COLOR.dorado, marginTop: 34, opacity: lema,
          transform: `translateY(${(1 - lema) * 16}px)`}}>No tienes que hacerlo solo.</div>
        <div style={{width: 120 * lema, height: 3, background: COLOR.dorado, marginTop: 34}} />
        <div style={{marginTop: 50, width: 860}}>
          {servicios.map((s, i) => {
            const p = tramo(t, s.en - 0.1, s.en + 0.3);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '26px 0', borderBottom: '1px solid rgba(198,169,107,.3)',
                opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
                <Check p={tramo(t, s.en, s.en + 0.35)} size={70} />
                <span style={sans(700, 46, '#F4EFE4')}>{s.txt}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 70, background: COLOR.dorado, borderRadius: 60, padding: '26px 80px', transform: `scale(${boton})`,
          ...sans(900, 50, COLOR.teal, {letterSpacing: 4})}}>ESCRÍBENOS</div>
        <div style={{marginTop: 30, opacity: cierre, ...sans(600, 36, '#F4EFE4')}}>
          y <span style={{color: COLOR.dorado}}>blindamos legalmente</span> tu empresa
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Reel04: React.FC = () => {
  const subtitulos = palabras.filter((p) => p.start >= 3.0);
  return (
    <AbsoluteFill style={{background: DOC.noche}}>
      <Audio src={staticFile('arca/voz-reel04.mp3')} />
      <Gancho />
      <Expediente />
      <Ley />
      <Cuenta />
      <AntesDeFirmar />
      <Remate />
      <Rotulo en={9.5} hasta={15.6} arriba="Fuente" abajo="Código Sustantivo del Trabajo, art. 64" y={1215} />
      <Firma desde={3.3} hasta={21.1} />
      <Subtitulos palabras={subtitulos} claves={['7', 'millones', '3', 'indefinido', 'justa', 'causa.', '30', '20', '70', 'liquidación.', 'cuenta.']}
        hasta={21.1} />
      <Pelicula />
      <Cierre desde={FIN_VOZ + 0.2} />
    </AbsoluteFill>
  );
};
