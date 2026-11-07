import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C, SERIF} from '../carrusel-incapacidades/tema';
import {Aparece, Globo, Hero} from '../carrusel-incapacidades/Base';
import {Aviso, Chip, Escena, Grande, LogoCierre, Subs, s2f} from './comun';
import subs from './v3.subs.json';

const CLAVES = ['prueba?', 'grave.', 'escrito', 'trabajo.'];
const PASOS = [{t: 'Reglamento', ok: 6.88}, {t: 'Consentimiento', ok: 9.84}, {t: 'Prueba del efecto', ok: 12.72}];

// Marcador "¿pasa la prueba?": cada requisito se marca al cumplirse
const Tracker: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = interpolate(f, [s2f(2.9), s2f(3.2)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1470, display: 'flex', gap: 16, opacity: entra}}>
      {PASOS.map((p, i) => {
        const sp = spring({frame: f - s2f(p.ok), fps, config: {damping: 10, stiffness: 200}});
        const ok = f >= s2f(p.ok);
        const sobreClaro = f >= s2f(6.9) && f < s2f(9.9);
        const tinta = sobreClaro ? C.navy : '#ffffffcc';
        return (
          <div key={i} style={{flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 40, border: `3px solid ${ok ? C.oro : sobreClaro ? `${C.navy}66` : '#ffffff55'}`, background: ok ? C.oro : 'transparent', color: ok ? C.navyOsc : tinta, fontSize: 26, fontWeight: 700, transform: `scale(${ok ? 0.9 + 0.1 * sp : 1})`}}>
            <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 34}}>{ok ? '✓' : i + 1}</span>
            <span style={{lineHeight: 1.05}}>{p.t}</span>
          </div>
        );
      })}
    </div>
  );
};

const Gancho: React.FC = () => (
  <AbsoluteFill>
    <Globo style={{left: 70, top: 240, width: 940}} cola="izq" d={0} size={64}>¿Pasa la <i style={{color: C.oro}}>prueba</i>?</Globo>
    <Grande t="Alcohol" size={165} d={4} color={C.hueso} style={{left: 80, top: 410}} />
    <Grande t="y drogas" size={165} d={7} italic color={C.oroClaro} style={{left: 80, top: 545}} />
    <Hero src="o10" w={780} d={10} rot={-3} style={{left: 150, top: 1000}} />
  </AbsoluteFill>
);

const Paso: React.FC<{n: string; t: string; nota: string; icono: string; d: number; claro?: boolean}> = ({n, t, nota, icono, d, claro}) => (
  <AbsoluteFill>
    <Grande t={n} size={300} d={0} italic color={claro ? C.oroTxt : C.oroClaro} style={{left: 80, top: 230}} />
    <Chip t={t} nota={nota} d={d} top={990} icono={icono} grande oscuro={claro} />
  </AbsoluteFill>
);

const Cierre: React.FC = () => (
  <AbsoluteFill>
    <Grande t="Revísela" size={150} d={0} color={C.hueso} style={{left: 80, top: 250}} />
    <Grande t="con nosotros." size={150} d={4} italic color={C.oroClaro} style={{left: 80, top: 400}} />
    <LogoCierre top={1010} d={12} />
    <Aviso />
  </AbsoluteFill>
);

export const V3Alcohol: React.FC = () => (
  <AbsoluteFill style={{background: C.navyOsc}}>
    <Escena desde={0} hasta={2.95} modo="oscuro"><Gancho /></Escena>
    <Escena desde={2.95} hasta={6.9} modo="verde" marca="1"><Paso n="UNO" t="Falta grave" nota="Tipificada en el reglamento" icono="1" d={s2f(5.84 - 2.95)} /></Escena>
    <Escena desde={6.9} hasta={9.9} modo="claro" marca="2"><Paso claro n="DOS" t="Consentimiento" nota="Escrito, antes de la prueba" icono="2" d={s2f(7.72 - 6.9)} /></Escena>
    <Escena desde={9.9} hasta={12.75} modo="oscuro" marca="3"><Paso n="TRES" t="Demostrar" nota="Cómo afectó el trabajo" icono="3" d={s2f(10.56 - 9.9)} /></Escena>
    <Escena desde={12.75} hasta={15} modo="oscuro"><Cierre /></Escena>
    <Tracker />
    <Subs caps={subs as unknown as Caption[]} claves={CLAVES} />
    <Audio src={staticFile('videos/voz-v3.mp3')} />
  </AbsoluteFill>
);
