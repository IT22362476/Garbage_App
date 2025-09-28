import React, { useState, useEffect } from "react";
import axios from "axios";
import { withCsrf } from "./csrf";
import WasteHeader from "./WasteHeader";
import Button from "../components/Button";
import {
  deleteReCycleWaste,
  getReCycleWastes,
  updateReCycleWaste,
} from "../services/recycleWasteService";

const ViewRecycledDetails = () => {
  const [wastes, setWastes] = useState([]);
  const [editFormData, setEditFormData] = useState(null);

  // Fetch all recycling waste data on component load
  useEffect(() => {
    const fetchWastes = async () => {
      try {
        const response = await getReCycleWastes();
        // Make sure wastes is an array
        const wastesArray = Array.isArray(response) ? response : response.data;
        setWastes(wastesArray);
      } catch (error) {
        console.error("Error fetching recycling wastes:", error);
      }
    };
    fetchWastes();
  }, []);

  // Handle delete
  // FIX: Add CSRF token to delete request to prevent 403 Forbidden error
  const handleDelete = async (recycleID) => {
    try {
      await deleteReCycleWaste(recycleID);
      setWastes(wastes.filter((waste) => waste._id !== recycleID));
      alert("Recycling waste deleted successfully");
    } catch (error) {
      console.error("Error deleting recycling waste:", error);
      alert("Failed to delete waste");
    }
  };

  // Handle form change for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Submit the updated data
  // FIX: Add CSRF token to update request to prevent 403 Forbidden error
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateReCycleWaste(editFormData._id, editFormData);
      setWastes(
        wastes.map((waste) =>
          waste._id === editFormData._id ? editFormData : waste
        )
      );
      setEditFormData(null);
      alert("Waste data updated successfully");
    } catch (error) {
      console.error("Error updating recycling waste:", error);
      alert("Failed to update waste");
    }
  };

  // Handle editing a record
  const handleEdit = (waste) => {
    setEditFormData(waste);
  };

  return (
    <div className=" w-full  mx-auto p-6">
      <WasteHeader h1="Recycled Details" />

      {/* Display the list of recycling wastes */}
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Truck Number</th>
            <th className="border px-4 py-2">Area</th>
            <th className="border px-4 py-2">Paper (kg)</th>
            <th className="border px-4 py-2">Food (kg)</th>
            <th className="border px-4 py-2">Polythene (kg)</th>
            <th className="border px-4 py-2">Total (kg)</th>
            <th className="border px-4 py-2">Charge ($)</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wastes.map((waste) => (
            <tr key={waste._id}>
              <td className="border px-4 py-2">{waste.truckNumber}</td>
              <td className="border px-4 py-2">{waste.area}</td>
              <td className="border px-4 py-2">{waste.paperWeight}</td>
              <td className="border px-4 py-2">{waste.foodWeight}</td>
              <td className="border px-4 py-2">{waste.polytheneWeight}</td>
              <td className="border px-4 py-2">{waste.totalWaste}</td>
              <td className="border px-4 py-2">{waste.calculatedCharge}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-600 hover:underline mr-4"
                  onClick={() => handleEdit(waste)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(waste._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to edit the data */}
      {editFormData && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Edit Waste Data</h2>
          <form onSubmit={handleUpdate}>
            <div className="flex flex-col mb-4">
              <label>Truck Number</label>
              <input
                type="text"
                name="truckNumber"
                value={editFormData.truckNumber}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col mb-4">
              <label>Area</label>
              <input
                type="text"
                name="area"
                value={editFormData.area}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex flex-col mb-4">
              <label>Paper Weight (kg)</label>
              <input
                type="number"
                name="paperWeight"
                value={editFormData.paperWeight}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label>Food Weight (kg)</label>
              <input
                type="number"
                name="foodWeight"
                value={editFormData.foodWeight}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label>Polythene Weight (kg)</label>
              <input
                type="number"
                name="polytheneWeight"
                value={editFormData.polytheneWeight}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Waste
            </button>
          </form>
        </div>
      )}
      <div className="  w-full bottom-0 z-10 bg-white border-t h-20 flex justify-between items-center px-5 lg:px-10">
        <Button Button1="Cancel" Button2="Record New" />
      </div>
    </div>
  );
};

export default ViewRecycledDetails;
