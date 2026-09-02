import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";

const ResumeNavbar = memo(function ResumeNavbar({ 
  label = "Resume Builder", 
  onTogglePreview, 
  showPreview 
}) {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div 
          onClick={() => navigate("/dashboard")} 
          className="flex cursor-pointer items-center gap-2"
        >
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#0A0A0A]">
            AI Interviewer
          </span>
          <span className="hidden rounded bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/60 sm:block">
            {label}
          </span>
        </div>

        <button
          type="button"
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shadow-xs ${
            showPreview
              ? "bg-[#0A0A0A] text-white border-black"
              : "bg-white text-neutral-800 border-black/15 hover:bg-neutral-50"
          }`}
        >
          <FiEye size={14} />
          <span>{showPreview ? "Hide Preview" : "Live Preview"}</span>
        </button>
      </div>
    </motion.nav>
  );
});

export default ResumeNavbar;