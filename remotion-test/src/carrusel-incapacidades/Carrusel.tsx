import React from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {LAMINAS} from './Laminas';
import {FRAMES} from './tema';

export const T = 15;
export const CARRUSEL_FRAMES = LAMINAS.length * FRAMES - (LAMINAS.length - 1) * T;
export const Carrusel: React.FC = () => (
  <TransitionSeries>
    {LAMINAS.map((L, i) => (
      <React.Fragment key={i}>
        <TransitionSeries.Sequence durationInFrames={FRAMES}><L /></TransitionSeries.Sequence>
        {i < LAMINAS.length - 1 && <TransitionSeries.Transition presentation={slide({direction: 'from-right'})} timing={linearTiming({durationInFrames: T})} />}
      </React.Fragment>
    ))}
  </TransitionSeries>
);
