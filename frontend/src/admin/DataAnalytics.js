import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import 'chart.js/auto';

function DataAnalytics() {
  const [garbageData, setGarbageData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    // Fetch garbage data from the API
    axios.get("http://localhost:8070/garbage/getAllGarbage")
      .then((response) => {
        const data = response.data;
        setGarbageData(data);
        
        // Process data for charts
        const categoryMap = {};
        data.forEach((item) => {
          const month = new Date(item.date).getMonth();
          const currentMonth = new Date().getMonth();
          
          if (month === currentMonth) { // Filter for the current month
            if (!categoryMap[item.category]) {
              categoryMap[item.category] = 0;
            }
            categoryMap[item.category] += item.weight;
          }
        });

        const categoryLabels = Object.keys(categoryMap);
        const categoryWeights = Object.values(categoryMap);

        setCategories(categoryLabels);
        setWeights(categoryWeights);
      })
      .catch((error) => {
        console.log("Error fetching garbage data:", error);
      });
  }, []);

  // Pie chart data
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Garbage Category Weight Distribution",
        data: weights,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverOffset: 4,
      },
    ],
  };

  // Bar chart data
  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Weight Collected (kg)",
        data: weights,
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-green-100 min-h-screen">
      <div className="flex">
        <AdminNav />
        <div className="flex-grow p-8">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Data Analytics</h1>
          
          <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl">
            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              Garbage Collection Weight by Category (This Month)
            </h2>
            
            {/* Pie Chart */}
            <div className="flex justify-center mb-8">
              <div className="w-full md:w-1/2">
                <Pie data={pieData} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">
              Bar Chart - Weight Collected Per Category
            </h2>

            {/* Bar Chart */}
            <div className="flex justify-center">
              <div className="w-full md:w-3/4">
                <Bar data={barData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataAnalytics;
