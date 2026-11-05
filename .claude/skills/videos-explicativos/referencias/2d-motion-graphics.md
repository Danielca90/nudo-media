# Motion graphics 2D: cómo decidir y construir

Contraparte 2D de [3d-detalle.md](3d-detalle.md). Leer cuando el video se haga en 2D o mixto
(conceptos abstractos, trámites, leyes, fechas, dinero, procesos, servicios). Mismo nivel de
exigencia que el 3D: un 2D simple se ve barato igual que un 3D de cubos grises.
Implementación de referencia: `remotion-test/src/arca/` (`kit.tsx` + un reel por carpeta).

## 0. Trabajar con autonomía
El usuario da solo el tema. Se decide todo: historia, escenas, metáforas, movimiento, voz,
subtítulos. Solo se pregunta si el tema es ambiguo, y con una propuesta por defecto.

## 1. Entender el concepto antes de dibujar
1. Lista de **objetos reales** del tema (documentos, fechas, montos, personas, lugares, sellos,
   herramientas). En un tema legal: contrato, carta, calendario, liquidación, autorización…
2. La **secuencia causa → efecto** en 3 a 6 pasos.
3. El **momento "ajá"**: el dato que casi nadie sabe (el plazo exacto, la cifra, el requisito que
   anula todo). El video se construye para revelarlo.
4. La **metáfora visual** del gancho, tomada literal del guion ("le regalas una demanda" =
   una caja de regalo con la etiqueta DEMANDA).

## 2. Plan de producción (antes de programar)
Tabla `escena · segundos · tipo de plano · movimiento · qué se revela · frase de la voz`
en `GUION.md`. Estructura: gancho (0–2 s) → contexto → revelación paso a paso → remate y
llamado a la acción → cierre de marca (2–3 s).
- Una idea por escena. **Algo cambia cada 2–4 s** (entra un objeto, se marca, cambia el plano).
  Nada quieto más de 3 s.
- Al menos **4 tipos de plano** por video (sección 5).
- Los tiempos salen de la voz (tiempos por palabra), no se adivinan.

## 3. Tecnología
- Remotion con HTML/CSS/SVG, todo calculado desde `useCurrentFrame()`; nada de animaciones
  CSS, `Date.now()` ni azar sin semilla.
- Reutilizar el kit de la marca (fondo de contexto, título fijo, subtítulos, sellos, hojas,
  checks, cierre) y agregar al kit lo que se cree y sirva para otros videos.
- **Mixto:** un objeto 3D (con `@remotion/three`) dentro de una composición 2D cuando un objeto
  físico se entiende mejor en volumen. El 3D sigue las reglas de `3d-detalle.md`.

## 4. Estándar de detalle 2D
- **Contexto siempre, y propio del tema:** un lugar dibujado donde pasa la historia (la bodega
  donde trabaja el empleado despedido, la oficina en diciembre para un plazo de fin de año), con
  objetos que cuenten el tema. Nítido en el gancho y desenfocado detrás de la explicación.
  **No reutilizar el mismo fondo en videos seguidos**: el kit es solo para la capa de marca y
  las piezas genéricas; escenario y objetos se diseñan por tema.
- **Profundidad:** sombras suaves bajo cada tarjeta, capas a distinta escala, desenfoque del
  fondo, leve deriva del fondo (paralaje). Nada pegado plano sobre plano.
- **Objetos con detalle:** un documento tiene encabezado, filete de color, líneas de texto,
  firma y sello; un calendario tiene mes, año, días de la semana y fecha marcada; una cifra
  tiene unidad y contexto. Mínimo **15 elementos distintos** en el video.
- **Texto en pantalla corto:** máximo 4 palabras por pieza, aparte de subtítulos y título.
- Paleta y tipografías de la skill de marca; un color de alerta solo para error o riesgo.

## 5. Planos y técnicas (elegir por escena)
| Técnica | Cómo | Cuándo |
|---|---|---|
| Plano general | Escena completa con el contexto | Gancho, ubicar al espectador |
| Acercamiento (push-in) | Escalar el escenario hacia el detalle, con suavizado | Nombrar una parte o una cifra |
| Primerísimo plano | Escala 1,6–2,5× sobre una línea del documento | El dato "ajá" |
| Barrido / paneo | Desplazar el escenario lateralmente entre pasos | Pasar de un paso al siguiente |
| Lista que se arma | Ítems que entran en sincronía con cada palabra | Enumeraciones |
| Sello / impacto | Cae de 2,4× a 1× con sacudida | Consecuencia, advertencia |
| Resaltador | Barra dorada que se pinta sobre el texto | La frase clave de un documento |
| Contador / barra | Número que sube, barra que crece | Plazos, montos, porcentajes |
| Línea de tiempo | Fichas de fecha + barra | Plazos y fechas límite |
| Comparación | Así no (alerta) / así sí (marca) lado a lado | Error frecuente vs correcto |
| Objeto que se va | Elemento que rebota fuera con X | "Esto no vale / no cuenta" |
| Trazo que se dibuja | `strokeDashoffset` (firma, círculo, flecha) | Firmar, marcar, conectar |

## 6. Movimiento
- Entradas con resorte corto (rigidez 170–320, amortiguación 12–16); salidas rápidas con
  suavizado. Escalonar 3–6 cuadros entre elementos de un grupo.
- Cada escena tiene un movimiento de "cámara" (acercamiento, paneo o deriva), aunque sea lento.
- Sacudida solo en impactos (sellos, alertas), 0,3 s.
- Sin partículas ni brillos decorativos: solo si representan algo (confeti no; papel que cae sí).

## 7. Voz y subtítulos
Igual que la skill principal: voz de la marca, tiempos por palabra, frases de hasta 3–4
palabras, palabra clave resaltada, dentro de la zona segura.

## 8. Salida
1080×1920, 30 fps, H.264, audio AAC 192 kbps normalizado a −14 LUFS. Zona segura: nada
importante en los 200–250 px de arriba, los 330–380 px de abajo ni los 120–150 px de la derecha.

## 9. Autorrevisión (obligatoria)
Renderizar un cuadro por escena y revisarlos (hasta 3 rondas):
- [ ] ¿Serviría como miniatura? ¿Hay algo plano, vacío o genérico?
- [ ] El contexto se ve en el gancho; hay profundidad (sombras, capas, desenfoque).
- [ ] El momento "ajá" se ve claro, en primer plano y marcado.
- [ ] Algo cambia cada 2–4 s; al menos 4 tipos de plano.
- [ ] Ningún sello, tarjeta o marca tapa un texto importante.
- [ ] Subtítulos dentro de la zona segura, legibles y sincronizados con la voz.
- [ ] Sin parpadeos entre cuadros.
