// NotFound.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigateBasedOnRole = () => {
    if (!user) return;

    if (user.role === "resident") {
      navigate("/residentHome");
    } else if (user.role === "admin") {
      navigate("/adminHome");
    } else if (user.role === "collector") {
      navigate(`/CollectorHome/${user.id}`);
    } else if (user.role === "recorder") {
      navigate("/CollectedWasteDashboard");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2 text-gray-800">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="space-x-4">
        {user ? (
          <>
            <button
              onClick={navigateBasedOnRole}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Go to Dashboard
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Go Back to Home
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Go to Login
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Go Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NotFound;
