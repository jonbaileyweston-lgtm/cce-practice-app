"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCaseById } from "@/data/cases";
import { notFound } from "next/navigation";

export default function CasePrepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const caseData = getCaseById(id);
  const router = useRouter();

  if (!caseData) {
    notFound();
  }

  const handleStart = () => {
    router.push(`/case/${id}/exam`);
  };

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
          >
            ← Back to cases
          </Link>
          <span className="text-sm text-slate-400 font-medium">
            Case Preparation
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Title banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                RACGP CCE — Case Discussion
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {caseData.patientName}
              </h1>
              <p className="text-slate-500">
                {caseData.patientAge} years · {caseData.patientGender === "F" ? "Female" : "Male"} ·{" "}
                {caseData.topics[0]}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-slate-500">
                {caseData.questions.length} questions
              </div>
              <div className="text-sm font-semibold text-slate-700">15 minutes</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-amber-900 mb-1 text-sm">Instructions</h2>
          <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Review the following scenario and patient record summary.</li>
            <li>Your examiner will ask you a series of questions based on this information.</li>
            <li>You have 15 minutes to complete this case. The time for each question will be managed by the examiner.</li>
            <li>There are {caseData.questions.length} questions in this case.</li>
          </ul>
        </div>

        {/* Scenario */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
            Scenario
          </h2>
          <div className="prose prose-slate prose-sm max-w-none">
            {caseData.scenario.split("\n").map((line, i) =>
              line.trim() === "" ? (
                <div key={i} className="h-3" />
              ) : line.startsWith("•") ? (
                <p key={i} className="text-slate-700 pl-4">
                  {line}
                </p>
              ) : (
                <p key={i} className="text-slate-700">
                  {line}
                </p>
              )
            )}
          </div>
        </div>

        {/* Patient Record */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
            Patient Record Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient details */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Patient Details
              </h3>
              <dl className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[120px]">Name:</dt>
                  <dd className="text-slate-800 font-medium">{caseData.patientRecord.name}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[120px]">Age:</dt>
                  <dd className="text-slate-800">{caseData.patientRecord.age} years</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[120px]">Gender:</dt>
                  <dd className="text-slate-800">{caseData.patientRecord.gender}; {caseData.patientRecord.pronouns}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[120px]">Indigenous status:</dt>
                  <dd className="text-slate-800">{caseData.patientRecord.indigenousStatus}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[120px]">Allergies:</dt>
                  <dd className="text-slate-800">{caseData.patientRecord.allergies}</dd>
                </div>
              </dl>
            </div>

            {/* Social + Family */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Social History
              </h3>
              <dl className="space-y-1 text-sm">
                {Object.entries(caseData.patientRecord.socialHistory).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="text-slate-500 min-w-[100px]">{k}:</dt>
                    <dd className="text-slate-800">{v}</dd>
                  </div>
                ))}
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[100px]">Smoking:</dt>
                  <dd className="text-slate-800">{caseData.patientRecord.smoking}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-slate-500 min-w-[100px]">Alcohol:</dt>
                  <dd className="text-slate-800">{caseData.patientRecord.alcohol}</dd>
                </div>
              </dl>
            </div>

            {/* Medications */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Current Medications
              </h3>
              <ul className="text-sm text-slate-800 space-y-0.5">
                {caseData.patientRecord.medications.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Past History */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Past History
              </h3>
              <ul className="text-sm text-slate-800 space-y-0.5">
                {caseData.patientRecord.pastHistory.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {/* Family History */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Family History
              </h3>
              <ul className="text-sm text-slate-800 space-y-0.5">
                {caseData.patientRecord.familyHistory.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            {/* Immunisations */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Immunisation &amp; Preventive Activities
              </h3>
              <ul className="text-sm text-slate-800 space-y-0.5">
                {caseData.patientRecord.immunisations.map((im, i) => (
                  <li key={i}>{im}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-colors text-lg"
          >
            🎤 Start Exam
          </button>
          <p className="text-sm text-slate-400 mt-3">
            Your microphone will be used. Ensure you&apos;re in a quiet place.
          </p>
        </div>
      </div>
    </main>
  );
}
