import api from "../services/apiClient";

// Utility to fetch and cache CSRF token for secure requests in AuthContext
let csrfToken = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await api.get("user/csrf-token", {
    withCredentials: true,
  });
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

export function clearCsrfToken() {
  csrfToken = null;
}
