# Estilo: Láser Nudo (estética de la web lasernudo.framer.website)

## Cuándo
Reels de **grabado/corte láser** (Creality Falcon + LightBurn): sorteos, procesos satisfactorios, catálogos de regalos.
Es el estilo de la cuenta de láser (**@lasernudo**, placeholder en `remotion-test/src/laser/tema.ts` → `HANDLE`).

## Visual (copiado de la web)
- Fondo **café muy oscuro** `#170A05 / #1E120A` con luz ámbar radial, brasas flotando y vetas finas. (Excepción a "grafito" de otros estilos: aquí la web manda.)
- Acentos: ámbar `#D9A27E`, crema `#F6F0E8`, arena `#EBD3A6`, cobre `#C27A55`, azul noche `#0F1530` (solo bloques de CTA).
- Tipografías: **Parisienne** (script, frases emotivas) + **Montserrat 800/700** (títulos en mayúsculas, números gigantes).
- Piezas: textura de madera real (pino/cedro, `public/laser/madera_*.png`), grabado `#2b1406`, borde quemado, punto láser blanco con halo naranja.
- Las piezas se dibujan con la **geometría real de los archivos del láser** (`remotion-test/src/laser/datos.json`, exportada por `laser/video_datos.py`).

## Flujo
1. Diseños: `python3 laser/generar.py` (SVG + .lbrn2 + mockups).
2. `python3 laser/video_datos.py` (datos y texturas para Remotion).
3. Voz (Brian, ElevenLabs, 1 toma) → `public/laser/audio/voz_*.mp3`; tiempos por pausas con `silencedetect` → `src/laser/tiempos.json`.
4. `python3 laser/audio_mix.py` (voz + base musical + efectos sintetizados, -14 LUFS; sin música con derechos).
5. Render: `npx remotion render src/index.ts <Id> out/<archivo>.mp4 --gl=swangle --chrome-mode=headless-shell --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

## Reglas
- Subtítulos a media altura (y≈760–790), borde negro, palabra clave en recuadro ámbar (igual que los demás estilos).
- Cierre: logo NUDO / DESIGN · GRABADO LÁSER + web + @handle.
- Sorteos en Colombia: bases claras, sin compra obligatoria, datos según Ley 1581, aviso de que no es de Instagram/Meta, revisión legal (Coljuegos).
- No se puede escuchar el audio aquí: decirlo al usuario.

## Videos hechos
- `LaserSorteo100` — primer reel de la cuenta: "Corté 100 productos y los regalo a los primeros 100 comentarios" (20 s).
- `LaserCorazon` — "Un corazón, dos llaveros" (14 s).
- `LaserNavidad5` — "5 regalos grabados en láser para Navidad" (18,5 s).
