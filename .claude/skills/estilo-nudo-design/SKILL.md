---
name: estilo-nudo-design
description: Estilo de los videos de Nudo Design (@somos_nudodesign), marca de muebles y diseño en madera. Nudo tiene VARIOS estilos de video (solo Remotion, SketchUp + Blender, low poly / sketch con personajes…); el usuario dice cuál usar. Úsala junto con la skill videos-explicativos cada vez que se haga un video para Nudo.
---

# Videos de Nudo Design

Complementa la skill `videos-explicativos`. Lo que se define aquí manda sobre lo general.

**Nudo no tiene un solo estilo de video.** Hay varios formatos, cada uno con su flujo de producción.
El usuario dice qué estilo quiere y se hace con ese formato.
- Si el pedido no dice el estilo, **preguntar cuál** (mostrando la tabla) antes de producir.
- No mezclar estilos salvo que el usuario lo pida.
- Lo que el usuario corrija de un estilo va al archivo de ese estilo. Lo que aplique a todos los videos de
  Nudo va a este archivo (sección "Base común").

## Estilos

| Estilo | Cuándo | Archivo | Video de ejemplo |
|---|---|---|---|
| **Solo Remotion** (3D realista hecho en código) | Explicar un concepto de madera, materiales o carpintería con datos | [estilos/solo-remotion.md](estilos/solo-remotion.md) | `remotion-test/src/madera-verde/` |
| **SketchUp + Blender** | Productos o instalaciones con modelos detallados (ej.: el video del chazo) | [estilos/sketchup-blender.md](estilos/sketchup-blender.md) | Video del chazo (hecho fuera de este repo) |
| **Láser Nudo** (café oscuro + ámbar, como la web del láser) | Grabado/corte láser, sorteos, regalos personalizados | [estilos/laser-nudo.md](estilos/laser-nudo.md) | `remotion-test/src/laser/` |
| **Low poly / sketch** (3D caricatura con personajes) | Parodias, humor y sketches virales con diálogo | [estilos/low-poly-sketch.md](estilos/low-poly-sketch.md) | `remotion-test/src/claude-taller/` |

Para un estilo nuevo, crear su archivo en `estilos/` con la misma estructura (cuándo usarlo, flujo, visual,
audio, ritmo, errores a evitar, videos hechos) y agregarlo a la tabla.

## Base común (todos los estilos)

### Marca
- Nombre / @: Nudo Design · **@somos_nudodesign** (Instagram).
- Rubro: muebles y diseño en madera.
- Formato: reel vertical **1080×1920**, 30 fps, ~20–30 s.
- Cierre: **@somos_nudodesign** pequeño con borde negro, abajo al centro (≈ y 1540 px).

### Voz y tono
- Voz principal (ElevenLabs): **"BRIAN - VOZ PARA REDES SOCIALES"**, id `U9TSK9KHMlMU2qkeXlQP`
  (español latino, joven, cercano). Es la voz de Nudo y la que el usuario usa para sí mismo.
- Tono: cercano, de amigo; tuteo; frases cortas.

### Reglas de color
- Cada objeto con su **color real** (madera, acero, metro amarillo). Los colores de la marca **no** pintan
  objetos ni fondos.
- Fondo: se elige por estilo. En los explicativos, **grafito**; nunca el café/marrón apagado.

### Producción (común)
- Proyecto Remotion: `remotion-test/` (ver `videos-explicativos/referencias/produccion.md`).
- Voz: generar con ElevenLabs, transcribir para tiempos por palabra, recortar con ffmpeg y **verificar con
  `volumedetect` que cada recorte suene** (un recorte quedó mudo una vez).
- Audio final normalizado a −14 LUFS. Los MP4 no van a git; el código, las voces y los efectos sí.
- Enviar el video al usuario y hacer commit + push al terminar.

### ElevenLabs
- El conector **completo** (`https://api.elevenlabs.io/v1/mcp`) hace voz, efectos, **música**, imagen y video.
  El conector "restringido" no hace música. Los permisos de la clave "Claude key" ya incluyen música.
- Costos de referencia: voz ~50–300 créditos por toma; efecto de sonido ~17; **música ~900 por variación**
  (por defecto genera 4 = 3.600): pedir 1–2 variaciones si no hace falta elegir entre muchas.
- No puedo escuchar audio: elegir tomas por transcripción y perfil de volumen, y decírselo al usuario.

## Correcciones del usuario (generales)
- 2026-11-07: Nudo tiene varios estilos de video; el usuario elige cuál en cada pedido.
- 2026-11-05: subtítulos a media altura (no arriba), con borde negro y palabra clave resaltada (estilo explicativo).
