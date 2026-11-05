# Estilo general de los videos explicativos

Aplica a todas las marcas. La skill `estilo-<marca>` puede ajustar lo que indique.

## Método: 8 reglas para construir cada video
1. **Primero proponer una acción visual por bloque del guion, después construir.**
2. **Máximo 4 palabras por escena en pantalla, aparte de los subtítulos.**
   Etiquetas y tarjetas cortas. Nada de frases largas.
3. **Convertir las ideas en acciones.** "Se encoge" = la pieza se achica en pantalla.
4. **Dibujar las analogías del guion literalmente.**
5. **Mostrar las magnitudes con escala** y enfocar lo importante (barras,
   comparaciones lado a lado, una referencia de tamaño conocida).
6. **Conservar elementos entre escenas** para que se vea cómo se transforman.
7. **Sincronizar cada acción clave con la palabra correspondiente** de la voz.
8. **Dejar una imagen final clara en cada escena**, que se entienda aunque se pause.

## Regla principal: el efecto tiene que explicar algo
Antes de agregar un efecto: **¿qué entiende el espectador gracias a esto?**
Si la respuesta es "se ve más lindo", no va.
**Por defecto: sin motion blur, sin glow, sin partículas.** Se activan por escena y con motivo.

| Concepto a explicar | Recurso |
|---|---|
| Fuerza / dirección / empuje | Flecha 3D o 2D que entra y empuja |
| "Mirá esta parte" | Anillo que se dibuja alrededor |
| Qué hay adentro / por qué pasa | Corte, vista explotada o **vista ampliada** (zoom al nivel donde está el porqué) |
| Antes vs después | Misma cámara, cambia solo el objeto |
| Cambio en el tiempo | Transformación lenta + contador |
| Medida / cifra | Cota en el objeto + tarjeta de datos con barra |
| Punto de referencia | Plano translúcido + etiqueta |
| Forma incorrecta de hacer algo | El objeto se pone rojo mientras pasa |
| Movimiento de una pieza | Flecha 2D blanca simple al lado |
| Capa sobre otra (agua, aire, calor) | Transparencia |
| Movimiento rápido real | Motion blur (solo ahí) |
| Elemento activo / peligro | Glow suave y puntual |

## Contexto y detalle en los modelos
- Mostrar el objeto **en su contexto real** (el mueble terminado, el lugar donde se usa,
  de dónde sale), no una pieza suelta flotando.
- Cuando el porqué está en lo pequeño, **acercarse hasta verlo**.
- **Etiquetas con línea guía** al punto exacto del modelo (mayúsculas, ≤ 3 palabras).
- **Tarjetas de datos**: número grande, barra o escala, y **la fuente** en chico.
- Si se exagera algo para que se vea, decirlo en chico ("Deformación exagerada").
- Los datos tienen que ser correctos: verificar cifras antes de mostrarlas.

## Volumen y profundidad
- Tres luces: principal (con sombras), relleno suave del lado opuesto, y
  **contorno desde atrás** para despegar el objeto del fondo.
- **Sombras proyectadas** en un piso invisible (solo sombra), así combina con cualquier fondo.
- **Degradado vertical** en piezas verticales (patas, postes): más oscuro abajo.
- Bordes levemente redondeados para que capten brillo.

## Cámara
- **Primeros planos grandes**: el objeto ocupa 60–90 % del ancho y puede salirse del cuadro.
- **Acercamientos sincronizados**: la cámara va a lo que la voz nombra, en esa palabra.
- Algo cambia en pantalla cada ~1 s (etiqueta, dato, acercamiento), aunque no haya corte.
- Una idea por plano; cambio de plano cada 1,5–3 s. Movimientos suaves, nada de giros sin motivo.

## Subtítulos
- Sincronizados palabra por palabra, en bloques de hasta 5 palabras que cortan en la puntuación.
- La palabra aparece ~0,05 s antes de oírse.
- Palabra activa en blanco; palabras ya dichas en gris claro.
- **Borde negro** en todas las palabras (≈4–5 px visibles) para leerse sobre cualquier fondo.
- **Palabra clave de cada idea** con recuadro de resalte (≈1 por frase).
- Sans, peso 800, **~66 px** a 1080 px de ancho: tamaño cómodo, no gigante.
- Posición en la **zona media**: centro del texto entre 36 % y 46 % del alto. **No pegados arriba.**
- Zonas prohibidas: 320 px inferiores y a la derecha de 920 px (botones de la app).

## Color
- **Cada objeto con su color real** (madera, metal, cinta métrica, agua…), nunca con
  los colores de la marca. Así cada video tiene su propia paleta.
- Los colores fijos son solo para anotaciones (flechas, anillos, resaltes) y deben
  contrastar con la escena.

## Fondo
- **No hay fondo fijo**: se elige por el tema y debe ser menos protagonista que el objeto.
- Evitar el café/marrón apagado y el azulado repetido (al usuario no le gustan).
- Opciones probadas: **grafito** (gris oscuro neutro, el preferido hasta ahora),
  claro (estudio blanco cálido), oliva.
- Dejar el fondo como prop seleccionable (esquema zod) para probar desde el Studio.

## Ritmo y estructura
1. **Gancho (0–2 s):** pregunta concreta, con el objeto ya en pantalla.
2. **Desarrollo:** una idea por plano, siempre mostrando lo que se dice.
3. **Revelación:** corte, vista interna o antes/después.
4. **Cierre:** consejo práctico + marca discreta (según la skill de marca).

## Audio
- La voz manda: primero guion y voz, después la animación.
- Música, si hay, baja (−18 a −22 dB bajo la voz). Sonidos solo para acciones.
- Entrega final normalizada a −14 LUFS.
