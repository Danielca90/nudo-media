# Guía de estilo – reels explicativos de Nudo

Basada en dos referencias analizadas (no se copian sus cuentas, marcas de agua ni modelos):
- **A – Diorama en corte** (muro de contención): mundo low-poly, corte transversal del terreno,
  flechas que muestran fuerzas, subtítulo palabra por palabra al centro.
- **B – Objeto aislado** (enchufe, 16,9 s): fondo oscuro cálido, un solo objeto 3D,
  cámara lenta, partes que se separan, anillos que señalan detalles, subtítulo arriba
  con la palabra clave resaltada.

- **C – Gancho del metro** (24,5 s): primeros planos muy cerrados, el objeto llena
  el cuadro y se sale por los bordes; un plano translúcido con un "0" marca dónde empieza
  la medida; el estado incorrecto se pinta de rojo; cierre con llamado a compartir.

- **D – Hielo en el músculo** (43,5 s): corte con muchas capas reales (piel, grasa,
  vasos, fibras, nervio), acercamientos al detalle que se nombra, etiquetas con línea
  guía, tarjetas de datos con la fuente, comparaciones lado a lado.

## Contexto y detalle en los modelos
- Mostrar el objeto **en su contexto real** (la mesa terminada, el tronco del que sale
  la tabla), no solo una pieza suelta.
- Cuando el porqué está en lo pequeño, **acercarse hasta verlo** (vista ampliada de
  las células, los anillos en la testa, la grieta).
- **Etiquetas con línea guía** que apuntan al punto exacto ("CORTEZA", "JUNTA ABIERTA").
- **Tarjetas de datos** con el número, una barra y **la fuente** en chico (da credibilidad).

## Regla principal: el efecto tiene que explicar algo
Antes de agregar un efecto, responder: **¿qué entiende el espectador gracias a esto?**
Si la respuesta es "se ve más lindo", no va.

| Concepto a explicar | Recurso | Ejemplo madera verde |
|---|---|---|
| Fuerza / dirección / empuje | Flecha 3D o 2D que entra y empuja | Agua saliendo de la tabla |
| "Mirá esta parte" | Anillo que se dibuja alrededor (stroke animado) | Anillo sobre el nudo o la grieta |
| Qué hay adentro | Corte transversal / vista explotada | Sección mostrando anillos y humedad |
| Antes vs después | Misma cámara, cambia solo el objeto | Tabla recta → tabla torcida |
| Cambio en el tiempo | Deformación lenta + contador | Humedad 35% → 10% |
| Medida / cifra | Cota o número que aparece junto al objeto | "−6 mm de ancho" |
| Movimiento rápido real (algo que cae, gira rápido) | Motion blur | Solo si algo se mueve rápido |
| Elemento activo / caliente / peligro | Glow suave y puntual | Grieta que aparece |
| Punto de referencia / plano de medida | Plano translúcido + etiqueta ("0") | Dónde empieza a medir el metro |
| Forma incorrecta de hacer algo | El objeto cambia a rojo mientras pasa | Apretar el gancho del metro |
| Movimiento de una pieza | Flecha 2D blanca simple al lado | Gancho que entra / sale |
| Capa sobre otra (agua, aire, calor) | Transparencia | Humedad saliendo de la madera |

**Por defecto: sin motion blur, sin glow, sin partículas.** Se activan escena por escena.

## Cámara
- **Primeros planos grandes**: el objeto ocupa 60–90 % del ancho y puede salirse del
  cuadro. Nada de objetos chiquitos en el centro de un fondo vacío.
- Una idea por plano. Cambiar de plano cuando cambia la idea (cada 1,5–3 s).
- **Acercamientos sincronizados**: la cámara se mueve hacia lo que la voz nombra
  justo en esa palabra (juntas → acercar a la junta; grietas → acercar a la grieta).
- Algo cambia en pantalla cada ~1 s (etiqueta, dato, acercamiento), aunque no haya corte.
- Movimientos lentos y continuos (dolly / órbita suave). Nada de giros sin motivo.
- Acercar la cámara a lo que el texto está nombrando en ese momento.

## Subtítulos (lo que más retiene en las referencias)
- Sincronizados con la voz, **palabra por palabra** o en frases cortas (2–5 palabras).
- Palabra activa en blanco y **negrita**; palabras ya dichas en gris.
- **Borde negro** en todas las palabras (≈4–5 px visibles) para leerse sobre cualquier modelo.
- Palabra clave de cada idea con **recuadro azul de resalte** (≈1 por frase, no más).
- La palabra aparece apenas antes de oírse (~0,05 s) para leer y escuchar a la vez.
- Posición: **zona media**, con el centro del texto entre 36% y 46% del alto
  (≈ y 700–880 px en 1080×1920). **No pegados arriba**: el texto alto queda incómodo
  y se pierde al mirar el objeto. El objeto se encuadra debajo o alrededor del texto.
- Nunca en los 320 px inferiores ni a la derecha de 920 px (botones de Instagram/TikTok).
- Tipografía sans, peso 800, ~66 px a 1080 px de ancho (tamaño cómodo, no gigante).

## Ritmo y estructura (≈15–30 s)
1. **Gancho (0–2 s):** pregunta concreta sobre el objeto, ya visible en pantalla.
2. **Desarrollo:** una idea por plano, siempre mostrando lo que se dice.
3. **Revelación:** corte, vista interna o antes/después.
4. **Cierre:** consejo práctico + marca Nudo (discreta, sin pantalla final larga).
   Opcional: llamado a compartir ("mándaselo a quien…") en 1–2 s, sin copiar
   la animación de interfaz de otras cuentas.

## Color: cada cosa con su color real
- **Los objetos llevan sus colores reales**, nunca los de la marca: un metro es amarillo
  con números negros, el pino es claro, el nogal es marrón oscuro, el acero es gris,
  la cola blanca es blanca, el agua es azul.
- Los colores de la marca **no se usan para pintar objetos ni fondos**. Así cada video
  tiene su propia paleta según el tema y no se ven todos iguales.
- Solo las anotaciones (flechas, anillos, resaltes) usan colores fijos, y deben
  contrastar con los colores reales de la escena de ese video.

## Fondo: distinto según el tema
- **No hay fondo fijo** (en particular, no repetir el fondo azulado de siempre).
- Elegir el fondo por el tema y el ambiente real del objeto, por ejemplo:
  - madera / taller → tonos cálidos (marrón, ámbar, banco de trabajo desenfocado)
  - exterior / humedad → cielo, verde, gris de lluvia
  - construcción / corte → diorama con tierra y pasto
  - herramientas / metal → gris neutro o negro con luz lateral
  - acabados / pintura → fondo claro tipo estudio
- El fondo nunca compite con el objeto: menos saturado y más oscuro o más claro que él.

## Look
- Dos modos según el tema:
  - **Taller / objeto:** objeto aislado, fondo elegido según el tema, luz principal
    suave, materiales con su color y textura real (estilo B).
  - **Explicación de construcción:** diorama low-poly en corte, colores planos (estilo A).
- Materiales sencillos, sombras suaves, sin reflejos exagerados.
- Marca: logo o @ de Nudo pequeño y fijo, no animado, solo al final o en una esquina.

## Audio
- Voz en off con **ElevenLabs**, voz **"BRIAN - VOZ PARA REDES SOCIALES"** (id `U9TSK9KHMlMU2qkeXlQP`). Es lo que guía todo: primero guion y voz, después
  la animación. Los subtítulos salen de los tiempos de esa voz.
- Música baja (−18 a −22 dB bajo la voz). Sonidos puntuales solo para acciones (crack, golpe).

## Técnica (Remotion)
- Animar todo con `useCurrentFrame()` + `interpolate()` / `spring()`. Nunca CSS
  transitions ni animaciones de Tailwind (no se renderizan bien).
- Escenas con `<Sequence>` / `<Series>`; tiempos en segundos × fps.
- Subtítulos a partir de los tiempos de la voz (transcripción con marcas de tiempo).
- Medir cada efecto caro (blur, glow, 3D) en un render corto antes del render final.
