import { http } from "./http";

export function getSales({
  page = 1,
  pageSize = 10,
  search = "",
  dateFrom = "",
  dateTo = "",
  minTotal = "",
  maxTotal = "",
} = {}) { 
    const qs = new URLSearchParams();
    qs.set("page", page);
    qs.set("pageSize", pageSize);

    if(search) qs.set("search", search);
    if(dateFrom) qs.set("dateFrom", dateFrom);
    if(dateTo) qs.set("dateTo", dateTo);
    if(minTotal !== "" && minTotal !== null && minTotal !== undefined) qs.set("minTotal", minTotal);
    if(maxTotal !== "" && maxTotal !== null && maxTotal !== undefined) qs.set("maxTotal", maxTotal); 

    return http.get(`/api/sales?${qs.toString()}`);
}

export function getSaleDetails(id) {
    return http.get(`/api/sales/${id}`);
}

export function createSale({items}) {
    return http.post("/api/sales", {items});
}