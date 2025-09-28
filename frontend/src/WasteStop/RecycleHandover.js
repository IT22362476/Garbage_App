import React, { useState, useEffect } from "react";
import axios from "axios";
import { withCsrf } from "./csrf";
import WasteHeader from "./WasteHeader";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../services/vehicleService";
import { getApprovedPickups } from "../services/adminService";

const RecycleForm = () => {
  // State to manage form data
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    truckNumber: "",
    area: "",
    paperWeight: 0,
    foodWeight: 0,
    polytheneWeight: 0,
    totalWaste: 0,
    calculatedCharge: 0,
  });
  const [vehicles, setVehicles] = useState([]); // State to store fetched truck numbers
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch truck numbers (assuming a field named "truckNo" in the "users" collection)
        const vehiclesResponse = await getVehicles();
        const truckNumbers = vehiclesResponse.data.map((user) => user.truckNo);
        setVehicles(truckNumbers);

        // Fetch locations (assuming a field named "location" in the "approvedpickups" collection)
        const locationsResponse = await getApprovedPickups();
        const locations = locationsResponse.data.map(
          (location) => location.location
        );
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error gracefully (e.g., display an error message)
      }
    };
    fetchData();
  }, []);

  // Define rates for each waste category (per kg)
  const rateForPaper = 2.0;
  const rateForFood = 1.5;
  const rateForPolythene = 3.0;

  // Function to calculate total waste and charge based on the rates
  const calculateTotals = (updatedFormData) => {
    const paperWeight = parseFloat(updatedFormData.paperWeight);
    const foodWeight = parseFloat(updatedFormData.foodWeight);
    const polytheneWeight = parseFloat(updatedFormData.polytheneWeight);

    const totalWaste = paperWeight + foodWeight + polytheneWeight;
    const chargeForPaper = paperWeight * rateForPaper;
    const chargeForFood = foodWeight * rateForFood;
    const chargeForPolythene = polytheneWeight * rateForPolythene;
    const calculatedCharge =
      chargeForPaper + chargeForFood + chargeForPolythene;

    return {
      totalWaste: totalWaste.toFixed(2),
      calculatedCharge: calculatedCharge.toFixed(2),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    const { totalWaste, calculatedCharge } = calculateTotals(updatedFormData);

    setFormData({
      ...updatedFormData,
      totalWaste,
      calculatedCharge,
    });
  };
  const validateForm = () => {
    const newErrors = {};

    // Validate collected area (allow letters, numbers, "/", ".", ",", and spaces)
    const areaRegex = /^[a-zA-Z0-9\/.,\s]+$/;
    if (!areaRegex.test(formData.area)) {
      newErrors.area =
        "Area name should contain only letters, numbers, '/', '.', ',' and spaces.";
    }

    // Validate paperWaste, foodWaste, polytheneWaste (whole numbers)
    const wasteRegex = /^[0-9]+$/;
    if (!wasteRegex.test(formData.paperWaste) || formData.paperWaste === "") {
      newErrors.paperWaste = "Paper waste must be a whole number.";
    }
    if (!wasteRegex.test(formData.foodWaste) || formData.foodWaste === "") {
      newErrors.foodWaste = "Food waste must be a whole number.";
    }
    if (
      !wasteRegex.test(formData.polytheneWaste) ||
      formData.polytheneWaste === ""
    ) {
      newErrors.polytheneWaste = "Polythene waste must be a whole number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form before submitting
    // if (!validateForm()) {
    //   return; // Exit if there are validation errors
    // }

    try {
      console.log("Submitting data:", formData);
      // FIX: Add CSRF token to the request to prevent 403 Forbidden error
      const response = await axios.post(
        "http://localhost:8070/recycleWaste/addRecyclingWastes",
        formData,
        await withCsrf()
      );

      navigate("/viewRecycledDetails");

      setFormData({
        truckNumber: "",
        area: "",
        paperWeight: 0,
        foodWeight: 0,
        polytheneWeight: 0,
        totalWaste: 0,
        calculatedCharge: 0,
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <WasteHeader h1="Recycle Waste Requests" />
      <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg mt-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
          Recycling Request Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Truck Number:</label>
              {/* <input 
                              name="truckNumber"
                              value={formData.truckNumber}
                              onChange={handleChange}
                              className="w-full p-2 border border-gray-300 rounded"
              /> */}
              <select
                name="truckNumber"
                value={formData.truckNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Assigned Truck</option>
                {vehicles.map((truckNo, index) => (
                  <option key={index} value={truckNo}>
                    {truckNo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Area:</label>
              {/* <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded ${
                  errors.area ? "border-red-500" : ""
                }`}
              />
              {errors.area && <p className="text-red-500">{errors.area}</p>}
 */}
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded `}
              >
                <option value="">Collected Area</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Paper Weight (kg)
              </label>
              <input
                type="number"
                name="paperWeight"
                value={formData.paperWeight}
                onChange={handleChange}
                className={`p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 `}
                placeholder="Enter paper weight"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Food Weight (kg)
              </label>
              <input
                type="number"
                name="foodWeight"
                value={formData.foodWeight}
                onChange={handleChange}
                className={`p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Enter food weight"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Polythene Weight (kg)
              </label>
              <input
                type="number"
                name="polytheneWeight"
                value={formData.polytheneWeight}
                onChange={handleChange}
                className={`p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 `}
                placeholder="Enter polythene weight"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Total Waste (kg)
              </label>
              <input
                type="number"
                name="totalWaste"
                value={formData.totalWaste}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Total waste"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Calculated Charge ($)
              </label>
              <input
                type="number"
                name="calculatedCharge"
                value={formData.calculatedCharge}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Calculated charge"
                readOnly
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="fixed bottom-0 w-full bg-white border-t py-4 flex justify-between items-center px-5">
        <Button Button1="Cancel" Button2="Record New" />
      </div>
    </div>
  );
};

export default RecycleForm;
