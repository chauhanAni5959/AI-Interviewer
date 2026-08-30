import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiFileText,
  FiMap,
  FiStar,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLayout,
} from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";

const navAgents = [
  
  {
    id: "resume-builder",
    name: "Resume Builder",
    icon: FiFileText,
    path: "/resume",
  },
  {
    id: "roadmap-builder",
    name: "Roadmap Builder",
    icon: FiMap,
    path: "/roadmap",
  },
  { id: "resume-scorer", name: "Resume Scorer", icon: FiStar, path: "/scorer" },
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
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name?.trim()) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const closeMobile = () => {
    if (mobileOpen) setMobileOpen?.(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50/90 backdrop-blur-md text-neutral-700 border-r border-neutral-200/80 select-none">
      {/* 1. Header / Logo */}
      <div className="flex items-center justify-between px-3.5 h-16 border-b border-neutral-200/70">
        <button
          type="button"
          onClick={() => {
            navigate("/dashboard");
            closeMobile();
          }}
          className="flex items-center gap-2.5 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg p-1 transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-neutral-900 to-neutral-700 flex items-center justify-center text-white shrink-0 shadow-sm ring-1 ring-black/5">
            <GiArtificialHive size={18} />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-sm tracking-tight text-neutral-900 whitespace-nowrap">
              AI Interviewer
            </span>
          )}
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen?.(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={sidebarOpen}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 cursor-pointer"
        >
          {sidebarOpen ? (
            <FiChevronLeft size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={closeMobile}
          aria-label="Close menu"
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* 2. Main Action: Create Interview */}
      <div className="p-3">
        <button
          type="button"
          onClick={() => {
            onNewInterview?.();
            closeMobile();
          }}
          aria-label="Create Interview"
          className={`w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-medium rounded-xl py-2 px-3 transition-all hover:bg-neutral-800 active:scale-[0.98] shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 ${
            !sidebarOpen ? "px-0" : ""
          }`}
          title={!sidebarOpen ? "Create Interview" : undefined}
        >
          <FiPlus size={16} className="shrink-0" />
          {sidebarOpen && (
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
              New Interview
            </span>
          )}
        </button>
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4 scrollbar-thin">
        <div>
          {sidebarOpen && (
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              Platform
            </p>
          )}
          <nav className="space-y-1">
            {navAgents.map((agent) => {
              const Icon = agent.icon;
              return (
                <NavLink
                  key={agent.id}
                  to={agent.path}
                  onClick={closeMobile}
                  title={!sidebarOpen ? agent.name : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      !sidebarOpen ? "justify-center px-0" : ""
                    } ${
                      isActive
                        ? "bg-white text-neutral-950 font-semibold shadow-xs border border-neutral-200/60"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/40"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={16}
                        className={`shrink-0 transition-transform group-hover:scale-105 ${
                          isActive ? "text-neutral-950" : "text-neutral-500"
                        }`}
                      />
                      {sidebarOpen && (
                        <span className="truncate">{agent.name}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Bottom Footer: Coins & Profile */}
      <div className="p-3 border-t border-neutral-200/70 space-y-2.5 bg-white/60">
        {/* Coins Badge */}
        {sidebarOpen ? (
          <div className="flex items-center justify-between bg-linear-to-r from-neutral-950 to-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 shadow-xs">
            <div className="flex items-center gap-2">
              <HiSparkles className="text-amber-400 text-sm shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  Credits
                </p>
                <p className="text-xs font-bold text-neutral-50 leading-tight">
                  {user?.interviewCoin ?? 0} Coins
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigate("/pricing");
                closeMobile();
              }}
              className="w-5 h-5 rounded-md bg-amber-400 hover:bg-amber-300 flex items-center justify-center text-neutral-950 text-xs font-bold transition-all active:scale-90 cursor-pointer"
              title="Add coins"
              aria-label="Add interview coins"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              navigate("/pricing");
              closeMobile();
            }}
            className="w-full flex items-center justify-center py-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title={`Coins: ${user?.interviewCoin ?? 0}`}
            aria-label="View coin balance"
          >
            <HiSparkles size={16} />
          </button>
        )}

        {/* User Card */}
        <div
          className={`flex items-center justify-between gap-2 pt-0.5 ${
            !sidebarOpen ? "justify-center" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => {
              navigate("/profile");
              closeMobile();
            }}
            className="flex items-center gap-2.5 min-w-0 text-left rounded-lg p-0.5 hover:bg-neutral-100 transition-colors flex-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold text-xs flex items-center justify-center shrink-0">
              {getInitials(user?.name)}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {user?.email || "No email provided"}
                </p>
              </div>
            )}
          </button>

          {/* Logout Action */}
          {sidebarOpen && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={closeMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
