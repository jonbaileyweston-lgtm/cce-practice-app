import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getCaseById } from "@/data/cases";
import type { Message } from "@/types";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Builds the AI patient system prompt from the case's patientPersona and
 * patientRecord. The patient responds ONLY in lay language, stays consistent
 * with the case brief, and reveals withheld history only when directly asked.
 */
function buildPatientSystemPrompt(
  caseData: NonNullable<ReturnType<typeof getCaseById>>
): string {
  const persona = caseData.patientPersona;
  const record = caseData.patientRecord;

  const basePersona = persona
    ? `
PATIENT PERSONA:
Name: ${record.name} (${record.age} years, ${record.gender})
Presenting complaint (in your own words): ${caseData.presentingComplaint}
Opening statement: ${persona.openingStatement}
Demeanour: ${persona.demeanour}
How you respond to medical jargon: ${persona.responseToJargon}

WHAT YOU VOLUNTEER freely when asked open questions:
${persona.volunteerHistory.map((h, i) => `${i + 1}. ${h}`).join("\n")}

WHAT YOU ONLY REVEAL if directly and specifically asked:
${persona.withheldHistory.map((h, i) => `${i + 1}. ${h}`).join("\n")}

YOUR IDEAS, CONCERNS, EXPECTATIONS:
- Ideas (what you think is wrong): ${persona.ice.ideas}
- Concerns (what you worry about): ${persona.ice.concerns}
- Expectations (what you want from this visit): ${persona.ice.expectations}
`
    : `
PATIENT PERSONA:
Name: ${record.name} (${record.age} years, ${record.gender})
Presenting complaint: ${caseData.presentingComplaint}
You have come to see your GP about the above complaint. Answer questions about your symptoms naturally and honestly.
`;

  return `You are roleplaying as a patient in a GP consultation for a medical training simulation.

${basePersona}

BACKGROUND (your known medical history, in your words):
- Medications: ${record.medications.join(", ") || "None"}
- Past health issues: ${record.pastHistory.join(", ") || "None significant"}
- Social situation: ${Object.entries(record.socialHistory).map(([k, v]) => `${k}: ${v}`).join("; ")}
- Smoking: ${record.smoking}
- Alcohol: ${record.alcohol}

RULES YOU MUST ALWAYS FOLLOW:
1. Speak ONLY in plain, everyday lay language. You are not medically trained. Never use medical or clinical terminology unless you are specifically described as a healthcare worker in your persona — and even then, only if it is natural for your character.
2. Stay COMPLETELY consistent with the case brief above. Never contradict it.
3. Do NOT state your own diagnosis. You don't know what is wrong with you — that is what the doctor is for.
4. Be emotionally authentic — your demeanour as described above. React naturally if the doctor is kind, rushed, dismissive, or uses words you don't understand.
5. When the doctor uses jargon you don't understand, respond as described in your jargon-response style (e.g., look confused, ask what it means, or nod along).
6. Keep responses concise — you are a patient, not a lecturer. Short to medium-length answers only.
7. When you have shared most of your volunteer history and the doctor hasn't found something important, you may subtly hint — but do NOT simply blurt out withheld items.
8. This is a TRAINING SIMULATION — if the doctor explicitly says the consultation is over, end the roleplay politely.
9. Do not break character for any reason.`;
}

export async function POST(req: NextRequest) {
  try {
    const { caseId, messages } = (await req.json()) as {
      caseId: string;
      messages: Message[];
    };

    const caseData = getCaseById(caseId);
    if (!caseData) {
      return new Response(JSON.stringify({ error: "Case not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildPatientSystemPrompt(caseData);

    const anthropicMessages = messages.map((m) => ({
      role: m.role === "examiner" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

    // Seed the first patient message (opening statement)
    if (anthropicMessages.length === 0) {
      const opening = caseData.patientPersona?.openingStatement
        ?? `Hello doctor, thanks for seeing me. ${caseData.presentingComplaint}.`;
      anthropicMessages.push({
        role: "user",
        content: "[SYSTEM: The consultation has started. The patient enters the room.]",
      });
      anthropicMessages.push({
        role: "assistant",
        content: opening,
      });
    }

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      system: systemPrompt,
      messages: anthropicMessages,
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
    console.error("Patient API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate patient response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
