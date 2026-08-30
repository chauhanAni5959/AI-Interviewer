import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiPlus } from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";
import api from "../utils/axios";

const Dashboard = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white text-[#0A0A0A] font-sans antialiased overflow-hidden">
      {/* Responsive Sidebar (Handles Desktop Sticky + Mobile Slide-Over) */}
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Top Navigation Bar (Only visible on small viewports < 768px) */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[#EFEFEF] bg-white shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Open Sidebar"
            >
              <FiMenu size={20} />
            </button>

            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0">
                <GiArtificialHive size={15} />
              </div>
              <span className="font-bold text-sm tracking-tight text-black">
                AI Interviewer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Mobile Coin Pill */}
            <div
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-1.5 bg-[#141414] text-white px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <HiSparkles className="text-[#FBBF24] text-xs shrink-0" />
              <span>{user?.interviewCoin ?? 0}</span>
            </div>

            <button
              onClick={() => navigate("/interview")}
              className="p-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Create Interview"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 lg:py-10">
          <div className="max-w-6xl mx-auto w-full">
            {/* Overview Category Label */}
            <p className="text-xs sm:text-[13px] font-semibold text-[#8E8E93] tracking-normal mb-1">
              Overview
            </p>

            {/* User Greeting Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2">
              <span className="truncate">Hello, {firstName}</span>
              <span className="inline-block select-none animate-bounce">
                👋
              </span>
            </h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
