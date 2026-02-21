import { categoriesApi } from "../../api/categoriesApi";


export function renderCategoryEditPage() {
  return `
    <div class="mb-4 flex justify-between">
      <h1 class="text-2xl font-semibold">Edit Category</h1>
      <a href="#/categories" class="px-4 py-2 border rounded">Back</a>
    </div>

    <div id="errorBox" class="hidden mb-3 p-3 border border-red-300 bg-red-50 text-red-700 rounded"></div>

    <form id="categoryForm" class="max-w-xl border rounded p-4">
      <label class="block mb-2 font-medium">Name</label>
      <input id="nameInput" class="border rounded px-3 py-2 w-full" />

      <button class="mt-4 px-4 py-2 bg-black text-white rounded">
        Update
      </button>
    </form>
  `;
}


export async function initCategoryEditPage() {
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const id = Number(params.get("id"));

  const form = document.querySelector("#categoryForm");
  const nameInput = document.querySelector("#nameInput");
  const errorBox = document.querySelector("#errorBox");

  if (!id) {
    showError("Invalid id.");
    return;
  }

  try {
    const category = await categoriesApi.getById(id);

    const realId =
      category.id ??
      category.categoryId ??
      category.Id ??
      category.CategoryId;

    nameInput.value = category.name;
  } catch (err) {
    showError("Failed to load category.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
      showError("Name is required.");
      return;
    }

    try {
      await categoriesApi.update(id, { name });
      location.hash = "#/categories";
    } catch (err) {
      showError(err?.data?.message || "Update failed.");
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  }
}