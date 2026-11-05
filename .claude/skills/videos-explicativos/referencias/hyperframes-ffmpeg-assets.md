# Pipeline ampliado: Remotion + HyperFrames + FFmpeg + biblioteca de assets

Probado en esta nube el 2026-11-05 (HyperFrames 0.9.16, FFmpeg 6.1.1, Node 22, sin GPU).

## Quién hace qué
| Herramienta | Papel | Cuándo |
|---|---|---|
| **Remotion** (`remotion-test/`) | Compositor principal: voz, subtítulos por palabra, kit de marca, escenarios 2D, remate de venta | Siempre |
| **HyperFrames** (`hyperframes/<marca>/`) | Planos "héroe" de 3–6 s con 3D real, vidrio, reflejos, sombras, shaders y bloques del catálogo | Cuando un momento del video gana mucho con 3D o con un bloque hecho (ver lista) |
| **FFmpeg** (`herramientas/ffmpeg.sh`) | Posproducción: normalizar audio, empalmar voces, música con ducking, unir y superponer clips, portadas, hojas de contacto | Siempre al final |

**Condiciones para usar HyperFrames (todas):**
1. El plano 3D cuenta algo de la historia que el 2D no puede contar igual de bien (un objeto físico
   real del tema, un mecanismo, capas de algo que se separan). No sirve para "darle algo de 3D" al video.
2. Muestra lo que la voz está diciendo en ese momento.
3. Respeta el estilo ya establecido de la marca (escenario, paleta, tipografía, capa de marca) y se
   integra dentro de la escena, no como un plano aparte con otro look.
4. **Nunca en el gancho** (primeros 3 s) como elemento abstracto: el gancho muestra la situación
   concreta del tema.
5. Si hay duda, no se usa: los videos 2D con escenario propio son el estándar que funciona.
Ejemplo de lo que NO se hace: lente de vidrio sobre la palabra "PERMISO" en fondo liso abriendo el
reel 03 de Arca (no contaba nada y rompía el estilo).

Regla: HyperFrames **no reemplaza** a Remotion (existe una skill de migración, pero el kit, la voz y los
subtítulos sincronizados ya están en Remotion). Se usa para los planos que Remotion hace peor: 3D con
materiales físicos, refracción, reflejos y shaders. Costo: ~30 s de render por segundo de video
vertical sin GPU (5 s ≈ 2,5 min), así que se reserva para momentos cortos.

## HyperFrames: uso
- Proyecto por marca: `hyperframes/arca-3d/` (creado con `init --resolution=portrait`). Sus `CLAUDE.md`
  y `AGENTS.md` son la guía oficial de HyperFrames para agentes: leerlos antes de editar.
- CLI sin instalar nada global: `npx --yes hyperframes@0.9.16 <comando>` (o la versión que fije `package.json`).
  - Buscar en el catálogo (448 bloques): `npx --yes hyperframes@0.9.16 catalog --json` o `catalog vidrio`.
  - Agregar: `npx --yes hyperframes@0.9.16 add <bloque>` → queda en `compositions/<bloque>.html`.
  - Validar: `lint`, `check`, `snapshot` (cuadros PNG para revisar).
  - Render: `npx --yes hyperframes@0.9.16 render -c compositions/<archivo>.html -o renders/<x>.mp4 -q looks --no-browser-gpu`
    (`--format mov` o `webm` para clip con transparencia que se superpone; `-q delivery` para entrega final).
- **Los bloques vienen en 1920×1080.** Para reels: copiar el bloque y cambiar 1920↔1080 (viewport, CSS,
  `data-width/height`, `renderer.setSize`, aspecto de la cámara y lienzos de texto). Ejemplo hecho:
  `compositions/arca-vidrio.html` (vidrio con refracción sobre "ARCA" en dorado, fondo verde de la marca).
- Los bloques bajan GSAP, three.js y fuentes de cdn.jsdelivr.net al renderizar (funciona en esta nube).
- Cada bloque declara variables (`data-composition-variables`): texto, colores, forma. Cambiar los
  valores por defecto a la paleta de la marca.
- Llevarlo al video: render a `remotion-test/public/<marca>/3d/<x>.mp4` y usar `<OffthreadVideo>` en
  la escena de Remotion, o unir/superponer con FFmpeg (`unir`, `superponer`).
- Skills oficiales de HyperFrames para agentes (en la máquina del usuario):
  `claude plugin marketplace add heygen-com/hyperframes` y `claude plugin install hyperframes@hyperframes`.

### Bloques útiles del catálogo
| Bloque | Qué hace | Uso sugerido |
|---|---|---|
| `glass-hero` | Objeto de vidrio que refracta un titular | Solo si el objeto de vidrio tiene sentido en la historia (nunca como gancho abstracto) |
| `extruded-logo` | Letras 3D biseladas con luz que corre | No para Arca (el usuario no quiere logo animado en 3D) |
| `exploded-stack` | Capas isométricas que se separan con etiquetas | "Capas" de un contrato o de un mueble |
| `product-turntable` | Producto girando en una base de estudio (carga GLB/glTF) | **Nudo**: muebles en 3D real |
| `orbit-card`, `cuboid-carousel`, `carousel-vision-*` | Tarjetas en movimiento 3D | Servicios, listas |
| `rack-focus`, `camera-dolly-zoom` | Cámara con profundidad de campo real | Revelar un detalle |
| `liquid-glass-widgets`, `liquid-glass-notification` | Tarjetas de vidrio esmerilado (WebGPU: probar antes) | Cifras, alertas |
| `news-ticker`, `lower-third-bild`, `lt-*` | Barras de noticias y rótulos | Serie "Actualidad laboral" |
| `mk-progress-stat`, `data-chart`, `bar-chart-race` | Cifras y gráficos animados | Montos, plazos, porcentajes |
| `message-thread-reveal`, `notification-cascade` | Chat y notificaciones en celular | Ganchos tipo "despido por WhatsApp" |
| `instagram-follow` | Tarjeta de seguir en Instagram | Llamado a la acción |
| `camcorder-hud` | HUD de cámara (REC, batería, contador) | Recreaciones tipo "cámara de seguridad" |
| Transiciones `*-shader`, `light-leak`, `glitch` | Transiciones con shader | Cambios de bloque |

## FFmpeg: `herramientas/ffmpeg.sh`
`normalizar` (−14 LUFS) · `empalmar-voz` (cambiar el final de una locución) · `musica` (fondo con
ducking que baja cuando habla la voz) · `unir` (intro 3D + video) · `superponer` (clip con
transparencia encima) · `silencio` (pista muda para clips 3D) · `portada` · `hoja` · `revisar`.
`herramientas/ffmpeg.sh ayuda` lista los argumentos.

## Biblioteca de assets (`assets/`)
Todo asset descargado se registra en `assets/LICENCIAS.md` (fuente, licencia, atribución). Solo
licencias que permitan uso comercial; CC BY exige crédito en el pie de foto. Nada que imite marcas reales.

| Tipo | Fuente | Licencia | Estado en esta nube |
|---|---|---|---|
| Avatares SVG por semilla | `@dicebear/collection` (npm, en `remotion-test`) | `notionists` y `open-peeps`: CC0 · `personas`: CC BY 4.0 · `avataaars`: libre con condiciones | Instalado. Para marcas sobrias usar `notionists` con opciones fijas (no semillas al azar: salen camisetas con texto u ojos de corazón) |
| Íconos | `lucide-react` (npm) | ISC | Instalado |
| HDRI para reflejos 3D | Poly Haven (api.polyhaven.com / dl.polyhaven.org) | CC0 | Funciona: `assets/hdri/studio_small_09_1k.hdr` |
| Modelos 3D GLB | raw.githubusercontent.com (Khronos glTF samples), quaternius.com | CC0 / según modelo | Accesibles |
| Modelos 3D | poly.pizza, kenney.nl, sketchfab | CC0 / CC BY | **Bloqueados por la red** |
| Música y efectos | pixabay.com, freesound.org | Pixabay / CC0 | **Bloqueados por la red** |
| Lottie | lottiefiles.com + `@remotion/lottie` | Lottie Simple License | Sitio accesible; descarga por archivo |

Para lo bloqueado: el usuario puede subir los archivos, o permitir esos dominios en la configuración de
red del entorno. Para música y efectos generados, el conector completo de ElevenLabs
(https://api.elevenlabs.io/v1/mcp); el conector actual solo hace voz.
