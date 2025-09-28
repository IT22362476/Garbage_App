import { api, API_ENDPOINTS } from "./apiClient";

export const getReCycleWastes = () =>
  api.get(API_ENDPOINTS.RECYCLE_WASTE.GET_ALL);

// FIX: Add CSRF token to all mutating requests
export const createReCycleWaste = async (data) =>
  api.post(API_ENDPOINTS.RECYCLE_WASTE.CREATE, data);

export const updateReCycleWaste = async (id, data) =>
  api.put(API_ENDPOINTS.RECYCLE_WASTE.UPDATE(id), data);

export const deleteReCycleWaste = async (id) =>
  api.delete(API_ENDPOINTS.RECYCLE_WASTE.DELETE(id));
