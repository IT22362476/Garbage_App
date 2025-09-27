// services/collectorService.js
import { api, API_ENDPOINTS } from "./apiClient";

// Add garbage (mutating request, CSRF handled automatically via interceptor)
export const addGarbage = async (garbageData) => {
  return api.post(API_ENDPOINTS.GARBAGE.ADD, garbageData);
};
