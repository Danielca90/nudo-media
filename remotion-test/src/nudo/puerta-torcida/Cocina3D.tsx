// Escena 3D del reel "¿La puerta de tu cocina quedó torcida?" (Nudo Design).
// Mueble bajo de cocina con dos puertas de roble, mesón de granito, salpicadero de baldosa, grifo,
// cajonera al lado y bisagras de cazoleta modeladas por piezas (cazoleta, brazo, base, tornillos).
// Unidades en metros. Todo depende solo de las props (determinista por cuadro).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

export type V3 = [number, number, number];

// ---------- medidas del mueble ----------
export const M = {
  ancho: 0.9, // mueble
  y0: 0.1, // zócalo
  alto: 0.72, // cuerpo
  fondo: 0.56,
  t: 0.018, // tablero de 18 mm
  meson: 0.03,
};
export const PUERTA = {xIzq: 0.0015, xDer: 0.4485, yIni: 0.102, yFin: 0.818, esp: 0.018};
export const Y_BISAGRAS = [PUERTA.yFin - 0.1, PUERTA.yIni + 0.1];
export const PIVOTE: V3 = [PUERTA.xDer, 0, M.fondo];
const X_CAZOLETA = -0.0225; // desde el canto de la bisagra, en coordenadas de la puerta
const PLACA = {x: 0.4285, z: 0.5};

// ---------- estado de la puerta derecha ----------
export type EstadoPuerta = {abre: number; lado: number; alto: number; prof: number; inclina: number};

/** Transforma un punto local de la puerta derecha (origen en el canto de bisagras, cara trasera) al mundo. */
export const puntoPuerta = (p: V3, e: EstadoPuerta): V3 => {
  // 1) inclinación alrededor de la esquina superior del lado de bisagras
  const yTop = PUERTA.yFin;
  const c = Math.cos(e.inclina), s = Math.sin(e.inclina);
  let x = p[0] * c - (p[1] - yTop) * s;
  let y = p[0] * s + (p[1] - yTop) * c + yTop;
  let z = p[2];
  // 2) ajustes de los tornillos
  x += e.lado; y += e.alto; z += e.prof;
  // 3) apertura alrededor del eje vertical de las bisagras
  const ca = Math.cos(e.abre), sa = Math.sin(e.abre);
  const xr = x * ca + z * sa;
  const zr = -x * sa + z * ca;
  return [PIVOTE[0] + xr, y, PIVOTE[2] + zr];
};

// ---------- materiales y texturas ----------
const lienzo = (w: number, h: number, pinta: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  pinta(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
const rnd = (i: number) => Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);

const useMateriales = () =>
  useMemo(() => {
    const roble = lienzo(512, 1024, (g) => {
      g.fillStyle = '#c9a06a'; g.fillRect(0, 0, 512, 1024);
      for (let k = 0; k < 120; k++) {
        g.strokeStyle = `rgba(110,70,35,${0.05 + rnd(k) * 0.12})`;
        g.lineWidth = 1 + rnd(k + 9) * 3;
        g.beginPath();
        const x0 = rnd(k + 3) * 512;
        g.moveTo(x0, 0);
        g.bezierCurveTo(x0 + 10 * Math.sin(k), 300, x0 - 12 * Math.cos(k), 700, x0 + 6, 1024);
        g.stroke();
      }
    });
    const granito = lienzo(512, 512, (g) => {
      g.fillStyle = '#2f3033'; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2600; i++) {
        const v = rnd(i);
        g.fillStyle = v > 0.85 ? 'rgba(230,230,225,.55)' : v > 0.6 ? 'rgba(120,120,118,.5)' : 'rgba(10,10,10,.5)';
        g.fillRect(rnd(i + 1) * 512, rnd(i + 2) * 512, 1 + rnd(i + 3) * 3, 1 + rnd(i + 4) * 3);
      }
    });
    const baldosa = lienzo(512, 512, (g) => {
      g.fillStyle = '#d9d6cf'; g.fillRect(0, 0, 512, 512);
      for (let f = 0; f < 8; f++) for (let k = -1; k < 4; k++) {
        const x = k * 128 + (f % 2) * 64 + 3, y = f * 64 + 3;
        g.fillStyle = '#f4f2ed'; g.fillRect(x, y, 122, 58);
        g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + 4, y + 4, 60, 6);
      }
    });
    baldosa.wrapS = baldosa.wrapT = THREE.RepeatWrapping;
    baldosa.repeat.set(3, 1.4);
    return {
      puerta: new THREE.MeshPhysicalMaterial({map: roble, roughness: 0.7, clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.45}),
      melamina: new THREE.MeshStandardMaterial({color: '#e8e4dc', roughness: 0.75, envMapIntensity: 0.5}),
      canto: new THREE.MeshStandardMaterial({color: '#b58b57', roughness: 0.6}),
      granito: new THREE.MeshPhysicalMaterial({map: granito, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.1}),
      baldosa: new THREE.MeshStandardMaterial({map: baldosa, roughness: 0.35}),
      pared: new THREE.MeshStandardMaterial({color: '#34363a', roughness: 0.9}),
      acero: new THREE.MeshStandardMaterial({color: '#c9ccd0', metalness: 1, roughness: 0.28}),
      niquel: new THREE.MeshStandardMaterial({color: '#d7d9dc', metalness: 1, roughness: 0.18}),
      cazoleta: new THREE.MeshStandardMaterial({color: '#a9adb2', metalness: 1, roughness: 0.42}),
      hueco: new THREE.MeshStandardMaterial({color: '#3a2a1a', roughness: 0.9}),
      mango: new THREE.MeshStandardMaterial({color: '#f2c230', roughness: 0.45}),
      mangoGoma: new THREE.MeshStandardMaterial({color: '#1d1d1f', roughness: 0.8}),
      grifo: new THREE.MeshStandardMaterial({color: '#e6e8ea', metalness: 1, roughness: 0.12}),
      zocalo: new THREE.MeshStandardMaterial({color: '#2a2b2e', roughness: 0.7}),
    };
  }, []);

const Caja: React.FC<{tam: V3; pos: V3; mat: THREE.Material; radio?: number; rot?: V3}> = ({tam, pos, mat, radio = 0.002, rot}) => {
  const g = useMemo(() => new RoundedBoxGeometry(tam[0], tam[1], tam[2], 3, Math.min(radio, Math.min(...tam) / 2.01)), [tam[0], tam[1], tam[2], radio]);
  return <mesh geometry={g} material={mat} position={pos} rotation={rot} castShadow receiveShadow />;
};

/** Barra (brazo de bisagra) entre dos puntos. */
const Brazo: React.FC<{a: V3; b: V3; ancho: number; alto: number; mat: THREE.Material}> = ({a, b, ancho, alto, mat}) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  const largo = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.normalize());
  const mid = va.clone().add(vb).multiplyScalar(0.5);
  const g = useMemo(() => new RoundedBoxGeometry(ancho, alto, Math.max(largo, 0.001), 3, 0.002), [ancho, alto, Math.round(largo * 1000)]);
  return <mesh geometry={g} material={mat} position={mid.toArray() as V3} quaternion={q} castShadow />;
};

/** Tornillo de cabeza redonda con ranura en cruz; eje a lo largo de X (cabeza hacia -X). */
export const Tornillo: React.FC<{pos: V3; giro?: number; mats: ReturnType<typeof useMateriales>; r?: number}> = ({pos, giro = 0, mats, r = 0.0042}) => (
  <group position={pos} rotation={[giro, 0, 0]}>
    <mesh material={mats.niquel} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[r, r * 1.05, r * 0.7, 24]} />
    </mesh>
    <mesh material={mats.hueco} position={[-r * 0.36, 0, 0]}><boxGeometry args={[0.0008, r * 1.5, r * 0.3]} /></mesh>
    <mesh material={mats.hueco} position={[-r * 0.36, 0, 0]}><boxGeometry args={[0.0008, r * 0.3, r * 1.5]} /></mesh>
  </group>
);

export type GirosTornillos = {lado: number; prof: number; base: number};

/** Una bisagra de cazoleta: cazoleta en la puerta, base en el costado, brazo entre ambas y 4 tornillos. */
const Bisagra: React.FC<{yh: number; e: EstadoPuerta; giros: GirosTornillos; mats: ReturnType<typeof useMateriales>}> = ({yh, e, giros, mats}) => {
  const cazo = puntoPuerta([X_CAZOLETA, yh, -0.003], e);
  const placa: V3 = [PLACA.x - 0.004, yh, PLACA.z + 0.012];
  const en = (k: number): V3 => [cazo[0] + (placa[0] - cazo[0]) * k, cazo[1] + (placa[1] - cazo[1]) * k, cazo[2] + (placa[2] - cazo[2]) * k];
  const t1 = en(0.32), t2 = en(0.74);
  const cazoNormal = puntoPuerta([X_CAZOLETA, yh, -0.01], e);
  return (
    <group>
      {/* cazoleta (copa) empotrada en la puerta */}
      <mesh material={mats.cazoleta} position={cazo} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(...cazoNormal).sub(new THREE.Vector3(...cazo)).normalize())} castShadow>
        <cylinderGeometry args={[0.0215, 0.0215, 0.004, 40]} />
      </mesh>
      {/* base atornillada al costado */}
      <Caja tam={[0.006, 0.05, 0.036]} pos={[PLACA.x, yh, PLACA.z]} mat={mats.cazoleta} radio={0.0025} />
      {/* brazo */}
      <Brazo a={cazo} b={placa} ancho={0.012} alto={0.016} mat={mats.acero} />
      {/* tornillos: 1 lateral (adelante), 2 profundidad (atrás), 3 altura (base) */}
      <Tornillo pos={[t1[0] - 0.007, t1[1], t1[2]]} giro={giros.lado} mats={mats} />
      <Tornillo pos={[t2[0] - 0.007, t2[1], t2[2]]} giro={giros.prof} mats={mats} />
      <Tornillo pos={[PLACA.x - 0.0035, yh + 0.017, PLACA.z]} giro={giros.base} mats={mats} r={0.0036} />
      <Tornillo pos={[PLACA.x - 0.0035, yh - 0.017, PLACA.z]} giro={giros.base} mats={mats} r={0.0036} />
    </group>
  );
};

/** Posición de los tornillos de la bisagra superior (para etiquetas y destornillador). */
export const tornillosBisagra = (yh: number, e: EstadoPuerta) => {
  const cazo = puntoPuerta([X_CAZOLETA, yh, -0.003], e);
  const placa: V3 = [PLACA.x - 0.004, yh, PLACA.z + 0.012];
  const en = (k: number): V3 => [cazo[0] + (placa[0] - cazo[0]) * k - 0.007, cazo[1], cazo[2] + (placa[2] - cazo[2]) * k];
  return {lado: en(0.32), prof: en(0.74), base: [PLACA.x - 0.0035, yh + 0.017, PLACA.z] as V3, cazoleta: cazo};
};

const Puerta: React.FC<{x0: number; x1: number; mats: ReturnType<typeof useMateriales>}> = ({x0, x1, mats}) => {
  const w = x1 - x0, h = PUERTA.yFin - PUERTA.yIni;
  return <Caja tam={[w, h, PUERTA.esp]} pos={[(x0 + x1) / 2, (PUERTA.yIni + PUERTA.yFin) / 2, M.fondo + PUERTA.esp / 2]} mat={mats.puerta} radio={0.0025} />;
};

/** Tirador de barra en acero. */
const Tirador: React.FC<{pos: V3; mats: ReturnType<typeof useMateriales>}> = ({pos, mats}) => (
  <group position={pos}>
    <mesh material={mats.acero} castShadow><cylinderGeometry args={[0.006, 0.006, 0.16, 20]} /></mesh>
    {[-0.064, 0.064].map((y) => (
      <mesh key={y} material={mats.acero} position={[0, y, -0.012]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.024, 12]} />
      </mesh>
    ))}
  </group>
);

/** Destornillador de estrella: eje a lo largo de X, punta en `punta`, mango hacia -X. */
export const Destornillador: React.FC<{punta: V3; giro: number; op?: number; escala?: number}> = ({punta, giro, escala = 1}) => {
  const mats = useMateriales();
  return (
    <group position={punta} rotation={[giro, 0, 0]} scale={escala}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* punta y vástago */}
        <mesh material={mats.acero} position={[0, 0.04, 0]} castShadow><cylinderGeometry args={[0.0028, 0.0028, 0.08, 16]} /></mesh>
        <mesh material={mats.acero} position={[0, 0.0015, 0]}><coneGeometry args={[0.0028, 0.006, 4]} /></mesh>
        {/* casquillo */}
        <mesh material={mats.acero} position={[0, 0.084, 0]} castShadow><cylinderGeometry args={[0.006, 0.0045, 0.01, 20]} /></mesh>
        {/* mango amarillo con zonas de goma */}
        <mesh material={mats.mango} position={[0, 0.135, 0]} castShadow><cylinderGeometry args={[0.0135, 0.011, 0.09, 24]} /></mesh>
        {Array.from({length: 6}, (_, i) => (
          <mesh key={i} material={mats.mangoGoma} position={[Math.cos((i / 6) * Math.PI * 2) * 0.0125, 0.135, Math.sin((i / 6) * Math.PI * 2) * 0.0125]}>
            <boxGeometry args={[0.004, 0.07, 0.004]} />
          </mesh>
        ))}
        <mesh material={mats.mangoGoma} position={[0, 0.183, 0]} castShadow><sphereGeometry args={[0.0128, 20, 12]} /></mesh>
      </group>
    </group>
  );
};

/** Luz de entorno de estudio para reflejos reales en el metal. */
const Entorno: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.9;
  }, [gl, scene]);
  return null;
};

export const Luces: React.FC = () => (
  <>
    <Entorno />
    <hemisphereLight args={['#fff4e6', '#2a2622', 0.35]} />
    <directionalLight position={[1.6, 2.8, 2.4]} intensity={2.2} color="#ffe8cc" castShadow
      shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0006} shadow-normalBias={0.02}
      shadow-camera-left={-1.6} shadow-camera-right={1.6} shadow-camera-top={1.6} shadow-camera-bottom={-1.6} />
    <directionalLight position={[-2, 1.2, 1.5]} intensity={0.45} color="#dfe8ff" />
    <directionalLight position={[0.5, 1.6, -2]} intensity={1.0} color="#fff2dc" />
    {/* luz interior suave para ver la bisagra dentro del mueble */}
    <pointLight position={[0.2, 0.7, 0.45]} intensity={0.35} distance={1.2} color="#fff1dd" />
  </>
);

/** Cocina completa. */
export const Cocina: React.FC<{e: EstadoPuerta; giros: GirosTornillos}> = ({e, giros}) => {
  const mats = useMateriales();
  const {ancho, y0, alto, fondo, t, meson} = M;
  const yTop = y0 + alto;
  const tirIzq: V3 = [-0.04, PUERTA.yFin - 0.13, fondo + PUERTA.esp + 0.012];
  const tirDerLocal: V3 = [-(PUERTA.xDer - 0.04), PUERTA.yFin - 0.13, PUERTA.esp + 0.012];
  return (
    <group>
      {/* pared y salpicadero */}
      <mesh material={mats.pared} position={[0, 1.2, -0.005]} receiveShadow><planeGeometry args={[4, 2.6]} /></mesh>
      <mesh material={mats.baldosa} position={[-0.45, yTop + meson + 0.32, 0.002]} receiveShadow><planeGeometry args={[1.9, 0.64]} /></mesh>
      {/* piso: solo sombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.4]} receiveShadow><planeGeometry args={[6, 6]} /><shadowMaterial opacity={0.45} /></mesh>
      {/* cuerpo del mueble */}
      <Caja tam={[t, alto, fondo]} pos={[-ancho / 2 + t / 2, y0 + alto / 2, fondo / 2]} mat={mats.melamina} />
      <Caja tam={[t, alto, fondo]} pos={[ancho / 2 - t / 2, y0 + alto / 2, fondo / 2]} mat={mats.melamina} />
      <Caja tam={[ancho - 2 * t, t, fondo]} pos={[0, y0 + t / 2, fondo / 2]} mat={mats.melamina} />
      <Caja tam={[ancho - 2 * t, t, 0.1]} pos={[0, yTop - t / 2, fondo - 0.05]} mat={mats.melamina} />
      <Caja tam={[ancho - 2 * t, alto, 0.006]} pos={[0, y0 + alto / 2, 0.003]} mat={mats.melamina} />
      <Caja tam={[ancho - 2 * t, t, fondo - 0.03]} pos={[0, y0 + alto * 0.48, fondo / 2]} mat={mats.melamina} />
      {/* ollas en el entrepaño (contexto, se ven al abrir) */}
      <mesh material={mats.acero} position={[0.2, y0 + alto * 0.48 + t / 2 + 0.06, 0.28]} castShadow><cylinderGeometry args={[0.09, 0.09, 0.12, 32]} /></mesh>
      <mesh material={mats.acero} position={[0.2, y0 + alto * 0.48 + t / 2 + 0.125, 0.28]}><cylinderGeometry args={[0.093, 0.093, 0.008, 32]} /></mesh>
      <Caja tam={[ancho, y0 - 0.002, fondo - 0.06]} pos={[0, (y0 - 0.002) / 2, (fondo - 0.06) / 2]} mat={mats.zocalo} />
      {/* mesón de granito */}
      <Caja tam={[1.95, meson, fondo + 0.04]} pos={[-0.47, yTop + meson / 2, (fondo + 0.04) / 2]} mat={mats.granito} radio={0.004} />
      {/* grifo */}
      <group position={[-0.62, yTop + meson, 0.2]}>
        <mesh material={mats.grifo} position={[0, 0.12, 0]} castShadow><cylinderGeometry args={[0.014, 0.018, 0.24, 24]} /></mesh>
        <mesh material={mats.grifo} position={[0, 0.24, 0.07]} rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[0.07, 0.012, 16, 32, Math.PI]} /></mesh>
        <mesh material={mats.grifo} position={[0, 0.2, 0.14]} castShadow><cylinderGeometry args={[0.011, 0.011, 0.08, 16]} /></mesh>
        <mesh material={mats.grifo} position={[0.04, 0.05, 0]} rotation={[0, 0, -Math.PI / 4]}><cylinderGeometry args={[0.006, 0.006, 0.06, 12]} /></mesh>
      </group>
      {/* cajonera vecina a la izquierda */}
      {[0, 1, 2].map((k) => (
        <group key={k}>
          <Caja tam={[0.597, 0.235, 0.018]} pos={[-0.75, y0 + 0.12 + k * 0.24, fondo + 0.009]} mat={mats.puerta} radio={0.0025} />
          <mesh material={mats.acero} position={[-0.75, y0 + 0.19 + k * 0.24, fondo + 0.03]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.16, 16]} />
          </mesh>
        </group>
      ))}
      <Caja tam={[0.6, alto, fondo]} pos={[-0.75, y0 + alto / 2, fondo / 2 - 0.001]} mat={mats.melamina} />
      {/* puerta izquierda fija */}
      <Puerta x0={-PUERTA.xDer} x1={-PUERTA.xIzq} mats={mats} />
      <Tirador pos={tirIzq} mats={mats} />
      {/* puerta derecha (la torcida) */}
      <group position={PIVOTE} rotation={[0, e.abre, 0]}>
        <group position={[e.lado, e.alto, e.prof]}>
          <group position={[0, PUERTA.yFin, 0]} rotation={[0, 0, e.inclina]}>
            <group position={[0, -PUERTA.yFin, 0]}>
              <Caja tam={[PUERTA.xDer - PUERTA.xIzq, PUERTA.yFin - PUERTA.yIni, PUERTA.esp]} pos={[-(PUERTA.xDer - PUERTA.xIzq) / 2, (PUERTA.yIni + PUERTA.yFin) / 2, PUERTA.esp / 2]}
                mat={mats.puerta} radio={0.0025} />
              {/* perforaciones de las cazoletas en la cara trasera */}
              {Y_BISAGRAS.map((yh) => (
                <mesh key={yh} material={mats.hueco} position={[X_CAZOLETA, yh, -0.0004]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.0222, 40]} /></mesh>
              ))}
              <Tirador pos={tirDerLocal} mats={mats} />
            </group>
          </group>
        </group>
      </group>
      {Y_BISAGRAS.map((yh) => <Bisagra key={yh} yh={yh} e={e} giros={giros} mats={mats} />)}
    </group>
  );
};
