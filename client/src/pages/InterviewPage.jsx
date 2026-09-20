import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Step2interview from "../components/interview/Step2interview";
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
    <Step2interview
      interviewData={interview}
      user={user}
      answer={answer}
      setAnswer={setAnswer}
      onSubmitAnswer={handleSubmitAnswer}
      submitting={submitting}
      error={error}
      cameraError={cameraError}
      mediaStatus={mediaStatus}
      requestMediaPermissions={requestMediaPermissions}
      videoRef={videoRef}
      onExit={() => navigate("/dashboard")}
    />
  );
}

export default InterviewPage;
