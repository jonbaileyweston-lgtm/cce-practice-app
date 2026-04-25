"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buildDrillScenarioPack, getDrillById } from "@/data/drills";
import { notFound } from "next/navigation";
import { useWhisperSTT } from "@/hooks/useWhisperSTT";
import { useOpenAITTS } from "@/hooks/useOpenAITTS";

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

  const pickRandomVariant = () =>
    drill.variants[Math.floor(Math.random() * drill.variants.length)];

  // Keep initial SSR and client render deterministic to avoid hydration mismatches.
  const [variant, setVariant] = useState(drill.variants[0]);
  const scenarioPack = buildDrillScenarioPack(drill, variant);
  const [messages, setMessages] = useState<DrillMessage[]>([
    { role: "patient", content: scenarioPack.openingStatement },
  ]);
  const [candidateInput, setCandidateInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPatientTyping, setIsPatientTyping] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [interimText, setInterimText] = useState("");
  const [useManualMode, setUseManualMode] = useState(false);
  const [garbledWarning, setGarbledWarning] = useState<string | null>(null);
  const [isTTSFallback, setIsTTSFallback] = useState(false);
  const [feedback, setFeedback] = useState<DrillFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startMs] = useState<number>(Date.now());
  const [startClockMs, setStartClockMs] = useState<number>(Date.now());
  const messagesRef = useRef<DrillMessage[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isOneShotProblemRep = drill.id === "problem_representation";

  function extractCompleteSentences(buffer: string): {
    toSpeak: string;
    remaining: string;
  } {
    const match = /^([\s\S]+[.!?])(?=\s+[A-Z"'])/.exec(buffer);
    if (!match) return { toSpeak: "", remaining: buffer };
    return {
      toSpeak: match[1].trim(),
      remaining: buffer.slice(match[1].length).trimStart(),
    };
  }

  const cleanPatientText = (text: string): string =>
    text.replace(/\s{2,}/g, " ").trim();

  const { enqueue, stop: stopSpeaking } = useOpenAITTS({
    onFallbackActive: () => setIsTTSFallback(true),
  });
  const voiceRole = variant.id.endsWith("_5") ? "patient_male" : "patient_female";

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, interimText, isPatientTyping]);

  const streamPatientResponse = useCallback(
    async (currentMessages: DrillMessage[]) => {
      setIsPatientTyping(true);
      setStreamingText(null);
      setError(null);

      try {
        const res = await fetch("/api/drills/patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            drillId: drill.id,
            variantId: variant.id,
            messages: currentMessages,
          }),
        });

        if (!res.ok) throw new Error("Failed to get patient response");

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let sentenceBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as { text?: string };
              if (!parsed.text) continue;
              fullText += parsed.text;
              sentenceBuffer += parsed.text;
              setStreamingText(fullText);
              setIsPatientTyping(false);

              const { toSpeak, remaining } = extractCompleteSentences(sentenceBuffer);
              if (toSpeak) {
                const cleaned = cleanPatientText(toSpeak);
                if (cleaned) enqueue(cleaned, voiceRole);
                sentenceBuffer = remaining;
              }
            } catch {
              // Ignore malformed streaming chunks.
            }
          }
        }

        if (sentenceBuffer.trim()) {
          const cleaned = cleanPatientText(sentenceBuffer);
          if (cleaned) enqueue(cleaned, voiceRole);
        }

        const finalText = cleanPatientText(fullText);
        if (finalText) {
          const patientMessage: DrillMessage = { role: "patient", content: finalText };
          const nextMessages = [...messagesRef.current, patientMessage];
          setMessages(nextMessages);
          messagesRef.current = nextMessages;
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Could not fetch patient response. Please try again."
        );
      } finally {
        setIsPatientTyping(false);
        setStreamingText(null);
      }
    },
    [drill.id, variant.id, enqueue, voiceRole]
  );

  const submitCandidateTurn = async (incoming?: string) => {
    const content = (incoming ?? candidateInput).trim();
    if (!content || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setFeedback(null);
    setCandidateInput("");
    stopSpeaking();

    const candidateMessage: DrillMessage = { role: "candidate", content };
    const nextMessages = [...messagesRef.current, candidateMessage];
    setMessages(nextMessages);
    messagesRef.current = nextMessages;

    if (isOneShotProblemRep) {
      await evaluateDrill(nextMessages);
      return;
    }

    await streamPatientResponse(nextMessages);
    setIsSubmitting(false);
  };

  const { isListening, isSupported, startListening, stopListening } =
    useWhisperSTT({
      onInterimResult: setInterimText,
      onFinalResult: (transcript) => {
        setInterimText("");
        setGarbledWarning(null);
        void submitCandidateTurn(transcript);
      },
      onGarbledResult: (message) => {
        setGarbledWarning(message);
        setInterimText("");
      },
      onError: (sttError) => {
        setError(sttError);
        setUseManualMode(true);
      },
    });

  const loadNewScenario = () => {
    const next = pickRandomVariant();
    setVariant(next);
    const nextPack = buildDrillScenarioPack(drill, next);
    setMessages([{ role: "patient", content: nextPack.openingStatement }]);
    messagesRef.current = [{ role: "patient", content: nextPack.openingStatement }];
    setCandidateInput("");
    setFeedback(null);
    setError(null);
    setGarbledWarning(null);
    setStreamingText(null);
    setInterimText("");
    setIsPatientTyping(false);
    setStartClockMs(Date.now());
    stopSpeaking();
  };

  const evaluateDrill = async (overrideMessages?: DrillMessage[]) => {
    setIsSubmitting(true);
    setError(null);
    setFeedback(null);
    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - Math.max(startMs, startClockMs)) / 1000)
    );
    try {
      const res = await fetch("/api/drills/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drillId: drill.id,
          messages: overrideMessages ?? messagesRef.current,
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
        <p className="text-sm text-blue-800 whitespace-pre-line">
          {scenarioPack.stationBrief}
        </p>
        {scenarioPack.contextPoints.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">Candidate context</p>
            <ul className="space-y-1">
              {scenarioPack.contextPoints.map((item, idx) => (
                <li key={idx} className="text-xs text-blue-800">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {scenarioPack.investigationData.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Investigations and findings available
            </p>
            <ul className="space-y-1">
              {scenarioPack.investigationData.map((item, idx) => (
                <li key={idx} className="text-xs text-blue-800">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
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
                {m.role === "patient"
                  ? isOneShotProblemRep
                    ? "Examiner"
                    : "Patient"
                  : "You"}
                :
              </span>{" "}
              <span className="text-slate-700">{m.content}</span>
            </div>
          ))}
          {isPatientTyping && !isOneShotProblemRep && (
            <p className="text-sm text-slate-500 italic">Patient is responding...</p>
          )}
          {streamingText && !isOneShotProblemRep && (
            <div className="text-sm">
              <span className="font-semibold text-blue-700">Patient:</span>{" "}
              <span className="text-slate-700">{streamingText}</span>
            </div>
          )}
          {interimText && (
            <p className="text-sm text-indigo-700">{interimText}</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
        <label className="text-sm font-medium text-slate-700">Your response</label>
        <textarea
          value={candidateInput}
          onChange={(e) => setCandidateInput(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={
            isOneShotProblemRep
              ? "Deliver your one-line problem representation..."
              : "Type what you would say to the patient..."
          }
          disabled={isSubmitting || isPatientTyping}
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void submitCandidateTurn()}
            disabled={isSubmitting || isPatientTyping}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Send response
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported || useManualMode || isSubmitting || isPatientTyping}
            className="bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {isListening ? "Stop mic" : "Use microphone"}
          </button>
          <button
            onClick={() => setUseManualMode((prev) => !prev)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {useManualMode ? "Enable mic mode" : "Manual mode"}
          </button>
          <button
            onClick={evaluateDrill}
            disabled={
              isSubmitting ||
              isPatientTyping ||
              messages.filter((m) => m.role === "candidate").length === 0
            }
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
        {garbledWarning && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {garbledWarning}
          </p>
        )}
        {isTTSFallback && (
          <p className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
            Voice API unavailable, using browser speech fallback.
          </p>
        )}
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
