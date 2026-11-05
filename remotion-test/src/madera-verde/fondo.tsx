import React, {createContext, useContext} from 'react';
import {AbsoluteFill} from 'remotion';
import {z} from 'zod';

// Fondos disponibles: se eligen desde el panel de props del Studio.
export const FONDOS = {
  grafito: {fondo: 'radial-gradient(ellipse at 50% 58%, #4a4d53 0%, #2a2c30 42%, #141518 80%, #0c0d0f 100%)', sombra: 0.45},
  claro: {fondo: 'radial-gradient(ellipse at 50% 55%, #fbf9f6 0%, #ebe6df 45%, #d4cec5 100%)', sombra: 0.22},
  oliva: {fondo: 'radial-gradient(ellipse at 50% 58%, #59604a 0%, #363b2c 45%, #1b1e16 100%)', sombra: 0.45},
  taller: {fondo: 'radial-gradient(ellipse at 50% 60%, #4a3a2b 0%, #2b211a 40%, #15100c 78%, #0e0b08 100%)', sombra: 0.45},
} as const;

export const esquemaVideo = z.object({
  fondo: z.enum(['grafito', 'claro', 'oliva', 'taller']),
});
export type PropsVideo = z.infer<typeof esquemaVideo>;
export type Fondo = PropsVideo['fondo'];

const FondoCtx = createContext<Fondo>('grafito');
export const FondoProvider = FondoCtx.Provider;
export const useFondo = () => FONDOS[useContext(FondoCtx)];

export const FondoVideo: React.FC = () => {
  const {fondo} = useFondo();
  return <AbsoluteFill style={{background: fondo}} />;
};
