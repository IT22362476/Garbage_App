import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { CollectorService } from "../services/collectorService";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    email: "",
    contact: "",
  });
  const [loading, setLoading] = useState(true);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const data = await CollectorService.getProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await CollectorService.updateProfile(userId, profile);
      setProfile(updated);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile.");
    }
  };

  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await CollectorService.updatePassword(
        userId,
        passwords.currentPassword,
        passwords.newPassword
      );
      setMessage("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "" });
      setShowPasswordAlert(false);
    } catch (err) {
      console.error("Failed to update password:", err);
      setMessage("Failed to update password. Check your current password.");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Profile</h1>

        {!showPasswordAlert && (
          <form
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            onSubmit={handleUpdateProfile}
          >
            {["name", "address", "email", "contact"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 capitalize">
                  {field}:
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={profile[field] || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, [field]: e.target.value })
                  }
                  className="mt-1 block w-full p-2 border rounded"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Update Profile
            </button>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowPasswordAlert(true)}
                className="text-blue-500 hover:underline"
              >
                Change Password
              </button>
            </div>
          </form>
        )}

        {showPasswordAlert && (
          <form
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-8"
            onSubmit={handleUpdatePassword}
          >
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            <div className="mb-4">
              <label className="block text-gray-700">Current Password:</label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">New Password:</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="mt-1 block w-full p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Update Password
            </button>
          </form>
        )}

        {message && <div className="mt-4 text-green-700">{message}</div>}
      </div>
    </div>
  );
};

export default Profile;
