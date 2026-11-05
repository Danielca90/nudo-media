import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {ESCENAS, f, DURACION_SEG, VOZ_ARCHIVO} from './tiempos';
import {EscenaGancho, EscenaTronco, EscenaCelulas, EscenaDirecciones, EscenaDefectos, EscenaMedir, EscenaCierre} from './Escenas';
import {Subtitulos} from './Subtitulos';
import {FondoProvider, FondoVideo, PropsVideo} from './fondo';

const FUNDIDO = 4;

const Fundido: React.FC<{total: number; children: React.ReactNode}> = ({total, children}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, FUNDIDO, total - FUNDIDO, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: op}}>{children}</AbsoluteFill>;
};

const Plano: React.FC<{desde: number; hasta: number; children: React.ReactNode}> = ({desde, hasta, children}) => {
  const ini = f(desde);
  const total = f(hasta) - ini + FUNDIDO;
  return (
    <Sequence from={ini} durationInFrames={total}>
      <Fundido total={total}>{children}</Fundido>
    </Sequence>
  );
};

export const DURACION_FRAMES = f(DURACION_SEG);
const T_CELULAS = 4.04;

export const MaderaVerdeFinal: React.FC<PropsVideo> = ({fondo}) => (
  <FondoProvider value={fondo}>
  <AbsoluteFill>
    <FondoVideo />
    <Plano desde={ESCENAS.gancho} hasta={ESCENAS.agua}>
      <EscenaGancho />
    </Plano>
    <Plano desde={ESCENAS.agua} hasta={T_CELULAS}>
      <EscenaTronco />
    </Plano>
    <Plano desde={T_CELULAS} hasta={ESCENAS.direcciones}>
      <EscenaCelulas />
    </Plano>
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
    <Audio src={staticFile(VOZ_ARCHIVO)} />
  </AbsoluteFill>
  </FondoProvider>
);
