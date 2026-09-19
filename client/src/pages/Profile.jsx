import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiArrowUpRight, FiAward, FiCalendar, FiCheckCircle, FiClock, FiLogOut, FiMail, FiMap, FiPlus, FiShield, FiTarget, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const response = await api.get("/api/interview");
        setInterviews(response.data?.interviews || []);
      } catch (error) {
        console.error("Unable to load profile interview stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem("ai_interviewer_user");
      navigate("/", { replace: true });
    }
  };

  const completed = interviews.filter((interview) => interview.status === "completed");
  const answeredQuestions = interviews.reduce(
    (total, interview) => total + (interview.questions || []).filter((question) => question.userAnswer?.trim()).length,
    0,
  );
  const averageScore = completed.length
    ? Math.round(completed.reduce((total, interview) => total + Number(interview.overallscore || 0), 0) / completed.length)
    : 0;
  const initials = (user?.name || "User")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const joinedDate = user?.createdAt
    ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(user.createdAt))
    : "Active member";
  const latestInterview = completed[0];

  const stats = [
    ["Interviews completed", completed.length, FiCheckCircle],
    ["Questions answered", answeredQuestions, FiTarget],
    ["Average performance", `${averageScore}/100`, FiAward],
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f7f7] text-neutral-950">
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.09),_transparent_28%),#f7f7f7]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10"
        >
          <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950">
            <FiArrowLeft /> Back to workspace
          </button>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
            <section className="rounded-3xl bg-neutral-950 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-300 text-2xl font-black text-neutral-950 shadow-[0_10px_24px_rgba(251,191,36,0.18)]">
                  {initials}
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-neutral-300">
                  <FiShield className="text-emerald-400" /> Account active
                </span>
              </div>
              <h1 className="mt-7 text-3xl font-black tracking-tight">{user?.name || "Your profile"}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-neutral-400"><FiMail /> {user?.email || "No email available"}</p>
              <div className="mt-8 border-t border-white/10 pt-5 text-xs text-neutral-400">
                <p className="flex items-center gap-2"><FiCalendar /> Member since {joinedDate}</p>
                <p className="mt-3 flex items-center gap-2"><FiClock /> {user?.interviewCoin ?? 0} interview coins available</p>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Your progress</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-neutral-950">A profile built from practice.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">Your activity and scores are calculated from saved interview sessions, so this space grows with every attempt.</p>
                </div>
                <FiTrendingUp className="hidden text-amber-500 sm:block" size={22} />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {stats.map(([label, value, Icon]) => (
                  <div key={label} className="rounded-2xl bg-neutral-50 p-4">
                    <Icon className="text-neutral-500" size={17} />
                    <p className="mt-4 text-2xl font-black text-neutral-950">{loading ? "..." : value}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Latest milestone</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight">Keep your momentum visible.</h2>
                </div>
                <FiAward className="text-amber-500" size={22} />
              </div>
              {latestInterview ? (
                <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Most recent report</p>
                      <h3 className="mt-2 text-lg font-bold">{latestInterview.role}</h3>
                      <p className="mt-1 text-xs capitalize text-neutral-400">{latestInterview.type} interview</p>
                    </div>
                    <span className="rounded-full bg-amber-300 px-3 py-1.5 text-xs font-black text-neutral-950">{latestInterview.overallscore ?? 0}/100</span>
                  </div>
                  <button type="button" onClick={() => navigate(`/interview/${latestInterview._id}/report`, { state: { interview: latestInterview } })} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-amber-300 transition hover:text-amber-200">Open saved report <FiArrowUpRight /></button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-500">Complete your first interview to create your first milestone.</div>
              )}
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Quick actions</p>
              <div className="mt-4 space-y-2">
                <button type="button" onClick={() => navigate("/interview")} className="flex w-full items-center justify-between rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"><span className="flex items-center gap-2"><FiPlus /> New interview</span><FiArrowUpRight /></button>
                <button type="button" onClick={() => navigate("/roadmap")} className="flex w-full items-center justify-between rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-bold text-neutral-800 transition hover:bg-neutral-50"><span className="flex items-center gap-2"><FiMap /> Open roadmap</span><FiArrowUpRight /></button>
                <button type="button" onClick={handleLogout} className="flex w-full items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"><span className="flex items-center gap-2"><FiLogOut /> Sign out</span><FiArrowUpRight /></button>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
