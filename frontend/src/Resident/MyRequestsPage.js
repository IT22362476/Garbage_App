import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./ResidentNavbar";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  deletePickup,
  getPickupsByUser,
} from "../services/shedulePickupService";

function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [cookies] = useCookies(["userID"]);
  const userID = cookies.userID;

  // Fetch requests from the API when the component mounts
  useEffect(() => {
    if (userID) {
      async function getRequests() {
        // Fetch requests for the logged-in user
        await getPickupsByUser(userID)
          .then((res) => {
            console.log(res.data); // Log the response to check its structure
            const updatedRequests = res.data.map((request) => ({
              ...request,
              status: "Scheduled", // Assuming all are initially scheduled
              displayDate: new Date(request.date).toLocaleDateString(), // Format date for display
            }));
            setRequests(updatedRequests);
          })
          .catch((err) => {
            alert(err.message);
          });
      }
      getRequests();
    }
  }, [userID]);

  const handleCancelRequest = async (id) => {
    console.log("ID to be deleted:", id); // Check the value of id
    if (!id) {
      alert("No valid ID found for deletion.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this request?")) {
      await deletePickup(id)
        .then(() => {
          // Update the status in the local state to "Canceled"
          setRequests((requests) =>
            requests.map((request) =>
              request._id === id ? { ...request, status: "Canceled" } : request
            )
          );
          alert("Request canceled successfully");
        })
        .catch((error) => {
          alert("Error deleting request: " + error);
        });
    }
  };

  return (
    <div>
      <div className="flex">
        <Navbar />
        <div className="container bg-green-100 mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            My Scheduled Pickup Requests
          </h2>
          {requests.length === 0 ? (
            <p className="text-center text-lg">No requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto min-w-full border-collapse bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-t">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {request.displayDate}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {request.time || "N/A"}
                      </td>
                      <td className="px-4 py-2">{request.location || "N/A"}</td>
                      <td className="px-4 py-2">{request.status}</td>
                      <td className="px-4 py-2">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          onClick={() => handleCancelRequest(request._id)}
                          title="Delete"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRequestsPage;
