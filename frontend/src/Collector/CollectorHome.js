import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AiOutlineUser } from "react-icons/ai"; // You can install this package for icons
import { useAuth } from "../contexts/AuthContext";
import api, { API_ENDPOINTS } from "../services/apiClient";

const CollectorHome = () => {
  const [approvedPickups, setApprovedPickups] = useState([]);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchPickups = async () => {
      try {
        const response = await api.get(
          API_ENDPOINTS.APPROVED_PICKUP.GET_BY_USER(user.id)
        );
        setApprovedPickups(response.data);
      } catch (error) {
        console.error("Error fetching approved pickups:", error);
      }
    };

    fetchPickups();
  }, [user?.id]);

  const handleCompletion = async (index) => {
    try {
      const updatedPickups = [...approvedPickups];
      const pickup = updatedPickups[index];

      pickup.status = pickup.status === "Completed" ? "Pending" : "Completed";

      await api.post(API_ENDPOINTS.APPROVED_PICKUP.UPDATE(pickup._id), {
        status: pickup.status,
      });

      setApprovedPickups(updatedPickups);
    } catch (error) {
      console.error("Error updating pickup status:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleProfile = () => {
    navigate(`/Profile/${user.id}`);
  };

  return (
    <div className="flex relative">
      <Sidebar />

      <div className="bg-green-100 min-h-screen flex flex-col flex-grow">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-3xl font-bold text-green-800">
            Approved Garbage Pickups
          </h1>
          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              <AiOutlineUser className="h-8 w-8 text-green-800" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <ul className="py-2">
                  <li
                    onClick={handleProfile}
                    className="px-4 py-2 hover:bg-green-200 cursor-pointer"
                  >
                    Profile
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-green-200 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          {approvedPickups.length > 0 ? (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-green-600">
                <tr>
                  <th className="py-3 px-6 text-left text-white font-semibold uppercase">
                    User ID
                  </th>
                  <th className="py-3 px-6 text-left text-white font-semibold uppercase">
                    Date
                  </th>
                  <th className="py-3 px-6 text-left text-white font-semibold uppercase">
                    Time
                  </th>
                  <th className="py-3 px-6 text-left text-white font-semibold uppercase">
                    Location
                  </th>
                  <th className="py-3 px-6 text-left text-white font-semibold uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedPickups.map((pickup, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6">{pickup.userid}</td>
                    <td className="py-3 px-6">{pickup.date}</td>
                    <td className="py-3 px-6">{pickup.time}</td>
                    <td className="py-3 px-6">{pickup.location}</td>
                    <td className="py-3 px-6">
                      <input
                        type="checkbox"
                        checked={pickup.status === "Completed"}
                        onChange={() => handleCompletion(index)}
                        className="h-4 w-4 text-green-600"
                      />
                      <span className="ml-2">{pickup.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-green-700 text-lg">
              No approved pickups found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectorHome;
