import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {C} from '../carrusel-incapacidades/tema';
import {Aparece, Hero} from '../carrusel-incapacidades/Base';
import {Aviso, Chip, Escena, Grande, LogoCierre, Subs, s2f} from './comun';
import subs from './v1.subs.json';

const CLAVES = ['demanda.', 'calamidad', 'viajes.', 'Nunca', 'paternidad.'];

// Escena 1 - gancho: mazo que cae en la palabra "demanda" + sello
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const golpe = s2f(1.98);
  const caida = spring({frame: f - (golpe - 12), fps, config: {damping: 9, stiffness: 160}});
  const tiembla = f >= golpe ? Math.sin(f * 2.2) * 10 * Math.exp(-(f - golpe) / 5) : 0;
  const sello = spring({frame: f - golpe - 2, fps, config: {damping: 8, stiffness: 200}});
  return (
    <AbsoluteFill style={{transform: `translate(${tiembla}px, ${tiembla * 0.6}px)`}}>
      <Grande t="¿Negar un" size={170} d={0} color={C.hueso} style={{left: 80, top: 250}} />
      <Grande t="permiso?" size={190} d={2} italic color={C.oroClaro} style={{left: 80, top: 430}} />
      <Hero src="o3" w={620} d={0} style={{right: -130, top: 960 + (1 - caida) * -1100}} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 1330, display: 'flex', justifyContent: 'center', opacity: sello, transform: `rotate(-6deg) scale(${1.8 - 0.8 * sello})`}}>
        <div style={{border: `14px solid ${C.alerta}`, color: C.alerta, padding: '10px 50px', borderRadius: 20, fontSize: 150, fontWeight: 900, letterSpacing: 8}}>DEMANDA</div>
      </div>
    </AbsoluteFill>
  );
};

const Si: React.FC = () => (
  <AbsoluteFill>
    <Grande t="SÍ" size={330} d={0} italic color={C.oroClaro} style={{left: 80, top: 210}} />
    <Aparece d={6} style={{position: 'absolute', left: 90, top: 560, fontSize: 52, fontWeight: 600, color: C.hueso}}>debe darlos</Aparece>
    <Hero src="o4" w={430} d={4} rot={6} style={{right: -40, top: 300}} />
    <Chip t="Luto" nota="5 días hábiles" d={35} top={960} />
    <Chip t="Votar" nota="Medio día" d={51} top={1150} />
    <Chip t="Calamidad" nota="Doméstica, comprobada" d={67} top={1340} />
  </AbsoluteFill>
);

const No: React.FC = () => (
  <AbsoluteFill>
    <Grande t="NO" size={330} d={0} italic color={C.oro} style={{left: 80, top: 210}} />
    <Aparece d={6} style={{position: 'absolute', left: 90, top: 560, fontSize: 52, fontWeight: 600, color: C.navy}}>está obligado</Aparece>
    <Chip t="Trámites personales" nota="Se acuerda" d={37} top={1000} icono="↔" oscuro />
    <Chip t="Viajes" nota="Se acuerda" d={70} top={1220} icono="↔" oscuro />
  </AbsoluteFill>
);

const Nunca: React.FC = () => (
  <AbsoluteFill>
    <Grande t="NUNCA" size={215} d={0} italic color={C.alerta} style={{left: 80, top: 230}} />
    <Aparece d={6} style={{position: 'absolute', left: 90, top: 520, fontSize: 52, fontWeight: 600, color: C.hueso}}>puede negar</Aparece>
    <Hero src="o7" w={400} d={6} rot={-4} style={{right: -20, top: 470}} />
    <Chip t="Maternidad" nota="18 semanas" d={59} top={1000} icono="!" dorado />
    <Chip t="Paternidad" nota="2 semanas" d={77} top={1200} icono="!" dorado />
  </AbsoluteFill>
);

const Cierre: React.FC = () => (
  <AbsoluteFill>
    <Grande t="Consúltenos" size={128} d={0} color={C.hueso} style={{left: 80, top: 250}} />
    <Grande t="antes de" size={128} d={3} color={C.hueso} style={{left: 80, top: 385}} />
    <Grande t="decir no." size={150} d={6} italic color={C.oroClaro} style={{left: 80, top: 520}} />
    <LogoCierre top={1010} d={14} />
    <Aviso />
  </AbsoluteFill>
);

export const V1Permisos: React.FC = () => (
  <AbsoluteFill style={{background: C.navyOsc}}>
    <Escena desde={0} hasta={2.55} modo="oscuro"><Gancho /></Escena>
    <Escena desde={2.55} hasta={6.1} modo="verde" marca="SÍ"><Si /></Escena>
    <Escena desde={6.1} hasta={9.1} modo="claro" marca="NO"><No /></Escena>
    <Escena desde={9.1} hasta={12.5} modo="oscuro" marca="¡"><Nunca /></Escena>
    <Escena desde={12.5} hasta={15} modo="oscuro"><Cierre /></Escena>
    <Subs caps={subs as unknown as Caption[]} claves={CLAVES} />
    <Audio src={staticFile('videos/voz-v1.mp3')} />
  </AbsoluteFill>
);
