import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C} from '../carrusel-incapacidades/tema';
import {Aparece, Hero} from '../carrusel-incapacidades/Base';
import {Aviso, Chip, Escena, Grande, LogoCierre, Subs, s2f} from './comun';
import subs from './v4.subs.json';

const K = 1.06; // velocidad de la voz
const t = (x: number) => x / K;
const CLAVES = ['legales?', 'letreros', 'baños', 'necesario.'];

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const parpadeo = Math.floor(f / 12) % 2 === 0 ? 1 : 0.25;
  const cond = spring({frame: f - s2f(t(2.52)), fps, config: {damping: 11, stiffness: 160}});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 80, top: 235, display: 'flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 700, color: C.hueso}}>
        <div style={{width: 26, height: 26, borderRadius: '50%', background: C.rojo, opacity: parpadeo, boxShadow: `0 0 20px ${C.rojo}`}} /> REC
      </div>
      <Grande t="¿Son legales" size={150} d={0} color={C.hueso} style={{left: 80, top: 285}} />
      <Grande t="las cámaras?" size={150} d={3} italic color={C.oroClaro} style={{left: 80, top: 440}} />
      <Hero src="o11" w={520} d={8} rot={-4} style={{right: -40, top: 960}} />
      <div style={{position: 'absolute', left: 80, top: 1060, opacity: cond, transform: `translateX(${(1 - cond) * -200}px)`}}>
        <div style={{display: 'inline-block', background: C.oro, color: C.navyOsc, borderRadius: 70, padding: '22px 44px', fontSize: 50, fontWeight: 800, lineHeight: 1.1}}>Sí, con<br />tres condiciones</div>
        <div style={{marginTop: 22, fontSize: 34, color: C.oroClaro, fontWeight: 600}}>Ley 1581 de 2012</div>
      </div>
    </AbsoluteFill>
  );
};

const Paso: React.FC<{n: string; t: string; nota: string; icono: string; d: number; claro?: boolean}> = ({n, t: tt, nota, icono, d, claro}) => (
  <AbsoluteFill>
    <Grande t={n} size={300} d={0} italic color={claro ? C.oroTxt : C.oroClaro} style={{left: 80, top: 230}} />
    <Chip t={tt} nota={nota} d={d} top={990} icono={icono} grande oscuro={claro} />
  </AbsoluteFill>
);

const Privado: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sello = spring({frame: f - s2f(t(9.96) - t(8.16) + 0.05), fps, config: {damping: 8, stiffness: 200}});
  return (
    <AbsoluteFill>
      <Paso claro n="DOS" t="Nada en baños" nota="Ni vestieres: zonas íntimas" icono="✕" d={s2f(t(9.44) - t(8.16) + 0.1)} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 1330, display: 'flex', justifyContent: 'center', opacity: sello, transform: `rotate(-5deg) scale(${1.7 - 0.7 * sello})`}}>
        <div style={{border: `12px solid ${C.rojo}`, color: C.rojo, padding: '8px 44px', borderRadius: 18, fontSize: 100, fontWeight: 900, letterSpacing: 6}}>ZONA PRIVADA</div>
      </div>
    </AbsoluteFill>
  );
};

const Cierre: React.FC = () => (
  <AbsoluteFill>
    <Grande t="Consúltenos" size={150} d={0} italic color={C.oroClaro} style={{left: 80, top: 250}} />
    <LogoCierre top={1010} d={10} />
    <Aviso />
  </AbsoluteFill>
);

export const V4Camaras: React.FC = () => (
  <AbsoluteFill style={{background: C.navyOsc}}>
    <Escena desde={0} hasta={t(5.0) - 0.4} modo="oscuro"><Gancho /></Escena>
    <Escena desde={t(5.0) - 0.4} hasta={t(8.16) - 0.1} modo="verde" marca="1"><Paso n="UNO" t="Avisar" nota="Letreros y trabajadores" icono="1" d={s2f(t(5.6) - t(5.0) + 0.4)} /></Escena>
    <Escena desde={t(8.16) - 0.1} hasta={t(10.907) - 0.05} modo="claro" marca="2"><Privado /></Escena>
    <Escena desde={t(10.907) - 0.05} hasta={t(14.1)} modo="oscuro" marca="3"><Paso n="TRES" t="Conservar" nota="Solo el tiempo necesario" icono="3" d={s2f(t(11.56) - t(10.907) + 0.05)} /></Escena>
    <Escena desde={t(14.1)} hasta={15} modo="oscuro"><Cierre /></Escena>
    <Subs caps={subs as unknown as Caption[]} claves={CLAVES} />
    <Audio src={staticFile('videos/voz-v4.mp3')} />
  </AbsoluteFill>
);
