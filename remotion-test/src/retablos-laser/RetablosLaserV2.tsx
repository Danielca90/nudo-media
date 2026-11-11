import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Promo Nudo Design v2: retablos grabados en láser, con 3 clips de proceso (9 s, 1080x1920).
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

// Clip de video recortado: se ve entre `desde` y `hasta` (s), empezando en `inicio` (s) del archivo
const Clip: React.FC<{src: string; desde: number; hasta: number; inicio?: number}> = ({src, desde, hasta, inicio = 0}) => {
  return (
    <Sequence from={f(desde)} durationInFrames={f(hasta - desde)} layout="none">
      <ClipInt src={src} inicio={inicio} />
    </Sequence>
  );
};
const ClipInt: React.FC<{src: string; inicio: number}> = ({src, inicio}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 110], [1.06, 1.0], {extrapolateRight: 'clamp'});
  const flash = interpolate(frame, [0, 5], [0.5, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <OffthreadVideo src={staticFile(`retablos/${src}.mp4`)} muted trimBefore={f(inicio)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

export const RetablosLaserV2: React.FC = () => {
  const frame = useCurrentFrame();
  const arribaOsc = interpolate(frame, [f(2.95), f(3.05), f(4.3), f(4.4), f(5.5), f(5.6)], [0, 1, 1, 0, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Clip src="grabado" desde={0} hasta={2.95} inicio={0} />
      <Clip src="laser" desde={2.95} hasta={4.4} inicio={0.6} />
      <Clip src="grabado" desde={4.4} hasta={5.5} inicio={3.0} />
      <Clip src="marco" desde={5.5} hasta={9} inicio={0} />
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 28%, rgba(0,0,0,0) 48%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 34%)', opacity: arribaOsc}} />

      <Bloque desde={VOZ - 0.05} hasta={2.95}>
        <Linea>¿Tu <Clave>foto</Clave> favorita,</Linea>
        <Linea d={f(1.28)}>grabada en madera?</Linea>
      </Bloque>
      <Bloque arriba desde={2.95} hasta={4.4}>
        <Paso n="1" />
        <Linea>La convertimos</Linea>
        <Linea d={f(0.6)}>en <Clave>dibujo</Clave></Linea>
      </Bloque>
      <Bloque desde={4.4} hasta={5.5}>
        <Paso n="2" />
        <Linea>El <Clave color={VIOLETA}><span style={{color: '#fff'}}>láser</span></Clave> la graba</Linea>
      </Bloque>
      <Bloque arriba desde={5.5} hasta={VOZ + 6.9}>
        <Paso n="3" />
        <Linea>Le cortamos su</Linea>
        <Linea d={f(0.45)}><Clave>marco</Clave> calado</Linea>
      </Bloque>
      <Bloque arriba desde={VOZ + 6.9} hasta={9}>
        <Linea size={130}>Pide el <Clave>tuyo</Clave></Linea>
        <Linea d={8} size={56}>Con tu foto · hecho en madera</Linea>
      </Bloque>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 345, textAlign: 'center', fontFamily: FUENTE, fontSize: 38, fontWeight: 800, color: '#fff', WebkitTextStroke: '6px #000', paintOrder: 'stroke fill'}}>@somos_nudodesign</div>

      <Sequence durationInFrames={20} layout="none"><Intro /></Sequence>
      <Sequence from={f(VOZ)} layout="none"><Audio src={staticFile('retablos/voz-v2.mp3')} /></Sequence>
    </AbsoluteFill>
  );
};
