import { getProducts } from "./productApi";
import { http } from "./http";
import { stockApi } from "./stockApi";
import { getSales } from "./salesApi";
import { stockTransactionApi } from "./stockTransactionApi";

export async function fetchDashboardData() {
    const productsPaged = await getProducts({page: 1, pageSize: 1});

    const categories = await http.get("/api/categories");

    const currentStock = await stockApi.getCurrent();

    const transaction = await stockTransactionApi.getAll();

    const salesPaged = await getSales({ page: 1, pageSize: 200})

    return { productsPaged, categories, currentStock, transaction, salesPaged };
}