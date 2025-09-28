import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { GarbageService } from "../services/garbageService";
import { useAuth } from "../contexts/AuthContext";

const TotalGarbage = () => {
  const [totalGarbage, setTotalGarbage] = useState({
    glass: 0,
    paper: 0,
    foodWaste: 0,
    plastic: 0,
    steel: 0,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchGarbageDetails = async () => {
      try {
        const response = await GarbageService.getCompletedGarbage(user.id);
        calculateTotals(response.data);
      } catch (error) {
        console.error("Error fetching garbage details:", error);
      }
    };

    fetchGarbageDetails();
  }, [user?.id]);

  // Function to calculate totals for each garbage type
  const calculateTotals = (garbageDetails) => {
    const totals = {
      glass: 0,
      paper: 0,
      foodWaste: 0,
      plastic: 0,
      steel: 0,
    };

    garbageDetails.forEach((detail) => {
      switch (detail.category) {
        case "glass":
          totals.glass += detail.weight;
          break;
        case "paper":
          totals.paper += detail.weight;
          break;
        case "food waste":
          totals.foodWaste += detail.weight;
          break;
        case "plastic":
          totals.plastic += detail.weight;
          break;
        case "steel":
          totals.steel += detail.weight;
          break;
        default:
          break;
      }
    });

    setTotalGarbage(totals);
  };

  // Function to report summary
  const reportSummary = async () => {
    if (!user?.id) return;

    const summaryData = {
      userId: user.id,
      totals: totalGarbage,
    };

    try {
      const response = await GarbageService.reportSummary(summaryData);
      alert("Reported successfully!");
      console.log("Summary reported successfully!", response.data);
    } catch (error) {
      console.error("Error reporting the summary:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="bg-green-100 min-h-screen flex flex-col items-center p-8 w-full">
        <h1 className="text-4xl font-bold text-green-800 mb-8">
          Total Garbage Collected
        </h1>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(totalGarbage).map(([type, amount]) => (
            <div
              key={type}
              className="bg-green-300 shadow-lg rounded-lg p-6 w-48 transition-transform transform hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-green-700 capitalize">
                {type.replace(/([A-Z])/g, " $1")}
              </h2>
              <p className="text-3xl font-bold text-green-900">{amount} Kg</p>
            </div>
          ))}
        </div>

        <button
          onClick={reportSummary}
          className="mt-8 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          Report Summary
        </button>
      </div>
    </div>
  );
};

export default TotalGarbage;
