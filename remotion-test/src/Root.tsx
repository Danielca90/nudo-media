import React from 'react';
import {Composition} from 'remotion';
import {MaderaVerde} from './MaderaVerde';
import {MaderaVerdeFinal, DURACION_FRAMES} from './madera-verde/MaderaVerdeFinal';
import {esquemaVideo} from './madera-verde/fondo';
import {Reel02, DURACION_SEG as DUR_ARCA02} from './arca/reel02/Reel02';
import {Reel01, DURACION_SEG as DUR_ARCA01} from './arca/reel01/Reel01';
import {NoticiaSL1015, DURACION_SEG as DUR_SL1015} from './arca/noticia-2026-11-05-sl1015/NoticiaSL1015';

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
    id="ArcaNoticiaSL1015"
    component={NoticiaSL1015}
    durationInFrames={Math.round(DUR_SL1015 * 30)}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="ArcaReel01"
    component={Reel01}
    durationInFrames={Math.round(DUR_ARCA01 * 30)}
    fps={30}
    width={1080}
    height={1920}
  />
  <Composition
    id="ArcaReel02"
    component={Reel02}
    durationInFrames={Math.round(DUR_ARCA02 * 30)}
    fps={30}
    width={1080}
    height={1920}
  />
  </>
);
