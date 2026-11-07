# Escena 3D del reel

- `taller.html`: escena three.js (toon + contorno). `window.__frame(t)` dibuja el segundo `t` y devuelve la posición de las cabezas.
- Grabar: `node video.js <ruta>/taller.html <carpeta_cuadros> ../track.json` y luego
  `ffmpeg -framerate 30 -i <carpeta_cuadros>/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 ../../../public/claude-taller/escena3d.mp4`
- Cuadros sueltos de prueba: `node shot.js <ruta>/taller.html prueba 6 12.5 21`
- Necesita Playwright con Chromium (usa SwiftShader, sin GPU). ~2,5 min para 885 cuadros.
