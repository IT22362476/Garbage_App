import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminNav from "./AdminNav";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicleService";

function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    truckNo: "",
    name: "",
    area: "",
    owner: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await getVehicles();
      if (response && Array.isArray(response.data)) {
        setVehicles(response.data);
        setApiError("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      const errorMsg = err.response?.data?.message || err.message;
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Validate fields, optionally set error state
  const validateFields = (vehicle, setErrorState) => {
    const newErrors = {};
    if (!vehicle.truckNo) newErrors.truckNo = "Truck number is required";
    if (!vehicle.name) newErrors.name = "Name is required";
    if (!vehicle.area) newErrors.area = "Area is required";
    if (!vehicle.owner) newErrors.owner = "Owner is required";
    if (!vehicle.year || isNaN(vehicle.year))
      newErrors.year = "Valid year is required";
    if (setErrorState) setErrorState(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingVehicle({ ...editingVehicle, [name]: value });
    setEditErrors({ ...editErrors, [name]: "" });
  };

  const handleCreate = async () => {
    if (!validateFields(newVehicle, setErrors)) return;

    try {
      await createVehicle({ ...newVehicle, year: Number(newVehicle.year) });
      setNewVehicle({ truckNo: "", name: "", area: "", owner: "", year: "" });
      setErrors({});
      fetchVehicles();
      toast.success("Vehicle created successfully!");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Failed to create vehicle";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleUpdate = async (id) => {
    if (!validateFields(editingVehicle, setEditErrors)) return;

    try {
      await updateVehicle(id, {
        ...editingVehicle,
        year: Number(editingVehicle.year),
      });
      setEditingVehicle(null);
      setEditErrors({});
      fetchVehicles();
      toast.success("Vehicle updated successfully!");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Failed to update vehicle";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVehicle(id);
      fetchVehicles();
      toast.success("Vehicle deleted successfully!");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Failed to delete vehicle";
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Vehicle Management</h1>

        {apiError && <p className="text-red-600 mb-4">{apiError}</p>}

        {/* Create Vehicle Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {["truckNo", "name", "area", "owner", "year"].map((field) => (
              <div key={field}>
                <input
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newVehicle[field]}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleCreate}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Create Vehicle
          </button>
        </div>

        {/* Vehicles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
            >
              {editingVehicle?._id === vehicle._id ? (
                <div className="space-y-3">
                  {["truckNo", "name", "area", "owner", "year"].map((field) => (
                    <div key={field}>
                      <input
                        name={field}
                        value={editingVehicle[field]}
                        onChange={handleEditChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {editErrors[field] && (
                        <p className="text-red-500 text-sm">
                          {editErrors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleUpdate(vehicle._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setEditingVehicle(null);
                        setEditErrors({});
                      }}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">
                      Truck: {vehicle.truckNo}
                    </p>
                    <p className="text-sm text-gray-600">
                      Owner: {vehicle.owner}
                    </p>
                    <p className="text-sm text-gray-600">
                      Area: {vehicle.area}
                    </p>
                    <p className="text-sm text-gray-600">
                      Year: {vehicle.year}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => {
                        setEditingVehicle({ ...vehicle });
                        setEditErrors({});
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageVehicles;
