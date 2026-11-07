---
name: estilo-arca-juridica
description: Estilo de los carruseles y videos de Arca Jurídica (asesoría jurídica y de RR. HH. en Colombia). Úsala junto con la skill videos-explicativos y redes-sociales-colombia cada vez que se haga contenido para Arca.
---

# Estilo – Arca Jurídica

Complementa `videos-explicativos`. Lo definido aquí manda sobre lo general.

## Marca y público
- Arca Jurídica, "A S E S O R Í A". Público: empleadores y RR. HH. en Colombia (a veces trabajadores).
- Objetivo: posicionar y captar consultas por WhatsApp. Cierre: "Escríbanos por WhatsApp" (falta @ y número: pedirlos).
- Tratamiento: **usted**. Tono profesional, directo, sin promesas de resultado (ética de publicidad de abogados).
- Siempre: "Orientación general, no es asesoría legal." Lenguaje condicional en lo penal/sancionatorio ("puede configurar", "puede ser").
- Verificar toda cifra o norma con búsqueda antes de publicar y marcar para revisión del abogado.

## Voz
- ElevenLabs **"Andrea Arca"** (`XrTN5zwTQo5HkNatlJ58`, clonada, español colombiano), modelo `eleven_v4`.
- Andrea habla pausado (~2,1 palabras/s): para 15 s el guion máx. ~38 palabras y se acelera 1,17x con `ffmpeg atempo=1.17` (dividir los tiempos del Scribe entre 1,17).

## Temas: misma identidad, distinta apariencia (ALTERNAR)
Regla del usuario: mantener la identidad visual **sin** que todo parezca "lo mismo con otro texto". Hay dos temas en `remotion-test/src/carrusel-incapacidades/tema.ts` (`TEMA_A`, `TEMA_B`, `aplicarTema`; envolver cada composición con `conTema('A'|'B', Comp)` de `Tema.tsx`). Alternar tema entre piezas consecutivas (A, B, A, B...) y, dentro de un mismo tema, cambiar también el color de fondo dominante y la posición de los objetos.

| | Tema A "Navy y pino" | Tema B "Amatista y teal" |
|---|---|---|
| Colores | verde `#1C453F`, oro `#A48843` / `#D8BC74`, navy `#2B3648` / `#18202D`, hueso `#EDEDEB`, taupe `#6D6359` | Deep Space Blue `#18314F`, Dark Amethyst `#0D0630`, Muted Teal `#8BBEB2`, Metallic Gold `#CAAC4B`, Lime Green `#E6F9AF` (acento de palabra clave), hueso lima `#F2F6E4` |
| Decoración | nieve + guirnalda | estrellas de 4 puntas que titilan + guirnalda |
| Fondo | degradado liso | "aurora": manchas desenfocadas en movimiento |
| Apertura | ranura vertical que se abre | círculo que se expande |
| Chips / paneles | círculo + pastilla; esquina grande abajo-izquierda | azulejo cuadrado (como la paleta de referencia) + tarjeta; silueta espejada |
Rojo `#B3202E` / `#F08A92` solo para alertas (X, sello, tachado) en ambos. Usar siempre tokens `C.*`, nunca hex sueltos. Sobre fondo claro usar `C.oroTxt` (oro más oscuro) para texto dorado.
Para sumar un tercer tema: añadir otra paleta + banderas de estilo (`deco`, `apertura`, `chip`, `fondo`) en `tema.ts`.

## Tipografía
Titulares **Playfair Display** 900 (palabra clave en cursiva dorada); cuerpo **Inter** 600/700. Fuentes en `remotion-test/public/fonts` (no depender de internet).

## Estructura visual (referencia: carrusel tipo Pereira & Associados)
- Marca centrada arriba ("Arca Jurídica" + "A S E S O R Í A"); guirnalda de luces doradas y nieve suave en temporada navideña.
- Paneles grandes con **una esquina muy redondeada** (190 px) y a veces pestaña tipo carpeta; fondos que alternan oscuro / hueso / verde.
- Pregunta en **globo de diálogo**; pastillas blancas; botón-pastilla con ícono ↓ y nota corta.
- **Objetos fotográficos recortados** que se salen del panel (generados con ElevenLabs `bytedance-seedream-5-pro` sobre fondo blanco + `birefnet-v2-bg-removal`), guardados en `public/objetos/`. Sin texto ni logos reales en las imágenes. Objetos blancos sobre blanco (papel, calendario) se pierden al recortar: usarlos como tarjeta redondeada.
- Código reutilizable: `src/carrusel-incapacidades/Base.tsx` (Marco, Blob, Hero, Globo, Pastilla, Titular) y `src/videos-15s/comun.tsx` (Escena, Chip, Subs, Boton).

## Animación (referencia: Granger landing page, Dribbble)
Apertura desde una ranura vertical que se abre a tarjeta con sombra grande; titulares que suben desde máscara y pasan de borroso a nítido; paneles que entran en horizontal con desenfoque; palabra gigante translúcida cortada abajo; punto de acento dorado en la etiqueta; swipe horizontal entre láminas.

## Video corto (15 s)
- Formato 1080×1920, 450 fotogramas. Subtítulos en la zona media (centro al 41 % del alto), Inter 800, borde negro, 1 palabra clave con recuadro dorado.
- Gancho en 0–2 s: afirmación fuerte + el objeto ya en pantalla; golpe visual sincronizado con la palabra (mazo, sello).
- Una escena por idea (≈3 s), con "chips" que entran en la palabra que la voz nombra. Cierre: botón WhatsApp + aviso legal. Dejar libres los 320 px inferiores.

## Correcciones del usuario
- 2026-11-07: dio una segunda paleta (Lime Green, Metallic Gold, Muted Teal, Deep Space Blue, Dark Amethyst) para alternar estilos; es súper importante mantener la identidad pero no generar siempre "lo mismo".
- 2026-11-07: el carrusel debe copiar la **estructura** de la referencia (paneles, objetos que se salen, globo, botón), no solo colores/tipografía.
