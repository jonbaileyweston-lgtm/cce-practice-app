"use client";

import { useEffect, useState } from "react";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/data/cases";

interface SessionHistoryEntry {
  caseId: string;
  completedAt: number;
}

export default function Home() {
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cce-session-history");
      if (stored) {
        setSessionHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const getCompletedCount = (caseId: string) =>
    sessionHistory.filter((s) => s.caseId === caseId).length;

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white rounded-xl p-3 text-2xl shadow-sm">🩺</div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                CCE Practice
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                RACGP Clinical Competency Exam — Voice Case Discussion Practice
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* How it works banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-blue-900 mb-2 text-base">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>Pick a case and read the patient scenario</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <span>Speak your answers — the AI examiner listens and responds</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <span>Complete all questions within 15 minutes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <span>Get your rubric marks and mentor feedback instantly</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3">
            💡 Use <strong>Chrome</strong> or <strong>Edge</strong> for the best voice experience. Allow microphone access when prompted.
          </p>
        </div>

        {/* Cases grid */}
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Choose a Case ({CASES.length} available)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASES.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              completedCount={getCompletedCount(c.id)}
            />
          ))}
        </div>

        {sessionHistory.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                localStorage.removeItem("cce-session-history");
                setSessionHistory([]);
              }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear session history
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
