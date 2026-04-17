"use client";

import Link from "next/link";
import type { Case } from "@/types";

const TOPIC_COLORS: Record<string, string> = {
  "Thyrotoxicosis": "bg-red-100 text-red-700",
  "Thyroid Storm": "bg-red-100 text-red-700",
  "Urgent Management": "bg-orange-100 text-orange-700",
  "Endocrinology": "bg-purple-100 text-purple-700",
  "Skin Cancer": "bg-yellow-100 text-yellow-700",
  "Squamous Cell Carcinoma": "bg-yellow-100 text-yellow-700",
  "Preventive Health": "bg-green-100 text-green-700",
  "Recall Systems": "bg-green-100 text-green-700",
  "Type 1 Diabetes": "bg-blue-100 text-blue-700",
  "DKA": "bg-blue-100 text-blue-700",
  "Paediatrics": "bg-cyan-100 text-cyan-700",
  "Rural Medicine": "bg-teal-100 text-teal-700",
  "Emergency Management": "bg-red-100 text-red-700",
  "Bradycardia": "bg-indigo-100 text-indigo-700",
  "Aortic Stenosis": "bg-indigo-100 text-indigo-700",
  "Syncope": "bg-violet-100 text-violet-700",
  "Falls Risk": "bg-amber-100 text-amber-700",
  "Cervical Spine Injury": "bg-rose-100 text-rose-700",
  "Postpartum Psychosis": "bg-pink-100 text-pink-700",
  "Perinatal Mental Health": "bg-pink-100 text-pink-700",
  "Aboriginal Health": "bg-orange-100 text-orange-700",
  "Cultural Safety": "bg-orange-100 text-orange-700",
};

const DEFAULT_TAG_COLOR = "bg-slate-100 text-slate-600";

const CASE_ICONS: Record<string, string> = {
  hunt: "🫀",
  jones: "🔬",
  keating: "🩸",
  morral: "💓",
  simkins: "🧠",
};

interface CaseCardProps {
  caseData: Case;
  completedCount?: number;
}

export default function CaseCard({ caseData, completedCount = 0 }: CaseCardProps) {
  return (
    <Link href={`/case/${caseData.id}`} className="group block">
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 p-6 h-full flex flex-col">
        {completedCount > 0 && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {completedCount}× done
          </div>
        )}

        {/* Icon + name */}
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl" role="img" aria-label="case icon">
            {CASE_ICONS[caseData.id] ?? "📋"}
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors text-lg leading-tight">
              {caseData.patientName}
            </h3>
            <p className="text-sm text-slate-500">
              {caseData.patientAge} years, {caseData.patientGender === "F" ? "Female" : "Male"}
            </p>
          </div>
        </div>

        {/* Presenting complaint */}
        <p className="text-sm text-slate-600 mb-4 flex-1 leading-relaxed">
          {caseData.presentingComplaint}
        </p>

        {/* Topic tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {caseData.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                TOPIC_COLORS[topic] ?? DEFAULT_TAG_COLOR
              }`}
            >
              {topic}
            </span>
          ))}
          {caseData.topics.length > 3 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DEFAULT_TAG_COLOR}`}>
              +{caseData.topics.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {caseData.questions.length} questions · 15 min
          </span>
          <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
            Start →
          </span>
        </div>
      </div>
    </Link>
  );
}
