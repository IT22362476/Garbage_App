import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./ResidentNavbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deletePickup,
  getPickupsByUser,
} from "../services/shedulePickupService";
import { useAuth } from "../contexts/AuthContext";

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userID = user?.id;

  // Fetch requests for the logged-in user
  useEffect(() => {
    if (!userID) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await getPickupsByUser(userID);
        const updatedRequests = res.data.map((request) => ({
          ...request,
          displayDate: new Date(request.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: request.status || "Scheduled",
        }));
        setRequests(updatedRequests);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userID]);

  const handleCancelRequest = async (id, currentStatus) => {
    if (!id) return toast.error("No valid ID found for deletion");
    if (currentStatus === "Canceled")
      return toast.info("Request already canceled");

    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await deletePickup(id);
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: "Canceled" } : req
          )
        );
        toast.success("Request canceled successfully");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to cancel request");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          My Scheduled Pickup Requests
        </h2>

        {loading ? (
          <p className="text-center text-lg">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-lg">No requests found.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg bg-white">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{request.displayDate}</td>
                    <td className="px-4 py-2">{request.time || "N/A"}</td>
                    <td className="px-4 py-2">{request.location || "N/A"}</td>
                    <td className="px-4 py-2">{request.status}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          handleCancelRequest(request._id, request.status)
                        }
                        disabled={request.status === "Canceled"}
                        className={`p-2 rounded ${
                          request.status === "Canceled"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        title={
                          request.status === "Canceled"
                            ? "Already canceled"
                            : "Cancel request"
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequestsPage;
