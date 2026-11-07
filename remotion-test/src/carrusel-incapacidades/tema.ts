// Sistema de temas Arca Jurídica: misma identidad (tipografía, estructura, marca, objetos recortados)
// con paletas y "sabores" de movimiento distintos para alternar entre piezas.
export const TEMA_A = {
  verde: '#1C453F', oro: '#A48843', oroClaro: '#D8BC74', oroTxt: '#A48843',
  navy: '#2B3648', navyOsc: '#18202D', hueso: '#EDEDEB', taupe: '#6D6359', rojo: '#B3202E',
  panelOsc: '#141C29', panelProf: '#0F2F2A', glowNavy: '#475775', glowVerde: '#2A6158', baseVerde: '#12302B',
  ventana: '#C9CCD2', pastilla: '#8B94C4', pastillaTxt: '#FFFFFF', alerta: '#F08A92',
};
// Paleta B (referencia del usuario): Lime Green, Metallic Gold, Muted Teal, Deep Space Blue, Dark Amethyst
export const TEMA_B = {
  verde: '#1B5560', oro: '#CAAC4B', oroClaro: '#E6F9AF', oroTxt: '#9C7F1E',
  navy: '#18314F', navyOsc: '#0D0630', hueso: '#F2F6E4', taupe: '#5F7F7B', rojo: '#B3202E',
  panelOsc: '#090421', panelProf: '#0F3340', glowNavy: '#2E5483', glowVerde: '#3B8B8C', baseVerde: '#0F2D3A',
  ventana: '#CFE3DE', pastilla: '#8BBEB2', pastillaTxt: '#0D0630', alerta: '#F08A92',
};
export const EST_A = {deco: 'nieve', apertura: 'ranura', chip: 'redondo', fondo: 'liso'} as {deco: string; apertura: string; chip: string; fondo: string};
export const EST_B = {deco: 'estrellas', apertura: 'circulo', chip: 'tarjeta', fondo: 'aurora'} as {deco: string; apertura: string; chip: string; fondo: string};

export const C: typeof TEMA_A = {...TEMA_A};
export const EST = {...EST_A};
export const TEMAS = {A: {c: TEMA_A, e: EST_A}, B: {c: TEMA_B, e: EST_B}};
export type TemaId = keyof typeof TEMAS;
export const aplicarTema = (k: TemaId) => {
  Object.assign(C, TEMAS[k].c);
  Object.assign(EST, TEMAS[k].e);
};

export const W = 1080;
export const H = 1350;
export const FPS = 30;
export const FRAMES = 150;
export const SERIF = "'Playfair Display', Georgia, serif";
export const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
