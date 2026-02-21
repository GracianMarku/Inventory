import { http } from "./http";

export const stockTransactionApi = {
    getAll: () => http.get("/api/StockTransaction"),
    getByProductId: (productId) => http.get(`/api/StockTransaction/product/${productId}`),
};