import React, { useState, useEffect } from "react";
import AdminNav from "./AdminNav";
import { getCollectors } from "../services/collectorService.js";
import {
  getResidentRequests,
  getApprovedPickups,
} from "../services/adminService.js";

function ManageCollectors() {
  const [collectors, setCollectors] = useState([]);
  const [residentRequests, setResidentRequests] = useState([]);
  const [approvedPickups, setApprovedPickups] = useState([]);

  useEffect(() => {
    fetchCollectors();
    fetchResidentRequests();
    fetchApprovedPickups();
  }, []);

  const fetchCollectors = async () => {
    const response = await getCollectors(); // Fetch users with role 'collector'
    setCollectors(response.data);
  };

  const fetchResidentRequests = async () => {
    const response = await getResidentRequests(); // Fetch resident requests
    setResidentRequests(response.data);
    console.log(response.data);
  };

  const fetchApprovedPickups = async () => {
    const response = await getApprovedPickups(); // Fetch approved pickups
    setApprovedPickups(response.data);
    console.log(response.data);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 bg-white shadow-md rounded-lg m-4">
        <h1 className="text-2xl font-bold mb-6">Manage Collectors</h1>

        {/* Collectors Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Collectors</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="w-full bg-gray-200">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {collectors.map((collector) => (
                <tr key={collector.id}>
                  <td className="py-2 px-4 border">{collector.id}</td>
                  <td className="py-2 px-4 border">{collector.name}</td>
                  <td className="py-2 px-4 border">{collector.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Approved Pickups Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Approved Pickups</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="w-full bg-gray-200">
                <th className="py-2 px-4 text-left">User ID</th>
                <th className="py-2 px-4 text-left">Collector ID</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {approvedPickups.map((pickup) => (
                <tr key={pickup.id}>
                  <td className="py-2 px-4 border">{pickup.userid}</td>
                  <td className="py-2 px-4 border">{pickup.collectorid}</td>
                  <td className="py-2 px-4 border">{pickup.date}</td>
                  <td className="py-2 px-4 border">{pickup.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ManageCollectors;
