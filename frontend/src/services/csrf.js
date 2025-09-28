import api from "./apiClient";

let csrfToken = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await api.get("user/csrf-token", {
    withCredentials: true,
  });
  csrfToken = res.data.csrfToken;
  return csrfToken;
}

export function clearCsrfToken() {
  csrfToken = null;
}

// Helper to add CSRF token to axios config
export async function withCsrf(config = {}) {
  const token = await getCsrfToken();
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      "CSRF-Token": token,
    },
    withCredentials: true,
  };
}
