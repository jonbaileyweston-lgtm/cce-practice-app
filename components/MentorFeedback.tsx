"use client";

import type { MarkingResult } from "@/types";

interface MentorFeedbackProps {
  result: MarkingResult;
}

export default function MentorFeedback({ result }: MentorFeedbackProps) {
  const topThreeChanges =
    result.topThreeChangesToPass.length === 3
      ? result.topThreeChangesToPass
      : result.areasForImprovement.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Borderline-to-pass coaching */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
        <h3 className="font-semibold text-indigo-900 flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span> Top 3 changes that would lift this station to pass
        </h3>
        <ul className="space-y-2">
          {topThreeChanges.map((change, i) => (
            <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
              <span className="text-indigo-500 font-bold flex-shrink-0">{i + 1}.</span>
              {change}
            </li>
          ))}
        </ul>
      </div>

      {/* Overall strengths + improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <h3 className="font-semibold text-green-900 flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span> What you did well
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li
                key={i}
                className="text-sm text-green-800 flex items-start gap-2"
              >
                <span className="text-green-600 mt-0.5 flex-shrink-0">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-semibold text-amber-900 flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span> Areas to improve
          </h3>
          <ul className="space-y-2">
            {result.areasForImprovement.map((a, i) => (
              <li
                key={i}
                className="text-sm text-amber-800 flex items-start gap-2"
              >
                <span className="text-amber-600 mt-0.5 flex-shrink-0">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">
          Question-by-question feedback
        </h3>
        <div className="space-y-3">
          {result.perQuestionFeedback.map((qf) => (
            <details
              key={qf.questionNumber}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm group"
              open={qf.gaps.length > 0 || qf.keyPointsMissed.length > 0}
            >
              <summary className="px-5 py-4 cursor-pointer select-none flex items-center gap-3 list-none">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {qf.questionNumber}
                </div>
                <p className="text-sm text-slate-700 font-medium flex-1 leading-snug">
                  {qf.questionText}
                </p>
                <span className="text-slate-400 text-sm flex-shrink-0 group-open:rotate-180 transition-transform">
                  ▾
                </span>
              </summary>

              <div className="px-5 pb-4 border-t border-slate-100 pt-3 space-y-3">
                {qf.strengths.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                      Strengths
                    </div>
                    <ul className="space-y-1">
                      {qf.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {qf.gaps.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
                      Gaps
                    </div>
                    <ul className="space-y-1">
                      {qf.gaps.map((g, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-orange-500 flex-shrink-0 mt-0.5">△</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {qf.keyPointsMissed.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                      Key points a competent candidate would mention
                    </div>
                    <ul className="space-y-1">
                      {qf.keyPointsMissed.map((k, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-red-400 flex-shrink-0 mt-0.5">→</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Study tips */}
      {result.studyTips.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
            <span className="text-lg">📚</span> Study tips for next time
          </h3>
          <ul className="space-y-2">
            {result.studyTips.map((tip, i) => (
              <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-blue-500 font-bold flex-shrink-0">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
