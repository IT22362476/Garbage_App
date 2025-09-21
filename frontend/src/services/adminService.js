import axios from "axios";
import { withCsrf } from './csrf';

const API_URL = "http://localhost:8070";

// FIX: Add CSRF token to all mutating requests
export const addPickup = async (pickupData) => {
  return axios.post(`${API_URL}/approvedpickup/add`, pickupData, await withCsrf());
};

export const getResidentRequests = () => {
  return axios.get(`${API_URL}/schedulePickup/getAllPickups`);
};

export const updateRequestStatus = async (requestId, status) => {
  return axios.put(`${API_URL}/schedulePickup/updateStatus/${requestId}`, { status }, await withCsrf());
};

export const getApprovedPickups = () => {
  return axios.get(`${API_URL}/approvedpickup/getAll`);
};