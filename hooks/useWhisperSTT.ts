"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface WhisperSTTOptions {
  onInterimResult?: (transcript: string) => void;
  onFinalResult?: (transcript: string) => void;
  /**
   * Called when the recording was long enough to expect real speech but Whisper
   * returned fewer than 4 words — likely garbled or unclear audio.
   */
  onGarbledResult?: (message: string) => void;
  onError?: (error: string) => void;
}

interface UseWhisperSTTReturn {
  isListening: boolean;
  isSupported: boolean;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
}

/** Minimum recording duration (ms) that we expect meaningful speech */
const GARBLED_DURATION_THRESHOLD_MS = 5000;
/** Word count below which a long recording is considered garbled */
const GARBLED_WORD_COUNT_THRESHOLD = 4;

export function useWhisperSTT(
  options: WhisperSTTOptions = {}
): UseWhisperSTTReturn {
  const { onInterimResult, onFinalResult, onGarbledResult, onError } = options;

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartRef = useRef<number>(0);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia
    );
  }, []);

  const startListening = useCallback(async () => {
    if (mediaRecorderRef.current?.state === "recording") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstart = () => {
        recordingStartRef.current = Date.now();
        setIsListening(true);
        setInterimTranscript("Recording…");
        onInterimResult?.("Recording…");
      };

      recorder.onstop = async () => {
        const recordingDurationMs = Date.now() - recordingStartRef.current;
        setIsListening(false);

        // Stop all mic tracks
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        chunksRef.current = [];

        if (blob.size === 0) {
          setInterimTranscript("");
          return;
        }

        setInterimTranscript("Transcribing…");
        onInterimResult?.("Transcribing…");

        try {
          const formData = new FormData();
          formData.append("audio", blob, "recording.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error(`Transcription failed: ${res.status}`);
          }

          const data = await res.json();
          const transcript: string = (data.transcript ?? "").trim();

          setInterimTranscript("");
          onInterimResult?.("");

          if (!transcript) return;

          // Garbled-transcript detection:
          // If the recording was long enough to expect meaningful speech but
          // Whisper only returned a handful of words, the audio was likely unclear.
          const wordCount = transcript.split(/\s+/).filter(Boolean).length;
          if (
            recordingDurationMs >= GARBLED_DURATION_THRESHOLD_MS &&
            wordCount < GARBLED_WORD_COUNT_THRESHOLD
          ) {
            onGarbledResult?.(
              `Your audio wasn't clear (we heard: "${transcript}"). Please speak closer to your microphone and try again.`
            );
            return;
          }

          onFinalResult?.(transcript);
        } catch (err) {
          console.error("Transcription error:", err);
          setInterimTranscript("");
          onError?.("Transcription failed. Please try again or switch to manual mode.");
        }
      };

      recorder.onerror = () => {
        setIsListening(false);
        onError?.("Recording error. Please try again.");
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone error:", err);
      setIsListening(false);
      onError?.(
        "Microphone access denied. Please allow microphone permission and try again."
      );
    }
  }, [onInterimResult, onFinalResult, onGarbledResult, onError]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
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
