import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported
import AdminNav from "./AdminNav";
import Modal from "./AdminModal"; // Import the modal component

function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // State for the selected request
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

  // Fetch requests from the API when the component mounts
  useEffect(() => {
    function getAllUserRequests() {
      axios
        .get("http://localhost:8070/schedulePickup/getAllPickups")
        .then((res) => {
          // Set all statuses to "Scheduled" initially
          const updatedRequests = res.data.map((request) => ({
            ...request,
            // status: "Scheduled",
          }));
          setRequests(updatedRequests); // Corrected state setter
        })
        .catch((err) => {
          alert(err.message);
        });
    }
    if (!isModalOpen) {
      getAllUserRequests(); // Fetch requests when the modal is closed
    }
  }, [isModalOpen]);

  // Function to handle the "View" button click
  const handleViewClick = (request) => {
    setSelectedRequest(request); // Set the selected request
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="flex h-screen">
      <AdminNav />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h1 className="text-xl font-semibold mb-4">Total Requests</h1>
            <p className="text-lg font-bold mb-4">{requests.length}</p>

            <div className="border-t border-gray-300 py-4">
              <h2 className="text-lg font-semibold mb-2">Request Details</h2>

              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 border-b">User ID</th>
                    <th className="text-left py-2 px-4 border-b">Time</th>
                    <th className="text-left py-2 px-4 border-b">Location</th>
                    <th className="text-left py-2 px-4 border-b">Date</th>
                    <th className="text-left py-2 px-4 border-b">Actions</th>
                    <th className="text-left py-2 px-4 border-b">
                      Request Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{request.userID}</td>
                      <td className="py-2 px-4 border-b">{request.time}</td>
                      <td className="py-2 px-4 border-b">{request.location}</td>
                      <td className="py-2 px-4 border-b">{request.date}</td>
                      <td
                        className={`py-2 px-4 border-b ${
                          request.status === "approved"
                            ? "text-green-500"
                            : request.status === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {request.status}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleViewClick(request)}
                          className="bg-green-500 text-white py-1 px-2 rounded mr-2"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing request details */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}

export default RequestPage;
