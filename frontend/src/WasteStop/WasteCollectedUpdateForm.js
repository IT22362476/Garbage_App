import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Importing useLocation and useNavigate
import { toast } from "react-toastify"; // Importing toast for pop-up notifications
import { CollectedWasteService } from "../services/collectedWasteService";

function WasteCollectedUpdateForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state;

  const [truckNumber, setTruckNumber] = useState(item.truckNumber);
  const [wasteCollector, setWasteCollector] = useState(item.wasteCollector);
  const [area, setArea] = useState(item.area);
  const [paperWaste, setPaperWaste] = useState(item.paperWaste);
  const [foodWaste, setFoodWaste] = useState(item.foodWaste);
  const [polytheneWaste, setPolytheneWaste] = useState(item.polytheneWaste);
  const [totalWaste, setTotalWaste] = useState(item.totalWaste);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedWasteData = {
      truckNumber,
      wasteCollector,
      area,
      paperWaste,
      foodWaste,
      polytheneWaste,
      totalWaste,
    };

    try {
      await CollectedWasteService.updateWaste(item._id, updatedWasteData);
      toast.success("Record updated successfully!");
      navigate("/collectedWaste");
    } catch (error) {
      console.error("Error updating record:", error);
      toast.error("Failed to update record!");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl mb-4">Update Waste Collected</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block mb-1">Truck Number:</label>
          <input
            type="text"
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Waste Collector:</label>
          <input
            type="text"
            value={wasteCollector}
            onChange={(e) => setWasteCollector(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Area:</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Paper Waste (%):</label>
          <input
            type="number"
            value={paperWaste}
            onChange={(e) => setPaperWaste(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Food Waste (%):</label>
          <input
            type="number"
            value={foodWaste}
            onChange={(e) => setFoodWaste(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Polythene Waste (%):</label>
          <input
            type="number"
            value={polytheneWaste}
            onChange={(e) => setPolytheneWaste(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Total Waste (%):</label>
          <input
            type="number"
            value={totalWaste}
            onChange={(e) => setTotalWaste(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default WasteCollectedUpdateForm;
