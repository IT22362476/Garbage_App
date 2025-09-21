// services/csrf.js
// Utility to fetch and cache CSRF token for secure requests
import axios from 'axios';

let csrfToken = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await axios.get('http://localhost:8070/user/csrf-token', { withCredentials: true });
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
      'CSRF-Token': token,
    },
    withCredentials: true,
  };
}
