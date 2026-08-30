import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";
import api from "../utils/axios.js";

const Navbar = ({ label }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-start px-3 sm:px-5">
        <div onClick={() => navigate("/dashboard")}>
          <div className="flex cursor-pointer items-center gap-1.5">
            {/* <span>I am</span> */}
            <span className="text-sm font-extrabold sm:text-base text-[#0A0A0A]">
              AI Interviewer
            </span>
            <span className="hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block">
              {label}
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const Scorer = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // API Calling for Resume Service
  const uploadResume = async () => {
    // check if resume file is there or not
    if (!file) {
      alert("Please select a PDF");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      const response = await api.post("/api/resume/upload", formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      alert("Upload failed!");
      setLoading(false);
    }
  };
  // Upload section
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="min-h-screen bg-white text-[#0A0A0A]"
    >
      <Navbar label="Resume Scorer" />

      <section className="relative flex min-h-screen items-center justify-center px-3 pt-18 pb-6">
        <motion.div className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden bg-[#000000]/90 backdrop-blur-2xl border border-white/10 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:p-6 text-white">
          <p className="relative text-[10px] text-white/40 tracking-widest uppercase mb-1.5">
            step 1 to 2{" "}
          </p>
          <div className="relative w-full h-1 bg-white/10 rounded-full mb-4">
            <div className="h-1 bg-white rounded-full w-1/2 " />
          </div>

          <h2 className="relative text-lg font-bold mb-1 text-white">
            {" "}
            Upload Your Resume
          </h2>
          <p className="relative text-white/45 text-xs mb-4">
            we'll score it and give you actionable feedback
          </p>
          <label
            className={`relative flex flex-col items-center justify-center w-full
            h-40 sm:h-48 rounded-2xl border-2 border-dashed cursor-pointer
            transition-colors
            ${
              file
                ? "border-white/40 bg-white/6"
                : "border-white/15 bg-white/3 hover:border-white/30"
            }`}
          >
            <FiUploadCloud
              className={`text-4xl sm:text-5xl mb-2.5 ${file ? "text-white" : "text-white/30"}`}
            />
            <p className="text-xs font-medium text-white/80">
              {file ? file.name : "Click or drag PDF here"}
            </p>
            <p className="text-[10px] text-white/35 mt-1 ">
              {" "}
              PDF only .Max 20mb
            </p>
            <input
              type="file"
              accept="pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            disabled={!file || loading}
            onClick={uploadResume}
            className="relative mt-4 w-full h-10 rounded-xl font-semibold text-xs bg-white
           text-[#0A0A0A] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90 disabled:opacity-40
           disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? "Analyzing..." : "Analzye Resume"}
            
          </motion.button>
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
      </section>
    </motion.div>
  );
};

export default Scorer;
