import { http } from "./http";

// marrim listen e kategorive nga backend
export function getCategories()
{
    return http.get("/api/categories");
}

export const categoriesApi = {

    getAll: () => http.get("/api/categories"),
    getById: (id) => http.get(`/api/categories/${id}`),
    create: (dto) => http.post("/api/categories", dto),
    update: (id, dto) => http.put(`/api/categories/${id}`, dto),
    remove: (id) => http.delete(`/api/categories/${id}`),
};


