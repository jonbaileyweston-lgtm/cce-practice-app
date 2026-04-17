"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionOptions {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any;

function getSpeechRecognitionClass(): AnySpeechRecognition | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useSpeechRecognition(
  options: SpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { onInterimResult, onFinalResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<AnySpeechRecognition>(null);
  const accumulatedRef = useRef<string>("");

  useEffect(() => {
    setIsSupported(!!getSpeechRecognitionClass());
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = getSpeechRecognitionClass();
    if (!SpeechRecognitionAPI) {
      onError?.(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-AU";
    recognition.maxAlternatives = 1;

    accumulatedRef.current = "";

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript("");
    };

    recognition.onresult = (event: AnySpeechRecognition) => {
      let interim = "";
      let finalSegment = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalSegment += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalSegment) {
        accumulatedRef.current +=
          (accumulatedRef.current ? " " : "") + finalSegment.trim();
      }

      const displayTranscript = accumulatedRef.current
        ? accumulatedRef.current + (interim ? " " + interim : "")
        : interim;

      setInterimTranscript(displayTranscript);
      onInterimResult?.(displayTranscript);
    };

    recognition.onerror = (event: AnySpeechRecognition) => {
      if (event.error !== "no-speech" && event.error !== "aborted") {
        onError?.(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = accumulatedRef.current.trim();
      if (finalText) {
        onFinalResult?.(finalText);
        setInterimTranscript("");
        accumulatedRef.current = "";
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onInterimResult, onFinalResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
  };
}
