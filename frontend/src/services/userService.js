import { api, API_ENDPOINTS } from "./apiClient";

// FIX: Add CSRF token to all mutating requests
export const logout = async () => {
  return api.post(API_ENDPOINTS.AUTH.LOGOUT);
};
