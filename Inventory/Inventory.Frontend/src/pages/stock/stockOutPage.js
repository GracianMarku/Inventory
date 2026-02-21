import { stockApi } from "../../api/stockApi";
import { getProducts } from "../../api/productApi";

export function renderStockOutPage() {
  return `
    <div class="mb-4 flex justify-between">
      <h1 class="text-2xl font-semibold">Stock Out</h1>
      <a href="#/stock" class="px-4 py-2 border rounded">Back</a>
    </div>

    <div id="errorBox" class="hidden mb-3 p-3 border border-red-300 bg-red-50 text-red-700 rounded"></div>

    <form id="form" class="max-w-xl border rounded p-4">
      <label class="block mb-2 font-medium">Product</label>
      <select id="productId" class="border rounded px-3 py-2 w-full"></select>

      <label class="block mt-4 mb-2 font-medium">Quantity</label>
      <input id="qty" type="number" min="1" class="border rounded px-3 py-2 w-full" />

      <button id="btnSave" type="submit" class="mt-4 px-4 py-2 bg-black text-white rounded">
        Save
      </button>
    </form>
  `;
}

export async function initStockOutPage() {
  const form = document.querySelector("#form");
  const productSelect = document.querySelector("#productId");
  const qtyInput = document.querySelector("#qty");
  const errorBox = document.querySelector("#errorBox");
  const btnSave = document.querySelector("#btnSave");

  hideError();

  const productsResp = await getProducts({ page: 1, pageSize: 200 });
  const products = productsResp.items;

   productSelect.innerHTML = products.map(p =>  `<option value="${p.productId}">${p.name}</option>`).join("");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const productId = Number(productSelect.value);
    const quantity = Number(qtyInput.value);

    if (!productId) return showError("Product is required.");
    if (!quantity || quantity <= 0) return showError("Quantity must be greater than 0.");

    btnSave.disabled = true;

    try {
      await stockApi.stockOut({ productId, quantity });
      location.hash = "#/stock";
    } catch (err) {
      // këtu kapet "Not enough stock"
      showError(mapHttpError(err));
    } finally {
      btnSave.disabled = false;
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  }
  function hideError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }
}

function mapHttpError(e) {
  if (e?.status === 400) return e.data?.message || "Bad request.";
  if (e?.status === 404) return "Product not found.";
  return "Something went wrong.";
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}