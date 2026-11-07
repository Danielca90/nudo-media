// Tiempos del reel "Claude en el taller" (segundos del video).
// La escena 3D (public/claude-taller/escena3d.mp4) se grabó con estos mismos tiempos.
import trackJson from './track.json';

export const FPS = 30;
export const DURACION_SEG = 23.0;
export const DURACION_FRAMES = Math.round(DURACION_SEG * FPS);
export const f = (s: number) => Math.round(s * FPS);

// Posición en pantalla (px) de la cabeza de cada personaje, cuadro a cuadro.
export const TRACK = trackJson as {carp: [number, number]; claude: [number, number]}[];

export type Palabra = {text: string; t: number};
export type Linea = {
  quien: 'carp' | 'claude';
  voz: string; // archivo en public/claude-taller
  inicio: number; // cuando empieza a sonar el clip
  fin: number; // hasta cuando se ve el globo
  aparece?: number; // si el globo debe aparecer después de que empieza el audio
  volumen?: number;
  palabras: Palabra[];
};

// Palabras con su tiempo en el video = inicio del clip + (tiempo en la toma − recorte inicial).
const p = (inicio: number, recorte: number, ws: [string, number][]): Palabra[] =>
  ws.map(([text, s]) => ({text, t: inicio + (s - recorte)}));

// Versión rápida: diálogo seguido, Claude contesta apurado entre cada orden.
export const LINEAS: Linea[] = [
  {quien: 'carp', voz: 'voz-c1.mp3', inicio: 0.916, aparece: 1.55, fin: 4.1, palabras: p(0.916, 0.06, [
    ['Claude,', 0.144], ['hazme', 0.48], ['un', 0.76], ['video', 0.92], ['de', 1.16], ['cómo', 1.333], ['instalar', 1.56],
    ['un', 1.88], ['mueble', 2.0], ['de', 2.28], ['madera', 2.4], ['en', 2.6], ['la', 2.68], ['pared.', 2.8]])},
  {quien: 'claude', voz: 'voz-cl1.mp3', inicio: 4.02, fin: 4.95, palabras: p(4.02, 0.0, [['¡Ya', 0.08], ['mismo!', 0.32]])},
  {quien: 'carp', voz: 'voz-c2.mp3', inicio: 4.77, fin: 6.05, palabras: p(4.77, 3.44, [['¡Más', 3.52], ['rápido!', 3.76]])},
  {quien: 'carp', voz: 'voz-c3.mp3', inicio: 6.023, fin: 8.5, palabras: p(6.023, 5.07, [
    ['No,', 5.147], ['Claude,', 5.28], ['no.', 5.92], ['¡El', 6.133], ['modelo', 6.36], ['es', 6.56], ['al', 6.68], ['revés!', 6.8]])},
  {quien: 'claude', voz: 'voz-cl2.mp3', inicio: 8.379, fin: 9.8, palabras: p(8.379, 1.52, [['¡Perdón,', 1.591], ['perdón!', 2.24]])},
  {quien: 'carp', voz: 'voz-c4.mp3', inicio: 9.697, fin: 11.25, palabras: p(9.697, 7.84, [['No', 7.893], ['me', 7.96], ['gustó.', 8.08], ['¡Otra', 8.613], ['vez!', 8.88]])},
  {quien: 'claude', voz: 'voz-cl3.mp3', inicio: 11.176, fin: 12.7, palabras: p(11.176, 3.44, [['¡Listo!', 3.514], ['¿Así?', 4.32]])},
  {quien: 'carp', voz: 'voz-c5.mp3', inicio: 12.59, fin: 15.3, palabras: p(12.59, 9.5, [['¡Más', 9.56], ['viral!', 9.76], ['¡MÁS', 10.28], ['RÁPIDO!', 10.56]])},
  {quien: 'claude', voz: 'voz-cl4.mp3', inicio: 17.42, fin: 21.0, volumen: 1.9, palabras: p(17.42, 5.92, [
    ['Ay', 6.0], ['no…', 6.48], ['¿y', 7.653], ['ahora', 7.84], ['qué', 8.24], ['hago?', 8.56]])},
];

// Impactos del látigo (la escena 3D los anima en los mismos instantes).
export const IMPACTOS = [5.95, 11.2, 13.32, 14.17, 14.97];
export const ONOMATOPEYAS = ['¡ZAS!', '¡PAF!', '¡ZAS!', '¡PAF!', '¡ZAS!'];
export const LIMITE = 15.4; // se congela todo: aviso de límite
export const COLAPSO = 17.2; // Claude se derrumba
export const TROMBON = 20.8;
export const REVES = {inicio: 6.3, giro: 7.75, fin: 8.45}; // ventana con la repisa al revés
