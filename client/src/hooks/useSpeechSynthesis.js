import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechSynthesis() {
  const synthesisRef = useRef(null);
  const onEndRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return undefined;

    synthesisRef.current = window.speechSynthesis;

    return () => {
      synthesisRef.current.cancel();
      onEndRef.current = null;
    };
  }, [supported]);

  const speak = useCallback(
    (text, options = {}) => {
      if (!supported || !text?.trim()) return false;

      const synthesis = synthesisRef.current || window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = options.rate || 0.95;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume ?? 1;
      onEndRef.current = options.onEnd || null;

      synthesis.cancel();
      synthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onpause = () => setIsPaused(true);
      utterance.onresume = () => setIsPaused(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        onEndRef.current = null;
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        const onEnd = onEndRef.current;
        onEndRef.current = null;
        onEnd?.();
      };

      return true;
    },
    [supported],
  );

  const pause = useCallback(() => {
    if (!supported || !synthesisRef.current || !isSpeaking) return;
    synthesisRef.current.pause();
    setIsPaused(true);
  }, [isSpeaking, supported]);

  const resume = useCallback(() => {
    if (!supported || !synthesisRef.current || !isPaused) return;
    synthesisRef.current.resume();
    setIsPaused(false);
  }, [isPaused, supported]);

  const cancel = useCallback(() => {
    if (supported && synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    onEndRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
  }, [supported]);

  return {
    supported,
    isSpeaking,
    isPaused,
    speak,
    pause,
    resume,
    cancel,
  };
}

export default useSpeechSynthesis;
