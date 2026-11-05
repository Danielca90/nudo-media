import * as THREE from 'three';
import {Easing} from 'remotion';

export type Vec = [number, number, number];
export const FOV = 62;
const ASPECT = 1080 / 1920;

export const crearCamara = (pos: Vec, mira: Vec) => {
  const c = new THREE.PerspectiveCamera(FOV, ASPECT, 0.05, 200);
  c.position.set(...pos);
  c.lookAt(...mira);
  c.updateMatrixWorld();
  return c;
};

// Punto 3D -> píxeles en pantalla (1080x1920), con la misma cámara que el render.
export const proyectar = (p: Vec, cam: {pos: Vec; mira: Vec}) => {
  const v = new THREE.Vector3(...p).project(crearCamara(cam.pos, cam.mira));
  return {x: ((v.x + 1) / 2) * 1080, y: ((1 - v.y) / 2) * 1920};
};

export type Clave = {t: number; pos: Vec; mira: Vec};
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: Vec, b: Vec, k: number): Vec => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

// Cámara por claves de tiempo (segundos absolutos de la voz). Cada tramo dura `dur`.
export const camaraEn = (seg: number, claves: Clave[], dur = 0.7) => {
  let pos = claves[0].pos;
  let mira = claves[0].mira;
  for (let i = 1; i < claves.length; i++) {
    const c = claves[i];
    const k = Math.max(0, Math.min(1, (seg - c.t) / dur));
    pos = lerp(pos, c.pos, ease(k));
    mira = lerp(mira, c.mira, ease(k));
  }
  return {pos, mira};
};

export const rotY = (p: Vec, a: number): Vec => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
