// services/apiClient.js
// Centralized API client with authentication and CSRF handling
import axios from "axios";
import { getCsrfToken, clearCsrfToken } from "./csrf";

// Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8070",
  timeout: 10000, // 10 seconds
  withCredentials: true,
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Request interceptor to add CSRF token and handle auth
apiClient.interceptors.request.use(
  async (config) => {
    // Add CSRF token for mutating requests (POST, PUT, DELETE, PATCH)
    const mutatingMethods = ["post", "put", "delete", "patch"];
    if (mutatingMethods.includes(config.method?.toLowerCase())) {
      try {
        const csrfToken = await getCsrfToken();
        config.headers["CSRF-Token"] = csrfToken;
      } catch (error) {
        console.error("Failed to get CSRF token:", error);
      }
    }

    // Ensure credentials are included
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error cases
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear tokens and redirect to login
          clearCsrfToken();
          localStorage.clear();
          sessionStorage.clear();

          // Only redirect if not already on login page
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden - might be CSRF token issue
          if (
            data?.error?.includes("CSRF") ||
            data?.message?.includes("CSRF")
          ) {
            clearCsrfToken();
            // Retry the request once with a fresh CSRF token
            return apiClient.request(error.config);
          }
          break;

        case 404:
          console.error("API endpoint not found:", error.config.url);
          break;

        case 500:
          console.error(
            "Server error:",
            data?.message || "Internal server error"
          );
          break;

        default:
          console.error("API Error:", status, data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Utility methods for different HTTP methods
export const api = {
  // GET request
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },

  // POST request
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },

  // PUT request
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },

  // DELETE request
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },

  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },

  // Upload file with progress tracking
  upload: (url, formData, onUploadProgress = null) => {
    return apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  // Download file
  download: (url, filename, config = {}) => {
    return apiClient
      .get(url, {
        ...config,
        responseType: "blob",
      })
      .then((response) => {
        // Create blob link to download
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  },
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    LOGOUT: "/user/logout",
    PROFILE: "/user/profile",
    CSRF_TOKEN: "/user/csrf-token",
    GOOGLE_AUTH: "/auth/google",
  },

  // User management
  USERS: {
    BASE: "/user",
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
  },

  // Garbage management
  GARBAGE: {
    ADD: "/garbage/addGarbage",
    GET_ALL: "/garbage/getAllGarbage",
    GET_BY_ID: (id) => `/garbage/${id}`,
    UPDATE: (id) => `/garbage/${id}`,
    DELETE: (id) => `/garbage/${id}`,
  },

  // Schedule pickup
  SCHEDULE_PICKUP: {
    CREATE: "/schedulePickup/create",
    GET_ALL: "/schedulePickup/getAllPickups",
    GET_BY_USER: "/schedulePickup/getByUser",
    UPDATE_STATUS: (id) => `/schedulePickup/updateStatus/${id}`,
    DELETE: (id) => `/schedulePickup/${id}`,
  },

  // Approved pickup
  APPROVED_PICKUP: {
    ADD: "/approvedpickup/add",
    GET_ALL: "/approvedpickup/getAll",
    GET_BY_ID: (id) => `/approvedpickup/${id}`,
    UPDATE: (id) => `/approvedpickup/${id}`,
    DELETE: (id) => `/approvedpickup/${id}`,
  },

  // Vehicle management
  VEHICLES: {
    BASE: "/vehicles",
    GET_ALL: "/vehicles",
    CREATE: "/vehicles",
    GET_BY_ID: (id) => `/vehicles/${id}`,
    UPDATE: (id) => `/vehicles/${id}`,
    DELETE: (id) => `/vehicles/${id}`,
  },

  // Collector management
  COLLECTORS: {
    BASE: "/collectors",
    GET_ALL: "/collectors",
    GET_BY_ID: (id) => `/collectors/${id}`,
    UPDATE: (id) => `/collectors/${id}`,
  },

  // Collected waste
  COLLECTED_WASTE: {
    BASE: "/collectedwaste",
    GET_ALL: "/collectedwaste/getCollectedWaste",
    CREATE: "/collectedwaste/addCollectedWaste",
    GET_BY_ID: (id) => `/collectedwaste/${id}`,
    UPDATE: (id) => `/collectedwaste/update/${id}`,
    DELETE: (id) => `/collectedwaste/delete/${id}`,
  },

  // Recycle waste
  RECYCLE_WASTE: {
    BASE: "/recycleWaste",
    GET_ALL: "/recycleWaste/allRecyclingWastes",
    CREATE: "/recycleWaste/addRecyclingWastes",
    GET_BY_ID: (id) => `/recycleWaste/${id}`,
    UPDATE: (id) => `/recycleWaste/${id}`,
    DELETE: (id) => `/recycleWaste/${id}`,
  },

  // Total garbage
  TOTAL_GARBAGE: {
    BASE: "/totalgarbage",
    GET_ALL: "/totalgarbage",
    CREATE: "/totalgarbage",
    GET_BY_ID: (id) => `/totalgarbage/${id}`,
  },
};

// Helper function to build URLs with query parameters
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, API_CONFIG.baseURL);
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.pathname + url.search;
};

// Export the configured axios instance for advanced usage
export { apiClient };
export default api;
