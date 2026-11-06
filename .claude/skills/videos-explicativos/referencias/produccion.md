# Producción técnica

## Proyecto Remotion
- Proyecto en `remotion-test/` (Remotion 4.0.541, React 19, three 0.178, @react-three/fiber 9).
- Un video = una carpeta en `remotion-test/src/<video>/` + su `<Composition>` en `src/Root.tsx`.
- Leer antes la skill `remotion-best-practices` (reglas oficiales: todo animado con
  `useCurrentFrame()`, sin `useFrame` ni animaciones CSS, `ThreeCanvas` con ancho/alto y luces,
  assets en `public/` con `staticFile()`, audio con `<Audio>` de `@remotion/media`).

### Componentes reutilizables (en `src/madera-verde/`, copiar o generalizar)
| Archivo | Qué tiene |
|---|---|
| `camara.ts` | Cámara por claves de tiempo (`camaraEn`), `proyectar` 3D → píxeles para etiquetas, FOV compartido |
| `Overlays.tsx` | `Etiqueta` con línea guía (se mantiene dentro de pantalla), `Tarjeta` de datos con fuente, `Barra`, `Valor` |
| `Subtitulos.tsx` | Subtítulos palabra por palabra con borde negro y palabras clave con recuadro |
| `Madera3D.tsx` | Luces con sombras + contorno, `degradadoVertical`, `Flecha`, `Anillo`, `Camara`, modelos de ejemplo |
| `fondo.tsx` | Fondos seleccionables con esquema zod + contexto |
| `tiempos.ts` | Tiempos de escena según la voz y subtítulos en formato `Caption` |
| `GUION.md` | Ejemplo de plan frase → acción → imagen final |

## Voz con ElevenLabs (conector MCP)
1. `creative_create_flow` (un flow por video).
2. `creative_generate_speech` con `model_id: eleven_v4` y la `voice_id` de la skill de marca
   (deja las 2 tomas por defecto; no repetir la llamada para reintentar, cobra de nuevo).
3. `creative_get_flow_run_status` hasta `all_completed`; elegir una toma.
4. `creative_add_flow_asset_node` con el `generation_id` elegido → nodo de audio.
5. `creative_transcribe_audio` (`eleven_scribe_v1`, `connect_from` ese nodo) → tiempos por palabra.
6. Descargar el MP3 con `curl` desde `content_url` a `public/voz-<video>.mp3`
   (requiere que la red permita `elevenlabsusercontent.com`).
7. Guardar las palabras como `Caption[]` (`text`, `startMs`, `endMs`, `timestampMs: null`,
   `confidence: null`) en `subtitulos.json`.

## Render en esta nube
- La red bloquea la descarga del navegador de Remotion: usar el Chromium instalado.
- Script listo: `npm run render:madera-verde`; para otro video copiar sus flags:
  `--gl=swangle --chrome-mode=headless-shell --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
- Cuadros de prueba: `npx remotion still src/index.ts <Comp> out.png --frame=N --scale=0.25 --props='{"fondo":"grafito"}'` + los mismos flags.
- Rendimiento medido (4 CPU, sin GPU): ~0,2–0,75 s por cuadro; 26 s de video ≈ 3–6 min.
- Audio final: `ffmpeg -i in.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k out.mp4`.
- Los MP4 van en `out/` (ignorado por git). Enviar con SendUserFile.

## Studio
- `npx remotion studio src/index.ts --no-open --port 3000` + `report_preview_port`.
- Si la app del usuario no muestra la vista previa, darle los comandos para abrirlo en su Mac
  (`git clone`, `npm install`, `npx remotion studio`). No exponer el Studio con un túnel público.

## Red necesaria
`elevenlabsusercontent.com` (audio), `remotion.dev` y `github.com` (docs y skills), registro de npm.

## Flujo "escena 3D grabada + Remotion encima" (sketches y parodias con personajes)
Usado en `remotion-test/src/claude-taller/`. Sirve cuando hay personajes animados y varias versiones del mismo video.
1. Escena en una página three.js (`escena/taller.html`): sombreado toon (MeshToonMaterial + rampa de 3 tonos) y
   contorno negro (casco invertido con normales suavizadas). Todo depende de `window.__frame(t)`: determinista.
2. Grabar cuadro a cuadro con Playwright (`video.js`, SwiftShader): ~0,17 s por cuadro a 1080×1920.
   Devuelve por cuadro la posición en pantalla de las cabezas → `track.json`.
3. Generar primero las voces, transcribirlas y **ajustar los tiempos de la escena a la voz** antes de grabar.
4. Remotion: `<OffthreadVideo>` de fondo + globos de diálogo que siguen a cada personaje con `track.json`,
   ventanas 2D (pantallas, avisos), onomatopeyas, audio y efectos. Una prop (`conVoz`) saca varias versiones
   sin volver a grabar el 3D.
- En sketches los **globos de cómic reemplazan a los subtítulos centrados** (que taparían al personaje central);
  en la versión con voz las palabras se encienden al oírse.
- Efectos de sonido con ElevenLabs Sound Effects (`sfx`, 1 toma): el látigo salió como 5 chasquidos en 12 s →
  recortar uno con `silencedetect`.
- No usar dos grabaciones en paralelo sobre la misma carpeta de cuadros.
