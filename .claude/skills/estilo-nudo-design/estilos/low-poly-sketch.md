# Estilo: Low poly / sketch con personajes

Escena 3D estilo caricatura (como un videojuego isométrico) con personajes animados, grabada cuadro a cuadro,
y Remotion encima para globos de diálogo, ventanas, onomatopeyas, voces, efectos y música.
Ejemplo: "Un carpintero casual trabajando con Claude" (`remotion-test/src/claude-taller/`).

## Cuándo
Parodias, humor y sketches virales con diálogo entre personajes.

## Visual
- **Sombreado toon** de 3 tonos planos (`MeshToonMaterial` + rampa de 3 pasos) y **contorno negro**
  (casco invertido con normales suavizadas). Sombras suaves.
- Escena armada a partir de la **imagen de referencia** que manda el usuario (ej.: taller isométrico con banco,
  formones, repisa con cajas, colector de polvo, taladro de banco, cepilladora, pila de madera).
- Personajes de bloques: carpintero con delantal, gorra, lápiz en la oreja; boca que se mueve al hablar.
- **El muñequito de Claude es Claw'd**: personaje pixelado naranja (≈ `#e56f3a` en toon), cuerpo de bloque,
  **dos ojos cuadrados negros**, brazos de bloque a los lados y cuatro patitas, hecho con bloques (vóxel).
  Emociones con los ojos (normales, temblando en pánico, grandes en shock, en rayita con lágrimas) y una
  boquita solo al hablar o asustarse. **No** es el destello/asterisco.
- Efectos con motivo: gotas de sudor, líneas de velocidad y chispas del teclado, estrella de impacto,
  temblor de cámara en el frenesí.
- Cámara ortográfica (isométrica). Los planos por encima del hombro no sirven (el personaje tapa la
  pantalla): mostrar pantallas como **ventanas 2D** en Remotion.

## Ritmo: adrenalina
- **Diálogo seguido, sin espacios vacíos.** El otro personaje contesta entre cada orden
  ("¡Ya mismo!", "¡Perdón, perdón!", "¡Listo! ¿Así?").
- Cortes de cámara cada **1–2 s** (lista de tomas), escalada hacia un frenesí y un corte en seco.
- Duración ~23 s. Gancho de texto en los primeros 1,5 s.
- Estructura que funcionó: pedido → presión creciente con latigazos → frenesí → **todo se congela**
  (aviso "Alcanzaste el límite de uso de esta sesión") → remate triste del personaje.

## Texto
- **Globos de cómic** pegados a la cabeza de cada personaje (posición por cuadro desde `track.json`) en lugar
  de subtítulos centrados, que taparían al personaje central. Si el personaje está fuera de cuadro, el globo
  va abajo con la cola hacia el borde.
- Versión con voz: las palabras se encienden al oírse. Versión sin voz: el globo aparece completo.
- Onomatopeyas (¡ZAS!, ¡PAF!) al costado del personaje, sin tapar globos.
- Siempre **dos versiones**: con voz y sin voz (prop `conVoz`).

## Audio
- Voces: Brian para el carpintero / el usuario; **Lulu** (`CPv3Zr3CQCqE4ZzuCgBP`, aguda y tierna) para Claw'd.
  Generar todas las frases de un personaje en una sola toma con etiquetas `[fast]`, `[shouting]`, `[sad]`
  y cortarlas por la transcripción.
- Efectos (Sound Effects): látigo (salió como varios chasquidos: recortar uno por uno buscando los picos),
  tecleo frenético en loop, alerta de error.
- **Música** (ElevenLabs Music, `eleven_music_v2_5`, conector completo): persecución cómica instrumental
  ~170 BPM que entra con el gancho y **se corta en seco** con el congelamiento; frase lenta y triste al final.
  Si la pista dice "Instrumental: No", transcribirla: vacía = sin letra.
- El látigo debe ser lo más fuerte en cada impacto (verificar con `volumedetect`).

## Producción
1. Escena en `escena/taller.html` (three.js). Todo depende de `window.__frame(t)`; los tiempos van en un
   objeto `TL` y los planos en `SHOTS`, así retimear es cambiar números.
2. **Primero las voces**, transcribir y ajustar `TL` a los tiempos de la voz; después grabar.
3. Grabar con Playwright (`escena/video.js`): 1080×1920, ~0,17 s por cuadro (≈2 min para 23 s) → `escena3d.mp4`
   + `track.json`. No lanzar dos grabaciones sobre la misma carpeta de cuadros.
4. Remotion (`ClaudeTaller.tsx`, `tiempos.ts`): video de fondo + globos + ventanas + audio.
   Render: `npm run render:claude-voz` y `npm run render:claude-sin-voz`, luego loudnorm.
5. `escena3d.mp4` no va a git (15 MB, se regenera); voces, efectos y música sí.

## Errores a evitar
- Recortar audio con fade usando `-ss` después de `-i` sin `asetpts=PTS-STARTPTS`: el recorte queda mudo.
- Nombres de variables que choquen con los del motor (`W` era el ancho del lienzo).
- Elegir tomas sin decirle al usuario que no las escuché.

## Videos hechos
- `remotion-test/src/claude-taller/` — "Un carpintero casual trabajando con Claude" (v3, 23 s, con y sin voz,
  con música). Guion y versiones en su `GUION.md`.

## Correcciones del usuario
- 2026-11-07: el muñequito es **Claw'd** (pixelado, ojos cuadrados), no el destello.
- 2026-11-07: más adrenalina: diálogo seguido, respuestas de Claude, cortes rápidos, música de fondo; el
  látigo tiene que sonar.
- 2026-11-06: escena basada en la imagen de referencia del usuario (taller isométrico); gancho
  "Un carpintero casual trabajando con Claude"; "No, Claude, no. ¡El modelo es al revés!".
