"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCaseById } from "@/data/cases";
import { notFound } from "next/navigation";
import { getCandidatePrepBody } from "@/lib/candidatePrep";

const READING_SECONDS = 5 * 60; // 5 minutes reading time

type PracticeMode = "discussion" | "consultation";

function CandidateDocumentBody({ text }: { text: string }) {
  return (
    <div className="prose prose-slate prose-sm max-w-none font-serif text-slate-900 leading-relaxed">
      {text.split("\n").map((line, i) =>
        line.trim() === "" ? (
          <div key={i} className="h-3" />
        ) : line.trim().startsWith("•") ? (
          <p key={i} className="pl-4 my-0">
            {line}
          </p>
        ) : (
          <p key={i} className="my-0">
            {line}
          </p>
        )
      )}
    </div>
  );
}

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

  const [practiceMode, setPracticeMode] = useState<PracticeMode>("discussion");
  const [readingSecondsLeft, setReadingSecondsLeft] = useState(READING_SECONDS);
  const [readingComplete, setReadingComplete] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasPatientPersona = Boolean(caseData.patientPersona);

  // Start reading countdown immediately on mount
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setReadingSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setReadingComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const dest =
      practiceMode === "consultation" && hasPatientPersona
        ? `/case/${id}/consult`
        : `/case/${id}/exam`;
    router.push(dest);
  };

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSkipped(true);
    setReadingComplete(true);
  };

  const body = getCandidatePrepBody(caseData);
  const sheetCode = caseData.id.toUpperCase();

  const readingMinutes = Math.floor(readingSecondsLeft / 60);
  const readingSecondsRemainder = readingSecondsLeft % 60;
  const isReady = readingComplete || skipped;

  // Progress for the reading timer bar (fills up as time passes)
  const readingProgress =
    ((READING_SECONDS - readingSecondsLeft) / READING_SECONDS) * 100;

  return (
    <main className="flex-1 min-h-screen bg-slate-200">
      <header className="bg-white border-b border-slate-300 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 transition-colors text-sm shrink-0"
          >
            ← Back
          </Link>

          {/* Reading timer or start button */}
          <div className="flex items-center gap-3">
            {!isReady ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Reading time</div>
                  <div
                    className={`font-mono font-bold text-lg tabular-nums ${
                      readingSecondsLeft <= 30
                        ? "text-orange-600"
                        : "text-slate-800"
                    }`}
                  >
                    {String(readingMinutes).padStart(2, "0")}:
                    {String(readingSecondsRemainder).padStart(2, "0")}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs text-slate-400 hover:text-slate-600 underline shrink-0"
                  title="Skip reading time (not available in real exam)"
                >
                  Skip*
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm transition-colors"
              >
                Start exam →
              </button>
            )}
          </div>
        </div>

        {/* Reading progress bar (full-width, under header) */}
        {!isReady && (
          <div className="h-1 bg-slate-100 w-full">
            <div
              className="h-full bg-blue-400 transition-all duration-1000"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        )}
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <article
          className="bg-white text-slate-900 shadow-md border border-slate-300 min-h-[60vh] px-6 sm:px-12 py-10 sm:py-14"
          aria-label="Candidate information"
        >
          <header className="text-center border-b border-slate-300 pb-8 mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-2">
              RACGP Clinical Competency Examination
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Case discussion
            </h1>
            <p className="text-base sm:text-lg font-semibold text-slate-800 mt-1">
              Candidate information
            </p>
            <p className="text-sm text-slate-600 mt-4 font-medium">{sheetCode}</p>
            {caseData.year ? (
              <p className="text-xs text-slate-500 mt-1">{caseData.year}</p>
            ) : null}
          </header>

          {/* Practice mode selector */}
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Practice mode
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setPracticeMode("discussion")}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  practiceMode === "discussion"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                }`}
              >
                <div className="font-semibold">Case Discussion</div>
                <div className={`text-xs mt-0.5 ${practiceMode === "discussion" ? "text-blue-100" : "text-slate-400"}`}>
                  Examiner Q&A format
                </div>
              </button>
              <button
                type="button"
                onClick={() => hasPatientPersona && setPracticeMode("consultation")}
                disabled={!hasPatientPersona}
                className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  !hasPatientPersona
                    ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                    : practiceMode === "consultation"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                }`}
                title={!hasPatientPersona ? "Patient persona not yet defined for this case" : undefined}
              >
                <div className="font-semibold">Recorded Consultation</div>
                <div className={`text-xs mt-0.5 ${
                  !hasPatientPersona ? "text-slate-300" : practiceMode === "consultation" ? "text-emerald-100" : "text-slate-400"
                }`}>
                  {hasPatientPersona ? "Consult with AI patient" : "Coming soon"}
                </div>
              </button>
            </div>
          </div>

          <CandidateDocumentBody text={body} />
        </article>

        <div className="text-center mt-6 space-y-2">
          {isReady ? (
            <button
              type="button"
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition-colors text-base"
            >
              Start 15-minute exam →
            </button>
          ) : (
            <p className="text-slate-500 text-sm">
              Reading time:{" "}
              <strong>
                {String(readingMinutes).padStart(2, "0")}:
                {String(readingSecondsRemainder).padStart(2, "0")}
              </strong>{" "}
              remaining — exam will be available when timer expires
            </p>
          )}
          {skipped && (
            <p className="text-xs text-amber-600">
              * Reading time was skipped. In the real CCE you must wait for the bell.
            </p>
          )}
          {!isReady && (
            <p className="text-xs text-slate-400">
              Allow microphone access when you start. Total exam time is 15 minutes.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
