import { getProductById, updateProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoriesApi";


export function renderProductEditPage() {
  return `
    <div class="bg-white border rounded-xl p-6 max-w-xl">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold">Edit Product</h2>
          <p id="editStatus" class="mt-1 text-sm text-gray-600">
            Loading...
          </p>
        </div>
        <a href="#/products" class="text-sm underline">Back</a>
      </div>

      <form id="editProductForm" class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input id="nameInput"
            class="w-full text-sm border rounded-lg px-3 py-2 bg-white"
            type="text" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea id="descInput"
            class="w-full text-sm border rounded-lg px-3 py-2 bg-white"
            rows="3"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Category</label>
          <select id="categorySelect"
            class="w-full text-sm border rounded-lg px-3 py-2 bg-white">
            <option value="">Select category</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Price</label>
          <input id="priceInput"
            class="w-full text-sm border rounded-lg px-3 py-2 bg-white"
            type="number" step="0.01" />
        </div>

        <div class="flex items-center gap-2">
          <button class="px-4 py-2 text-sm rounded-lg bg-black text-white">
            Update
          </button>
          <a href="#/products"
             class="px-4 py-2 text-sm border rounded-lg bg-white">
            Cancel
          </a>
        </div>
      </form>
    </div>
  `;
}



export async function initProductEditPage() {

  const status = document.querySelector("#editStatus");
  const form = document.querySelector("#editProductForm");
  const nameInput = document.querySelector("#nameInput");
  const descInput = document.querySelector("#descInput");
  const categorySelect = document.querySelector("#categorySelect");
  const priceInput = document.querySelector("#priceInput");

  if (!form || !status) return;

  const id = getIdFromHash();
  if (!id) {
    status.textContent = "Invalid product id";
    return;
  }

  try {
    // 1️⃣ load categories
    await loadCategories(categorySelect);



    // 2️⃣ load product
    const product = await getProductById(id);

    // 3️⃣ mbush formën
    nameInput.value = product.name ?? "";
    descInput.value = product.description ?? "";
    categorySelect.value = String(product.categoryId ?? "");
    priceInput.value = product.price ?? 0;

    status.textContent = "Edit the product";

  } catch (err) {
    status.textContent = `ERROR: ${err.message}`;
  }

  // 4️⃣ submit
 form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const description = descInput.value.trim();

  const categoryIdRaw = categorySelect.value;
  if (!categoryIdRaw) {
    status.textContent = "Category is required";
    return;
  }

  const categoryId = Number(categoryIdRaw);
  const price = Number(priceInput.value || 0);

  if (!name) {
    status.textContent = "Name is required";
    return;
  }

  try {
    status.textContent = "Updating...";

    const payload = { name, description, categoryId, price };
    console.log("PUT payload:", payload);

    await updateProduct(id, payload);
    location.hash = "#/products";
  } catch (err) {
    status.textContent = `ERROR: ${err.message}`;
  }
});
}


async function loadCategories(selectEl) {
  const categories = await getCategories();
  const items = Array.isArray(categories)
    ? categories
    : categories.items || categories.data || [];

  selectEl.innerHTML = `<option value="">Select category</option>`;

  for (const c of items) {
    const id = c.id ?? c.categoryId;
    const name = c.name ?? c.categoryName ?? "--";
    if(id == null) continue;

    const opt = document.createElement("option");
    opt.value = String(id);
    opt.textContent = name;
    selectEl.appendChild(opt);
  }
}


function getIdFromHash() {
    const hash = location.hash;
    const query = hash.split("?")[1] || "";
    const params = new URLSearchParams(query);
    return params.get("id");
}