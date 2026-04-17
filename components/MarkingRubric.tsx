"use client";

import type {
  MarkingResult,
  CompetencyRating,
  OverallRating,
} from "@/types";
import {
  RATING_LABELS,
  RATING_COLORS,
  OVERALL_RATING_LABELS,
  OVERALL_RATING_COLORS,
} from "@/types";

interface MarkingRubricProps {
  result: MarkingResult;
}

const RATING_DOT: Record<CompetencyRating, string> = {
  not_demonstrated: "bg-red-500",
  not_clearly_demonstrated: "bg-orange-400",
  satisfactorily_demonstrated: "bg-yellow-400",
  fully_demonstrated: "bg-green-500",
};

// Group rubric results by domain
function groupByDomain(result: MarkingResult) {
  const grouped: Record<
    string,
    { domainNumber: number; items: typeof result.rubricResults }
  > = {};

  for (const item of result.rubricResults) {
    const domain = item.rubricItem.domain;
    if (!grouped[domain]) {
      grouped[domain] = {
        domainNumber: item.rubricItem.domainNumber,
        items: [],
      };
    }
    grouped[domain].items.push(item);
  }

  return Object.entries(grouped).sort(
    ([, a], [, b]) => a.domainNumber - b.domainNumber
  );
}

export default function MarkingRubric({ result }: MarkingRubricProps) {
  const grouped = groupByDomain(result);

  // Calculate summary stats
  const ratings = result.rubricResults.map((r) => r.rating);
  const fullyDemonstrated = ratings.filter((r) => r === "fully_demonstrated").length;
  const satisfactorily = ratings.filter((r) => r === "satisfactorily_demonstrated").length;
  const notClearly = ratings.filter((r) => r === "not_clearly_demonstrated").length;
  const notDemonstrated = ratings.filter((r) => r === "not_demonstrated").length;
  const total = ratings.length;

  const overallColorClass =
    OVERALL_RATING_COLORS[result.overallRating as OverallRating] ??
    "bg-slate-600 text-white";

  return (
    <div className="space-y-6">
      {/* Overall rating banner */}
      <div className={`rounded-2xl p-6 ${overallColorClass}`}>
        <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
          Examiner&apos;s Overall Rating
        </div>
        <div className="text-2xl font-bold">
          {OVERALL_RATING_LABELS[result.overallRating as OverallRating]}
        </div>
        <p className="text-sm mt-2 opacity-90">{result.overallJustification}</p>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Fully demonstrated", count: fullyDemonstrated, color: "text-green-700 bg-green-50 border-green-200" },
          { label: "Satisfactorily demonstrated", count: satisfactorily, color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
          { label: "Not clearly demonstrated", count: notClearly, color: "text-orange-700 bg-orange-50 border-orange-200" },
          { label: "Not demonstrated", count: notDemonstrated, color: "text-red-700 bg-red-50 border-red-200" },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border px-4 py-3 text-center ${s.color}`}
          >
            <div className="text-2xl font-bold">
              {s.count}/{total}
            </div>
            <div className="text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rubric table by domain */}
      <div className="space-y-4">
        {grouped.map(([domain, { items }]) => (
          <div
            key={domain}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">{domain}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div key={item.rubricItem.code} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {item.rubricItem.code}
                        </span>
                        <span className="text-sm text-slate-800 font-medium leading-snug">
                          {item.rubricItem.description}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.justification}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                          RATING_COLORS[item.rating as CompetencyRating] ??
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            RATING_DOT[item.rating as CompetencyRating] ??
                            "bg-slate-400"
                          }`}
                        />
                        {RATING_LABELS[item.rating as CompetencyRating] ??
                          item.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
