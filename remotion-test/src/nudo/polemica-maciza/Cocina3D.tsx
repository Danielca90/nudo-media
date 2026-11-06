// Escena 3D (v2) del reel polémico "La madera maciza NO es la mejor para tu cocina".
// Cocina real con texturas fotográficas CC0 (Poly Haven) y luz de estudio HDRI:
// muebles altos con la puerta maciza (4 listones de roble) encima de la estufa, puertas vecinas pintadas
// en verde salvia, mesón de cuarzo, salpicadero de baldosa blanca, muebles bajos, olla con vapor suave,
// y muestras de contrachapado y aglomerado hidrófugo apoyadas en el salpicadero.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {continueRender, delayRender, staticFile} from 'remotion';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

export type V3 = [number, number, number];
const rnd = (i: number) => Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);

// ---------- carga de texturas (con delayRender) ----------
type Juego = {diff: THREE.Texture; nor: THREE.Texture; rough: THREE.Texture};
export type Texturas = {roble: Juego; contra: Juego; baldosa: Juego; madera: Juego; hdr: THREE.DataTexture};
let promesa: Promise<Texturas> | null = null;
const cargarTexturas = () => {
  if (promesa) return promesa;
  const tl = new THREE.TextureLoader();
  const uno = (n: string, srgb: boolean) =>
    new Promise<THREE.Texture>((ok, mal) =>
      tl.load(staticFile(`texturas/${n}.jpg`), (t) => {
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        ok(t);
      }, undefined, mal));
  const juego = async (n: string): Promise<Juego> => ({diff: await uno(`${n}_diff`, true), nor: await uno(`${n}_nor`, false), rough: await uno(`${n}_rough`, false)});
  promesa = (async () => ({
    roble: await juego('oak_veneer_01'),
    contra: await juego('plywood'),
    baldosa: await juego('long_white_tiles'),
    madera: await juego('kitchen_wood'),
    hdr: await new Promise<THREE.DataTexture>((ok, mal) => new RGBELoader().load(staticFile('texturas/estudio.hdr'), ok, undefined, mal)),
  }))();
  return promesa;
};
/** Hook para la composición (fuera del lienzo 3D): devuelve las texturas cuando están listas. */
export const useTexturas = () => {
  const [tex, setTex] = React.useState<Texturas | null>(null);
  const [h] = React.useState(() => delayRender('Texturas Poly Haven'));
  React.useEffect(() => {
    cargarTexturas().then((t) => { setTex(t); continueRender(h); }).catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
  return tex;
};

const conRepeticion = (t: THREE.Texture, rx: number, ry: number, ox = 0, oy = 0) => {
  const c = t.clone();
  c.repeat.set(rx, ry);
  c.offset.set(ox, oy);
  c.needsUpdate = true;
  return c;
};
const pbr = (j: Juego, rx: number, ry: number, ox = 0, oy = 0, extra: THREE.MeshPhysicalMaterialParameters = {}, conRugosidad = true) =>
  new THREE.MeshPhysicalMaterial({
    map: conRepeticion(j.diff, rx, ry, ox, oy), normalMap: conRepeticion(j.nor, rx, ry, ox, oy),
    ...(conRugosidad ? {roughnessMap: conRepeticion(j.rough, rx, ry, ox, oy)} : {}),
    normalScale: new THREE.Vector2(0.35, 0.35), ...extra,
  });

export const useMats = (tx: Texturas) =>
  useMemo(() => {
    const vapor = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d')!;
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(250,250,252,0.75)');
      gr.addColorStop(0.5, 'rgba(245,246,250,0.28)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const nucleo = (() => {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 64;
      const g = c.getContext('2d')!;
      g.fillStyle = '#7da36b'; g.fillRect(0, 0, 256, 64);
      for (let i = 0; i < 1400; i++) {
        g.fillStyle = rnd(i) > 0.5 ? 'rgba(52,82,40,.6)' : 'rgba(196,220,170,.55)';
        g.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 64, 1 + rnd(i + 3) * 2.5, 1 + rnd(i + 4) * 1.5);
      }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const capas = (() => {
      const c = document.createElement('canvas');
      c.width = 32; c.height = 128;
      const g = c.getContext('2d')!;
      for (let i = 0; i < 9; i++) {
        g.fillStyle = i % 2 ? '#e2c695' : '#c89c64'; g.fillRect(0, (i * 128) / 9, 32, 128 / 9 + 1);
        g.fillStyle = 'rgba(70,40,15,.55)'; g.fillRect(0, (i * 128) / 9, 32, 1.2);
      }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    return {
      // cada listón toma una zona distinta de la chapa de roble: parecen tablas distintas
      listones: [0, 1, 2, 3].map((i) => pbr(tx.roble, 0.55, 1.6, i * 0.31 + 0.07, i * 0.17, {roughness: 0.62, envMapIntensity: 0.4}, false)),
      contraCara: pbr(tx.contra, 0.6, 0.9, 0, 0, {roughness: 0.65, envMapIntensity: 0.45}, false),
      contraCanto: new THREE.MeshStandardMaterial({map: capas, roughness: 0.8}),
      baldosa: pbr(tx.baldosa, 3.2, 1.2, 0, 0, {envMapIntensity: 0.9}),
      maderaBaja: pbr(tx.madera, 0.8, 0.8, 0, 0, {roughness: 0.6, envMapIntensity: 0.4}, false),
      salvia: new THREE.MeshStandardMaterial({color: '#8d9e8a', roughness: 0.85, envMapIntensity: 0.35}),
      cuarzo: new THREE.MeshPhysicalMaterial({color: '#e6e2db', roughness: 0.3, clearcoat: 0.3, clearcoatRoughness: 0.3, envMapIntensity: 0.6}),
      pared: new THREE.MeshStandardMaterial({color: '#d9d2c6', roughness: 0.92}),
      cuerpo: new THREE.MeshStandardMaterial({color: '#efebe4', roughness: 0.7}),
      melamina: new THREE.MeshStandardMaterial({color: '#f1eee8', roughness: 0.5}),
      nucleo: new THREE.MeshStandardMaterial({map: nucleo, roughness: 0.9}),
      cantoBlanco: new THREE.MeshStandardMaterial({color: '#f4f1ec', roughness: 0.35}),
      junta: new THREE.MeshStandardMaterial({color: '#24170b', roughness: 1}),
      vidrioNegro: new THREE.MeshPhysicalMaterial({color: '#141518', roughness: 0.15, clearcoat: 0.6, envMapIntensity: 0.55}),
      acero: new THREE.MeshStandardMaterial({color: '#e2e5e8', metalness: 1, roughness: 0.32, envMapIntensity: 1.3}),
      asa: new THREE.MeshStandardMaterial({color: '#1d1d1f', roughness: 0.6}),
      tirador: new THREE.MeshStandardMaterial({color: '#b08d57', metalness: 1, roughness: 0.3}),
      led: new THREE.MeshStandardMaterial({color: '#fff3dc', emissive: '#ffe7c2', emissiveIntensity: 2.2}),
      gota: new THREE.MeshPhysicalMaterial({color: '#ffffff', transmission: 0.95, roughness: 0.03, thickness: 0.004, ior: 1.33, transparent: true}),
      vapor: new THREE.SpriteMaterial({map: vapor, transparent: true, depthWrite: false, opacity: 0.5}),
    };
  }, [tx]);
type Mats = ReturnType<typeof useMats>;

const Caja: React.FC<{tam: V3; pos?: V3; rot?: V3; mat: THREE.Material | THREE.Material[]; radio?: number}> = ({tam, pos, rot, mat, radio = 0.0015}) => {
  const g = useMemo(() => new RoundedBoxGeometry(tam[0], tam[1], tam[2], 2, Math.min(radio, Math.min(...tam) / 2.01)), [tam[0], tam[1], tam[2], radio]);
  return <mesh geometry={g} material={mat} position={pos} rotation={rot} castShadow receiveShadow />;
};

// ---------- medidas ----------
export const ALTO_MESON = 0.89;
export const ALTOS = {y0: 1.45, alto: 0.7, fondo: 0.33};
export const MACIZA = {ancho: 0.45, alto: 0.7, esp: 0.02, n: 4};
export const P_MACIZA: V3 = [-0.35, ALTOS.y0 + ALTOS.alto / 2, ALTOS.fondo + MACIZA.esp / 2];
export const P_CONTRA: V3 = [0.5, ALTO_MESON + 0.3, 0.12];
export const P_HIDRO: V3 = [0.98, ALTO_MESON + 0.3, 0.12];
export const ROT_MUESTRA: V3 = [-0.1, -0.42, 0];

/** Puerta de madera maciza de 4 listones: `humedad` -1..1, `tuerce` 0..1, `gotas` 0..1. */
export const PuertaMaciza: React.FC<{m: Mats; humedad: number; tuerce: number; gotas: number}> = ({m, humedad, tuerce, gotas}) => {
  const w = MACIZA.ancho / MACIZA.n;
  const escala = 1 + 0.06 * humedad; // exagerado para que se vea
  return (
    <group position={P_MACIZA} rotation={[0, tuerce * 0.06, tuerce * 0.025]} scale={[Math.max(escala, 1), 1, 1]}>
      {Array.from({length: MACIZA.n}, (_, i) => {
        const cx = -MACIZA.ancho / 2 + w / 2 + i * w;
        return (
          <group key={i} position={[cx, 0, 0]} rotation={[tuerce * 0.03 * (i - 1.5), (i % 2 ? 1 : -1) * tuerce * 0.09, 0]}>
            <Caja tam={[w * Math.min(escala, 1) - 0.0008, MACIZA.alto, MACIZA.esp]} mat={m.listones[i]} />
          </group>
        );
      })}
      <Caja tam={[MACIZA.ancho * 0.98, MACIZA.alto * 0.98, 0.002]} pos={[0, 0, -0.012]} mat={m.junta} radio={0.0005} />
      {/* tirador de latón */}
      <mesh material={m.tirador} position={[MACIZA.ancho / 2 - 0.04, -MACIZA.alto / 2 + 0.1, MACIZA.esp / 2 + 0.012]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 16]} />
      </mesh>
      {Array.from({length: 30}, (_, k) => {
        const s = Math.max(0, Math.min(1, gotas * 30 - k));
        if (s <= 0) return null;
        return (
          <mesh key={k} material={m.gota} position={[-0.2 + rnd(k) * 0.4, -0.33 + rnd(k + 5) * 0.4, MACIZA.esp / 2 + 0.003]} scale={[s, s * 1.3, s * 0.6]}>
            <sphereGeometry args={[0.005 + rnd(k + 9) * 0.004, 12, 10]} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Muestra de contrachapado (cara de chapa, cantos con capas) apoyada en el salpicadero. */
export const Contrachapado: React.FC<{m: Mats}> = ({m}) => (
  <group position={P_CONTRA} rotation={ROT_MUESTRA}>
    <mesh material={[m.contraCanto, m.contraCanto, m.contraCanto, m.contraCanto, m.contraCara, m.contraCara]} castShadow receiveShadow>
      <boxGeometry args={[0.4, 0.6, 0.018]} />
    </mesh>
  </group>
);

/** Muestra de aglomerado hidrófugo (núcleo verde, melamina) con canto que se sella. */
export const Hidrofugo: React.FC<{m: Mats; sellado: number}> = ({m, sellado}) => (
  <group position={P_HIDRO} rotation={ROT_MUESTRA}>
    <mesh material={[m.nucleo, m.nucleo, m.nucleo, m.nucleo, m.melamina, m.melamina]} castShadow receiveShadow>
      <boxGeometry args={[0.4, 0.6, 0.018]} />
    </mesh>
    {sellado > 0 && (
      <>
        <mesh material={m.cantoBlanco} position={[0.2008, 0.3 - (0.6 * sellado) / 2, 0]}><boxGeometry args={[0.0016, 0.6 * sellado, 0.019]} /></mesh>
        <mesh material={m.cantoBlanco} position={[0, 0.3008, 0]} scale={[sellado, 1, 1]}><boxGeometry args={[0.4, 0.0016, 0.019]} /></mesh>
      </>
    )}
  </group>
);

/** Estufa de vidrio con olla y vapor suave (sprites). */
export const OllaVapor: React.FC<{m: Mats; t: number; vapor: number; calor: number}> = ({m, t, vapor, calor}) => {
  const llama = useMemo(() => new THREE.MeshStandardMaterial({color: '#ff6a1a', emissive: '#ff4d00', emissiveIntensity: 0}), []);
  llama.emissiveIntensity = 2.2 * calor;
  return (
    <group position={[P_MACIZA[0], ALTO_MESON, 0.3]}>
      <Caja tam={[0.58, 0.008, 0.5]} pos={[0, 0.004, 0]} mat={m.vidrioNegro} radio={0.003} />
      <mesh material={llama} position={[0, 0.0085, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.09, 48]} /></mesh>
      <group position={[0, 0.009, 0]}>
        <mesh material={m.acero} position={[0, 0.075, 0]} castShadow><cylinderGeometry args={[0.11, 0.105, 0.15, 48, 1, true]} /></mesh>
        <mesh material={m.acero} position={[0, 0.002, 0]}><cylinderGeometry args={[0.105, 0.105, 0.004, 48]} /></mesh>
        <mesh material={m.acero} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.11, 0.004, 8, 48]} /></mesh>
        <mesh material={m.acero} position={[0.05, 0.163, 0]} rotation={[0, 0, 0.32]}><cylinderGeometry args={[0.113, 0.113, 0.005, 48]} /></mesh>
        <mesh material={m.asa} position={[0.042, 0.186, 0]}><sphereGeometry args={[0.013, 16, 12]} /></mesh>
        {[-1, 1].map((s) => <Caja key={s} tam={[0.05, 0.014, 0.02]} pos={[s * 0.135, 0.12, 0]} mat={m.asa} radio={0.004} />)}
        {Array.from({length: 40}, (_, k) => {
          const ciclo = 3.0;
          const fase = ((t + rnd(k) * ciclo) % ciclo) / ciclo;
          const y = 0.17 + fase * 0.85;
          const x = (rnd(k + 2) - 0.5) * 0.1 + Math.sin(t * 1.1 + k) * 0.05 * fase;
          const z = (rnd(k + 4) - 0.5) * 0.08 + fase * 0.02;
          const s = 0.06 + fase * 0.22;
          const o = vapor * Math.sin(fase * Math.PI) * 0.85;
          if (o <= 0.01) return null;
          return (
            <sprite key={k} position={[x, y, z]} scale={[s, s, s]}>
              <spriteMaterial map={m.vapor.map} transparent depthWrite={false} opacity={o} />
            </sprite>
          );
        })}
      </group>
    </group>
  );
};

/** Cocina: pared, salpicadero, muebles bajos y altos, mesón, LED. */
export const Cocina: React.FC<{m: Mats}> = ({m}) => {
  const xs = [-0.83, 0.13, 0.61];
  return (
    <group>
      <mesh material={m.pared} position={[0, 2.5, -0.002]} receiveShadow><planeGeometry args={[10, 8]} /></mesh>
      <mesh material={m.baldosa} position={[0.1, (ALTO_MESON + ALTOS.y0) / 2, 0.001]} receiveShadow><planeGeometry args={[2.6, ALTOS.y0 - ALTO_MESON]} /></mesh>
      {/* piso: solo sombra */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.6]} receiveShadow><planeGeometry args={[8, 8]} /><shadowMaterial opacity={0.4} /></mesh>
      {/* muebles bajos con frentes de madera */}
      <Caja tam={[2.6, ALTO_MESON - 0.13, 0.58]} pos={[0.1, 0.1 + (ALTO_MESON - 0.13) / 2, 0.29]} mat={m.cuerpo} />
      {[-0.95, -0.5, -0.05, 0.4, 0.85, 1.25].map((x, i) => (
        <group key={i}>
          <Caja tam={[0.445, ALTO_MESON - 0.15, 0.02]} pos={[x, 0.1 + (ALTO_MESON - 0.13) / 2, 0.59]} mat={m.maderaBaja} radio={0.002} />
          <mesh material={m.tirador} position={[x + 0.17, ALTO_MESON - 0.16, 0.612]} castShadow><cylinderGeometry args={[0.005, 0.005, 0.1, 12]} /></mesh>
        </group>
      ))}
      <Caja tam={[2.6, 0.1, 0.52]} pos={[0.1, 0.05, 0.26]} mat={m.asa} />
      {/* mesón de cuarzo */}
      <Caja tam={[2.64, 0.03, 0.62]} pos={[0.1, ALTO_MESON - 0.015, 0.31]} mat={m.cuarzo} radio={0.004} />
      {/* muebles altos */}
      <Caja tam={[1.9, ALTOS.alto, ALTOS.fondo]} pos={[-0.1, ALTOS.y0 + ALTOS.alto / 2, ALTOS.fondo / 2]} mat={m.cuerpo} />
      {xs.map((x, i) => (
        <group key={i}>
          <Caja tam={[0.45, ALTOS.alto, 0.02]} pos={[x, ALTOS.y0 + ALTOS.alto / 2, ALTOS.fondo + 0.01]} mat={m.salvia} radio={0.002} />
          <mesh material={m.tirador} position={[x + (i === 0 ? 0.185 : -0.185), ALTOS.y0 + 0.1, ALTOS.fondo + 0.032]} castShadow><cylinderGeometry args={[0.006, 0.006, 0.12, 12]} /></mesh>
        </group>
      ))}
      {/* tira LED bajo los muebles altos */}
      <mesh material={m.led} position={[-0.1, ALTOS.y0 - 0.006, ALTOS.fondo - 0.04]}><boxGeometry args={[1.8, 0.008, 0.012]} /></mesh>
      {/* frasco y tabla de picar en el mesón (vida) */}
      <mesh material={m.acero} position={[-0.95, ALTO_MESON + 0.07, 0.15]} castShadow><cylinderGeometry args={[0.045, 0.045, 0.14, 24]} /></mesh>
      <Caja tam={[0.32, 0.018, 0.22]} pos={[-0.9, ALTO_MESON + 0.009, 0.4]} rot={[0, 0.2, 0]} mat={m.listones[1]} radio={0.004} />
    </group>
  );
};

/** Luz: HDRI de estudio (reflejos reales) + clave cálida con sombras + relleno + contorno. */
export const Luces: React.FC<{tx: Texturas; calida?: number}> = ({tx, calida = 0}) => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    tx.hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pm.fromEquirectangular(tx.hdr).texture;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.95;
  }, [gl, scene, tx]);
  return (
    <>
      <hemisphereLight args={['#fff1df', '#3a3530', 0.35]} />
      <directionalLight position={[-1.4, 3.2, 2.6]} intensity={1.9 + calida * 0.6} color={calida > 0.5 ? '#ffd6a0' : '#ffe9cf'} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={4}
        shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={3} shadow-camera-bottom={-1} />
      <directionalLight position={[2.2, 1.6, 2.0]} intensity={0.5} color="#e3ecff" />
      <directionalLight position={[0, 2.4, -1.5]} intensity={0.6} color="#fff2dc" />
    </>
  );
};
