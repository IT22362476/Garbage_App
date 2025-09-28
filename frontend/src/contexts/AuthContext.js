import React, { createContext, useContext, useState, useEffect } from "react";
import { logout as logoutApi } from "../services/userService";
import { api, API_ENDPOINTS } from "../services/apiClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      // 1. Call login API
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      // 2. Fetch user profile immediately after login
      const profileResponse = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      setUser(profileResponse.data);

      return { success: true, user: profileResponse.data };
    } catch (error) {
      let errorMsg = "Something went wrong. Please try again.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = "Invalid email or password.";
        } else if (error.response.status === 429) {
          errorMsg =
            "Too many login attempts. Please wait and try again later.";
        } else {
          errorMsg = error.response.data?.error || "Server error occurred.";
        }
      } else {
        errorMsg = "Network error. Please check your connection.";
      }

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.errors ||
        "Network error";
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    }
  };

  const loginWithGoogle = () => {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE_AUTH;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
