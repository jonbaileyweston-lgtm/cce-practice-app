"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const onEndRef = useRef<(() => void) | undefined>(undefined);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Auto-select a high-quality English voice, preferring Australian
        const preferred =
          availableVoices.find(
            (v) =>
              v.lang === "en-AU" && v.name.toLowerCase().includes("neural")
          ) ||
          availableVoices.find((v) => v.lang === "en-AU") ||
          availableVoices.find(
            (v) =>
              v.lang.startsWith("en") && v.name.toLowerCase().includes("neural")
          ) ||
          availableVoices.find(
            (v) =>
              v.lang.startsWith("en") &&
              v.name.toLowerCase().includes("microsoft")
          ) ||
          availableVoices.find((v) => v.lang.startsWith("en")) ||
          availableVoices[0];
        setSelectedVoice(preferred || null);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!("speechSynthesis" in window) || !text.trim()) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      onEndRef.current = onEnd;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = "en-AU";
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEndRef.current?.();
        onEndRef.current = undefined;
      };
      utterance.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.error("Speech synthesis error:", e.error);
        }
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice]
  );

  return {
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop,
  };
}
