"use client";

import Link from "next/link";
import type { Case } from "@/types";
import { DIFFICULTY_LABELS, RACGP_DOMAIN_LABELS } from "@/types";
import type { SessionRecord } from "@/lib/analytics";
import { OVERALL_RATING_LABELS } from "@/types";

const CASE_ICONS: Record<string, string> = {
  hunt: "🫀",
  jones: "🔬",
  keating: "🩸",
  morral: "💓",
  simkins: "🧠",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  standard: "bg-green-100 text-green-700 border-green-200",
  challenging: "bg-orange-100 text-orange-700 border-orange-200",
  complex: "bg-red-100 text-red-700 border-red-200",
};

const OVERALL_BADGE_COLORS: Record<string, string> = {
  clearly_below_standard: "bg-red-100 text-red-700",
  below_expected_standard: "bg-orange-100 text-orange-700",
  borderline: "bg-yellow-100 text-yellow-700",
  at_expected_standard: "bg-blue-100 text-blue-700",
  above_standard: "bg-green-100 text-green-700",
};

interface CaseCardProps {
  caseData: Case;
  completedCount?: number;
  lastSession?: SessionRecord;
  isDueForReview?: boolean;
}

export default function CaseCard({
  caseData,
  completedCount = 0,
  lastSession,
  isDueForReview = false,
}: CaseCardProps) {
  const domainLabel = RACGP_DOMAIN_LABELS[caseData.domain] ?? caseData.domain;
  const difficultyLabel = DIFFICULTY_LABELS[caseData.difficulty] ?? caseData.difficulty;
  const difficultyColor =
    DIFFICULTY_COLORS[caseData.difficulty] ?? "bg-slate-100 text-slate-600";

  const lastRatingLabel = lastSession
    ? OVERALL_RATING_LABELS[lastSession.overallRating]
    : null;
  const lastRatingColor = lastSession
    ? OVERALL_BADGE_COLORS[lastSession.overallRating] ?? "bg-slate-100 text-slate-600"
    : null;

  const lastAttemptDate = lastSession
    ? new Date(lastSession.completedAt).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <Link href={`/case/${caseData.id}`} className="group block">
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 p-5 h-full flex flex-col">
        {/* Top badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {isDueForReview && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 animate-pulse">
                Due for review
              </span>
            )}
            {lastSession?.missedDiagnosis && (
              <span
                className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200"
                title="Diagnosis was not clearly reached in the last attempt"
              >
                Missed dx
              </span>
            )}
          </div>
          {completedCount > 0 && (
            <div className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
              {completedCount}× done
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl" role="img" aria-label="case icon">
            {CASE_ICONS[caseData.id] ?? "📋"}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-lg leading-tight truncate">
              {caseData.patientName}
            </h3>
            <p className="text-sm text-slate-500">
              {caseData.patientAge} years, {caseData.patientGender === "F" ? "Female" : "Male"}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 flex-1 leading-relaxed">
          {caseData.presentingComplaint}
        </p>

        {/* Domain + difficulty tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {domainLabel}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor}`}
          >
            {difficultyLabel}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {lastRatingLabel && lastRatingColor ? (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full truncate ${lastRatingColor}`}>
                Last: {lastRatingLabel}
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                {caseData.questions.length} questions · 10 min
              </span>
            )}
            {lastAttemptDate && (
              <span className="text-xs text-slate-400 flex-shrink-0">{lastAttemptDate}</span>
            )}
          </div>
          <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700 flex-shrink-0">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}
