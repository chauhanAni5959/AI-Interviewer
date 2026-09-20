import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Step3report from "../components/interview/Step3report";
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

  return (
    <Step3report
      report={report}
      user={user}
      setUser={setUser}
      onBack={() => navigate("/dashboard")}
    />
  );
}

export default InterviewReport;
