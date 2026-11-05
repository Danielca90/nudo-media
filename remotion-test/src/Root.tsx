import React from 'react';
import {Composition} from 'remotion';
import {MaderaVerde} from './MaderaVerde';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MaderaVerde"
    component={MaderaVerde}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
  />
);
