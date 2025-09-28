import api from "../services/apiClient";

// Always fetch a fresh CSRF token for every mutating request
export async function getCsrfToken() {
  const res = await api.get("user/csrf-token", {
    withCredentials: true,
  });
  return res.data.csrfToken;
}

export function clearCsrfToken() {
  // No-op, since we no longer cache the token
}

export async function withCsrf(config = {}) {
  const token = await getCsrfToken();
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      "CSRF-Token": token,
      "csrf-token": token, // add lowercase variant for compatibility
    },
    withCredentials: true,
  };
}
