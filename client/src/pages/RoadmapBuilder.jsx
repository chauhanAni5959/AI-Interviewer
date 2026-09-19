import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiClock, FiMap, FiRefreshCw, FiTarget } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { generateRoadmap, getLatestRoadmap } from "../apis/roadmap.api";

const initialForm = {
  targetRole: "Frontend Developer",
  experienceLevel: "Intermediate",
  goal: "Become interview-ready and build stronger portfolio projects.",
  hoursPerWeek: 8,
  currentSkills: "",
};

const RoadmapBuilder = ({ user }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const response = await getLatestRoadmap();
        setRoadmap(response?.roadmap || null);
      } catch (loadError) {
        if (loadError.response?.status !== 404 && loadError.response?.status !== 503) {
          setError(loadError.response?.data?.message || "Unable to load your roadmap.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, []);

  const handleLogout = async () => {
    await api.get("/api/auth/logout");
    localStorage.removeItem("ai_interviewer_user");
    navigate("/", { replace: true });
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const buildInterviewSignals = (interviews) => {
    const completed = (interviews || []).filter((interview) => interview.status === "completed");
    const scores = completed.flatMap((interview) => (interview.questions || []).map((question) => question.feedback));
    const fields = ["correctness", "clarity", "relevance", "detail", "efficiency", "communication", "problemSolving", "creativity"];
    const averages = fields.map((field) => {
      const values = scores.map((feedback) => Number(feedback?.[field])).filter(Number.isFinite);
      if (!values.length) return null;
      return `${field}: ${Math.round(values.reduce((total, value) => total + value, 0) / values.length)}/100`;
    }).filter(Boolean);

    return averages.length ? averages.join(", ") : "No completed interview signals yet.";
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setGenerating(true);
    setError("");

    try {
      const interviewResponse = await api.get("/api/interview");
      const response = await generateRoadmap({
        ...form,
        hoursPerWeek: Number(form.hoursPerWeek),
        interviewSignals: buildInterviewSignals(interviewResponse.data?.interviews),
      });
      setRoadmap(response?.roadmap || null);
    } catch (generateError) {
      setError(generateError.response?.data?.message || generateError.message || "Unable to generate roadmap.");
    } finally {
      setGenerating(false);
    }
  };

  const roadmapData = roadmap?.roadmap;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f7f7] text-neutral-950">
      <Sidebar user={user} onNewInterview={() => navigate("/interview")} onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08),_transparent_28%),#f7f7f7]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
          <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"><FiArrowLeft /> Back to workspace</button>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
            <section className="h-fit rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Roadmap builder</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">Build your next learning path.</h1>
              <p className="mt-3 text-sm leading-6 text-neutral-500">Your roadmap uses your goals, available time, current skills, and recent interview feedback.</p>

              <form onSubmit={handleGenerate} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-neutral-700">Target role<select name="targetRole" value={form.targetRole} onChange={updateField} className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-neutral-950"><option>Frontend Developer</option><option>Backend Developer</option><option>Full Stack Developer</option><option>Product Manager</option><option>Data Analyst</option><option>Software Engineer</option></select></label>
                <label className="block text-sm font-semibold text-neutral-700">Experience level<select name="experienceLevel" value={form.experienceLevel} onChange={updateField} className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-neutral-950"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
                <label className="block text-sm font-semibold text-neutral-700">Weekly study hours<input name="hoursPerWeek" type="number" min="1" max="60" value={form.hoursPerWeek} onChange={updateField} className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-neutral-950" /></label>
                <label className="block text-sm font-semibold text-neutral-700">Main goal<textarea name="goal" value={form.goal} onChange={updateField} rows="3" className="mt-2 w-full resize-none rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-neutral-950" /></label>
                <label className="block text-sm font-semibold text-neutral-700">Current skills <span className="font-normal text-neutral-400">optional</span><textarea name="currentSkills" value={form.currentSkills} onChange={updateField} placeholder="React, JavaScript, SQL..." rows="2" className="mt-2 w-full resize-none rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-neutral-950" /></label>
                {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <button type="submit" disabled={generating} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60">{generating ? "Building your roadmap..." : roadmap ? "Regenerate roadmap" : "Generate roadmap"}<FiRefreshCw className={generating ? "animate-spin" : ""} /></button>
              </form>
            </section>

            <section className="min-w-0">
              {loading ? <div className="h-[600px] animate-pulse rounded-3xl bg-neutral-200" /> : roadmapData ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="rounded-3xl bg-neutral-950 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] sm:p-8">
                    <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-400">Personalized path</p><h2 className="mt-2 text-2xl font-black tracking-tight">{roadmapData.title}</h2></div><FiMap className="shrink-0 text-amber-300" size={24} /></div>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300">{roadmapData.overview}</p>
                    <div className="mt-5 flex flex-wrap gap-2"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold"><FiClock /> {roadmapData.duration}</span>{(roadmapData.focusAreas || []).map((area) => <span key={area} className="rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold text-neutral-950">{area}</span>)}</div>
                  </div>

                  {roadmapData.interviewFocus?.length > 0 && <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6"><div className="flex items-center gap-2 text-sm font-bold text-neutral-950"><FiTarget className="text-amber-600" /> Interview-driven focus</div><ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-700 sm:grid-cols-2">{roadmapData.interviewFocus.map((item) => <li key={item} className="flex gap-2"><FiCheckCircle className="mt-1 shrink-0 text-amber-600" />{item}</li>)}</ul></div>}

                  <div className="space-y-4">{(roadmapData.phases || []).map((phase, index) => <motion.article key={`${phase.title}-${index}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Phase {index + 1}</span><h3 className="mt-1 text-lg font-black text-neutral-950">{phase.title}</h3></div><span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-600">{phase.duration}</span></div><p className="mt-3 text-sm leading-6 text-neutral-600">{phase.outcome}</p><div className="mt-5 grid gap-5 md:grid-cols-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Skills</p><ul className="mt-2 space-y-1 text-sm text-neutral-700">{phase.skills?.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Projects</p><ul className="mt-2 space-y-1 text-sm text-neutral-700">{phase.projects?.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Resources</p><ul className="mt-2 space-y-1 text-sm text-neutral-700">{phase.resources?.map((item) => <li key={item}>• {item}</li>)}</ul></div></div><div className="mt-5 rounded-xl bg-neutral-950 px-3 py-2.5 text-xs font-semibold text-white"><span className="text-amber-300">Checkpoint:</span> {phase.checkpoint}</div></motion.article>)}</div>
                </motion.div>
              ) : <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-sm leading-6 text-neutral-500">Your generated roadmap will appear here. Fill in your goals and create your first learning path.</div>}
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RoadmapBuilder;
