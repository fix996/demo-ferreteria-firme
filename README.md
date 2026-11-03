# Firme Ferretería — demo de catálogo y carrito

Sitio independiente con marca, artículos, imágenes y precios **ficticios**. El visitante busca productos, ajusta cantidades en el carrito y prepara un mensaje para WhatsApp. Abrir WhatsApp no envía el mensaje: la persona debe elegir enviarlo. No hay stock, pagos ni pedidos confirmados.

Al agregar un artículo, el botón confirma brevemente la acción y luego muestra cuántas unidades hay en el carrito. El encabezado queda visible al desplazarse para que el acceso al carrito esté siempre a mano.

## Abrir y comprobar

Desde esta carpeta: `python -m http.server 8766 --directory dist`. Visitar `http://localhost:8766/`.

Comprobación: `node --check dist/products.js; node --check dist/app.js; node scripts/check.mjs`.

## Cómo identificar el retiro

El carrito pide solo el nombre para retirar. El negocio confirma disponibilidad, precio y horario respondiendo en el mismo chat de WhatsApp y asigna un código corto de retiro. Quien retira dice el código; el local lo compara con su propio chat y marca el pedido como entregado. Si va otra persona, se acuerda en el chat. No se solicita DNI en esta demo. Sin confirmación del negocio, el mensaje inicial no reserva productos.

## Configurar un negocio real

En `dist/products.js`, completar `store.whatsappNumber` con el número de WhatsApp del negocio en formato internacional, sin `+`, espacios ni guiones. Mientras esté vacío, WhatsApp abre un mensaje prellenado y permite elegir el contacto; así la demo no apunta a un número inventado.

Antes de usarlo comercialmente, reemplazar marca, catálogo, SKU o presentación de cada artículo, precios, imágenes, horarios y condiciones con datos aprobados. Quitar la etiqueta DEMO del mensaje solo al conectar un comercio real. Los precios y el stock deben volver a confirmarse con el negocio antes de preparar el pedido.

## Archivos

- `dist/products.js`: categorías, productos, precios ilustrativos y configuración de WhatsApp.
- `dist/app.js`: búsqueda, fichas, carrito y armado del mensaje.
- `dist/index.html` y `dist/styles.css`: página y diseño.
- `dist/assets/`: fotografías locales ilustrativas.

El carrito y el nombre viven solo en la memoria de la pestaña y se pierden al recargar. No hay backend ni almacenamiento de datos personales.
