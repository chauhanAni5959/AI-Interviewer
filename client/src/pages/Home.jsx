import React, { useState } from "react";
import { motion } from "framer-motion";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import LoginModel from "../components/LoginModel";

const Home = () => {
  // State to control modal visibility and exit animations
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white text-[#0A0A0A] font-sans min-h-screen overflow-hidden">
      {/* Navbar Section */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 h-13 flex items-center justify-between px-5 bg-white/70 backdrop-blur-xl border-b border-black/5"
      >
        {/* Left Section */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-[#0A0A0A] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
            <GiArtificialHive size={15} color="white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0A0A0A] cursor-pointer">
            AI Interviewer
          </span>
        </div>

        {/* Right Section */}
        <div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0A0A0A]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-md px-3 py-1.5 text-xs cursor-pointer transition-all hover:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex items-center gap-1.5"
          >
            <span>Log In</span>
            <FaArrowRight size={10} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Hero Section */}
      <section className="relative pt-20 pb-14 overflow-hidden bg-[#F8F9FA]">
        {/* Your landing page content goes here */}
      </section>

      {/* Login Modal with Exit Animations */}
      <LoginModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
