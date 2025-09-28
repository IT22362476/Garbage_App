import React, { useEffect, useState } from "react";
import Navbar from "./ResidentNavbar";
import api from "../services/apiClient";
import {
  FaUser,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaEdit,
} from "react-icons/fa";

function ProfileRes() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("user/profile", { withCredentials: true });
      setUserProfile(response.data);
      setFormData({
        name: response.data.name || "",
        address: response.data.address || "",
        email: response.data.email || "",
        contact: response.data.contact || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(`Unable to fetch profile: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setMessage("");
    if (!formData.name || !formData.email || !formData.contact) {
      setMessage("Name, Email, and Contact are required.");
      return;
    }

    try {
      const response = await api.put("user/profile", formData, {
        withCredentials: true,
      });
      setUserProfile(response.data);
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage(`Update failed: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-green-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-800 text-lg font-medium">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-green-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-5 rounded-lg max-w-md shadow-lg">
            <strong className="font-semibold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchUserProfile}
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-start bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-green-900 mb-10">
          Your Profile
        </h1>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
          {/* Header with Edit Button */}
          <div className="bg-green-600 text-white flex justify-between items-center py-4 px-6 font-bold text-xl">
            <span>{userProfile?.name || "User"}</span>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`text-center px-4 py-2 ${
                message.includes("failed")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <FaUser className="text-green-600 w-5 h-5" />
              <span className="font-semibold text-gray-700">Full Name:</span>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="ml-auto border rounded px-2 py-1 w-2/3"
                />
              ) : (
                <p className="text-gray-900 ml-auto">
                  {userProfile?.name || "Not provided"}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <FaHome className="text-green-600 w-5 h-5" />
              <span className="font-semibold text-gray-700">Address:</span>
              {editing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="ml-auto border rounded px-2 py-1 w-2/3"
                />
              ) : (
                <p className="text-gray-900 ml-auto">
                  {userProfile?.address || "Not provided"}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-green-600 w-5 h-5" />
              <span className="font-semibold text-gray-700">Email:</span>
              <p className="text-gray-900">
                {userProfile?.email || "Not provided"}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <FaPhone className="text-green-600 w-5 h-5" />
              <span className="font-semibold text-gray-700">Contact:</span>
              {editing ? (
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="ml-auto border rounded px-2 py-1 w-2/3"
                />
              ) : (
                <p className="text-gray-900 ml-auto">
                  {userProfile?.contact || "Not provided"}
                </p>
              )}
            </div>

            {userProfile?.role && (
              <div className="flex items-center space-x-3">
                <FaUserShield className="text-green-600 w-5 h-5" />
                <span className="font-semibold text-gray-700">Role:</span>
                <p className="text-gray-900 ml-auto capitalize">
                  {userProfile.role}
                </p>
              </div>
            )}

            {/* Save / Cancel buttons */}
            {editing && (
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setFormData({
                      name: userProfile.name,
                      address: userProfile.address,
                      email: userProfile.email,
                      contact: userProfile.contact,
                    });
                    setEditing(false);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileRes;
