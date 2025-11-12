import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listCategories({ search, page, limit } = {}) {
  /** List categories with optional search and pagination */
  return apiRequest("/api/categories", { params: { search, page, limit } });
}

// PUBLIC_INTERFACE
export async function createCategory(payload) {
  /** Create a category: { name, color? } */
  return apiRequest("/api/categories", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export async function updateCategory(id, payload) {
  /** Update a category by id */
  return apiRequest(`/api/categories/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
  });
}

// PUBLIC_INTERFACE
export async function deleteCategory(id) {
  /** Delete a category by id */
  return apiRequest(`/api/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
