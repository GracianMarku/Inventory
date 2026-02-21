import { fetchDashboardData } from "../../api/dashboardApi"

const LOW_STOCK_THRESHOLD = 5;


export function renderDashboardPage()
{
    return `
        <div class = "space-y-6">
          <div id="dashError" class="hidden border border-red-200 bg-red-50 text-red-700 text-sm rounded-xl p-4"></div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            ${kpi("Products", "kpiProducts")}
            ${kpi("Categories", "kpiCategories")}
            ${kpi("Sales Today", "kpiSalesToday")}
            ${kpi("Revenue Today", "kpiRevenueToday")}
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

         <!--   Low stock -->
        <div class="bg-white border rounded-xl p-4 lg:col-span-2">
  <div class="flex items-center justify-between">
    <h3 class="font-semibold">Low stock</h3>
    <a class="text-sm text-blue-600 hover:underline" href="#/stock">Open Stock</a>
  </div>

  <p class="text-sm text-gray-600 mt-1">Qty ≤ ${LOW_STOCK_THRESHOLD}</p>

     <div class="mt-3 overflow-auto border rounded-lg">
        <table class="min-w-full text-sm">
            <thead class="bg-gray-50 text-gray-700">
             <tr>
                <th class="text-left px-4 py-2">Product</th>
                <th class="text-left px-4 py-2">Qty</th>
             </tr>
            </thead>
            <tbody id="lowStockTbody">
              <tr><td class="px-4 py-3 text-gray-500" colspan="2">Loading...</td></tr>
            </tbody>
         </table>
         </div>
       </div>

            <div class="bg-white border rounded-xl p-4">
              <h3 class="font-semibold"> Quick actions</h3>
              <div class="mt-3 flex flex-col gap-2">
                ${linkBtn("New Sale", "#/sales/new")}
                ${linkBtn("Stock In", "#/stock/in")}
                ${linkBtn("Stock Out", "#/stock/out")}
                ${linkBtn("New Product", "#/products/new")}
              </div>
            </div>
            
         </div>
         
            <div class="mt-3 overflow-auto border rounded-lg">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 text-gray-700">
                  <tr>
                    <th class="text-left px-4 py-2">Date</th>
                    <th class="text-left px-4 py-2">Product</th>
                    <th class="text-left px-4 py-2">Type</th>
                    <th class="text-left px-4 py-2">Qty</th>
                  </tr>
                </thead>
                <tbody id="recentTxTbody">
                  <tr><td class="px-4 py-3 text-gray-500" colspan="4">Loading</td></tr>
                </tbody>
              </table>
            </div>
           </div>

        </div>            
                  
    `
}

export function initDashboardPage() {
    loadDashboard();
}

async function loadDashboard() {
    const err = document.querySelector("#dashError");
    hideErr();

    try {
        const { productsPaged, categories, currentStock, transaction, salesPaged} = 
            await fetchDashboardData();

        setText("#kpiProducts", productsPaged.totalCount ?? 0);
        setText("#kpiCategories", categories.length ?? 0);

        const {count, revenue} = calcTodaySales(salesPaged.items || []);
        setText("#kpiSalesToday", count);
        setText("#kpiRevenueToday", revenue.toFixed(2));

        renderLowStock(currentStock);

        renderRecent(transaction);

    } catch(e) {
        showErr(e.message || "Failed to load dashboard");
    }

    function showErr(msg) {
        err.textContent = msg;
        err.classList.remove("hidden");
    }

    function hideErr() {
        err.textContent = "";
        err.classList.add("hidden");
    }
}


function renderLowStock(stockRows) {
  const tbody = document.querySelector("#lowStockTbody");

  // këtu duhet me ditë formatin e /api/Stock/current
  // zakonisht vjen si: [{ productId, productName, stockQuantity }]
  const rows = (stockRows || [])
    .map(x => ({
      name: x.productName ?? x.name ?? `Product #${x.productId ?? "?"}`,
      qty: Number(x.stockQuantity ?? x.quantity ?? x.qty ?? 0),
    }))
    .filter(x => x.qty <= LOW_STOCK_THRESHOLD)
    .slice(0, 8);

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td class="px-4 py-3 text-gray-500" colspan="2">No low stock items.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(r => {
    const badge = r.qty === 0
      ? `<span class="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Out</span>`
      : "";
    return `
      <tr class="border-t">
        <td class="px-4 py-2">${r.name}${badge}</td>
        <td class="px-4 py-2">${r.qty}</td>
      </tr>
    `;
  }).join("");
}

function renderRecent(txs) {
  const tbody = document.querySelector("#recentTxTbody");
  if (!tbody) return;

  const getDateValue = (t) => t.date ?? t.Date ?? t.transactionDate ?? t.createdAt;

  const list = (Array.isArray(txs) ? txs : [])
    .slice()
    .sort((a, b) => new Date(getDateValue(b)) - new Date(getDateValue(a)))
    .slice(0, 10);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td class="px-4 py-3 text-gray-500" colspan="4">No transactions.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(t => {
    const rawDate = getDateValue(t);
    const date = rawDate ? new Date(rawDate).toLocaleString() : "-";

    const product = t.productName ?? t.ProductName ?? `Product #${t.productId ?? t.ProductId ?? "?"}`;
    const type = t.type ?? t.Type ?? "-";
    const qty = t.quantityChange ?? t.QuantityChange ?? "-";

    return `
      <tr class="border-t">
        <td class="px-4 py-2">${date}</td>
        <td class="px-4 py-2">${product}</td>
        <td class="px-4 py-2">${type}</td>
        <td class="px-4 py-2">${qty}</td>
      </tr>
    `;
  }).join("");


}

function calcTodaySales(sales) {
  const today = new Date();
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  let count = 0;
  let revenue = 0;

  for (const s of sales) {
    if (!s.date) continue;
    const d = new Date(s.date);
    if (sameDay(d, today)) {
      count++;
      revenue += Number(s.totalAmount ?? 0);
    }
  }

  return { count, revenue };
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = String(value);
}

function kpi(title, id) {
  return `
    <div class="bg-white border rounded-xl p-4">
      <div class="text-sm text-gray-600">${title}</div>
      <div id="${id}" class="mt-2 text-2xl font-semibold">-</div>
    </div>
  `;
}

function linkBtn(label, href) {
  return `<a href="${href}" class="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">${label}</a>`;
}