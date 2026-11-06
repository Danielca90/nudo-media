// Fuentes locales para los reels de Nudo (el navegador de render no descarga de Google Fonts).
import {continueRender, delayRender, staticFile} from 'remotion';

const cargar = (familia: string, archivo: string, peso: string) => {
  if (typeof FontFace === 'undefined') return;
  const h = delayRender(`Fuente ${familia}`);
  const f = new FontFace(familia, `url(${staticFile('fonts/' + archivo)}) format('woff2')`, {weight: peso});
  f.load()
    .then(() => {
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(f);
      continueRender(h);
    })
    .catch(() => continueRender(h));
};
cargar('Anton', 'Anton.woff2', '400');
cargar('Montserrat', 'Montserrat-var.woff2', '100 900');

export const NUDO_FUENTES = {titular: '"Anton", Impact, sans-serif', sans: '"Montserrat", Arial, sans-serif'};
