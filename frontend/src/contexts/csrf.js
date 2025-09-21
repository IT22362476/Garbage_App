// Utility to fetch and cache CSRF token for secure requests in AuthContext
let csrfToken = null;

export async function getCsrfToken() {
  if (csrfToken) return csrfToken;
  const res = await fetch('http://localhost:8070/user/csrf-token', {
    credentials: 'include',
  });
  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

export function clearCsrfToken() {
  csrfToken = null;
}