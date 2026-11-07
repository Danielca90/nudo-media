import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, SERIF} from './tema';
import {Aparece, Balanza, Bola, FiloOro, Marco, Mazo, Panel, Titular, Lupa, useAp} from './Base';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// 1. Gancho
export const L1: React.FC = () => {
  const f = useCurrentFrame();
  const barra = interpolate(f, [70, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const celdas: (number | null)[] = [null, ...Array.from({length: 31}, (_, i) => i + 1)];
  return (
    <Marco n={1} modo="oscuro">
      <FiloOro d={0} />
      <div style={{height: 26}} />
      <Titular modo="oscuro" size={104} lineas={['Diciembre trae', 'un riesgo que', ['su nómina no ve.', 'oro']]} />
      <Panel color="#EDEDEB" d={30} style={{marginTop: 54, padding: '30px 34px', color: C.navy, position: 'relative'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SERIF, fontWeight: 700, fontSize: 34, marginBottom: 14}}><span>Diciembre</span><span style={{color: C.oro}}>2026</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 4, textAlign: 'center', fontSize: 26, fontWeight: 600, position: 'relative'}}>
          {DIAS.map((d, i) => <div key={i} style={{color: C.taupe, fontSize: 20, letterSpacing: 3}}>{d}</div>)}
          {celdas.map((n, i) => (
            <div key={i} style={{height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {n && <div style={{width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: n === 8 || n === 25 ? C.oro : 'transparent', color: n === 8 || n === 25 ? '#fff' : C.navy}}>{n}</div>}
            </div>
          ))}
          {/* banda de incapacidad pegada al festivo 8 (martes) */}
          <div style={{position: 'absolute', left: `${(1 / 7) * 100}%`, top: 64 + 56 * 1 - 14, width: `${(4 / 7) * 100 * barra}%`, height: 46, borderRadius: 23, background: C.rojo, opacity: 0.28, border: `3px solid ${C.rojo}`, boxSizing: 'border-box'}} />
        </div>
        <div style={{marginTop: 12, fontSize: 26, fontWeight: 600, color: C.rojo, opacity: barra}}>¿Incapacidad pegada al festivo?</div>
      </Panel>
      <div style={{position: 'absolute', right: -30, top: -70}}><Aparece d={14} y={-120}><Bola size={150} /></Aparece></div>
    </Marco>
  );
};

// 2. Señales
const senales = ['Cae pegada a un festivo', 'Llega sin soporte de la EPS', 'Sellos o fechas que no cuadran'];
export const L2: React.FC = () => (
  <Marco n={2} modo="claro">
    <FiloOro d={0} />
    <div style={{height: 26}} />
    <Titular modo="claro" size={100} lineas={['¿Es real la', ['incapacidad?', 'oro']]} />
    <Panel d={26} style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 30, padding: '50px 46px'}}>
      {senales.map((t, i) => (
        <Aparece key={t} d={40 + i * 16} x={-60} y={0}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 62, color: C.oroClaro, width: 88}}>0{i + 1}</div>
            <div style={{fontSize: 40, fontWeight: 600, color: C.hueso, lineHeight: 1.15, width: 470}}>{t}</div>
          </div>
        </Aparece>
      ))}
      <Aparece d={96}><div style={{fontSize: 27, color: C.oroClaro, borderTop: `1px solid ${C.oro}88`, paddingTop: 22}}>Son alertas para revisar, no pruebas.</div></Aparece>
    </Panel>
    <div style={{position: 'absolute', right: -50, top: 420}}><Aparece d={70} y={30}><Lupa size={230} /></Aparece></div>
  </Marco>
);

// 3. NO
const nos = ['Despedir de inmediato', 'Acusar sin pruebas', 'Descontar sin proceso'];
export const L3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Marco n={3} modo="oscuro">
      <FiloOro d={0} />
      <div style={{height: 26}} />
      <Titular modo="oscuro" size={100} lineas={['Lo que', ['no debe hacer.', 'oro']]} />
      <div style={{marginTop: 46, display: 'flex', flexDirection: 'column', gap: 24}}>
        {nos.map((t, i) => {
          const tach = interpolate(f, [48 + i * 18, 60 + i * 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <Aparece key={t} d={22 + i * 12} x={80} y={0}>
              <div style={{background: C.hueso, borderRadius: 30, padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 24, color: C.navy}}>
                <div style={{width: 64, height: 64, borderRadius: '50%', background: C.rojo, color: '#fff', fontSize: 38, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.75 + 0.25 * tach})`}}>✕</div>
                <div style={{position: 'relative', fontSize: 38, fontWeight: 700}}>{t}<div style={{position: 'absolute', left: 0, top: '56%', height: 5, width: `${tach * 100}%`, background: C.rojo}} /></div>
              </div>
            </Aparece>
          );
        })}
      </div>
      <div style={{position: 'absolute', right: -10, bottom: -20}}><Aparece d={70} y={40}><Mazo size={330} golpe={72} /></Aparece></div>
      <Aparece d={90} style={{position: 'absolute', left: 0, bottom: 10}}><div style={{fontSize: 28, color: C.oroClaro, width: 520, lineHeight: 1.3}}>El debido proceso protege a la empresa.</div></Aparece>
    </Marco>
  );
};

// 4. SÍ
const pasos = ['Verifique con la EPS o IPS que la emitió', 'Pida el soporte original', 'Cite a descargos por escrito'];
export const L4: React.FC = () => {
  const f = useCurrentFrame();
  const alto = interpolate(f, [30, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Marco n={4} modo="claro">
      <FiloOro d={0} />
      <div style={{height: 26}} />
      <Titular modo="claro" size={100} lineas={['Lo que', ['sí debe hacer.', 'oro']]} />
      <Panel color={C.verde} d={24} style={{marginTop: 46, padding: '70px 46px', position: 'relative'}}>
        <div style={{position: 'absolute', left: 80, top: 100, width: 5, height: 395 * alto, background: C.oro}} />
        {pasos.map((t, i) => (
          <Aparece key={t} d={40 + i * 22} x={-50} y={0} style={{marginBottom: i < 2 ? 70 : 0}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
              <div style={{width: 70, height: 70, borderRadius: '50%', background: C.oro, color: C.hueso, fontFamily: SERIF, fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1}}>{i + 1}</div>
              <div style={{fontSize: 42, fontWeight: 600, color: C.hueso, lineHeight: 1.18}}>{t}</div>
            </div>
          </Aparece>
        ))}
      </Panel>
    </Marco>
  );
};

// 5. Consecuencias
export const L5: React.FC = () => (
  <Marco n={5} modo="verde">
    <FiloOro d={0} />
    <div style={{height: 26}} />
    <Titular modo="verde" size={92} lineas={['Si es falsa,', ['hay consecuencias.', 'oro']]} />
    <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}><Aparece d={10} y={50}><Balanza size={420} /></Aparece></div>
    <div style={{display: 'flex', gap: 24, marginTop: 6}}>
      {[['LABORAL', 'Puede ser justa causa de despido'], ['PENAL', 'Puede configurar falsedad en documento']].map(([a, b], i) => (
        <Aparece key={a} d={50 + i * 14} style={{flex: 1}}>
          <div style={{background: C.hueso, color: C.navy, borderRadius: 28, padding: '26px 28px', height: 190}}>
            <div style={{fontSize: 21, letterSpacing: 6, color: C.oro, fontWeight: 700}}>{a}</div>
            <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 32, lineHeight: 1.15, marginTop: 10}}>{b}</div>
          </div>
        </Aparece>
      ))}
    </div>
  </Marco>
);

// 6. Cierre
export const L6: React.FC = () => {
  const f = useCurrentFrame();
  const pulso = 1 + 0.025 * Math.sin(f / 6);
  return (
    <Marco n={6} modo="oscuro">
      <FiloOro d={0} />
      <div style={{height: 26}} />
      <Titular modo="oscuro" size={108} lineas={['Prepare su', ['empresa hoy.', 'oro']]} />
      <Aparece d={30}><div style={{marginTop: 38, fontSize: 36, lineHeight: 1.3, width: 640}}>Protocolo de verificación, formatos y proceso disciplinario listos para la temporada.</div></Aparece>
      <Aparece d={56} style={{marginTop: 54}}>
        <div style={{display: 'inline-block', transform: `scale(${pulso})`, transformOrigin: 'left center', background: C.oro, color: C.navyOsc, padding: '28px 50px', borderRadius: 60, fontSize: 40, fontWeight: 700}}>Escríbanos por WhatsApp</div>
      </Aparece>
      <Aparece d={76}><div style={{marginTop: 28, fontSize: 27, color: C.oroClaro}}>Guárdelo y compártalo con su equipo de RR. HH.</div></Aparece>
      <div style={{position: 'absolute', right: 10, top: -90}}><Aparece d={6} y={-140}><Bola size={210} fase={1} /></Aparece></div>
    </Marco>
  );
};

export const LAMINAS = [L1, L2, L3, L4, L5, L6];
