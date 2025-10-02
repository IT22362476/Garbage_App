import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Sidebar from './Sidebar';  // Import Sidebar
import { useAuth } from '../contexts/AuthContext';
import { withCsrf } from '../WasteStop/csrf';

const TotalGarbage = () => {
  const [totalGarbage, setTotalGarbage] = useState({
    glass: 0,
    paper: 0,
    foodWaste: 0,
    plastic: 0,
    steel: 0,
  });

  const { user, logout } = useAuth();

  const userId = user.id || "";


  const [cookies] = useCookies(['userID']); // Get userID from cookies
  console.log('UserID from cookies:', cookies.userID);

  useEffect(() => {
    // Fetch garbage details for completed pickups for the logged-in user
    axios.get(`http://localhost:8070/garbage/completed-garbage?userId=${userId}`)
      .then((response) => {
        calculateTotals(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the garbage details!', error);
      });
  }, [cookies.userID]);  // Add cookies.userID as a dependency to run when it changes

  // Function to calculate totals for each garbage type
  const calculateTotals = (garbageDetails) => {
    const totals = {
      glass: 0,
      paper: 0,
      foodWaste: 0,
      plastic: 0,
      steel: 0,
    };

    garbageDetails.forEach(detail => {
      // Increment totals based on category
      switch (detail.category) {
        case 'glass':
          totals.glass += detail.weight;
          break;
        case 'paper':
          totals.paper += detail.weight;
          break;
        case 'food waste':
          totals.foodWaste += detail.weight;
          break;
        case 'plastic':
          totals.plastic += detail.weight;
          break;
        case 'steel':
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
    const summaryData = {
      userId: cookies.userID,
      totals: totalGarbage,
    };

    try {
      // Get config with CSRF token
      const config = await withCsrf({
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await axios.post(
        "http://localhost:8070/totalgarbage/total-garbages",
        summaryData,
        config
      );

      alert("Reported successfully!");
      console.log("Summary reported successfully!", response.data);
    } catch (error) {
      console.error("There was an error reporting the summary!", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="bg-green-100 min-h-screen flex flex-col items-center p-8 w-full">
        <h1 className="text-4xl font-bold text-green-800 mb-8">Total Garbage Collected</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(totalGarbage).map(([type, amount]) => (
            <div key={type} className="bg-green-300 shadow-lg rounded-lg p-6 w-48 transition-transform transform hover:scale-105">
              <h2 className="text-xl font-semibold text-green-700 capitalize">{type.replace(/([A-Z])/g, ' $1')}</h2>
              <p className="text-3xl font-bold text-green-900">{amount} Kg</p>
            </div>
          ))}
        </div>
        {/* Button to report summary */}
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
