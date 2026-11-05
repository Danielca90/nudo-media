---
name: estilo-arca-juridica
description: Estilo de Arca Jurídica (@arcajuridica), firma colombiana de abogados consultores en derecho laboral para empresas. Úsala para cualquier reel, video, post gráfico o carrusel de Arca, junto con videos-explicativos (videos) o instagram-reels-colombia (piezas gráficas), y con asesoria-juridica-colombia para revisar el contenido legal.
---

# Estilo – Arca Jurídica

Complementa `videos-explicativos` e `instagram-reels-colombia`. Lo que se define aquí manda sobre lo general.
El contenido legal se valida con `asesoria-juridica-colombia` antes de publicar.

**Antes de cualquier pieza, leer [estrategia-alcance.md](estrategia-alcance.md)**: gancho en
2 s, título fijo, estructura de retención, formatos para no seguidores. Manda sobre lo que
se copió de los videos de referencia, que no estaban llegando a no seguidores.

## Propuesta de valor (lo que se vende en TODOS los videos)

Arca es una cuenta de **asesoría legal**: los videos enseñan para enganchar, pero el remate
siempre vende el servicio. Mensaje del usuario (2026-11-05):
> Nosotros nos encargamos de revisar, validar y velar porque todos esos requisitos se cumplan,
> de redactar todos los documentos y hacer los seguimientos respectivos, e incluso de la
> protección ante futuras demandas. Blindamos legalmente al empresario.

Estructura obligatoria de cada guion:
1. **Gancho** con el riesgo o el error (2 s).
2. **Los requisitos / pasos** (mostrar que es más complejo de lo que parece: esa es la razón
   para contratar asesoría).
3. **Giro de venta:** "Y no tienes que hacerlo solo." 
4. **Propuesta de valor adaptada al tema**, con estos verbos: *revisamos / validamos* que cada
   requisito se cumpla · *redactamos* los documentos (nombrar los del tema) · *hacemos el
   seguimiento* · *te defendemos si llega una demanda*.
5. **Llamado a la acción:** "Escríbenos y blindamos legalmente tu empresa."

Visual del remate (componente `CierreServicios` en `kit.tsx`): escudo de Arca + lista
"Arca se encarga" con checks dorados sincronizados con cada verbo + botón "ESCRÍBENOS".

**Límite ético (no negociable):** no prometer resultados. Nunca "no vas a tener demandas",
"cero demandas" ni "garantizado" (código disciplinario del abogado, Ley 1123 de 2007, y
publicidad veraz, Ley 1480 de 2011). Sí: "blindamos legalmente tu empresa", "prevenimos",
"reducimos el riesgo", "te defendemos si llega una demanda".

## Skills que se cargan juntas (todas en este repo, `.claude/skills/`)
- `videos-explicativos` — método de video (guion, plan visual, voz, subtítulos, Remotion, render).
- `instagram-reels-colombia` — guion de Reel por escenas, carrusel, portada, pie de foto, hashtags.
- `redes-sociales-colombia` — voz, pilares, ganchos, calificación de posts, calendario y reglas colombianas.
- `noticias-laborales` — cuando el usuario manda un link de una reforma, sentencia o cambio
  laboral: verificar la fuente primaria y sacar el reel el mismo día.
  Trato: **tú** al gerente en ganchos y preguntas ("¿Tienes un contador?", "tu empresa"),
  como hace la abogada en sus reels; **ustedes / su empresa** cuando explica a varios.
  Nunca voseo.

## Marca
- Nombre: **Arca Jurídica · Abogados Consultores** · Instagram **@arcajuridica**
  (https://www.instagram.com/arcajuridica/, confirmado por el usuario).
- Rubro: asesoría laboral para empresas en Colombia (contratación laboral o civil,
  tercerización, compensación, turnos y jornadas, procesos disciplinarios,
  reglamento interno de trabajo, gestión del talento humano).
- Público: **gerentes y dueños de empresa** (no el trabajador).
- Mensaje central: *"Tú te enfocas en hacer crecer tu empresa; del orden de tus
  colaboradores nos encargamos nosotros."* · Firma: *"Tu empresa en buenas manos"*.
- Objetivo: posicionar a Arca como experta, generar urgencia por cambios normativos
  (p. ej. el nuevo Estatuto del Trabajo) y llevar a contacto/asesoría.

## Paleta y tipografía (sacadas del post de referencia)
| Uso | Color |
|---|---|
| Verde petróleo oscuro (bandas, íconos, títulos) | `#1B3A3B` (variante `#1E484A`) |
| Dorado (acentos, segunda línea del título, resaltes) | `#C6A96B` |
| Fondo crema | `#F8F7F2` |
| Texto | verde oscuro sobre crema · blanco/dorado sobre verde |

- Títulos: **serif clásica en mayúsculas** (tipo Playfair / Cormorant / Libre Baskerville).
  Primera línea blanca, segunda en dorado.
- Cuerpo: sans geométrica limpia (tipo Montserrat / Poppins), negrita para la frase clave.
- Acento manuscrito: script dorado con subrayado ("Tu empresa en buenas manos").
- Logo: arco/libro abierto en verde con "V" dorada + "ARCA JURÍDICA / ABOGADOS CONSULTORES".
  Usar siempre el archivo real del logo; no redibujarlo.

## Formato 0 – Video animado automático (formato principal desde 2026-11-05)
Pedido del usuario: videos **animados**, sin 3D, tipo motion graphics / stop motion con texto y
gráficos llamativos, y **100 % automáticos**: la abogada no graba nada por ahora.
- **Voz:** ElevenLabs, voz clonada **"Andrea Arca"** (`XrTN5zwTQo5HkNatlJ58`, español de Colombia),
  modelo `eleven_v4`. Guion en tú al gerente, 25–32 s, números en palabras.
- **Mundo visual:** escenario ilustrado plano en la paleta de la marca, **distinto según el tema**
  (ver la regla de abajo). Nítido en el gancho y desenfocado después para que resalten los
  objetos; parte baja oscura (verde) para el logo y los subtítulos.
- **Objetos que explican:** calendario de diciembre, contratos y avisos en papel blanco con borde
  verde, fichas de fecha, barras y contadores, sellos que caen con sacudida (rojo óxido solo para
  error o riesgo), checks verdes, botones finales "GUÁRDALO" / "ENVÍALO".
- **Movimiento:** resortes (entradas con rebote corto), trazos que se dibujan, contadores, sellos
  con sacudida, avión de papel que vuela. Llamativo pero sobrio: nada de personajes caricaturescos.
- **Escenario propio por tema (regla del usuario, 2026-11-05):** nada de plantilla con el mismo
  fondo. Lo único que se repite es la capa de marca (título, subtítulos, logo/@, remate de venta,
  cierre). El escenario y los objetos de contexto se diseñan para cada tema, en
  `src/arca/escenarios/`, y **dos videos seguidos del calendario nunca comparten escenario**.
  Antes de programar, escribir en `GUION.md`: ¿dónde pasa esta historia? ¿qué objetos de ese
  lugar cuentan el tema? Escenarios ya usados:
  | Escenario | Tema | Elementos de contexto |
  |---|---|---|
  | `Bodega` | Reel 01 · despidos | Estanterías con cajas, portón de carga, letrero SALIDA, reloj de marcación, estiba, líneas de seguridad, polvo en los haces de luz |
  | `OficinaDiciembre` | Reel 02 · contratos que vencen el 31 dic | Atardecer, guirnalda de luces de diciembre, flor de pascua, calendario DIC 31, archivador CONTRATOS / AVISOS / 2027, lámpara |
  | `Oficina` (kit) | Genérico, ya no usar como fondo principal | — |
  Ideas para los próximos: sala de juntas / Ministerio del Trabajo (requerimiento), consultorio o
  sala de lactancia (fueros), área de nómina con pantallas y calculadora (liquidación, prima),
  obra o planta con turnos y reloj (recargos y festivos), coworking / freelancer (contrato
  realidad), sala de capacitación de aprendices.
- Los objetos de cada escena también salen del tema (chat de "Carlos · Bodega", caja de regalo
  DEMANDA, carta con hechos reales del caso), no solo hojas genéricas del kit.
- **Capas fijas:** título en caja verde inclinada con línea 2 en dorado (arriba, dentro de la zona
  segura) · emblema + ARCA JURÍDICA | @arcajuridica sobre el zócalo · subtítulos en frases de
  hasta 3 palabras, Montserrat 800 blanca con borde verde y palabras clave en dorado.
- **Cierre:** 2,4 s en verde con logo claro, "Tu empresa en buenas manos" (serif itálica dorada) y @.
- Código: `remotion-test/src/arca/` (`marca.ts`, `kit.tsx` reutilizable, una carpeta por reel con
  `GUION.md`, `palabras.json` y el componente). Hechos: `reel02/` (32,6 s) y `reel01/` (35 s).
- Técnica: 2D por defecto (temas legales = documentos, plazos, dinero). Seguir
  `videos-explicativos/referencias/2d-motion-graphics.md`. Mixto solo si un objeto físico lo pide.
- Logo: recortado del post de referencia (`public/arca/logo-*.png`, `emblema-*.png`). Cambiarlo por
  el archivo original en cuanto el usuario lo envíe.

## Formato 1 – Reel con la abogada a cámara (videos de referencia F y H)
- Grabación real, vertical, plano medio-corto; la abogada habla directo a cámara con
  micrófono de mano. Fondo: su oficina con el **letrero de madera de Arca Jurídica**
  visible arriba a la izquierda, planta y repisas. Luz natural.
- Edición mínima: un solo plano, sin música protagonista, sin 3D. Lo que se agrega:
  - **Subtítulo de una sola palabra a la vez**, MAYÚSCULAS, sans extra-negrita blanca
    con sombra suave, en el **tercio inferior** (a la altura de las manos), sincronizado
    con la voz. Solo palabras clave (MÁS, DEBE, ENFOCAR, DISCIPLINARIO, TRABAJO, EMPRESA);
    no todas las palabras. Corregir la tilde (en la referencia salió "MáS", "ESTé": evitarlo)
    y no partir palabras largas ("DISCIPLINARI/O"): reducir el tamaño si no caben.
  - **Ícono de Instagram + "@ARCAJURIDICA"** pequeño, blanco, que **cambia de posición**
    cada pocos segundos (izq.-medio, der.-arriba, izq.-abajo) sin tapar la cara.
- Tono hablado: profesional pero cercano, **ustedes / su empresa** al dirigirse a los
  gerentes; frases de advertencia ("hoy en día es mucho más cuidadoso…", "es importante
  que…"). Referencias concretas: términos de ley, reglamento interno de trabajo,
  políticas disciplinarias.
- Duración: 20–40 s, un solo punto por video.

### Variante exterior tipo selfie (ref. H, 28,7 s)
- La abogada graba en selfie, en la calle o un edificio, cámara un poco desde abajo,
  cielo azul de fondo, ropa casual (camisa azul). Más espontáneo que el de la oficina.
- Guion modelo **"¿Sabes qué hacer?"**:
  1. Ráfaga de preguntas de lo que el gerente sí tiene: "¿Tienes un contador? ¿Tienes quien
     maneje el sistema de gestión de seguridad y salud en el trabajo? ¿Quien apoye recursos humanos?"
  2. Giro con "Pero…": la situación difícil (despedir a un trabajador, un requerimiento del
     Ministerio del Trabajo, un reclamo de un colaborador) → "¿Sabes qué hacer? ¿Sabes cómo solucionarlo?"
  3. Posicionamiento: **"En Arca Jurídica somos el abogado de cabecera de tu empresa"**.
  4. Cierre: cada decisión que tomes con tus trabajadores debe tener respaldo legal → llamado a escribir.
     (La referencia termina cortada en "es importante que cada decisión que tomes": el cierre
     debe quedar completo y con llamado a la acción.)
- Subtítulos de la referencia: fuente display tipo cómic, blanca con borde negro, una palabra
  a la vez. **Ya no se usa** (ver estrategia): frase corta en sans gruesa blanca con borde
  oscuro y palabra clave en dorado.
- Mejoras frente a la referencia: no subtitular palabras vacías ("DE", "DEL", "PERO");
  solo la palabra clave de cada frase (SALUD, DESPEDIRLO, MINISTERIO, CABECERA, IMPORTANTE).
  La ref. tiene un filtro/compresión que posteriza el cielo y la piel (manchas de color):
  exportar sin ese filtro, con buena calidad.
- El @ con ícono de Instagram sigue saltando de posición; en un momento el ícono sale en
  el degradado rosa de Instagram: se acepta como acento puntual.
- Si se hace con voz de ElevenLabs: voz clonada "Andrea Arca" (ver Formato 0).

## Formato 2 – Post gráfico / flyer (imagen de referencia)
Estructura de arriba abajo:
1. Logo centrado arriba.
2. **Pregunta gancho** al gerente ("¿Tu empresa está preparada para…?") con el dato
   clave resaltado en una franja dorada con texto serif itálico.
3. **Banda verde inclinada** con el título en serif mayúscula (línea 1 blanca, línea 2 dorada).
4. Párrafo con línea vertical dorada a la izquierda; cierre en negrita.
5. **4 servicios** en fila: ícono lineal dentro de círculo verde con aro dorado, texto
   corto debajo, separados por líneas verticales doradas.
6. Banda verde inferior con ícono de crecimiento y frase de cierre (palabras clave en dorado).
- Fotografía de fondo: ejecutiva en oficina luminosa, **bandera de Colombia** de fondo,
  plantas; ocupa el lado derecho. Acento manuscrito dorado al costado.
- Copy del pie: emoji ⚖️/🛡️ + "Nuestros servicios son:" + lista separada por comas.

## Reglas de contenido (abogados – Colombia)
- Verificar en fuente oficial cada norma o proyecto que se mencione (número, estado:
  radicado, aprobado, vigente) antes de publicar; si es proyecto, decirlo.
- Sin promesas de resultado ("ganamos siempre"), sin precios engañosos ni casos de
  clientes identificables (ética publicitaria del abogado, Ley 1123 de 2007).
- Nombrar gobiernos/políticos solo como dato de origen de la norma, sin opinión partidista.
- Marcar el contenido como orientativo cuando dé pasos legales concretos.

## Calendarios
- `arca-juridica/calendario-nov-dic-2026.html` — 4 semanas (10 nov – 4 dic 2026): 12 reels,
  4 carruseles, historias. Publicado en https://claude.ai/artifact/TAd4AACaWkT6g86bpNkB7e

## Correcciones del usuario
- 2026-11-05: estilo inicial aprendido de un post (Nuevo Estatuto del Trabajo) y un reel
  a cámara sobre procesos disciplinarios.
- 2026-11-05: segundo reel (selfie exterior, "¿sabes qué hacer?", abogado de cabecera):
  la abogada tutea al gerente; subtítulo cómico con borde negro.
- 2026-11-05: la cuenta no llega a no seguidores. Objetivo: más alcance sin volverlo
  caricaturesco ni ridículo. Estrategia en estrategia-alcance.md.
- 2026-11-05: formato principal = video animado automático (motion graphics, sin 3D, sin que la
  abogada grabe). Primer reel: 02, contratos a término fijo.
- 2026-11-05: la cuenta es de asesoría legal: todo video termina vendiendo el servicio
  (revisar, validar, redactar, hacer seguimiento, defender ante demandas, blindar). Ver
  "Propuesta de valor".
- 2026-11-05: el contenido no puede verse repetitivo: escenario y objetos de contexto propios de
  cada tema; solo la capa de marca se repite.
- 2026-11-05: pilar de actualidad: reformas, casaciones, sentencias que amplían derechos. El
  usuario manda el link apenas sale la noticia → skill `noticias-laborales`.
