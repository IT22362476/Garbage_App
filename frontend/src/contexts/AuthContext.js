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
      console.log("Checking auth status...");
      const response = await fetch("http://localhost:8070/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log("Profile response text:", responseText);

        let userData;
        try {
          userData = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          return;
        }
        setUser(userData);
      } else {
        console.log("Not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // FIX: Add CSRF token to login request (non-OAuth)
  const login = async (email, password) => {
    try {
      const csrfToken = await getCsrfToken();
      console.log("Attempting login with CSRF token:", csrfToken);

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
      console.log("Login response:", response.status, data);

      if (response.ok) {
        // After successful login, fetch user profile
        await checkAuthStatus();
        return { success: true, data };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Login error:", error);
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
      console.error("Error during logout:", error);
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

  // Test function to debug auth
  const testAuth = async () => {
    try {
      console.log("Testing auth endpoint...");
      const response = await fetch("http://localhost:8070/user/test-auth", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Test auth response:", response.status, data);
      return data;
    } catch (error) {
      console.error("Test auth error:", error);
      return null;
    }
  };

  // Make it available globally for debugging
  if (typeof window !== "undefined") {
    window.testAuth = testAuth;
  }

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
