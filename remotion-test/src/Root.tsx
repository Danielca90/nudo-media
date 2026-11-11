import React from 'react';
import {Composition} from 'remotion';
import {MaderaVerde} from './MaderaVerde';
import {MaderaVerdeFinal, DURACION_FRAMES} from './madera-verde/MaderaVerdeFinal';
import {esquemaVideo} from './madera-verde/fondo';
import {LAMINAS} from './carrusel-incapacidades/Laminas';
import {Carrusel, CARRUSEL_FRAMES} from './carrusel-incapacidades/Carrusel';
import {conTema} from './carrusel-incapacidades/Tema';
import {V1Permisos} from './videos-15s/V1Permisos';
import {V2Dominical} from './videos-15s/V2Dominical';
import {V3Alcohol} from './videos-15s/V3Alcohol';
import {V4Camaras} from './videos-15s/V4Camaras';
import {RetablosLaser} from './retablos-laser/RetablosLaser';
import {RetablosLaserV2} from './retablos-laser/RetablosLaserV2';
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
    <Composition key={i} id={`IncapacidadesL${i + 1}`} component={conTema('A', L)} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
  ))}
  <Composition id="IncapacidadesCarrusel" component={conTema('A', Carrusel)} durationInFrames={CARRUSEL_FRAMES} fps={FPS} width={W} height={H} />
  <Composition id="ArcaPermisos" component={conTema('A', V1Permisos)} durationInFrames={450} fps={30} width={1080} height={1920} />
  <Composition id="ArcaDominical" component={conTema('A', V2Dominical)} durationInFrames={450} fps={30} width={1080} height={1920} />
  {LAMINAS.map((L, i) => (
    <Composition key={`b${i}`} id={`IncapacidadesBL${i + 1}`} component={conTema('B', L)} durationInFrames={FRAMES} fps={FPS} width={W} height={H} />
  ))}
  <Composition id="IncapacidadesCarruselB" component={conTema('B', Carrusel)} durationInFrames={CARRUSEL_FRAMES} fps={FPS} width={W} height={H} />
  <Composition id="ArcaPermisosB" component={conTema('B', V1Permisos)} durationInFrames={450} fps={30} width={1080} height={1920} />
  <Composition id="ArcaDominicalB" component={conTema('B', V2Dominical)} durationInFrames={450} fps={30} width={1080} height={1920} />
  <Composition id="ArcaAlcohol" component={conTema('B', V3Alcohol)} durationInFrames={450} fps={30} width={1080} height={1920} />
  <Composition id="ArcaCamaras" component={conTema('A', V4Camaras)} durationInFrames={450} fps={30} width={1080} height={1920} />
  <Composition id="NudoRetablosLaser" component={RetablosLaser} durationInFrames={300} fps={30} width={1080} height={1920} />
  <Composition id="NudoRetablosLaserV2" component={RetablosLaserV2} durationInFrames={270} fps={30} width={1080} height={1920} />
  </>
);
