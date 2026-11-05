# Guía de estilo – reels explicativos de Nudo

Basada en dos referencias analizadas (no se copian sus cuentas, marcas de agua ni modelos):
- **A – Diorama en corte** (muro de contención): mundo low-poly, corte transversal del terreno,
  flechas que muestran fuerzas, subtítulo palabra por palabra al centro.
- **B – Objeto aislado** (enchufe, 16,9 s): fondo oscuro cálido, un solo objeto 3D,
  cámara lenta, partes que se separan, anillos que señalan detalles, subtítulo arriba
  con la palabra clave resaltada.

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
| Capa sobre otra (agua, aire, calor) | Transparencia | Humedad saliendo de la madera |

**Por defecto: sin motion blur, sin glow, sin partículas.** Se activan escena por escena.

## Cámara
- Una idea por plano. Cambiar de plano cuando cambia la idea (cada 1,5–3 s).
- Movimientos lentos y continuos (dolly / órbita suave). Nada de giros sin motivo.
- Acercar la cámara a lo que el texto está nombrando en ese momento.

## Subtítulos (lo que más retiene en las referencias)
- Sincronizados con la voz, **palabra por palabra** o en frases cortas (2–5 palabras).
- Palabra activa en blanco y **negrita**; palabras ya dichas en gris.
- Palabra clave de la frase con **recuadro de resalte** (una o dos por video, no más).
- Posición: tercio superior (estilo B) o centro (estilo A). Nunca en la zona inferior
  de 300 px ni a la derecha de 900 px (ahí van los botones de Instagram/TikTok).
- Tipografía sans redondeada, peso 700–800, ~64 px a 1080 px de ancho.

## Ritmo y estructura (≈15–30 s)
1. **Gancho (0–2 s):** pregunta concreta sobre el objeto, ya visible en pantalla.
2. **Desarrollo:** una idea por plano, siempre mostrando lo que se dice.
3. **Revelación:** corte, vista interna o antes/después.
4. **Cierre:** consejo práctico + marca Nudo (discreta, sin pantalla final larga).

## Look
- Dos modos según el tema:
  - **Taller / objeto:** fondo oscuro cálido con viñeta, luz principal suave, maderas
    con textura real (estilo B).
  - **Explicación de construcción:** diorama low-poly en corte, colores planos (estilo A).
- Materiales sencillos, sombras suaves, sin reflejos exagerados.
- Marca: handle/logo de Nudo pequeño y fijo, no animado.

## Audio
- Voz en off es lo que guía todo: primero guion y voz, después la animación.
- Música baja (−18 a −22 dB bajo la voz). Sonidos puntuales solo para acciones (crack, golpe).

## Técnica (Remotion)
- Animar todo con `useCurrentFrame()` + `interpolate()` / `spring()`. Nunca CSS
  transitions ni animaciones de Tailwind (no se renderizan bien).
- Escenas con `<Sequence>` / `<Series>`; tiempos en segundos × fps.
- Subtítulos a partir de los tiempos de la voz (transcripción con marcas de tiempo).
- Medir cada efecto caro (blur, glow, 3D) en un render corto antes del render final.
