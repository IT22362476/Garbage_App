// WasteHeader.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
function WasteHeader(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();   // clear cookies/session
    navigate("/login");
  };

  return (
    <header className="h-20 bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white flex justify-between items-center shadow-md">
      {/* Left aligned title */}
      <h1 className="text-3xl font-bold">{props.h1}</h1>
      
      {/* Center navigation */}
      <nav className="flex justify-end space-x-6 text-xl">
        <Link to="/CollectedWasteDashboard" className="hover:underline">Dashboard</Link>
        <Link to="/RecycleForm" className="hover:underline">Recycling</Link>
        <Link to="/GarbageStationSummary" className="hover:underline">Analysis</Link>
      </nav>

      {/* Logout Button on the right */}
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition duration-300 ease-in-out"
      >
        Logout
      </button>
    </header>
  );
}

export default WasteHeader;
