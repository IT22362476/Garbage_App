// services/collectorService.js
import { api, API_ENDPOINTS } from "./apiClient";

// Fetch collectors
export const getCollectors = () =>
  api.get(`${API_ENDPOINTS.USERS.BASE}/collector`);

// Get counts
export const getCollectorCount = () =>
  api.get(`${API_ENDPOINTS.USERS.BASE}/collectors/count`);
export const getRequestCount = () => api.get("/schedulePickup/count");
export const getVehicleCount = () => api.get("/vehicle/count");

// Fetch resident requests
export const getResidentRequests = () => api.get("/api/resident-requests");

// Allocate selected requests to a collector
export const allocateRequestsToCollector = (collectorId, requestIds) =>
  api.post(`/api/collectors/${collectorId}/allocate`, { requests: requestIds });
