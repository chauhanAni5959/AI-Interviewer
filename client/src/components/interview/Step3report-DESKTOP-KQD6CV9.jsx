import { FiArrowLeft, FiCheckCircle, FiFileText, FiTrendingUp } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

function Step3report({ report, onBack = () => {} }) {
  const savedScore = report?.overallscore ?? report?.overallScore;
  const questionScores = (report?.questions || [])
    .map((question) => Number(question.feedback?.score))
    .filter((value) => Number.isFinite(value) && value >= 0 && value <= 100);
  const calculatedScore = questionScores.length
    ? Math.round(questionScores.reduce((total, value) => total + value, 0) / questionScores.length)
    : 0;
  const score = Number.isFinite(Number(savedScore)) && Number(savedScore) > 0
    ? Number(savedScore)
    : calculatedScore;
  const strengths = report?.strengths?.length ? report.strengths : ["Good communication", "Clear reasoning"];
  const weaknesses = report?.weaknesses?.length ? report.weaknesses : ["Continue practicing time-boxed answers."];
  const recommendations = report?.recommendations?.length
    ? report.recommendations
    : ["Review system design fundamentals and keep answering mock questions."];

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 cursor-pointer"
          >
            <FiArrowLeft size={16} />
            Back to dashboard
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-600">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              {report?.role || "Mock Interview"}
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 capitalize">
              {report?.type || "technical"}
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Interview report
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
                  {report?.role || "Mock Interview"}
                </h1>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1.5 text-[11px] font-semibold text-white">
                <HiSparkles size={14} className="text-amber-300" />
                Score: {score}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl bg-neutral-950 p-5 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <FiTrendingUp size={16} className="text-amber-300" />
                  Overall performance
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-4xl font-black tracking-tight">{score}</div>
                    <div className="text-xs text-neutral-400">/ 100</div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-300 transition-all duration-300"
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Type</p>
                    <p className="mt-1 text-base font-bold capitalize">{report?.type || "technical"}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Questions</p>
                    <p className="mt-1 text-base font-bold">{report?.questions?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Summary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">
                    {report?.summary || "No summary available yet."}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Strengths
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                      {strengths.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FiCheckCircle size={14} className="mt-0.5 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Improvements
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                      {weaknesses.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FiFileText size={14} className="mt-0.5 text-amber-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                Recommendations
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                {recommendations.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                Question review
              </p>

              {(report?.questions || []).map((question, index) => (
                <div key={index} className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-semibold text-neutral-900">
                      {index + 1}. {question.question}
                    </p>
                    <span className="shrink-0 rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
                      Score: {Number.isFinite(Number(question.feedback?.score))
                        ? Number(question.feedback.score)
                        : 0}/100
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Your answer
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {question.userAnswer || question.answer || "No answer recorded."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                        Feedback
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {question.feedback?.feedback || question.feedback || "No feedback available."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3report;
