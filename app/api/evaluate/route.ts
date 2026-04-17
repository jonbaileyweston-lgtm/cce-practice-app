import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getCaseById } from "@/data/cases";
import {
  buildEvaluatorSystemPrompt,
  formatTranscriptForEvaluation,
} from "@/lib/prompts";
import type { Message, MarkingResult, RubricItemResult } from "@/types";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface EvaluateRequest {
  caseId: string;
  messages: Message[];
  durationSeconds: number;
}

interface ClaudeRubricResult {
  code: string;
  rating: string;
  justification: string;
}

interface ClaudeQuestionFeedback {
  questionNumber: number;
  strengths: string[];
  gaps: string[];
  keyPointsMissed: string[];
}

interface ClaudeEvalResponse {
  rubricResults: ClaudeRubricResult[];
  overallRating: string;
  overallJustification: string;
  strengths: string[];
  areasForImprovement: string[];
  perQuestionFeedback: ClaudeQuestionFeedback[];
  studyTips: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { caseId, messages, durationSeconds } =
      (await req.json()) as EvaluateRequest;

    const caseData = getCaseById(caseId);
    if (!caseData) {
      return new Response(JSON.stringify({ error: "Case not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildEvaluatorSystemPrompt(caseData);
    const transcript = formatTranscriptForEvaluation(messages);

    const userMessage = `Here is the full transcript from the case discussion exam. Please evaluate the candidate's performance and return your assessment as JSON.

TRANSCRIPT:
${transcript}

Remember: respond with ONLY valid JSON matching the specified structure.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse the JSON response
    let evalData: ClaudeEvalResponse;
    try {
      // Strip any potential markdown code fences
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      evalData = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse evaluation JSON:", rawText);
      return new Response(
        JSON.stringify({ error: "Failed to parse evaluation response" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Map the code-keyed rubric results back to full rubric items
    const rubricResults: RubricItemResult[] = evalData.rubricResults
      .map((result) => {
        const rubricItem = caseData.markingRubric.find(
          (r) => r.code === result.code
        );
        if (!rubricItem) return null;
        return {
          rubricItem,
          rating: result.rating as RubricItemResult["rating"],
          justification: result.justification,
        };
      })
      .filter(Boolean) as RubricItemResult[];

    const markingResult: MarkingResult = {
      caseId,
      completedAt: Date.now(),
      durationSeconds,
      rubricResults,
      overallRating: evalData.overallRating as MarkingResult["overallRating"],
      overallJustification: evalData.overallJustification,
      strengths: evalData.strengths,
      areasForImprovement: evalData.areasForImprovement,
      perQuestionFeedback: evalData.perQuestionFeedback.map((qf) => ({
        ...qf,
        questionText:
          caseData.questions.find((q) => q.number === qf.questionNumber)
            ?.text ?? "",
      })),
      studyTips: evalData.studyTips,
      transcript: messages,
    };

    return new Response(JSON.stringify(markingResult), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Evaluate API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to evaluate exam" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
