import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/auth";

export default function TrainerDashboardPlaceholder() {
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== "trainer") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="section py-16">
      <h1 className="section-title">Welcome, Trainer!</h1>
      <p className="section-subtitle">This is your dashboard placeholder.</p>
      <div className="mt-6">
        <button className="btn-secondary" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
      </div>
    </div>
  );
}
