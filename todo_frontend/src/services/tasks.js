import { apiRequest } from "./client";

// PUBLIC_INTERFACE
export async function listTasks(filters = {}) {
  /** List tasks with filter, sort, pagination */
  return apiRequest("/api/tasks", { params: filters });
}

// PUBLIC_INTERFACE
export async function getTask(id) {
  /** Get task by id */
  return apiRequest(`/api/tasks/${encodeURIComponent(id)}`);
}

// PUBLIC_INTERFACE
export async function createTask(payload) {
  /** Create task */
  return apiRequest("/api/tasks", { method: "POST", body: payload });
}

// PUBLIC_INTERFACE
export async function updateTask(id, payload) {
  /** Update task */
  return apiRequest(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: payload,
  });
}

// PUBLIC_INTERFACE
export async function patchTask(id, payload) {
  /** Patch task */
  return apiRequest(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /** Delete task */
  return apiRequest(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
}
