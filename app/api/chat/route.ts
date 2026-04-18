import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getCaseById } from "@/data/cases";
import { buildExaminerSystemPrompt } from "@/lib/prompts";
import type { Message } from "@/types";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { caseId, messages, currentQuestionIndex } = (await req.json()) as {
      caseId: string;
      messages: Message[];
      currentQuestionIndex: number;
    };

    const caseData = getCaseById(caseId);
    if (!caseData) {
      return new Response(JSON.stringify({ error: "Case not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isOpening = messages.length === 0;
    const systemPrompt = buildExaminerSystemPrompt(caseData, isOpening, currentQuestionIndex);

    // Convert our Message[] to Anthropic message format
    const anthropicMessages = messages.map((m) => ({
      role: m.role === "examiner" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    // If no messages yet, send a trigger to start the exam
    if (anthropicMessages.length === 0) {
      anthropicMessages.push({
        role: "user",
        content: `[SYSTEM: The candidate is ready. Please introduce yourself (one sentence) and ask Question 1.]`,
      });
    }

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 1200,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Return a streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate examiner response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
