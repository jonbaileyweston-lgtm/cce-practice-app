"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCaseById } from "@/data/cases";
import { notFound } from "next/navigation";
import { useWhisperSTT } from "@/hooks/useWhisperSTT";
import { useOpenAITTS } from "@/hooks/useOpenAITTS";
import Timer from "@/components/Timer";
import type { Message } from "@/types";

const TOTAL_CONSULT_SECONDS = 10 * 60;
const WARNING_THRESHOLD = TOTAL_CONSULT_SECONDS - 120;

export default function ConsultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const caseData = getCaseById(id);
  const router = useRouter();

  if (!caseData) notFound();
  if (!caseData.patientPersona) {
    // Redirect to Case Discussion if no patient persona
    router.replace(`/case/${id}/exam`);
    return null;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isConsultStarted, setIsConsultStarted] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isConsultEnded, setIsConsultEnded] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [useManualMode, setUseManualMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [garbledWarning, setGarbledWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTTSFallback, setIsTTSFallback] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const elapsedSecondsRef = useRef(0);
  const hasTimerStartedRef = useRef(false);
  const hasPlayedWarningRef = useRef(false);
  const isTimeUpRef = useRef(false);

  const voiceRole =
    caseData.patientGender === "M" ? "patient_male" : "patient_female";

  const { speak, stop: stopSpeaking, isSpeaking } = useOpenAITTS({
    onFallbackActive: () => setIsTTSFallback(true),
  });

  const handleFinalTranscript = useCallback(
    (transcript: string) => {
      if (!transcript.trim() || isSubmitting) return;
      setInterimText("");
      setGarbledWarning(null);
      submitCandidateMessage(transcript.trim());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSubmitting]
  );

  const { isListening, isSupported, startListening, stopListening } =
    useWhisperSTT({
      onInterimResult: setInterimText,
      onFinalResult: handleFinalTranscript,
      onGarbledResult: (msg) => { setGarbledWarning(msg); setInterimText(""); },
      onError: (err) => { setError(err); setUseManualMode(true); },
    });

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, isPatientTyping]);

  // Consultation timer
  useEffect(() => {
    if (!isTimerStarted || isConsultEnded) return;
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      elapsedSecondsRef.current = elapsed;

      if (elapsed >= WARNING_THRESHOLD && !hasPlayedWarningRef.current) {
        hasPlayedWarningRef.current = true;
        playWarningBeep();
      }

      if (elapsed >= TOTAL_CONSULT_SECONDS && !isTimeUpRef.current) {
        isTimeUpRef.current = true;
        clearInterval(timerRef.current!);
        setIsTimeUp(true);
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerStarted, isConsultEnded]);

  // When time is up: patient says goodbye, then navigate to results
  useEffect(() => {
    if (!isTimeUp) return;
    stopSpeaking();
    const timeUpMsg: Message = {
      role: "candidate",
      content: "[SYSTEM: The consultation time has expired. Please deliver a brief natural closing comment as the patient — e.g. 'Okay, thank you doctor.']",
      timestamp: Date.now(),
    };
    const msgs = [...messagesRef.current, timeUpMsg];
    setMessages(msgs);
    streamPatientResponse(msgs).finally(() => {
      setTimeout(() => handleConsultEnd("time"), 3000);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp]);

  const playWarningBeep = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch { /* ignore */ }
  };

  const streamPatientResponse = useCallback(
    async (currentMessages: Message[]) => {
      setIsPatientTyping(true);
      setError(null);

      try {
        const res = await fetch("/api/patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId: id, messages: currentMessages }),
        });

        if (!res.ok) throw new Error("Failed to get patient response");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) fullText += parsed.text;
              } catch { /* ignore */ }
            }
          }
        }

        setIsPatientTyping(false);

        if (fullText.trim()) {
          const msg: Message = {
            role: "examiner", // "examiner" slot = patient voice in this mode
            content: fullText.trim(),
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, msg]);
          if (!isTimeUpRef.current) {
            speak(fullText.trim(), voiceRole);
          }
        }
      } catch (err) {
        setIsPatientTyping(false);
        setError("Failed to get patient response. Please try again.");
        console.error(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, speak, voiceRole]
  );

  const startConsult = async () => {
    setIsConsultStarted(true);
    // Seed opening patient message
    const opening = caseData.patientPersona!.openingStatement;
    const openingMsg: Message = {
      role: "examiner",
      content: opening,
      timestamp: Date.now(),
    };
    setMessages([openingMsg]);
    speak(opening, voiceRole);
  };

  const submitCandidateMessage = async (text: string) => {
    if (isSubmitting || isConsultEnded || isTimeUp || !text.trim()) return;
    setIsSubmitting(true);
    stopSpeaking();

    // Start timer on first candidate speech
    if (!hasTimerStartedRef.current) {
      hasTimerStartedRef.current = true;
      startTimeRef.current = Date.now();
      setIsTimerStarted(true);
    }

    const candidateMsg: Message = {
      role: "candidate",
      content: text,
      timestamp: Date.now(),
    };
    const newMessages = [...messagesRef.current, candidateMsg];
    setMessages(newMessages);
    messagesRef.current = newMessages;
    setIsSubmitting(false);

    await streamPatientResponse(newMessages);
  };

  const handleConsultEnd = async (reason: "time" | "manual") => {
    if (isConsultEnded) return;
    setIsConsultEnded(true);
    stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const stored = localStorage.getItem("cce-session-history");
      const history = stored ? JSON.parse(stored) : [];
      history.push({ caseId: id, completedAt: Date.now() });
      localStorage.setItem("cce-session-history", JSON.stringify(history));
    } catch { /* ignore */ }

    const sessionData = {
      messages: messagesRef.current,
      durationSeconds: elapsedSecondsRef.current,
      caseId: id,
    };
    sessionStorage.setItem("cce-last-session", JSON.stringify(sessionData));
    router.push(`/case/${id}/results`);
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else { setGarbledWarning(null); startListening(); }
  };

  const showWarningBanner =
    isTimerStarted && !isTimeUp &&
    elapsedSeconds >= WARNING_THRESHOLD &&
    elapsedSeconds < TOTAL_CONSULT_SECONDS;

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:block text-xs text-slate-400 font-medium truncate max-w-[160px]">
              {caseData.patientName}
            </div>
            <div className="bg-emerald-800 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-medium">
              Consultation
            </div>
          </div>
          {isConsultStarted && (
            <Timer
              totalSeconds={TOTAL_CONSULT_SECONDS}
              elapsedSeconds={elapsedSeconds}
              isStarted={isTimerStarted}
            />
          )}
          <div />
        </div>
      </header>

      {isTTSFallback && (
        <div className="bg-slate-700 border-b border-slate-600 text-slate-300 text-xs px-4 py-1.5 text-center flex-shrink-0">
          Using device audio (OpenAI TTS unavailable)
        </div>
      )}

      {showWarningBanner && (
        <div className="bg-amber-700/80 border-b border-amber-600 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-2 text-center">
            <span className="text-amber-100 text-sm font-bold">⚠️ 2 minutes remaining</span>
          </div>
        </div>
      )}

      {isTimeUp && (
        <div className="bg-red-800/90 border-b border-red-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-2 text-center">
            <span className="text-red-100 text-sm font-bold">⏰ Consultation time ended</span>
          </div>
        </div>
      )}

      {/* Mode label */}
      <div className="bg-emerald-900/40 border-b border-emerald-800 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-1.5">
          <span className="text-xs text-emerald-400 font-medium">
            Recorded Consultation mode — you are consulting directly with the patient
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {!isConsultStarted && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🩺</div>
              <h2 className="text-xl font-semibold text-white mb-2">Ready to consult?</h2>
              <p className="text-slate-400 mb-1 text-sm max-w-sm mx-auto">
                You will consult directly with the AI patient.
                The 10-minute timer starts when you speak your first word.
              </p>
              <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto">
                {caseData.patientPersona?.openingStatement}
              </p>
              <button
                onClick={startConsult}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
              >
                Enter consultation
              </button>
            </div>
          )}

          {messages
            .filter((m) => !m.content.startsWith("[SYSTEM:"))
            .map((msg, i) => {
              const isPatient = msg.role === "examiner";
              return (
                <div
                  key={i}
                  className={`flex gap-3 ${isPatient ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isPatient ? "bg-emerald-700 text-white" : "bg-blue-600 text-white"
                    }`}
                  >
                    {isPatient ? "P" : "Dr"}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isPatient
                        ? "bg-slate-700 text-slate-100 rounded-tl-sm"
                        : "bg-blue-700 text-white rounded-tr-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

          {isListening && interimText && (
            <div className="flex gap-3 flex-row-reverse">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-blue-600 text-white">
                Dr
              </div>
              <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed bg-blue-800/60 text-blue-200 italic border border-blue-600/40">
                {interimText}
                <span className="inline-block ml-1 animate-pulse">▊</span>
              </div>
            </div>
          )}

          {isPatientTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-emerald-700 text-white">
                P
              </div>
              <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {garbledWarning && (
            <div className="bg-amber-900/50 border border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-300">
              {garbledWarning}
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Controls */}
      {isConsultStarted && !isConsultEnded && !isTimeUp && (
        <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {!useManualMode ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMicClick}
                  disabled={isPatientTyping || isSpeaking}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-lg ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : isPatientTyping || isSpeaking
                      ? "bg-slate-600 cursor-not-allowed opacity-50"
                      : "bg-blue-600 hover:bg-blue-500 active:scale-95"
                  }`}
                >
                  <span className="text-2xl">{isListening ? "⏹" : "🎤"}</span>
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {isSpeaking ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-emerald-300">Patient speaking...</span>
                      <button onClick={stopSpeaking} className="text-xs text-slate-400 hover:text-white ml-2">
                        Stop
                      </button>
                    </div>
                  ) : isListening ? (
                    <p className="text-sm text-red-300 animate-pulse">Recording... click ⏹ when done</p>
                  ) : isPatientTyping ? (
                    <p className="text-sm text-slate-400">Patient is responding...</p>
                  ) : (
                    <p className="text-sm text-slate-400">
                      {isTimerStarted ? "Press 🎤 to speak to the patient" : "Press 🎤 to speak — timer starts with your first word"}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!isSupported && (
                    <button
                      onClick={() => setUseManualMode(true)}
                      className="text-xs text-slate-400 hover:text-white bg-slate-700 px-3 py-1.5 rounded-lg"
                    >
                      Type instead
                    </button>
                  )}
                  <button
                    onClick={() => handleConsultEnd("manual")}
                    className="text-xs text-slate-400 hover:text-red-400 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    End consult
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (manualInput.trim()) {
                        submitCandidateMessage(manualInput.trim());
                        setManualInput("");
                      }
                    }
                  }}
                  placeholder="Type what you say to the patient..."
                  className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 min-h-[60px] max-h-[120px]"
                  rows={2}
                  disabled={isPatientTyping}
                />
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      if (manualInput.trim()) {
                        submitCandidateMessage(manualInput.trim());
                        setManualInput("");
                      }
                    }}
                    disabled={!manualInput.trim() || isPatientTyping}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setUseManualMode(false)}
                    className="text-xs text-slate-400 hover:text-white bg-slate-700 px-3 py-1.5 rounded-lg"
                  >
                    🎤 Voice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isConsultStarted && !isConsultEnded && isTimeUp && (
        <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4 text-center">
            <p className="text-sm text-slate-400">Consultation time has ended. Wrapping up...</p>
          </div>
        </div>
      )}
    </div>
  );
}
