import type {Caption} from '@remotion/captions';
import subtitulos from './subtitulos.json';

export const FPS = 30;
export const f = (seg: number) => Math.round(seg * FPS);

// Palabras de la voz con sus tiempos (formato Caption oficial de Remotion).
export const CAPTIONS = subtitulos as Caption[];
export type Palabra = {text: string; start: number; end: number};
export const PALABRAS: Palabra[] = CAPTIONS.map((c) => ({text: c.text, start: c.startMs / 1000, end: c.endMs / 1000}));
export const DURACION_SEG = 26.5;
export const VOZ_ARCHIVO = 'voz-madera-verde.mp3';

// Inicio de cada escena (segundos), según la voz.
export const ESCENAS = {
  gancho: 0, // ¿Qué pasa si haces un mueble con madera verde?
  agua: 2.68, // La madera recién cortada tiene más de 30% de agua.
  seca: 6.37, // Dentro de tu casa se seca hasta 10... y se encoge.
  direcciones: 10.85, // casi nada a lo largo, y mucho a lo ancho.
  defectos: 14.96, // se curvan, juntas se abren, grietas
  medir: 19.16, // mide la humedad: entre 8 y 12%
  cierre: 23.24, // Así tu mueble se queda como lo diseñaste.
};
