const categoryById = new Map(categories.map(category => [category.id, category]));
const productById = new Map(products.map(product => [product.id, product]));
const selection = new Map();
const state = { category: "todos", query: "", sort: "featured" };
let customerName = "";

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

function money(amount) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
}

function cartTotal() {
  return [...selection].reduce((total, [id, quantity]) => total + productById.get(id).price * quantity, 0);
}

function orderText() {
  return [
    "PEDIDO DE EJEMPLO · Firme Ferretería",
    `Nombre para retirar: ${customerName.trim()}`,
    "",
    ...[...selection].map(([id, quantity]) => {
      const product = productById.get(id);
      return `${quantity} × ${product.name} (${id}) — ${money(quantity * product.price)}`;
    }),
    "",
    `Total ilustrativo: ${money(cartTotal())}`,
    "¿Me confirman stock, precio final, horario y un código de retiro?",
    "DEMO: no procesar este pedido."
  ].join("\n");
}

function whatsappUrl() {
  const number = /^\d{8,15}$/.test(store.whatsappNumber) ? store.whatsappNumber : "";
  return `https://wa.me/${number}?text=${encodeURIComponent(orderText())}`;
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
  if (state.sort === "price-asc") matches.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") matches.sort((a, b) => b.price - a.price);
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
        <div class="product-bottom"><span><small>PRECIO DE EJEMPLO</small>${money(product.price)}</span><button type="button" class="add-button" data-add="${product.id}" aria-label="Agregar ${product.name} al carrito">Agregar al carrito <span aria-hidden="true">＋</span></button></div>
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
  document.querySelector("#action-status").textContent = `${productById.get(id).name} agregado al carrito. ${count} ${count === 1 ? "artículo" : "artículos"} en total.`;
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
      <p class="detail-description">${product.description}</p><strong>Precio de ejemplo: ${money(product.price)}</strong>
      <ul>${product.details.map(detail => `<li>${detail}</li>`).join("")}</ul>
      <p class="detail-note">Ficha y precio ilustrativos. El negocio debe confirmar modelo, precio y disponibilidad.</p>
      <button type="button" class="button button-dark" data-add="${product.id}">Agregar al carrito <span aria-hidden="true">＋</span></button>
      <p class="detail-feedback" role="status" aria-live="polite"></p>
    </div>`;
  productDialog.showModal();
  productDialog.querySelector(".dialog-close").focus();
}

function renderList() {
  if (!selection.size) {
    listDialogContent.innerHTML = `<div class="list-empty"><span aria-hidden="true">▤</span><h3>Tu carrito está vacío.</h3><p>Explorá el catálogo y agregá los artículos que necesitás.</p><button type="button" class="button button-dark" data-go-catalog>Ir al catálogo <span aria-hidden="true">↗</span></button></div>`;
    return;
  }
  listDialogContent.innerHTML = `
    <ul class="selection-items">${[...selection].map(([id, quantity]) => {
      const product = productById.get(id);
      return `<li><img src="${product.image}" alt="" width="92" height="92"><div><strong>${product.name}</strong><span>${id} · ${money(product.price)} c/u · ${money(product.price * quantity)}</span></div><div class="quantity"><button type="button" data-decrease="${id}" aria-label="Quitar una unidad de ${product.name}">−</button><span aria-label="${quantity} ${quantity === 1 ? "unidad" : "unidades"}">${quantity}</span><button type="button" data-increase="${id}" aria-label="Agregar una unidad de ${product.name}">+</button></div></li>`;
    }).join("")}</ul>
    <p class="cart-total"><span>Total ilustrativo</span><strong>${money(cartTotal())}</strong></p>
    <label class="copy-label" for="customer-name">Nombre para retirar</label><input id="customer-name" type="text" minlength="2" maxlength="60" required placeholder="Ej.: Lautaro" autocomplete="name">
    <p class="list-note">Cuando el negocio confirme, te dará un código de retiro por WhatsApp. Decí ese código al retirar; el local lo compara con su chat. Si va otra persona, avisá por el mismo chat. No hace falta DNI.</p>
    <label class="copy-label" for="list-summary">Mensaje preparado</label><textarea id="list-summary" readonly rows="${Math.max(7, selection.size + 6)}"></textarea>
    <p class="list-note">${store.whatsappNumber ? "Se abrirá el WhatsApp del negocio." : "En esta demo WhatsApp te dejará elegir un contacto. Al adaptar la web se configura el número del negocio."} Abrir WhatsApp no envía el mensaje automáticamente.</p>
    <div class="list-actions"><a class="button button-dark" id="send-whatsapp" href="#" target="_blank" rel="noopener noreferrer">Abrir pedido en WhatsApp ↗</a><button type="button" class="clear-list" data-clear-list>Vaciar carrito</button></div>
    <p class="copy-feedback" role="status" aria-live="polite"></p>`;
  listDialogContent.querySelector("#customer-name").value = customerName;
  listDialogContent.querySelector("#list-summary").value = orderText();
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
    productDialog.querySelector(".detail-feedback").textContent = "Agregado al carrito.";
  }
});
productDialog.addEventListener("close", () => productOpener?.focus());
listDialog.addEventListener("input", event => {
  if (event.target.id !== "customer-name") return;
  customerName = event.target.value;
  event.target.setCustomValidity("");
  listDialogContent.querySelector("#list-summary").value = orderText();
});
listDialog.addEventListener("click", event => {
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
  if (event.target.closest("[data-clear-list]")) { selection.clear(); customerName = ""; listCount.textContent = "0"; renderList(); return; }
  const send = event.target.closest("#send-whatsapp");
  if (send) {
    const nameInput = listDialogContent.querySelector("#customer-name");
    if (customerName.trim().length < 2) {
      event.preventDefault();
      nameInput.setCustomValidity("Escribí un nombre para identificar el pedido.");
      nameInput.reportValidity();
      nameInput.focus();
      return;
    }
    send.href = whatsappUrl();
    listDialogContent.querySelector(".copy-feedback").textContent = "WhatsApp se abrirá con el mensaje preparado; todavía tenés que elegir enviarlo.";
  }
});
listDialog.addEventListener("close", () => listOpener?.focus());
