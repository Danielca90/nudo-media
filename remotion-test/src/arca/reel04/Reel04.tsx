// Reel 04 v2 – "La cuenta": cuánta plata necesitas el día que despides sin justa causa.
// Estructura de exposición (estrategia-alcance.md 0c) + tipografía cinética (ref. I) + historia con números (ref. J).
// Render rápido: solo imágenes horneadas, texto y transform/opacity. Usar --gl=angle.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {COLOR, FUENTES, FPS, SEGURO} from '../marca';
import palabrasJson from './palabras.json';
import {Cierre, Check, useT, tramo, Palabra} from '../kit';
import {DOC, Mesa, Pelicula, Papel, Firma, cop} from '../documental';

const palabras = palabrasJson as Palabra[];
export const FIN_VOZ = 44.8;
export const DUR_ARCA04 = 47.3;

// ---------- piezas básicas ----------
type Fondo = 'noche' | 'crema' | 'mesa';
/** Transiciones de cámara: la escena entrante define cómo entra ella y cómo sale la anterior. */
type Trans = 'corte' | 'barrido' | 'zoom' | 'giro' | 'caida';
const ENTRA: Record<string, Trans> = {
  '2': 'barrido', '3.68': 'zoom', '5.86': 'giro', '7.98': 'zoom', '25.38': 'zoom', '27.3': 'barrido',
  '29.06': 'giro', '32.14': 'caida', '35.02': 'zoom', '42.16': 'barrido',
};
const D = 0.32; // duración de cada transición (s)
const salida = (fin: number): Trans => ENTRA[String(+fin.toFixed(2))] ?? 'corte';
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeIn = (x: number) => x * x * x;

type Pose = {x: number; y: number; s: number; r: number; o: number};
const poseEntrada = (tipo: Trans, p: number): Pose => {
  const e = easeOut(p);
  switch (tipo) {
    case 'barrido': return {x: (1 - e) * 1100, y: 0, s: 1, r: (1 - e) * 4, o: 1};
    case 'zoom': return {x: 0, y: 0, s: 0.35 + 0.65 * e, r: (1 - e) * -10, o: Math.min(1, p * 3)};
    case 'giro': return {x: 0, y: 0, s: 1.5 - 0.5 * e, r: (1 - e) * 40, o: Math.min(1, p * 5)};
    case 'caida': {
      const back = 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);
      return {x: 0, y: -(1 - back) * 1920, s: 1, r: 0, o: 1};
    }
    default: return {x: 0, y: 0, s: 1.04 - 0.04 * e, r: 0, o: 1};
  }
};
const poseSalida = (tipo: Trans, q: number): Pose => {
  const e = easeIn(q);
  switch (tipo) {
    case 'barrido': return {x: -e * 1100, y: 0, s: 1, r: -e * 4, o: 1};
    case 'zoom': return {x: 0, y: 0, s: 1 + e * 1.8, r: e * 6, o: 1 - q};
    case 'giro': return {x: 0, y: 0, s: 1 + e * 0.4, r: -e * 25, o: Math.max(0, 1 - q * 3)};
    case 'caida': return {x: 0, y: e * 700, s: 1, r: 0, o: 1 - q};
    default: return {x: 0, y: 0, s: 1, r: 0, o: q < 0.01 ? 1 : 0};
  }
};

/** Escena con cámara viva: transición de entrada/salida, empuje lento, leve balanceo y paralaje del fondo. */
const Escena: React.FC<{ini: number; fin: number; fondo: Fondo; children: React.ReactNode; lx?: number; ly?: number}> = ({ini, fin, fondo, children, lx, ly}) => {
  const t = useT();
  const tipoE = ENTRA[String(+ini.toFixed(2))] ?? 'corte';
  const tipoS = salida(fin);
  const extra = tipoS === 'corte' ? 0 : D;
  if (t < ini || t >= fin + extra) return null;
  const pe = Math.min(1, (t - ini) / D);
  const pin = pe < 1 ? poseEntrada(tipoE, pe) : {x: 0, y: 0, s: 1, r: 0, o: 1};
  const pout = t >= fin ? poseSalida(tipoS, (t - fin) / D) : {x: 0, y: 0, s: 1, r: 0, o: 1};
  const vida = t - ini;
  const empuje = 1 + Math.min(vida, 3) * 0.018;
  const balanceo = Math.sin(vida * 0.9) * 0.7;
  const x = pin.x + pout.x, y = pin.y + pout.y, sc = pin.s * pout.s, r = pin.r + pout.r, o = pin.o * pout.o;
  const capa = (dx: number, op: number, key: string) => (
    <AbsoluteFill key={key} style={{opacity: o * op, transform: `translate(${x + dx}px, ${y}px) rotate(${r}deg) scale(${sc})`}}>
      <AbsoluteFill style={{background: fondo === 'crema' ? COLOR.crema : DOC.noche}}>
        {fondo === 'mesa' && (
          <AbsoluteFill style={{transform: `scale(${1 + vida * 0.007}) translateX(${Math.sin(vida * 0.4) * 10}px)`}}><Mesa lx={lx} ly={ly} /></AbsoluteFill>
        )}
        <AbsoluteFill style={{transform: `scale(${empuje}) rotate(${balanceo}deg)`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
  // estela de movimiento en los barridos (copias tenues detrás, sin filtros)
  const estela = (tipoE === 'barrido' && pe < 1) || (tipoS === 'barrido' && t >= fin);
  const dir = t >= fin ? 1 : -1;
  return (
    <>
      {estela && capa(dir * -160, 0.18, 'e2')}
      {estela && capa(dir * -80, 0.3, 'e1')}
      {capa(0, 1, 'p')}
    </>
  );
};

/** Línea de tipografía cinética: entra con resorte en `en`. */
const L: React.FC<{en: number; size: number; color: string; peso?: number; serif?: boolean; italic?: boolean; caja?: string; children: React.ReactNode}> = ({
  en, size, color, peso = 800, serif, italic, caja, children,
}) => {
  const frame = useCurrentFrame();
  const p = en <= 0.01 ? 1 : spring({frame: frame - Math.round(en * FPS), fps: FPS, config: {stiffness: 230, damping: 15}});
  if (frame < Math.round(en * FPS)) return <div style={{height: size * 1.12}} />;
  const golpe = size >= 150;
  const d = (frame - Math.round(en * FPS)) / FPS;
  const sacude = golpe && d > 0.12 && d < 0.3 ? Math.sin(d * 120) * 8 * (1 - (d - 0.12) / 0.18) : 0;
  const tr = golpe ? `translateX(${sacude}px) scale(${1 + (1 - p) * 1.6})` : `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})`;
  return (
    <div style={{fontFamily: serif ? FUENTES.serif : FUENTES.sans, fontWeight: peso, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color,
      lineHeight: 1.08, letterSpacing: size > 120 ? -2 : 1, transform: tr, opacity: Math.min(1, p * 1.6),
      fontVariantNumeric: 'tabular-nums'}}>
      {caja ? <span style={{background: caja, padding: '0 18px'}}>{children}</span> : children}
    </div>
  );
};
const Bloque: React.FC<{top?: number; children: React.ReactNode}> = ({top = 330, children}) => (
  <div style={{position: 'absolute', top, left: 70, right: 70, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>{children}</div>
);

/** Contador que rueda de `de` a `a` entre los segundos `ini` y `fin`. */
const useCuenta = (ini: number, fin: number, a: number, de = 0) => {
  const t = useT();
  return interpolate(t, [ini, fin], [de, a], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

/** Subtítulo pequeño fijo (capa 2 de texto). */
const SubFijo: React.FC<{desde: number; hasta: number}> = ({desde, hasta}) => {
  const t = useT();
  if (t < desde || t > hasta) return null;
  const bloques: Palabra[][] = [];
  let cur: Palabra[] = [];
  palabras.forEach((p) => { cur.push(p); if (/[.,:?!]$/.test(p.text) || cur.length >= 5) { bloques.push(cur); cur = []; } });
  if (cur.length) bloques.push(cur);
  const b = bloques.find((bl, i) => t >= bl[0].start - 0.05 && t < (bloques[i + 1]?.[0].start ?? bl[bl.length - 1].end + 0.5) - 0.05);
  if (!b) return null;
  return (
    <div style={{position: 'absolute', top: 1470, left: SEGURO.left, right: SEGURO.right - 60, textAlign: 'center'}}>
      <span style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 38, color: '#fff', background: 'rgba(11,22,22,.72)', padding: '8px 18px', borderRadius: 8,
        boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', lineHeight: 1.6}}>
        {b.map((p) => p.text).join(' ')}
      </span>
    </div>
  );
};

// ---------- la tirilla ----------
const MONO = `"Courier New", Courier, monospace`;
const Zigzag: React.FC<{abajo?: boolean}> = ({abajo}) => (
  <div style={{height: 22, background: `linear-gradient(135deg, ${DOC.papel} 25%, transparent 25%) -11px 0, linear-gradient(225deg, ${DOC.papel} 25%, transparent 25%) -11px 0`,
    backgroundSize: '22px 22px', transform: abajo ? 'rotate(180deg)' : undefined}} />
);
const filas = [
  {c: 'Indemnización (70 días)', v: 7000000, en: 9.28, monto: 11.82},
  {c: 'Cesantías e intereses', v: 3305954, en: 13.08, monto: 14.72},
  {c: 'Prima del semestre', v: 1353790, en: 16.48, monto: 17.74},
  {c: 'Vacaciones pendientes', v: 1500000, en: 19.7, monto: 21.02},
];
const TOTAL = 13159744;

const Tirilla: React.FC = () => {
  const t = useT();
  const total = useCuenta(22.9, 24.3, TOTAL);
  const verTotal = t >= 22.24;
  // la cámara sigue el renglón que se está diciendo
  const foco = t < 13.08 ? 0 : t < 16.48 ? 1 : t < 19.7 ? 2 : t < 22.24 ? 3 : 4;
  const y = interpolate(t, [8, 9.2, 13.08, 13.4, 16.48, 16.8, 19.7, 20.0, 22.24, 22.7], [60, 140, 140, 90, 90, 40, 40, -10, -10, -90], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const rx = interpolate(t, [8, 22.24, 22.7], [24, 12, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rz = interpolate(t, [8, 15, 22.24], [-3, 1.5, -1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = interpolate(t, [8, 9.2, 22.24, 22.7], [1.0, 1.06, 1.06, 1.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: 90, top: 330, width: 900, transform: `perspective(1800px) translateY(${y}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s})`, transformOrigin: '50% 0',
      filter: 'drop-shadow(0 30px 40px rgba(0,0,0,.55))'}}>
      <Zigzag />
      <div style={{background: DOC.papel, padding: '30px 54px 40px', fontFamily: MONO, color: DOC.tinta}}>
        <div style={{textAlign: 'center', fontWeight: 700, fontSize: 28, letterSpacing: 6}}>LA CUENTA · DESPIDO</div>
        <div style={{textAlign: 'center', fontSize: 24, marginTop: 8, opacity: 0.7}}>Salario $3.000.000 · 3 años · indefinido</div>
        <div style={{borderTop: '3px dashed rgba(31,36,35,.35)', margin: '26px 0 10px'}} />
        {filas.map((f, i) => {
          const o = tramo(t, f.en - 0.05, f.en + 0.2);
          const m = useCuentaFila(f.monto, f.v);
          const activo = foco === i;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 12, padding: '16px 0', opacity: o, fontSize: 32,
              background: activo ? 'rgba(198,169,107,.22)' : 'transparent', margin: '0 -18px', paddingLeft: 18, paddingRight: 18}}>
              <span style={{fontWeight: 700}}>{f.c}</span>
              <span style={{flex: 1, borderBottom: '3px dotted rgba(31,36,35,.35)', transform: 'translateY(-8px)'}} />
              <span style={{fontWeight: 700, minWidth: 250, textAlign: 'right'}}>{t >= f.monto ? cop(m) : ''}</span>
            </div>
          );
        })}
        <div style={{borderTop: '3px dashed rgba(31,36,35,.35)', margin: '16px 0 18px'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: verTotal ? 1 : 0.25}}>
          <span style={{fontWeight: 700, fontSize: 40, letterSpacing: 4}}>ESE DÍA</span>
          <span style={{background: COLOR.dorado, padding: '6px 18px', fontWeight: 700, fontSize: 58}}>{verTotal ? cop(total) : '$ ?'}</span>
        </div>
        <div style={{fontSize: 18, marginTop: 24, opacity: 0.6, lineHeight: 1.4}}>
          Cálculo orientativo: art. 64 CST, salario &lt; 10 SMMLV, ingreso 1/12/2023, despido 30/11/2026, auxilio de transporte 2026
          incluido en cesantías y prima, vacaciones anteriores ya disfrutadas.
        </div>
      </div>
      <Zigzag abajo />
    </div>
  );
};
// contador por fila (hook fuera del map condicional para mantener el orden)
function useCuentaFila(ini: number, v: number) {
  const t = useT();
  return interpolate(t, [ini, ini + 0.45], [0, v], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
}

const Carta: React.FC<{escala?: number; x?: number; y?: number; rot?: number}> = ({escala = 0.55, x = 300, y = 900, rot = -6}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${escala}) rotate(${rot}deg)`, transformOrigin: '0 0'}}>
    <Papel ancho={880} alto={1150}>
      <div style={{padding: '70px 74px', color: DOC.tinta, fontFamily: FUENTES.serif}}>
        <div style={{fontSize: 24, opacity: 0.7}}>Bogotá, 30 de noviembre de 2026</div>
        <div style={{width: 300, height: 34, background: '#141414', marginTop: 40}} />
        <div style={{fontSize: 32, fontWeight: 700, marginTop: 42}}>Asunto: TERMINACIÓN DEL CONTRATO DE TRABAJO</div>
        <div style={{fontSize: 28, lineHeight: 1.55, marginTop: 26}}>
          Le informamos que la empresa ha decidido dar por terminado su contrato de trabajo a término indefinido,
          <b style={{color: COLOR.alerta}}> sin justa causa</b>, a partir de la fecha.
        </div>
        {[640, 690, 520, 660].map((w, i) => <div key={i} style={{height: 13, width: w, background: 'rgba(31,36,35,.16)', borderRadius: 3, marginTop: 22}} />)}
        <div style={{marginTop: 90, width: 380, borderTop: `2px solid ${DOC.tinta}`, paddingTop: 10, fontSize: 22, opacity: 0.75}}>Firma del empleador</div>
      </div>
    </Papel>
  </div>
);

// ---------- video ----------
const CREMA_T = '#F4EFE4';
export const Reel04: React.FC = () => {
  const t = useT();
  const siete = useCuenta(33.8, 34.3, 7000000);
  const servicios = [
    {txt: 'Revisamos el caso', en: 37.6},
    {txt: 'Redactamos los documentos', en: 38.74},
    {txt: 'Te defendemos si llega una demanda', en: 40.16},
  ];
  return (
    <AbsoluteFill style={{background: DOC.noche}}>
      <Audio src={staticFile('arca/voz-reel04v2.mp3')} />

      {/* 1. gancho: el dato que reconoce */}
      <Escena ini={0} fin={2.0} fondo="noche">
        <Bloque top={420}>
          <L en={0} size={70} color={CREMA_T}>TU TRABAJADORA</L>
          <L en={0} size={70} color={CREMA_T}>GANA</L>
          <L en={0} size={165} color={COLOR.dorado} peso={900}>{cop(3000000)}</L>
        </Bloque>
      </Escena>
      <Escena ini={2.0} fin={3.68} fondo="crema">
        <Bloque top={480}>
          <L en={2.0} size={64} color={COLOR.teal} peso={600}>y lleva</L>
          <L en={2.22} size={240} color={COLOR.teal} peso={900}>3 AÑOS</L>
          <L en={2.82} size={64} color={COLOR.teal} peso={600}>contigo.</L>
        </Bloque>
      </Escena>
      <Escena ini={3.68} fin={5.86} fondo="mesa" lx={0.5} ly={0.7}>
        <Carta escala={0.62} x={250} y={830} rot={-5} />
        <Bloque top={300}>
          <L en={3.7} size={62} color={CREMA_T} peso={600}>Si la despides mañana</L>
          <L en={4.6} size={120} color={COLOR.alerta} peso={900}>SIN JUSTA</L>
          <L en={4.9} size={120} color={COLOR.alerta} peso={900}>CAUSA</L>
        </Bloque>
      </Escena>
      <Escena ini={5.86} fin={7.98} fondo="crema">
        <Bloque top={440}>
          <L en={5.9} size={74} color={COLOR.teal} peso={600}>¿Cuánta plata</L>
          <L en={6.46} size={74} color={COLOR.teal} peso={600}>necesitas</L>
          <L en={7.04} size={200} color={COLOR.teal} peso={900}>ESE DÍA?</L>
        </Bloque>
      </Escena>

      {/* 2. la cuenta, renglón por renglón */}
      <Escena ini={7.98} fin={25.38} fondo="mesa" lx={0.5} ly={0.4}>
        <Tirilla />
        {t < 9.2 && (
          <Bloque top={1250}>
            <L en={8.02} size={96} color={COLOR.dorado} serif italic peso={700}>Hagamos la cuenta.</L>
          </Bloque>
        )}
      </Escena>

      {/* 3. comparación tangible */}
      <Escena ini={25.38} fin={27.3} fondo="crema">
        <Bloque top={470}>
          <L en={25.4} size={64} color={COLOR.teal} peso={600}>Más de</L>
          <L en={25.82} size={230} color={COLOR.teal} peso={900}>4 MESES</L>
          <L en={26.52} size={64} color={COLOR.teal} peso={600}>de su salario</L>
        </Bloque>
      </Escena>
      <Escena ini={27.3} fin={29.06} fondo="mesa" lx={0.5} ly={0.65}>
        <Carta escala={0.6} x={260} y={860} rot={4} />
        <Bloque top={330}>
          <L en={27.32} size={64} color={CREMA_T} peso={600}>por una carta de</L>
          <L en={28.42} size={150} color={COLOR.dorado} peso={900}>UNA PÁGINA</L>
        </Bloque>
      </Escena>

      {/* 4. el giro honesto */}
      <Escena ini={29.06} fin={32.14} fondo="noche">
        <Bloque top={420}>
          <L en={29.08} size={230} color={COLOR.alerta} peso={900}>OJO</L>
          <L en={30.08} size={66} color={CREMA_T} peso={600}>la liquidación</L>
          <L en={30.76} size={66} color={CREMA_T} peso={600}>se la debías</L>
          <L en={31.36} size={120} color={CREMA_T} peso={900}>IGUAL</L>
        </Bloque>
      </Escena>
      <Escena ini={32.14} fin={35.02} fondo="crema">
        <Bloque top={470}>
          <L en={32.16} size={64} color={COLOR.teal} peso={600}>Lo que te cuesta</L>
          <L en={32.78} size={92} color={COLOR.teal} peso={900}>LA DECISIÓN</L>
          <L en={33.8} size={170} color={COLOR.teal} peso={900} caja={COLOR.dorado}>{cop(siete)}</L>
        </Bloque>
      </Escena>

      {/* 5. autoridad + servicios */}
      <Escena ini={35.02} fin={42.16} fondo="noche">
        <Bloque top={300}>
          <Img src={staticFile('arca/emblema-claro.png')} style={{height: 100, marginBottom: 20}} />
          <L en={35.04} size={60} color={COLOR.dorado} serif italic peso={400}>Esta cuenta la hacemos</L>
          <L en={36.02} size={60} color={COLOR.dorado} serif italic peso={400}>antes de cada despido.</L>
        </Bloque>
        <div style={{position: 'absolute', top: 800, left: 110, right: 110}}>
          {servicios.map((s, i) => {
            const p = tramo(t, s.en - 0.1, s.en + 0.25);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, padding: '24px 0', borderBottom: '1px solid rgba(198,169,107,.3)',
                opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
                <Check p={tramo(t, s.en, s.en + 0.3)} size={66} />
                <span style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 44, color: CREMA_T}}>{s.txt}</span>
              </div>
            );
          })}
        </div>
      </Escena>

      {/* 6. palabra clave */}
      <Escena ini={42.16} fin={FIN_VOZ + 0.3} fondo="crema">
        <Bloque top={470}>
          <L en={42.18} size={74} color={COLOR.teal} peso={600}>Escríbenos</L>
          <L en={42.68} size={200} color={COLOR.teal} peso={900} caja={COLOR.dorado}>CUENTA</L>
          <L en={43.36} size={58} color={COLOR.teal} peso={600}>y la hacemos con tus números.</L>
        </Bloque>
      </Escena>

      <Firma desde={3.7} hasta={42.1} y={1385} />
      <SubFijo desde={8.0} hasta={25.3} />
      <Pelicula grano={0.06} />
      <Cierre desde={FIN_VOZ + 0.3} />
    </AbsoluteFill>
  );
};
