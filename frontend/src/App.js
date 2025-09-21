import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollectorHome from "./Collector/CollectorHome";
import TotalGarbage from "./Collector/TotalGarbage";
import React from "react";
import MyRequestsPage from "./Resident/MyRequestsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import HomePage from "./Resident/HomePage";
import SchedulePickupPage from "./Resident/SchedulePickupPage";
import AddGarbageDetailsPage from "./Resident/AddGarbageDetailsPage";
import ConfirmationPage from "./Resident/ConfirmationPage";
import CollectedWasteTable from "./WasteStop/CollectedWasteTable";
import CollectedWasteHome from "./WasteStop/CollectedWasteHome";
import RecycleForm from "./WasteStop/RecycleHandover";
import { ToastContainer } from "react-toastify"; // Importing ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importing Toast CSS
import WasteCollectedUpdateForm from "./WasteStop/WasteCollectedUpdateForm";
import CollectedWasteDashboard from "./WasteStop/CollectedWasteDashboardy";
import ViewRecycledDetails from "./WasteStop/viewRecycledDetails";
import NotFound from "./pages/NotFound";
import UserTypeSelection from "./pages/UserRolePage";
import Admin from "./admin/Admin";
import Logout from "./pages/Logout";
import Profile from "./Collector/Profile";
import AdminHome from "./admin/AdminHome";
import RequestPage from "./admin/RequestPage";
import ManageVehicles from "./admin/ManageVehicles";
import ManageCollectors from "./admin/ManageCollectors";
import DataAnalytics from "./admin/DataAnalytics";
import GarbageStationSummary from "./WasteStop/GarbageStationSummary";
import Home from "./pages/Home";
import ProfileRes from "./Resident/ProfileRes";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthCallback from "./components/OAuthCallback";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <ToastContainer /> {/* Add ToastContainer here */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserTypeSelection />} />
            <Route path="/register2" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route
              path="/residentHome"
              element={
                <ProtectedRoute requiredRole="resident">
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route path="/schedule-pickup" element={<SchedulePickupPage />} />
            <Route
              path="/add-garbage-details"
              element={<AddGarbageDetailsPage />}
            />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/MyRequestsPage" element={<MyRequestsPage />} />
            <Route path="/collectedWaste" element={<CollectedWasteHome />} />
            <Route
              path="/viewCollectedWaste"
              element={<CollectedWasteTable />}
            />
            <Route path="/RecycleForm" element={<RecycleForm />} />
            <Route path="/adminHome" element={<AdminHome />} />
            <Route path="/update/:id" element={<WasteCollectedUpdateForm />} />
            <Route
              path="/CollectedWasteDashboard"
              element={<CollectedWasteDashboard />}
            />
            <Route
              path="/viewRecycledDetails"
              element={<ViewRecycledDetails />}
            />
            <Route path="/dataAnalytics" element={<DataAnalytics />} />
            <Route path="/requestPage" element={<RequestPage />} />
            <Route path="/CollectorHome/:userID" element={<CollectorHome />} />
            <Route path="/TotalGarbage" element={<TotalGarbage />} />
            <Route path="/Logout" element={<Logout />} />

            <Route path="/Profile" element={<ProfileRes />} />

            <Route path="/CollectorHome/:userID" element={<CollectorHome />} />
            <Route path="/TotalGarbage" element={<TotalGarbage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/Profile/:userID" element={<Profile />} />

            <Route
              path="/CollectedWasteDashboard"
              element={<CollectedWasteDashboard />}
            />
            <Route
              path="/GarbageStationSummary"
              element={<GarbageStationSummary />}
            />
            <Route
              path="/viewRecycledDetails"
              element={<ViewRecycledDetails />}
            />

            <Route path="/requestPage" element={<RequestPage />} />
            <Route path="/manageVehicles" element={<ManageVehicles />} />
            <Route path="/manageCollectors" element={<ManageCollectors />} />

            <Route path="/admin" element={<Admin />} />
            {/* 404 Not Found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
