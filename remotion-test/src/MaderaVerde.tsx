import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Tabla} from './Tabla';

const glow = (color: string) =>
  `0 0 12px ${color}, 0 0 32px ${color}, 0 0 64px ${color}`;

const Caption: React.FC<{from: number; to: number; children: React.ReactNode; color?: string}> = ({
  from,
  to,
  children,
  color = '#b6ff7a',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || frame > to) return null;
  const s = spring({frame: frame - from, fps, config: {damping: 14}});
  const out = interpolate(frame, [to - 10, to], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 260,
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 800,
        fontSize: 76,
        lineHeight: 1.1,
        color: 'white',
        padding: '0 70px',
        boxSizing: 'border-box',
        textShadow: glow(color),
        opacity: s * out,
        transform: `translateY(${(1 - s) * 80}px) scale(${0.9 + s * 0.1})`,
      }}
    >
      {children}
    </div>
  );
};

const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const warp = interpolate(frame, [330, 640], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <ThreeCanvas width={width} height={height} camera={{position: [0, 0.6, 11], fov: 40}}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 4]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#9cff6a" />
      <Tabla warp={warp} frame={frame} />
    </ThreeCanvas>
  );
};

export const MaderaVerde: React.FC = () => {
  const frame = useCurrentFrame();
  // semi-transparent moisture haze that fades as the wood dries
  const haze = interpolate(frame, [120, 330, 640], [0, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #1d2a1a, #070907)'}}>
      <CameraMotionBlur shutterAngle={180} samples={6}>
        <Scene3D />
      </CameraMotionBlur>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(120,200,255,0) 30%, rgba(120,200,255,0.6))',
          opacity: haze,
          mixBlendMode: 'screen',
        }}
      />
      <Caption from={0} to={120}>¿Un mueble con madera verde?</Caption>
      <Caption from={120} to={330} color="#6ad1ff">Tiene más de 30% de humedad</Caption>
      <Caption from={330} to={640} color="#ff8a4a">Al secarse se encoge, se tuerce y se raja</Caption>
      <Caption from={640} to={900}>Usá madera seca: 8–12% de humedad</Caption>
    </AbsoluteFill>
  );
};
