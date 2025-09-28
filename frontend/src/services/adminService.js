import { api, API_ENDPOINTS } from "./apiClient";

// FIX: Add CSRF token to all mutating requests
export const addPickup = async (pickupData) => {
  return api.post(API_ENDPOINTS.APPROVED_PICKUP.ADD, pickupData);
};

export const getResidentRequests = () => {
  return api.get(API_ENDPOINTS.SCHEDULE_PICKUP.GET_ALL);
};

export const updateRequestStatus = async (requestId, status) => {
  return api.put(API_ENDPOINTS.SCHEDULE_PICKUP.UPDATE_STATUS(requestId), {
    status,
  });
};

export const getApprovedPickups = () => {
  return api.get(API_ENDPOINTS.APPROVED_PICKUP.GET_ALL);
};

export const getApprovedPickupsEndpoint = () => {
  return api.get("approvedpickup/getApprovedPickups");
};
