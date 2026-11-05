// Parámetros compartidos por todas las composiciones. Ver ESTILO.md.
// Importante: aquí NO hay colores de marca para objetos ni fondos.
// Cada objeto usa su color real y cada video elige su fondo según el tema.
export const VIDEO = {width: 1080, height: 1920, fps: 30};

// Zonas seguras (botones y descripción de Instagram/TikTok)
export const SAFE = {top: 220, bottom: 320, right: 160, left: 60};

// Subtítulos en la zona media, no pegados arriba.
export const SUBTITULOS = {
  centroY: 0.4, // 40% del alto (≈ 770 px)
  rangoY: [0.36, 0.46],
  familia: '"Inter", "Helvetica Neue", Arial, sans-serif',
  peso: 800,
  tamano: 64,
  palabrasPorBloque: 5,
  palabraActiva: '#ffffff',
  palabraDicha: 'rgba(255,255,255,0.5)',
  contorno: 'rgba(0,0,0,0.55)', // sombra para leerse sobre cualquier fondo
};

// Solo para anotaciones. Elegir la que contraste con la escena del video.
export const ANOTACIONES = {
  resalte: ['#3b82f6', '#f59e0b', '#ffffff'],
  anillo: ['#5eead4', '#facc15', '#ffffff'],
  fuerza: ['#f97352', '#ef4444'],
  agua: '#60a5fa',
};

// Colores reales de referencia (ampliar según cada video).
export const MATERIALES = {
  pino: '#e3c48f',
  roble: '#b98a55',
  nogal: '#5b3a24',
  maderaVerde: '#a9a46a', // recién cortada, tono más apagado/verdoso
  acero: '#9aa3ab',
  metroCinta: '#f5c518', // cinta métrica amarilla con números negros
  colaBlanca: '#f4f1ea',
};

// Efectos apagados por defecto: se encienden por escena y con motivo.
export const EFECTOS_POR_DEFECTO = {motionBlur: false, glow: false, particulas: false};

export const RITMO = {segundosPorPlanoMin: 1.5, segundosPorPlanoMax: 3, ganchoMaxSegundos: 2};

// Voz que ya usa la cuenta en ElevenLabs (guardada en su workspace).
export const VOZ = {
  proveedor: 'ElevenLabs',
  nombre: 'BRIAN - VOZ PARA REDES SOCIALES',
  voiceId: 'U9TSK9KHMlMU2qkeXlQP', // español latino, joven, tono cercano
};
