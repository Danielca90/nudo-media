// Parámetros de estilo compartidos por todas las composiciones. Ver ESTILO.md.
export const VIDEO = {width: 1080, height: 1920, fps: 30};

// Zonas seguras (botones y descripción de Instagram/TikTok)
export const SAFE = {top: 220, bottom: 320, right: 160, left: 60};

export const COLORES = {
  fondoTaller: ['#2a1d14', '#0b0806'], // gradiente radial cálido (modo objeto)
  palabraActiva: '#ffffff',
  palabraDicha: 'rgba(255,255,255,0.45)',
  resalte: '#3b82f6', // recuadro de palabra clave
  anillo: '#5eead4', // anillo que señala una parte
  fuerza: '#f97352', // flechas de fuerza / empuje
  agua: '#60a5fa', // humedad, agua
  maderaSeca: '#c9a26b',
  maderaVerde: '#8fa866',
};

export const TIPO = {
  familia: '"Nunito", "Helvetica Neue", Arial, sans-serif',
  peso: 800,
  tamano: 64,
  palabrasPorBloque: 5,
};

// Efectos apagados por defecto: se encienden por escena y con motivo.
export const EFECTOS_POR_DEFECTO = {
  motionBlur: false,
  glow: false,
  particulas: false,
};

export const RITMO = {
  segundosPorPlanoMin: 1.5,
  segundosPorPlanoMax: 3,
  ganchoMaxSegundos: 2,
};
