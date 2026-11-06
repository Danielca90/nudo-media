---
name: estilo-nudo-design
description: Estilo de los videos explicativos de Nudo Design (@somos_nudodesign), marca de muebles y diseño en madera. Úsala junto con la skill videos-explicativos cada vez que se haga un video para Nudo.
---

# Estilo de videos – Nudo Design

Complementa la skill `videos-explicativos`. Lo que se define aquí manda sobre lo general.

## Marca
- Nombre / @: Nudo Design · **@somos_nudodesign** (Instagram).
- Rubro: muebles y diseño en madera.
- Objetivo: explicar con claridad conceptos de madera, carpintería, materiales y
  acabados (por qué pasan las cosas y cómo evitarlas).

## Voz y tono
- Voz de ElevenLabs: **"BRIAN - VOZ PARA REDES SOCIALES"**, id `U9TSK9KHMlMU2qkeXlQP`
  (español latino, joven, cercano). Es la que el usuario ya usa y le gusta.
- Tono: cercano, de amigo que explica; tuteo ("haces", "mide"); frases cortas.

## Visual
- Modelos 3D con **colores y texturas reales** de la madera y las herramientas
  (veta, anillos en la testa, médula, corteza, metro amarillo, acero gris).
- Mostrar el mueble terminado como contexto, y volver a él al final.
- Fondo preferido hasta ahora: **grafito**. No usar el café/marrón apagado.
- Los colores de la marca **no** pintan objetos ni fondos.

## Estructura
- Duración típica: 20–30 s.
- Gancho: pregunta concreta ("¿Qué pasa si haces un mueble con madera verde?").
- Cierre: consejo práctico + **@somos_nudodesign** pequeño con borde negro, abajo al centro.

## Lo que funciona y lo que falta (datos al 6/11/2026)
- Funciona: reels 3D con un problema cotidiano en segunda persona y el objeto real desde el cuadro 0
  ("¿Tu chazo gira y no agarra?" 2.645 vistas; células de la madera 2.215). Los carruseles con la
  plantilla azul marino tienen 13–20 vistas: priorizar reels.
- Falta: comentarios y seguidores. Cada reel termina con UNA de estas acciones (rotarlas y medir):
  1. **Pregunta para comentar** que la gente pueda responder en una palabra:
     "¿Tu pared es de ladrillo o de drywall? Te digo qué chazo usar." → responder cada comentario
     en la primera hora (eso empuja el alcance).
  2. **Palabra clave:** "Comenta CHAZO y te mando la guía" (respuesta manual por DM; no prometer
     envíos automáticos si no hay herramienta).
  3. **Serie con parte 2:** "Parte 2: el chazo correcto para cada pared. Síguenos para no perderla."
     Marcar "EP. 1, EP. 2" en la portada.
- Fijar en el perfil los 3 reels con más vistas; bio con qué hace Nudo, ciudad y WhatsApp.

## Datos técnicos confirmados por el usuario (carpintero; manda sobre fuentes genéricas)
- **Bisagras de cazoleta (cocinas y clósets):** tienen **un solo tornillo de ajuste** en el brazo, que mueve
  la puerta **a izquierda o derecha**. Si la puerta está torcida, se ajusta el tornillo de la bisagra de
  **arriba** y el de la de **abajo** hasta alinearla. Los tornillos de **atrás** (en la base), según la
  bisagra, permiten **subir o bajar** la puerta. No decir que hay "tres tornillos" ni ajuste de
  profundidad (error del primer corte del reel de la puerta torcida, 2026-11-06).
- Regla: antes de explicar cómo funciona un herraje, una técnica o un material, confirmar el mecanismo
  real; si hay duda entre modelos, decir "según la bisagra / según el modelo".

## Gancho que convierte (pedido del usuario, 2026-11-06)
El gancho no solo retiene: tiene que invitar a comentar desde el principio.
- Abrir con algo que el espectador quiera responder: pregunta directa ("¿La puerta de tu cocina quedó
  torcida?") o afirmación que divide ("La madera maciza NO es la mejor para tu cocina").
- La pregunta para comentar se dice al final **y** queda escrita en grande en pantalla, con dos opciones
  cortas cuando se pueda ("¿COCINA O CLÓSET?", "¿DE ACUERDO O NO?"): responder cuesta una palabra.
- Responder todos los comentarios en la primera hora y fijar el más debatido.

## Formato "polémica" (videos para generar comentarios)
Objetivo: muchos comentarios → Instagram empuja el video. Reglas:
- **Opinión fuerte pero defendible, nunca un dato falso.** La polémica sale de tomar partido en algo
  donde la gente cree lo contrario, no de inventar. Un dato falso da razones válidas para desacreditar a
  Nudo (marca de expertos que vende muebles).
- Estructura: afirmación que divide en el cuadro 0 (titular grande) → "Sí, [lo repito]" → la razón
  técnica en 2–3 frases con el objeto en 3D → matiz corto que deja a Nudo bien ("es hermosa, pero…") →
  "¿Estás de acuerdo o no? Te leo en los comentarios" con SÍ / NO grandes en pantalla.
- Temas candidatos: maciza vs. contrachapado/hidrófugo en cocinas; MDF no es "madera mala"; cocinas
  abiertas; repisas flotantes; el blanco total en cocinas; laca vs. aceite.
- Nada contra personas, marcas o competidores con nombre; nada que ponga en riesgo la seguridad.

## Videos hechos
- `remotion-test/src/madera-verde/` — "¿Qué pasa si haces un mueble con madera verde?" (v3, 26,6 s).
- `remotion-test/src/nudo/puerta-torcida/` — "¿La puerta de tu cocina quedó torcida?" (31 s, 3D: cocina
  completa, bisagra de cazoleta con 3 tornillos, destornillador; titular grande Anton en el cuadro 0;
  cierre con pregunta para comentar "¿cocina o clóset?"). Fuentes locales en `src/nudo/fuentes.ts`.
- `remotion-test/src/nudo/polemica-maciza/` — polémica "La madera maciza NO es la mejor para tu cocina" (31 s, 3D:
  puerta de listones que se hincha/encoge/tuerce, olla con vapor, contrachapado e hidrófugo; cierre SÍ / NO).

## Correcciones del usuario
- 2026-11-05: subtítulos a media altura (no arriba), con borde negro y palabra clave resaltada.
- 2026-11-05: más contexto y detalle en los modelos; acercamientos al detalle sincronizados.
- 2026-11-05: más volumen (sombras, degradado en patas); fondo café descartado → grafito.
- 2026-11-06: corrección técnica de las bisagras (un tornillo de ajuste lateral; arriba y abajo para
  enderezar; los de atrás suben/bajan según la bisagra). Reel de la puerta torcida rehecho.
