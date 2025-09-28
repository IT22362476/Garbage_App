import { api, API_ENDPOINTS } from "./apiClient";

export const getSchedulePickups = () =>
  api.get(API_ENDPOINTS.SCHEDULE_PICKUP.GET_ALL);

// FIX: Add CSRF token to all mutating requests
export const createSchedulePickup = async (data) =>
  api.post(API_ENDPOINTS.SCHEDULE_PICKUP.CREATE, data);

export const updateSchedulePickup = async (id, data) =>
  api.put(API_ENDPOINTS.SCHEDULE_PICKUP.UPDATE(id), data);

export const deleteSchedulePickup = async (id) =>
  api.delete(API_ENDPOINTS.SCHEDULE_PICKUP.DELETE(id));

export const getPickupsByUser = (userID) =>
  api.get(API_ENDPOINTS.SCHEDULE_PICKUP.GET_BY_USER(userID));

export const updatePickupStatus = (id, status) =>
  api.put(API_ENDPOINTS.SCHEDULE_PICKUP.UPDATE_STATUS(id), { status });

export const deletePickup = (id) =>
  api.delete(API_ENDPOINTS.SCHEDULE_PICKUP.DELETE(id));
