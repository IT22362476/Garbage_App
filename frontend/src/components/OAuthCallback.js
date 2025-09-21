import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spin, message } from "antd";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuthStatus, user } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const authStatus = searchParams.get("auth");

      if (authStatus === "success") {
        message.success("OAuth login successful!");
        await checkAuthStatus();
      } else {
        message.error("OAuth login failed");
        navigate("/login");
      }
    };

    handleOAuthCallback();
  }, [searchParams, checkAuthStatus, navigate]);

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === "resident") {
        navigate("/residentHome");
      } else if (user.role === "admin") {
        navigate("/adminHome");
      } else if (user.role === "collector") {
        navigate(`/CollectorHome/${user.id}`);
      } else if (user.role === "recorder") {
        navigate("/CollectedWasteDashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4">Processing login...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
