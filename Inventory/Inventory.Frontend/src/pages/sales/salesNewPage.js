import { getProducts } from "../../api/productApi";
import { createSale } from "../../api/salesApi";

let state = {
    products: [],
    cart: [],
    loadingProducts: false,
    saving: false,
};


export function renderSalesNewPage() {
  return `
  <div class="bg-white border rounded-xl p-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">New Sale</h2>
        <p class="text-sm text-gray-600 mt-1">Create a sale and automatically stock-out items</p>
      </div>
      <a href="#/sales" class="px-4 py-2 rounded-lg border text-sm">Back</a>
    </div>

    <div id="saleNewError" class="hidden mt-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg p-3"></div>

    <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
      <div class="md:col-span-2">
        <label class="text-xs text-gray-600">Product</label>
        <select id="saleProductSelect" class="mt-1 w-full border rounded-lg px-3 py-2 text-sm">
          <option value="">Loading...</option>
        </select>
      </div>
      <div>
        <label class="text-xs text-gray-600">Quantity</label>
        <input id="saleQty" type="number" min="1" class="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="1" />
      </div>
      <div class="md:col-span-3">
        <button id="saleAddItem" class="px-4 py-2 rounded-lg bg-black text-white text-sm">Add to cart</button>
      </div>
    </div>

    <div class="mt-6 overflow-auto border rounded-lg">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="text-left px-4 py-3">Product</th>
            <th class="text-left px-4 py-3">Price</th>
            <th class="text-left px-4 py-3">Qty</th>
            <th class="text-left px-4 py-3">Subtotal</th>
            <th class="text-left px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody id="saleCartTbody">
          <tr><td class="px-4 py-4 text-gray-500" colspan="5">Cart is empty.</td></tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        <div>Total Qty: <span id="saleTotalQty">0</span></div>
        <div>Total Amount: <span id="saleTotalAmount">0.00</span></div>
      </div>

      <button id="saleSaveBtn" class="px-4 py-2 rounded-lg bg-green-600 text-white text-sm">Save Sale</button>
    </div>
  </div>
  `;
}

export async function initSalesNewPage() {
    document.querySelector("#saleQty").value = "1";

  document.querySelector("#saleAddItem").addEventListener("click", onAddItem);
  document.querySelector("#saleSaveBtn").addEventListener("click", onSaveSale);

  await loadProducts();
  renderCart();
}

async function loadProducts() {
    if(state.loadingProducts) return;
    state.loadingProducts = true;

    const select = document.querySelector("#saleProductSelect");
    select.innerHTML = `<option value=""> Loading...</option>`;

    try {
        const res = await getProducts({ page: 1, pageSize: 200});
        const items = res.items || [];
        state.products = items;

        select.innerHTML = `<option value=""> Select product...</option>` + items 
            .map(p => `<option value="${p.productId}"> ${p.name} - ${Number(p.price ?? 0).toFixed(2)}</option>`).join("");
    }  
        catch(e) {
            select.innerHTML = `<option value=""> Failed to load products</option>`;
            showError(e.message || "Faled to load products");
        } finally {
            state.loadingProducts = false;
        }
}

function onAddItem() {
    clearError();

  const productId = parseInt(document.querySelector("#saleProductSelect").value, 10);
  const qty = parseInt(document.querySelector("#saleQty").value, 10);

   if (!productId) return showError("Please select a product");
  if (!qty || qty <= 0) return showError("Quantity must be greater than 0");

  const p = state.products.find(x => x.productId === productId);
  if (!p) return showError("Product not found in list");

   const existing = state.cart.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    state.cart.push({
      productId,
      name: p.name,
      price: Number(p.price ?? 0),
      quantity: qty,
    });
  }

  renderCart();
}


function renderCart() {
  const tbody = document.querySelector("#saleCartTbody");
  const totalQtyEl = document.querySelector("#saleTotalQty");
  const totalAmountEl = document.querySelector("#saleTotalAmount");

  if (state.cart.length === 0) {
    tbody.innerHTML = `<tr><td class="px-4 py-4 text-gray-500" colspan="5">Cart is empty.</td></tr>`;
    totalQtyEl.textContent = "0";
    totalAmountEl.textContent = "0.00";
    return;
  }

  let totalQty = 0;
  let totalAmount = 0;

  tbody.innerHTML = state.cart.map((i, idx) => {
    const subtotal = i.price * i.quantity;
    totalQty += i.quantity;
    totalAmount += subtotal;

    return `
      <tr class="border-t">
        <td class="px-4 py-3">${i.name}</td>
        <td class="px-4 py-3">${i.price.toFixed(2)}</td>
        <td class="px-4 py-3">${i.quantity}</td>
        <td class="px-4 py-3">${subtotal.toFixed(2)}</td>
        <td class="px-4 py-3">
          <button data-idx="${idx}" class="saleRemove px-3 py-1 rounded-lg border text-xs">Remove</button>
        </td>
      </tr>
    `;
  }).join("");

  totalQtyEl.textContent = String(totalQty);
  totalAmountEl.textContent = totalAmount.toFixed(2);

  document.querySelectorAll(".saleRemove").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      state.cart.splice(idx, 1);
      renderCart();
    });
  });
}

async function onSaveSale() {
  clearError();

  if (state.saving) return;
  if (state.cart.length === 0) return showError("Cart is empty");

  state.saving = true;
  const btn = document.querySelector("#saleSaveBtn");
  const oldText = btn.textContent;
  btn.textContent = "Saving...";
  btn.disabled = true;

  try {
    const payload = {
      items: state.cart.map(i => ({ productId: i.productId, quantity: i.quantity })),
    };

    const invoice = await createSale(payload);

    // redirect to view page
    const id = invoice.saleId ?? invoice.saleID ?? invoice.saleID ?? invoice.saleId;
    location.hash = `#/sales/view?id=${id}`;
  } catch (e) {
    // backend will throw: "Not enough stock..." etc.
    showError(e.message || "Failed to save sale");
  } finally {
    state.saving = false;
    btn.textContent = oldText;
    btn.disabled = false;
  }
}

function showError(msg) {
  const box = document.querySelector("#saleNewError");
  box.textContent = msg;
  box.classList.remove("hidden");
}

function clearError() {
  const box = document.querySelector("#saleNewError");
  box.classList.add("hidden");
  box.textContent = "";
}