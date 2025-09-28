import { api, API_ENDPOINTS } from "./apiClient";

export const GarbageService = {
  getCompletedGarbage: (userId) =>
    api.get(`/garbage/completed-garbage?userId=${userId}`),

  reportSummary: (summaryData) =>
    api.post("/totalgarbage/total-garbages", summaryData),

  getAllGarbages: api.get(API_ENDPOINTS.GARBAGE.GET_ALL),
};
