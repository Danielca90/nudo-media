import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Promo Nudo Design: retablos grabados en láser con tu foto (10 s, 1080x1920).
// Voz: Brian (ElevenLabs), empieza en VOZ s. Tiempos de palabras según Scribe + VOZ.
const FPS = 30;
const VOZ = 0.5;
const f = (s: number) => Math.round(s * FPS);
const AMBAR = '#f59e0b';
const VIOLETA = '#8b5cf6';
const FUENTE = '"Inter", "Helvetica Neue", Arial, sans-serif';
const BORDE: React.CSSProperties = {WebkitTextStroke: '10px #000', paintOrder: 'stroke fill'};

const Linea: React.FC<{children: React.ReactNode; d?: number; size?: number}> = ({children, d = 0, size = 92}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - d, fps, config: {damping: 14, stiffness: 220}});
  return (
    <div style={{fontSize: size, fontWeight: 800, lineHeight: 1.12, color: '#fff', ...BORDE, opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 50}px) scale(${0.9 + 0.1 * s})`}}>{children}</div>
  );
};
const Clave: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = AMBAR}) => (
  <span style={{background: color, borderRadius: 14, padding: '0 18px 6px', WebkitTextStroke: '0px', color: '#111'}}>{children}</span>
);

// Bloque de texto en la zona baja (por encima de los 320 px de la interfaz)
const Bloque: React.FC<{desde: number; hasta: number; arriba?: boolean; children: React.ReactNode}> = ({desde, hasta, arriba, children}) => {
  const frame = useCurrentFrame();
  const sale = interpolate(frame, [f(hasta) - 5, f(hasta)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Sequence from={f(desde)} durationInFrames={f(hasta - desde)} layout="none">
      <div style={{position: 'absolute', left: 70, right: 170, ...(arriba ? {top: 250} : {bottom: 450}), fontFamily: FUENTE, opacity: sale}}>{children}</div>
    </Sequence>
  );
};

const Paso: React.FC<{n: string}> = ({n}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 84, height: 84, borderRadius: '50%', background: '#fff', color: '#111', fontFamily: FUENTE, fontWeight: 800, fontSize: 52, marginBottom: 18, boxShadow: '0 8px 24px #0008'}}>{n}</div>
);

// Intro muy rápida: barrido de un haz violeta que "graba" el título
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const fuera = interpolate(frame, [16, 22], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: fuera, fontFamily: FUENTE}}>
      <AbsoluteFill style={{background: '#0b0b0f', opacity: 0.72}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
        <div style={{fontSize: 150, fontWeight: 800, color: '#fff', letterSpacing: -3, lineHeight: 1}}>RETABLOS</div>
        <div style={{fontSize: 96, fontWeight: 800, color: AMBAR, lineHeight: 1.1}}>grabados en láser</div>
      </div>
      <div style={{position: 'absolute', top: 720, height: 340, left: `${p * 100}%`, width: 8, background: VIOLETA, boxShadow: `0 0 40px 14px ${VIOLETA}`, opacity: p < 1 ? 1 : 0}} />
    </AbsoluteFill>
  );
};

export const RetablosLaser: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 300], [1.0, 1.05]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={staticFile('retablos/laser.mp4')} muted playbackRate={0.8} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {/* degradado inferior para leer el texto */}
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0) 48%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 34%)', opacity: interpolate(frame, [f(VOZ + 3.7), f(VOZ + 4.1)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />

      {/* "¿Tu foto favorita, grabada en madera?" */}
      <Bloque arriba desde={VOZ - 0.05} hasta={VOZ + 2.35}>
        <Linea>¿Tu <Clave>foto</Clave> favorita,</Linea>
        <Linea d={f(1.28)}>grabada en madera?</Linea>
      </Bloque>
      {/* "La convertimos en dibujo" */}
      <Bloque arriba desde={VOZ + 2.38} hasta={VOZ + 3.85}>
        <Paso n="1" />
        <Linea>La convertimos</Linea>
        <Linea d={f(0.7)}>en <Clave>dibujo</Clave></Linea>
      </Bloque>
      {/* "y el láser la graba en un retablo único" */}
      <Bloque desde={VOZ + 3.9} hasta={VOZ + 6.5}>
        <Paso n="2" />
        <Linea>El <Clave color={VIOLETA}><span style={{color: '#fff'}}>láser</span></Clave> la graba</Linea>
        <Linea d={f(1.3)}>en un retablo único</Linea>
      </Bloque>
      {/* cierre */}
      <Bloque desde={VOZ + 6.5} hasta={10}>
        <Linea size={130}>Pide el <Clave>tuyo</Clave></Linea>
        <Linea d={10} size={56}>Con tu foto · hecho en madera</Linea>
      </Bloque>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 345, textAlign: 'center', fontFamily: FUENTE, fontSize: 38, fontWeight: 800, color: '#fff', WebkitTextStroke: '6px #000', paintOrder: 'stroke fill'}}>@somos_nudodesign</div>

      <Sequence durationInFrames={24} layout="none"><Intro /></Sequence>
      <Sequence from={f(VOZ)} layout="none"><Audio src={staticFile('retablos/voz.mp3')} /></Sequence>
    </AbsoluteFill>
  );
};
