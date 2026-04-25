"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CASES } from "@/data/cases";
import { RACGP_DOMAIN_LABELS, DIFFICULTY_LABELS } from "@/types";

type StationCount = 6 | 12;

interface SimSession {
  stationCount: StationCount;
  caseIds: string[];
  createdAt: number;
}

export default function ExamSimConfigPage() {
  const router = useRouter();
  const [stationCount, setStationCount] = useState<StationCount>(6);
  const [selectionMode, setSelectionMode] = useState<"random" | "manual">("random");
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);

  const handleToggleCase = (id: string) => {
    setSelectedCaseIds((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < stationCount
        ? [...prev, id]
        : prev
    );
  };

  const handleStart = () => {
    let caseIds: string[];

    if (selectionMode === "random") {
      const shuffled = [...CASES].sort(() => Math.random() - 0.5);
      caseIds = shuffled.slice(0, stationCount).map((c) => c.id);
    } else {
      if (selectedCaseIds.length < stationCount) {
        alert(`Please select exactly ${stationCount} cases.`);
        return;
      }
      caseIds = selectedCaseIds.slice(0, stationCount);
    }

    const session: SimSession = {
      stationCount,
      caseIds,
      createdAt: Date.now(),
    };
    const sessionId = `sim-${Date.now()}`;
    sessionStorage.setItem(`cce-sim-${sessionId}`, JSON.stringify(session));
    router.push(`/exam-sim/${sessionId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
              ← Back to cases
            </Link>
            <h1 className="text-xl font-bold text-slate-900 mt-1">Exam Simulation</h1>
            <p className="text-sm text-slate-500">
              Run a full mock CCE sitting with consecutive stations and deferred feedback
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Station count */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Number of stations</h2>
          <div className="flex gap-4">
            {([6, 12] as StationCount[]).map((n) => (
              <button
                key={n}
                onClick={() => {
                  setStationCount(n);
                  setSelectedCaseIds([]);
                }}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  stationCount === n
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                }`}
              >
                {n} stations
                <span className={`block text-xs font-normal mt-0.5 ${stationCount === n ? "text-blue-100" : "text-slate-400"}`}>
                  {n === 6 ? "~60 minutes" : "~120 minutes"}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-700">
            Real CCE format: {stationCount === 6 ? "6" : "12"} stations · 15 min each · 2 min break between stations · Feedback after all stations
          </div>
        </section>

        {/* Case selection */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Case selection</h2>
          <div className="flex gap-3 mb-5">
            {(["random", "manual"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => { setSelectionMode(mode); setSelectedCaseIds([]); }}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectionMode === mode
                    ? "bg-slate-800 border-slate-800 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {mode === "random" ? "Random selection" : "Choose cases"}
              </button>
            ))}
          </div>

          {selectionMode === "manual" && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                Select {stationCount} cases ({selectedCaseIds.length}/{stationCount} selected):
              </p>
              {CASES.map((c) => {
                const isSelected = selectedCaseIds.includes(c.id);
                const isDisabled = !isSelected && selectedCaseIds.length >= stationCount;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleToggleCase(c.id)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-300"
                        : isDisabled
                        ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                        isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 text-sm">{c.patientName}</div>
                      <div className="text-xs text-slate-500 truncate">{c.presentingComplaint}</div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-slate-400">{RACGP_DOMAIN_LABELS[c.domain]}</div>
                      <div className="text-xs text-slate-400">{DIFFICULTY_LABELS[c.difficulty]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectionMode === "random" && (
            <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600">
              {stationCount} cases will be randomly selected from the library when you start.
            </div>
          )}
        </section>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            disabled={selectionMode === "manual" && selectedCaseIds.length < stationCount}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-10 py-4 rounded-2xl shadow-sm transition-colors text-base"
          >
            Start simulation →
          </button>
          <p className="text-xs text-slate-400 mt-3">
            Feedback is withheld until all {stationCount} stations are complete — matching real CCE format
          </p>
        </div>
      </div>
    </main>
  );
}
