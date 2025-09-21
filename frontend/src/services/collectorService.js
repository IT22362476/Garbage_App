// In services/collectorService.js
import axios from "axios";
import { withCsrf } from './csrf';

const API_URL = "http://localhost:8070";

// Fetch users with the role of 'collector'
// export const getCollectors = () => axios.get("http://localhost:8070/user/collector");
export const getCollectors = () => axios.get(`${API_URL}/user/collector`);
export const getCollectorCount = () => axios.get(`${API_URL}/user/collectors/count`);
export const getRequestCount = () => axios.get(`${API_URL}/schedulePickup/count`);
export const getVehicleCount = () => axios.get(`${API_URL}/vehicle/count`);

// Fetch resident requests that need to be allocated
export const getResidentRequests = () => axios.get("/api/resident-requests");

// Allocate selected requests to a collector
// FIX: Add CSRF token to all mutating requests
export const allocateRequestsToCollector = async (collectorId, requestIds) =>
  axios.post(`/api/collectors/${collectorId}/allocate`, { requests: requestIds }, await withCsrf());
