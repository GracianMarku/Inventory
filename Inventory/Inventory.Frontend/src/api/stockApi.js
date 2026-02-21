import { http } from "./http";

export const stockApi = {
    stockIn: (dto) => http.post("/api/Stock/in", dto),
    stockOut: (dtp) => http.post("/api/Stock/out", dtp),

    getCurrent: () => http.get("/api/Stock/current"),
    getCurrentByProductId: (productId) => http.get(`/api/Stock/current/${productId}`),
};