import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getDrillById } from "@/data/drills";
import { formatDrillTranscriptForEvaluation } from "@/lib/prompts";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface DrillMessage {
  role: "patient" | "candidate";
  content: string;
}

interface DrillEvaluateRequest {
  drillId: string;
  messages: DrillMessage[];
  durationSeconds: number;
}

interface DrillEvalResponse {
  overallRating: "pass" | "needs_work";
  strengths: string[];
  gaps: string[];
  topThreeChangesToPass: string[];
  immediateRetryInstruction: string;
}

export async function POST(req: NextRequest) {
  try {
    const { drillId, messages, durationSeconds } =
      (await req.json()) as DrillEvaluateRequest;

    const drill = getDrillById(drillId);
    if (!drill) {
      return new Response(JSON.stringify({ error: "Drill not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const transcript = formatDrillTranscriptForEvaluation(messages);

    const system = `You are an expert RACGP communication coach running a short micro-drill.

DRILL: ${drill.title}
TARGET SKILL: ${drill.targetSkill}
PASS CRITERIA:
${drill.passCriteria.map((p) => `- ${p}`).join("\n")}

Evaluate only communication performance for this drill.
Assume this is a live interactive transcript and score interaction quality, flow, prioritisation, empathy, and clarity.
Return strict JSON only (no markdown) in this schema:
{
  "overallRating": "pass" | "needs_work",
  "strengths": ["..."],
  "gaps": ["..."],
  "topThreeChangesToPass": ["...", "...", "..."],
  "immediateRetryInstruction": "one concise practical instruction for immediate retry"
}

Rules:
- topThreeChangesToPass must contain exactly 3 concrete behaviour changes
- Keep feedback concise and specific to the transcript
- Avoid generic study advice
- If the candidate misses agenda negotiation, ICE, understanding checks, sequencing logic, or safety language when relevant, include that explicitly`;

    const user = `DRILL DURATION: ${durationSeconds}s

TRANSCRIPT:
${transcript}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: user }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    let evalData: DrillEvalResponse;
    try {
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      evalData = JSON.parse(cleaned) as DrillEvalResponse;
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse drill evaluation response" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalized: DrillEvalResponse = {
      overallRating: evalData.overallRating === "pass" ? "pass" : "needs_work",
      strengths: Array.isArray(evalData.strengths) ? evalData.strengths : [],
      gaps: Array.isArray(evalData.gaps) ? evalData.gaps : [],
      topThreeChangesToPass: Array.isArray(evalData.topThreeChangesToPass)
        ? evalData.topThreeChangesToPass.filter(Boolean).slice(0, 3)
        : [],
      immediateRetryInstruction:
        typeof evalData.immediateRetryInstruction === "string"
          ? evalData.immediateRetryInstruction
          : "Retry now using one clear structure: empathise, explain plainly, and safety-net concretely.",
    };

    return new Response(JSON.stringify(normalized), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to evaluate communication drill" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
