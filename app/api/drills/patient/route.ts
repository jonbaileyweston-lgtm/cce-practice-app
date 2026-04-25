import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getDrillById } from "@/data/drills";
import { buildDrillPatientSystemPrompt, DrillMessage } from "@/lib/prompts";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface DrillPatientRequest {
  drillId: string;
  variantId: string;
  messages: DrillMessage[];
}

export async function POST(req: NextRequest) {
  try {
    const { drillId, variantId, messages } =
      (await req.json()) as DrillPatientRequest;

    const drill = getDrillById(drillId);
    if (!drill) {
      return new Response(JSON.stringify({ error: "Drill not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const variant = drill.variants.find((v) => v.id === variantId);
    if (!variant) {
      return new Response(JSON.stringify({ error: "Drill variant not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildDrillPatientSystemPrompt(drill, variant);
    const history = messages.map((m) => ({
      role: m.role === "patient" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system: systemPrompt,
      messages: history,
    });

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
    console.error("Drill patient API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate drill patient response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
