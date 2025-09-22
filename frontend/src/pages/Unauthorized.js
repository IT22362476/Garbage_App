import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigateBasedOnRole = () => {
    console.log("Navigating based on role for user:", user);
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
      <div className="text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          Access Denied
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-md">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
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
                Go to Home
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
                Go to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
