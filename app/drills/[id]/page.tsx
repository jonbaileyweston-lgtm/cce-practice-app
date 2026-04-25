"use client";

import { use, useState } from "react";
import Link from "next/link";
import { getDrillById } from "@/data/drills";
import { notFound } from "next/navigation";

type DrillMessage = {
  role: "patient" | "candidate";
  content: string;
};

type DrillFeedback = {
  overallRating: "pass" | "needs_work";
  strengths: string[];
  gaps: string[];
  topThreeChangesToPass: string[];
  immediateRetryInstruction: string;
};

export default function DrillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const drill = getDrillById(id);
  if (!drill) notFound();

  const pickVariant = () =>
    drill.variants[Math.floor(Math.random() * drill.variants.length)];

  const [variant, setVariant] = useState(pickVariant());
  const [messages, setMessages] = useState<DrillMessage[]>([
    { role: "patient", content: variant.openingPrompt },
  ]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [candidateInput, setCandidateInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<DrillFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startMs] = useState<number>(Date.now());

  const canAdvancePrompt = promptIndex < variant.followUpPrompts.length;

  const submitCandidateTurn = () => {
    const content = candidateInput.trim();
    if (!content) return;
    setMessages((prev) => [...prev, { role: "candidate", content }]);
    setCandidateInput("");
    setError(null);
  };

  const addFollowUpPrompt = () => {
    if (!canAdvancePrompt) return;
    const nextPrompt = variant.followUpPrompts[promptIndex];
    setMessages((prev) => [...prev, { role: "patient", content: nextPrompt }]);
    setPromptIndex((i) => i + 1);
  };

  const loadNewScenario = () => {
    const next = pickVariant();
    setVariant(next);
    setMessages([{ role: "patient", content: next.openingPrompt }]);
    setPromptIndex(0);
    setCandidateInput("");
    setFeedback(null);
    setError(null);
  };

  const evaluateDrill = async () => {
    setIsSubmitting(true);
    setError(null);
    setFeedback(null);
    const durationSeconds = Math.max(1, Math.round((Date.now() - startMs) / 1000));
    try {
      const res = await fetch("/api/drills/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drillId: drill.id,
          messages,
          durationSeconds,
        }),
      });
      const data = (await res.json()) as DrillFeedback | { error: string };
      if (!res.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Evaluation failed");
      }
      setFeedback(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not evaluate drill. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <Link href="/drills" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to drills
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">{drill.title}</h1>
        <p className="text-sm text-slate-500 mt-1">
          Target: {drill.targetSkill} · {drill.estimatedMinutes} min
        </p>
        <p className="text-xs text-indigo-600 mt-1">
          Scenario variant: {variant.id} ({drill.variants.length} total)
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h2 className="font-semibold text-blue-900 mb-2">Scenario</h2>
        <p className="text-sm text-blue-800">{variant.scenario}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Drill conversation</h2>
        </div>
        <div className="p-5 space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className="text-sm">
              <span
                className={`font-semibold ${
                  m.role === "patient" ? "text-blue-700" : "text-emerald-700"
                }`}
              >
                {m.role === "patient" ? "Patient" : "You"}:
              </span>{" "}
              <span className="text-slate-700">{m.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
        <label className="text-sm font-medium text-slate-700">Your response</label>
        <textarea
          value={candidateInput}
          onChange={(e) => setCandidateInput(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type what you would say to the patient..."
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={submitCandidateTurn}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Add response
          </button>
          <button
            onClick={addFollowUpPrompt}
            disabled={!canAdvancePrompt}
            className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Add follow-up prompt
          </button>
          <button
            onClick={evaluateDrill}
            disabled={isSubmitting || messages.filter((m) => m.role === "candidate").length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {isSubmitting ? "Evaluating..." : "Get drill feedback"}
          </button>
          <button
            onClick={loadNewScenario}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            New scenario
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {feedback && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Drill feedback</h2>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                feedback.overallRating === "pass"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {feedback.overallRating === "pass" ? "PASS" : "NEEDS WORK"}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Top 3 changes to pass
            </h3>
            <ul className="space-y-1">
              {feedback.topThreeChangesToPass.map((c, i) => (
                <li key={i} className="text-sm text-slate-700">
                  {i + 1}. {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-green-700 mb-2">Strengths</h3>
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-slate-700">• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-700 mb-2">Gaps</h3>
              <ul className="space-y-1">
                {feedback.gaps.map((g, i) => (
                  <li key={i} className="text-sm text-slate-700">• {g}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
            <h3 className="text-sm font-semibold text-indigo-800">Immediate retry instruction</h3>
            <p className="text-sm text-indigo-700 mt-1">
              {feedback.immediateRetryInstruction}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
