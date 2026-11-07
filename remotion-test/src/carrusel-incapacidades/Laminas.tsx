import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, SERIF} from './tema';
import {Aparece, Blob, FiloOro, Globo, Hero, Marco, Pastilla, Titular} from './Base';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// 1. Gancho: titular a la izquierda, hero que se sale del panel, panel navy con calendario
export const L1: React.FC = () => {
  const f = useCurrentFrame();
  const barra = interpolate(f, [70, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const celdas: (number | null)[] = [null, ...Array.from({length: 31}, (_, i) => i + 1)];
  return (
    <Marco n={1} marca="2026" modo="oscuro">
      <FiloOro d={0} t="ALERTA DE TEMPORADA" />
      <div style={{height: 26}} />
      <div style={{width: 600}}><Titular modo="oscuro" size={78} lineas={['Diciembre trae', 'un riesgo que', 'su nómina', ['no ve.', 'oro']]} /></div>
      <Blob d={26} style={{left: 0, right: 0, top: 440, bottom: 0, padding: '34px 40px'}} radio="56px 56px 56px 190px" color="#141C29">
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: SERIF, fontWeight: 700, fontSize: 32, color: C.hueso}}><span>Diciembre</span><span style={{color: C.oroClaro}}>2026</span></div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginTop: 8, textAlign: 'center', fontSize: 24, fontWeight: 600, color: C.hueso, position: 'relative'}}>
          {DIAS.map((d, i) => <div key={i} style={{color: C.oroClaro, fontSize: 18, letterSpacing: 3}}>{d}</div>)}
          {celdas.map((n, i) => (
            <div key={i} style={{height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {n && <div style={{width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: n === 8 || n === 25 ? C.oro : 'transparent', color: n === 8 || n === 25 ? '#fff' : C.hueso}}>{n}</div>}
            </div>
          ))}
          <div style={{position: 'absolute', left: `${(1 / 7) * 100}%`, top: 28 + 44 - 2, width: `${(4 / 7) * 100 * barra}%`, height: 44, borderRadius: 22, background: `${C.rojo}55`, border: `3px solid ${C.rojo}`, boxSizing: 'border-box'}} />
        </div>
        <div style={{marginTop: 8, fontSize: 25, fontWeight: 600, color: '#F08A92', opacity: barra}}>¿Incapacidad pegada al festivo?</div>
      </Blob>
      <Hero src="o1" w={470} style={{right: -190, top: 20}} d={10} rot={4} />
    </Marco>
  );
};

// 2. Señales: titular pequeño, hero lupa, panel con asimetría abajo-derecha
const senales = ['Cae pegada a un festivo', 'Llega sin soporte de la EPS', 'Sellos o fechas que no cuadran'];
export const L2: React.FC = () => (
  <Marco n={2} marca="¿?" modo="claro">
    <FiloOro d={0} t="SEÑALES" />
    <div style={{height: 26}} />
    <div style={{width: 560}}><Titular modo="claro" size={76} lineas={['¿Es real la', ['incapacidad?', 'oro']]} /></div>
    <Aparece d={24}><div style={{marginTop: 16, width: 460, fontSize: 25, color: C.taupe, lineHeight: 1.3}}>Tres señales que justifican revisarla antes de pagarla.</div></Aparece>
    <Blob d={20} color={C.navy} radio="56px 56px 190px 56px" style={{left: 0, right: 0, top: 380, bottom: 0, padding: '44px 46px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        {senales.map((t, i) => (
          <Aparece key={t} d={40 + i * 16} x={-60} y={0}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: C.oroClaro, width: 84}}>0{i + 1}</div>
              <div style={{fontSize: 36, fontWeight: 600, color: C.hueso, lineHeight: 1.15, width: 640}}>{t}</div>
            </div>
          </Aparece>
        ))}
      </div>
      <div style={{position: 'absolute', left: 46, bottom: 44}}><Pastilla t="Son alertas, no pruebas." d={96} oro /></div>
    </Blob>
    <Hero src="o2" w={500} style={{right: -110, top: -60}} d={12} rot={-6} />
  </Marco>
);

// 3. NO: globo con pregunta, pastillas blancas, hero mazo que se sale
const nos = ['Despedir de inmediato', 'Acusar sin pruebas', 'Descontar sin proceso'];
export const L3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Marco n={3} marca="NO" modo="oscuro">
      <Globo style={{left: 0, top: 0, width: 640}} cola="izq" d={4}>¿Qué <i style={{color: C.oro}}>no</i> debe hacer?</Globo>
      <div style={{position: 'absolute', top: 150, left: 0, width: 590, display: 'flex', flexDirection: 'column', gap: 22}}>
        {nos.map((t, i) => {
          const tach = interpolate(f, [52 + i * 18, 64 + i * 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <Aparece key={t} d={20 + i * 12} x={-80} y={0}>
              <div style={{background: C.hueso, borderRadius: 70, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 22, color: C.navy}}>
                <div style={{width: 58, height: 58, borderRadius: '50%', background: C.rojo, color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: `scale(${0.75 + 0.25 * tach})`}}>✕</div>
                <div style={{position: 'relative', fontSize: 33, fontWeight: 700, lineHeight: 1.1}}>{t}<div style={{position: 'absolute', left: 0, top: '56%', height: 5, width: `${tach * 100}%`, background: C.rojo}} /></div>
              </div>
            </Aparece>
          );
        })}
      </div>
      <Blob d={60} color="#141C29" radio="56px 56px 56px 56px" style={{left: 0, width: 590, top: 560, bottom: 0, padding: '34px 40px'}}>
        <div style={{fontSize: 32, color: C.hueso, lineHeight: 1.3, fontFamily: SERIF}}>El <b style={{color: C.oroClaro}}>debido proceso</b> protege a la empresa.</div>
        <div style={{position: 'absolute', left: 40, bottom: 34}}><Pastilla t="Verifique antes de actuar." d={86} /></div>
      </Blob>
      <Hero src="o3" w={540} style={{right: -200, top: 250}} d={24} rot={-4} />
    </Marco>
  );
};

// 4. SÍ: panel verde con pestaña, titular dentro, pasos, hero que se sale por abajo-derecha
const pasos = ['Verifique con la EPS o IPS que la emitió', 'Pida el soporte original', 'Cite a descargos por escrito'];
export const L4: React.FC = () => {
  const f = useCurrentFrame();
  const alto = interpolate(f, [30, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Marco n={4} marca="SÍ" modo="claro">
      <Blob d={4} color={C.verde} tab="PASO A PASO" radio="0 56px 56px 190px" style={{left: 0, right: 0, top: 58, bottom: 0, padding: '46px 46px'}}>
        <div style={{width: 560}}><Titular modo="oscuro" size={70} lineas={['Lo que', ['sí debe hacer.', 'oro']]} d={14} /></div>
        <div style={{position: 'relative', marginTop: 36, width: 560}}>
          <div style={{position: 'absolute', left: 27, top: 30, width: 4, height: 330 * alto, background: C.oro}} />
          {pasos.map((t, i) => (
            <Aparece key={t} d={40 + i * 20} x={-50} y={0} style={{marginBottom: i < 2 ? 40 : 0}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
                <div style={{width: 58, height: 58, borderRadius: '50%', background: C.oro, color: C.hueso, fontFamily: SERIF, fontWeight: 900, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1}}>{i + 1}</div>
                <div style={{fontSize: 31, fontWeight: 600, color: C.hueso, lineHeight: 1.18}}>{t}</div>
              </div>
            </Aparece>
          ))}
        </div>
        <div style={{position: 'absolute', left: 46, bottom: 40}}><Pastilla t="Todo por escrito, con fecha." d={96} oro /></div>
      </Blob>
      <Hero src="o4" w={520} style={{right: -110, bottom: -70}} d={30} rot={6} />
    </Marco>
  );
};

// 5. Consecuencias: titular, balanza hero, panel con dos tarjetas anidadas
export const L5: React.FC = () => (
  <Marco n={5} marca="Ley" modo="verde">
    <FiloOro d={0} t="RIESGOS" />
    <div style={{height: 26}} />
    <div style={{width: 900}}><Titular modo="verde" size={78} lineas={['Si es falsa,', ['hay consecuencias.', 'oro']]} /></div>
    <Blob d={20} color="#0F2F2A" radio="190px 56px 56px 56px" style={{left: 0, right: 0, top: 400, bottom: 0, padding: '40px 40px'}}>
      <div style={{position: 'absolute', left: 40, right: 40, bottom: 34, display: 'flex', gap: 22}}>
        {[['LABORAL', 'Puede ser justa causa de despido'], ['PENAL', 'Puede configurar falsedad en documento']].map(([a, b], i) => (
          <Aparece key={a} d={50 + i * 14} style={{flex: 1}}>
            <div style={{background: C.hueso, color: C.navy, borderRadius: 34, padding: '24px 26px', height: 180}}>
              <div style={{fontSize: 20, letterSpacing: 6, color: C.oro, fontWeight: 700}}>{a}</div>
              <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 30, lineHeight: 1.15, marginTop: 8}}>{b}</div>
            </div>
          </Aparece>
        ))}
      </div>
    </Blob>
    <Hero src="o5" w={400} style={{left: 250, top: 200}} d={14} />
  </Marco>
);

// 6. Cierre: panel navy con titular, hero teléfono que se sale, botón dorado
export const L6: React.FC = () => {
  const f = useCurrentFrame();
  const pulso = 1 + 0.025 * Math.sin(f / 6);
  return (
    <Marco n={6} marca="Hoy" modo="oscuro">
      <Blob d={4} color="#141C29" tab="SU SIGUIENTE PASO" radio="0 56px 56px 190px" style={{left: 0, right: 0, top: 58, bottom: 0, padding: '46px 46px'}}>
        <div style={{width: 560}}><Titular modo="oscuro" size={78} lineas={['Prepare su', ['empresa hoy.', 'oro']]} d={14} /></div>
        <Aparece d={34}><div style={{marginTop: 28, fontSize: 29, lineHeight: 1.3, width: 480, color: C.hueso}}>Protocolo de verificación, formatos y proceso disciplinario listos para la temporada.</div></Aparece>
        <Aparece d={58} style={{position: 'absolute', left: 46, bottom: 120}}>
          <div style={{transform: `scale(${pulso})`, transformOrigin: 'left center', background: C.oro, color: C.navyOsc, padding: '22px 36px', borderRadius: 60, fontSize: 30, fontWeight: 700}}>Escríbanos por WhatsApp</div>
        </Aparece>
        <div style={{position: 'absolute', left: 46, bottom: 40}}><Pastilla t="Guárdelo para su equipo" d={80} style={{fontSize: 24}} /></div>
      </Blob>
      <Hero src="o6" w={360} style={{right: -60, top: 10}} d={12} rot={5} />
    </Marco>
  );
};

export const LAMINAS = [L1, L2, L3, L4, L5, L6];
