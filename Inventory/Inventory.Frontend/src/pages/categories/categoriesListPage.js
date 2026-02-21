import { categoriesApi } from "../../api/categoriesApi";
import { categoriesState } from "./categoriesState";



export function renderCategoriesListPage() {
  return `
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Categories</h1>
      <a class="px-4 py-2 rounded bg-black text-white" href="#/categories/new">New</a>
    </div>

    <div id="catErrorBox" class="hidden mb-3 p-3 rounded border border-red-300 bg-red-50 text-red-700"></div>

    <div class="overflow-x-auto">
      <table class="w-full border">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left p-2 border">Id</th>
            <th class="text-left p-2 border">Name</th>
            <th class="text-left p-2 border w-[220px]">Actions</th>
          </tr>
        </thead>
        <tbody id="catTbody"></tbody>
      </table>
    </div>

    <div id="catEmpty" class="hidden mt-4 text-gray-600">No categories found.</div>
  `;
}

export async function initCategoriesListPage() {
  const tbody = document.querySelector("#catTbody");
  const errorBox = document.querySelector("#catErrorBox");
  const empty = document.querySelector("#catEmpty");

  hideError();

  try {
    const items = await categoriesApi.getAll(); // GET /api/categories

    tbody.innerHTML = items.map(c => `
      <tr>
        <td class="p-2 border">${c.categoryId}</td>
        <td class="p-2 border">${escapeHtml(c.name)}</td>
        <td class="p-2 border">
          <a class="px-3 py-1 rounded border mr-2" href="#/categories/edit?id=${c.categoryId}">Edit</a>
          <button class="px-3 py-1 rounded border" data-delete-id="${c.categoryId}">Delete</button>
        </td>
      </tr>
    `).join("");

    empty.classList.toggle("hidden", items.length !== 0);

    // bind delete
    document.querySelectorAll("[data-delete-id]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = Number(btn.dataset.deleteId);
        const ok = confirm("Delete this category?");
        if (!ok) return;

        btn.disabled = true;
        hideError();

        try {
          await categoriesApi.remove(id);
          // refresh list
          await initCategoriesListPage();
        } catch (e) {
          showError(mapHttpError(e));
        } finally {
          btn.disabled = false;
        }
      });
    });

  } catch (e) {
    showError(mapHttpError(e));
    tbody.innerHTML = "";
    empty.classList.add("hidden");
  }

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
  if (e?.status === 404) return "Not found.";
  if (e?.status === 409) return e.data?.message || "Conflict.";
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