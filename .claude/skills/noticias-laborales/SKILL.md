---
name: noticias-laborales
description: Convierte una noticia de derecho laboral colombiano (reforma, ley, decreto, sentencia de casación de la Corte Suprema, sentencia de la Corte Constitucional, circular o concepto del Ministerio del Trabajo, ampliación de derechos) en un reel animado rápido para Arca Jurídica. Úsala cada vez que el usuario mande un link o una noticia laboral, o pida un video sobre un cambio reciente.
---

# Noticias laborales → reel rápido (Arca Jurídica)

En derecho laboral, lo que más vale es enterarse primero: reformas, nuevas sentencias de casación,
cambios de precedente, sentencias que amplían derechos (fueros, estabilidad reforzada, licencias),
decretos y circulares. Cambian cómo se deciden los casos nuevos y lo que las empresas deben hacer.
El usuario manda el link apenas sale la noticia; el objetivo es tener el video **el mismo día**.

Se usa junto con:
- `estilo-arca-juridica` (marca, voz "Andrea Arca", remate de venta, escenario propio por tema),
- `videos-explicativos` (método, técnica 2D, render),
- `asesoria-juridica-colombia` (lectura jurídica y datos vigentes).

## 1. Leer y verificar (no saltarse nada)
1. Abrir el link (WebFetch). **Instagram, TikTok y otras redes no se pueden leer desde esta nube**
   (piden inicio de sesión): pedir al usuario capturas del post y del pie de foto, o el link de la
   noticia original, en un solo mensaje. Si es un medio de prensa, **buscar la fuente primaria** y usarla:
   - Leyes: Diario Oficial, Secretaría del Senado, Función Pública (Gestor Normativo).
   - Sentencias: relatoría de la Corte Suprema (Sala de Casación Laboral) o de la Corte Constitucional.
     Si solo hay comunicado de prensa y la sentencia no está publicada, decirlo.
   - Decretos, resoluciones, circulares y conceptos: Ministerio del Trabajo.
2. Clasificar con precisión. Equivocarse aquí es el error más grave:
   | Tipo | Cómo se dice en el video |
   |---|---|
   | Proyecto de ley / radicado / aprobado en un debate | "Se está discutiendo", "aún no es ley" |
   | Ley sancionada | "Ya es ley" + desde cuándo rige |
   | Decreto o resolución | "El Gobierno reglamentó…" + vigencia |
   | Sentencia de casación (Corte Suprema) | "La Corte Suprema decidió…": criterio para casos nuevos; si reitera o cambia la línea |
   | Sentencia de constitucionalidad (C-) | Efecto general: cambia cómo se aplica la norma para todos |
   | Tutela (T- / SU-) | T-: el caso concreto; SU-: unifica criterio. No exagerar el alcance |
   | Circular o concepto del Ministerio | Orientación; no es ley |
3. Sacar: número y fecha (ley, sentencia, radicado, magistrado ponente si aplica), **qué cambia**
   (antes vs después), **desde cuándo**, **a quién afecta**, **qué tiene que hacer una empresa ya**
   y el riesgo de no hacerlo.
4. Revisar con `asesoria-juridica-colombia` y anotar dudas. Si algo no se puede confirmar en la
   fuente primaria, no va en el video, o va marcado como pendiente para la abogada.

## 2. Guion (25–40 s + remate)
Estructura de noticia:
1. **Gancho de urgencia (2 s):** el cambio en una frase concreta.
   "La Corte Suprema acaba de cambiar cómo se despide a…", "Desde hoy, si tienes trabajadores de
   noche, esto te cambia…". Nada de "noticia importante" genérico.
2. **Fuente en pantalla:** tarjeta con tipo, número y fecha (ej. "Corte Suprema · SL1234-2026 ·
   3 nov 2026"). Da credibilidad y diferencia a Arca de los medios.
3. **Antes vs ahora:** comparación lado a lado.
4. **Qué debe hacer tu empresa:** 2–3 acciones concretas.
5. **Remate de venta** (de `estilo-arca-juridica`): "Y no tienes que hacerlo solo. En Arca
   Jurídica revisamos…, ajustamos tus contratos/reglamento/políticas, hacemos el seguimiento y te
   defendemos si llega una demanda. Escríbenos y blindamos legalmente tu empresa."
- Tono: informativo y sin opinión política ni partidista (nombrar al Gobierno o al Congreso solo
  como origen de la norma). Sin alarmismo falso. Sin prometer resultados.
- Guardar el guion y la fuente en `remotion-test/src/arca/noticia-<aaaa-mm-dd>-<tema>/GUION.md`,
  con el link original, el link a la fuente primaria y la fecha de consulta.

## 3. Video
- Técnica 2D motion graphics, voz "Andrea Arca", escenario propio del tema (regla de la marca:
  nunca el mismo fondo que el video anterior).
- Identidad de la serie "Noticia" (se repite en todas las noticias, además de la capa de marca):
  franja superior **"ACTUALIDAD LABORAL"** en dorado sobre verde con la fecha, tarjeta de fuente
  con el número de la norma o sentencia, y comparación "ANTES / AHORA".
- Sello opcional según el tipo: "YA ES LEY", "NUEVO CRITERIO DE LA CORTE", "EN DISCUSIÓN".
- Título fijo con el cambio, no con la categoría ("Nuevo fuero para…", no "Noticia laboral").

## 4. Publicación rápida
- No esperar el día del calendario: publicar el mismo día que sale la noticia, en la próxima
  franja buena (6:00 p. m. hora de Bogotá; si ya pasó, a primera hora del día siguiente) y
  mover el reel del calendario que caía ese día.
- Historia el mismo día con el reel y una encuesta ("¿Tu empresa ya lo sabía?").
- Pie de foto: qué cambió en 2 líneas, fuente con número y fecha, 3–5 hashtags
  (`#DerechoLaboral #ReformaLaboral #Colombia #RecursosHumanos`), llamado a escribir.
- Si Metricool está conectado para Arca, dejarlo como borrador para revisión; nunca publicar sin
  aprobación.
- Si la noticia da para más, ofrecer un carrusel "Lo que cambia, punto por punto".

## 5. Antes de entregar
- [ ] La fuente primaria está verificada y citada con número y fecha.
- [ ] El tipo está bien dicho (proyecto ≠ ley; tutela ≠ unificación).
- [ ] Vigencia y a quién aplica, claros.
- [ ] Cumple la regla del escenario propio y el remate de venta.
- [ ] Puntos dudosos marcados para que la abogada los confirme antes de publicar.
