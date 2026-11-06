// Escena 3D del reel polémico "La madera maciza NO es la mejor para tu cocina" (Nudo Design).
// Puerta de madera maciza de 4 listones encolados (se hincha, se encoge, se tuerce y abre las juntas),
// olla con vapor y gotas (la humedad), contrachapado con capas visibles y aglomerado hidrófugo (núcleo verde)
// con canto sellado. Unidades en metros; todo determinista según las props.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

export type V3 = [number, number, number];
const rnd = (i: number) => Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);

const lienzo = (w: number, h: number, pinta: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  pinta(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const vetaRoble = (base: string, semilla: number) =>
  lienzo(256, 1024, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 256, 1024);
    for (let k = 0; k < 70; k++) {
      g.strokeStyle = `rgba(95,58,28,${0.05 + rnd(k + semilla) * 0.16})`;
      g.lineWidth = 1 + rnd(k + 7 + semilla) * 3;
      g.beginPath();
      const x0 = rnd(k + 3 + semilla) * 256;
      g.moveTo(x0, 0);
      g.bezierCurveTo(x0 + 9 * Math.sin(k + semilla), 320, x0 - 11 * Math.cos(k), 700, x0 + 5, 1024);
      g.stroke();
    }
    // radios medulares (manchas típicas del roble)
    for (let k = 0; k < 18; k++) {
      g.fillStyle = `rgba(230,200,150,${0.15 + rnd(k + semilla * 3) * 0.2})`;
      g.fillRect(rnd(k + 11 + semilla) * 240, rnd(k + 13 + semilla) * 1000, 6 + rnd(k) * 10, 2);
    }
  });

export const useMats = () =>
  useMemo(() => {
    const capas = lienzo(64, 256, (g) => {
      for (let i = 0; i < 9; i++) {
        g.fillStyle = i % 2 ? '#d9b98a' : '#b88d5a';
        g.fillRect(0, (i * 256) / 9, 64, 256 / 9);
        g.fillStyle = 'rgba(60,35,15,.6)';
        g.fillRect(0, (i * 256) / 9, 64, 2);
      }
    });
    const nucleoVerde = lienzo(256, 64, (g) => {
      g.fillStyle = '#6f9a5a'; g.fillRect(0, 0, 256, 64);
      for (let i = 0; i < 900; i++) {
        g.fillStyle = rnd(i) > 0.5 ? 'rgba(40,70,30,.55)' : 'rgba(180,210,150,.5)';
        g.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 64, 1 + rnd(i + 3) * 3, 1 + rnd(i + 4) * 2);
      }
    });
    return {
      listones: [0, 1, 2, 3].map((i) =>
        new THREE.MeshPhysicalMaterial({map: vetaRoble(['#c99c62', '#bf9258', '#cfa56c', '#c4975c'][i], i * 31), roughness: 0.62, clearcoat: 0.2,
          clearcoatRoughness: 0.5, envMapIntensity: 0.5})),
      chapa: new THREE.MeshPhysicalMaterial({map: vetaRoble('#d6b07a', 99), roughness: 0.6, clearcoat: 0.15, envMapIntensity: 0.5}),
      capas: new THREE.MeshStandardMaterial({map: capas, roughness: 0.8}),
      melamina: new THREE.MeshStandardMaterial({color: '#ece8e1', roughness: 0.55, envMapIntensity: 0.6}),
      nucleo: new THREE.MeshStandardMaterial({map: nucleoVerde, roughness: 0.9}),
      canto: new THREE.MeshStandardMaterial({color: '#e2ddd4', roughness: 0.4}),
      junta: new THREE.MeshStandardMaterial({color: '#2b1a0c', roughness: 1}),
      olla: new THREE.MeshStandardMaterial({color: '#d0d3d6', metalness: 1, roughness: 0.22}),
      asa: new THREE.MeshStandardMaterial({color: '#1d1d1f', roughness: 0.7}),
      estufa: new THREE.MeshStandardMaterial({color: '#18191b', roughness: 0.35, metalness: 0.2}),
      vapor: new THREE.MeshStandardMaterial({color: '#ffffff', transparent: true, opacity: 0.18, roughness: 1, depthWrite: false}),
      gota: new THREE.MeshPhysicalMaterial({color: '#ffffff', transmission: 0.9, roughness: 0.05, thickness: 0.004, ior: 1.33, transparent: true}),
    };
  }, []);

const Caja: React.FC<{tam: V3; pos?: V3; rot?: V3; mat: THREE.Material | THREE.Material[]; radio?: number}> = ({tam, pos, rot, mat, radio = 0.0015}) => {
  const g = useMemo(() => new RoundedBoxGeometry(tam[0], tam[1], tam[2], 2, Math.min(radio, Math.min(...tam) / 2.01)), [tam[0], tam[1], tam[2], radio]);
  return <mesh geometry={g} material={mat} position={pos} rotation={rot} castShadow receiveShadow />;
};

export const MACIZA = {ancho: 0.45, alto: 0.7, esp: 0.02, n: 4};

/**
 * Puerta de madera maciza. `humedad` -1..1 (encoge..hincha) cambia el ancho de cada listón alrededor de
 * su centro (así se abren juntas al encoger); `tuerce` 0..1 abarquilla los listones y alabea la puerta.
 */
export const PuertaMaciza: React.FC<{pos: V3; humedad: number; tuerce: number; gotas: number}> = ({pos, humedad, tuerce, gotas}) => {
  const m = useMats();
  const w = MACIZA.ancho / MACIZA.n;
  const escala = 1 + 0.06 * humedad; // exagerado para que se vea
  return (
    <group position={pos} rotation={[0, tuerce * 0.06, tuerce * 0.025]} scale={[Math.max(escala, 1), 1, 1]}>
      {Array.from({length: MACIZA.n}, (_, i) => {
        const cx = -MACIZA.ancho / 2 + w / 2 + i * w;
        const cupo = (i % 2 ? 1 : -1) * tuerce * 0.09;
        return (
          <group key={i} position={[cx, 0, 0]} rotation={[tuerce * 0.03 * (i - 1.5), cupo, 0]}>
            <Caja tam={[w * Math.min(escala, 1.0) - 0.0008, MACIZA.alto, MACIZA.esp]} mat={m.listones[i]} />
          </group>
        );
      })}
      {/* fondo oscuro detrás de las juntas: se ve cuando se abren */}
      <Caja tam={[MACIZA.ancho * 0.98, MACIZA.alto * 0.98, 0.002]} pos={[0, 0, -0.012]} mat={m.junta} radio={0.0005} />
      {/* gotas de condensación */}
      {Array.from({length: 26}, (_, k) => {
        const s = Math.max(0, Math.min(1, gotas * 26 - k));
        if (s <= 0) return null;
        return (
          <mesh key={k} material={m.gota} position={[-0.2 + rnd(k) * 0.4, -0.32 + rnd(k + 5) * 0.5, MACIZA.esp / 2 + 0.003]} scale={[s, s * 1.3, s * 0.6]}>
            <sphereGeometry args={[0.005 + rnd(k + 9) * 0.004, 12, 10]} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Tablero contrachapado: caras de chapa de roble y cantos con las capas cruzadas a la vista. */
export const Contrachapado: React.FC<{pos: V3; rot?: V3; tam?: V3}> = ({pos, rot, tam = [0.42, 0.62, 0.018]}) => {
  const m = useMats();
  const mats = [m.capas, m.capas, m.capas, m.capas, m.chapa, m.chapa];
  return (
    <group position={pos} rotation={rot}>
      <mesh material={mats} castShadow receiveShadow><boxGeometry args={tam} /></mesh>
    </group>
  );
};

/** Aglomerado hidrófugo (núcleo verde) con melamina; el canto se sella con cinta cuando `sellado` sube. */
export const Hidrofugo: React.FC<{pos: V3; rot?: V3; sellado: number; tam?: V3}> = ({pos, rot, sellado, tam = [0.42, 0.62, 0.018]}) => {
  const m = useMats();
  const mats = [m.nucleo, m.nucleo, m.nucleo, m.nucleo, m.melamina, m.melamina];
  return (
    <group position={pos} rotation={rot}>
      <mesh material={mats} castShadow receiveShadow><boxGeometry args={tam} /></mesh>
      {/* cinta de canto que va cubriendo el borde (sellado) */}
      {sellado > 0 && (
        <>
          <mesh material={m.canto} position={[tam[0] / 2 + 0.0008, tam[1] / 2 - (tam[1] * sellado) / 2, 0]}><boxGeometry args={[0.0016, tam[1] * sellado, tam[2] + 0.001]} /></mesh>
          <mesh material={m.canto} position={[0, tam[1] / 2 + 0.0008, 0]} scale={[sellado, 1, 1]}><boxGeometry args={[tam[0], 0.0016, tam[2] + 0.001]} /></mesh>
        </>
      )}
    </group>
  );
};

/** Estufa con olla hirviendo y vapor que sube (determinista). */
export const OllaVapor: React.FC<{pos: V3; t: number; vapor: number; calor: number}> = ({pos, t, vapor, calor}) => {
  const m = useMats();
  const llama = useMemo(() => new THREE.MeshStandardMaterial({color: '#ff7a1a', emissive: '#ff5a00', emissiveIntensity: 0, roughness: 0.6}), []);
  llama.emissiveIntensity = 1.6 * calor;
  return (
    <group position={pos}>
      <Caja tam={[0.5, 0.03, 0.34]} pos={[0, -0.015, 0]} mat={m.estufa} radio={0.004} />
      <mesh material={llama} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.07, 0.008, 10, 40]} /></mesh>
      <mesh material={m.olla} position={[0, 0.075, 0]} castShadow><cylinderGeometry args={[0.11, 0.1, 0.14, 40, 1, true]} /></mesh>
      <mesh material={m.olla} position={[0, 0.006, 0]}><cylinderGeometry args={[0.1, 0.1, 0.004, 40]} /></mesh>
      <mesh material={m.olla} position={[0, 0.148, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.11, 0.004, 8, 48]} /></mesh>
      {/* tapa entreabierta: deja salir el vapor */}
      <mesh material={m.olla} position={[0.05, 0.16, 0]} rotation={[0, 0, 0.35]}><cylinderGeometry args={[0.112, 0.112, 0.006, 40]} /></mesh>
      <mesh material={m.asa} position={[0.04, 0.185, 0]} rotation={[0, 0, 0.35]}><sphereGeometry args={[0.014, 16, 12]} /></mesh>
      {[-1, 1].map((s) => <Caja key={s} tam={[0.05, 0.014, 0.02]} pos={[s * 0.135, 0.12, 0]} mat={m.asa} radio={0.004} />)}
      {/* vapor: bocanadas que suben, se expanden y se desvanecen */}
      {Array.from({length: 46}, (_, k) => {
        const ciclo = 2.6;
        const fase = ((t + rnd(k) * ciclo) % ciclo) / ciclo;
        const y = 0.16 + fase * 0.75;
        const x = (rnd(k + 2) - 0.5) * 0.12 + Math.sin(t * 1.3 + k) * 0.03 * fase;
        const z = (rnd(k + 4) - 0.5) * 0.1;
        const s = 0.025 + fase * 0.07;
        const o = vapor * Math.sin(fase * Math.PI) * 0.9;
        if (o <= 0.01) return null;
        return (
          <mesh key={k} position={[x, y, z]} scale={s}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.16 * o} roughness={1} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const Entorno: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.95;
  }, [gl, scene]);
  return null;
};

export const Luces: React.FC<{calida?: number}> = ({calida = 0}) => (
  <>
    <Entorno />
    <hemisphereLight args={['#fff4e6', '#2a2622', 0.35]} />
    <directionalLight position={[1.2, 2.4, 2.2]} intensity={2.0 + calida * 0.8} color={calida > 0.5 ? '#ffd9a8' : '#ffe8cc'} castShadow
      shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0006} shadow-normalBias={0.02}
      shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={1.5} shadow-camera-bottom={-1.5} />
    <directionalLight position={[-2, 1.2, 1.5]} intensity={0.45} color="#dfe8ff" />
    <directionalLight position={[0.3, 1.6, -2]} intensity={1.1} color="#fff2dc" />
  </>
);

/** Piso que solo recibe sombra (combina con el fondo grafito). */
export const PisoSombra: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow><planeGeometry args={[8, 8]} /><shadowMaterial opacity={0.45} /></mesh>
);
