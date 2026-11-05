import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {PALABRAS, FPS} from './tiempos';
import {SUBTITULOS, VIDEO} from '../estilo';

// Énfasis: una palabra clave por idea, con recuadro.
const CLAVE = new Set(['verde?', 'agua.', 'encoge.', 'ancho.', 'grietas.', 'humedad:']);

const bloques: number[][] = [];
{
  let actual: number[] = [];
  PALABRAS.forEach((p, i) => {
    actual.push(i);
    if (/[.,:?!…]$/.test(p.text) || actual.length >= SUBTITULOS.palabrasPorBloque) {
      bloques.push(actual);
      actual = [];
    }
  });
  if (actual.length) bloques.push(actual);
}

const BORDE = {WebkitTextStroke: `${SUBTITULOS.borde}px #000`, paintOrder: 'stroke fill'} as React.CSSProperties;

export const Subtitulos: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const bloque = bloques.find((b, i) => {
    const ini = PALABRAS[b[0]].start - 0.05;
    const sig = bloques[i + 1];
    const fin = sig ? PALABRAS[sig[0]].start - 0.05 : PALABRAS[b[b.length - 1]].end + 0.8;
    return t >= ini && t < fin;
  });
  if (!bloque) return null;
  // la palabra aparece un poco antes de oírse (se lee al mismo tiempo que se escucha)
  const visibles = bloque.filter((i) => PALABRAS[i].start - 0.05 <= t);
  const activa = visibles[visibles.length - 1];

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: VIDEO.height * SUBTITULOS.centroY - 50,
        textAlign: 'center',
        fontFamily: SUBTITULOS.familia,
        fontWeight: SUBTITULOS.peso,
        fontSize: SUBTITULOS.tamano,
        lineHeight: 1.3,
      }}
    >
      {visibles.map((i) => {
        const p = PALABRAS[i];
        const s = spring({frame: frame - Math.round((p.start - 0.05) * FPS), fps, config: {damping: 14, stiffness: 260}});
        const esClave = CLAVE.has(p.text);
        const esActiva = i === activa;
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              margin: '0 9px',
              padding: esClave ? '0 14px 6px' : 0,
              color: esActiva || esClave ? '#ffffff' : '#c9c9c9',
              transform: `scale(${0.85 + s * 0.15 + (esActiva ? 0.04 : 0)})`,
              opacity: Math.min(1, s * 1.5),
              borderRadius: 8,
              background: esClave ? 'rgba(29,78,216,0.9)' : 'transparent',
              border: esClave ? '3px solid #93c5fd' : 'none',
              ...(esClave ? {} : BORDE),
            }}
          >
            {p.text}
            {esClave && (
              <>
                <span style={{position: 'absolute', left: -9, top: -9, width: 14, height: 14, borderRadius: 7, background: '#93c5fd', border: '2px solid #1d4ed8'}} />
                <span style={{position: 'absolute', right: -9, bottom: -9, width: 14, height: 14, borderRadius: 7, background: '#93c5fd', border: '2px solid #1d4ed8'}} />
              </>
            )}
          </span>
        );
      })}
    </div>
  );
};
