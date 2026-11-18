import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';

// Pieza 5 · 3D animada: "Pingüino saltarín". Personaje hecho de esferas, conos y un toro. Squash & stretch. Loop de 3 s.
const col = {fondoA: '#9ADCE8', fondoB: '#E8F9FF', cuerpo: '#1D2B53', panza: '#FFFFFF', pico: '#FFA630', bufanda: '#E63946', hielo: '#DFF6FF'};
const P = 45;

const Mirar: React.FC = () => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    camera.lookAt(0, 0.45, 0);
  });
  return null;
};
const M: React.FC<{c: string; r?: number}> = ({c, r = 0.55}) => <meshStandardMaterial color={c} roughness={r} />;

const Pinguino: React.FC<{f: number}> = ({f}) => {
  const u = (f % P) / P;
  const h = 4 * u * (1 - u);
  const vel = Math.abs(1 - 2 * u);
  const contacto = u < 0.12 ? 1 - u / 0.12 : u > 0.88 ? (u - 0.88) / 0.12 : 0;
  const estira = 1 + 0.2 * vel * (contacto > 0 ? 0 : 1);
  const sy = estira * (1 - 0.3 * contacto);
  const sx = (1 / Math.sqrt(estira)) * (1 + 0.22 * contacto);
  const y = h * 1.25;
  const aleteo = 0.45 + 0.5 * Math.sin((2 * Math.PI * f) / 22);
  const ojos = [28, 29, 30, 73, 74, 75].includes(f % 90) ? 0.1 : 1;
  return (
    <group position={[0, y + (1 - sy) * -0.1, 0]} scale={[sx, sy, sx]} rotation={[0, 0.35 * Math.sin((2 * Math.PI * f) / 90), 0]}>
      <mesh scale={[1, 1.25, 0.95]} castShadow><sphereGeometry args={[1, 40, 30]} /><M c={col.cuerpo} /></mesh>
      <mesh position={[0, -0.12, 0.38]} scale={[0.78, 1.05, 0.7]} castShadow><sphereGeometry args={[1, 36, 28]} /><M c={col.panza} r={0.8} /></mesh>
      <mesh position={[0, 0.24, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.72, 0.15, 14, 40]} /><M c={col.bufanda} r={0.9} /></mesh>
      <mesh position={[0.45, -0.05, 0.62]} rotation={[0.3, 0, 0.35]} castShadow><boxGeometry args={[0.18, 0.62, 0.12]} /><M c={col.bufanda} r={0.9} /></mesh>
      {[-1, 1].map((d) => (
        <group key={d}>
          <mesh position={[d * 0.34, 0.74, 0.76]} scale={[1, ojos, 1]}><sphereGeometry args={[0.2, 20, 16]} /><meshStandardMaterial color="#fff" roughness={0.3} /></mesh>
          <mesh position={[d * 0.34, 0.74, 0.93]} scale={[1, ojos, 1]}><sphereGeometry args={[0.09, 14, 12]} /><meshStandardMaterial color="#0b0b16" roughness={0.2} /></mesh>
          <mesh position={[d * 1.02, 0.0, 0]} rotation={[0, 0, -d * (0.35 + aleteo * 0.6)]} scale={[0.2, 0.75, 0.42]} castShadow><sphereGeometry args={[1, 24, 18]} /><M c={col.cuerpo} /></mesh>
          <mesh position={[d * 0.4, -1.3, 0.42]} scale={[0.38, 0.12, 0.55]} castShadow><sphereGeometry args={[1, 20, 14]} /><M c={col.pico} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.42, 1.0]} rotation={[Math.PI / 2, 0, 0]} castShadow><coneGeometry args={[0.2, 0.42, 20]} /><M c={col.pico} /></mesh>
    </group>
  );
};

const Copos: React.FC<{f: number}> = ({f}) => (
  <>
    {Array.from({length: 26}).map((_, i) => {
      const r = (k: number) => (Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;
      const k = 1 + (i % 2);
      const y = 4.2 - ((((Math.abs(r(1)) * 6 + (f * 6 * k) / 90) % 6) + 6) % 6);
      return (
        <mesh key={i} position={[(Math.abs(r(2)) - 0.5) * 7, y, (Math.abs(r(3)) - 0.5) * 3 - 1.5]}>
          <sphereGeometry args={[0.05 + Math.abs(r(4)) * 0.05, 8, 6]} />
          <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      );
    })}
  </>
);

export const Pinguino3D: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${col.fondoA} 0%, ${col.fondoB} 100%)`}}>
      <ThreeCanvas width={1080} height={1080} shadows camera={{position: [0, 2.2, 11], fov: 34}}>
        <Mirar />
        <ambientLight intensity={0.9} />
        <hemisphereLight args={['#ffffff', '#9ADCE8', 0.5]} />
        <directionalLight position={[3, 6, 5]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
        <mesh position={[0, -1.47, 0]} receiveShadow><cylinderGeometry args={[3.0, 3.2, 0.3, 40]} /><meshStandardMaterial color="#F4FCFF" roughness={0.6} /></mesh>
        <Pinguino f={f} />
        <Copos f={f} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
