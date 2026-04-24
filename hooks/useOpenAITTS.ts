"use client";

import { useState, useRef, useCallback } from "react";

export type SpeakerRole =
  | "examiner"
  | "examiner_male"
  | "examiner_female"
  | "patient_male"
  | "patient_female";

const VOICE_ID_BY_ROLE: Record<SpeakerRole, string> = {
  examiner: "YCxeyFA0G7yTk6Wuv2oq",
  examiner_male: "YCxeyFA0G7yTk6Wuv2oq",
  examiner_female: "8WaMCGQzWsKvf7sGPqjE",
  patient_male: "1IthILLNX448pH19aMvC",
  patient_female: "luVEyhT3CocLZaLBps8v",
};

// Tune these by ear to match perceived loudness across voices
const VOICE_GAIN: Record<string, number> = {
  YCxeyFA0G7yTk6Wuv2oq: 1.0,
  "8WaMCGQzWsKvf7sGPqjE": 1.0,
  "1IthILLNX448pH19aMvC": 1.0,
  luVEyhT3CocLZaLBps8v: 1.0,
};

let sharedAudioContext: AudioContext | null = null;

function getSharedAudioContext(): AudioContext {
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContext();
  }
  return sharedAudioContext;
}

interface UseOpenAITTSOptions {
  /** Called once when API TTS fails and the hook switches to browser TTS */
  onFallbackActive?: () => void;
}

interface UseOpenAITTSReturn {
  isSpeaking: boolean;
  /** Stop everything, clear queue, cancel in-flight requests */
  stop: () => void;
  /** Interrupt current speech, clear queue, then play this text immediately */
  speak: (text: string, speakerRole: SpeakerRole, onEnd?: () => void) => void;
  /**
   * Add text to the playback queue. If nothing is playing, starts immediately.
   * Call this per-sentence during streaming so audio begins before the full
   * response has arrived.
   */
  enqueue: (text: string, speakerRole: SpeakerRole) => void;
}

export function useOpenAITTS(
  options: UseOpenAITTSOptions = {}
): UseOpenAITTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const useFallbackRef = useRef(false);
  const fallbackNotifiedRef = useRef(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  /** true while audio is playing or a fetch is in-flight for the current item */
  const isPlayingRef = useRef(false);
  const queueRef = useRef<Array<{ text: string; role: SpeakerRole }>>([]);

  // Keep onFallbackActive stable across renders without stale-closure issues
  const onFallbackActiveRef = useRef(options.onFallbackActive);
  onFallbackActiveRef.current = options.onFallbackActive;

  /**
   * doPlayRef / doPlayNextRef are reassigned every render.
   * They are only ever called asynchronously (from onended handlers or Promises),
   * so they always pick up the latest version — no stale-closure problem.
   */
  const doPlayRef = useRef<(text: string, role: SpeakerRole) => void>(() => {});
  const doPlayNextRef = useRef<() => void>(() => {});

  // --- advance the queue -------------------------------------------------
  doPlayNextRef.current = () => {
    const next = queueRef.current.shift();
    if (next) {
      isPlayingRef.current = true;
      doPlayRef.current(next.text, next.role);
    } else {
      isPlayingRef.current = false;
      setIsSpeaking(false);
    }
  };

  // --- play one item (API TTS, with browser fallback) --------------------
  doPlayRef.current = (text: string, role: SpeakerRole) => {
    if (!text.trim()) {
      doPlayNextRef.current();
      return;
    }

    // --- browser SpeechSynthesis fallback ---
    if (useFallbackRef.current) {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        doPlayNextRef.current();
        return;
      }
      if (!fallbackNotifiedRef.current) {
        fallbackNotifiedRef.current = true;
        onFallbackActiveRef.current?.();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utteranceRef.current = utterance;
      const onDone = () => {
        utteranceRef.current = null;
        doPlayNextRef.current();
      };
      utterance.onend = onDone;
      utterance.onerror = onDone;
      window.speechSynthesis.speak(utterance);
      return;
    }

    // --- Server TTS ---
    const controller = new AbortController();
    abortControllerRef.current = controller;

    (async () => {
      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, speakerRole: role }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`TTS failed: ${res.status}`);

        const arrayBuffer = await res.arrayBuffer();
        if (controller.signal.aborted) return;

        const audioContext = getSharedAudioContext();
        if (audioContext.state === "suspended") await audioContext.resume();

        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        if (controller.signal.aborted) return;

        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        const voiceId = VOICE_ID_BY_ROLE[role];
        gainNode.gain.value = VOICE_GAIN[voiceId] ?? 1.0;
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        sourceNodeRef.current = source;

        source.onended = () => {
          if (sourceNodeRef.current === source) {
            sourceNodeRef.current = null;
            doPlayNextRef.current();
          }
        };

        source.start(0);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("TTS error — falling back to browser TTS:", err);
        useFallbackRef.current = true;
        if (!controller.signal.aborted) {
          // Retry the same item via browser fallback
          doPlayRef.current(text, role);
        } else {
          doPlayNextRef.current();
        }
      }
    })();
  };

  // -----------------------------------------------------------------------

  const stop = useCallback(() => {
    queueRef.current = [];
    isPlayingRef.current = false;

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

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;

    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, speakerRole: SpeakerRole, onEnd?: () => void) => {
      if (!text.trim()) return;
      stop();

      isPlayingRef.current = true;
      setIsSpeaking(true);

      if (onEnd) {
        // Wrap doPlayNext so onEnd fires when this item's audio ends and queue
        // is empty (stop() cleared the queue, so onEnd fires after this item).
        const original = doPlayNextRef.current;
        doPlayNextRef.current = () => {
          doPlayNextRef.current = original;
          original();
          onEnd();
        };
      }

      doPlayRef.current(text, speakerRole);
    },
    [stop]
  );

  /**
   * Add a sentence to the playback queue.
   * If nothing is currently playing, playback starts immediately —
   * this means first audio can begin after only the first sentence has been
   * generated, rather than waiting for the complete LLM response.
   */
  const enqueue = useCallback((text: string, speakerRole: SpeakerRole) => {
    if (!text.trim()) return;

    if (!isPlayingRef.current) {
      isPlayingRef.current = true;
      setIsSpeaking(true);
      doPlayRef.current(text, speakerRole);
    } else {
      queueRef.current.push({ text, role: speakerRole });
    }
  }, []);

  return { isSpeaking, speak, enqueue, stop };
}
