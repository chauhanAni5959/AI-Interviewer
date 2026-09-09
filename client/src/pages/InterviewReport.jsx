import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiFileText } from "react-icons/fi";
import { spendCoins } from "../apis/user.api";
import api from "../utils/axios";

const DEDUCTION_KEY = "ai_interviewer_deducted_interviews";

function InterviewReport({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [report, setReport] = useState(location.state?.interview || null);
  const [loading, setLoading] = useState(!location.state?.interview);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      if (location.state?.interview) {
        setReport(location.state.interview);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.post(`/api/interview/${id}`);
        setReport(response?.data?.interview || null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Unable to load interview report.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadReport();
    }
  }, [id, location.state]);

  useEffect(() => {
    const deductCoins = async () => {
      if (!report || !id || report.status !== "completed") return;

      try {
        const storedDeducted = JSON.parse(localStorage.getItem(DEDUCTION_KEY) || "[]");

        if (storedDeducted.includes(id)) {
          return;
        }

        const result = await spendCoins({
          coins: 30,
          action: "interview-completion",
        });

        if (result?.success) {
          setUser((prev) => ({
            ...prev,
            interviewCoin: result.interviewCoin,
          }));

          localStorage.setItem(
            DEDUCTION_KEY,
            JSON.stringify([...storedDeducted, id]),
          );
        }
      } catch (err) {
        console.error("Failed to deduct interview coins:", err);
      }
    };

    deductCoins();
  }, [id, report, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] px-4 py-10 text-neutral-900">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-neutral-500">Loading interview report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] px-4 py-10 text-neutral-900">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-red-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-red-600">{error || "Interview report is unavailable."}</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
          >
            <FiArrowLeft size={16} />
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = report.overallscore || 0;

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <FiArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                Interview report
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight">{report.role}</h1>
            </div>

            <div className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white">
              Score: {score}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Summary</p>
              <p className="mt-3 text-sm leading-6 text-neutral-700">
                {report.summary || "No summary available yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Strengths</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {(report.strengths?.length ? report.strengths : ["Good communication", "Clear reasoning"]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FiCheckCircle size={14} className="mt-0.5 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Improvements</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {(report.weaknesses?.length ? report.weaknesses : ["Continue practicing time-boxed answers."]).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FiFileText size={14} className="mt-0.5 text-amber-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Recommendations</p>
            <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <ul className="space-y-2 text-sm text-neutral-700">
                {(report.recommendations?.length ? report.recommendations : ["Review system design fundamentals and keep answering mock questions."]).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Question review</p>

            {report.questions?.map((question, index) => (
              <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <p className="text-sm font-semibold text-neutral-900">
                  {index + 1}. {question.question}
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-800">Your answer:</span> {question.userAnswer || "No answer recorded."}
                </p>
                {question.feedback?.feedback && (
                  <p className="mt-2 text-sm text-neutral-600">
                    <span className="font-semibold text-neutral-800">Feedback:</span> {question.feedback.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewReport;
