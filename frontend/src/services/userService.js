import axios from "axios";
import { withCsrf } from "./csrf";

const API_URL = "http://localhost:8070";

// FIX: Add CSRF token to all mutating requests
export const logout = async () => {
  return axios.post(`${API_URL}/user/logout`, await withCsrf(), {
    withCredentials: true,
  });
};
