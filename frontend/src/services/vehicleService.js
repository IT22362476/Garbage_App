import { api, API_ENDPOINTS } from "./apiClient";

export const getVehicles = () => api.get("api/vehicles");

// FIX: Add CSRF token to all mutating requests
export const createVehicle = async (data) =>
  api.post(API_ENDPOINTS.VEHICLES.CREATE, data);

export const updateVehicle = async (id, data) =>
  api.put(API_ENDPOINTS.VEHICLES.UPDATE(id), data);

export const deleteVehicle = async (id) =>
  api.delete(API_ENDPOINTS.VEHICLES.DELETE(id));

export const getVehicleCount = () => api.get("api/vehicles/count");
