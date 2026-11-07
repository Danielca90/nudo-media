import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C, SERIF} from '../carrusel-incapacidades/tema';
import {Aparece, Hero, useAp} from '../carrusel-incapacidades/Base';
import {Aviso, Boton, Chip, Escena, Grande, LogoCierre, Subs, s2f} from './comun';
import subs from './v2.subs.json';

const CLAVES = ['error.', '90 %.', 'compensatorio.', 'ocasional', 'nómina']; 

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = s2f(1.95);
  const x = spring({frame: f - t, fps, config: {damping: 8, stiffness: 220}});
  return (
    <AbsoluteFill>
      <Grande t="¿Domingo =" size={170} d={0} color={C.hueso} style={{left: 80, top: 250}} />
      <Grande t="día normal?" size={170} d={3} italic color={C.oroClaro} style={{left: 80, top: 430}} />
      <Aparece d={4} x={300} y={0} style={{position: 'absolute', left: 110, top: 960, width: 860, transform: 'rotate(-3deg)'}}>
        <Img src={staticFile('objetos/o8card.jpg')} style={{width: '100%', borderRadius: 50, display: 'block', boxShadow: '0 40px 80px #00000066'}} />
      </Aparece>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1110, display: 'flex', justifyContent: 'center', opacity: x, transform: `rotate(-6deg) scale(${1.8 - 0.8 * x})`}}>
        <div style={{border: `14px solid ${C.alerta}`, color: C.alerta, padding: '10px 60px', borderRadius: 20, fontSize: 170, fontWeight: 900, letterSpacing: 8}}>ERROR</div>
      </div>
    </AbsoluteFill>
  );
};

const Recargo: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [s2f(4.72 - 2.4), s2f(5.4 - 2.4)], [0, 90], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const p = useAp(s2f(5.4 - 2.4), 10, 160);
  return (
    <AbsoluteFill>
      <Aparece d={0} style={{position: 'absolute', left: 90, top: 270, fontSize: 46, letterSpacing: 8, fontWeight: 700, color: C.oroClaro}}>RECARGO DOMINICAL</Aparece>
      <div style={{position: 'absolute', left: 70, top: 300, fontFamily: SERIF, fontWeight: 900, fontSize: 420, lineHeight: 1, letterSpacing: -10, color: C.hueso, transform: `scale(${1 + 0.06 * p})`, transformOrigin: 'left center'}}>
        {n}<span style={{fontStyle: 'italic', color: C.oroClaro, fontSize: 300}}> %</span>
      </div>
      <Aparece d={10} style={{position: 'absolute', left: 90, top: 770 - 5, fontSize: 40, color: C.hueso, opacity: 0.0}}>.</Aparece>
      <Aparece d={s2f(2.7 - 2.4)} style={{position: 'absolute', left: 90, top: 1010, fontSize: 52, fontWeight: 600, color: C.hueso}}>Desde el 1 de julio de 2026</Aparece>
      <Aparece d={s2f(3.0 - 2.4)} style={{position: 'absolute', left: 90, top: 1090, fontSize: 36, color: C.oroClaro}}>Ley 2466 de 2025</Aparece>
      <Hero src="o9" w={600} d={20} style={{right: -90, top: 1140}} />
    </AbsoluteFill>
  );
};

const Habitual: React.FC = () => (
  <AbsoluteFill>
    <Grande t="HABITUAL" size={170} d={0} italic color={C.oro} style={{left: 80, top: 250}} />
    <Aparece d={6} style={{position: 'absolute', left: 90, top: 450, fontSize: 52, fontWeight: 600, color: C.navy}}>trabaja domingos</Aparece>
    <Chip t="Descanso" nota="compensatorio remunerado" d={s2f(8.17 - 6.0)} top={1000} icono="+" dorado />
    <Chip t="Además del recargo" nota="Pagado y descansado" d={s2f(9.0 - 6.0)} top={1220} icono="=" oscuro />
  </AbsoluteFill>
);

const Ocasional: React.FC = () => {
  const f = useCurrentFrame();
  const elige = interpolate(f, [s2f(12.0 - 9.45), s2f(12.6 - 9.45)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <Grande t="OCASIONAL" size={150} d={0} italic color={C.alerta} style={{left: 80, top: 250}} />
      <Aparece d={s2f(10.46 - 9.45)} style={{position: 'absolute', left: 90, top: 440, fontSize: 52, fontWeight: 600, color: C.hueso}}>el trabajador elige</Aparece>
      <Chip t="Recargo" nota="90 % extra" d={s2f(11.5 - 9.45)} top={1000} icono="%" />
      <Chip t="Descanso" nota="compensatorio" d={s2f(12.0 - 9.45)} top={1210} icono="☾" dorado />
      <div style={{position: 'absolute', left: 80, right: 80, top: 1440, textAlign: 'center', fontSize: 40, color: C.oroClaro, opacity: elige}}>O lo uno, o lo otro.</div>
    </AbsoluteFill>
  );
};

const Cierre: React.FC = () => (
  <AbsoluteFill>
    <Grande t="Revise su" size={128} d={0} color={C.hueso} style={{left: 80, top: 250}} />
    <Grande t="nómina con" size={128} d={3} color={C.hueso} style={{left: 80, top: 385}} />
    <Grande t="nosotros." size={150} d={6} italic color={C.oroClaro} style={{left: 80, top: 520}} />
    <Boton t="Escríbanos por WhatsApp" d={14} top={1060} />
    <LogoCierre top={1270} />
    <Aviso />
  </AbsoluteFill>
);

export const V2Dominical: React.FC = () => (
  <AbsoluteFill style={{background: C.navyOsc}}>
    <Escena desde={0} hasta={2.4} modo="oscuro"><Gancho /></Escena>
    <Escena desde={2.4} hasta={6.0} modo="verde" marca="%"><Recargo /></Escena>
    <Escena desde={6.0} hasta={9.45} modo="claro" marca="D"><Habitual /></Escena>
    <Escena desde={9.45} hasta={12.85} modo="oscuro"><Ocasional /></Escena>
    <Escena desde={12.85} hasta={15} modo="oscuro"><Cierre /></Escena>
    <Subs caps={subs as unknown as Caption[]} claves={CLAVES} />
    <Audio src={staticFile('videos/voz-v2.mp3')} />
  </AbsoluteFill>
);
