import React, { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService.js";

function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    brand: "",
    year: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const response = await getVehicles();
    setVehicles(response.data);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!newVehicle.name) newErrors.name = "Name is required";
    if (!newVehicle.brand) newErrors.brand = "Brand is required";
    if (
      !newVehicle.year ||
      isNaN(newVehicle.year) ||
      newVehicle.year.length !== 4
    )
      newErrors.year = "Valid year is required";
    if (!newVehicle.price || isNaN(newVehicle.price))
      newErrors.price = "Valid price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error when field changes
  };

  // const hardcodedVehicles = [
  //   { name: "Model S", brand: "Tesla", year: "2020", price: "79999" },
  //   { name: "Mustang", brand: "Ford", year: "2021", price: "55999" },
  //   { name: "Civic", brand: "Honda", year: "2019", price: "23999" },
  //   { name: "Camry", brand: "Toyota", year: "2022", price: "29999" },
  // ];

  const handleCreate = async () => {
    if (!validateFields()) return; // Prevent form submission if validation fails

    // for (const vehicle of hardcodedVehicles) {
    //   await createVehicle(vehicle);
    // }
    await createVehicle(newVehicle);
    setNewVehicle({ name: "", brand: "", year: "", price: "" });
    fetchVehicles();
  };

  const handleUpdate = async (id) => {
    await updateVehicle(id, editingVehicle);
    setEditingVehicle(null);
    fetchVehicles();
  };

  const handleDelete = async (id) => {
    await deleteVehicle(id);
    fetchVehicles();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 bg-white shadow-md rounded-lg m-4">
          <h1 className="text-3xl font-bold text-gray-700 mb-8">
            Vehicle Management
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Add Vehicle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <input
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name="name"
                  placeholder="Name"
                  value={newVehicle.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name="brand"
                  placeholder="Brand"
                  value={newVehicle.brand}
                  onChange={handleChange}
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm">{errors.brand}</p>
                )}
              </div>

              <div>
                <input
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name="year"
                  placeholder="Year"
                  value={newVehicle.year}
                  onChange={handleChange}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm">{errors.year}</p>
                )}
              </div>

              <div>
                <input
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name="price"
                  placeholder="Price"
                  value={newVehicle.price}
                  onChange={handleChange}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600"
              onClick={handleCreate}
            >
              Create Vehicle
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Vehicle List
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-md"
                >
                  {editingVehicle && editingVehicle._id === vehicle._id ? (
                    <div className="space-y-4">
                      <input
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        name="name"
                        value={editingVehicle.name}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            name: e.target.value,
                          })
                        }
                      />
                      <div className="flex space-x-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleUpdate(vehicle._id)}
                        >
                          Update
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                          onClick={() => setEditingVehicle(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {vehicle.name}
                        </h3>
                        <p className="text-sm text-gray-600">{vehicle.brand}</p>
                        <p className="text-sm text-gray-600">
                          {vehicle.isAvailable}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => setEditingVehicle(vehicle)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(vehicle._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageVehicles;

//ManageVehicles.js

// import React from "react";
// import AdminNav from "./AdminNav";

// function ManageVehicles() {

//   return (
//     <div className="flex">
//       <AdminNav />
//       <div className="flex-grow p-6">
//         <h1>Manage Vehicles</h1>
//       </div>
//     </div>
//   );
// }
//
// export default ManageVehicles;

// import React, { useState } from 'react';
// import axios from 'axios'; // For making API requests (assuming a backend API)

// const AddVehicleForm = () => {
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     name: '',
//     area: '',
//     owner: '',
//     year: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:8070/vehicle/addVehicle', formData); // Replace with your actual API endpoint
//       console.log(response.data); // Handle success response (optional)
//       alert('Vehicle added successfully!');
//       setFormData({
//         truckNo: '',
//         name: '',
//         area: '',
//         owner: '',
//         year: '',
//       });
//     } catch (error) {
//       console.error('Error adding vehicle:', error);
//       alert('Error adding vehicle. Please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-xl font-bold text-center mb-4">Add Vehicle</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid container */}
//         <div>
//           <label className="block mb-2 font-semibold">Truck Number:</label>
//           <input
//             name="truckNo"
//             value={formData.truckNo}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-semibold">Vehicle Name:</label>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-semibold">Area:</label>
//           <input
//             name="area"
//             value={formData.area}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-semibold">Owner Name:</label>
//           <input
//             name="owner"
//             value={formData.owner}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-semibold">Year:</label>
//           <input
//             name="year"
//             type="number" // Specify input type as number
//             value={formData.year}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//         </div>
//       </div>
//       <button
//         type="submit"
//         className="w-full p-2 mt-4 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
//       >
//         Add Vehicle
//       </button>
//     </form>
//   );
// };

// export default AddVehicleForm;
