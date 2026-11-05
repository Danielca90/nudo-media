import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {PALABRAS, FPS} from './tiempos';
import {SUBTITULOS, VIDEO} from '../estilo';

// Palabras clave con recuadro (máximo 2 por video).
const CLAVE = new Set(['verde?', 'humedad:']);

// Agrupa en bloques de hasta 5 palabras, cortando tras puntuación.
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

export const Subtitulos: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / FPS;
  const bloque = bloques.find((b, i) => {
    const ini = PALABRAS[b[0]].start;
    const sig = bloques[i + 1];
    const fin = sig ? PALABRAS[sig[0]].start : PALABRAS[b[b.length - 1]].end + 0.8;
    return t >= ini && t < fin;
  });
  if (!bloque) return null;
  const visibles = bloque.filter((i) => PALABRAS[i].start <= t);
  const activa = visibles[visibles.length - 1];

  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top: VIDEO.height * SUBTITULOS.centroY - 60,
        textAlign: 'center',
        fontFamily: SUBTITULOS.familia,
        fontWeight: SUBTITULOS.peso,
        fontSize: SUBTITULOS.tamano,
        lineHeight: 1.25,
        textShadow: `0 3px 14px ${SUBTITULOS.contorno}, 0 1px 3px ${SUBTITULOS.contorno}`,
      }}
    >
      {visibles.map((i) => {
        const p = PALABRAS[i];
        const s = spring({frame: frame - Math.round(p.start * FPS), fps, config: {damping: 18, stiffness: 220}});
        const esClave = CLAVE.has(p.text);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 10px',
              padding: esClave ? '0 14px 4px' : 0,
              color: i === activa || esClave ? SUBTITULOS.palabraActiva : SUBTITULOS.palabraDicha,
              transform: `translateY(${(1 - s) * 18}px)`,
              opacity: s,
              borderRadius: 10,
              background: esClave ? 'rgba(37,99,235,0.85)' : 'transparent',
              boxShadow: esClave ? '0 0 0 3px rgba(147,197,253,0.9)' : 'none',
            }}
          >
            {p.text}
          </span>
        );
      })}
    </div>
  );
};
