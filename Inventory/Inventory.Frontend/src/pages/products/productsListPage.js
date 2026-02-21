import { getProducts, deleteProduct  } from "../../api/productApi"
import { getCategories } from "../../api/categoriesApi";



/**
 * Render: vetëm HTML.
 * Krijojmë elemente me id që t’i kapim me querySelector në init().
 */
export function renderProductsListPage() {
  return `
    <div class="bg-white border rounded-xl p-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-xl font-semibold">Products</h2>
          <p id="productsStatus" class="mt-1 text-sm text-gray-600">Loading...</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          
        <a href = "#/products/new" class = "px-3 py-2 text-sm rounded-lg bg-black text-white"> New </a>


          <!-- Search -->
          <input id="searchInput"
            class="text-sm border rounded-lg px-3 py-2 bg-white w-64"
            placeholder="Search products..."
            type="text" />

          <!-- Category filter -->
          <select id="categorySelect"
            class="text-sm border rounded-lg px-3 py-2 bg-white">
            <option value="">All categories</option>
          </select>

          <!-- Page size -->
          <select id="pageSizeSelect"
            class="text-sm border rounded-lg px-3 py-2 bg-white">
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
          </select>
        </div>
      </div>

      <div class="mt-4 overflow-auto border rounded-lg">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left">
            <tr class="border-b">
              <th class="p-3">Name</th>
              <th class="p-3">Price</th>
              <th class="p-3">Category</th>
              <th class="p-3">Stock</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody id="productsTbody"></tbody>
        </table>
      </div>

      <!-- Pagination controls -->
      <div class="mt-4 flex items-center justify-between gap-3">
        <button id="btnPrev"
          class="px-3 py-2 text-sm border rounded-lg bg-white disabled:opacity-50">
          Prev
        </button>

        <div id="pageInfo" class="text-sm text-gray-600">
          Page 1 of 1
        </div>

        <button id="btnNext"
          class="px-3 py-2 text-sm border rounded-lg bg-white disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  `;
}

/**
 * Init: logjika.
 * Këtu:
 * - e mbushim categories dropdown
 * - lexojmë inputet
 * - mbajmë state (page, pageSize, search, categoryId)
 * - therrasim getProducts sa here qe ndryshon state
 */
export async function initProductsListPage() {
  // DOM refs
  const status = document.querySelector("#productsStatus");
  const tbody = document.querySelector("#productsTbody");
  const searchInput = document.querySelector("#searchInput");
  const categorySelect = document.querySelector("#categorySelect");
  const pageSizeSelect = document.querySelector("#pageSizeSelect");
  const btnPrev = document.querySelector("#btnPrev");
  const btnNext = document.querySelector("#btnNext");
  const pageInfo = document.querySelector("#pageInfo");

  if (
    !status ||
    !tbody ||
    !searchInput ||
    !categorySelect ||
    !pageSizeSelect ||
    !btnPrev ||
    !btnNext ||
    !pageInfo
  ) {
    return;
  }

  // State minimal i faqes
  const state = {
    page: 1,
    pageSize: 10,
    search: "",
    categoryId: "",
    totalCount: 0,
    totalPages: 1,
  };

  // 1) Load categories (dropdown)
  await loadCategories(categorySelect);

  // 2) Load products initial
  await loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state });

  // 3) Events

  // Search: perdorim debounce qe te mos bejme fetch per çdo shkronje menjëherë
  searchInput.addEventListener(
    "input",
    debounce(async () => {
      state.search = searchInput.value.trim();
      state.page = 1; // kur kërkon, kthehu në faqen e parë
      await loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state });
    }, 400)
  );

  // Category change
  categorySelect.addEventListener("change", async () => {
    state.categoryId = categorySelect.value;
    state.page = 1;
    await loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state });
  });

  // Page size change
  pageSizeSelect.addEventListener("change", async () => {
    state.pageSize = parseInt(pageSizeSelect.value, 10);
    state.page = 1;
    await loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state });
  });

  // Prev / Next
  btnPrev.addEventListener("click", async () => {
    if (state.page > 1) {
      state.page -= 1;
      await loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state });
    }
  });

  btnNext.addEventListener("click", async () => {
    if (state.page < state.totalPages) {
      state.page += 1;
      await loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state });
    }

    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-delete-id]");
      if(!btn) return;

      const id = btn.getAttribute("data-delete-id");
      if(!id) return;

      const ok = confirm("Are you sure you want to delete this product?");
      if(!ok) return;

      try {
        status.textContent = "Deleting...";
        await deleteProduct(id);

        if(state.page > 1 && state.totalCount % state.pageSize === 1) {
          state.page -= 1;
        }
        
        await loadProducts({status, tbody, pageInfo, btnPrev, btnNext, state});
      } catch(err) {
        status.textContent = `ERROR: ${err.message}`;
      }
    })
  });
}

/* =========================
   Data loaders
========================= */

async function loadCategories(selectEl) {
  try {
    const categories = await getCategories();
    const items = Array.isArray(categories)
      ? categories
      : categories.items || categories.data || [];

    for (const c of items) {
      const id = c.id ?? c.categoryId ?? "";
      const name = c.name ?? c.categoryName ?? "Unnamed";

      const opt = document.createElement("option");
      opt.value = String(id);
      opt.textContent = name;
      selectEl.appendChild(opt);
    }
  } catch (e) {
    console.warn("Failed to load categories:", e.message);
  }
}

async function loadProducts({ status, tbody, pageInfo, btnPrev, btnNext, state }) {
  status.textContent = "Loading...";
  tbody.innerHTML = "";

  try {
    const result = await getProducts({
      page: state.page,
      pageSize: state.pageSize,
      search: state.search,
      categoryId: state.categoryId,
    });

    // Këtu normalizojmë response-in (mund të jetë items/totalCount ose data/totalItems)
    const items = result.items || result.data || [];
    const totalCount =
      result.totalCount ??
      result.totalItems ??
      result.count ??
      items.length;

    // Llogarisim totalPages
    const totalPages = Math.max(1, Math.ceil(totalCount / state.pageSize));

    // Update state
    state.totalCount = totalCount;
    state.totalPages = totalPages;

    // Update UI (status + page info + buttons)
    status.textContent = `Showing ${items.length} of ${totalCount} products`;
    pageInfo.textContent = `Page ${state.page} of ${state.totalPages}`;

    btnPrev.disabled = state.page <= 1;
    btnNext.disabled = state.page >= state.totalPages;

    // Render rows
    tbody.innerHTML = items
      .map((p) => {
        const id = p.id ?? p.productId ?? ""; 
        const name = p.name ?? "";
        const price = p.price ?? "";
        const category =
          p.categoryName ??
          p.category?.name ??
          (p.categoryId ?? "");
        const stock = p.stockQuantity ?? 0;

        return `
          <tr class="border-b hover:bg-gray-50">
            <td class="p-3">${escapeHtml(String(name))}</td>
            <td class="p-3">${escapeHtml(String(price))}</td>
            <td class="p-3">${escapeHtml(String(category))}</td>
            <td class="p-3">${stock}</td>
            <td class="p-3"> 
              <a href="#/products/edit?id=${id}" class = "underline mr-3"> Edit </a>
              <button data-delete-id="${id}" class = "text-red-600 underline hover:no-underline"> Delete </button>
          </tr>
        `;
      })
      .join("");
  } catch (e) {
    status.textContent = `ERROR: ${e.message}`;
    pageInfo.textContent = `Page ${state.page} of ${state.totalPages}`;
    btnPrev.disabled = true;
    btnNext.disabled = true;
  }
}

/* =========================
   Utils
========================= */

// Debounce: pret pak ms para se të ekzekutojë funksionin.
// Kjo shmang shumë request-e kur user shkruan shpejt.
function debounce(fn, delayMs) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), delayMs);
  };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
