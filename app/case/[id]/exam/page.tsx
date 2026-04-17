"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCaseById } from "@/data/cases";
import { notFound } from "next/navigation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import Timer from "@/components/Timer";
import VoiceSelector from "@/components/VoiceSelector";
import type { Message } from "@/types";

const TOTAL_EXAM_SECONDS = 15 * 60;

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
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const [isExaminerTyping, setIsExaminerTyping] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [useManualMode, setUseManualMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentQIndexRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  const elapsedSecondsRef = useRef(0);

  const {
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    stop: stopSpeaking,
    isSpeaking,
  } = useSpeechSynthesis();

  const handleFinalTranscript = useCallback(
    (transcript: string) => {
      if (!transcript.trim() || isSubmitting) return;
      setInterimText("");
      submitCandidateMessage(transcript.trim());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSubmitting]
  );

  const { isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition({
      onInterimResult: setInterimText,
      onFinalResult: handleFinalTranscript,
      onError: (err) => {
        setError(err);
        setUseManualMode(true);
      },
    });

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, isExaminerTyping]);

  // Timer
  useEffect(() => {
    if (!isExamStarted || isExamEnded) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);

      elapsedSecondsRef.current = elapsed;
      if (elapsed >= TOTAL_EXAM_SECONDS) {
        clearInterval(timerRef.current!);
        handleExamEnd("time");
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExamStarted, isExamEnded]);

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

        if (fullText.trim()) {
          addExaminerMessage(fullText.trim(), qIndex);
          speak(fullText.trim());

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
    startTimeRef.current = Date.now();
    await streamExaminerResponse([], 0);
  };

  const submitCandidateMessage = async (text: string) => {
    if (isSubmitting || isExamEnded || !text.trim()) return;
    setIsSubmitting(true);
    stopSpeaking();

    const candidateMsg: Message = {
      role: "candidate",
      content: text,
      timestamp: Date.now(),
      questionNumber: caseData!.questions[currentQIndexRef.current]?.number,
    };

    const newMessages = [...messages, candidateMsg];
    setMessages(newMessages);
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

    // Save to history
    try {
      const stored = localStorage.getItem("cce-session-history");
      const history = stored ? JSON.parse(stored) : [];
      history.push({ caseId: id, completedAt: Date.now() });
      localStorage.setItem("cce-session-history", JSON.stringify(history));
    } catch {
      // ignore
    }

    // Store session for the results page (use refs to get latest values)
    const sessionData = {
      messages: messagesRef.current,
      durationSeconds: elapsedSecondsRef.current,
      caseId: id,
    };
    sessionStorage.setItem("cce-last-session", JSON.stringify(sessionData));

    // Redirect to results
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
      startListening();
    }
  };

  const currentQuestion = caseData.questions[currentQuestionIndex];

  // Keep ref in sync
  useEffect(() => {
    currentQIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  return (
    <div className="flex flex-col h-screen bg-slate-900">
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
            />
          )}

          <div className="flex items-center gap-2">
            <VoiceSelector
              voices={voices}
              selectedVoice={selectedVoice}
              onSelect={setSelectedVoice}
            />
          </div>
        </div>
      </header>

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

      {/* Messages transcript */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {!isExamStarted && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎙️</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Ready to begin?
              </h2>
              <p className="text-slate-400 mb-6 text-sm max-w-sm mx-auto">
                The AI examiner will ask you {caseData.questions.length} questions.
                Speak your answers aloud using the microphone button below.
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

          {/* Interim transcript (while speaking) */}
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

          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom controls */}
      {isExamStarted && !isExamEnded && (
        <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0 safe-bottom">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {!useManualMode ? (
              /* Voice mode */
              <div className="flex items-center gap-4">
                {/* Mic button */}
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
                              height: `${Math.random() * 100}%`,
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
                      Press 🎤 to speak your answer
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
              /* Manual/text mode */
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
    </div>
  );
}
