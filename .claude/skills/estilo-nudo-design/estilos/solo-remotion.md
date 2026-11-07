# Estilo: Solo Remotion (explicativo 3D realista)

Todo se construye dentro de Remotion: modelos 3D hechos en código con `@remotion/three`
(React Three Fiber), animados con `useCurrentFrame()`, más etiquetas, tarjetas de datos y subtítulos.
Sigue el método completo de la skill `videos-explicativos` (8 reglas, plan frase → acción → imagen final).

## Cuándo
Explicar un concepto de madera, carpintería, materiales o acabados: por qué pasa algo y cómo evitarlo.

## Visual
- Modelos 3D con **colores y texturas reales** (veta, anillos en la testa, médula, corteza, metro amarillo, acero gris).
- Mostrar el mueble terminado como contexto y volver a él al final.
- Más contexto y detalle; acercamientos al detalle sincronizados con la palabra.
- Volumen: tres luces (principal con sombra, relleno, contorno), sombra en piso invisible, degradado en patas.
- Fondo: **grafito** (preferido). Nada de café/marrón apagado.

## Texto y audio
- Voz: Brian (narrador).
- Subtítulos palabra por palabra a **media altura** (36–46 % del alto), borde negro, palabra clave con recuadro.
- Gancho: pregunta concreta ("¿Qué pasa si haces un mueble con madera verde?").
- Cierre: consejo práctico + @somos_nudodesign.

## Producción
- Carpeta por video en `remotion-test/src/<video>/` con `GUION.md`, `tiempos.ts`, escenas y overlays.
- Componentes reutilizables en `src/madera-verde/` (cámara por claves, etiquetas, subtítulos, fondos).
- Render: `npm run render:madera-verde` (flags de Chromium local en `package.json`).

## Videos hechos
- `remotion-test/src/madera-verde/` — "¿Qué pasa si haces un mueble con madera verde?" (v3, 26,6 s).

## Correcciones del usuario
- 2026-11-05: subtítulos a media altura, con borde negro y palabra clave resaltada.
- 2026-11-05: más contexto y detalle en los modelos; acercamientos sincronizados.
- 2026-11-05: más volumen (sombras, degradado en patas); fondo café descartado → grafito.
