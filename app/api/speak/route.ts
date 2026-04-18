import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type SpeakerRole = "examiner" | "patient_male" | "patient_female";

const VOICE_CONFIG: Record<
  SpeakerRole,
  { voice: "onyx" | "ash" | "nova"; instructions: string }
> = {
  examiner: {
    voice: "onyx",
    instructions:
      "Speak as a calm, professional Australian GP examiner conducting a fellowship-level clinical assessment. Moderately brisk pace—about 20% faster than a slow measured delivery—while keeping clear pronunciation of medical terminology.",
  },
  patient_male: {
    voice: "ash",
    instructions:
      "Speak as an adult male patient describing symptoms to a doctor. Natural, slightly anxious tone. Not medical — use lay language.",
  },
  patient_female: {
    voice: "nova",
    instructions:
      "Speak as an adult female patient describing symptoms to a doctor. Natural, conversational. Use lay language, not clinical terms.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { text, speakerRole } = (await req.json()) as {
      text: string;
      speakerRole: SpeakerRole;
    };

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const role = speakerRole in VOICE_CONFIG ? speakerRole : "examiner";
    const { voice, instructions } = VOICE_CONFIG[role];

    const mp3Response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      response_format: "wav",
      instructions,
      ...(role === "examiner" ? { speed: 1.2 } : {}),
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return new Response(JSON.stringify({ error: "Failed to synthesise speech" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
