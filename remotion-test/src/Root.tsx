import React from 'react';
import {Composition} from 'remotion';
import {MaderaVerde} from './MaderaVerde';
import {MaderaVerdeFinal, DURACION_FRAMES} from './madera-verde/MaderaVerdeFinal';
import {esquemaVideo} from './madera-verde/fondo';
import {LAMINAS} from './carrusel-incapacidades/Laminas';
import {W, H, FPS, FRAMES} from './carrusel-incapacidades/tema';

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
  {LAMINAS.map((L, i) => (
    <Composition key={i} id={`IncapacidadesL${i + 1}`} component={L} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
  ))}
  </>
);
