import { getSaleDetails } from "../../api/salesApi";

function getQueryParam(name) {
  const hash = location.hash || "";
  const idx = hash.indexOf("?");
  if (idx === -1) return null;
  const qs = new URLSearchParams(hash.substring(idx + 1));
  return qs.get(name);
}

export function renderSalesViewPage() {
  return `
  <div class="bg-white border rounded-xl p-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">Sale Details</h2>
        <p id="saleMeta" class="text-sm text-gray-600 mt-1">Loading...</p>
      </div>
      <a href="#/sales" class="px-4 py-2 rounded-lg border text-sm">Back</a>
    </div>

    <div id="saleViewError" class="hidden mt-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg p-3"></div>

    <div class="mt-4 overflow-auto border rounded-lg">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="text-left px-4 py-3">Product</th>
            <th class="text-left px-4 py-3">Price</th>
            <th class="text-left px-4 py-3">Qty</th>
            <th class="text-left px-4 py-3">Subtotal</th>
          </tr>
        </thead>
        <tbody id="saleItemsTbody">
          <tr><td class="px-4 py-4 text-gray-500" colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 text-sm text-gray-700">
      <div>Total Qty: <span id="saleTotalQty">-</span></div>
      <div>Total Amount: <span id="saleTotalAmount">-</span></div>
    </div>
  </div>
  `;
}

export async function initSalesViewPage() {
  const id = parseInt(getQueryParam("id"), 10);
  if (!id) {
    showError("Missing sale id");
    return;
  }

  try {
    const data = await getSaleDetails(id);

    // SaleDetailsDTO: SaleID/SaleId, Date, TotalAmount, TotalQuantity, Items[]
    const saleId = data.saleId ?? data.saleID ?? data.saleID ?? id;
    const date = data.date ? new Date(data.date).toLocaleString() : "-";

    document.querySelector("#saleMeta").textContent = `Sale #${saleId} • ${date}`;
    document.querySelector("#saleTotalQty").textContent = String(data.totalQuantity ?? 0);
    document.querySelector("#saleTotalAmount").textContent = Number(data.totalAmount ?? 0).toFixed(2);

    const items = data.items || [];
    const tbody = document.querySelector("#saleItemsTbody");

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td class="px-4 py-4 text-gray-500" colspan="4">No items.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(i => `
      <tr class="border-t">
        <td class="px-4 py-3">${i.productName ?? "-"}</td>
        <td class="px-4 py-3">${Number(i.price ?? 0).toFixed(2)}</td>
        <td class="px-4 py-3">${i.quantity ?? 0}</td>
        <td class="px-4 py-3">${Number(i.subtotal ?? (Number(i.price ?? 0) * Number(i.quantity ?? 0))).toFixed(2)}</td>
      </tr>
    `).join("");

  } catch (e) {
    showError(e.message || "Failed to load sale details");
  }
}

function showError(msg) {
  const box = document.querySelector("#saleViewError");
  box.textContent = msg;
  box.classList.remove("hidden");
}