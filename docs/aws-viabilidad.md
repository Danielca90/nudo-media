# Viabilidad: mover el puente de medios a AWS

Estado: propuesta / evaluación. No cambia el flujo actual hasta que se decida.

## Flujo actual

1. Se sube el contenido de un post a una carpeta (`L3-5-NEODECO/slide-1.jpg`, `L3-7-BOCETO3/reel.mp4`, …).
2. Metricool toma los archivos desde la URL pública de GitHub y programa el post.
3. Un segundo commit ("programado: quitar medios") borra la carpeta.

### Problemas del flujo actual

- **Los archivos no se borran de verdad.** Un commit que borra solo los quita de la versión actual; siguen en el historial de git y cualquiera puede descargarlos desde un commit anterior si el repo es público. Con 32 commits, `.git` ya pesa unos 85 MB.
- **El repo crece sin límite.** Cada reel (~6 MB) y cada carrusel (~1.2 MB) se queda para siempre. GitHub avisa a partir de 1 GB y rechaza archivos de más de 100 MB (un reel largo podría pasarse).
- **Usar GitHub como CDN** para archivos binarios va contra el uso recomendado y `raw.githubusercontent.com` tiene límites de tasa.
- **Dos commits por post** solo para alojar archivos temporalmente.

## Propuesta: Amazon S3 con borrado automático

| Pieza | Configuración |
|---|---|
| Bucket | `nudo-media-puente` (privado, región `us-east-1`) |
| Estructura | `s3://nudo-media-puente/<POST-ID>/<archivo>` (igual que ahora) |
| Acceso para Metricool | URL prefirmada (*presigned URL*) con vencimiento de 24–72 h |
| Borrado | Regla de ciclo de vida: expira objetos a los **2 días** |
| Credenciales | Usuario IAM con permisos solo de `s3:PutObject` / `s3:GetObject` sobre ese bucket |

Flujo nuevo:

```bash
aws s3 cp slide-1.jpg s3://nudo-media-puente/L3-5-NEODECO/slide-1.jpg
aws s3 presign s3://nudo-media-puente/L3-5-NEODECO/slide-1.jpg --expires-in 86400
# → pegar la URL en Metricool; S3 borra el archivo solo a los 2 días
```

Ventajas: borrado real, no hace falta el commit de limpieza, repo limpio, sin límite de tamaño práctico, URLs que vencen y no quedan expuestas.

## Costo estimado

Volumen supuesto: ~40 posts/mes, con media de ~4 MB, guardados ≤ 2 días.

| Concepto | Precio S3 Standard (us-east-1) | Estimado mensual |
|---|---|---|
| Almacenamiento | ~US$0.023 / GB-mes | < US$0.01 (≈ 0.01 GB promedio) |
| Solicitudes PUT/GET | ~US$0.005 / 1000 PUT | < US$0.01 |
| Transferencia de salida | primeros 100 GB/mes gratis (en toda la cuenta AWS) | US$0 |
| **Total** | | **≈ US$0 – 0.05 / mes** |

Conclusión de costo: es prácticamente gratis. El costo real es tener que configurar la cuenta AWS (con tarjeta) y administrar credenciales.

## Riesgos y lo que hay que verificar

1. **Cuándo descarga Metricool el archivo.** El flujo actual borra justo después de programar, lo que indica que Metricool copia el archivo al programar. **Hay que confirmarlo** con un post de prueba; si lo descargara al publicar, el vencimiento de la URL y la regla de ciclo de vida tendrían que cubrir hasta la fecha de publicación.
2. **Vencimiento de las URLs prefirmadas:** máximo 7 días con credenciales de usuario IAM. Basta si Metricool copia al programar.
3. **Tipo de contenido.** Subir con `--content-type image/jpeg` / `video/mp4` para que Metricool reconozca el archivo.
4. **Credenciales.** La clave de AWS va en las variables de entorno de la sesión, nunca en el repo.
5. **Historial ya expuesto.** Migrar no borra lo que ya está en el historial de este repo. Si eso importa, hay que reescribir el historial (`git filter-repo`) o volver privado el repo / archivarlo.

## Alternativas consideradas

| Opción | Pros | Contras |
|---|---|---|
| **Seguir con GitHub** | Cero configuración | Historial crece, nada se borra de verdad |
| **AWS S3** (recomendada) | Borrado automático, URLs que vencen, casi gratis | Requiere cuenta AWS + IAM |
| **Cloudflare R2** | Salida de datos siempre gratis, 10 GB gratis, compatible con S3 | Otra cuenta más; sin presign en la CLI de `aws` sin configurar endpoint |
| **Google Drive** (ya conectado) | Ya existe el conector | Los enlaces de Drive no siempre son descargas directas; Metricool puede no aceptarlos |

## Recomendación

S3 es viable y prácticamente no cuesta nada. Su mayor ventaja no es el costo sino que **resuelve el borrado**, cosa que GitHub no puede hacer. Siguientes pasos propuestos:

1. Crear el bucket + regla de ciclo de vida + usuario IAM restringido.
2. Agregar `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` al entorno de la sesión.
3. Programar un post de prueba con una URL prefirmada y confirmar el punto 1 de riesgos.
4. Si funciona: dejar de subir medios a este repo y decidir qué hacer con el historial existente.
