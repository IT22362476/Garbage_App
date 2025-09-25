// Logout.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { message } from "antd";

const Logout = () => {
  const { logout, logoutLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      message.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "Logging out will end your current session. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      customClass: {
        popup: "bg-white rounded-[4px] shadow-2xl ",
        title: "text-lg font-semibold text-secondary-green",
        confirmButton:
          "py-1 px-2 text-sm font-semibold mr-2 text-white bg-green-500 rounded-[4px] hover:bg-green-500/80",
        cancelButton:
          "bg-red-500 px-2 text-white py-1 rounded-[4px] text-sm font-semibold hover:bg-red-500/80",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      } else {
        // Optionally redirect to a different page if the user cancels the logout
        navigate(-1); // Redirect to the previous page
      }
    });
  }, [logout, navigate]); // Ensure useEffect dependencies are correct

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {logoutLoading && (
          <svg
            className="animate-spin h-8 w-8 text-gray-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <h1 className="text-2xl">Logging out...</h1>
      </div>
    </div>
  );
};

export default Logout;
