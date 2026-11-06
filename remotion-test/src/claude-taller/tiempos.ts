// Tiempos del reel "Claude en el taller" (segundos del video).
// La escena 3D (public/claude-taller/escena3d.mp4) se grabó con estos mismos tiempos.
import trackJson from './track.json';

export const FPS = 30;
export const DURACION_SEG = 29.5;
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
  palabras: Palabra[];
};

// Palabras con su tiempo en el video = inicio del clip + (tiempo en la toma − recorte inicial).
const p = (inicio: number, recorte: number, ws: [string, number][]): Palabra[] =>
  ws.map(([text, s]) => ({text, t: inicio + (s - recorte)}));

export const LINEAS: Linea[] = [
  {quien: 'carp', voz: 'voz-1.mp3', inicio: 2.0, fin: 5.75, palabras: p(2.0, 0.05, [
    ['Claude,', 0.145], ['hazme', 0.56], ['un', 0.84], ['video', 1.04], ['de', 1.32], ['cómo', 1.48], ['instalar', 1.8],
    ['un', 2.16], ['mueble', 2.32], ['de', 2.6], ['madera', 2.747], ['en', 3.0], ['la', 3.08], ['pared.', 3.2]])},
  {quien: 'carp', voz: 'voz-2.mp3', inicio: 5.8, fin: 7.3, palabras: p(5.8, 4.08, [['¡Más', 4.16], ['rápido!', 4.4]])},
  {quien: 'carp', voz: 'voz-3.mp3', inicio: 8.4, fin: 11.6, palabras: p(8.4, 5.68, [
    ['No,', 5.76], ['Claude,', 6.16], ['no.', 6.64], ['¡El', 7.093], ['modelo', 7.36], ['es', 7.56], ['al', 7.68], ['revés!', 7.88]])},
  {quien: 'carp', voz: 'voz-4.mp3', inicio: 12.6, fin: 14.9, palabras: p(12.6, 8.98, [
    ['No', 9.04], ['me', 9.16], ['gustó.', 9.28], ['Otra', 10.0], ['vez.', 10.24]])},
  {quien: 'carp', voz: 'voz-5.mp3', inicio: 16.3, fin: 18.4, palabras: p(16.3, 11.1, [['¡MÁS', 11.16], ['RÁPIDO!', 11.52]])},
  {quien: 'claude', voz: 'voz-claude.mp3', inicio: 23.9, fin: 28.0, palabras: p(23.9, 0.08, [
    ['Ay', 0.16], ['no…', 0.64], ['¿y', 1.88], ['ahora', 2.0], ['qué', 2.4], ['hago?', 2.72]])},
];

// Impactos del látigo (la escena 3D los anima en los mismos instantes).
export const IMPACTOS = [6.72, 14.32, 17.82, 18.77, 19.72];
export const ONOMATOPEYAS = ['¡ZAS!', '¡PAF!', '¡ZAS!', '¡PAF!', '¡ZAS!'];
export const LIMITE = 20.3; // se congela todo: aviso de límite
export const COLAPSO = 23.6; // Claude se derrumba
export const TROMBON = 27.3;
export const REVES = {inicio: 8.7, giro: 10.6, fin: 11.9}; // ventana con la repisa al revés
