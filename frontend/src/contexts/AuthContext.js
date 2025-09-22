import React, { createContext, useContext, useState, useEffect } from "react";
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
      const response = await fetch("http://localhost:8070/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const responseText = await response.text();

        let userData;
        try {
          userData = JSON.parse(responseText);
        } catch (parseError) {
          return;
        }
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
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
        // After successful login, fetch user profile
        await checkAuthStatus();
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

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
    } finally {
      setUser(null);

      // Optional: Clear any localStorage or sessionStorage if you're using them
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      // Force a complete page reload to clear any remaining state
      // This will also trigger a fresh auth check
      setTimeout(() => {
        window.location.href = "/login";
      }, 100); // Small delay to ensure state is cleared
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
