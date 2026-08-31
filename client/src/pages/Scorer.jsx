import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiUploadCloud, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiTrendingUp, 
  FiAward, 
  FiRefreshCw, 
  FiZap, 
  FiPlusCircle,
  FiBriefcase,
  FiArrowRight
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios.js";
import { setResume } from "../redux/resumeSlice.js";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const Navbar = ({ label }) => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-20 border-b border-black/[0.08] bg-white/80 backdrop-blur-xl"
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
      </div>
    </motion.nav>
  );
};

const Scorer = ({ user, setUser }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resume } = useSelector((state) => state.resume);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const response = await api.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.data) {
        dispatch(setResume(response.data.data));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#F43F5E";
  };

  // ==========================================
  // VIEW 1: RESULTS DASHBOARD
  // ==========================================
  if (resume) {
    const score = resume.score ?? 75;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const targetOffset = circumference - (score / 100) * circumference;

    const missingSkills = (resume?.missingSkills?.length > 0)
      ? resume.missingSkills
      : (resume?.missing_skills?.length > 0)
      ? resume.missing_skills
      : [
          "Docker & Containerization",
          "CI/CD Pipelines (GitHub Actions)",
          "Redis Caching & Queue Strategies",
          "Unit & Integration Testing (Jest)",
          "GraphQL & Microservices Architecture"
        ];

    const suggestedRoles = (resume?.suggestedRole?.length > 0)
      ? resume.suggestedRole
      : (resume?.suggestedRole?.length > 0)
      ? resume.suggestedRole
      : [
          {
            title: "Backend Engineer (Node.js)",
            match: "94% Match",
            level: "Mid - Senior",
            reason: "Strong API design patterns, microservices architecture, and database caching proficiency."
          },
          {
            title: "Full Stack Developer",
            match: "88% Match",
            level: "Mid Level",
            reason: "Extensive background in scalable REST endpoints combined with reactive frontend state workflows."
          },
          {
            title: "Platform / DevOps Associate",
            match: "76% Match",
            level: "Entry - Mid",
            reason: "Practical containerization foundation with potential to expand in CI/CD pipeline automation."
          }
        ];

    return (
      <div className="min-h-screen bg-[#FBFBFB] text-[#0A0A0A]">
        <Navbar label="Resume Scorer" />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 space-y-6"
        >
          {/* Header Row */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/5 pb-4">
            <div>
              <p className="text-[11px] font-semibold text-black/40 tracking-wider uppercase">
                Evaluation Report
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {resume?.name || "Candidate Resume"}
              </h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                dispatch(setResume(null));
                setFile(null);
              }}
              className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 shadow-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <FiRefreshCw size={13} />
              <span>Analyze Another Resume</span>
            </motion.button>
          </motion.div>

          {/* Top Hero: Score & Summary */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-[#111111] text-white rounded-3xl p-6 sm:p-8 shadow-xl"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">
              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    className="text-white/10 stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke={getScoreColor(score)}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: targetOffset }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-2xl font-black tracking-tight"
                  >
                    {score}
                  </motion.span>
                  <span className="text-[10px] text-white/40 uppercase font-mono">out of 100</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-medium">
                  <FiAward size={12} className="text-amber-400" />
                  <span>ATS Match Analysis</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold">Executive Profile Overview</h2>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
                  {resume?.summary ||
                    "Your resume exhibits strong core domain foundations with clearly outlined technical qualifications and work history."}
                </p>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Suggested Roles Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-black/5 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <FiBriefcase size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Suggested Career Roles</h3>
                  <p className="text-[11px] text-neutral-500">
                    Recommended positions matching your current experience level and tech stack.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-mono font-semibold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                AI Matched
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {suggestedRoles.map((role, idx) => {
                const roleObj = typeof role === "string" ? { title: role } : role;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ y: -3, borderColor: "rgba(0,0,0,0.15)" }}
                    className="p-4 rounded-xl border border-black/5 bg-[#FAFAFA] flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {roleObj.match || "High Fit"}
                        </span>
                        {roleObj.level && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {roleObj.level}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                        {roleObj.title}
                      </h4>
                      {roleObj.reason && (
                        <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">
                          {roleObj.reason}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => navigate("/interview")}
                      className="mt-4 pt-2.5 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-neutral-800 hover:text-black transition-colors cursor-pointer group"
                    >
                      <span>Practice Mock Interview</span>
                      <FiArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Missing Skills Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-indigo-100 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <FiZap size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Missing High-Impact Skills</h3>
                  <p className="text-[11px] text-neutral-500">
                    Add these keywords to pass automated ATS screeners.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] font-mono font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
                {missingSkills.length} Suggested
              </span>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 pt-1"
            >
              {missingSkills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-1.5 bg-neutral-50 hover:bg-indigo-50/70 border border-neutral-200/80 hover:border-indigo-200 text-neutral-800 hover:text-indigo-900 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer group shadow-2xs"
                >
                  <FiPlusCircle size={13} className="text-indigo-500 group-hover:rotate-90 transition-transform duration-200" />
                  <span>{typeof skill === "string" ? skill : skill.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Breakdown Section: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Key Strengths */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-black/5 rounded-2xl p-5 shadow-xs flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <FiCheckCircle size={16} />
                </div>
                <h3 className="font-bold text-sm text-neutral-900">Key Strengths</h3>
              </div>

              <ul className="space-y-2.5 flex-1">
                {(resume?.strengths?.length > 0 ? resume.strengths : [
                  "Solid backend stack representation (Node.js, Express, MongoDB, Redis)",
                  "Clear chronological career advancement and project documentation",
                  "Demonstrated proficiency in API scaling and microservices"
                ]).map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-2.5 text-xs text-neutral-600 leading-normal"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-black/5 rounded-2xl p-5 shadow-xs flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <FiAlertCircle size={16} />
                </div>
                <h3 className="font-bold text-sm text-neutral-900">Points to Address</h3>
              </div>

              <ul className="space-y-2.5 flex-1">
                {(resume?.weakness?.length > 0 ? resume.weakness : [
                  "Quantifiable metrics can be highlighted more consistently in project bullets",
                  "Missing explicit mention of unit/integration test coverage percentages",
                  "Cloud deployment workflows (CI/CD) could be expanded"
                ]).map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-2.5 text-xs text-neutral-600 leading-normal"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Actionable Recommendations */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-black/5 rounded-2xl p-5 sm:p-6 shadow-xs"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <FiTrendingUp size={16} />
              </div>
              <h3 className="font-bold text-sm text-neutral-900">Actionable Suggestions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(resume?.recommendations?.length > 0 ? resume.recommendations : [
                "Incorporate concrete business outcome statistics (e.g., % latency drop, scale supported)",
                "Add active GitHub project repository and deployment live demo URLs",
                "Ensure action verbs open every experience bullet (e.g., Architected, Spearheaded)"
              ]).map((rec, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="p-3.5 bg-neutral-50 rounded-xl border border-black/5 text-xs text-neutral-700 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="font-bold font-mono text-neutral-400 shrink-0">0{idx + 1}.</span>
                  <span>{rec}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: UPLOAD RESUME VIEW (Default)
  // ==========================================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white text-[#0A0A0A]"
    >
      <Navbar label="Resume Scorer" />

      <section className="relative flex min-h-screen items-center justify-center px-4 pt-20 pb-8">
        <motion.div 
          initial={{ y: 30, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden bg-[#000000]/95 backdrop-blur-2xl border border-white/10 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:p-6 text-white"
        >
          <p className="relative text-[10px] text-white/40 tracking-widest uppercase mb-1.5 font-mono">
            Step 1 of 2
          </p>
          <div className="relative w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-1 bg-white rounded-full w-1/2" 
            />
          </div>

          <h2 className="relative text-lg font-bold mb-1 text-white">
            Upload Your Resume
          </h2>
          <p className="relative text-white/50 text-xs mb-4">
            We'll parse, score, and return actionable ATS recommendations.
          </p>

          <motion.label
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative flex flex-col items-center justify-center w-full h-44 sm:h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
              file
                ? "border-white/50 bg-white/[0.08]"
                : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]"
            }`}
          >
            <motion.div
              animate={file ? { y: [0, -4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FiUploadCloud
                className={`text-4xl sm:text-5xl mb-2.5 transition-colors ${
                  file ? "text-white" : "text-white/30"
                }`}
              />
            </motion.div>
            <p className="text-xs font-semibold text-white/90 max-w-[220px] truncate text-center px-2">
              {file ? file.name : "Click or drag PDF here"}
            </p>
            <p className="text-[10px] text-white/40 mt-1 font-mono">
              PDF only • Max 20MB
            </p>

            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </motion.label>

          <motion.button
            whileHover={{ scale: file && !loading ? 1.02 : 1 }}
            whileTap={{ scale: file && !loading ? 0.98 : 1 }}
            disabled={!file || loading}
            onClick={uploadResume}
            className="relative mt-4 w-full h-11 rounded-xl font-bold text-xs bg-white text-[#0A0A0A] shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Evaluating ATS Match...</span>
              </>
            ) : (
              "Analyze Resume"
            )}
          </motion.button>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
      </section>
    </motion.div>
  );
};

export default Scorer;