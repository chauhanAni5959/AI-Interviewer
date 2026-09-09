import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiSend } from "react-icons/fi";
import api from "../utils/axios";

function InterviewPage({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [mediaStatus, setMediaStatus] = useState("checking");

  const fetchInterview = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post(`/api/interview/${id}`);
      const interviewData = response?.data?.interview;

      if (!interviewData) {
        throw new Error("Interview data not found.");
      }

      setInterview(interviewData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load interview.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInterview();
    }
  }, [id]);

  const requestMediaPermissions = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaStatus("unsupported");
      setCameraError(
        "This browser does not support camera and microphone access. Please use a modern browser.",
      );
      return;
    }

    try {
      setMediaStatus("requesting");
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setMediaStatus("granted");
      setCameraError("");

      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (fullscreenErr) {
        console.warn("Fullscreen request failed:", fullscreenErr);
      }
    } catch (cameraErr) {
      setMediaStatus("denied");
      setCameraError(
        "Camera and microphone permission is required for the interview. Please allow access and try again.",
      );
    }
  };

  useEffect(() => {
    if (!interview || !id) return;

    requestMediaPermissions();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [id, interview]);

  const currentQuestion = interview?.questions?.[interview?.currentQuestion];

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please enter your answer before continuing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post("/api/interview/answer", {
        interviewId: id,
        answer,
      });

      if (response?.data?.completed) {
        navigate(`/interview/${id}/report`, {
          state: { interview: response.data.interview },
        });
        return;
      }

      setInterview((prev) => ({
        ...prev,
        currentQuestion: response.data.currentQuestion,
      }));
      setAnswer("");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to submit answer.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] px-4 py-10 text-neutral-900">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-neutral-500">Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] px-4 py-10 text-neutral-900">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-red-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <p className="text-red-600">{error}</p>
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
    <div className="min-h-screen bg-[#F7F7F7] text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
        >
          <FiArrowLeft size={16} />
          Exit interview
        </button>

        <div className="mt-6 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-3 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                Live interview
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight">
                {interview?.role || "Mock Interview"}
              </h1>
            </div>

            <div className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white">
              {interview?.type || "technical"} • Question {Math.min(interview?.currentQuestion + 1 || 1, interview?.questions?.length || 1)}
            </div>
          </div>

          {currentQuestion ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-56 w-full object-cover sm:h-72"
                  />

                  <div className="flex items-center justify-between border-t border-white/10 bg-neutral-900 px-3 py-2 text-[11px] text-neutral-300">
                    <span>
                      {mediaStatus === "granted" && "Camera & microphone enabled"}
                      {mediaStatus === "requesting" && "Requesting camera & microphone access..."}
                      {mediaStatus === "denied" && "Permission required"}
                      {mediaStatus === "unsupported" && "Media unsupported"}
                    </span>

                    {mediaStatus === "denied" && (
                      <button
                        type="button"
                        onClick={requestMediaPermissions}
                        className="rounded-lg border border-white/20 bg-white/5 px-2 py-1 font-medium text-white transition hover:bg-white/10"
                      >
                        Retry
                      </button>
                    )}
                  </div>

                  {cameraError && (
                    <div className="border-t border-red-500/30 bg-red-950/60 px-3 py-2 text-xs text-red-200">
                      {cameraError}
                    </div>
                  )}
                </div>

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Question
                </p>
                <p className="mt-3 text-lg leading-8 text-neutral-900">
                  {currentQuestion.question}
                </p>
              </div>

              <div>
                <label htmlFor="answer" className="mb-2 block text-sm font-semibold text-neutral-700">
                  Your answer
                </label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={8}
                  placeholder="Write your response here..."
                  className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-900"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Submitting..." : "Submit answer"}
                {!submitting && <FiSend size={16} />}
              </button>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">
              <div className="flex items-center gap-2 font-semibold">
                <FiCheckCircle size={16} />
                Interview completed.
              </div>
              <p className="mt-2">Preparing your report...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
