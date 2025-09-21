import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getCsrfToken } from "./csrf";

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
      const token = Cookies.get("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8070/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        Cookies.remove("authToken");
        Cookies.remove("userId");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      Cookies.remove("authToken");
      Cookies.remove("userId");
    } finally {
      setLoading(false);
    }
  };

  // FIX: Add CSRF token to login request (non-OAuth)
  const login = async (email, password) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("http://localhost:8070/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await checkAuthStatus(); // Refresh user data
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  // FIX: Add CSRF token to registration request (non-OAuth)
  const register = async (userData) => {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("http://localhost:8070/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, error: data.error || data.errors };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8070/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      Cookies.remove("authToken");
      Cookies.remove("userId");
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8070/auth/google";
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
