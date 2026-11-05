---
name: videos-explicativos
description: Método general para crear reels/videos explicativos verticales (1080×1920) con Remotion, 3D, voz de ElevenLabs y subtítulos sincronizados. Úsala siempre que se pida hacer, mejorar o renderizar un video explicativo para cualquier marca. El estilo propio de cada marca vive en una skill aparte (estilo-<marca>), que esta skill manda a cargar.
---

# Videos explicativos (método general)

Esta skill define **cómo** se hace un video explicativo, sin importar la marca:
método de guion a acción visual, reglas de estilo, ritmo, subtítulos, voz y la
producción técnica con Remotion.

## Técnica visual y estándar de detalle (siempre)

El usuario normalmente da solo un tema ("cómo despedir sin riesgo", "por qué se tuerce la
madera"). El video se produce completo sin preguntar técnicas: investigación, guion, escenas,
cámara, efectos, voz y subtítulos.

**Elegir la técnica según el tema** (decisión propia, se explica en una línea en `GUION.md`):

| Técnica | Cuándo | Guía |
|---|---|---|
| **3D** | Objetos físicos o mecanismos: cómo funciona, de qué está hecho, qué pasa adentro | [referencias/3d-detalle.md](referencias/3d-detalle.md) |
| **2D motion graphics** | Conceptos abstractos, trámites, leyes, fechas, dinero, procesos, servicios | [referencias/2d-motion-graphics.md](referencias/2d-motion-graphics.md) |
| **Mixto** | Explicación 2D con un objeto físico que se entiende mejor en volumen | ambas |

La skill de marca puede fijar o vetar una técnica (Arca Jurídica: 2D por defecto).

En cualquier técnica:
- Entender el tema primero: objetos reales, secuencia causa → efecto y el momento "ajá" que el
  video revela.
- Algo cambia cada 2–4 s; al menos 4 tipos de plano; nada quieto más de 3 s.
- Tiempos según la voz; subtítulos por palabra dentro de la zona segura.
- Un cuadro por escena y autorrevisión con la lista de la guía antes del render final.
- En 3D aplica el estándar completo de la guía (30+ piezas, materiales físicos, luz de entorno,
  posproceso sutil). La regla "el efecto tiene que explicar algo" de `estilo.md` sigue mandando
  sobre partículas y brillos.

## Skills de marca (independientes)

Cada marca tiene **su propia skill de estilo**, separada de esta:

| Marca | Skill | Estado |
|---|---|---|
| Nudo Design (@somos_nudodesign) | `estilo-nudo-design` | Creada |
| Arca Jurídica (@arcajuridica) | `estilo-arca-juridica` | Creada (reel a cámara + post gráfico) |

Reglas:
1. **Antes de empezar un video, identificar la marca y cargar su skill `estilo-<marca>`.**
   Si no existe, preguntar al usuario por la marca y crearla con
   [plantillas/marca-SKILL.md](plantillas/marca-SKILL.md) a medida que el usuario
   dé instrucciones (no inventar el estilo de una marca).
2. La skill de marca **manda** sobre esta en lo que defina (voz, tono, @, cierre,
   paleta de anotaciones, tipo de fondo, tipo de temas). Esta skill cubre todo lo demás.
3. Lo que el usuario corrija de una marca va a la skill de esa marca. Lo que aplique
   a todos los videos (método, legibilidad, ritmo, técnica) va a esta skill.
4. Nunca copiar marcas de agua, cuentas, personajes ni modelos de los videos de
   referencia: se toma el estilo, no el contenido.

## Flujo de trabajo

1. **Marca y tema.** Cargar `estilo-<marca>`. Confirmar tema, duración (≈15–45 s) y formato.
2. **Guion.** Escribir el guion para voz (frases cortas, números en palabras).
   Si el usuario pide no revisarlo, seguir directo.
3. **Técnica + plan de acción visual (obligatorio antes de programar).** Elegir 2D, 3D o mixto. Tabla
   frase → acción visual → imagen final del bloque. Guardarla como `GUION.md` junto
   al video. Ver las 8 reglas en [referencias/estilo.md](referencias/estilo.md).
4. **Voz.** Generar con ElevenLabs (voz definida en la skill de marca), transcribir
   para obtener los tiempos por palabra y descargar el MP3.
   Pasos exactos en [referencias/produccion.md](referencias/produccion.md).
5. **Construir** la composición en Remotion sincronizando cada acción con su palabra.
   Reutilizar los componentes listados en `produccion.md`.
6. **Revisar con cuadros sueltos** (`remotion still`) de cada escena antes del render:
   encuadre, etiquetas dentro de pantalla, subtítulos legibles, nada tapado.
7. **Renderizar** (Remotion; planos 3D héroe con HyperFrames), posproducir con `herramientas/ffmpeg.sh`
   (normalizar a −14 LUFS, música, unir) y enviar el MP4 al usuario.
   Hacer commit y push del código (nunca de los MP4).
8. **Aprender.** Si el usuario corrige algo, actualizar la skill que corresponda
   (general o de marca) en el mismo turno.

## Referencias

- [referencias/3d-detalle.md](referencias/3d-detalle.md) — estándar de detalle 3D (en inglés, del complemento video-3d-addon).
- [referencias/2d-motion-graphics.md](referencias/2d-motion-graphics.md) — estándar de motion graphics 2D.
- [referencias/hyperframes-ffmpeg-assets.md](referencias/hyperframes-ffmpeg-assets.md) — HyperFrames para planos 3D
  (vidrio, reflejos, shaders, 448 bloques), FFmpeg (`herramientas/ffmpeg.sh`) y biblioteca de assets con licencias.
- [referencias/estilo.md](referencias/estilo.md) — reglas de estilo generales (método de 8
  reglas, efectos con propósito, cámara, subtítulos, color, fondo, volumen, ritmo).
- [referencias/produccion.md](referencias/produccion.md) — pipeline técnico: ElevenLabs,
  subtítulos, Remotion en la nube, render, audio, Studio, red.
- [referencias/videos-de-referencia.md](referencias/videos-de-referencia.md) — qué se
  aprendió de cada video de referencia que mandó el usuario.
- Buenas prácticas oficiales de Remotion: skill `remotion-best-practices` (en este repo).
- Redes: `instagram-reels-colombia` y `redes-sociales-colombia` (en este repo) para guion de Reel, pie de foto, hashtags y reglas colombianas.
