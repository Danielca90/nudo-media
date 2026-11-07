---
name: modelado-blender
description: Modelar en Blender por código (bpy, sin pantalla): objetos low poly y de revolución, muebles con tableros, materiales con nodos (madera procedural de pino, roble, nogal, cedro), renders de preview, horneado de texturas a PNG y exportación a glb/obj/fbx/stl. Incluye el flujo para convertir un modelo en inflable con patrones de corte (inflatable_designer.py). Úsala cuando se pida modelar, texturizar o renderizar algo en Blender, hacer materiales con nodos, o pasar un modelo a inflable.
---

# Modelado en Blender por código

Esta skill hace modelos 3D **escribiendo scripts de Python para Blender** (`bpy`), no con atajos
de teclado. El modelo queda **paramétrico**: cambiar un número y volver a correr.

| Archivo | Qué es |
|---|---|
| `scripts/instalar_blender.sh` | Instala Blender 4.5 LTS en el entorno en la nube (idempotente, ~1 min) |
| `scripts/nudo_bpy.py` | Librería probada: escena, revolución, cajas, modificadores, materiales, madera, render, horneado, exportación |
| `scripts/inflatable_designer.py` | Script del usuario: forma inflada → patrones planos de corte (SVG) |
| `ejemplos/maceta_pasos.py` | Maceta low poly en 7 pasos (cilindro → loop cuts → borde → subdivision), un render por paso |
| `ejemplos/demo_maceta_madera.py` | Maceta + tabla de pino: render, horneado de textura, .glb y .blend |
| `ejemplos/muestrario_maderas.py` | Las 4 maderas procedurales lado a lado |
| `ejemplos/inflable_maceta_obj.py` | Genera el OBJ cerrado con paneles (gajos, tapa, base) para el diseñador de inflables |
| `referencias/` | Renders de referencia de lo que sale bien |

## 1. Preparar el entorno

1. `blender --version`. Si no existe: `bash scripts/instalar_blender.sh`.
   En el entorno en la nube **se borra al reiniciar**; reinstalar o pedir al usuario que lo agregue al script de arranque del entorno.
2. Correr siempre sin pantalla: `blender -b -P mi_script.py -- <argumentos>` (los argumentos van después de `--`; leer con `sys.argv[-1]`).
3. **No hay GPU**: Cycles en CPU. EEVEE y Workbench (render en tiempo real, estilo videojuego) también funcionan
   instalando Mesa: `apt-get update && apt-get install -y libegl1 libgl1-mesa-dri libgles2` (se pierde al reiniciar). Referencia de tiempos con 4 núcleos: 480 px a 48 muestras ≈ 8 s por imagen; 900×700 a 32 muestras ≈ 30 s. Para iterar usar 16–32 muestras y resolución baja; subir solo para el render final.
4. En el Mac del usuario: el **MCP de Blender** o la pestaña Scripting ejecutan el mismo código. La librería funciona igual allí (quitar `escena_nueva()` si se quiere trabajar sobre la escena abierta).

Plantilla mínima:
```python
import os, sys
sys.path.insert(0, "<ruta a la skill>/scripts")
from nudo_bpy import *
OUT = sys.argv[-1]
escena_nueva(muestras=32, resolucion=(900, 700))
ob = revolucion("vaso", [(0,0),(.04,0),(.045,.12),(.04,.12),(.036,.01),(0,.01)], segmentos=32)
subdivision(ob, 2); asignar(ob, material_simple("vidrio_mate", (.8,.85,.9), rugosidad=.2))
piso(); sol(); cam = camara(); encuadrar(cam, [ob])
render(os.path.join(OUT, "vaso.png")); guardar_blend(os.path.join(OUT, "vaso.blend"))
```

## 2. Elegir la técnica según la forma

| Forma | Técnica | Función |
|---|---|---|
| Redonda o simétrica en un eje (macetas, vasos, lámparas, patas torneadas) | **Perfil + revolución**: lista `(radio, z)` de abajo hacia arriba; si es hueca, el perfil sigue por la pared interior hacia abajo | `revolucion()` |
| Muebles, cajas, estanterías | **Tableros** como cajas entre dos esquinas, en metros; espesor real (0.018) | `caja()` |
| Suave y orgánica pero simple | Jaula low poly + **Subdivision Surface** | `subdivision()` |
| Paredes delgadas (cascarón) | Superficie + **Solidify** | `espesor()` |
| Malla arbitraria calculada | Vértices y caras desde listas | `malla()` |
| Orgánica compleja (manos, personajes, caras) | **No por código.** Sale tosco. Usar escultura a mano, o una IA de imagen a 3D (Meshy, Tripo) como base y limpiar | — |

Reglas de modelado:
- **Low poly primero**: pocos segmentos (8–16) y pocos anillos; la suavidad la da la subdivisión. Cada paso de la imagen de "modeling tips" es un cambio en la lista del perfil: un loop cut es un anillo más; escalar la base es cambiar su radio.
- **Unidades reales en metros** y el frente del objeto mirando a **-Y** (vista Front de Blender, Rhino y SketchUp). Si se modela en otro sistema, invertir el eje al exportar.
- Normales hacia afuera y caras con orientación consistente (`revolucion()` ya lo hace). Un abanico de tapa mal orientado rompe herramientas que exigen malla cerrada.
- Para enseñar los pasos, `jaula(ob)` dibuja la malla en azul como el overlay de Edit Mode.

## 3. Materiales con nodos

- `material_simple(nombre, color, rugosidad, metal, emision)`: Principled BSDF directo.
- `material_madera(nombre, tipo, escala, direccion, rugosidad, relieve)`: madera procedural.
  Tipos: `pino`, `roble`, `nogal`, `cedro` (diccionario `MADERAS`: color claro, color oscuro, anillos por metro, distorsión).
  Cadena: Texture Coordinate (Object) → Mapping (estirado en el eje de la veta) → **Noise que deforma las coordenadas** → Wave RINGS con perfil SAW → ColorRamp de 3 paradas → multiplicado con un Noise fino (poro) → Base Color; el Wave también va a Bump.
  - `direccion` = eje a lo largo del cual corre la veta ('X', 'Y', 'Z'): en tableros, el lado largo.
  - Lo que se aprendió ajustándola: sin la deformación por ruido las vetas salen rectas y parejas (parece pana); con la escala del Wave muy baja salen franjas de 10 cm borrosas. Referencia buena: `referencias/maderas.png`.
- Para nuevos materiales, construir la cadena de nodos igual: crear nodos con `nt.nodes.new("ShaderNode…")`, conectarlos con `nt.links.new(salida, entrada)` y siempre **renderizar una muestra antes de entregar**.
- Nombres de entradas en Blender 4.x: `"Base Color"`, `"Roughness"`, `"Metallic"`, `"Emission Color"`, `"Emission Strength"`; el nodo Mix nuevo es `ShaderNodeMix` con `data_type` (`"RGBA"`, `"VECTOR"`) y entradas `"A"`, `"B"`, `"Factor"`, salida `"Result"`.

## 4. Salidas

- `render(ruta)`: PNG. Ver siempre el render (abrir la imagen) antes de mostrarlo al usuario; si algo se ve mal (vetas, encuadre, sombras), corregir una vez y volver a renderizar.
- `encuadrar(cam, objetos, direccion, margen)`: ajusta la cámara a los objetos según la proporción de la imagen.
- `hornear_textura(ob, ruta, "DIFFUSE"|"ROUGHNESS"|"NORMAL", lado)`: convierte el material procedural en imagen. **Los nodos procedurales solo existen en Blender**; para SketchUp, el visor web u otro programa hay que hornear. Crea UVs con Smart UV Project si faltan.
- `exportar([obs], "x.glb" | ".obj" | ".fbx" | ".stl")` y `guardar_blend(ruta)`. Entregar siempre el `.blend` para que el usuario siga editando en su Mac.
- Para mostrar varios pasos en una sola imagen: `montage` de ImageMagick con `-label` por imagen (ver cómo se armó `referencias/maceta_pasos.jpg`).

## 5. De modelo a inflable

`scripts/inflatable_designer.py` (del usuario) recibe la **forma inflada** y calcula las piezas planas a cortar, con margen de costura, piquetes y etiquetas de costura, simulando el inflado con una membrana que se arruga en compresión.

Requisitos del OBJ (el script falla si no se cumplen):
- **Malla cerrada** (hermética) y con caras orientadas de forma consistente.
- **Paneles** = grupos `g` o materiales; cada panel debe ser **una sola pieza tipo disco** (sin agujeros ni asas).
- Ejemplo de cómo generarlo por perfil con gajos + tapa + base: `ejemplos/inflable_maceta_obj.py`.

Uso: `pip install scipy matplotlib numpy` y
`python3 -I scripts/inflatable_designer.py --input forma.obj --size 150 --allowance 15 --sheet-width 1500 --out salida`
(`--size` = dimensión mayor en cm; `--sheet-width` = ancho del rollo de tela en mm). Unos 2 min para ~6 000 triángulos.

Lo que enseñó la prueba con la maceta (1.5 m):
- **Un inflable no puede tener superficies planas ni hendiduras**: la tapa plana se infló como domo (error máximo 31 cm) y el cuello bajo el borde se rellenó. Abombar la tapa lo bajó a 19 cm, pero no basta.
- **Formas huecas** (el interior de una maceta) son imposibles sin estructura interna: el hueco se infla hacia afuera. Hacer la versión maciza.
- Mejor dividir en **gajos que pasen por encima** (como un balón de playa) que poner una tapa redonda aparte: evita la superficie plana y piezas más anchas que el rollo.
- Revisar en el reporte la **diferencia de largo en cada costura**; más de 1 cm hay que corregirla.
- El script es una versión simplificada del método de Disney (Skouras 2014): en formas difíciles **no converge**. Decir los números de error con honestidad; no presentar los patrones como listos para cortar si el error es grande.
- Para planos o hendiduras reales se usan tensores o diafragmas internos, que este script no simula.

## 6. Cómo trabajar con el usuario

- Mostrar resultados con imágenes renderizadas y entregar `.blend` + exportaciones.
- Decir qué no salió igual a la referencia (proporciones, detalles) en vez de darlo por perfecto.
- Lo orgánico complejo: avisar de entrada que por código queda tosco y proponer la alternativa.
- Para muebles de Nudo, usar medidas reales en metros, tablero de 18 mm y madera procedural del tipo que pida.
