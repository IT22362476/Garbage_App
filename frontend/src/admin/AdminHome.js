import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import { FaTruck, FaUser, FaClipboardList } from "react-icons/fa";
import {
  getCollectorCount,
  getRequestCount,
} from "../services/collectorService";
import { getVehicleCount } from "../services/vehicleService";
import { getResidentRequests } from "../services/adminService.js";
import { Link } from "react-router-dom";

function AdminHome() {
  const [collectorCount, setCollectorCount] = useState([]);
  const [requestCount, setRequestCount] = useState([]);
  const [vehicleCount, setVehicleCount] = useState([]);
  const [residentRequests, setResidentRequests] = useState([]);

  useEffect(() => {
    fetchCollectorCount();
    fetchRequestCount();
    fetchVehicleCount();
    fetchResidentRequests();
  }, []);

  const fetchCollectorCount = async () => {
    const response = await getCollectorCount();
    setCollectorCount(response.data.count);
  };

  const fetchRequestCount = async () => {
    const response = await getRequestCount();
    setRequestCount(response.data.count);
  };

  const fetchVehicleCount = async () => {
    const response = await getVehicleCount();
    setVehicleCount(response.data.count);
  };

  const fetchResidentRequests = async () => {
    const response = await getResidentRequests(); // Fetch resident requests
    setResidentRequests(response.data);
  };

  const recentRequests = [
    { id: 1, requestType: "Pickup", status: "Pending" },
    { id: 2, requestType: "Recycle", status: "Approved" },
  ];

  return (
    <div className="flex h-screen">
      <AdminNav />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* Statistics Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Vehicle Count */}
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md text-center">
              <FaTruck className="text-5xl mx-auto" />
              <h2 className="text-2xl font-bold mt-2">Vehicles</h2>
              <p className="text-4xl mt-4">{vehicleCount}</p>
              <button className="mt-4 text-blue-900 bg-white py-1 px-3 rounded">
                <Link to="/manageVehicles">View Details</Link>
              </button>
            </div>

            {/* Collector Count */}
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md text-center">
              <FaUser className="text-5xl mx-auto" />
              <h2 className="text-2xl font-bold mt-2">Collectors</h2>
              <p className="text-4xl mt-4">{collectorCount}</p>
              <button className="mt-4 text-green-900 bg-white py-1 px-3 rounded">
                <Link to="/manageCollectors">Manage Collectors</Link>
              </button>
            </div>

            {/* Request Count */}
            <div className="bg-red-500 text-white p-6 rounded-lg shadow-md text-center">
              <FaClipboardList className="text-5xl mx-auto" />
              <h2 className="text-2xl font-bold mt-2">Requests</h2>
              <p className="text-4xl mt-4">{requestCount}</p>
              <button className="mt-4 text-red-900 bg-white py-1 px-3 rounded">
                <Link to="/requestPage">View Requests</Link>
              </button>
            </div>
          </div>

          {/* Recent Requests Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Requests</h2>
            <ul className="bg-gray-100 p-4 rounded-lg shadow-md">
              {recentRequests.map((request) => (
                <li
                  key={request.id}
                  className="flex justify-between p-2 border-b last:border-none"
                >
                  <span>{request.requestType}</span>
                  <span
                    className={`font-bold ${
                      request.status === "Pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {request.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resident Requests Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Resident Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {residentRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-4 shadow-md ${
                    request.status === "approved"
                      ? "bg-green-100"
                      : request.status === "Pending"
                      ? "bg-yellow-100"
                      : "bg-gray-50"
                  }`}
                >
                  <h3 className="font-semibold">
                    Request Status: {request.status}
                  </h3>
                  <p>User ID: {request.userID}</p>
                  <p>Date: {request.date}</p>
                  <p>Location: {request.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
