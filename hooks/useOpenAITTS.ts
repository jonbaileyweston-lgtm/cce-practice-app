"use client";

import { useState, useRef, useCallback } from "react";

export type SpeakerRole = "examiner" | "patient_male" | "patient_female";

interface UseOpenAITTSOptions {
  /** Called once when OpenAI TTS fails and the hook switches to browser TTS */
  onFallbackActive?: () => void;
}

interface UseOpenAITTSReturn {
  isSpeaking: boolean;
  speak: (text: string, speakerRole: SpeakerRole, onEnd?: () => void) => void;
  stop: () => void;
}

export function useOpenAITTS(
  options: UseOpenAITTSOptions = {}
): UseOpenAITTSReturn {
  const { onFallbackActive } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const onEndRef = useRef<(() => void) | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);
  const useFallbackRef = useRef(false);
  const fallbackNotifiedRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.onended = null;
        sourceNodeRef.current.stop();
      } catch {
        // already stopped
      }
      sourceNodeRef.current = null;
    }

    // Stop browser TTS if active
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }

    onEndRef.current = undefined;
    setIsSpeaking(false);
  }, []);

  /** Fallback: speak via browser SpeechSynthesis */
  const speakWithBrowserTTS = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setIsSpeaking(false);
        onEnd?.();
        return;
      }

      if (!fallbackNotifiedRef.current) {
        fallbackNotifiedRef.current = true;
        onFallbackActive?.();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utteranceRef.current = utterance;

      utterance.onend = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    },
    [onFallbackActive]
  );

  const speak = useCallback(
    (text: string, speakerRole: SpeakerRole, onEnd?: () => void) => {
      if (!text.trim()) return;

      stop();

      onEndRef.current = onEnd;

      // If we already know OpenAI TTS is unavailable, go straight to fallback
      if (useFallbackRef.current) {
        setIsSpeaking(true);
        speakWithBrowserTTS(text, onEnd);
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsSpeaking(true);

      (async () => {
        try {
          const res = await fetch("/api/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, speakerRole }),
            signal: controller.signal,
          });

          if (!res.ok) {
            throw new Error(`TTS request failed: ${res.status}`);
          }

          const arrayBuffer = await res.arrayBuffer();
          if (controller.signal.aborted) return;

          const audioContext = getAudioContext();
          if (audioContext.state === "suspended") {
            await audioContext.resume();
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          if (controller.signal.aborted) return;

          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          sourceNodeRef.current = source;

          source.onended = () => {
            if (sourceNodeRef.current === source) {
              sourceNodeRef.current = null;
              setIsSpeaking(false);
              const cb = onEndRef.current;
              onEndRef.current = undefined;
              cb?.();
            }
          };

          source.start(0);
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
          console.error("TTS playback error — falling back to browser TTS:", err);

          // Mark fallback for all future calls
          useFallbackRef.current = true;

          if (!controller.signal.aborted) {
            speakWithBrowserTTS(text, onEnd);
          } else {
            setIsSpeaking(false);
            onEndRef.current = undefined;
          }
        }
      })();
    },
    [stop, getAudioContext, speakWithBrowserTTS]
  );

  return { isSpeaking, speak, stop };
}
