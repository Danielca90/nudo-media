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

/** Mesa de madera oscura (textura precalculada en public/arca/doc), con luz de lámpara en (lx, ly).
 *  `foco` 0..1 mezcla con la versión ya desenfocada: sin filtros por cuadro. */
export const Mesa: React.FC<{lx?: number; ly?: number; foco?: number}> = ({lx = 0.5, ly = 0.42, foco = 0}) => (
  <AbsoluteFill style={{background: DOC.noche}}>
    <Img src={staticFile('arca/doc/mesa.jpg')} style={{position: 'absolute', width: W, height: H}} />
    {foco > 0 && <Img src={staticFile('arca/doc/mesa-desenfocada.jpg')} style={{position: 'absolute', width: W, height: H, opacity: foco}} />}
    <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 48% at ${lx * 100}% ${ly * 100}%, ${DOC.luz}0.30) 0%, ${DOC.luz}0.10) 45%, rgba(0,0,0,0) 75%)`}} />
  </AbsoluteFill>
);

/** Viñeta + grano de película animado (cambia cada cuadro). */
export const Pelicula: React.FC<{grano?: number}> = ({grano = 0.09}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,.38) 100%)', pointerEvents: 'none'}} />
      <Img src={staticFile(`arca/doc/grano${frame % 8}.png`)} style={{position: 'absolute', width: W, height: H, opacity: grano * 1.4, pointerEvents: 'none'}} />
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
    <div style={{position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('arca/doc/fibra.png')})`, backgroundSize: '512px 512px', opacity: 0.18}} />
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
    <AbsoluteFill style={{opacity: o}}>
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
