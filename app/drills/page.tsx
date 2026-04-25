"use client";

import Link from "next/link";
import { DRILLS } from "@/data/drills";

export default function DrillsHomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to cases
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Communication Micro-Drills</h1>
        <p className="text-slate-500 mt-1">
          Fast 3-5 minute drills for high-yield CCE communication skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DRILLS.map((drill) => (
          <Link
            key={drill.id}
            href={`/drills/${drill.id}`}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold text-slate-900">{drill.title}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {drill.estimatedMinutes} min
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-2">{drill.targetSkill}</p>
            <p className="text-xs text-slate-500 mt-3">{drill.variants[0]?.scenario}</p>
            <p className="text-xs text-indigo-600 mt-2 font-medium">
              {drill.variants.length} scenario variants
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
