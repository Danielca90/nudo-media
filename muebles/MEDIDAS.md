# Muebles: medidas y modelos de referencia

Medidas tomadas por Daniel (6 nov 2026). Los modelos se generan con `generar_muebles.py` (paramétrico) y se ven en `visor.html`.
Unidades: cm en este documento, mm en los archivos 3D. Tablero base: 18 mm. Traseras: 6 mm.

| Archivo | Qué es |
|---|---|
| `modelos/*.3dm` | Rhino (formato v6), una capa por tipo de pieza, cada pieza con nombre. El frente mira a la vista Front |
| `modelos/*.glb` | Mismo modelo para visores 3D |
| `renders/*_cerrado.png` y `*_interior.png` | Vistas con cotas |
| `visor.html` | Visor 3D interactivo: girar, ocultar puertas, ver espacio y cotas |
| `generar_muebles.py` | Cambia `PARAMS` y corre `python3 generar_muebles.py && python3 construir_visor.py` |

---

## 1. Alacena de cocina
**Espacio medido:** 49 cm de muro a muro × 20 cm de fondo × 200 cm de alto.
**Pedido:** unos 50 cm de alto (no ocupar todo el alto), 4 entrepaños, 2 puertas.

**Modelo:**
- **Medidas:** 48 × 20 × 50 cm, con 0.5 cm de holgura por lado. El fondo de 20 cm ya incluye las puertas.
- **Altura:** colgada con la base a 140 cm del piso. Es un parámetro y se puede cambiar.
- **Interior:** 3 entrepaños interiores más la base, lo que da **4 niveles de 10.2 cm de alto libre**.
- **Puertas:** 2 de 23.6 × 49.4 cm, sobrepuestas.

**Por confirmar:**
- Con 50 cm de alto y 4 entrepaños, cada nivel queda de unos 10 cm. Sirve para especias, salsas y latas pequeñas, pero no para frascos altos. ¿Son 4 entrepaños interiores (quedarían unos 8 cm por nivel) o 4 niveles en total, como está modelado?
- ¿A qué altura va colgada?

**Despiece:**
| Pieza | Cant | Largo | Ancho | Esp. |
|---|---|---|---|---|
| Lateral | 2 | 50.0 | 18.2 | 1.8 |
| Base / Techo | 2 | 44.4 | 18.2 | 1.8 |
| Entrepaño | 3 | 44.4 | 16.6 | 1.8 |
| Puerta | 2 | 49.4 | 23.6 | 1.8 |
| Trasera | 1 | 46.4 | 44.4 | 0.6 |

**Herrajes:** 4 bisagras (2 por puerta), 2 manijas o push, 2 colgadores de alacena.

---

## 2. Cómoda del cuarto
**Espacio medido:**
- Ancho de trabajo: 120 cm (pero sin ocuparlo todo).
- De la pared a la cama: 50 cm libres (hay que darle menos).
- Alto: 140 cm desde el piso hasta antes de la puerta.

**Modelo:**
- **Medidas:** 100 × 32 × 120 cm. Quedan 10 cm libres por lado, 18 cm de paso hasta la cama y 20 cm por debajo del límite de 140 cm.
- **Cajones:** 5, con frentes de 22 cm de alto y cajas de 25 cm de profundidad.
- **Base:** zócalo retranqueado de 8 cm.

**Por confirmar:**
- ⚠️ **Los cajones necesitan unos 25 cm para abrirse y entre la cómoda y la cama solo quedan 18 cm.** Los cajones que quedan por encima del colchón (los 2 o 3 de arriba) se abren por encima de la cama. Los de abajo chocarían con la cama o abrirían solo a medias.
  - Opciones: cómoda más alta y angosta con los cajones altos, cajones menos profundos (20 cm), o puertas abatibles abajo.
- ¿Ancho final? Se modeló en 100 cm.

**Despiece:**
| Pieza | Cant | Largo | Ancho | Esp. |
|---|---|---|---|---|
| Lateral | 2 | 120.0 | 30.2 | 1.8 |
| Base / Techo | 2 | 96.4 | 30.2 | 1.8 |
| Zócalo | 1 | 96.4 | 8.0 | 1.8 |
| Frente de cajón | 5 | 99.4 | 22.0 | 1.8 |
| Cajón: trasera y contrafrente | 10 | 90.8 | 17.0 | 1.5 |
| Cajón: lateral | 10 | 25.0 | 17.0 | 1.5 |
| Cajón: fondo | 5 | 90.8 | 22.0 | 0.6 |
| Trasera | 1 | 108.4 | 96.4 | 0.6 |

**Herrajes:** 5 pares de correderas de 25 cm, 5 manijas, niveladores.

---

## 3. Clóset del cuarto principal
**Espacio medido:**
- Ancho: 150 cm aproximadamente.
- Fondo: 30 a 40 cm.
- Alto: unos 200 cm (lo que da el techo sin contar el zócalo).

**Pedido:**
- Dos módulos no muy anchos, contra la pared y **volados del piso**.
- En un lado, una barra para colgar ropa. Abajo, un espacio para ropa con un entrepaño y un cajoncito.

**Modelo:**
- **Medidas generales:** 2 módulos de 72 cm, que suman **144 × 40 × 180 cm**. Quedan colgados a **20 cm del piso**, con el borde superior a 200 cm, y 3 cm libres por lado.
- **Módulo A (colgar), de abajo hacia arriba:**
  - cajoncito con frente de 20 cm,
  - entrepaño,
  - espacio abierto de 30 cm para ropa doblada,
  - entrepaño,
  - **99.6 cm libres para colgar**, con la barra a **175 cm del piso**,
  - maletero arriba.
- **Módulo B:** 5 entrepaños, con niveles de 27.9 cm.

**Por confirmar:**
- ⚠️ **Fondo de 40 cm:** un gancho normal mide 43 a 45 cm de ancho, así que la ropa colgada **sobresale unos 5 cm** del mueble. Abierto se puede usar, pero no le cabrían puertas. Si se quieren puertas, hay dos caminos: subir el fondo a 55–60 cm, o usar una **barra extraíble perpendicular** (los ganchos quedan de frente).
- ¿El módulo B lleva entrepaños? Fue una suposición mía.
- ¿Barra a 175 cm o más baja? Depende de la estatura de quien lo use.
- Al ir volado, cada módulo pesa bastante. Va con **riel francés (colgador en cuña) o herrajes de colgar a la pared**, anclados con chazos a muro macizo.

**Despiece (los dos módulos):**
| Pieza | Cant | Largo | Ancho | Esp. |
|---|---|---|---|---|
| Lateral | 4 | 180.0 | 40.0 | 1.8 |
| Base / Techo | 4 | 68.4 | 40.0 | 1.8 |
| Entrepaño módulo A (sobre cajón, ropa, maletero) | 3 | 68.4 | 39.4 | 1.8 |
| Entrepaño módulo B | 5 | 68.4 | 38.4 | 1.8 |
| Frente de cajón | 1 | 67.8 | 19.4 | 1.8 |
| Cajón: trasera | 1 | 62.8 | 15.0 | 1.5 |
| Cajón: lateral | 2 | 35.0 | 15.0 | 1.5 |
| Cajón: fondo | 1 | 62.8 | 33.5 | 0.6 |
| Trasera | 2 | 176.4 | 68.4 | 0.6 |

**Herrajes:** 1 barra de 68 cm con 2 soportes, 1 par de correderas de 35 cm, 1 manija, riel francés o colgadores para los 2 módulos.

---

## Supuestos generales
- **Laterales:** van completos de arriba abajo; la base y el techo van entre ellos. Las traseras van embutidas.
- **Medidas del despiece:** son de corte limpio, sin canto. Si se enchapa el canto, hay que restar su espesor.
- **Los modelos son de referencia para diseñar.** Antes de cortar, hay que validar medidas en sitio: plomos, escuadras y zócalos.
