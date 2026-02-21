const API_BASE_URL = "http://localhost:5257";

async function request(path, opstions = {}) {
    const url = `${API_BASE_URL}${path}`;

    const headers = {
        "Content-type": "application/json",
        ...(opstions.headers || {}),
    };

    const response = await fetch(url, { ...opstions, headers});

    if(response.status === 204) return null;

    const contentType = response.headers.get("content-type") || ""; 
    const isJson = contentType.includes("application/json");

    const data = isJson ? await response.json() : await response.text();

    if(!response.ok) {
        const message = 
        (data && data.message) || 
        (data && data.title) || 
        (typeof data === "string" && data) ||
        `HTTP ${response.status}`;

        const err = new Error(message);
        err.status = response.status;
        err.data = data;
        throw err;
    }

    return data;
}

export const http = {
    get: (path) => request(path),
    post: (path, body) => 
        request(path, {method: "POST", body: JSON.stringify(body)}),
    put: (path, body) =>
        request(path, {method: "PUT", body: JSON.stringify(body)}),
    delete: (path) => 
        request(path, {method: "DELETE"}),
};