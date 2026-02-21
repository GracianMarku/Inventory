import { categoriesApi } from "../../api/categoriesApi";


export function renderCategoryCreatePage() {
  return `
    <div class="mb-4 flex justify-between">
      <h1 class="text-2xl font-semibold">New Category</h1>
      <a href="#/categories" class="px-4 py-2 border rounded">Back</a>
    </div>

    <div id="errorBox" class="hidden mb-3 p-3 border border-red-300 bg-red-50 text-red-700 rounded"></div>

    <form id="categoryForm" class="max-w-xl border rounded p-4">
      <label class="block mb-2 font-medium">Name</label>
      <input id="nameInput" class="border rounded px-3 py-2 w-full" />

      <button type="submit" class="mt-4 px-4 py-2 bg-black text-white rounded">
        Save
      </button>
    </form>
  `;
}

export function initCategoryCreatePage() {
  console.log("INIT CREATE CATEGORY PAGE");

  const form = document.querySelector("#categoryForm");
  const nameInput = document.querySelector("#nameInput");
  const errorBox = document.querySelector("#errorBox");

  if (!form || !nameInput || !errorBox) {
    console.error("Create page elements not found", { form, nameInput, errorBox });
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("SUBMIT FIRED");

    const name = nameInput.value.trim();
    console.log("DTO:", { name });

    if (!name) {
      showError("Name is required.");
      return;
    }

    try {
      const created = await categoriesApi.create({ name });
      console.log("CREATE OK:", created);
      location.hash = "#/categories";
    } catch (err) {
      console.log("CREATE FAIL:", err);
      showError(err?.data?.message || "Something went wrong.");
    }
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
  }
}
