import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { getVehicles } from "../services/vehicleService.js";
import { getCollectors } from "../services/collectorService.js";
import { addPickup, updateRequestStatus } from "../services/adminService.js";

function Modal({ isOpen, onClose, request }) {
  const [collectors, setCollectors] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loadingCollectors, setLoadingCollectors] = useState(true);
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [selectedCollector, setSelectedCollector] = useState("");
  const [selectedTruck, setSelectedTruck] = useState("");
  const [isApproved, setIsApproved] = useState("false");

  const assignCollector = async () => {
    try {
      const data = {
        userid: request.userID,
        collectorid: selectedCollector,
        date: request.date,
        time: request.time,
        location: request.location,
        truckid: selectedTruck,
      };

      // Send a request to allocate the collector
      const response = await addPickup(data); // Ensure addPickup is defined correctly in your service
      if (response) {
        message.success(`Allocated to collector: ${selectedCollector}`);
        updateRequestStatus(request._id, "approved");
        onClose(); // Close the modal after successful allocation
      }
    } catch (error) {
      message.error("Failed to allocate collector: " + error.message);
      console.error("Allocation error:", error);
    }
  };

  const fetchCollectors = async () => {
    setLoadingCollectors(true); // Start loading state
    try {
      const response = await getCollectors();
      setCollectors(response.data);
    } catch (error) {
      console.error("Error fetching collectors:", error);
    } finally {
      setLoadingCollectors(false); // End loading state
    }
  };

  const fetchVehicles = async () => {
    setLoadingTrucks(true); // Start loading state
    try {
      const response = await getVehicles();
      setTrucks(response.data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    } finally {
      setLoadingTrucks(false); // End loading state
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCollectors();
      fetchVehicles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-50 shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Request Details</h2>
        <p>
          <strong>User ID:</strong> {request.userID}
        </p>
        <p>
          <strong>Time:</strong> {request.time}
        </p>
        <p>
          <strong>Location:</strong> {request.location}
        </p>
        <p>
          <strong>Date:</strong> {request.date}
        </p>

        <div className="mt-4">
          <strong>Collectors:</strong>
          {loadingCollectors ? (
            <p>Loading collectors...</p>
          ) : (
            <select
              value={selectedCollector}
              onChange={(e) => setSelectedCollector(e.target.value)}
              className="border rounded p-2 mt-2 w-full"
            >
              <option value="" disabled>
                Select a collector
              </option>
              {collectors.map((collector) => (
                <option key={collector.id} value={collector.id}>
                  {collector.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-4">
          <strong>Truck:</strong>
          {loadingTrucks ? (
            <p>Loading trucks...</p>
          ) : (
            <select
              value={selectedTruck}
              onChange={(e) => {
                setSelectedTruck(e.target.value);
              }}
              className="border rounded p-2 mt-2 w-full"
            >
              <option value="" disabled>
                Select a truck
              </option>
              {trucks.map((truck) => (
                <option key={truck._id} value={truck.truckNo}>
                  {truck.truckNo} - {truck.area}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button onClick={onClose} className="bg-red-500 text-white">
            Close
          </Button>
          <Button
            onClick={assignCollector} // Call the function directly
            className="bg-green-500 text-white"
            disabled={
              loadingCollectors ||
              loadingTrucks ||
              !selectedCollector ||
              !selectedTruck ||
              request.status === "approved"
            } // Disable if loading or if selections are not made
          >
            Allocate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
