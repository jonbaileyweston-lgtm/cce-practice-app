import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof Blob)) {
      return new Response(JSON.stringify({ error: "No audio file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mimeType = audioFile.type || "audio/webm";
    const extension = mimeType.includes("wav") ? "wav" : "webm";
    const file = new File([buffer], `audio.${extension}`, { type: mimeType });

    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
      language: "en",
      response_format: "text",
    });

    return new Response(JSON.stringify({ transcript: transcription }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transcription API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to transcribe audio" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
