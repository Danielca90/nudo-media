import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';

// Pieza 4 · 3D: "Isla flotante low-poly". Formas simples (cilindros, conos, cajas y esferas). Giro de 360° en 8 s (loop).
const LOOP = 240;
const col = {cielo1: '#BFE7FF', cielo2: '#FFF1D2', pasto: '#7BD389', roca: '#8F7E73', rocaOsc: '#6F6158', tronco: '#8B5E3C', pino1: '#2E9E6B', pino2: '#47C78A', casa: '#FFE0B2', techo: '#E4572E', puerta: '#6D4C41', agua: '#4FC3F7', nube: '#FFFFFF'};

const Mirar: React.FC = () => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0, 0.6, 0);
  });
  return null;
};

const M: React.FC<{c: string}> = ({c}) => <meshStandardMaterial color={c} flatShading roughness={0.9} />;

const Pino: React.FC<{x: number; z: number; s: number}> = ({x, z, s}) => (
  <group position={[x, 0.3, z]} scale={s}>
    <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.1, 0.15, 0.6, 6]} /><M c={col.tronco} /></mesh>
    <mesh position={[0, 0.95, 0]} castShadow><coneGeometry args={[0.62, 0.95, 7]} /><M c={col.pino1} /></mesh>
    <mesh position={[0, 1.5, 0]} castShadow><coneGeometry args={[0.46, 0.85, 7]} /><M c={col.pino2} /></mesh>
  </group>
);

const Flor: React.FC<{x: number; z: number; c: string}> = ({x, z, c}) => (
  <group position={[x, 0.33, z]}>
    <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.015, 0.015, 0.2, 5]} /><M c="#3A9B58" /></mesh>
    <mesh position={[0, 0.22, 0]} castShadow><sphereGeometry args={[0.09, 8, 6]} /><M c={c} /></mesh>
  </group>
);

const Nube: React.FC<{ang: number; r: number; y: number; s: number}> = ({ang, r, y, s}) => (
  <group position={[Math.cos(ang) * r, y, Math.sin(ang) * r]} scale={s}>
    <mesh><sphereGeometry args={[0.45, 10, 8]} /><meshStandardMaterial color={col.nube} flatShading /></mesh>
    <mesh position={[0.5, -0.08, 0.05]}><sphereGeometry args={[0.35, 10, 8]} /><meshStandardMaterial color={col.nube} flatShading /></mesh>
    <mesh position={[-0.48, -0.1, -0.05]}><sphereGeometry args={[0.32, 10, 8]} /><meshStandardMaterial color={col.nube} flatShading /></mesh>
  </group>
);

const Escena: React.FC<{f: number}> = ({f}) => {
  const a = (2 * Math.PI * f) / LOOP;
  const flota = 0.12 * Math.sin(a * 2);
  return (
    <>
      <Mirar />
      <ambientLight intensity={0.8} />
      <hemisphereLight args={['#ffffff', '#c9e8ff', 0.5]} />
      <directionalLight position={[5, 8, 4]} intensity={1.7} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} />
      <group position={[0, flota, 0]} rotation={[0, a, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow castShadow><cylinderGeometry args={[3, 2.9, 0.6, 9]} /><M c={col.pasto} /></mesh>
        <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]} castShadow><coneGeometry args={[2.9, 2.3, 9]} /><M c={col.roca} /></mesh>
        <mesh position={[0.6, -2.0, 0.3]} rotation={[Math.PI, 0, 0]} castShadow><coneGeometry args={[1.0, 1.3, 7]} /><M c={col.rocaOsc} /></mesh>
        {/* casita */}
        <group position={[-0.9, 0.3, 0.3]} rotation={[0, 0.4, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[1.3, 0.9, 1.1]} /><M c={col.casa} /></mesh>
          <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[1.15, 0.8, 4]} /><M c={col.techo} /></mesh>
          <mesh position={[0.35, 1.45, -0.15]} castShadow><boxGeometry args={[0.22, 0.45, 0.22]} /><M c={col.puerta} /></mesh>
          <mesh position={[0, 0.33, 0.56]}><boxGeometry args={[0.3, 0.6, 0.04]} /><M c={col.puerta} /></mesh>
          <mesh position={[-0.42, 0.55, 0.56]}><boxGeometry args={[0.24, 0.24, 0.04]} /><M c={col.agua} /></mesh>
          <mesh position={[0.42, 0.55, 0.56]}><boxGeometry args={[0.24, 0.24, 0.04]} /><M c={col.agua} /></mesh>
        </group>
        {/* estanque */}
        <mesh position={[1.25, 0.31, 0.85]} receiveShadow><cylinderGeometry args={[0.75, 0.75, 0.05, 14]} /><meshStandardMaterial color={col.agua} flatShading roughness={0.3} /></mesh>
        <Pino x={1.6} z={-1.1} s={1.15} />
        <Pino x={0.4} z={-1.6} s={0.85} />
        <Pino x={-1.9} z={-0.9} s={1.0} />
        <Pino x={-0.4} z={1.9} s={0.75} />
        <Pino x={2.2} z={0.1} s={0.7} />
        <Flor x={0.1} z={0.9} c="#FF5A4F" />
        <Flor x={-0.4} z={1.1} c="#FFC857" />
        <Flor x={0.5} z={1.2} c="#FF8FB1" />
        <Flor x={-1.6} z={1.2} c="#FFC857" />
      </group>
      <Nube ang={-a * 1.0 + 0.5} r={4.3} y={2.4} s={1.0} />
      <Nube ang={-a * 1.0 + 2.7} r={4.8} y={1.2} s={0.8} />
      <Nube ang={-a * 1.0 + 4.6} r={4.1} y={3.0} s={0.9} />
    </>
  );
};

export const Isla3D: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${col.cielo1} 0%, ${col.cielo2} 100%)`}}>
      <div style={{position: 'absolute', left: 290, right: 290, bottom: 70, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(20,60,90,0.28), rgba(20,60,90,0) 70%)', transform: `scale(${1 - 0.06 * Math.sin((4 * Math.PI * f) / LOOP)})`}} />
      <ThreeCanvas width={1080} height={1080} shadows camera={{position: [7.2, 5.2, 8.6], fov: 34}}>
        <Escena f={f} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
