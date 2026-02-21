import { renderDashboardPage, initDashboardPage } from "../pages/dashboard/dashboardPage";
import { renderProductsListPage, initProductsListPage} from "../pages/products/productsListPage";
import { renderProductCreatePage, initProductCreatePage } from "../pages/products/productCreatePage";
import { renderProductEditPage, initProductEditPage } from "../pages/products/productEditPage";
import { renderCategoriesListPage, initCategoriesListPage } from "../pages/categories/categoriesListPage";
import { renderCategoryCreatePage, initCategoryCreatePage } from "../pages/categories/categoriesCreatePage";
import { renderCategoryEditPage, initCategoryEditPage, } from "../pages/categories/categoriesEditPage";

import { renderStockPage, initStockPage } from "../pages/stock/stockPage";
import { renderStockInPage, initStockInPage } from "../pages/stock/stockInPage";
import { renderStockOutPage, initStockOutPage } from "../pages/stock/stockOutPage";

import { renderSalesListPage, initSalesListPage } from "../pages/sales/salesListPage";
import { renderSalesNewPage, initSalesNewPage } from "../pages/sales/salesNewPage";
import { renderSalesViewPage, initSalesViewPage } from "../pages/sales/salesViewPage";



function setTitle(title) {
    const el = document.querySelector("#pageTitle");
    if(el) el.textContent = title;
}

export function handleRoute() {
    const content = document.querySelector("#content");
    const route = location.hash || "#/dashboard";

if(route === "#/dashboard") {
    setTitle("Dashboard");
    content.innerHTML = renderDashboardPage();
    initDashboardPage();
    return;
}

if(route === "#/products") {
    setTitle("Products");
    content.innerHTML = renderProductsListPage();
    initProductsListPage();
    return;
}

if(route === "#/products/new") {
    setTitle("New Product")
    content.innerHTML = renderProductCreatePage();
    initProductCreatePage();
    return;
}

if (route.startsWith("#/products/edit")) {
  setTitle("Edit Product");
  content.innerHTML = renderProductEditPage();
  initProductEditPage();
  return;
}

if(route === "#/categories") {
  setTitle("Categories");
  content.innerHTML = renderCategoriesListPage();
  initCategoriesListPage();
  return;
}

if(route === "#/categories/new"){
    setTitle("New Category");
    content.innerHTML = renderCategoryCreatePage();
    initCategoryCreatePage();
    return;
}

if(route.startsWith("#/categories/edit")) {
    setTitle("Edit Category");
    content.innerHTML = renderCategoryEditPage();
    initCategoryEditPage();
    return;
}


if (route === "#/stock") {
  setTitle("Stock");
  content.innerHTML = renderStockPage();
  initStockPage();
  return;
}

if (route === "#/stock/in") {
  setTitle("Stock In");
  content.innerHTML = renderStockInPage();
  initStockInPage();
  return;
}

if (route === "#/stock/out") {
  setTitle("Stock Out");
  content.innerHTML = renderStockOutPage();
  initStockOutPage();
  return;
}

if (route === "#/sales") {
  setTitle("Sales");
  content.innerHTML = renderSalesListPage();
  initSalesListPage();
  return;
}

if (route === "#/sales/new") {
  setTitle("New Sale");
  content.innerHTML = renderSalesNewPage();
  initSalesNewPage();
  return;
}

if(route.startsWith("#/sales/view")) {
  setTitle("Sale Details");
  content.innerHTML = renderSalesViewPage();
  initSalesViewPage();
  return;
}


setTitle("Not found");
content.innerHTML = `
 <div class = "bg-white border rounded-xl p-6">
    <h2 class = "text-xl font-semibold"> Page not found </h2>
    <p class = "mt-2 text-sm text-gray-600"> Rruga: ${route} </p>
 </div>    
`

}

