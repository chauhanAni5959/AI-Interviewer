import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiFileText } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import api from "../../utils/axios";

const interviewTypes = [
  {
    value: "technical",
    label: "Technical",
    description: "Coding, system design, and problem-solving questions.",
  },
  {
    value: "hr",
    label: "HR",
    description: "Behavioral and communication-focused interview rounds.",
  },
  {
    value: "managerial",
    label: "Managerial",
    description: "Leadership, decision-making, and stakeholder scenarios.",
  },
];

const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Analyst",
  "Software Engineer",
];

function Step1setup({ user, setUser }) {
  const navigate = useNavigate();
  const { resume } = useSelector((state) => state.resume);

  const [selectedType, setSelectedType] = useState("technical");
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [useResume, setUseResume] = useState(Boolean(resume));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fallbackRole =
      resume?.suggestedRole ||
      (Array.isArray(resume?.suggestedRoles) && resume.suggestedRoles[0]?.title) ||
      "Frontend Developer";

    setSelectedRole((prev) => {
      if (prev && typeof prev === "string" && prev.trim()) {
        return prev;
      }

      return fallbackRole;
    });

    setUseResume(Boolean(resume));
  }, [resume]);

  const handleStartInterview = async () => {
    const normalizedRole = typeof selectedRole === "string" ? selectedRole.trim() : "";

    if (!normalizedRole) {
      setError("Please choose a role for the interview.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/api/interview/start", {
        type: selectedType,
        role: normalizedRole,
        useResume: Boolean(resume) && useResume,
        resume: resume || {},
      });

      if (response?.data?.success && response.data.interviewId) {
        navigate(`/interview/${response.data.interviewId}`);
        return;
      }

      throw new Error(response?.data?.message || "Unable to start interview.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <FiArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-5 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              Interview setup
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
              Start your mock interview
            </h1>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-neutral-700">
                  Interview type
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  {interviewTypes.map((type) => {
                    const isSelected = selectedType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setSelectedType(type.value)}
                        className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{type.label}</span>
                          {isSelected && <FiCheckCircle size={16} />}
                        </div>
                        <p className={`mt-2 text-xs leading-5 ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="role" className="mb-2 block text-sm font-semibold text-neutral-700">
                  Target role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-900"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <label className="flex cursor-pointer items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Use my resume for context</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {resume
                        ? "Your saved resume will be used to tailor the interview questions."
                        : "Upload a resume in the Resume Builder to personalize the session."}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={useResume}
                    onChange={() => setUseResume((prev) => !prev)}
                    disabled={!resume}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-950 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleStartInterview}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Starting interview..." : "Start Interview"}
                {!loading && <FiArrowRight size={16} />}
              </button>
            </div>

            <aside className="rounded-3xl bg-neutral-950 p-5 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <HiSparkles size={16} className="text-amber-300" />
                Session overview
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Role</p>
                  <p className="mt-1 text-base font-bold">{selectedRole}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Type</p>
                  <p className="mt-1 text-base font-bold capitalize">{selectedType}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Resume context</p>
                  <p className="mt-1 flex items-center gap-2 text-base font-bold">
                    <FiFileText size={14} className="text-amber-300" />
                    {resume ? "Enabled" : "Not available"}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1setup;
