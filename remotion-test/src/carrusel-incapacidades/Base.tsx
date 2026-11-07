import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, EST, W, H, SERIF, SANS} from './tema';

export type Modo = 'oscuro' | 'claro' | 'verde';

const FUENTES: [string, string, string, string][] = [
  ['Playfair Display', 'playfair-display-latin-700-normal.woff2', '700', 'normal'],
  ['Playfair Display', 'playfair-display-latin-900-normal.woff2', '900', 'normal'],
  ['Playfair Display', 'playfair-display-latin-700-italic.woff2', '700', 'italic'],
  ['Playfair Display', 'playfair-display-latin-900-italic.woff2', '900', 'italic'],
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Inter', 'inter-latin-700-normal.woff2', '700', 'normal'],
];
export const useFuentes = () => {
  const [h] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(
      FUENTES.map(([fam, file, weight, style]) => {
        const ff = new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style});
        return ff.load().then((f) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(f));
      }),
    ).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

export const tinta = (m: Modo) => (m === 'claro' ? C.navy : C.hueso);

export const useAp = (delay = 0, damping = 20, stiffness = 90) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness}});
};

// Reveal con máscara: la línea sube desde una ventana recortada
export const Linea: React.FC<{d?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d = 0, children, style}) => {
  const p = useAp(d, 22, 80);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`, filter: `blur(${(1 - p) * 10}px)`}}>{children}</div>
    </div>
  );
};

export const Aparece: React.FC<{d?: number; y?: number; x?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({d = 0, y = 36, x = 0, children, style}) => {
  const p = useAp(d);
  return <div style={{opacity: Math.min(1, p * 1.4), transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, filter: `blur(${(1 - p) * 12}px)`, ...style}}>{children}</div>;
};

// Línea dorada que se dibuja
export const FiloOro: React.FC<{d?: number; t?: string; w?: number; claro?: boolean}> = ({d = 0, t = '', w = 140, claro}) => {
  const p = useAp(d, 24, 70);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 16, height: 16, borderRadius: '50%', background: claro ? C.oroTxt : C.oro, transform: `scale(${p})`, boxShadow: `0 0 0 ${6 * p}px ${C.oro}33`}} />
      <div style={{fontSize: 21, letterSpacing: 6, fontWeight: 700, color: claro ? C.oroTxt : C.oro, opacity: p}}>{t}</div>
      <div style={{height: 3, width: w * p, background: C.oro, borderRadius: 2, opacity: 0.6}} />
    </div>
  );
};

export const Titular: React.FC<{lineas: (string | [string, 'oro'])[]; size?: number; d?: number; modo: Modo}> = ({lineas, size = 104, d = 4, modo}) => (
  <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: size, lineHeight: 1.06, letterSpacing: -1.5, color: tinta(modo)}}>
    {lineas.map((l, i) => {
      const oro = Array.isArray(l);
      return (
        <Linea key={i} d={d + i * 6}>
          <span style={oro ? {color: modo === 'claro' ? C.oroTxt : C.oroClaro, fontStyle: 'italic', fontWeight: 700} : undefined}>{oro ? l[0] : l}</span>
        </Linea>
      );
    })}
  </div>
);

export const Nieve: React.FC<{color: string; alto?: number}> = ({color, alto = H}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 46}).map((_, i) => {
        const r = (s: string) => random(`${s}${i}`);
        const size = 3 + r('s') * 6;
        const y = ((r('y') * alto + f * (1 + r('v') * 2)) % (alto + 30)) - 15;
        const x = r('x') * W + Math.sin((f + r('p') * 90) / 24) * 16;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: color, opacity: 0.18 + r('o') * 0.35}} />;
      })}
    </AbsoluteFill>
  );
};

export const Estrellas: React.FC<{color: string; alto?: number}> = ({color, alto = H}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: 22}).map((_, i) => {
        const r = (s: string) => random(`e${s}${i}`);
        const size = 14 + r('s') * 40;
        const tw = 0.5 + 0.5 * Math.sin(f / (8 + r('t') * 10) + r('p') * 6);
        return (
          <svg key={i} width={size} height={size} viewBox="-50 -50 100 100" style={{position: 'absolute', left: r('x') * W, top: r('y') * alto, opacity: 0.15 + tw * 0.65, transform: `scale(${0.6 + tw * 0.6}) rotate(${f * 0.4 * (r('r') - 0.5)}deg)`}}>
            <path d="M0 -48 C6 -14 14 -6 48 0 C14 6 6 14 0 48 C-6 14 -14 6 -48 0 C-14 -6 -6 -14 0 -48Z" fill={color} />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

export const Deco: React.FC<{claro: boolean; alto?: number}> = ({claro, alto = H}) =>
  EST.deco === 'estrellas' ? <Estrellas color={claro ? C.oro : C.oroClaro} alto={alto} /> : <Nieve color={claro ? C.oro : '#fff'} alto={alto} />;

// Fondo "aurora": manchas desenfocadas en movimiento (tema B)
export const Aurora: React.FC<{claro: boolean; alto?: number}> = ({claro, alto = H}) => {
  const f = useCurrentFrame();
  if (EST.fondo !== 'aurora') return null;
  const blob = (c: string, x: number, y: number, s: number, o: number) => (
    <div style={{position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0%, transparent 70%)`, opacity: o, filter: 'blur(30px)'}} />
  );
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {blob(C.glowVerde, 220 + Math.sin(f / 40) * 120, alto * 0.28 + Math.cos(f / 55) * 90, 900, claro ? 0.35 : 0.7)}
      {blob(C.oro, 900 + Math.cos(f / 45) * 110, alto * 0.62 + Math.sin(f / 50) * 120, 700, claro ? 0.3 : 0.38)}
      {blob(C.oroClaro, 540 + Math.sin(f / 60) * 160, alto * 0.9 + Math.cos(f / 35) * 70, 650, claro ? 0.3 : 0.2)}
    </AbsoluteFill>
  );
};

// Guirnalda dorada discreta
export const Guirnalda: React.FC<{modo: Modo}> = ({modo}) => {
  const f = useCurrentFrame();
  const n = 14;
  const hilo = modo === 'claro' ? `${C.navy}55` : `${C.hueso}44`;
  return (
    <svg width={W} height={130} style={{position: 'absolute', top: 0, left: 0}}>
      <path d={`M -10 14 Q ${W / 2} 110 ${W + 10} 14`} stroke={hilo} strokeWidth={3} fill="none" />
      {Array.from({length: n}).map((_, i) => {
        const t = (i + 0.5) / n;
        const x = -10 + t * (W + 20);
        const y = (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 110 + t * t * 14;
        const on = 0.6 + 0.4 * Math.sin(f / 6 + i * 1.3);
        return (
          <g key={i}>
            <circle cx={x} cy={y + 12} r={18} fill={C.oroClaro} opacity={on * 0.22} />
            <ellipse cx={x} cy={y + 12} rx={6} ry={9} fill={C.oroClaro} opacity={0.45 + on * 0.55} />
          </g>
        );
      })}
    </svg>
  );
};

export const Marco: React.FC<{n: number; modo: Modo; marca?: string; children: React.ReactNode}> = ({n, modo, marca, children}) => {
  useFuentes();
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ap = spring({frame: f, fps, config: {damping: 200}, durationInFrames: 26});
  const lado = (1 - ap) * 47;
  const radio = 6 + (1 - ap) * 40;
  const claro = modo === 'claro';
  const fondo = claro
    ? C.hueso
    : modo === 'verde'
      ? `radial-gradient(ellipse 130% 90% at 80% 15%, ${C.glowVerde} 0%, ${C.verde} 45%, ${C.baseVerde} 100%)`
      : `radial-gradient(ellipse 130% 90% at 80% 15%, ${C.glowNavy} 0%, ${C.navy} 45%, ${C.navyOsc} 100%)`;
  const dz = interpolate(f, [0, 150], [1, 1.06]);
  return (
    <AbsoluteFill style={{background: C.ventana}}>
    <AbsoluteFill style={{background: fondo, fontFamily: SANS, color: tinta(modo), overflow: 'hidden', clipPath: EST.apertura === 'circulo' ? `circle(${ap * 78}% at 50% 42%)` : `inset(${(1 - ap) * 28}% ${lado}% ${(1 - ap) * 28}% ${lado}% round ${radio}px)`, boxShadow: '0 40px 90px #0006'}}>
      {marca && (
        <div style={{position: 'absolute', left: -40 - (1 - ap) * 120 - f * 0.6, bottom: 70, fontFamily: SERIF, fontWeight: 900, fontSize: 560, lineHeight: 0.8, letterSpacing: -20, color: claro ? C.navy : '#fff', opacity: 0.07, whiteSpace: 'nowrap'}}>{marca}</div>
      )}
      {claro && (
        <div style={{position: 'absolute', right: -260, top: 420, width: 900, height: 900, borderRadius: '50%', background: `${C.navy}10`, transform: `scale(${dz})`}} />
      )}
      <Aurora claro={claro} />
      <Deco claro={claro} />
      <Guirnalda modo={modo} />
      {/* marca: logo oficial */}
      <div style={{position: 'absolute', top: 124, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: interpolate(f, [0, 14], [0, 1], {extrapolateRight: 'clamp'})}}>
        <Logo claro={claro} h={150} />
      </div>
      <div style={{position: 'absolute', top: 290, left: 90, right: 90, bottom: 190}}>{children}</div>
      {/* pie */}
      <div style={{position: 'absolute', left: 90, right: 90, bottom: 66, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, border: `2px solid ${claro ? C.navy : C.oroClaro}`, borderRadius: 40, padding: '12px 28px', fontSize: 24, fontWeight: 600}}>
          <span>{n < 6 ? 'Desliza' : 'Lea el pie de foto'}</span><span>{n < 6 ? '→' : '↓'}</span>
        </div>
        <div style={{fontFamily: SERIF, fontSize: 30, color: claro ? C.oro : C.oroClaro, fontWeight: 700}}>0{n}<span style={{opacity: 0.5}}> / 06</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 28, textAlign: 'center', fontSize: 17, opacity: 0.6}}>Orientación general, no es asesoría legal.</div>
    </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Objetos ilustrados (SVG) ----------
export const Bola: React.FC<{size?: number; fase?: number}> = ({size = 220, fase = 0}) => {
  const f = useCurrentFrame();
  const ang = Math.sin(f / 18 + fase) * 5;
  return (
    <svg width={size} height={size * 1.7} viewBox="0 0 200 340" style={{transformOrigin: '100px 0', transform: `rotate(${ang}deg)`}}>
      <defs>
        <radialGradient id="bo" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#F4E2A8" /><stop offset="0.5" stopColor={C.oro} /><stop offset="1" stopColor="#5F4B1E" /></radialGradient>
      </defs>
      <line x1="100" y1="0" x2="100" y2="110" stroke="#D8BC74" strokeWidth="3" />
      <rect x="82" y="104" width="36" height="26" rx="5" fill="#D8BC74" />
      <circle cx="100" cy="230" r="100" fill="url(#bo)" />
      <path d="M 20 215 Q 100 255 180 215" stroke="#EDEDEB" strokeWidth="5" fill="none" opacity="0.6" />
      <ellipse cx="68" cy="180" rx="26" ry="14" fill="#fff" opacity="0.35" transform="rotate(-30 68 180)" />
    </svg>
  );
};

export const Mazo: React.FC<{size?: number; golpe?: number}> = ({size = 360, golpe = 40}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - golpe, fps, config: {damping: 8, stiffness: 140}});
  const rot = -38 + 38 * p;
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 400 320">
      <defs>
        <linearGradient id="mz" x1="0" x2="1"><stop offset="0" stopColor="#7A5A30" /><stop offset="0.5" stopColor="#B88A52" /><stop offset="1" stopColor="#6A4A26" /></linearGradient>
      </defs>
      <ellipse cx="190" cy="296" rx="150" ry="16" fill="#00000040" />
      <rect x="40" y="268" width="300" height="28" rx="8" fill={C.oro} />
      <g transform={`rotate(${rot} 190 250)`}>
        <rect x="170" y="110" width="30" height="150" rx="10" fill="url(#mz)" transform="rotate(0 185 250)" />
        <rect x="90" y="60" width="200" height="74" rx="14" fill="url(#mz)" />
        <rect x="90" y="60" width="26" height="74" rx="8" fill={C.oro} />
        <rect x="264" y="60" width="26" height="74" rx="8" fill={C.oro} />
      </g>
    </svg>
  );
};

export const Balanza: React.FC<{size?: number}> = ({size = 440}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - 30, fps, config: {damping: 10, stiffness: 50}});
  const tilt = (1 - p) * -10 + Math.sin(f / 20) * 1.2; // se equilibra y respira
  const pan = (dx: number, dy: number, sign: number) => (
    <g transform={`translate(${dx} ${dy})`}>
      <line x1="0" y1="0" x2="-60" y2="90" stroke={C.oroClaro} strokeWidth="3" />
      <line x1="0" y1="0" x2="60" y2="90" stroke={C.oroClaro} strokeWidth="3" />
      <path d="M -75 90 Q 0 150 75 90 Z" fill={C.oro} />
    </g>
  );
  const dy = Math.sin((tilt * Math.PI) / 180) * 150;
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 400 380">
      <ellipse cx="200" cy="360" rx="120" ry="12" fill="#00000040" />
      <rect x="150" y="338" width="100" height="18" rx="6" fill={C.oro} />
      <rect x="192" y="60" width="16" height="280" rx="6" fill={C.oroClaro} />
      <circle cx="200" cy="52" r="16" fill={C.oro} />
      <g transform={`rotate(${tilt} 200 70)`}>
        <rect x="50" y="62" width="300" height="12" rx="6" fill={C.oroClaro} />
        {pan(60, 68, -1)}
        {pan(340, 68, 1)}
      </g>
    </svg>
  );
};

export const Lupa: React.FC<{size?: number}> = ({size = 240}) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 22) * 10;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translate(${dx}px, ${Math.cos(f / 22) * 6}px)`}}>
      <circle cx="82" cy="82" r="60" fill="#EDEDEB22" stroke={C.oro} strokeWidth="12" />
      <path d="M 40 60 A 46 46 0 0 1 80 36" stroke="#fff" strokeWidth="6" fill="none" opacity="0.6" strokeLinecap="round" />
      <line x1="126" y1="126" x2="184" y2="184" stroke={C.oro} strokeWidth="18" strokeLinecap="round" />
    </svg>
  );
};

export const Panel: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties; d?: number}> = ({children, color = C.navy, style, d = 10}) => {
  const p = useAp(d, 22, 80);
  return (
    <div style={{background: color, borderRadius: 44, padding: 44, boxShadow: '0 30px 60px #00000030', transform: `translateX(${(1 - p) * 260}px)`, filter: `blur(${(1 - p) * 18}px)`, opacity: Math.min(1, p * 1.5), ...style}}>{children}</div>
  );
};

// ---------- Estructura tipo Pereira: paneles asimétricos, globo, pastilla, hero que se sale ----------
export const Blob: React.FC<{color?: string; radio?: string; style?: React.CSSProperties; d?: number; tab?: string; children?: React.ReactNode}> = ({color = C.navyOsc, radio: radioIn = '56px 56px 56px 190px', style, d = 8, tab, children}) => {
  const p = useAp(d, 22, 80);
  const radio = EST.chip === 'tarjeta' ? radioIn.split(' ').reverse().join(' ') : radioIn;
  return (
    <div style={{position: 'absolute', transform: `translateY(${(1 - p) * 90}px)`, opacity: Math.min(1, p * 1.5), filter: `blur(${(1 - p) * 14}px)`, ...style}}>
      {tab && (
        <div style={{position: 'absolute', left: 0, top: -58, height: 64, padding: '0 34px', background: color, borderRadius: '28px 28px 0 0', display: 'flex', alignItems: 'center', fontSize: 22, letterSpacing: 5, fontWeight: 700, color: C.oroClaro}}>{tab}</div>
      )}
      <div style={{position: 'absolute', inset: 0, background: color, borderRadius: radio, boxShadow: '0 30px 70px #0000004d'}} />
      <div style={{position: 'relative', height: '100%'}}>{children}</div>
    </div>
  );
};

export const Hero: React.FC<{src: string; w: number; style?: React.CSSProperties; d?: number; rot?: number}> = ({src, w, style, d = 14, rot = 0}) => {
  const f = useCurrentFrame();
  const p = useAp(d, 16, 70);
  const flota = Math.sin((f + d) / 26) * 9;
  return (
    <div style={{position: 'absolute', width: w, transform: `translate(${(1 - p) * 140}px, ${flota}px) rotate(${rot + (1 - p) * 8}deg) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * 16}px) drop-shadow(0 34px 34px #00000055)`, ...style}}>
      <Img src={staticFile(`objetos/${src}.png`)} style={{width: '100%', display: 'block'}} />
    </div>
  );
};

// Globo de diálogo (pregunta) con cola
export const Globo: React.FC<{children: React.ReactNode; d?: number; style?: React.CSSProperties; cola?: 'izq' | 'centro'; size?: number}> = ({children, d = 6, style, cola = 'centro', size = 40}) => {
  const p = useAp(d, 14, 110);
  return (
    <div style={{position: 'absolute', transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2), transformOrigin: 'bottom center', ...style}}>
      <div style={{background: C.hueso, color: C.navy, borderRadius: 60, padding: '26px 46px', fontSize: size, fontFamily: SERIF, fontWeight: 700, textAlign: 'center', lineHeight: 1.15, boxShadow: '0 20px 50px #0000004d'}}>{children}</div>
      <div style={{position: 'absolute', bottom: -22, left: cola === 'centro' ? '50%' : 90, marginLeft: -22, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `24px solid ${C.hueso}`}} />
    </div>
  );
};

// Botón-pastilla con ícono y nota (equivale al botón "Leia a legenda")
export const Pastilla: React.FC<{t: string; d?: number; style?: React.CSSProperties; oro?: boolean}> = ({t, d = 60, style, oro}) => {
  const p = useAp(d);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, background: oro ? C.oro : C.pastilla, color: oro ? C.navyOsc : C.pastillaTxt, borderRadius: 60, padding: '18px 34px', fontSize: 26, fontWeight: 600, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, ...style}}>
      <div style={{width: 46, height: 46, borderRadius: '50%', border: '3px solid currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0}}>↓</div>
      <div style={{lineHeight: 1.2}}>{t}</div>
    </div>
  );
};

// Logo oficial de Arca Jurídica (recortado, public/marca). `claro` = fondo claro -> logo a color.
export const Logo: React.FC<{claro?: boolean; h?: number; style?: React.CSSProperties}> = ({claro, h = 150, style}) => (
  <Img src={staticFile(`marca/${claro ? 'logo' : 'logo-claro'}.png`)} style={{height: h, display: 'block', ...style}} />
);
