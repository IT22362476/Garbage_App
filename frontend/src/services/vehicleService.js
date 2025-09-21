import axios from 'axios';
import { withCsrf } from './csrf';

const API_URL = 'http://localhost:8070/api/vehicles';

export const getVehicles = () => axios.get(API_URL);
// FIX: Add CSRF token to all mutating requests
export const createVehicle = async (data) => axios.post(API_URL, data, await withCsrf());
export const updateVehicle = async (id, data) => axios.put(`${API_URL}/${id}`, data, await withCsrf());
export const deleteVehicle = async (id) => axios.delete(`${API_URL}/${id}`, await withCsrf());
export const getVehicleCount = () => axios.get(`${API_URL}/count`);