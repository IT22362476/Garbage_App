import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // No need to navigate manually, logout function handles the redirect
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback redirect if logout fails
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-green-800 text-white w-64 flex flex-col">
      <div className="text-2xl font-bold py-4 px-6 bg-green-700">EcoSmart</div>
      <nav className="mt-10 flex-grow">
        <ul className="flex flex-col">
          {" "}
          {/* Ensure vertical alignment */}
          <li className="mb-4">
            <Link
              to="/residentHome "
              className="block py-2 px-6 hover:bg-green-600"
            >
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/add-garbage-details"
              className="block py-2 px-6 hover:bg-green-600"
            >
              Garbage
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/schedule-pickup"
              className="block py-2 px-6 hover:bg-green-600"
            >
              Schedule Pickups
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/myRequests"
              className="block py-2 px-6 hover:bg-green-600"
            >
              My Requests
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/profile" className="block py-2 px-6 hover:bg-green-600">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout button at the bottom */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
