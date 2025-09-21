// WasteStop/csrf.js
// Utility to fetch and cache CSRF token for secure requests in WasteStop forms
import axios from 'axios';


// Always fetch a fresh CSRF token for every mutating request
export async function getCsrfToken() {
  const res = await axios.get('http://localhost:8070/user/csrf-token', { withCredentials: true });
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
      'CSRF-Token': token,
      'csrf-token': token, // add lowercase variant for compatibility
    },
    withCredentials: true,
  };
}
