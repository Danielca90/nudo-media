import React from 'react';
import {useFuentes} from '../carrusel-incapacidades/Base';

export const FUENTE = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
// "pop" con rebote: crece, se pasa un poco y se acomoda (principio de animación: overshoot)
export const pop = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  if (x <= 0) return 0;
  const c1 = 1.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const ConFuentes: React.FC<{children: React.ReactNode}> = ({children}) => {
  useFuentes();
  return <>{children}</>;
};
