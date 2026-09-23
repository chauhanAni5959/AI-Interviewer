import  { useEffect, useRef, useState } from "react";
import { FiMic, FiPause, FiPlay, FiRotateCcw, FiSend, FiSquare, FiTrash2 } from "react-icons/fi";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";

const STATES = {
  IDLE: "IDLE",
  AI_SPEAKING: "AI_SPEAKING",
  USER_LISTENING: "USER_LISTENING",
  PROCESSING: "PROCESSING",
};

const stateLabels = {
  [STATES.IDLE]: "Ready",
  [STATES.AI_SPEAKING]: "AI is speaking",
  [STATES.USER_LISTENING]: "Listening to you",
  [STATES.PROCESSING]: "Processing answer",
};

function InterviewVoicePanel({
  question,
  answer = "",
  setAnswer = () => {},
  onSubmit = () => {},
  submitting = false,
}) {
  const [state, setState] = useState(STATES.IDLE);
  const [notice, setNotice] = useState("");
  const lastQuestionRef = useRef("");
  const alertShownRef = useRef(false);
  const { supported: synthesisSupported, isSpeaking, isPaused, speak, pause, resume, cancel } =
    useSpeechSynthesis();
  const {
    supported: recognitionSupported,
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
    clear,
  } = useSpeechRecognition();

  const browserSupportsSpeech = synthesisSupported && recognitionSupported;

  useEffect(() => {
    if (!browserSupportsSpeech && !alertShownRef.current) {
      alertShownRef.current = true;
      window.alert("Voice interview is not supported in this browser. You can continue with manual text input.");
    }
  }, [browserSupportsSpeech]);

  useEffect(() => {
    if (!question || question === lastQuestionRef.current) return undefined;

    lastQuestionRef.current = question;
    stop();
    clear();
    setNotice("");

    if (!synthesisSupported) {
      setState(STATES.IDLE);
      return undefined;
    }

    setState(STATES.AI_SPEAKING);
    speak(question, {
      onEnd: () => {
        setState(STATES.IDLE);
        if (recognitionSupported) {
          start();
        }
      },
    });

    return () => cancel();
  }, [cancel, clear, question, recognitionSupported, speak, start, stop, synthesisSupported]);

  useEffect(() => {
    if (submitting) {
      cancel();
      stop();
      setState(STATES.PROCESSING);
    } else if (!isSpeaking && !isListening && state === STATES.PROCESSING) {
      setState(STATES.IDLE);
    }
  }, [cancel, isListening, isSpeaking, stop, state, submitting]);

  useEffect(() => {
    if (!isSpeaking && isListening) {
      setState(STATES.USER_LISTENING);
    } else if (isSpeaking) {
      setState(STATES.AI_SPEAKING);
    } else if (!isListening && state === STATES.USER_LISTENING) {
      setState(STATES.IDLE);
    }
  }, [isListening, isSpeaking]);

  const handleTranscriptChange = (event) => {
    setAnswer(event.target.value);
    setNotice("");
  };

  const handleStartListening = () => {
    if (!recognitionSupported) {
      setNotice("Speech recognition is unavailable. Type your answer manually.");
      return;
    }

    cancel();
    setNotice("");
    start();
  };

  const handleClear = () => {
    clear();
    setAnswer("");
    setNotice("");
  };

  const handleSubmit = () => {
    stop();
    cancel();
    onSubmit();
  };

  const displayTranscript = `${transcript}${interimTranscript ? ` ${interimTranscript}` : ""}`.trim();
  const status = submitting ? STATES.PROCESSING : state;

  useEffect(() => {
    if (displayTranscript && displayTranscript !== answer && isListening) {
      setAnswer(displayTranscript);
    }
  }, [answer, displayTranscript, isListening, setAnswer]);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <label htmlFor="answer" className="text-sm font-semibold text-neutral-700">
            Your answer
          </label>
          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
            <span className={`inline-flex h-2 w-2 rounded-full ${status === STATES.AI_SPEAKING ? "animate-pulse bg-amber-500" : status === STATES.USER_LISTENING ? "animate-pulse bg-emerald-500" : "bg-neutral-300"}`} />
            {stateLabels[status]}
          </div>
        </div>

        {status === STATES.AI_SPEAKING && (
          <div className="flex items-end gap-1" aria-label="AI speaking">
            {["h-3", "h-5", "h-4", "h-6", "h-3"].map((height, index) => (
              <span key={index} className={`w-1 rounded-full bg-amber-500 animate-pulse ${height}`} />
            ))}
          </div>
        )}
      </div>

      <textarea
        id="answer"
        value={answer}
        onChange={handleTranscriptChange}
        rows={8}
        placeholder={recognitionSupported ? "Your live transcript will appear here..." : "Type your response here..."}
        className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-neutral-900"
      />

      {!browserSupportsSpeech && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Voice features are unavailable in this browser. Manual text input is enabled.
        </p>
      )}

      {notice && <p className="mt-3 text-xs text-neutral-500">{notice}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {isSpeaking && !isPaused && (
          <button type="button" onClick={pause} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
            <FiPause size={14} /> Pause / Mute AI
          </button>
        )}
        {isSpeaking && isPaused && (
          <button type="button" onClick={resume} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">
            <FiPlay size={14} /> Resume AI
          </button>
        )}
        <button type="button" onClick={() => { stop(); cancel(); speak(question, { onEnd: () => { setState(STATES.IDLE); if (recognitionSupported) start(); } }); }} disabled={!synthesisSupported || submitting} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50">
          <FiRotateCcw size={14} /> Replay Question
        </button>
        <button type="button" onClick={handleStartListening} disabled={isSpeaking || submitting} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50">
          {isListening ? <FiSquare size={14} /> : <FiMic size={14} />}
          {isListening ? "Stop Listening" : "Start Speaking"}
        </button>
        <button type="button" onClick={handleClear} disabled={submitting} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50">
          <FiTrash2 size={14} /> Clear Transcript
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-neutral-500">
          <FiMic size={14} className={isListening ? "text-emerald-600" : "text-neutral-400"} />
          {isListening ? "Speak naturally; you can edit the transcript." : "Your response will be evaluated after submission."}
        </p>
        <button type="button" onClick={handleSubmit} disabled={submitting || !answer.trim()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70">
          {submitting ? "Submitting..." : "Submit answer"}
          {!submitting && <FiSend size={16} />}
        </button>
      </div>
    </div>
  );
}

export default InterviewVoicePanel;
