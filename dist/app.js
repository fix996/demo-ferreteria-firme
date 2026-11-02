const categoryById = new Map(categories.map(category => [category.id, category]));
const productById = new Map(products.map(product => [product.id, product]));
const selection = new Map();
const state = { category: "todos", query: "", sort: "featured" };

const categoryGrid = document.querySelector("#category-grid");
const filterRow = document.querySelector("#filter-row");
const productGrid = document.querySelector("#product-grid");
const resultCount = document.querySelector("#result-count");
const searchInput = document.querySelector("#product-search");
const sortInput = document.querySelector("#product-sort");
const clearFilters = document.querySelector("#clear-filters");
const listCount = document.querySelector("#list-count");
const productDialog = document.querySelector("#product-dialog");
const productDialogContent = document.querySelector("#product-dialog-content");
const listDialog = document.querySelector("#list-dialog");
const listDialogContent = document.querySelector("#list-dialog-content");
let productOpener = null;
let listOpener = null;

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function renderCategories() {
  categoryGrid.innerHTML = categories.map(category => `
    <button type="button" class="category-card" data-category="${category.id}" aria-label="Ver ${category.name}">
      <span class="category-top"><span>${category.number} / 06</span><span aria-hidden="true">↗</span></span>
      <span class="category-bottom"><strong>${category.name}</strong><small>${category.detail}</small></span>
    </button>`).join("");

  filterRow.innerHTML = [
    `<button type="button" class="filter-chip is-active" data-category="todos" aria-pressed="true">Todos</button>`,
    ...categories.map(category => `<button type="button" class="filter-chip" data-category="${category.id}" aria-pressed="false">${category.name}</button>`)
  ].join("");
}

function matchingProducts() {
  const query = normalize(state.query);
  const matches = products.filter(product => {
    const category = categoryById.get(product.category);
    const inCategory = state.category === "todos" || product.category === state.category;
    const inSearch = !query || normalize(`${product.name} ${product.description} ${category.name}`).includes(query);
    return inCategory && inSearch;
  });
  if (state.sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (state.sort === "category") matches.sort((a, b) => categoryById.get(a.category).name.localeCompare(categoryById.get(b.category).name, "es") || a.name.localeCompare(b.name, "es"));
  return matches;
}

function renderProducts() {
  const matches = matchingProducts();
  resultCount.textContent = `${matches.length} ${matches.length === 1 ? "artículo" : "artículos"} de ejemplo`;
  clearFilters.hidden = state.category === "todos" && !state.query && state.sort === "featured";
  filterRow.querySelectorAll("[data-category]").forEach(button => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (!matches.length) {
    productGrid.innerHTML = `<div class="empty-state"><strong>No encontramos artículos con esa búsqueda.</strong><p>Probá otra palabra o elegí una categoría distinta.</p><button type="button" data-reset>Ver todo el catálogo <span aria-hidden="true">↗</span></button></div>`;
    return;
  }

  productGrid.innerHTML = matches.map(product => `
    <article class="product-card">
      <button type="button" class="product-photo" data-view="${product.id}" aria-label="Ver detalle de ${product.name}">
        <img src="${product.image}" alt="${product.name} ilustrativo" width="1536" height="1024" loading="lazy">
        <span>VER DETALLE <span aria-hidden="true">↗</span></span>
      </button>
      <div class="product-content"><div class="product-meta"><span>${categoryById.get(product.category).name}</span><span>${product.id}</span></div>
        <h3>${product.name}</h3><p>${product.description}</p>
        <div class="product-bottom"><span>Precio a consultar</span><button type="button" class="add-button" data-add="${product.id}" aria-label="Agregar ${product.name} a la lista">Sumar a mi lista <span aria-hidden="true">＋</span></button></div>
      </div>
    </article>`).join("");
}

function setCategory(category) {
  if (category !== "todos" && !categoryById.has(category)) return;
  state.category = category;
  renderProducts();
}

function addProduct(id) {
  if (!productById.has(id)) return;
  selection.set(id, (selection.get(id) || 0) + 1);
  const count = [...selection.values()].reduce((total, quantity) => total + quantity, 0);
  listCount.textContent = String(count);
  document.querySelector("#action-status").textContent = `${productById.get(id).name} agregado a tu lista. ${count} ${count === 1 ? "artículo" : "artículos"} en total.`;
  if (listDialog.open) {
    renderList();
    listDialogContent.querySelector(`[data-increase="${id}"]`)?.focus();
  }
}

function openProduct(id, opener) {
  const product = productById.get(id);
  if (!product) return;
  productOpener = opener;
  productDialogContent.innerHTML = `
    <div class="detail-photo"><img src="${product.image}" alt="${product.name} ilustrativo" width="1536" height="1024"></div>
    <div class="detail-content"><p class="eyebrow">${categoryById.get(product.category).name} / ${product.id}</p><h2 id="product-dialog-title">${product.name}</h2>
      <p class="detail-description">${product.description}</p><strong>Precio a consultar</strong>
      <ul>${product.details.map(detail => `<li>${detail}</li>`).join("")}</ul>
      <p class="detail-note">Ficha ilustrativa. Confirmar modelo, precio y disponibilidad con la ferretería.</p>
      <button type="button" class="button button-dark" data-add="${product.id}">Sumar a mi lista <span aria-hidden="true">＋</span></button>
      <p class="detail-feedback" role="status" aria-live="polite"></p>
    </div>`;
  productDialog.showModal();
  productDialog.querySelector(".dialog-close").focus();
}

function listText() {
  return ["Consulta de ferretería (demo)", ...[...selection].map(([id, quantity]) => `${quantity} × ${productById.get(id).name} (${id})`), "Precios y disponibilidad a confirmar."].join("\n");
}

function renderList() {
  if (!selection.size) {
    listDialogContent.innerHTML = `<div class="list-empty"><span aria-hidden="true">▤</span><h3>Tu lista está vacía.</h3><p>Explorá el catálogo y sumá los artículos por los que quieras consultar.</p><button type="button" class="button button-dark" data-go-catalog>Ir al catálogo <span aria-hidden="true">↗</span></button></div>`;
    return;
  }
  listDialogContent.innerHTML = `
    <ul class="selection-items">${[...selection].map(([id, quantity]) => {
      const product = productById.get(id);
      return `<li><img src="${product.image}" alt="" width="92" height="92"><div><strong>${product.name}</strong><span>${id} · Precio a consultar</span></div><div class="quantity"><button type="button" data-decrease="${id}" aria-label="Quitar una unidad de ${product.name}">−</button><span aria-label="${quantity} ${quantity === 1 ? "unidad" : "unidades"}">${quantity}</span><button type="button" data-increase="${id}" aria-label="Agregar una unidad de ${product.name}">+</button></div></li>`;
    }).join("")}</ul>
    <label class="copy-label" for="list-summary">Resumen para copiar</label><textarea id="list-summary" readonly rows="${Math.max(4, selection.size + 2)}"></textarea>
    <p class="list-note">La demo no envía esta lista ni contacta a ninguna persona.</p>
    <div class="list-actions"><button type="button" class="button button-dark" data-copy>Copiar resumen</button><button type="button" class="clear-list" data-clear-list>Vaciar lista</button></div>
    <p class="copy-feedback" role="status" aria-live="polite"></p>`;
  listDialogContent.querySelector("#list-summary").value = listText();
}

function openList(opener) {
  listOpener = opener;
  renderList();
  listDialog.showModal();
  listDialog.querySelector(".dialog-close").focus();
}

renderCategories();
renderProducts();

const liveStatus = document.createElement("p");
liveStatus.id = "action-status";
liveStatus.className = "sr-only";
liveStatus.setAttribute("role", "status");
liveStatus.setAttribute("aria-live", "polite");
document.body.append(liveStatus);

categoryGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  setCategory(button.dataset.category);
  document.querySelector("#catalogo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});
filterRow.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});
searchInput.addEventListener("input", () => { state.query = searchInput.value; renderProducts(); });
sortInput.addEventListener("change", () => { state.sort = sortInput.value; renderProducts(); });
clearFilters.addEventListener("click", resetFilters);

function resetFilters() {
  state.category = "todos";
  state.query = "";
  state.sort = "featured";
  searchInput.value = "";
  sortInput.value = "featured";
  renderProducts();
  searchInput.focus();
}

productGrid.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const view = event.target.closest("[data-view]");
  if (add) addProduct(add.dataset.add);
  if (view) openProduct(view.dataset.view, view);
  if (event.target.closest("[data-reset]")) resetFilters();
});
document.querySelectorAll("[data-open-list]").forEach(button => button.addEventListener("click", () => openList(button)));
productDialog.addEventListener("click", event => {
  if (event.target.closest("[data-close-dialog]") || event.target === productDialog) productDialog.close();
  const add = event.target.closest("[data-add]");
  if (add) {
    addProduct(add.dataset.add);
    productDialog.querySelector(".detail-feedback").textContent = "Agregado a tu lista de consulta.";
  }
});
productDialog.addEventListener("close", () => productOpener?.focus());
listDialog.addEventListener("click", async event => {
  if (event.target.closest("[data-go-catalog]")) {
    listDialog.close();
    document.querySelector("#catalogo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    return;
  }
  if (event.target.closest("[data-close-dialog]") || event.target === listDialog) { listDialog.close(); return; }
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  if (increase) { addProduct(increase.dataset.increase); return; }
  if (decrease) {
    const id = decrease.dataset.decrease;
    const next = (selection.get(id) || 0) - 1;
    if (next > 0) selection.set(id, next); else selection.delete(id);
    listCount.textContent = String([...selection.values()].reduce((total, quantity) => total + quantity, 0));
    renderList();
    (listDialogContent.querySelector(`[data-decrease="${id}"]`) || listDialog.querySelector(".dialog-close")).focus();
    return;
  }
  if (event.target.closest("[data-clear-list]")) { selection.clear(); listCount.textContent = "0"; renderList(); return; }
  if (event.target.closest("[data-copy]")) {
    const summary = listDialogContent.querySelector("#list-summary");
    const feedback = listDialogContent.querySelector(".copy-feedback");
    try { await navigator.clipboard.writeText(summary.value); feedback.textContent = "Lista copiada. No se envió a nadie."; }
    catch { summary.focus(); summary.select(); feedback.textContent = "No se pudo copiar automáticamente. Seleccioná el texto y copialo."; }
  }
});
listDialog.addEventListener("close", () => listOpener?.focus());
