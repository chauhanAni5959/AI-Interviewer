import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Dashboard = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");
      if (response.data.success) {
        setUser(null);
        localStorage.removeItem("ai_interviewer_user");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("Error in DashBoard: ", error);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#0A0A0A] font-sans-flex">
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
    </div>
  );
};

export default Dashboard;
