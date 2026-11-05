import React, {useMemo} from 'react';
import * as THREE from 'three';

// Wooden board whose geometry cups and twists as `warp` goes 0 -> 1.
export const Tabla: React.FC<{warp: number; frame: number}> = ({warp, frame}) => {
  const {geometry, base} = useMemo(() => {
    const g = new THREE.BoxGeometry(1.4, 0.14, 4.2, 24, 2, 64);
    return {geometry: g, base: Float32Array.from(g.attributes.position.array)};
  }, []);

  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 1024;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#c9a26b';
    ctx.fillRect(0, 0, 256, 1024);
    for (let i = 0; i < 70; i++) {
      ctx.strokeStyle = `rgba(110,70,30,${0.15 + (i % 5) * 0.06})`;
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      const x0 = (i * 37) % 256;
      for (let y = 0; y <= 1024; y += 16) {
        const x = x0 + Math.sin(y / 90 + i) * 10 + Math.sin(y / 23 + i * 2) * 2;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // a knot ("nudo")
    const grd = ctx.createRadialGradient(150, 520, 2, 150, 520, 34);
    grd.addColorStop(0, '#4a2a10');
    grd.addColorStop(1, 'rgba(74,42,16,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(150, 520, 22, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }, []);

  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3];
    const y = base[i * 3 + 1];
    const z = base[i * 3 + 2];
    const cup = warp * 0.35 * x * x; // cupping across the width
    const twist = warp * 0.45 * (z / 2.1); // twist along the length
    const yy = y + cup;
    const bow = warp * 0.18 * (1 - (z / 2.1) ** 2); // bow along the length
    pos.setXYZ(
      i,
      x * Math.cos(twist) - yy * Math.sin(twist),
      x * Math.sin(twist) + yy * Math.cos(twist) + bow,
      z,
    );
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();

  const greenTint = new THREE.Color('#7fa35a').lerp(new THREE.Color('#ffffff'), warp);

  return (
    <mesh
      geometry={geometry}
      rotation={[0.55, frame * 0.035, 0.25]}
      castShadow
    >
      <meshStandardMaterial map={texture} color={greenTint} roughness={0.7} />
    </mesh>
  );
};
