# Plan de producción — Creality Falcon + LightBurn

## Archivos
| Carpeta | Qué hay |
|---|---|
| `laser/lightburn/*.lbrn2` | Proyectos LightBurn con 3 capas ya configuradas (corte, grabado relleno, línea de marcado) |
| `laser/svg/*.svg` | Los mismos diseños en SVG (1 unidad = 1 mm) por si prefieres importarlos: **rojo = corte, negro relleno = grabado, azul = línea** |
| `laser/mockups/*.png` | Imágenes de producto 1200×1200 para web y redes |
| `laser/catalogo.json` | Medidas de cada hoja |

> **Honestidad:** no tengo LightBurn ni la máquina aquí. Los `.lbrn2` están generados por código con la estructura del formato y validados como XML; los SVG sí son estándar. **Abre un archivo en LightBurn y comprueba que se ve bien antes de cortar**; si alguno no abre, importa el SVG correspondiente y asigna a cada color su capa (la tabla de abajo).

## Máquina y material
- **Creality Falcon2 22 W** (área 400 × 415 mm). Todas las hojas caben (la más grande: sorteo, 334 × 386 mm). Si tienes la Falcon 5 W/10 W, el corte de 3 mm necesita mucho más tiempo o más pasadas; considera grabar con ella y cortar madera de 2 mm.
- **Material base: contrachapado/plywood de pino o abedul de 3 mm** (bajo en pegamento, corta limpio). Evita MDF para llaveros/objetos que se tocan (humo y polvo). El diodo **no corta acrílico transparente o azul**.
- **Aire asistido activado** y panel de abeja/rejilla debajo. Pegar cinta de enmascarar sobre la madera evita marcas de humo (retirar después del grabado).

## Ajustes de partida (¡hacer una prueba de material!)
| Capa | Modo | Velocidad | Potencia | Pasadas | Notas |
|---|---|---|---|---|---|
| 01 CORTE | Línea | 7 mm/s (≈420 mm/min) | 100 % | 2 | Corta 3 mm; si no atraviesa, 3 pasadas o 5 mm/s |
| 02 GRABADO RELLENO | Relleno | 100 mm/s (6000 mm/min) | 45 % | 1 | Intervalo 0,1 mm; bidireccional; sobreescaneo 1 mm |
| 03 LÍNEA MARCADO | Línea | 40 mm/s | 22 % | 1 | Líneas finas decorativas |

Son **valores de partida razonables para 22 W**, no calibrados con tu madera. Usa *Material Test* de LightBurn (Laser Tools → Material Test) y ajusta. Orden de ejecución ya definido: primero grabado y líneas, **al final el corte** (así la pieza no se mueve antes de grabar).

## Los 10 diseños
| # | Diseño | Hoja (mm) | Notas |
|---|---|---|---|
| 01 | Llaveros de pareja (corazón partido en zigzag) | 134 × 65 | Nombres con `--set nombre1=… nombre2=…` |
| 02 | Posavasos mandala (4 estilos) | 208 × 208 | Sellar con aceite/cera |
| 03 | Placa de tu canción (onda de sonido) | 210 × 120 | La foto central es de ejemplo: reemplázala por la del cliente (capa Imagen, Jarvis o Stucki, 254–318 LPI) |
| 04 | Guirnalda de fases lunares (8 discos) | 274 × 138 | Agujeros para hilo |
| 05 | Adornos de Navidad (estrella, árbol, copo, bola con nombre) | 315 × 90 | `--set nombre=… anio=…` |
| 06 | Triqui de viaje (tablero + 5 X + 5 O) | 161 × 226 | |
| 07 | Vales de pareja (12) | 277 × 228 | Frases en `lib/disenos.py` → `FRASES` |
| 08 | Placa de mascota (hueso + chapa) | 194 × 84 | `--set mascota=… telefono=…` |
| 09 | Marcapáginas filigrana (4) | 218 × 160 | Añadir borla de hilo |
| 10 | Placa de coordenadas | 210 × 160 | `--set lugar=… coordenadas=… fecha=…` |
| ★ | **Sorteo: 100 llaveros numerados** (2 hojas de 50) | 334 × 386 | `sorteo_100_llaveros_hoja1/2` (#001–#050 / #051–#100) |

## Personalizar y regenerar
```bash
pip install shapely fonttools brotli
python3 laser/generar.py                                   # regenera todo
python3 laser/generar.py --solo 01 --set nombre1=Sofía nombre2=Juan
bash laser/lib/renderizar.sh                             # mockups SVG → PNG (necesita node + playwright)
```
Los textos están convertidos a trazos (no necesitas instalar las fuentes: Parisienne y Montserrat, licencia OFL).

## Tiempo estimado del sorteo (100 llaveros)
Cada hoja de 50: ~9,5 m de corte (×2 pasadas) + relleno de textos. **Estimación: 2–3 h por hoja** con 22 W → **un día de máquina** para las dos. Haz primero **una hoja de prueba de 5 llaveros** para ajustar potencia y velocidad. Madera: 2 hojas de plywood de 400 × 400 mm × 3 mm (más 20 % de repuesto).
**Control de calidad:** revisa que cada llavero tenga su número bien grabado (#001–#100) y guárdalos en orden: el #001 es del primer comentario.

## Costos a confirmar por ti
Madera, cinta, argollas (100), bolsitas/empaque, transportadora (envío gratis ×100) y tu tiempo. Con eso define si el sorteo es viable antes de publicar.
