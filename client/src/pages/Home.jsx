import React, { useState } from "react";
import { motion } from "framer-motion";
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa6";
import LoginModel from "../components/LoginModel";
import dashboardImg from "../assets/image.png";
import { FiBarChart2, FiFileText, FiMap, FiMic } from "react-icons/fi";

const Home = ({ setUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agents = [
    {
      icon: <FiFileText size={20} />,
      title: "Resume Agent",
      desc: "Create ATS-friendly resumes, improve profile strength and maximize interview opportunities.",
    },
    {
      icon: <FiMic size={20} />,
      title: "Interview Agent",
      desc: "Conduct realistic HR, Technical and Coding interviews with AI-powered simulations.",
    },
    {
      icon: <FiBarChart2 size={20} />,
      title: "Feedback Agent",
      desc: "Get detailed answer analysis, scoring reports and actionable improvement recommendations.",
    },
    {
      icon: <FiMap size={20} />,
      title: "Roadmap Agent",
      desc: "Generate personalized learning roadmaps based on your goals, skills and performance.",
    },
  ];

  return (
    <div className="bg-white text-[#0A0A0A] font-sans min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-white/70 backdrop-blur-xl border-b border-black/5"
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-[#0A0A0A] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
            <GiArtificialHive size={15} color="white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#0A0A0A]">
            AI Interviewer
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0A0A0A]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-md px-3.5 py-1.5 text-xs cursor-pointer transition-all hover:border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex items-center gap-1.5"
        >
          <span>Log In</span>
          <FaArrowRight size={10} />
        </motion.button>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-[#F8F9FA] min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-black/5 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-black/10 bg-black/5 text-black/70 text-xs font-medium mb-5"
          >
            Multi-Agent Interview Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5 text-[#0A0A0A] [text-shadow:0_4px_24px_rgba(0,0,0,0.08)]"
          >
            Job Interviews
            <br />
            <span className="text-black/30">Don't Have to Suck </span>
            <br />
            Anymore!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="text-black/50 text-sm leading-relaxed max-w-md mx-auto mb-8"
          >
            AI Interviewer is an intelligent multi-agent platform designed to
            help job seekers excel in real-time technical interviews.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
          >
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 32px rgba(0,0,0,0.18)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="relative inline-flex items-center gap-2 overflow-hidden bg-[#0A0A0A] backdrop-blur-2xl text-white font-semibold px-6 py-3 rounded-xl text-xs cursor-pointer border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all hover:bg-black/90"
            >
              <span>Get started for free</span>
              <FaArrowRight size={11} />
              <span className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent pointer-events-none rounded-xl" />
            </motion.button>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-14 px-4 max-w-3xl w-full mx-auto relative z-10"
        >
          <div className="rounded-2xl overflow-hidden border border-black/10 shadow-[0_12px_44px_rgba(0,0,0,0.08)] bg-white">
            <img
              src={dashboardImg}
              alt="Dashboard Preview"
              className="w-full h-auto object-cover block"
            />
          </div>
        </motion.div>
      </section>

      {/* Agents Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-black/15 bg-black/5 text-black/70 text-xs font-medium mb-4">
              AI Powered Agents
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#0A0A0A] [text-shadow:0_4px_20px_rgba(0,0,0,0.1)]">
              Specialized Agents For
              <span className="block text-black/30">Every Interview Stage</span>
            </h2>

            <p className="text-black/40 text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
              AI Interviewer combines multiple specialized agents that work
              together to help you build your resume, practice interviews,
              receive detailed feedback, and follow a personalized roadmap to
              land your dream job.
            </p>
          </div>

          {/* Agent Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-white/25 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5 group-hover:bg-white/15 transition-colors">
                    {agent.icon}
                  </div>

                  <h3 className="font-bold text-[15px] mb-2.5 text-white tracking-tight">
                    {agent.title}
                  </h3>

                  <p className="text-white/60 text-[13px] leading-relaxed">
                    {agent.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setUser={setUser}
      />

      {/* Footer */}
      <footer className="border-t border-black/5 py-8 bg-white">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0A0A0A] flex items-center justify-center">
              <GiArtificialHive size={11} color="white" />
            </div>
            <span className="font-bold text-xs text-[#0A0A0A]/80">
              AI Interviewer
            </span>
          </div>
          <p className="text-black/40 text-xs">
            © {new Date().getFullYear()} AI Interviewer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;