// In services/collectorService.js
import axios from "axios";
import { withCsrf } from "./csrf";

const API_URL = "http://localhost:8070";

// Fetch users with the role of 'resident'
// FIX: Add CSRF token to all mutating requests
export const addGarbage = async (garbageData) => {
  return axios.post(
    `${API_URL}/garbage/addGarbage`,
    garbageData,
    await withCsrf()
  );
};
