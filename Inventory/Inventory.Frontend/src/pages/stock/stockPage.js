import { stockApi } from "../../api/stockApi";
import { getProducts } from "../../api/productApi";
import { stockTransactionApi } from "../../api/stockTransactionApi";




export function renderStockPage() {
  return `
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Stock</h1>
      <div class="flex gap-2">
        <a class="px-4 py-2 rounded bg-black text-white" href="#/stock/in">Stock In</a>
        <a class="px-4 py-2 rounded border" href="#/stock/out">Stock Out</a>
      </div>
    </div>

    <!-- CURRENT STOCK -->
    <div class="bg-white border rounded-xl p-4 mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold">Current Stock</h2>
        <button id="btnRefreshCurrent" class="px-3 py-2 border rounded">Refresh</button>
      </div>

      <div id="currentError" class="hidden mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700"></div>

      <div class="overflow-x-auto">
        <table class="w-full border">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left p-2 border">Product</th>
              <th class="text-left p-2 border">Qty On Hand</th>
            </tr>
          </thead>
          <tbody id="currentTbody"></tbody>
        </table>
      </div>

      <div id="currentEmpty" class="hidden mt-3 text-gray-600">No stock data.</div>
    </div>

    <!-- TRANSACTIONS -->
    <div class="bg-white border rounded-xl p-4">
      <div class="flex items-end justify-between gap-4 mb-3">
        <div>
          <h2 class="text-lg font-semibold">Transactions</h2>
          <p class="text-sm text-gray-600">History of stock changes (IN/OUT)</p>
        </div>

        <div class="flex gap-2 items-end">
          <div class="w-[320px]">
            <label class="block text-sm font-medium mb-1">Filter by product</label>
            <select id="productFilter" class="w-full border rounded px-3 py-2"></select>
          </div>
          <button id="btnClear" class="px-4 py-2 border rounded">Clear</button>
          <button id="btnRefreshTx" class="px-4 py-2 border rounded">Refresh</button>
        </div>
      </div>

      <div id="txError" class="hidden mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700"></div>

      <div class="overflow-x-auto">
        <table class="w-full border">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left p-2 border">Date</th>
              <th class="text-left p-2 border">Product</th>
              <th class="text-left p-2 border">Type</th>
              <th class="text-left p-2 border">Qty Change</th>
            </tr>
          </thead>
          <tbody id="txTbody"></tbody>
        </table>
      </div>

      <div id="txEmpty" class="hidden mt-3 text-gray-600">No transactions found.</div>
    </div>
  `;
}

export async function initStockPage() {
  // Current stock elements
  const currentTbody = document.querySelector("#currentTbody");
  const currentEmpty = document.querySelector("#currentEmpty");
  const currentError = document.querySelector("#currentError");
  const btnRefreshCurrent = document.querySelector("#btnRefreshCurrent");

  // Transactions elements
  const productFilter = document.querySelector("#productFilter");
  const txTbody = document.querySelector("#txTbody");
  const txEmpty = document.querySelector("#txEmpty");
  const txError = document.querySelector("#txError");
  const btnClear = document.querySelector("#btnClear");
  const btnRefreshTx = document.querySelector("#btnRefreshTx");

  // 1) Load dropdown products (for tx filter)
  await loadProductsDropdown();

  // 2) Load current stock + transactions
  await Promise.all([loadCurrentStock(), loadTransactions()]);

  // events
  btnRefreshCurrent.addEventListener("click", loadCurrentStock);

  productFilter.addEventListener("change", loadTransactions);

  btnClear.addEventListener("click", async () => {
    productFilter.value = "";
    await loadTransactions();
  });

  btnRefreshTx.addEventListener("click", loadTransactions);

  // ----------------
  async function loadProductsDropdown() {
    // Merr deri 200 produkte për dropdown (MVP)
    const resp = await getProducts({ page: 1, pageSize: 200 });
    const products = resp.items ?? [];

    productFilter.innerHTML = `
      <option value="">All products</option>
      ${products
        .map((p) => `<option value="${p.productId}">${escapeHtml(p.name)}</option>`)
        .join("")}
    `;
  }

  async function loadCurrentStock() {
    hideCurrentError();
    currentTbody.innerHTML = "";
    currentEmpty.classList.add("hidden");

    try {
      const data = await stockApi.getCurrent(); // [{productId, productName, stockQuantity}]
      // sort alfabetik
      data.sort((a, b) => String(a.productName).localeCompare(String(b.productName)));

      currentTbody.innerHTML = data
        .map(
          (x) => `
          <tr>
            <td class="p-2 border">${escapeHtml(x.productName)}</td>
            <td class="p-2 border">${x.stockQuantity}</td>
          </tr>
        `
        )
        .join("");

      currentEmpty.classList.toggle("hidden", data.length !== 0);
    } catch (e) {
      showCurrentError(mapHttpError(e));
    }
  }

  async function loadTransactions() {
    hideTxError();
    txTbody.innerHTML = "";
    txEmpty.classList.add("hidden");

    try {
      const val = productFilter.value;
      const productId = Number(val);

      const txs = val
        ? await stockTransactionApi.getByProductId(productId)
        : await stockTransactionApi.getAll();

      // sort by date desc (më të rejat sipër)
      txs.sort((a, b) => new Date(b.date) - new Date(a.date));

      txTbody.innerHTML = txs
        .map(
          (t) => `
          <tr>
            <td class="p-2 border">${formatDate(t.date)}</td>
            <td class="p-2 border">${escapeHtml(t.productName)}</td>
            <td class="p-2 border">${escapeHtml(t.type)}</td>
            <td class="p-2 border">${t.quantityChange}</td>
          </tr>
        `
        )
        .join("");

      txEmpty.classList.toggle("hidden", txs.length !== 0);
    } catch (e) {
      showTxError(mapHttpError(e));
    }
  }

  function showCurrentError(msg) {
    currentError.textContent = msg;
    currentError.classList.remove("hidden");
  }
  function hideCurrentError() {
    currentError.textContent = "";
    currentError.classList.add("hidden");
  }

  function showTxError(msg) {
    txError.textContent = msg;
    txError.classList.remove("hidden");
  }
  function hideTxError() {
    txError.textContent = "";
    txError.classList.add("hidden");
  }
}

function mapHttpError(e) {
  if (e?.status === 400) return e.data?.message || "Bad request.";
  if (e?.status === 404) return "Not found.";
  return "Something went wrong.";
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? String(iso) : d.toLocaleString();
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

