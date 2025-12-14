import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./routes/LandingPage";
import TrainerPage from "./routes/TrainerPage";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import UserDashboardPlaceholder from "./pages/UserDashboardPlaceholder";
import TrainerDashboard from "./pages/TrainerDashboard"
import TrainerProfile from "./pages/TrainerProfile"
import ActivePlans from "./pages/ActivePlans"
import CreatePlanPage from "./pages/CreatePlanPage";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import Toast from "./components/Toast";
import { UIProvider } from "./context/UIContext";

export default function App() {
  return (
    <UIProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Trainer dashboard and sub-pages */}
        <Route path="/dashboard/user" element={<UserDashboardPlaceholder />} />
        <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
        <Route path="/dashboard/trainer/profile" element={<TrainerProfile />} />
        <Route path="/dashboard/trainer/plans" element={<ActivePlans />} />
        <Route path="/dashboard/trainer/create" element={<CreatePlanPage />} />
        <Route path="/trainers/:id" element={<TrainerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Modal />
      <Toast />
    </UIProvider>
  );
}
