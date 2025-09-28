import React, { useEffect, useState } from "react";
import WasteHeader from "./WasteHeader";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
import { toast } from "react-toastify"; // Importing toast for pop-up notifications
import { CollectedWasteService } from "../services/collectedWasteService";

function CollectedWasteTable() {
  const [wasteData, setWasteData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const data = await CollectedWasteService.getAllWaste();
        setWasteData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWasteData();
  }, []);

  // Function to handle delete action
  const handleDelete = async (id) => {
    try {
      await CollectedWasteService.deleteWaste(id);

      setWasteData(wasteData.filter((item) => item._id !== id)); // Update state to remove deleted item
      toast.success("Record deleted successfully!"); // Show success message
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record!"); // Show error message
    }
  };

  // Function to handle navigate to update form
  const handleUpdate = (item) => {
    navigate(`/update/${item._id}`, { state: { item } }); // Navigate to the update form
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="h-[15%]">
        <WasteHeader h1="Collected Waste Details" />
      </div>
      <div className=" h-[70%] overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Truck Number</th>
              <th className="py-2 px-4 border">Waste Collector</th>
              <th className="py-2 px-4 border">Area</th>
              <th className="py-2 px-4 border">Paper Waste (Kg)</th>
              <th className="py-2 px-4 border">Food Waste (Kg)</th>
              <th className="py-2 px-4 border">Polythene Waste (Kg)</th>
              <th className="py-2 px-4 border">Total Waste (Kg)</th>
              <th className="py-2 px-4 border">Date & Time</th>
              <th className="py-2 px-4 border">Actions</th>{" "}
              {/* New Actions Column */}
            </tr>
          </thead>
          <tbody>
            {wasteData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{item.truckNumber}</td>
                <td className="py-2 px-4 border">{item.wasteCollector}</td>
                <td className="py-2 px-4 border">{item.area}</td>
                <td className="py-2 px-4 border">{item.paperWaste}</td>
                <td className="py-2 px-4 border">{item.foodWaste}</td>
                <td className="py-2 px-4 border">{item.polytheneWaste}</td>
                <td className="py-2 px-4 border">{item.totalWaste}</td>
                <td className="py-2 px-4 border">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="text-blue-600 hover:underline mr-8"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="  w-full bottom-0 z-10 bg-white border-t h-20 flex justify-between items-center px-5 lg:px-10">
        <Button Button1="Cancel" Button2="Record New" />
      </div>
    </div>
  );
}

export default CollectedWasteTable;
