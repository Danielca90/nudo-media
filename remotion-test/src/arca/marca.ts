// Identidad visual de Arca Jurídica para videos animados (motion graphics).
// Ver .claude/skills/estilo-arca-juridica/SKILL.md
import {continueRender, delayRender, staticFile} from 'remotion';

// Fuentes locales (public/fonts): el navegador de render en la nube no puede descargar de Google.
const cargar = (familia: string, archivo: string, peso: string, estilo = 'normal') => {
  if (typeof FontFace === 'undefined') return;
  const h = delayRender(`Fuente ${familia} ${estilo}`);
  const f = new FontFace(familia, `url(${staticFile('fonts/' + archivo)}) format('woff2')`, {weight: peso, style: estilo});
  f.load()
    .then(() => {
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(f);
      continueRender(h);
    })
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
};
cargar('Montserrat', 'Montserrat-var.woff2', '100 900');
cargar('Libre Baskerville', 'LibreBaskerville-var.woff2', '400 700');
cargar('Libre Baskerville', 'LibreBaskerville-italic.woff2', '400', 'italic');

export const FUENTES = {
  sans: `"Montserrat", Arial, sans-serif`,
  serif: `"Libre Baskerville", Georgia, serif`,
};

export const COLOR = {
  teal: '#1B3A3B',
  teal2: '#24504F',
  teal3: '#3A6B69',
  tealClaro: '#9FBFBB',
  dorado: '#C6A96B',
  doradoOsc: '#A8843F',
  crema: '#F8F7F2',
  pared: '#EEEAE0',
  papel: '#FFFFFF',
  tinta: '#16302F',
  alerta: '#B4532A', // solo para "error / riesgo"
  ok: '#2F7A5B',
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
// Zonas que tapa la interfaz de Instagram
export const SEGURO = {top: 200, bottom: 330, right: 150, left: 60};
