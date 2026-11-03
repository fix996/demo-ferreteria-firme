import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = fileURLToPath(new URL("../", import.meta.url));
const data = readFileSync(join(root, "dist/products.js"), "utf8");
const { categories, products, store } = runInNewContext(`${data}\n({ categories, products, store })`);
const failures = [];
const ids = new Set();
const categoryIds = new Set(categories.map(category => category.id));

if (categories.length !== 6) failures.push("Se esperaban seis categorías.");
if (products.length !== 12) failures.push("Se esperaban doce artículos de ejemplo.");
for (const category of categories) {
  if (!products.some(product => product.category === category.id)) failures.push(`Categoría vacía: ${category.id}`);
}
for (const product of products) {
  if (ids.has(product.id)) failures.push(`Código duplicado: ${product.id}`);
  ids.add(product.id);
  if (!categoryIds.has(product.category)) failures.push(`Categoría inexistente: ${product.category}`);
  if (!product.name || !product.description || !product.details?.length) failures.push(`Ficha incompleta: ${product.id}`);
  if (!Number.isInteger(product.price) || product.price <= 0) failures.push(`Precio inválido: ${product.id}`);
  const path = join(root, "dist", product.image);
  if (!existsSync(path) || statSync(path).size === 0) failures.push(`Imagen faltante: ${product.image}`);
}

const html = readFileSync(join(root, "dist/index.html"), "utf8");
const app = readFileSync(join(root, "dist/app.js"), "utf8");
if (store.whatsappNumber && !/^\d{8,15}$/.test(store.whatsappNumber)) failures.push("Número de WhatsApp inválido.");
if (!app.includes("https://wa.me/") || !app.includes("encodeURIComponent(orderText())")) failures.push("Falta pedido para WhatsApp.");
if (!app.includes("Nombre para retirar") || !app.includes("cartTotal()")) failures.push("Falta identificación o total del carrito.");
for (const asset of ["styles.css", "products.js", "app.js", "assets/local.jpg"]) {
  if (!html.includes(asset) || !existsSync(join(root, "dist", asset))) failures.push(`Recurso principal faltante: ${asset}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("OK: 6 categorías, 12 precios, carrito, WhatsApp e imágenes.");
}
