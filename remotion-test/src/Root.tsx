import React from 'react';
import {Composition} from 'remotion';
import {MaderaVerde} from './MaderaVerde';
import {MaderaVerdeFinal, DURACION_FRAMES} from './madera-verde/MaderaVerdeFinal';
import {esquemaVideo} from './madera-verde/fondo';
import {Sorteo100, DURACION_V1} from './laser/Sorteo100';
import {CorazonLaser, DURACION_V2} from './laser/CorazonLaser';
import {NavidadCinco, DURACION_V3} from './laser/NavidadCinco';
import {ClaudeTaller, esquemaClaudeTaller} from './claude-taller/ClaudeTaller';
import {DURACION_FRAMES as DUR_CLAUDE} from './claude-taller/tiempos';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="MaderaVerde"
    component={MaderaVerde}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="MaderaVerdeFinal"
    component={MaderaVerdeFinal}
    schema={esquemaVideo}
    defaultProps={{fondo: 'grafito' as const}}
    durationInFrames={DURACION_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="ClaudeTaller"
    component={ClaudeTaller}
    schema={esquemaClaudeTaller}
    defaultProps={{conVoz: true}}
    durationInFrames={DUR_CLAUDE}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition id="LaserSorteo100" component={Sorteo100} durationInFrames={DURACION_V1} fps={30} width={1080} height={1920} />
  <Composition id="LaserCorazon" component={CorazonLaser} durationInFrames={DURACION_V2} fps={30} width={1080} height={1920} />
  <Composition id="LaserNavidad5" component={NavidadCinco} durationInFrames={DURACION_V3} fps={30} width={1080} height={1920} />
  </>
);
