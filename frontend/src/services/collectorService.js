import { api, API_ENDPOINTS } from "./apiClient";

export const getCollectors = () =>
  api.get(`${API_ENDPOINTS.USERS.BASE}/collector`);

export const getCollectorCount = () =>
  api.get(`${API_ENDPOINTS.USERS.BASE}/collectors/count`);

export const getRequestCount = () => api.get("/schedulePickup/count");

export const getVehicleCount = () => api.get("/vehicle/count");

export const getResidentRequests = () => api.get("/api/resident-requests");

export const allocateRequestsToCollector = (collectorId, requestIds) =>
  api.post(`/api/collectors/${collectorId}/allocate`, {
    requests: requestIds,
  });

export const CollectorService = {
  // Fetch profile
  getProfile: async (userId) => {
    const response = await api.get(
      `${API_ENDPOINTS.USERS.BASE}/collector/${userId}`
    );
    return response.data;
  },

  // Update profile
  updateProfile: async (userId, profileData) => {
    const response = await api.post(
      `${API_ENDPOINTS.USERS.BASE}/collector/updateProfile`,
      {
        userId,
        ...profileData,
      }
    );
    return response.data;
  },

  // Update password
  updatePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.post(
      `${API_ENDPOINTS.USERS.BASE}/collector/updatePassword`,
      {
        userId,
        currentPassword,
        newPassword,
      }
    );
    return response.data;
  },
};
