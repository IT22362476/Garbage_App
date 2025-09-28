import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Shared pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserTypeSelection from "./pages/UserRolePage";
import OAuthCallback from "./components/OAuthCallback";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Resident pages
import HomePage from "./Resident/HomePage";
import SchedulePickupPage from "./Resident/SchedulePickupPage";
import AddGarbageDetailsPage from "./Resident/AddGarbageDetailsPage";
import ConfirmationPage from "./Resident/ConfirmationPage";
import MyRequestsPage from "./Resident/MyRequestsPage";
import ProfileRes from "./Resident/ProfileRes";

// Collector pages
import CollectorHome from "./Collector/CollectorHome";
import TotalGarbage from "./Collector/TotalGarbage";
import Profile from "./Collector/Profile";

// WasteStop pages (recorder role)
import CollectedWasteDashboard from "./WasteStop/CollectedWasteDashboardy";
import CollectedWasteHome from "./WasteStop/CollectedWasteHome";
import CollectedWasteTable from "./WasteStop/CollectedWasteTable";
import RecycleForm from "./WasteStop/RecycleHandover";
import WasteCollectedUpdateForm from "./WasteStop/WasteCollectedUpdateForm";
import GarbageStationSummary from "./WasteStop/GarbageStationSummary";
import ViewRecycledDetails from "./WasteStop/viewRecycledDetails";

// Admin pages
import AdminHome from "./admin/AdminHome";
import RequestPage from "./admin/RequestPage";
import ManageVehicles from "./admin/ManageVehicles";
import ManageCollectors from "./admin/ManageCollectors";
import DataAnalytics from "./admin/DataAnalytics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UserTypeSelection />} />
            <Route path="/register2" element={<Register />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />

            {/* Authenticated (any user) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/logout" element={<Logout />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Resident-only routes */}
            <Route element={<ProtectedRoute requiredRole="resident" />}>
              <Route path="/residentHome" element={<HomePage />} />
              <Route path="/schedule-pickup" element={<SchedulePickupPage />} />
              <Route
                path="/add-garbage-details"
                element={<AddGarbageDetailsPage />}
              />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/myRequests" element={<MyRequestsPage />} />
              <Route path="/Profile" element={<ProfileRes />} />
            </Route>

            {/* Collector-only routes */}
            <Route element={<ProtectedRoute requiredRole="collector" />}>
              <Route
                path="/CollectorHome/:userID"
                element={<CollectorHome />}
              />
              <Route path="/TotalGarbage" element={<TotalGarbage />} />
              <Route path="/Profile/:userID" element={<Profile />} />
            </Route>

            {/* WasteStop (recorder role) */}
            <Route element={<ProtectedRoute requiredRole="recorder" />}>
              <Route
                path="/CollectedWasteDashboard"
                element={<CollectedWasteDashboard />}
              />
              <Route path="/collectedWaste" element={<CollectedWasteHome />} />
              <Route
                path="/viewCollectedWaste"
                element={<CollectedWasteTable />}
              />
              <Route path="/RecycleForm" element={<RecycleForm />} />
              <Route
                path="/update/:id"
                element={<WasteCollectedUpdateForm />}
              />
              <Route
                path="/GarbageStationSummary"
                element={<GarbageStationSummary />}
              />
              <Route
                path="/viewRecycledDetails"
                element={<ViewRecycledDetails />}
              />
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/adminHome" element={<AdminHome />} />
              <Route path="/requestPage" element={<RequestPage />} />
              <Route path="/manageVehicles" element={<ManageVehicles />} />
              <Route path="/manageCollectors" element={<ManageCollectors />} />
              <Route path="/dataAnalytics" element={<DataAnalytics />} />
            </Route>

            {/* Unauthorized + 404 */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
