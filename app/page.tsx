"use client";

import { useState } from "react";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/data/cases";
import type { PerformancePattern, RacgpDomain } from "@/types";
import { PERFORMANCE_PATTERN_LABELS, RACGP_DOMAIN_LABELS } from "@/types";
import Link from "next/link";
import {
  getSessionHistory,
  getLastSessionForCase,
  getDomainSummaries,
  getPatternSummaries,
  getCasesForSpacedRepetition,
  getCompletedCountForCase,
  clearHistory,
  type SessionRecord,
  type DomainSummary,
  type PatternSummary,
} from "@/lib/analytics";

const DOMAIN_HEAT_COLORS: Record<string, string> = {
  strong: "bg-green-100 border-green-300 text-green-800",
  ok: "bg-blue-50 border-blue-200 text-blue-800",
  weak: "bg-red-100 border-red-300 text-red-800",
  untested: "bg-slate-100 border-slate-200 text-slate-500",
};

function domainHeatLevel(summary: DomainSummary | undefined): "strong" | "ok" | "weak" | "untested" {
  if (!summary || summary.attemptCount === 0) return "untested";
  if (summary.averageScore >= 2.5) return "strong";
  if (summary.averageScore >= 1.5) return "ok";
  return "weak";
}

function patternHeatLevel(summary: PatternSummary | undefined): "strong" | "ok" | "weak" | "untested" {
  if (!summary || summary.attemptCount === 0) return "untested";
  if (summary.averageScore >= 2.5) return "strong";
  if (summary.averageScore >= 1.5) return "ok";
  return "weak";
}

const ALL_DOMAINS: RacgpDomain[] = [
  "undifferentiated",
  "chronic_disease",
  "mental_health",
  "paediatrics",
  "womens_health",
  "older_patient",
  "preventive",
  "difficult_conversation",
  "aboriginal_health",
  "rural_remote",
];

const ALL_PATTERNS: PerformancePattern[] = [
  "red_flag_triage",
  "preventive_opportunism",
  "shared_decision_making",
  "safety_netting",
  "ice_elicitation",
  "explanation_plain_language",
];

export default function Home() {
  const [, setRefreshKey] = useState(0);

  const history = getSessionHistory();
  const reviewCases = getCasesForSpacedRepetition();
  const sessions: Record<string, SessionRecord | undefined> = {};
  const counts: Record<string, number> = {};
  for (const c of CASES) {
    sessions[c.id] = getLastSessionForCase(c.id);
    counts[c.id] = getCompletedCountForCase(c.id);
  }
  const sessionHistory = history;
  const domainSummaries = getDomainSummaries();
  const patternSummaries = getPatternSummaries();
  const reviewCaseIds = new Set(reviewCases.map((c) => c.id));
  const lastSessions = sessions;
  const completedCounts = counts;

  const totalAttempts = sessionHistory.length;
  const passCount = sessionHistory.filter((s) =>
    ["at_expected_standard", "above_standard"].includes(s.overallRating)
  ).length;

  const summaryByDomain: Record<RacgpDomain, DomainSummary | undefined> = {} as never;
  for (const d of domainSummaries) {
    summaryByDomain[d.domain] = d;
  }
  const summaryByPattern: Record<PerformancePattern, PatternSummary | undefined> = {} as never;
  for (const p of patternSummaries) {
    summaryByPattern[p.pattern] = p;
  }

  const handleClearHistory = () => {
    clearHistory();
    setRefreshKey((k) => k + 1);
  };

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 text-white rounded-xl p-3 text-2xl shadow-sm">🩺</div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">CCE Practice</h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  RACGP Clinical Competency Exam — Voice Case Discussion Practice
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/drills"
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Micro-drills
              </Link>
              <Link
                href="/exam-sim"
                className="flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Exam simulation
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* How it works */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h2 className="font-semibold text-blue-900 mb-2 text-base">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>Pick a case and read the 5-minute candidate brief</span>
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

        {/* Performance dashboard — only shown after first attempt */}
        {totalAttempts > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-700">Your Performance</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  {totalAttempts} attempt{totalAttempts !== 1 ? "s" : ""} · {passCount} pass{passCount !== 1 ? "es" : ""}
                </span>
              </div>
            </div>

            {/* Domain heat map */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
              <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                Domain performance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {ALL_DOMAINS.map((domain) => {
                  const summary = summaryByDomain[domain];
                  const heat = domainHeatLevel(summary);
                  const color = DOMAIN_HEAT_COLORS[heat];
                  return (
                    <div
                      key={domain}
                      className={`rounded-xl border px-3 py-2.5 text-center ${color}`}
                    >
                      <div className="text-xs font-semibold leading-tight">
                        {RACGP_DOMAIN_LABELS[domain]}
                      </div>
                      {summary && summary.attemptCount > 0 ? (
                        <div className="text-xs mt-1 opacity-70">
                          {summary.attemptCount} attempt{summary.attemptCount !== 1 ? "s" : ""}
                        </div>
                      ) : (
                        <div className="text-xs mt-1 opacity-50">Not attempted</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Strong
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> OK
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Needs work
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Not attempted
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
              <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                Pattern performance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_PATTERNS.map((pattern) => {
                  const summary = summaryByPattern[pattern];
                  const heat = patternHeatLevel(summary);
                  const color = DOMAIN_HEAT_COLORS[heat];
                  return (
                    <div
                      key={pattern}
                      className={`rounded-xl border px-3 py-2.5 text-center ${color}`}
                    >
                      <div className="text-xs font-semibold leading-tight">
                        {PERFORMANCE_PATTERN_LABELS[pattern]}
                      </div>
                      {summary && summary.attemptCount > 0 ? (
                        <div className="text-xs mt-1 opacity-70">
                          {summary.attemptCount} scored attempt{summary.attemptCount !== 1 ? "s" : ""}
                        </div>
                      ) : (
                        <div className="text-xs mt-1 opacity-50">No signal yet</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Pattern scores are inferred from rubric outcomes to surface cross-case communication and safety gaps.
              </p>
            </div>

            {reviewCaseIds.size > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <strong>Spaced repetition:</strong>{" "}
                {reviewCaseIds.size} case{reviewCaseIds.size !== 1 ? "s are" : " is"} due for review — these are marked below.
              </div>
            )}
          </section>
        )}

        {/* Cases grid */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Choose a Case ({CASES.length} available)
          </h2>
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-500">
            <span className="font-medium text-slate-600">Modes:</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Case Discussion = examiner Q&A
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Recorded Consultation = patient interaction
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASES.map((c) => (
              <CaseCard
                key={c.id}
                caseData={c}
                completedCount={completedCounts[c.id] ?? 0}
                lastSession={lastSessions[c.id]}
                isDueForReview={reviewCaseIds.has(c.id)}
              />
            ))}
          </div>
        </section>

        {totalAttempts > 0 && (
          <div className="text-center">
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear all session history
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
