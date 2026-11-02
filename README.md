# Firme Ferretería — demo de catálogo online

Sitio independiente para mostrar cómo podría funcionar el catálogo de una ferretería. **Firme es una marca ficticia**. El contenido no representa productos, precios ni stock de un comercio real.

## Abrir localmente

```powershell
python -m http.server 8766 --directory dist
```

Visitar `http://localhost:8766/`.

## Recorrido

- Seis categorías: herramientas, fijaciones, electricidad, plomería, pintura y seguridad.
- Doce artículos ilustrativos con fotografía, ficha y búsqueda por nombre o categoría.
- Filtros y ordenamiento.
- Lista de consulta con cantidades y resumen copiable.

La lista existe solo en la memoria de la pestaña. No se envía a nadie y se pierde al recargar. No hay cuentas, pagos, inventario, precios, mensajes ni backend. Los botones de consulta no conectan con WhatsApp ni con un negocio.

## Archivos

- `dist/index.html`: página y estructura semántica.
- `dist/styles.css`: diseño y adaptación móvil.
- `dist/products.js`: categorías y artículos de ejemplo.
- `dist/app.js`: filtros, búsqueda, fichas y lista.
- `dist/assets/`: fotografías locales generadas para esta demo.

Las imágenes se crearon con la herramienta integrada a partir de prompts de fotografía de producto para herramientas, fijaciones, instalaciones, pintura y seguridad, sin personas, marcas ni texto. La foto del local y tres fotos de producto se reutilizaron de la muestra comercial anterior, también generada para este espacio de trabajo. Se convirtieron a JPEG para reducir su peso.

## Comprobaciones

```powershell
node --check dist/products.js
node --check dist/app.js
node scripts/check.mjs
```

Antes de adaptar esta demo a una ferretería concreta, reemplazar marca, imágenes, artículos y condiciones por contenido aprobado y definir el canal real para recibir consultas.
