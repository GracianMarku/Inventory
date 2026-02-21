import { http } from "./http";

export function getProducts({
    page = 1,
    pageSize = 10,
    search = "",
    categoryId = "",
} = {}) {
    const qs = new URLSearchParams();

    qs.set("page", page);
    qs.set("pageSize", pageSize);

    if(search) qs.set("search", search);
    if(categoryId) qs.set("categoryId", categoryId);

    return http.get(`/api/products?${qs.toString()}`);
}


export function createProduct({name, description, categoryId}) {
    return http.post("/api/products", {
        name,
        description,
        categoryId,
    })
}


export function getProductById(id) {
    return http.get(`/api/products/${id}`);
}

export function updateProduct(id, payload) {
    return http.put(`/api/products/${id}`, payload);
}

export function deleteProduct(id) {
    return http.delete(`/api/products/${id}`);
}