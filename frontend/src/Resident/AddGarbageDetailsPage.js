import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./ResidentNavbar";
import { addGarbage } from "../services/residentService";
import { message } from "antd";
import { useAuth } from "../contexts/AuthContext";

function AddGarbageDetailsPage() {
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");
  const [payment, setPayment] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const userID = user?.id;

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);

  // Calculate payment when weight changes (100 Rs per kg)
  useEffect(() => {
    setPayment(weight * 100);
  }, [weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGarbage = {
      category,
      weight,
      date,
      payment,
      userID: Number(userID),
    };
    try {
      await addGarbage(newGarbage);
      message.success("Garbage details added successfully!");
      navigate("/residentHome");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <div className="flex">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-md bg-green-100 rounded-lg p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
              Add Garbage Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date (Auto-filled) */}
              <div className="flex flex-col">
                <label className="mb-2 text-lg text-gray-700">Date:</label>
                <input
                  type="text"
                  value={date}
                  readOnly
                  className="p-3 border rounded-md border-gray-300 bg-gray-200"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col">
                <label className="mb-2 text-lg text-gray-700">
                  Garbage Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="p-3 border rounded-md border-gray-300"
                >
                  <option value="">Select Category</option>
                  <option value="organic">Organic Waste</option>
                  <option value="plastic">Plastic Waste</option>
                  <option value="electronic">Electronic Waste</option>
                </select>
              </div>

              {/* Weight */}
              <div className="flex flex-col">
                <label className="mb-2 text-lg text-gray-700">
                  Weight (kg):
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight in kg"
                  required
                  className="p-3 border rounded-md border-gray-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Submit Details
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddGarbageDetailsPage;
