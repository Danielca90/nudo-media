import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from './tema';
import {Marco, Revela, Titulo, useAp} from './Base';

const Pill: React.FC<{t: string; bg?: string; color?: string}> = ({t, bg = C.rojo, color = '#fff'}) => (
  <span style={{display: 'inline-block', background: bg, color, padding: '10px 24px', borderRadius: 40, fontSize: 28, fontWeight: 800, letterSpacing: 2}}>{t}</span>
);

// 1. Gancho
export const L1: React.FC = () => {
  const f = useCurrentFrame();
  const calendario = useAp(26);
  const dias = Array.from({length: 14}).map((_, i) => i + 1);
  return (
    <Marco n={1} acento="rojo">
      <Revela d={0}><Pill t="ALERTA DICIEMBRE" /></Revela>
      <div style={{height: 36}} />
      <Titulo lineas={['Diciembre trae', 'un riesgo que', 'su nómina', 'no ve.']} resaltar={[3]} size={112} d={4} />
      <div style={{marginTop: 50, opacity: calendario, transform: `scale(${0.92 + 0.08 * calendario})`, transformOrigin: 'left top'}}>
        <div style={{fontSize: 28, color: C.gris, letterSpacing: 4, marginBottom: 16}}>DICIEMBRE · PUENTES Y FESTIVOS</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, width: 900}}>
          {dias.map((d, i) => {
            const marca = [6, 7, 8, 9].includes(i) ? Math.max(0, Math.min(1, (f - 60 - (i - 6) * 8) / 8)) : 0;
            return (
              <div key={d} style={{width: 58, height: 58, borderRadius: 10, background: `rgba(255,255,255,${0.08})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, position: 'relative', color: marca ? '#fff' : C.gris, boxShadow: marca ? `0 0 0 3px ${C.rojoClaro}` : 'none'}}>
                {d}
                {marca > 0 && <div style={{position: 'absolute', inset: 0, borderRadius: 10, background: C.rojo, opacity: marca * 0.85, zIndex: -0, mixBlendMode: 'multiply'}} />}
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 18, fontSize: 30, fontWeight: 700, color: C.rojoClaro, opacity: interpolate(f, [90, 105], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>Incapacidades que “coinciden” con el puente.</div>
      </div>
    </Marco>
  );
};

// 2. Señales
const filas = [
  ['01', 'Cae justo antes o después de un festivo'],
  ['02', 'Llega tarde y sin soporte de la EPS'],
  ['03', 'Sellos, firmas o fechas que no cuadran'],
];
export const L2: React.FC = () => (
  <Marco n={2}>
    <Titulo lineas={['3 señales', 'para revisar.']} resaltar={[0]} size={104} />
    <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 26}}>
      {filas.map(([n, t], i) => (
        <Revela key={n} d={24 + i * 18} y={60}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, background: '#ffffff12', borderLeft: `8px solid ${C.dorado}`, borderRadius: 14, padding: '30px 34px'}}>
            <div style={{fontSize: 64, fontWeight: 900, color: C.dorado, width: 96}}>{n}</div>
            <div style={{fontSize: 40, fontWeight: 700, lineHeight: 1.15}}>{t}</div>
          </div>
        </Revela>
      ))}
    </div>
    <Revela d={90}><div style={{marginTop: 34, fontSize: 30, color: C.doradoClaro}}>Son alertas, no pruebas. No acuse sin verificar.</div></Revela>
  </Marco>
);

// 3. Qué NO hacer
const nos = ['Despedir de inmediato', 'Acusar sin pruebas', 'Descontar sin proceso'];
export const L3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Marco n={3} acento="rojo">
      <Titulo lineas={['Lo que NO', 'debe hacer.']} resaltar={[0]} size={104} />
      <div style={{marginTop: 54, display: 'flex', flexDirection: 'column', gap: 30}}>
        {nos.map((t, i) => {
          const tach = interpolate(f, [40 + i * 22, 52 + i * 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <Revela key={t} d={14 + i * 14}>
              <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
                <div style={{width: 84, height: 84, borderRadius: '50%', background: C.rojo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900, transform: `scale(${0.7 + 0.3 * tach})`}}>✕</div>
                <div style={{position: 'relative', fontSize: 50, fontWeight: 800}}>
                  {t}
                  <div style={{position: 'absolute', left: 0, top: '54%', height: 6, width: `${tach * 100}%`, background: C.rojoClaro, borderRadius: 3}} />
                </div>
              </div>
            </Revela>
          );
        })}
      </div>
      <Revela d={100}><div style={{marginTop: 50, fontSize: 32, color: C.doradoClaro}}>El debido proceso protege a la empresa.</div></Revela>
    </Marco>
  );
};

// 4. Qué hacer: pasos con línea de tiempo
const pasos = ['Verifique con la EPS o IPS emisora', 'Pida el soporte original', 'Cite a descargos por escrito'];
export const L4: React.FC = () => {
  const f = useCurrentFrame();
  const alto = interpolate(f, [24, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Marco n={4} acento="pino">
      <Titulo lineas={['Lo que SÍ', 'debe hacer.']} resaltar={[0]} size={104} />
      <div style={{marginTop: 54, position: 'relative', paddingLeft: 40}}>
        <div style={{position: 'absolute', left: 38, top: 20, width: 6, height: 480 * alto, background: C.dorado, borderRadius: 3}} />
        {pasos.map((t, i) => (
          <Revela key={t} d={26 + i * 24} style={{marginBottom: 56}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
              <div style={{width: 76, height: 76, borderRadius: '50%', background: C.dorado, color: C.noche, fontSize: 44, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -3, boxShadow: `0 0 30px ${C.dorado}66`}}>{i + 1}</div>
              <div style={{fontSize: 44, fontWeight: 800, lineHeight: 1.15, width: 700}}>{t}</div>
            </div>
          </Revela>
        ))}
      </div>
    </Marco>
  );
};

// 5. Consecuencia
export const L5: React.FC = () => {
  const f = useCurrentFrame();
  const sello = useAp(50, 9);
  return (
    <Marco n={5}>
      <Titulo lineas={['Si es falsa,', 'hay consecuencias.']} resaltar={[1]} size={92} />
      <div style={{marginTop: 54, display: 'flex', gap: 28}}>
        {[['Laboral', 'Puede ser justa causa de despido'], ['Penal', 'Puede configurar falsedad en documento']].map(([a, b], i) => (
          <Revela key={a} d={22 + i * 18} style={{flex: 1}}>
            <div style={{background: '#ffffff12', border: `2px solid ${C.dorado}66`, borderRadius: 18, padding: '36px 30px', height: 330}}>
              <div style={{fontSize: 30, letterSpacing: 5, color: C.dorado, fontWeight: 800}}>{a.toUpperCase()}</div>
              <div style={{marginTop: 20, fontSize: 40, fontWeight: 800, lineHeight: 1.15}}>{b}</div>
            </div>
          </Revela>
        ))}
      </div>
      <div style={{position: 'absolute', right: 10, bottom: 10, transform: `rotate(-10deg) scale(${1.6 - 0.6 * sello})`, opacity: sello, border: `7px solid ${C.rojoClaro}`, color: C.rojoClaro, padding: '12px 28px', borderRadius: 12, fontSize: 54, fontWeight: 900, letterSpacing: 4}}>CON PRUEBAS</div>
      <Revela d={90}><div style={{marginTop: 36, fontSize: 30, color: C.doradoClaro, width: 600}}>Siempre después de verificar y escuchar al trabajador.</div></Revela>
    </Marco>
  );
};

// 6. Cierre
export const L6: React.FC = () => {
  const f = useCurrentFrame();
  const pulso = 1 + 0.03 * Math.sin(f / 6);
  return (
    <Marco n={6} acento="rojo">
      <Revela d={0}><Pill t="ANTES DEL 15 DE DICIEMBRE" bg={C.dorado} color={C.noche} /></Revela>
      <div style={{height: 40}} />
      <Titulo lineas={['Prepare su', 'empresa hoy.']} resaltar={[1]} size={112} d={6} />
      <Revela d={30}><div style={{marginTop: 40, fontSize: 40, lineHeight: 1.25, color: C.nieve, width: 860}}>Protocolo de verificación, formatos y proceso disciplinario listos para la temporada.</div></Revela>
      <Revela d={56} style={{marginTop: 60}}>
        <div style={{display: 'inline-block', transform: `scale(${pulso})`, transformOrigin: 'left center', background: C.dorado, color: C.noche, padding: '30px 52px', borderRadius: 18, fontSize: 44, fontWeight: 900}}>Escríbanos por WhatsApp</div>
      </Revela>
      <Revela d={76}><div style={{marginTop: 34, fontSize: 30, color: C.doradoClaro}}>Guárdelo y compártalo con su equipo de RR. HH.</div></Revela>
    </Marco>
  );
};

export const LAMINAS = [L1, L2, L3, L4, L5, L6];
