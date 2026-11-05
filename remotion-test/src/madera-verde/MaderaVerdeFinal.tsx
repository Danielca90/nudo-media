import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {ESCENAS, f, DURACION_SEG} from './tiempos';
import {FondoTaller, EscenaTabla, EscenaDirecciones, EscenaDefectos, EscenaMedir, EscenaCierre} from './Escenas';
import {Subtitulos} from './Subtitulos';

const FUNDIDO = 6; // frames de fundido entre planos

const Plano: React.FC<{desde: number; hasta: number; children: React.ReactNode}> = ({desde, hasta, children}) => {
  const ini = f(desde);
  const fin = f(hasta);
  return (
    <Sequence from={ini} durationInFrames={fin - ini + FUNDIDO}>
      <Fundido total={fin - ini + FUNDIDO}>{children}</Fundido>
    </Sequence>
  );
};

const Fundido: React.FC<{total: number; children: React.ReactNode}> = ({total, children}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, FUNDIDO, total - FUNDIDO, total], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{opacity: op}}>{children}</AbsoluteFill>;
};

export const DURACION_FRAMES = f(DURACION_SEG);

export const MaderaVerdeFinal: React.FC = () => (
  <AbsoluteFill>
    <FondoTaller />
    <Sequence durationInFrames={f(ESCENAS.direcciones) + FUNDIDO}>
      <Fundido total={f(ESCENAS.direcciones) + FUNDIDO}>
        <EscenaTabla />
      </Fundido>
    </Sequence>
    <Plano desde={ESCENAS.direcciones} hasta={ESCENAS.defectos}>
      <EscenaDirecciones />
    </Plano>
    <Plano desde={ESCENAS.defectos} hasta={ESCENAS.medir}>
      <EscenaDefectos />
    </Plano>
    <Plano desde={ESCENAS.medir} hasta={ESCENAS.cierre}>
      <EscenaMedir />
    </Plano>
    <Plano desde={ESCENAS.cierre} hasta={DURACION_SEG}>
      <EscenaCierre />
    </Plano>
    <Subtitulos />
  </AbsoluteFill>
);
