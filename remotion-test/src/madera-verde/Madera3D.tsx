import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {MATERIALES, ANOTACIONES} from '../estilo';
import {FOV} from './camara';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {useFondo} from './fondo';

// ---------- Texturas (colores reales de la madera) ----------
const texturaVeta = () => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 1024;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 1024);
  // veta "catedral" de tabla aserrada plana
  for (let k = 0; k < 14; k++) {
    ctx.strokeStyle = `rgba(120,80,40,${0.18 + (k % 3) * 0.07})`;
    ctx.lineWidth = 2 + (k % 2) * 2;
    ctx.beginPath();
    const w = 30 + k * 17;
    for (let y = 0; y <= 1024; y += 8) {
      const ondula = Math.sin(y / 70 + k) * 4;
      const x = 256 + Math.sign(Math.sin(k)) * 0 + (w * Math.pow(Math.abs((y - 560) / 560), 1.6) + 6 * k) * (k % 2 ? 1 : -1) + ondula;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(140,95,50,${0.06 + (i % 4) * 0.03})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const x0 = (i * 53) % 512;
    ctx.moveTo(x0, 0);
    ctx.bezierCurveTo(x0 + 8, 300, x0 - 8, 700, x0 + 4, 1024);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

// Testa (sección): anillos de crecimiento con el centro (médula) debajo de la tabla.
const texturaTesta = () => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f2e6d4';
  ctx.fillRect(0, 0, 512, 128);
  for (let r = 40; r < 900; r += 16) {
    ctx.strokeStyle = `rgba(130,85,45,${0.35 + ((r / 16) % 3) * 0.1})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 128 + 260, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const VERDE = new THREE.Color(MATERIALES.maderaVerde);
const SECA = new THREE.Color(MATERIALES.pino);

// ---------- Tabla ----------
export type TablaProps = {
  ancho?: number;
  largo?: number;
  espesor?: number;
  seca?: number; // 0 verde -> 1 seca (color)
  encoge?: number; // 0..1 reducción de ancho (exagerada para que se vea)
  curva?: number; // 0..1 abarquillado (bordes que suben)
  grieta?: number; // 0..1 grieta que avanza desde la punta
  curvaMax?: number; // altura máxima del abarquillado
  position?: [number, number, number];
  rotation?: [number, number, number];
};

export const Tabla: React.FC<TablaProps> = ({
  ancho = 1.6,
  largo = 4.4,
  espesor = 0.2,
  seca = 0,
  encoge = 0,
  curva = 0,
  grieta = 0,
  curvaMax = 0.22,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  const {geo, base} = useMemo(() => {
    const g = new THREE.BoxGeometry(ancho, espesor, largo, 28, 2, 8);
    return {geo: g, base: Float32Array.from(g.attributes.position.array)};
  }, [ancho, largo, espesor]);
  const veta = useMemo(texturaVeta, []);
  const testa = useMemo(texturaTesta, []);

  const escalaX = 1 - 0.12 * encoge;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const hw = ancho / 2;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3] * escalaX;
    const y = base[i * 3 + 1];
    const z = base[i * 3 + 2];
    pos.setXYZ(i, x, y + curva * curvaMax * (x / hw) ** 2, z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const color = VERDE.clone().lerp(SECA, seca);
  const caraProps = {color, roughness: 0.55 + seca * 0.3};
  const testaColor = new THREE.Color('#d8cdb0').lerp(new THREE.Color('#ffffff'), seca);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial attach="material-0" {...caraProps} />
        <meshStandardMaterial attach="material-1" {...caraProps} />
        <meshStandardMaterial attach="material-2" map={veta} {...caraProps} />
        <meshStandardMaterial attach="material-3" map={veta} {...caraProps} />
        <meshStandardMaterial attach="material-4" map={testa} color={testaColor} roughness={0.8} />
        <meshStandardMaterial attach="material-5" map={testa} color={testaColor} roughness={0.8} />
      </mesh>
      {grieta > 0 && (
        <mesh position={[0.18, espesor / 2 + curva * 0.004 + 0.003, largo / 2 - (grieta * 1.4) / 2]}>
          <boxGeometry args={[0.035, 0.01, grieta * 1.4]} />
          <meshBasicMaterial color="#2a1a0e" />
        </mesh>
      )}
      {grieta > 0 && (
        <mesh position={[0.18, espesor / 2 - (espesor * 0.75 * grieta) / 2 + curva * 0.004, largo / 2 + 0.004]}>
          <boxGeometry args={[0.03, espesor * 0.75 * grieta, 0.01]} />
          <meshBasicMaterial color="#2a1a0e" />
        </mesh>
      )}
    </group>
  );
};

// ---------- Gotas de agua (transparencia con motivo: es agua) ----------
const GOTAS: [number, number, number][] = Array.from({length: 26}, (_, i) => [
  ((i * 0.37) % 1.3) - 0.65,
  0,
  ((i * 0.613) % 4) - 2,
]);
export const Gotas: React.FC<{cantidad: number; y: number}> = ({cantidad, y}) => (
  <group>
    {GOTAS.map((g, i) => {
      const r = 0.07 + (i % 3) * 0.025;
      const s = Math.max(0, Math.min(1, cantidad * 1.3 - (i % 5) * 0.06));
      if (s <= 0) return null;
      return (
        <mesh key={i} position={[g[0], y + r * 0.25 * s, g[2]]} scale={[r * s, r * 0.45 * s, r * s]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={ANOTACIONES.agua} transparent opacity={0.55} roughness={0.05} metalness={0.1} />
        </mesh>
      );
    })}
  </group>
);

// ---------- Flecha (fuerza / dirección) ----------
export const Flecha: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  largo?: number;
  opacidad?: number;
}> = ({position, rotation = [0, 0, 0], color, largo = 0.6, opacidad = 1}) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, largo / 2, 0]}>
      <cylinderGeometry args={[0.045, 0.045, largo, 16]} />
      <meshStandardMaterial color={color} transparent opacity={opacidad} />
    </mesh>
    <mesh position={[0, largo + 0.1, 0]}>
      <coneGeometry args={[0.11, 0.22, 20]} />
      <meshStandardMaterial color={color} transparent opacity={opacidad} />
    </mesh>
  </group>
);

// ---------- Anillo que señala (se dibuja) ----------
export const Anillo: React.FC<{position: [number, number, number]; progreso: number; radio?: number; color?: string}> = ({
  position,
  progreso,
  radio = 0.32,
  color = ANOTACIONES.anillo[1],
}) => {
  const {camera} = useThree();
  if (progreso <= 0) return null;
  return (
    <mesh position={position} quaternion={camera.quaternion}>
      <torusGeometry args={[radio, 0.025, 8, 64, Math.PI * 2 * Math.min(1, progreso)]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

// ---------- Cámara ----------
export const Camara: React.FC<{pos: [number, number, number]; mira: [number, number, number]}> = ({pos, mira}) => {
  const {camera} = useThree();
  (camera as THREE.PerspectiveCamera).fov = FOV;
  (camera as THREE.PerspectiveCamera).near = 0.05;
  camera.position.set(...pos);
  camera.lookAt(...mira);
  camera.updateProjectionMatrix();
  return null;
};

export const Luces: React.FC<{calida?: boolean}> = ({calida = true}) => (
  <>
    <hemisphereLight args={[calida ? '#fff3e2' : '#ffffff', '#2a2622', 0.7]} />
    <directionalLight
      position={[4, 8, 5]}
      intensity={2.6}
      color={calida ? '#ffe6c4' : '#ffffff'}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.0015}
      shadow-normalBias={0.06}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={6}
      shadow-camera-bottom={-6}
    />
    {/* luz de relleno suave del otro lado */}
    <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#dfe8ff" />
    {/* luz de contorno desde atrás: separa el objeto del fondo */}
    <directionalLight position={[-2, 4, -6]} intensity={1.4} color="#fff2dc" />
  </>
);

// Degradado vertical en los vértices: más oscuro abajo, más claro arriba (da volumen).
export const degradadoVertical = (g: THREE.BufferGeometry, minimo = 0.55) => {
  g.computeBoundingBox();
  const {min, max} = g.boundingBox!;
  const pos = g.attributes.position;
  const colores = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - min.y) / (max.y - min.y || 1);
    const c = minimo + (1 - minimo) * Math.pow(t, 0.8);
    colores.set([c, c, c], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(colores, 3));
  return g;
};

// ---------- Mesa: tablero de 3 tablas encoladas + patas + faldón ----------
export const ANCHO_TABLA = 0.9;
export const LARGO_MESA = 3.2;
export const ALTO_MESA = 1.45; // cara superior del tablero
export const xTabla = (k: number, sep: number) => k * (ANCHO_TABLA + sep);

export const Mesa: React.FC<{seca?: number; curva?: number; junta?: number; grieta?: number}> = ({
  seca = 1,
  curva = 0,
  junta = 0,
  grieta = 0,
}) => {
  const sep = 0.07 * junta;
  const color = VERDE.clone().lerp(SECA, seca).multiplyScalar(0.92);
  const geoPata = useMemo(() => degradadoVertical(new RoundedBoxGeometry(0.15, ALTO_MESA - 0.12, 0.15, 4, 0.03)), []);
  const geoFaldon = useMemo(() => degradadoVertical(new RoundedBoxGeometry(2.3, 0.18, 0.06, 3, 0.015), 0.75), []);
  const {sombra} = useFondo();
  const pata = (x: number, z: number) => (
    <mesh key={`${x}${z}`} geometry={geoPata} position={[x, (ALTO_MESA - 0.12) / 2, z]} castShadow receiveShadow>
      <meshStandardMaterial color={color} vertexColors roughness={0.6} />
    </mesh>
  );
  return (
    <group>
      {[-1, 0, 1].map((k) => (
        <Tabla
          key={k}
          ancho={ANCHO_TABLA}
          largo={LARGO_MESA}
          espesor={0.12}
          seca={seca}
          // tablas alternadas: la del medio va con los anillos al revés
          curva={curva}
          curvaMax={0.07}
          grieta={k === 1 ? grieta : 0}
          position={[xTabla(k, sep), ALTO_MESA - 0.06, 0]}
          rotation={k === 0 ? [0, 0, Math.PI] : [0, 0, 0]}
        />
      ))}
      {pata(-1.15, -1.3)}
      {pata(1.15, -1.3)}
      {pata(-1.15, 1.3)}
      {pata(1.15, 1.3)}
      {/* faldón */}
      <mesh geometry={geoFaldon} position={[0, ALTO_MESA - 0.22, 1.3]} castShadow receiveShadow>
        <meshStandardMaterial color={color} vertexColors roughness={0.6} />
      </mesh>
      <mesh geometry={geoFaldon} position={[0, ALTO_MESA - 0.22, -1.3]} castShadow receiveShadow>
        <meshStandardMaterial color={color} vertexColors roughness={0.6} />
      </mesh>
      {/* piso invisible: solo muestra la sombra, combina con cualquier fondo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <shadowMaterial opacity={sombra} />
      </mesh>
    </group>
  );
};

// ---------- Tronco recién cortado ----------
const texturaCorte = () => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#d9c79a';
  ctx.fillRect(0, 0, 512, 512);
  for (let r = 8; r < 250; r += 11) {
    ctx.strokeStyle = `rgba(140,100,50,${0.35 + ((r / 11) % 3) * 0.12})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(256 + Math.sin(r) * 3, 256 + Math.cos(r) * 3, r, r * 0.97, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a5a33';
  ctx.beginPath();
  ctx.arc(256, 256, 7, 0, Math.PI * 2);
  ctx.fill();
  // albura húmeda (más clara) en el borde
  const g = ctx.createRadialGradient(256, 256, 190, 256, 256, 256);
  g.addColorStop(0, 'rgba(235,225,180,0)');
  g.addColorStop(1, 'rgba(235,225,180,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
const texturaCorteza = () => {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#4b3a2c';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 160; i++) {
    ctx.strokeStyle = i % 2 ? 'rgba(25,18,12,0.55)' : 'rgba(110,90,70,0.35)';
    ctx.lineWidth = 2 + (i % 4);
    const x = (i * 37) % 512;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y <= 512; y += 32) ctx.lineTo(x + Math.sin(y / 40 + i) * 8, y);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
  return t;
};

export const Tronco: React.FC<{radio?: number; largo?: number}> = ({radio = 1.15, largo = 3.4}) => {
  const corte = useMemo(texturaCorte, []);
  const corteza = useMemo(texturaCorteza, []);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[radio, radio * 1.03, largo, 48, 1]} />
      <meshStandardMaterial attach="material-0" map={corteza} roughness={1} />
      <meshStandardMaterial attach="material-1" map={corte} roughness={0.8} />
      <meshStandardMaterial attach="material-2" map={corte} roughness={0.8} />
    </mesh>
  );
};
