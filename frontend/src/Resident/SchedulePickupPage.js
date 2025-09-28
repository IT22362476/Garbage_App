import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./ResidentNavbar";
import { createSchedulePickup } from "../services/shedulePickupService";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

function SchedulePickupPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const userID = user?.id;

  const availableLocations = [
    {
      id: 1,
      name: "A/24 16th Street",
      description: "Near the community center",
    },
    {
      id: 2,
      name: "B/12 18th Street",
      description: "Next to the park entrance",
    },
    {
      id: 3,
      name: "C/9 Main Avenue",
      description: "Opposite the grocery store",
    },
    { id: 4, name: "D/45 Elm Street", description: "By the main square" },
    { id: 5, name: "E/3 Oak Road", description: "Near the school" },
  ];

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) return toast.error("Please select a location.");
    if (!date) return toast.error("Please select a pickup date.");
    if (!time) return toast.error("Please select a time slot.");

    const newSchedule = { date, time, location, userID };

    try {
      await createSchedulePickup(newSchedule);
      toast.success("Pickup scheduled successfully!");
      navigate("/myRequests");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to schedule pickup.");
    }
  };

  return (
    <div className="flex min-h-screen bg-green-100">
      <Navbar />
      <div className="flex-1 flex justify-center items-start p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Schedule Your Pickup
          </h2>

          {/* Location Select */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Select Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="" disabled>
                Select location
              </option>
              {availableLocations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} - {loc.description}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Pickup Date
            </label>
            <input
              type="date"
              value={date}
              min={getTodayDate()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Pickup Time
            </label>
            <div className="space-y-2">
              {["9 AM - 11 AM", "11 AM - 1 PM", "1 PM - 3 PM"].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={`w-full py-2 rounded-md border font-medium ${
                    time === slot
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                  }`}
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700"
          >
            Schedule Pickup
          </button>
        </form>
      </div>
    </div>
  );
}

export default SchedulePickupPage;
