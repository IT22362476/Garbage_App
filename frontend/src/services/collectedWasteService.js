// services/collectedWasteService.js
import { api, API_ENDPOINTS } from "./apiClient";

export const CollectedWasteService = {
  updateWaste: async (id, data) => {
    const response = await api.put(
      `${API_ENDPOINTS.COLLECTED_WASTE.UPDATE(id)}`,
      data
    );
    return response.data;
  },

  getAllWaste: async () => {
    const response = await api.get(API_ENDPOINTS.COLLECTED_WASTE.GET_ALL);
    return response.data;
  },

  getWasteById: async (id) => {
    const response = await api.get(API_ENDPOINTS.COLLECTED_WASTE.GET_BY_ID(id));
    return response.data;
  },

  createWaste: async (data) => {
    const response = await api.post(API_ENDPOINTS.COLLECTED_WASTE.CREATE, data);
    return response.data;
  },

  deleteWaste: async (id) => {
    const response = await api.delete(API_ENDPOINTS.COLLECTED_WASTE.DELETE(id));
    return response.data;
  },
};
