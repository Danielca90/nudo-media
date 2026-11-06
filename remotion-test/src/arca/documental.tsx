// Kit "documental" de Arca Jurídica: look de reportaje (mesa oscura, luz de lámpara, papel con textura,
// profundidad de campo, grano de película, viñeta, rótulos). Ver .claude/skills/arca-estilo/SKILL.md.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {COLOR, FUENTES, W, H} from './marca';
import {useT, tramo, ventana} from './kit';

export const DOC = {
  noche: '#0B1616',
  mesa: '#1A1512',
  papel: '#F3EEE3',
  papelSombra: '#D9D1C0',
  tinta: '#1F2423',
  luz: 'rgba(255,214,150,',
};

/** Mesa de madera oscura con veta, iluminada por una lámpara cálida en (lx, ly). */
export const Mesa: React.FC<{lx?: number; ly?: number; foco?: number}> = ({lx = 0.5, ly = 0.42, foco = 0}) => (
  <AbsoluteFill style={{background: DOC.noche}}>
    <AbsoluteFill style={{filter: `blur(${foco * 8}px)`}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="veta" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.06" numOctaves={4} seed={7} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0 0.08  0 0 0 0.9 0" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={DOC.mesa} />
        <rect width={W} height={H} filter="url(#veta)" opacity={0.85} />
      </svg>
    </AbsoluteFill>
    {/* luz de lámpara */}
    <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 48% at ${lx * 100}% ${ly * 100}%, ${DOC.luz}0.30) 0%, ${DOC.luz}0.10) 45%, rgba(0,0,0,0) 75%)`, mixBlendMode: 'screen'}} />
  </AbsoluteFill>
);

/** Viñeta + grano de película animado (cambia cada cuadro). */
export const Pelicula: React.FC<{grano?: number}> = ({grano = 0.09}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.62) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{opacity: grano, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
        <svg width={W} height={H}>
          <filter id={`g${frame % 8}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 8} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={W} height={H} filter={`url(#g${frame % 8})`} />
        </svg>
      </AbsoluteFill>
    </>
  );
};

/** Hoja de papel con textura y sombra suave. */
export const Papel: React.FC<{ancho: number; alto: number; rot?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  ancho, alto, rot = 0, children, style,
}) => (
  <div style={{position: 'absolute', width: ancho, height: alto, transform: `rotate(${rot}deg)`,
    background: `linear-gradient(160deg, #FBF8F1 0%, ${DOC.papel} 55%, #E8E1D2 100%)`,
    boxShadow: '0 40px 80px rgba(0,0,0,.55), 0 8px 20px rgba(0,0,0,.35)', borderRadius: 4, overflow: 'hidden', ...style}}>
    <svg width={ancho} height={alto} style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id={`fibra${ancho}${alto}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={3} seed={3} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.8  0 0 0 0 0.72  0 0 0 0.35 0" />
      </filter>
      <rect width={ancho} height={alto} filter={`url(#fibra${ancho}${alto})`} />
    </svg>
    <div style={{position: 'absolute', inset: 0}}>{children}</div>
  </div>
);

/** Plano: aparece/desaparece con fundido y "cambio de foco" (desenfoque) y un acercamiento lento. */
export const Plano: React.FC<{ini: number; fin: number; zoom?: [number, number]; desde?: [number, number]; hasta?: [number, number]; children: React.ReactNode}> = ({
  ini, fin, zoom = [1, 1.08], desde = [0, 0], hasta = [0, 0], children,
}) => {
  const t = useT();
  const o = ventana(t, ini, fin, 0.3);
  if (o <= 0) return null;
  const p = interpolate(t, [ini, fin], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  const s = zoom[0] + (zoom[1] - zoom[0]) * p;
  const x = desde[0] + (hasta[0] - desde[0]) * p;
  const y = desde[1] + (hasta[1] - desde[1]) * p;
  return (
    <AbsoluteFill style={{opacity: o, filter: `blur(${(1 - o) * 14}px)`}}>
      <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${s})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Texto que se escribe letra por letra entre `a` y `b` segundos (máquina de escribir). */
export const Escribe: React.FC<{texto: string; a: number; b: number; style?: React.CSSProperties}> = ({texto, a, b, style}) => {
  const t = useT();
  const n = Math.round(texto.length * tramo(t, a, b));
  return <span style={style}>{texto.slice(0, n)}<span style={{opacity: 0}}>{texto.slice(n)}</span></span>;
};

/** Resaltador dorado que barre de izquierda a derecha. */
export const Resalta: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const t = useT();
  const p = tramo(t, a, b);
  return (
    <span style={{backgroundImage: `linear-gradient(transparent 12%, rgba(198,169,107,.62) 12%, rgba(198,169,107,.62) 88%, transparent 88%)`,
      backgroundSize: `${p * 100}% 100%`, backgroundRepeat: 'no-repeat', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
      {children}
    </span>
  );
};

/** Rótulo tipo noticiero: línea dorada + texto serif. */
export const Rotulo: React.FC<{en: number; hasta: number; arriba: string; abajo: string; y?: number}> = ({en, hasta, arriba, abajo, y = 1180}) => {
  const t = useT();
  const o = ventana(t, en, hasta, 0.3);
  const linea = tramo(t, en, en + 0.5);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 80, top: y, opacity: o}}>
      <div style={{width: 520 * linea, height: 4, background: COLOR.dorado, marginBottom: 16}} />
      <div style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: COLOR.dorado, textTransform: 'uppercase'}}>{arriba}</div>
      <div style={{fontFamily: FUENTES.serif, fontSize: 40, color: '#F4EFE4', marginTop: 6}}>{abajo}</div>
    </div>
  );
};

/** Emblema + @, discreto, desde `desde` (nunca en los primeros 3 s). */
export const Firma: React.FC<{desde: number; hasta: number; y?: number}> = ({desde, hasta, y = 1372}) => {
  const t = useT();
  const o = ventana(t, desde, hasta, 0.4);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: o * 0.8}}>
      <Img src={staticFile('arca/emblema-claro.png')} style={{height: 34}} />
      <span style={{fontFamily: FUENTES.sans, fontWeight: 700, fontSize: 24, color: COLOR.crema, letterSpacing: 1}}>@arcajuridica</span>
    </div>
  );
};

/** Pesos colombianos: 7000000 → "$7.000.000". */
export const cop = (n: number) => '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
