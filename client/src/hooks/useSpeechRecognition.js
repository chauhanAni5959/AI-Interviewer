import { useCallback, useEffect, useRef, useState } from "react";

const getRecognitionConstructor = () => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export function useSpeechRecognition({ onTranscript } = {}) {
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const Recognition = getRecognitionConstructor();
  const supported = Boolean(Recognition);

  useEffect(() => {
    if (!Recognition) return undefined;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result[0]?.transcript || "";
        if (result.isFinal) finalText += text;
        else interimText += text;
      }

      if (finalText) {
        setTranscript((current) => {
          const next = `${current} ${finalText}`.trim();
          onTranscriptRef.current?.(next, interimText);
          return next;
        });
      }

      setInterimTranscript(interimText);
      onTranscriptRef.current?.(transcript, interimText);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [Recognition]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return false;
    try {
      recognitionRef.current.start();
      return true;
    } catch {
      return false;
    }
  }, [isListening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const abort = useCallback(() => {
    recognitionRef.current?.abort();
    setIsListening(false);
  }, []);

  const clear = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    supported,
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
    abort,
    clear,
  };
}

export default useSpeechRecognition;
