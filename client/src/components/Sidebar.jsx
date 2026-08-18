import React from "react";
import {
  FiPlus,
  FiFileText,
  FiMap,
  FiStar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";

const navAgents = [
  { id: "resume-builder", name: "Resume Builder", icon: FiFileText },
  { id: "roadmap-builder", name: "Roadmap Builder", icon: FiMap },
  { id: "resume-scorer", name: "Resume Scorer", icon: FiStar },
];

const Sidebar = ({
  user,
  onNewInterview,
  onLogout,
  sidebarOpen = true,
  setSidebarOpen,
  mobileOpen = false,
  setMobileOpen,
}) => {
  // Helper to extract user initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0D0D0D] text-neutral-200 border-r border-neutral-800 select-none">
      {/* 1. Header / Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-800/80">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shrink-0 shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
            <GiArtificialHive size={18} />
          </div>
          {sidebarOpen && (
            <span className="font-extrabold text-base tracking-tight text-white whitespace-nowrap cursor-pointer">
              AI Interviewer
            </span>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <FiChevronLeft size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen?.(false)}
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* 2. Main Action: Create Interview */}
      <div className="p-3">
        <button
          onClick={onNewInterview}
          className={`w-full flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl py-2.5 px-3 transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-md cursor-pointer${
            !sidebarOpen && "px-0"
          }`}
          title="Create Interview"
        >
          <FiPlus size={18} className="shrink-0 font-bold" />
          {sidebarOpen && (
            <span className="text-xs whitespace-nowrap">Create Interview</span>
          )}
        </button>
      </div>

      {/* 3. Navigation / Agents Section */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          {sidebarOpen && (
            <p className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
              Agents
            </p>
          )}
          <nav className="space-y-1">
            {navAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <button
                  key={agent.id}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors ${
                    !sidebarOpen ? "justify-center px-0" : ""
                  }`}
                  title={!sidebarOpen ? agent.name : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  {sidebarOpen && (
                    <span className="truncate">{agent.name}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Bottom Footer: Coins & Profile */}
      <div className="p-3 border-t border-neutral-800/80 space-y-3 bg-[#0A0A0A]">
        {/* Interview Coins Pill */}
        {sidebarOpen ? (
          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2">
              <HiSparkles className="text-amber-400 text-sm shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">
                  Interview Coins
                </p>
                <p className="text-xs font-bold text-white leading-tight">
                  {user?.interviewCoin ?? 0}
                </p>
              </div>
            </div>
            <button
              className="w-5 h-5 rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 text-xs transition-colors cursor-pointer"
              title="Add coins"
            >
              +
            </button>
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-2 text-amber-400 cursor-pointer"
            title={`Coins: ${user?.interviewCoin ?? 0}`}
          >
            <HiSparkles size={16} />
          </div>
        )}

        {/* User Profile / Logout */}
        <div
          className={`flex items-center justify-between gap-2 pt-1 ${!sidebarOpen && "justify-center"}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {user?.email || "No email"}
                </p>
              </div>
            )}
          </div>

          {/* Logout Action */}
          {sidebarOpen && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Log out"
            >
              <FiLogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 h-screen sticky top-0 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Backdrop + Sidebar) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
