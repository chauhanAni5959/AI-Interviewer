import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiClock, FiMenu, FiPlus, FiTrendingUp } from "react-icons/fi";
import { GiArtificialHive } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";
import api from "../utils/axios";

const Dashboard = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const [interviewsError, setInterviewsError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecentInterviews = async () => {
      try {
        const response = await api.get("/api/interview");
        setRecentInterviews(response.data?.interviews || []);
      } catch (error) {
        setInterviewsError(error.response?.data?.message || "Unable to load recent interviews.");
      } finally {
        setInterviewsLoading(false);
      }
    };

    loadRecentInterviews();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.get("/api/auth/logout");
      if (response.data.success) {
        setUser(null);
        localStorage.removeItem("ai_interviewer_user");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("Error in DashBoard: ", error);
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  const skillFields = [
    ["Correctness", "correctness"],
    ["Clarity", "clarity"],
    ["Relevance", "relevance"],
    ["Detail", "detail"],
    ["Efficiency", "efficiency"],
    ["Communication", "communication"],
    ["Problem solving", "problemSolving"],
    ["Creativity", "creativity"],
  ];

  const completedInterviews = recentInterviews.filter((interview) => interview.status === "completed");
  const questionsSolved = recentInterviews.reduce(
    (total, interview) => total + (interview.questions || []).filter((question) => question.userAnswer?.trim()).length,
    0,
  );
  const averageScore = completedInterviews.length
    ? Math.round(completedInterviews.reduce((total, interview) => total + Number(interview.overallscore || 0), 0) / completedInterviews.length)
    : 0;

  const formatDate = (date) => new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));

  const getRadarPoints = (scores, radius, center) => scores.map((score, index) => {
    const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
    const distance = (score / 100) * radius;
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
  }).join(" ");

  const getTypeScores = (type) => skillFields.map(([, field]) => {
    const scores = completedInterviews
      .filter((interview) => interview.type === type)
      .flatMap((interview) => interview.questions || [])
      .map((question) => Number(question.feedback?.[field]))
      .filter((score) => Number.isFinite(score));

    return scores.length
      ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
      : 0;
  });

  const radarLabels = ["Correctness", "Clarity", "Relevance", "Detail", "Efficiency", "Communication", "Problem solving", "Creativity"];
  const radarCards = ["technical", "hr", "managerial"].map((type) => ({
    type,
    scores: getTypeScores(type),
    count: completedInterviews.filter((interview) => interview.type === type).length,
  })).filter((item) => item.count > 0);

  const RadarCard = ({ type, scores, count }) => {
    const center = 112;
    const radius = 62;
    const rings = [25, 50, 75, 100];
    const ringPoints = (level) => getRadarPoints(scores.map(() => level), radius, center);

    return (
      <div className="min-w-0 rounded-[22px] bg-[linear-gradient(145deg,#242424,#151515)] p-4 text-white shadow-[0_16px_30px_rgba(15,23,42,0.12)] sm:p-5">
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 224 224" className="h-52 w-full max-w-[250px]" role="img" aria-label={`${type} interview skill profile`}>
            {rings.map((level) => (
              <polygon key={level} points={ringPoints(level)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            ))}
            {scores.map((_, index) => {
              const angle = (Math.PI * 2 * index) / scores.length - Math.PI / 2;
              return <line key={radarLabels[index]} x1={center} y1={center} x2={center + Math.cos(angle) * radius} y2={center + Math.sin(angle) * radius} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
            })}
            <polygon points={getRadarPoints(scores, radius, center)} fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
            {radarLabels.map((label, index) => {
              const angle = (Math.PI * 2 * index) / radarLabels.length - Math.PI / 2;
              const labelRadius = radius + 17;
              return <text key={label} x={center + Math.cos(angle) * labelRadius} y={center + Math.sin(angle) * labelRadius} fill="rgba(255,255,255,0.55)" fontSize="7" textAnchor="middle" dominantBaseline="middle">{label}</text>;
            })}
          </svg>
        </div>
        <div className="mt-1 text-center text-sm font-bold capitalize">{type} Interviews ({count})</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-white text-[#0A0A0A] font-sans antialiased overflow-hidden">
      {/* Responsive Sidebar (Handles Desktop Sticky + Mobile Slide-Over) */}
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Top Navigation Bar (Only visible on small viewports < 768px) */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[#EFEFEF] bg-white shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Open Sidebar"
            >
              <FiMenu size={20} />
            </button>

            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white shrink-0">
                <GiArtificialHive size={15} />
              </div>
              <span className="font-bold text-sm tracking-tight text-black">
                AI Interviewer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Mobile Coin Pill */}
            <div
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-1.5 bg-[#141414] text-white px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <HiSparkles className="text-[#FBBF24] text-xs shrink-0" />
              <span>{user?.interviewCoin ?? 0}</span>
            </div>

            <button
              onClick={() => navigate("/interview")}
              className="p-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Create Interview"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f7f7f7] px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <div className="max-w-6xl mx-auto w-full">
            {/* Overview Category Label */}
            <p className="text-xs sm:text-[13px] font-semibold text-[#8E8E93] tracking-normal mb-1">
              Overview
            </p>

            {/* User Greeting Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2">
              <span className="truncate">Hello, {firstName}</span>
              <span className="inline-block select-none animate-bounce">
                👋
              </span>
            </h1>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Total interviews", recentInterviews.length, "All time", "Interviews created"],
                ["Questions solved", questionsSolved, "Answered", `Across ${recentInterviews.length} interviews`],
                ["Completed", completedInterviews.length, `${recentInterviews.length} total`, "Interviews finished"],
                ["Average score", `${averageScore}/100`, "Completed only", "Average performance"],
              ].map(([label, value, badge, detail]) => (
                <div key={label} className="rounded-2xl bg-[linear-gradient(145deg,#242424,#151515)] p-5 text-white shadow-[0_14px_30px_rgba(15,23,42,0.14)]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-400">{label}</p>
                  <p className="mt-3 text-3xl font-black tracking-tight">{interviewsLoading ? "..." : value}</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                    <span className="rounded-md bg-white/10 px-2 py-1 font-bold text-neutral-300">{badge}</span>
                    <span>{detail}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Performance</p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-950">Interview history</h2>
              </div>
              <button type="button" onClick={() => navigate("/interview")} className="hidden items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 sm:inline-flex">
                New interview <FiArrowUpRight />
              </button>
            </div>

            {interviewsLoading ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="h-[300px] animate-pulse rounded-[22px] bg-neutral-200" /><div className="h-[300px] animate-pulse rounded-[22px] bg-neutral-200" /></div>
            ) : radarCards.length > 0 ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-2">{radarCards.map((card) => <RadarCard key={card.type} {...card} />)}</div>
            ) : (
              <div className="mt-5 rounded-[22px] border border-dashed border-neutral-300 bg-white p-8 text-sm text-neutral-500">Complete an interview to see your performance profile.</div>
            )}

            <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">Saved reports</p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-950">Recent interview history</h2>
                </div>
                <FiClock className="text-neutral-400" />
              </div>

              {interviewsError ? (
                <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{interviewsError}</p>
              ) : recentInterviews.length > 0 ? (
                <div className="mt-5 divide-y divide-neutral-100">
                  {completedInterviews.slice(0, 5).map((interview) => (
                    <button key={interview._id} type="button" onClick={() => navigate(`/interview/${interview._id}/report`, { state: { interview } })} className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors first:pt-0 last:pb-0 hover:bg-neutral-50">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-neutral-950">{interview.role}</span>
                        <span className="mt-1 block text-xs capitalize text-neutral-500">{interview.type} interview · {formatDate(interview.createdAt)}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-bold text-white">{interview.overallscore ?? 0}/100</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-neutral-500">Your saved reports will appear here after an interview.</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
