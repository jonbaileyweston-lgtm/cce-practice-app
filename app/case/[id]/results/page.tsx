"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getCaseById } from "@/data/cases";
import { notFound } from "next/navigation";
import MarkingRubric from "@/components/MarkingRubric";
import MentorFeedback from "@/components/MentorFeedback";
import type { MarkingResult, Message } from "@/types";

type Tab = "rubric" | "feedback" | "transcript";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const caseData = getCaseById(id);

  if (!caseData) notFound();

  const [activeTab, setActiveTab] = useState<Tab>("rubric");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarkingResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const sessionDataStr = sessionStorage.getItem("cce-last-session");
    if (!sessionDataStr) {
      setError(
        "No exam session found. Please complete a case discussion first."
      );
      setIsLoading(false);
      return;
    }

    try {
      const sessionData = JSON.parse(sessionDataStr) as {
        messages: Message[];
        durationSeconds: number;
        caseId: string;
      };

      if (sessionData.caseId !== id) {
        setError("Session data doesn't match this case.");
        setIsLoading(false);
        return;
      }

      setMessages(sessionData.messages.filter((m) => !m.content.startsWith("[SYSTEM:")));
      evaluateSession(sessionData.messages, sessionData.durationSeconds);
    } catch {
      setError("Failed to load session data.");
      setIsLoading(false);
    }
  }, [id]);

  const evaluateSession = async (msgs: Message[], duration: number) => {
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: id,
          messages: msgs,
          durationSeconds: duration,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Evaluation failed");
      }

      const data = (await res.json()) as MarkingResult;
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to evaluate your exam. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            ← Back to cases
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/case/${id}`}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              Retry case
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Exam Results
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{caseData.patientName}</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {caseData.topics[0]} · {caseData.questions.length} questions
            {result && ` · Duration: ${formatDuration(result.durationSeconds)}`}
          </p>
        </div>

        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-600 font-medium">
              Analysing your performance...
            </p>
            <p className="text-slate-400 text-sm mt-1">
              The AI examiner is reviewing your transcript and completing the marking rubric.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium mb-2">⚠️ {error}</p>
            <Link
              href={`/case/${id}`}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Go back to case preparation
            </Link>
          </div>
        )}

        {result && !isLoading && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
              {(
                [
                  { key: "rubric", label: "📋 Marking Rubric" },
                  { key: "feedback", label: "🎓 Mentor Feedback" },
                  { key: "transcript", label: "💬 Transcript" },
                ] as { key: Tab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "rubric" && <MarkingRubric result={result} />}
            {activeTab === "feedback" && <MentorFeedback result={result} />}
            {activeTab === "transcript" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {messages.length === 0 ? (
                  <p className="text-slate-500 text-sm px-5 py-8 text-center">
                    No transcript available.
                  </p>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold uppercase ${
                            msg.role === "examiner"
                              ? "text-blue-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {msg.role === "examiner" ? "Examiner" : "You"}
                        </span>
                        {msg.questionNumber && (
                          <span className="text-xs text-slate-400">
                            — Q{msg.questionNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Bottom actions */}
            <div className="flex gap-3 mt-8 justify-center">
              <Link
                href={`/case/${id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                Retry this case
              </Link>
              <Link
                href="/"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                Choose another case
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
