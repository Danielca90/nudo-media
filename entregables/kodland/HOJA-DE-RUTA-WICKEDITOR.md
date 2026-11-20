# Hoja de ruta · Animar una pelota que rebota en WickEditor

Para el video de Kodland: explicarle a un niño de 10 años cómo animar una pieza, mostrando la pantalla.
Duración objetivo: 2 a 3 minutos.

**Importante:** los nombres de menús salen de tutoriales y foros de WickEditor, algunos de versiones anteriores. Haz **un ensayo completo antes de grabar** y anota cómo se llama cada botón en tu versión. Donde diga ⚠️, confírmalo tú.

## 1. Antes de grabar (10 minutos)

- [ ] Abre WickEditor en el navegador (wickeditor.com) y crea un proyecto nuevo.
- [ ] Cierra pestañas, chats y notificaciones. En Mac activa "No molestar".
- [ ] Sube el zoom del navegador al 125 % o 150 % para que se lea todo.
- [ ] Prueba el micrófono con una grabación corta y escúchala.
- [ ] Buena luz de frente y un lugar sin ruido.
- [ ] Ten abierta, en otra pestaña, una pelota ya animada solo como ejemplo de meta. Si la muestras, di que es un ejemplo y que ahora la haces tú.
- [ ] Abre `entregables/kodland/01-pelota-que-rebota/pelota-que-rebota.gif` si quieres enseñar cómo se ve el resultado esperado. Es una pieza hecha con IA, dilo.

## 2. Hoja de ruta en pantalla

### Parte A · Dibujar la pelota (30 s)
1. Elige la herramienta de **elipse/círculo** de la barra de herramientas.
2. Mantén presionada la tecla **Shift** mientras arrastras: así sale un círculo perfecto.
3. Pinta el relleno de **rojo** y deja el borde del mismo color o sin borde.
4. Dibuja una línea larga y plana abajo: es el **piso**. Ponla en otra capa, o ponla en un color distinto.

### Parte B · Mover la pelota con un tween (60 s)
Un *tween* es cuando le dices al programa "empieza aquí y termina allá" y él dibuja los cuadros del medio.

1. Selecciona la pelota. ⚠️ En Wick, los tweens se hacen sobre un objeto agrupado. Al crear el tween, Wick agrupa lo que haya en el cuadro, o puedes convertirlo tú con **Ctrl/Cmd + G** (en Wick se llama *clip*).
2. En la **línea de tiempo**, haz **clic derecho sobre el cuadro 1** y elige **Create Motion Tween**. ⚠️ En versiones anteriores el orden era: clic derecho → *Add Tween*, y luego crear un segundo cuadro clave.
3. Ve al **cuadro 12**: clic derecho → **Insert Keyframe**.
4. En ese cuadro 12, arrastra la pelota **hacia abajo, hasta el piso**.
5. Ve al **cuadro 24**: clic derecho → **Insert Keyframe** y arrastra la pelota **de vuelta arriba**.
6. Presiona **Play** y mira cómo sube y baja.

Plan de cuadros para el video:

| Cuadro | Qué pasa |
|---|---|
| 1 | La pelota arriba |
| 12 | La pelota en el piso |
| 24 | La pelota arriba otra vez |

### Parte C · El truco que la hace viva: aplastar y estirar (60 s)
Este es el momento más fuerte del video. Explícalo con tus palabras: "cuando algo blando golpea el piso, se aplasta; cuando va rápido, se estira".

1. En el **cuadro 12** (toca el piso), cambia el tamaño de la pelota: **más ancha y más baja**. Usa la herramienta de transformar/escalar. ⚠️ Revisa que tu versión permita cambiar el tamaño dentro del tween.
2. En el **cuadro 11** (justo antes de tocar), haz la pelota **un poco más alta y delgada** (estirada).
3. En el **cuadro 13** (justo después de rebotar), repite lo mismo: un poco estirada.
4. Presiona **Play** otra vez y compara: antes se veía como una caja, ahora parece de goma.
5. Si el movimiento se ve brusco, busca en el **Inspector** la opción de **easing** (suavizado) y pruébala.

### Parte D · Exportar y mostrar el resultado (30 s)
1. Haz clic en **Export** (o en el menú de archivo → exportar). ⚠️ Los tutoriales dicen que ofrece **GIF** (sin sonido) y **video** (con sonido).
2. Elige **GIF**.
3. Abre el archivo y muéstralo moviéndose.

## 3. Guion en paralelo: qué hacer y qué decir

| Tiempo | En pantalla | Lo que digo (para un niño de 10 años) |
|---|---|---|
| 0:00 | Tú en cámara | "¿Quieren que una pelota dibujada cobre vida? Hoy les enseño cómo se hace." |
| 0:15 | WickEditor vacío | "Voy a usar WickEditor, un programa gratis donde se anima desde el navegador." |
| 0:30 | Dibujas el círculo | "Primero dibujo la pelota: un círculo rojo. Con Shift sale perfecta." |
| 0:50 | Idea de animación | "Una animación son muchos dibujos que cambian poquito y se ven rápido, como un cuaderno de hojitas." |
| 1:10 | Tween con 3 cuadros | "Le digo: empieza arriba, baja al piso y vuelve a subir. El programa llena lo del medio solito." |
| 1:40 | Play | "¡Miren! Ya se mueve. Pero parece una caja que sube y baja. Falta algo." |
| 1:55 | Aplastar y estirar | "Cuando toca el piso la aplasto, y en el aire la estiro. Así parece de goma." |
| 2:30 | Play y exportar | "Ahora se ve viva. La guardo como GIF para compartirla." |
| 2:50 | GIF moviéndose | "Esto fue lo más difícil para mí: [tu verdad]." |
| 3:00 | Tú en cámara | "Ahora les toca: ¿qué dibujarían ustedes para animar?" |

Completa el "[tu verdad]" con lo que realmente te costó al practicar: por ejemplo que se viera natural, o aprender a cambiar el tamaño dentro del tween. No uses una dificultad inventada.

## 4. Plan B si algo no sale como se espera

- **El tween no se deja crear:** convierte primero la pelota en clip con Ctrl/Cmd + G y vuelve a intentar.
- **No puedes cambiar el tamaño dentro del tween:** haz la animación **cuadro por cuadro**. Inserta un cuadro clave por cuadro y redibuja o ajusta la pelota. Es más lento pero lo entiende cualquier niño, y es justo la idea del "cuaderno de hojitas".
- **El GIF sale pesado o con saltos:** baja el tamaño del lienzo o usa menos cuadros.
- **Te trabas hablando:** pausa la grabación y sigue, después cortas. Ellos dicen que una grabación hecha con el celular es perfectamente válida.

## 5. Cómo grabar en Mac

- `Cmd + Shift + 5` → elige **Grabar toda la pantalla** o **una parte**. En **Opciones** selecciona tu micrófono.
- Para detener, haz clic en el botón de parar de la barra de menú.
- Si quieres verte en una esquina, usa **OBS Studio** (gratis) con una escena de pantalla + cámara.
- Otra opción es grabar tu cara con el celular al inicio y al final, y pegar todo en iMovie.

## 6. Qué mirarán ellos (según la convocatoria)

- ¿Puede un niño de 10 años seguirte? Ve despacio y usa comparaciones.
- Fundamentos: forma (el círculo), color (rojo sobre fondo claro), composición (pelota y piso).
- Tu energía en cámara: sonríe y habla como si hablaras con un niño.
- Que sea tu trabajo: la animación debe hacerla tú, en directo, en pantalla.

## Fuentes

- [Wick Editor · HOWTO (GitHub)](https://github.com/Wicklets/wick-editor-2018/blob/master/HOWTO.md)
- [Wick Editor Forums · Convert to symbol](https://forum.wickeditor.com/t/convert-to-symbol/13405)
- [Bayu Studio · Wick Editor tutorial](https://www.bayustudio.com/en/animation-with-wick-editor/)
- [Wick Editor Forums · Exportar GIF transparente](https://forum.wickeditor.com/t/quick-tip-exporting-animations-as-transparent-gifs/4224)
- [Animation & Intro to Wick Editor (PDF)](https://tcornez.com/mm/Animation_WickEditor.pdf)
