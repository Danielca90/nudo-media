# Estilo: SketchUp + Blender

Modelos detallados hechos en **SketchUp** (el usuario tiene el MCP de SketchUp configurado en su Mac) y
llevados a **Blender** para materiales, luces, animación y render. Remotion se usa al final para voz,
subtítulos y cierre. Ejemplo: el video del chazo.

> **Pendiente de completar:** el video del chazo se hizo fuera de este repo. La próxima vez que se haga un
> video en este estilo, pedirle al usuario el video o los archivos de referencia y anotar aquí el look exacto
> (encuadres, materiales, ritmo, textos) y el flujo real que se usó.

## Cuándo
Productos, herrajes o instalaciones donde importa el detalle del modelo (piezas reales, medidas, montaje).

## Flujo de referencia
1. **Modelado en SketchUp** (en el Mac del usuario, vía su MCP de SketchUp). Para muebles, los modelos
   paramétricos de `muebles/generar_muebles.py` sirven de base de medidas y despiece.
2. **Blender** (skill `modelado-blender`): importar, materiales con nodos (madera procedural de pino, roble,
   nogal o cedro), luces, cámara y animación con keyframes.
   - En la nube no hay GPU: Cycles en CPU, o EEVEE con Mesa (`apt-get install libegl1 libgl1-mesa-dri`).
   - En el Mac del usuario: MCP de Blender para ver en vivo.
3. **Render** de la animación a video o secuencia de imágenes.
4. **Remotion**: video de fondo con `<OffthreadVideo>`, voz de Brian, subtítulos (reglas del explicativo),
   etiquetas y @somos_nudodesign.

## Videos hechos
- Video del chazo (fuera de este repo; detalles por documentar).
