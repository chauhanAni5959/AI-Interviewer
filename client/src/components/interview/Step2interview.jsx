import React from "react";
import { FiArrowLeft, FiMic, FiVideo } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import maleAiVideo from "../../assets/male-ai.mp4";
import femaleAiVideo from "../../assets/female-ai.mp4";
import InterviewVoicePanel from "./InterviewVoicePanel";

function Step2interview({
  interviewData,
  user,
  answer = "",
  setAnswer = () => {},
  onSubmitAnswer = () => {},
  submitting = false,
  error = "",
  cameraError = "",
  mediaStatus = "granted",
  requestMediaPermissions = () => {},
  videoRef,
  onExit = () => {},
}) {
  const currentQuestion = interviewData?.questions?.[interviewData?.currentQuestion];
  const totalQuestions = interviewData?.questions?.length || 1;
  const currentQuestionNumber = Math.min(
    (interviewData?.currentQuestion ?? 0) + 1,
    totalQuestions,
  );
  const progress = Math.min((currentQuestionNumber / totalQuestions) * 100, 100);
  const demoVideoSource = user?.gender === "female" ? femaleAiVideo : maleAiVideo;

  const mediaLabel = {
    granted: "Camera & microphone enabled",
    requesting: "Requesting camera & microphone access...",
    denied: "Permission required",
    unsupported: "Media unsupported",
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 cursor-pointer"
          >
            <FiArrowLeft size={16} />
            Exit interview
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-600">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              {interviewData?.role || "Mock Interview"}
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 capitalize">
              {interviewData?.type || "technical"}
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              Q{currentQuestionNumber}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Live interview
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">
                  {interviewData?.role || "Mock Interview"}
                </h1>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-neutral-950 px-3 py-1.5 text-[11px] font-semibold text-white">
                <HiSparkles size={14} className="text-amber-300" />
                Session in progress
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
                <div className="mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    loop
                    src={mediaStatus === "granted" ? undefined : demoVideoSource}
                    className="h-56 w-full object-cover sm:h-72"
                  />

                  <div className="flex items-center justify-between border-t border-white/10 bg-neutral-900 px-3 py-2 text-[11px] text-neutral-300">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5">
                        <FiVideo size={12} />
                        Live camera
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FiMic size={12} />
                        Mic on
                      </span>
                    </div>

                    <span>{mediaLabel[mediaStatus] || mediaLabel.granted}</span>
                  </div>

                  {cameraError && (
                    <div className="border-t border-red-500/30 bg-red-950/60 px-3 py-2 text-xs text-red-200">
                      {cameraError}
                    </div>
                  )}
                </div>

                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Question {currentQuestionNumber} of {totalQuestions}
                  </p>
                  <p className="text-xs text-neutral-500">Suggested answer length: 2 mins</p>
                </div>

                <div className="mb-4 h-2 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-lg leading-8 text-neutral-900 sm:text-xl">
                  {currentQuestion?.question || "No question available yet."}
                </p>
              </div>

              <InterviewVoicePanel
                question={currentQuestion?.question}
                answer={answer}
                setAnswer={setAnswer}
                onSubmit={onSubmitAnswer}
                submitting={submitting}
              />

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <aside className="rounded-3xl bg-neutral-950 p-5 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                <HiSparkles size={16} className="text-amber-300" />
                Session overview
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Role</p>
                  <p className="mt-1 text-base font-bold">{interviewData?.role || "Mock Interview"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Interview type</p>
                  <p className="mt-1 text-base font-bold capitalize">
                    {interviewData?.type || "technical"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Progress</p>
                  <p className="mt-1 text-base font-bold">
                    {currentQuestionNumber} / {totalQuestions}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Interview status</p>
                  <p className="mt-1 text-base font-bold text-amber-300">
                    {mediaStatus === "denied" ? "Action required" : "Ready"}
                  </p>
                </div>
              </div>

              {mediaStatus === "denied" && (
                <button
                  type="button"
                  onClick={requestMediaPermissions}
                  className="mt-5 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Retry permissions
                </button>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2interview;
