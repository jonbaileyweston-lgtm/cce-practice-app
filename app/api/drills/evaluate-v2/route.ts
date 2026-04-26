import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { DRILL_RUBRICS } from "@/data/drillRubrics";
import type {
  AnchorLevel,
  AxisJudgment,
  DrillRubric,
  EvaluationResult,
} from "@/types/drillRubric";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface EvaluateV2Request {
  drill_id: string;
  transcript: string;
  scenario_context: string;
}

type ModelEvaluationResult = Omit<EvaluationResult, "overall">;

const ANCHOR_LEVEL_ORDER: Record<AnchorLevel, number> = {
  needs_work: 0,
  borderline: 1,
  clear_pass: 2,
};

function extractTextFromClaudeResponse(
  response: Awaited<ReturnType<typeof anthropic.messages.create>>
): string {
  return response.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isAnchorLevel(value: unknown): value is AnchorLevel {
  return value === "clear_pass" || value === "borderline" || value === "needs_work";
}

function validateModelEvaluationResult(
  payload: unknown,
  rubric: DrillRubric
): ModelEvaluationResult | null {
  if (typeof payload !== "object" || payload === null) return null;

  const record = payload as Record<string, unknown>;
  const { axis_judgments, hard_fails_triggered, pivotal_moment, retry_sentence, retry_anchor_quote } =
    record;

  if (!Array.isArray(axis_judgments) || !Array.isArray(hard_fails_triggered)) return null;
  if (!isNonEmptyString(pivotal_moment) || !isNonEmptyString(retry_sentence) || !isNonEmptyString(retry_anchor_quote)) {
    return null;
  }

  const expectedAxisIds = new Set(rubric.axes.map((axis) => axis.id));
  const hardFailIds = new Set(rubric.hard_fails.map((hardFail) => hardFail.id));

  const parsedAxisJudgments: AxisJudgment[] = [];
  const seenAxisIds = new Set<string>();

  for (const axisJudgment of axis_judgments) {
    if (typeof axisJudgment !== "object" || axisJudgment === null) return null;
    const judgment = axisJudgment as Record<string, unknown>;
    const axisId = judgment.axis_id;
    const level = judgment.level;
    const evidenceQuote = judgment.evidence_quote;
    const evidenceReasoning = judgment.evidence_reasoning;

    if (!isNonEmptyString(axisId) || !isAnchorLevel(level)) return null;
    if (!isNonEmptyString(evidenceQuote) || !isNonEmptyString(evidenceReasoning)) return null;
    if (!expectedAxisIds.has(axisId)) return null;
    if (seenAxisIds.has(axisId)) return null;

    seenAxisIds.add(axisId);
    parsedAxisJudgments.push({
      axis_id: axisId,
      level,
      evidence_quote: evidenceQuote,
      evidence_reasoning: evidenceReasoning,
    });
  }

  if (parsedAxisJudgments.length !== rubric.axes.length) return null;

  const parsedHardFailsTriggered: string[] = [];
  for (const hardFailId of hard_fails_triggered) {
    if (!isNonEmptyString(hardFailId)) return null;
    if (!hardFailIds.has(hardFailId)) return null;
    parsedHardFailsTriggered.push(hardFailId);
  }

  return {
    axis_judgments: parsedAxisJudgments,
    hard_fails_triggered: [...new Set(parsedHardFailsTriggered)],
    pivotal_moment,
    retry_sentence,
    retry_anchor_quote,
  };
}

function deriveOverall(result: ModelEvaluationResult): EvaluationResult["overall"] {
  if (result.hard_fails_triggered.length > 0) return "needs_work";

  const levels = result.axis_judgments.map((judgment) => judgment.level);
  if (levels.some((level) => level === "needs_work")) return "needs_work";

  const allAtLeastBorderline = levels.every(
    (level) => ANCHOR_LEVEL_ORDER[level] >= ANCHOR_LEVEL_ORDER.borderline
  );
  const clearPassCount = levels.filter((level) => level === "clear_pass").length;
  const clearPassRatio = clearPassCount / levels.length;

  if (allAtLeastBorderline && clearPassRatio >= 0.7) return "pass";
  return "borderline";
}

function buildSystemPrompt(rubric: DrillRubric): string {
  const axesPrompt = rubric.axes
    .map((axis) => {
      const anchors = axis.anchors
        .map(
          (anchor) =>
            `    - ${anchor.level}: ${anchor.description}${
              anchor.example_phrase ? ` (e.g. "${anchor.example_phrase}")` : ""
            }`
        )
        .join("\n");
      return `- axis_id: ${axis.id}\n  label: ${axis.label}\n  anchors:\n${anchors}`;
    })
    .join("\n");

  const hardFailPrompt = rubric.hard_fails
    .map(
      (hardFail) =>
        `- id: ${hardFail.id}\n  description: ${hardFail.description}\n  detection_hint: ${hardFail.detection_hint}`
    )
    .join("\n");

  return `You are an expert RACGP communication examiner scoring one micro-drill transcript.

Use ONLY this rubric for scoring:
drill_id: ${rubric.drill_id}
family: ${rubric.family}

AXES (score each independently BEFORE any aggregate thinking):
${axesPrompt}

HARD FAILS (evaluate each against transcript evidence):
${hardFailPrompt}

Important scoring instructions:
1) Score each axis independently as one of: clear_pass | borderline | needs_work.
2) For EACH axis judgment, provide:
   - axis_id
   - level
   - evidence_quote: a VERBATIM transcript quote
   - evidence_reasoning: why that quote maps to that level
3) Evaluate every hard fail and include only triggered hard fail ids in hard_fails_triggered.
4) Identify the pivotal moment and best immediate retry language from transcript evidence.
5) Do NOT produce any aggregate rating and do NOT output an "overall" field.
6) Return strict JSON only, with this exact shape:
{
  "axis_judgments": [
    {
      "axis_id": "string",
      "level": "clear_pass | borderline | needs_work",
      "evidence_quote": "string",
      "evidence_reasoning": "string"
    }
  ],
  "hard_fails_triggered": ["hard_fail_id_if_triggered"],
  "pivotal_moment": "string",
  "retry_sentence": "string",
  "retry_anchor_quote": "string"
}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EvaluateV2Request;
    const drillId = body.drill_id;
    const transcript = body.transcript;
    const scenarioContext = body.scenario_context;

    if (!isNonEmptyString(drillId) || !isNonEmptyString(transcript)) {
      return new Response(
        JSON.stringify({ error: "drill_id and transcript are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const rubric = DRILL_RUBRICS[drillId];
    if (!rubric) {
      return new Response(JSON.stringify({ error: "Drill rubric not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const system = buildSystemPrompt(rubric);
    const user = `SCENARIO CONTEXT:
${isNonEmptyString(scenarioContext) ? scenarioContext : "(none provided)"}

TRANSCRIPT:
${transcript}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1800,
      system,
      messages: [{ role: "user", content: user }],
    });

    const rawText = extractTextFromClaudeResponse(response);
    let parsed: unknown;

    try {
      parsed = JSON.parse(stripJsonFences(rawText));
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse drill rubric evaluation response" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const validated = validateModelEvaluationResult(parsed, rubric);
    if (!validated) {
      return new Response(
        JSON.stringify({ error: "Drill rubric evaluation failed schema validation" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result: EvaluationResult = {
      ...validated,
      overall: deriveOverall(validated),
    };

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to evaluate communication drill (v2)" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
