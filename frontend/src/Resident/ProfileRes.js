import React, { useEffect, useState } from "react";
import Navbar from "./ResidentNavbar";
import api from "../services/apiClient";

function ProfileRes() {
  // State to store user details and form input
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch user profile details
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("user/profile", {
        withCredentials: true,
      });
      setUserProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError(`Error fetching user profile: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-green-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-green-700">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-green-100">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button
                onClick={fetchUserProfile}
                className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-green-100">
          <h1 className="text-3xl font-bold text-green-800 mb-8">Profile</h1>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="mb-4">
              <span className="block text-gray-700 font-semibold">Name:</span>
              <p className="text-gray-900">
                {userProfile?.name || "Not provided"}
              </p>
            </div>
            <div className="mb-4">
              <span className="block text-gray-700 font-semibold">
                Address:
              </span>
              <p className="text-gray-900">
                {userProfile?.address || "Not provided"}
              </p>
            </div>
            <div className="mb-4">
              <span className="block text-gray-700 font-semibold">Email:</span>
              <p className="text-gray-900">
                {userProfile?.email || "Not provided"}
              </p>
            </div>
            <div className="mb-4">
              <span className="block text-gray-700 font-semibold">
                Contact:
              </span>
              <p className="text-gray-900">
                {userProfile?.contact || "Not provided"}
              </p>
            </div>
            {userProfile?.role && (
              <div className="mb-4">
                <span className="block text-gray-700 font-semibold">Role:</span>
                <p className="text-gray-900 capitalize">{userProfile.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileRes;
