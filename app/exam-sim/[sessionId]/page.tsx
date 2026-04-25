"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCaseById } from "@/data/cases";
import type { Message, MarkingResult } from "@/types";
import { OVERALL_RATING_LABELS, OVERALL_RATING_COLORS } from "@/types";

interface SimSession {
  stationCount: number;
  caseIds: string[];
  createdAt: number;
}

interface StationResult {
  caseId: string;
  messages: Message[];
  durationSeconds: number;
  result: MarkingResult | null;
}

type SimPhase =
  | "loading"
  | "brief"
  | "exam"
  | "break"
  | "evaluating"
  | "report";

const BREAK_SECONDS = 2 * 60;
const READING_SECONDS = 5 * 60;
const TOTAL_EXAM_SECONDS = 15 * 60;
const WARNING_AT = TOTAL_EXAM_SECONDS - 120;

export default function ExamSimRunnerPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const router = useRouter();

  const [simSession, setSimSession] = useState<SimSession | null>(null);
  const [currentStationIdx, setCurrentStationIdx] = useState(0);
  const [phase, setPhase] = useState<SimPhase>("loading");

  // Brief reading state
  const [readingSecondsLeft, setReadingSecondsLeft] = useState(READING_SECONDS);

  // Break state
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(BREAK_SECONDS);

  // Exam state (mirrors exam/page.tsx)
  const [messages, setMessages] = useState<Message[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isExaminerTyping, setIsExaminerTyping] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [useManualMode, setUseManualMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Results state
  const [stationResults, setStationResults] = useState<StationResult[]>([]);
  const [currentEvalIdx, setCurrentEvalIdx] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breakTimerRef = useRef<NodeJS.Timeout | null>(null);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  const elapsedSecondsRef = useRef(0);
  const hasTimerStartedRef = useRef(false);
  const hasPlayedWarningRef = useRef(false);
  const isTimeUpRef = useRef(false);
  const currentQIdxRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stationResultsRef = useRef<StationResult[]>([]);

  // Load session from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`cce-sim-${sessionId}`);
      if (!raw) { router.push("/exam-sim"); return; }
      const session = JSON.parse(raw) as SimSession;
      setSimSession(session);
      setPhase("brief");
    } catch {
      router.push("/exam-sim");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    stationResultsRef.current = stationResults;
  }, [stationResults]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isExaminerTyping]);

  // Reading timer
  useEffect(() => {
    if (phase !== "brief") return;
    setReadingSecondsLeft(READING_SECONDS);
    readingTimerRef.current = setInterval(() => {
      setReadingSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(readingTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (readingTimerRef.current) clearInterval(readingTimerRef.current); };
  }, [phase, currentStationIdx]);

  // Exam timer
  useEffect(() => {
    if (!isTimerStarted || phase !== "exam") return;
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
      elapsedSecondsRef.current = elapsed;

      if (elapsed >= WARNING_AT && !hasPlayedWarningRef.current) {
        hasPlayedWarningRef.current = true;
        playWarningBeep();
      }

      if (elapsed >= TOTAL_EXAM_SECONDS && !isTimeUpRef.current) {
        isTimeUpRef.current = true;
        clearInterval(timerRef.current!);
        setIsTimeUp(true);
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerStarted, phase]);

  // Time up — auto-advance
  useEffect(() => {
    if (!isTimeUp) return;
    setTimeout(() => endCurrentStation(), 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimeUp]);

  // Break timer
  useEffect(() => {
    if (phase !== "break") return;
    setBreakSecondsLeft(BREAK_SECONDS);
    breakTimerRef.current = setInterval(() => {
      setBreakSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(breakTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (breakTimerRef.current) clearInterval(breakTimerRef.current); };
  }, [phase]);

  const playWarningBeep = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);
    } catch { /* ignore */ }
  };

  const currentCaseId = simSession?.caseIds[currentStationIdx] ?? "";
  const currentCase = getCaseById(currentCaseId);

  const streamExaminerResponse = async (msgs: Message[], qIdx: number) => {
    if (!currentCase) return;
    setIsExaminerTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: currentCaseId, messages: msgs, currentQuestionIndex: qIdx }),
      });
      if (!res.ok) throw new Error("Chat failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("data: ")) {
            const d = line.slice(6).trim();
            if (d === "[DONE]") continue;
            try { const p = JSON.parse(d); if (p.text) fullText += p.text; } catch { /* ignore */ }
          }
        }
      }
      setIsExaminerTyping(false);
      if (fullText.trim()) {
        const msg: Message = { role: "examiner", content: fullText.trim(), timestamp: Date.now(), questionNumber: currentCase.questions[qIdx]?.number };
        setMessages((prev) => [...prev, msg]);
        if (fullText.toLowerCase().includes("that concludes") || fullText.toLowerCase().includes("concludes the case")) {
          setTimeout(() => endCurrentStation(), 2000);
        }
      }
    } catch {
      setIsExaminerTyping(false);
    }
  };

  const startStation = async () => {
    if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    setMessages([]);
    messagesRef.current = [];
    currentQIdxRef.current = 0;
    hasTimerStartedRef.current = false;
    hasPlayedWarningRef.current = false;
    isTimeUpRef.current = false;
    setElapsedSeconds(0);
    elapsedSecondsRef.current = 0;
    setIsTimerStarted(false);
    setIsTimeUp(false);
    setIsSubmitting(false);
    setPhase("exam");
    await streamExaminerResponse([], 0);
  };

  const submitCandidateMessage = async (text: string) => {
    if (isSubmitting || isTimeUp || !text.trim() || !currentCase) return;
    setIsSubmitting(true);

    if (!hasTimerStartedRef.current) {
      hasTimerStartedRef.current = true;
      startTimeRef.current = Date.now();
      setIsTimerStarted(true);
    }

    const msg: Message = { role: "candidate", content: text, timestamp: Date.now(), questionNumber: currentCase.questions[currentQIdxRef.current]?.number };
    const newMsgs = [...messagesRef.current, msg];
    setMessages(newMsgs);
    setIsSubmitting(false);
    await streamExaminerResponse(newMsgs, currentQIdxRef.current);
  };

  const handleNextQuestion = async () => {
    if (!currentCase) return;
    const next = currentQIdxRef.current + 1;
    if (next >= currentCase.questions.length) { endCurrentStation(); return; }
    currentQIdxRef.current = next;
    const skipMsg: Message = { role: "candidate", content: `[SYSTEM: Please move to Question ${next + 1}.]`, timestamp: Date.now() };
    const newMsgs = [...messagesRef.current, skipMsg];
    setMessages(newMsgs);
    await streamExaminerResponse(newMsgs, next);
  };

  const endCurrentStation = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const record: StationResult = {
      caseId: currentCaseId,
      messages: messagesRef.current,
      durationSeconds: elapsedSecondsRef.current,
      result: null,
    };

    const newResults = [...stationResultsRef.current, record];
    setStationResults(newResults);
    stationResultsRef.current = newResults;

    const isLastStation = !simSession || currentStationIdx >= simSession.caseIds.length - 1;

    if (isLastStation) {
      // All stations done — start evaluation
      setPhase("evaluating");
      setCurrentEvalIdx(0);
      evaluateAllStations(newResults, 0);
    } else {
      setPhase("break");
    }
  };

  const evaluateAllStations = async (results: StationResult[], startIdx: number) => {
    const updated = [...results];
    for (let i = startIdx; i < updated.length; i++) {
      setCurrentEvalIdx(i);
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caseId: updated[i].caseId, messages: updated[i].messages, durationSeconds: updated[i].durationSeconds }),
        });
        if (res.ok) {
          updated[i].result = (await res.json()) as MarkingResult;
        }
      } catch { /* ignore — show partial results */ }
    }
    setStationResults(updated);
    setPhase("report");
  };

  const advanceFromBreak = () => {
    if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    setCurrentStationIdx((prev) => prev + 1);
    setPhase("brief");
  };

  if (!simSession || phase === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading simulation...</p>
        </div>
      </div>
    );
  }

  // ─── BRIEF PHASE ─────────────────────────────────────────────────────────────
  if (phase === "brief" && currentCase) {
    const rm = Math.floor(readingSecondsLeft / 60);
    const rs = readingSecondsLeft % 60;
    const readingPct = ((READING_SECONDS - readingSecondsLeft) / READING_SECONDS) * 100;

    return (
      <div className="min-h-screen bg-slate-200">
        <header className="bg-white border-b border-slate-300 shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">
                Station {currentStationIdx + 1} of {simSession.stationCount}
              </div>
              <div className="text-sm font-bold text-slate-800">Reading time</div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`font-mono font-bold text-xl ${readingSecondsLeft <= 30 ? "text-orange-600" : "text-slate-800"}`}>
                {String(rm).padStart(2, "0")}:{String(rs).padStart(2, "0")}
              </div>
              {readingSecondsLeft === 0 && (
                <button onClick={startStation} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm">
                  Start station →
                </button>
              )}
            </div>
          </div>
          <div className="h-1 bg-slate-100">
            <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${readingPct}%` }} />
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white shadow-md border border-slate-300 px-8 py-10">
            <div className="text-center border-b border-slate-300 pb-6 mb-6">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-1">RACGP Clinical Competency Examination</p>
              <h2 className="text-xl font-bold text-slate-900">Station {currentStationIdx + 1}</h2>
              <p className="text-sm text-slate-600 mt-3 font-medium">{currentCase.id.toUpperCase()}</p>
            </div>
            <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              {currentCase.scenario}
            </div>
          </div>
          {readingSecondsLeft === 0 && (
            <div className="text-center mt-6">
              <button onClick={startStation} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3.5 rounded-2xl">
                Start station →
              </button>
            </div>
          )}
          {readingSecondsLeft > 0 && (
            <div className="text-center mt-4">
              <button onClick={startStation} className="text-xs text-slate-400 hover:text-slate-600 underline">
                Skip reading time (not exam-accurate)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── EXAM PHASE ──────────────────────────────────────────────────────────────
  if (phase === "exam" && currentCase) {
    const remaining = Math.max(0, TOTAL_EXAM_SECONDS - elapsedSeconds);
    const remM = Math.floor(remaining / 60);
    const remS = remaining % 60;
    const showWarning = isTimerStarted && !isTimeUp && elapsedSeconds >= WARNING_AT;

    return (
      <div className="flex flex-col h-screen bg-slate-900">
        <header className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Station {currentStationIdx + 1}/{simSession.stationCount} · {currentCase.patientName}
            </div>
            <div className={`font-mono text-xl font-bold tabular-nums ${!isTimerStarted ? "text-slate-500" : remaining <= 60 ? "text-red-400 animate-pulse" : remaining <= 120 ? "text-orange-300" : "text-slate-100"}`}>
              {String(remM).padStart(2, "0")}:{String(remS).padStart(2, "0")}
            </div>
          </div>
        </header>

        {showWarning && (
          <div className="bg-amber-700/80 border-b border-amber-600 flex-shrink-0 text-center py-2">
            <span className="text-amber-100 text-sm font-bold">⚠️ 2 minutes remaining</span>
          </div>
        )}
        {isTimeUp && (
          <div className="bg-red-800/90 border-b border-red-700 flex-shrink-0 text-center py-2">
            <span className="text-red-100 text-sm font-bold">⏰ Time up — station ending</span>
          </div>
        )}
        {!isTimerStarted && (
          <div className="bg-slate-700/60 border-b border-slate-600 flex-shrink-0 text-center py-1.5">
            <span className="text-slate-400 text-xs">Timer starts when you speak your first answer</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.filter(m => !m.content.startsWith("[SYSTEM:")).map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "candidate" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${msg.role === "examiner" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"}`}>
                  {msg.role === "examiner" ? "E" : "Y"}
                </div>
                <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "examiner" ? "bg-slate-700 text-slate-100 rounded-tl-sm" : "bg-emerald-700 text-white rounded-tr-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isExaminerTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white text-sm">E</div>
                <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  {[0,150,300].map(d => <div key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {!isTimeUp && (
          <div className="bg-slate-800 border-t border-slate-700 flex-shrink-0">
            <div className="max-w-4xl mx-auto px-4 py-4">
              {!useManualMode ? (
                <div className="flex items-center gap-3">
                  <div className="text-slate-400 text-sm flex-1">
                    Voice mode disabled in simulation — use text
                  </div>
                  <button onClick={() => setUseManualMode(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm">
                    Type answer
                  </button>
                  <button onClick={handleNextQuestion} disabled={isExaminerTyping} className="text-xs text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 px-3 py-1.5 rounded-lg">
                    Next Q →
                  </button>
                  <button onClick={endCurrentStation} className="text-xs text-slate-400 hover:text-red-400 bg-slate-700 px-3 py-1.5 rounded-lg">
                    End station
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (manualInput.trim()) { submitCandidateMessage(manualInput.trim()); setManualInput(""); } } }}
                    placeholder="Type your answer..."
                    rows={2}
                    disabled={isExaminerTyping}
                    className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600 min-h-[60px] max-h-[120px]"
                  />
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { if (manualInput.trim()) { submitCandidateMessage(manualInput.trim()); setManualInput(""); } }} disabled={!manualInput.trim() || isExaminerTyping} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm">Send</button>
                    <button onClick={handleNextQuestion} disabled={isExaminerTyping} className="text-xs text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 px-3 py-1.5 rounded-lg">Next Q →</button>
                    <button onClick={endCurrentStation} className="text-xs text-slate-400 hover:text-red-400 bg-slate-700 px-3 py-1.5 rounded-lg">End</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── BREAK PHASE ─────────────────────────────────────────────────────────────
  if (phase === "break") {
    const bm = Math.floor(breakSecondsLeft / 60);
    const bs = breakSecondsLeft % 60;
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-400 text-sm mb-2">Station {currentStationIdx + 1} complete</div>
          <h2 className="text-3xl font-bold text-white mb-1">Break</h2>
          <div className="font-mono text-6xl font-bold text-blue-300 my-6">
            {String(bm).padStart(2, "0")}:{String(bs).padStart(2, "0")}
          </div>
          <p className="text-slate-400 text-sm mb-6">
            {simSession.stationCount - currentStationIdx - 1} station{simSession.stationCount - currentStationIdx - 1 !== 1 ? "s" : ""} remaining
          </p>
          {breakSecondsLeft === 0 && (
            <button onClick={advanceFromBreak} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl">
              Next station →
            </button>
          )}
          <div className="mt-4">
            <button onClick={advanceFromBreak} className="text-xs text-slate-500 hover:text-slate-300 underline">
              Skip break (not exam-accurate)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── EVALUATING PHASE ────────────────────────────────────────────────────────
  if (phase === "evaluating") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Marking your performance...</h2>
          <p className="text-slate-500 text-sm">
            Evaluating station {currentEvalIdx + 1} of {stationResults.length}
          </p>
          <p className="text-slate-400 text-xs mt-2">Please wait — feedback will appear when all stations are marked</p>
        </div>
      </div>
    );
  }

  // ─── REPORT PHASE ────────────────────────────────────────────────────────────
  if (phase === "report") {
    const passCount = stationResults.filter(
      (r) => r.result && ["at_expected_standard", "above_standard"].includes(r.result.overallRating)
    ).length;

    return (
      <main className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Simulation Complete</h1>
              <p className="text-sm text-slate-500">
                {simSession.stationCount} stations · {passCount}/{simSession.stationCount} at standard
              </p>
            </div>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
              Back to home
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          {/* Overall banner */}
          <div className={`rounded-2xl p-5 text-center ${passCount >= Math.ceil(simSession.stationCount * 0.5) ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className={`text-2xl font-bold ${passCount >= Math.ceil(simSession.stationCount * 0.5) ? "text-green-800" : "text-red-800"}`}>
              {passCount >= Math.ceil(simSession.stationCount * 0.5) ? "Overall: PASS" : "Overall: FAIL"}
            </div>
            <p className={`text-sm mt-1 ${passCount >= Math.ceil(simSession.stationCount * 0.5) ? "text-green-600" : "text-red-600"}`}>
              {passCount} of {simSession.stationCount} stations at or above expected standard
            </p>
          </div>

          {/* Per-station results */}
          <h2 className="font-semibold text-slate-700 text-lg">Station results</h2>
          {stationResults.map((sr, idx) => {
            const c = getCaseById(sr.caseId);
            const rating = sr.result?.overallRating;
            const passed = rating && ["at_expected_standard", "above_standard"].includes(rating);
            const m = Math.floor(sr.durationSeconds / 60);
            const s = sr.durationSeconds % 60;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-xs text-slate-400 mb-0.5">Station {idx + 1}</div>
                    <h3 className="font-semibold text-slate-900">{c?.patientName ?? sr.caseId}</h3>
                    <p className="text-xs text-slate-500">{c?.topics[0]}</p>
                  </div>
                  {rating ? (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${OVERALL_RATING_COLORS[rating]}`}>
                      {OVERALL_RATING_LABELS[rating]}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not marked</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Duration: {m}m {s}s</span>
                  {passed !== undefined && (
                    <span className={passed ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {passed ? "✓ Pass" : "✗ Fail"}
                    </span>
                  )}
                </div>
                {sr.result && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed">{sr.result.overallJustification}</p>
                    {sr.result.areasForImprovement.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs font-semibold text-slate-500 mb-1">Priority improvements:</div>
                        <ul className="space-y-0.5">
                          {sr.result.areasForImprovement.slice(0, 2).map((item, i) => (
                            <li key={i} className="text-xs text-slate-600 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-slate-400">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="text-center pt-4">
            <Link href="/exam-sim" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              New simulation
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
