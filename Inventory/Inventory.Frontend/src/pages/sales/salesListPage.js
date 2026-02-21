import { getSales } from "../../api/salesApi";

let state = {
    page: 1,
    pageSize: 10,
    search: "",
    loading: false,
};

export function renderSalesListPage() {
    return `
    <div class="bg-white border rounded-xl p-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold"> Sales</h2>
          <p class="text-sm text-gray-600 mt-1"> List of sales (invoices) </p>
        </div>
        <a href="#/sales/new" class="px-4 py-2 rounded-lg bg-black text-white text-sm"> New Sale </a>
      </div>
      
      <div class="mt-4 flex flex-wrap items-end gap-3">
        <div class="w-full md:w-80">
          <label class="text-xs text-gray-600"> Search </label>
          <input id="saleSearch" class="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="Search..."/>
        </div>
        
        <div>
        <label class="text-xs text-gray-600">Page size</label>
        <select id="salePageSize" class="mt-1 border rounded-lg px-3 py-2 text-sm">
          ${[5,10,20,50].map(n => `<option value="${n}">${n}</option>`).join("")}
        </select>
      </div>

      <button id="saleApply" class="px-4 py-2 rounded-lg border text-sm">Apply</button>
    </div>

    <div id="salesError" class="hidden mt-4 border border-red-200 bg-red-50 text-red-700 text-sm rounded-lg p-3"></div>
    
    <div class = "mt-4 overflow-auto border rounded-lg">
       <table class = "min-w-full text-sm">
         <thead class="bg-gray-50 text-gray-700">
           <tr>
             <th class = "text-left px-4 py-3">ID</th>
             <th class = "text-left px-4 py-3">Date</th>
             
             <th class = "text-left px-4 py-3">Total Amount</th>
             <th class = "text-left px-4 py-3">Actions</th>
           </tr>
         </thead>
         <tbody id="salesTbody">
            <tr><td class="px-4 py-4 text-gray-500" colspan="5"> Loading...</td></tr>
         </tbody>
      </div>
      
    <div class="mt-4 flex items-center justify-between">
      <button id="salesPrev" class="px-3 py-2 rounded-lg border text-sm">Prev</button>
      <div id="salesPager" class="text-sm text-gray-600">Page -</div>
        <button id="salesNext" class="px-3 py-2 rounded-lg border text-sm">Next</button>
      </div>
    </div>
        `
}

export async function initSalesListPage() {
    document.querySelector("#saleSearch").value = state.search;
    document.querySelector("#salePageSize").value = String(state.pageSize);

    document.querySelector("#saleApply").addEventListener("click", () => {
        state.search = document.querySelector("#saleSearch").value.trim();
        state.pageSize = parseInt(document.querySelector("#salePageSize").value, 10);
        state.page = 1;
        load();
    });


   document.querySelector("#salesPrev").addEventListener("click", () => {
    if (state.page > 1) {
      state.page--;
      load();
    }
  });

    document.querySelector("#salesNext").addEventListener("click", () => {
        state.page++;
        load();
    })

    load();
}


async function load() {
  if (state.loading) return;
  state.loading = true;

  const tbody = document.querySelector("#salesTbody");
  const errBox = document.querySelector("#salesError");
  const pager = document.querySelector("#salesPager");

  errBox.classList.add("hidden");
  errBox.textContent = "";

  tbody.innerHTML = `<tr><td class="px-4 py-4 text-gray-500" colspan="5">Loading...</td></tr>`;

  try {
    const res = await getSales({
      page: state.page,
      pageSize: state.pageSize,
      search: state.search,
    });

    // Expected: { items, page, pageSize, totalCount, totalPages }
    const items = res.items || [];
    const totalPages = res.totalPages || 1;
    const page = res.page || state.page;

    // Fix if user clicked Next beyond totalPages
    if (page > totalPages) {
      state.page = totalPages;
      state.loading = false;
      return load();
    }

    pager.textContent = `Page ${page} / ${totalPages} • Total ${res.totalCount ?? 0}`;

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td class="px-4 py-4 text-gray-500" colspan="5">No sales found.</td></tr>`;
      return;
    }

    tbody.innerHTML = items
      .map(s => {
        const id = s.saleId ?? s.saleID ?? s.id;
        const date = s.date ? new Date(s.date).toLocaleString() : "-";
        const totalQty = s.totalQuantity ?? "-";
        const totalAmount = (s.totalAmount ?? 0).toFixed ? (s.totalAmount).toFixed(2) : s.totalAmount;

      

        return `
          <tr class="border-t">
            <td class="px-4 py-3">${id}</td>
            <td class="px-4 py-3">${date}</td>
           
            <td class="px-4 py-3">${totalAmount}</td>
            <td class="px-4 py-3">
              <a class="text-blue-600 hover:underline" href="#/sales/view?id=${id}">View</a>
            </td>
          </tr>
        `;
      })
      .join("");

  } catch (e) {
    errBox.textContent = e.message || "Something went wrong";
    errBox.classList.remove("hidden");
    tbody.innerHTML = `<tr><td class="px-4 py-4 text-gray-500" colspan="5">Failed to load.</td></tr>`;
  } finally {
    state.loading = false;
  }
}