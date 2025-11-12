//
// Simple API client with environment-based base URL, JSON handling, and error wrapping
//

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Returns the base URL for the backend API.
   * Reads from REACT_APP_API_BASE, falling back to same-origin.
   */
  const envBase = process.env.REACT_APP_API_BASE;
  if (envBase && envBase.trim() !== "") return envBase.replace(/\/+$/, "");
  return "";
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", params, body, headers } = {}) {
  /** Perform an HTTP request against the backend API with JSON defaults.
   * - path: relative path like '/api/tasks'
   * - method: GET/POST/PUT/PATCH/DELETE
   * - params: object for query string
   * - body: object to be JSON.stringified
   * - headers: additional headers
   * Returns: parsed JSON or null for 204.
   */
  const base = getApiBaseUrl();
  const qs = params
    ? "?" +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&")
    : "";
  const url = `${base}${path}${qs}`;

  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, init);
  } catch (e) {
    throw new ApiError("Network error", 0, { cause: e.message });
  }

  if (res.status === 204) return null;

  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => ({}));
  } else {
    data = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const msg = (data && data.error && data.error.message) || res.statusText || "API Error";
    throw new ApiError(msg, res.status, data);
  }

  return data;
}

export { ApiError };
