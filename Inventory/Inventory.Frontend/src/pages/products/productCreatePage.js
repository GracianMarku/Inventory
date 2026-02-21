import { createProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoriesApi";

export function renderProductCreatePage() {
    return `
        <div class = "bg-white border rounded-xl p-6 max-w-xl">
            <div class = "flex items-start justify-between gap-4">
                <div>
                  <h2 class = "text-xl font-semibold"> New Products </h2>
                  <p id = "createStatus" class = "mt-1 text-sm text-gray-600"> Fill the form </p>
                </div>
                <a href = "#/products" class = "text-sm underline"> Back </a>
            </div>  
            
            <form id= "createProductForm" class = "mt-6 space-y-4">
                <div> 
                  <label class = "block text-sm font-medium mb-1"> Name </label>
                  <input id = "nameInput" class = "w-full text-sm border rounded-lg px-3 py-2 bg-white"
                    placeholder = "Product name" type="text" />
                  <p id= "nameError" class = "mt-1 text-sm text-red-600 hidden"></p>
                </div>
                
                <div>
                    <label class = "block text-sm font-medium mb-1"> description </label>
                    <textarea id = "descInput" class = "w-full text-sm border rounded-lg px-3 py-2 bg-white"
                        placeholder = "Optional description" rows = "3"></textarea>
                </div>
                
                <div>
                    <label class = "block text-sm font-medium mb-1"> Category </label>
                    <select id = "categorySelect"
                        class = "w-full text-sm border rounded-lg px-3 py-2 bg-white">
                        <option value = ""> Select category </option>
                    </select>
                    <p id = "catError" class = "mt-1 text-sm text-red-600 hidden"></p>
                </div>
                
                <div class = "flex items-center gap-2">
                    <button id = "btnSave" class = "px-4 py-2 text-sm rounded-lg bg-black text-white disabled:opacity-50"> Save </button>
                    <a href = "#/products" class = "px-4 py-2 text-sm border rounded-lg bg-white"> Cancel </a>
                </div>
               </form>
              </div>      
    `;
}


export async function initProductCreatePage() {
    const status = document.querySelector("#createStatus");
    const form = document.querySelector("#createProductForm");
    const nameInput = document.querySelector("#nameInput");
    const descInput = document.querySelector("#descInput");
    const categorySelect = document.querySelector("#categorySelect");
    const btnSave = document.querySelector("#btnSave");

    const nameError = document.querySelector("#nameError");
    const catError = document.querySelector("#catError");

    if(!status || !form || !nameInput || !categorySelect || !btnSave) return;

    await loadCategories(categorySelect);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        hideError(nameError);
        hideError(catError);

        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const categoryId = categorySelect.value;

        let ok = true;

        if(!name) {
            showError(nameError, "Name is required");
            ok = false;
        }

        if(!categoryId) {
            showError(catError, "Category is required");
            ok = false;
        }

        if(!ok) return;

        btnSave.disabled = true;
        status.textContent = "Saving...";

        try {
            await createProduct({name, description, categoryId});
            status.textContent = "Saved";
            location.hash = "#/products";
        } catch(err) {
            status.textContent = `ERROR: ${err.message}`;
            btnSave.disabled = false;
        }

    })
}


async function loadCategories(selectEl) {
    try {
        const categories = await getCategories();
        const items = Array.isArray(categories)
        ? categories : categories.items || categories.data || [];

          selectEl.innerHTML = `<option value="">Select category</option>`;

        for(const c of items) {
            const id = c.id ?? c.categoryId ?? "";
            const name = c.name ?? c.categoryName ?? "Unnamed";

            const opt = document.createElement("option");
            opt.value = String(id);
            opt.textContent = name;
            selectEl.appendChild(opt);
        }
    } catch (e) {
        console.warn("Failed to load categories", e.message);
    }
}


function showError(el, msg) {
    el.textContent = msg;
    el.classList.remove("hidden");
}

function hideError(el) {
    el.textContent = "";
    el.classList.add("hidden");
}