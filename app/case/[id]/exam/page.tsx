"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCaseById } from "@/data/cases";
import { notFound } from "next/navigation";
import { useWhisperSTT } from "@/hooks/useWhisperSTT";
import { useOpenAITTS } from "@/hooks/useOpenAITTS";
import Timer from "@/components/Timer";
import type { Message } from "@/types";

const TOTAL_EXAM_SECONDS = 10 * 60; // 10 minutes — matches real CCE station length
const WARNING_THRESHOLD = TOTAL_EXAM_SECONDS - 120; // 8 min elapsed → 2 min left
const AUTOSAVE_KEY = (id: string) => `cce-autosave-${id}`;

interface AutosaveData {
  messages: Message[];
  elapsedSeconds: number;
  currentQuestionIndex: number;
  caseId: string;
  savedAt: number;
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const caseData = getCaseById(id);
  const router = useRouter();

  if (!caseData) notFound();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Separate flags: exam started (examiner has asked Q1) vs timer started (candidate first spoke)
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  const [isExaminerTyping, setIsExaminerTyping] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [useManualMode, setUseManualMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [garbledWarning, setGarbledWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTTSFallback, setIsTTSFallback] = useState(false);

  // Session recovery
  const [recoveredSession, setRecoveredSession] = useState<AutosaveData | null>(null);
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentQIndexRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  const elapsedSecondsRef = useRef(0);
  const hasTimerStartedRef = useRef(false);
  const hasPlayedWarningRef = useRef(false);
  const isTimeUpRef = useRef(false);

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

  const handleGarbledTranscript = useCallback((warning: string) => {
    setGarbledWarning(warning);
    setInterimText("");
  }, []);

  const { isListening, isSupported, startListening, stopListening } =
    useWhisperSTT({
      onInterimResult: setInterimText,
      onFinalResult: handleFinalTranscript,
      onGarbledResult: handleGarbledTranscript,
      onError: (err) => {
        setError(err);
        setUseManualMode(true);
      },
    });

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, isExaminerTyping]);

  // Check for recoverable session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY(id));
      if (saved) {
        const data = JSON.parse(saved) as AutosaveData;
        const ageMs = Date.now() - data.savedAt;
        if (
          data.caseId === id &&
          data.messages?.length > 0 &&
          ageMs < 24 * 60 * 60 * 1000
        ) {
          setRecoveredSession(data);
          setShowRecoveryPrompt(true);
        }
      }
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer — only runs after candidate first speaks
  useEffect(() => {
    if (!isTimerStarted || isExamEnded) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      elapsedSecondsRef.current = elapsed;

      // 2-minute warning beep
      if (elapsed >= WARNING_THRESHOLD && !hasPlayedWarningRef.current) {
        hasPlayedWarningRef.current = true;
        setHasShownWarning(true);
        playWarningBeep();
      }

      // Time up
      if (elapsed >= TOTAL_EXAM_SECONDS && !isTimeUpRef.current) {
        isTimeUpRef.current = true;
        clearInterval(timerRef.current!);
        setIsTimeUp(true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerStarted, isExamEnded]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isExamStarted || isExamEnded) return;

    autosaveRef.current = setInterval(() => {
      try {
        const saveData: AutosaveData = {
          messages: messagesRef.current,
          elapsedSeconds: elapsedSecondsRef.current,
          currentQuestionIndex: currentQIndexRef.current,
          caseId: id,
          savedAt: Date.now(),
        };
        localStorage.setItem(AUTOSAVE_KEY(id), JSON.stringify(saveData));
      } catch {
        // storage quota or unavailable — ignore
      }
    }, 30000);

    return () => {
      if (autosaveRef.current) clearInterval(autosaveRef.current);
    };
  }, [isExamStarted, isExamEnded, id]);

  // When time is up: ask examiner for closing remark, then navigate
  useEffect(() => {
    if (!isTimeUp) return;
    stopSpeaking();

    const timeUpMsg: Message = {
      role: "candidate",
      content:
        "[SYSTEM: EXAMINATION TIME HAS EXPIRED. Please deliver a brief professional closing remark to conclude the case discussion — e.g. 'Thank you, that concludes our case discussion.']",
      timestamp: Date.now(),
      questionNumber: caseData!.questions[currentQIndexRef.current]?.number,
    };
    const msgs = [...messagesRef.current, timeUpMsg];
    setMessages(msgs);

    streamExaminerResponse(msgs, currentQIndexRef.current).finally(() => {
      setTimeout(() => handleExamEnd("time"), 3000);
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
    } catch {
      // ignore — audio context may not be available
    }
  };

  const addExaminerMessage = (text: string, qIndex: number) => {
    const msg: Message = {
      role: "examiner",
      content: text,
      timestamp: Date.now(),
      questionNumber: caseData!.questions[qIndex]?.number,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const streamExaminerResponse = useCallback(
    async (currentMessages: Message[], qIndex: number) => {
      setIsExaminerTyping(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId: id,
            messages: currentMessages,
            currentQuestionIndex: qIndex,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to get examiner response");
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }

        setIsExaminerTyping(false);

        // Strip any leaked [PROMPT]/[PROBE]/[MUST-USE] labels and markdown
        // formatting that Claude may accidentally include in its response.
        fullText = fullText
          .replace(/\*{1,3}\[(PROMPT|PROBE|MUST-USE)\]\*{1,3}/gi, "")
          .replace(/\[(PROMPT|PROBE|MUST-USE)\]/gi, "")
          .replace(/\*{2,3}([^*]+)\*{2,3}/g, "$1")
          .replace(/\s{2,}/g, " ")
          .trim();

        if (fullText.trim()) {
          // Detect if the examiner has transitioned to a new question.
          // The system prompt instructs: "Moving to Question [N]..."
          const transitionMatch = fullText.match(
            /[Mm]oving (?:on )?to [Qq]uestion\s+(\d+)/
          );
          let resolvedQIndex = qIndex;
          if (transitionMatch) {
            const nextQNum = parseInt(transitionMatch[1], 10);
            const nextQIdx = caseData!.questions.findIndex(
              (q) => q.number === nextQNum
            );
            if (nextQIdx >= 0 && nextQIdx !== currentQIndexRef.current) {
              resolvedQIndex = nextQIdx;
              currentQIndexRef.current = nextQIdx;
              setCurrentQuestionIndex(nextQIdx);
            }
          }

          addExaminerMessage(fullText.trim(), resolvedQIndex);
          // Only speak if not time-up (avoid TTS competing with closing sequence)
          if (!isTimeUpRef.current) {
            speak(fullText.trim(), "examiner");
          }

          // Check if examiner concluded the exam
          if (
            fullText.toLowerCase().includes("concludes the case") ||
            fullText.toLowerCase().includes("that concludes")
          ) {
            setTimeout(() => handleExamEnd("complete"), 2000);
          }
        }
      } catch (err) {
        setIsExaminerTyping(false);
        setError("Failed to get examiner response. Please try again.");
        console.error(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, speak]
  );

  const startExam = async () => {
    setIsExamStarted(true);
    // Timer does NOT start here — it starts when the candidate first speaks
    await streamExaminerResponse([], 0);
  };

  const resumeSession = () => {
    if (!recoveredSession) return;
    setShowRecoveryPrompt(false);
    setMessages(recoveredSession.messages);
    messagesRef.current = recoveredSession.messages;
    const qIdx = recoveredSession.currentQuestionIndex;
    currentQIndexRef.current = qIdx;
    setCurrentQuestionIndex(qIdx);
    setIsExamStarted(true);
    // Restore elapsed time and restart timer
    elapsedSecondsRef.current = recoveredSession.elapsedSeconds;
    setElapsedSeconds(recoveredSession.elapsedSeconds);
    startTimeRef.current = Date.now() - recoveredSession.elapsedSeconds * 1000;
    hasTimerStartedRef.current = true;
    setIsTimerStarted(true);
  };

  const dismissRecovery = () => {
    setShowRecoveryPrompt(false);
    setRecoveredSession(null);
    try {
      localStorage.removeItem(AUTOSAVE_KEY(id));
    } catch {
      // ignore
    }
  };

  const submitCandidateMessage = async (text: string) => {
    if (isSubmitting || isExamEnded || isTimeUp || !text.trim()) return;
    setIsSubmitting(true);
    stopSpeaking();

    // Start the consultation timer on first candidate speech
    if (!hasTimerStartedRef.current) {
      hasTimerStartedRef.current = true;
      startTimeRef.current = Date.now();
      setIsTimerStarted(true);
    }

    const candidateMsg: Message = {
      role: "candidate",
      content: text,
      timestamp: Date.now(),
      questionNumber: caseData!.questions[currentQIndexRef.current]?.number,
    };

    // Use the ref (not the closure-captured state) so we always include every
    // prior message even if the component hasn't re-rendered since the last
    // examiner reply was appended.
    const newMessages = [...messagesRef.current, candidateMsg];
    setMessages(newMessages);
    messagesRef.current = newMessages;
    setIsSubmitting(false);

    await streamExaminerResponse(newMessages, currentQIndexRef.current);
  };

  const handleNextQuestion = async () => {
    const nextIndex = currentQIndexRef.current + 1;
    if (nextIndex >= caseData!.questions.length) {
      handleExamEnd("complete");
      return;
    }

    currentQIndexRef.current = nextIndex;
    setCurrentQuestionIndex(nextIndex);
    stopSpeaking();

    const skipMsg: Message = {
      role: "candidate",
      content: `[SYSTEM: Please move to Question ${nextIndex + 1}.]`,
      timestamp: Date.now(),
      questionNumber: caseData!.questions[nextIndex]?.number,
    };
    const newMessages = [...messages, skipMsg];
    setMessages(newMessages);

    await streamExaminerResponse(newMessages, nextIndex);
  };

  const handleExamEnd = async (reason: "complete" | "time" | "manual") => {
    if (isExamEnded) return;
    setIsExamEnded(true);
    stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);
    if (autosaveRef.current) clearInterval(autosaveRef.current);

    // Save to history
    try {
      const stored = localStorage.getItem("cce-session-history");
      const history = stored ? JSON.parse(stored) : [];
      history.push({ caseId: id, completedAt: Date.now() });
      localStorage.setItem("cce-session-history", JSON.stringify(history));
    } catch {
      // ignore
    }

    // Clear autosave — session complete
    try {
      localStorage.removeItem(AUTOSAVE_KEY(id));
    } catch {
      // ignore
    }

    // Store full session for results page
    const sessionData = {
      messages: messagesRef.current,
      durationSeconds: elapsedSecondsRef.current,
      caseId: id,
    };
    sessionStorage.setItem("cce-last-session", JSON.stringify(sessionData));

    router.push(`/case/${id}/results`);
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    submitCandidateMessage(manualInput.trim());
    setManualInput("");
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setGarbledWarning(null);
      startListening();
    }
  };

  const currentQuestion = caseData.questions[currentQuestionIndex];

  // Keep ref in sync
  useEffect(() => {
    currentQIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  // 2-minute warning banner visible
  const showWarningBanner =
    isTimerStarted &&
    !isTimeUp &&
    elapsedSeconds >= WARNING_THRESHOLD &&
    elapsedSeconds < TOTAL_EXAM_SECONDS;

  return (
    <div className="flex flex-col h-screen bg-slate-900">

      {/* Session recovery prompt */}
      {showRecoveryPrompt && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
            <div className="text-3xl mb-3">💾</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Session found</h2>
            <p className="text-sm text-slate-600 mb-1">
              An interrupted session for <strong>{caseData.patientName}</strong> was found.
            </p>
            <p className="text-xs text-slate-400 mb-5">
              {recoveredSession?.messages.filter(m => !m.content.startsWith("[SYSTEM:")).length ?? 0} messages · {Math.floor((recoveredSession?.elapsedSeconds ?? 0) / 60)}m{(recoveredSession?.elapsedSeconds ?? 0) % 60}s elapsed
            </p>
            <div className="flex gap-3">
              <button
                onClick={resumeSession}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Resume session
              </button>
              <button
                onClick={dismissRecovery}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Start fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:block">
              <div className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                {caseData.patientName}
              </div>
            </div>
            <div className="bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full font-medium">
              Q{currentQuestionIndex + 1}/{caseData.questions.length}
            </div>
          </div>

          {isExamStarted && (
            <Timer
              totalSeconds={TOTAL_EXAM_SECONDS}
              elapsedSeconds={elapsedSeconds}
              isStarted={isTimerStarted}
            />
          )}

          <div className="flex items-center gap-2" />
        </div>
      </header>

      {/* TTS fallback notice */}
      {isTTSFallback && (
        <div className="bg-slate-700 border-b border-slate-600 text-slate-300 text-xs px-4 py-1.5 text-center flex-shrink-0">
          Using device audio (OpenAI TTS unavailable)
        </div>
      )}

      {/* 2-minute warning banner */}
      {showWarningBanner && (
        <div className="bg-amber-700/80 border-b border-amber-600 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-2 text-center">
            <span className="text-amber-100 text-sm font-bold">
              ⚠️ 2 minutes remaining
            </span>
          </div>
        </div>
      )}

      {/* Time-up banner */}
      {isTimeUp && (
        <div className="bg-red-800/90 border-b border-red-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-2 text-center">
            <span className="text-red-100 text-sm font-bold">
              ⏰ Time is up — waiting for examiner closing remark
            </span>
          </div>
        </div>
      )}

      {/* Current question banner */}
      {isExamStarted && currentQuestion && (
        <div className="bg-blue-900/60 border-b border-blue-800 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-2.5">
            <span className="text-xs font-semibold text-blue-300 uppercase tracking-wide">
              Current Question {currentQuestion.number}
            </span>
            <p className="text-sm text-blue-100 mt-0.5 leading-snug">
              {currentQuestion.text}
            </p>
          </div>
        </div>
      )}

      {/* Timer not yet started notice */}
      {isExamStarted && !isTimerStarted && !isExamEnded && (
        <div className="bg-slate-700/60 border-b border-slate-600 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-1.5 text-center">
            <span className="text-slate-400 text-xs">
              Timer starts when you speak your first answer
            </span>
          </div>
        </div>
      )}

      {/* Messages transcript */}
      <div className="flex-1 overflow-y-scroll">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {!isExamStarted && !showRecoveryPrompt && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎙️</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Ready to begin?
              </h2>
              <p className="text-slate-400 mb-6 text-sm max-w-sm mx-auto">
                The AI examiner will ask you {caseData.questions.length} questions.
                The 10-minute timer starts when you speak your first answer.
              </p>
              <button
                onClick={startExam}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
              >
                Start Exam
              </button>
            </div>
          )}

          {messages
            .filter((m) => !m.content.startsWith("[SYSTEM:"))
            .map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === "candidate" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    msg.role === "examiner"
                      ? "bg-blue-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {msg.role === "examiner" ? "E" : "Y"}
                </div>
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "examiner"
                      ? "bg-slate-700 text-slate-100 rounded-tl-sm"
                      : "bg-emerald-700 text-white rounded-tr-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

          {/* Interim transcript */}
          {isListening && interimText && (
            <div className="flex gap-3 flex-row-reverse">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-emerald-600 text-white">
                Y
              </div>
              <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed bg-emerald-800/60 text-emerald-200 italic border border-emerald-600/40">
                {interimText}
                <span className="inline-block ml-1 animate-pulse">▊</span>
              </div>
            </div>
          )}

          {/* Examiner typing indicator */}
          {isExaminerTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-blue-600 text-white">
                E
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

      {/* Bottom controls */}
      {isExamStarted && !isExamEnded && !isTimeUp && (
        <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0 safe-bottom">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {!useManualMode ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMicClick}
                  disabled={isExaminerTyping || isSpeaking}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-lg ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : isExaminerTyping || isSpeaking
                      ? "bg-slate-600 cursor-not-allowed opacity-50"
                      : "bg-emerald-600 hover:bg-emerald-500 active:scale-95"
                  }`}
                  title={isListening ? "Stop recording" : "Start recording"}
                >
                  <span className="text-2xl">{isListening ? "⏹" : "🎤"}</span>
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-60" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  {isSpeaking ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5 items-end h-5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-blue-400 rounded-full animate-pulse"
                            style={{
                              height: `${[60, 80, 100, 70, 50][i]}%`,
                              animationDelay: `${i * 100}ms`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-blue-300">Examiner speaking...</span>
                      <button
                        onClick={stopSpeaking}
                        className="text-xs text-slate-400 hover:text-white ml-2"
                      >
                        Stop
                      </button>
                    </div>
                  ) : isListening ? (
                    <p className="text-sm text-red-300 animate-pulse">
                      Recording... click ⏹ when done
                    </p>
                  ) : isExaminerTyping ? (
                    <p className="text-sm text-slate-400">Examiner is responding...</p>
                  ) : (
                    <p className="text-sm text-slate-400">
                      {isTimerStarted
                        ? "Press 🎤 to speak your answer"
                        : "Press 🎤 to speak — timer starts with your first word"}
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
                    onClick={handleNextQuestion}
                    disabled={isExaminerTyping}
                    className="text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Next Q →
                  </button>
                  <button
                    onClick={() => handleExamEnd("manual")}
                    className="text-xs text-slate-400 hover:text-red-400 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    End exam
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
                      handleManualSubmit();
                    }
                  }}
                  placeholder="Type your answer here... (Enter to submit, Shift+Enter for new line)"
                  className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 min-h-[60px] max-h-[120px]"
                  rows={2}
                  disabled={isExaminerTyping}
                />
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={handleManualSubmit}
                    disabled={!manualInput.trim() || isExaminerTyping}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
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

      {/* Locked controls when time is up */}
      {isExamStarted && !isExamEnded && isTimeUp && (
        <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-4 text-center">
            <p className="text-sm text-slate-400">
              Examination time has ended. Waiting for examiner to conclude...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
