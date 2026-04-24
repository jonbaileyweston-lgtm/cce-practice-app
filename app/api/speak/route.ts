import { NextRequest } from "next/server";

export const runtime = "nodejs";

type SpeakerRole =
  | "examiner"
  | "examiner_male"
  | "examiner_female"
  | "patient_male"
  | "patient_female"
  | "patient_female_v1"
  | "patient_female_v2";

const DEFAULT_VOICE_ID_BY_ROLE: Record<SpeakerRole, string> = {
  examiner: "YCxeyFA0G7yTk6Wuv2oq",
  examiner_male: "YCxeyFA0G7yTk6Wuv2oq",
  examiner_female: "8WaMCGQzWsKvf7sGPqjE",
  patient_male: "1IthILLNX448pH19aMvC",
  patient_female: "luVEyhT3CocLZaLBps8v",
  patient_female_v1: "luVEyhT3CocLZaLBps8v",
  patient_female_v2: "dZ6m5E1WD1KdEHdK4BU8",
};

const FALLBACK_ROLES_BY_ROLE: Record<SpeakerRole, SpeakerRole[]> = {
  examiner: ["examiner_male", "examiner_female"],
  examiner_male: ["examiner"],
  examiner_female: ["examiner"],
  patient_male: [],
  patient_female: ["patient_female_v1", "patient_female_v2"],
  patient_female_v1: ["patient_female", "patient_female_v2"],
  patient_female_v2: ["patient_female", "patient_female_v1"],
};

function getEnvVoiceIdForRole(role: SpeakerRole): string | undefined {
  const envOverride: Partial<Record<SpeakerRole, string>> = {
    examiner: process.env.ELEVENLABS_VOICE_EXAMINER,
    examiner_male: process.env.ELEVENLABS_VOICE_EXAMINER_MALE,
    examiner_female: process.env.ELEVENLABS_VOICE_EXAMINER_FEMALE,
    patient_male: process.env.ELEVENLABS_VOICE_PATIENT_MALE,
    patient_female: process.env.ELEVENLABS_VOICE_PATIENT_FEMALE,
    patient_female_v1: process.env.ELEVENLABS_VOICE_PATIENT_FEMALE_V1,
    patient_female_v2: process.env.ELEVENLABS_VOICE_PATIENT_FEMALE_V2,
  };
  return envOverride[role]?.trim();
}

function getVoiceCandidatesForRole(role: SpeakerRole): string[] {
  const envVoice = getEnvVoiceIdForRole(role);
  const defaults = DEFAULT_VOICE_ID_BY_ROLE[role];
  const candidates = [envVoice, defaults].filter(
    (voiceId): voiceId is string => Boolean(voiceId)
  );
  return [...new Set(candidates)];
}

async function requestElevenLabsTts({
  voiceId,
  role,
  text,
  apiKey,
}: {
  voiceId: string;
  role: SpeakerRole;
  text: string;
  apiKey: string;
}): Promise<Response> {
  return fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.8,
          style: role.includes("examiner") ? 0.15 : 0.25,
          use_speaker_boost: true,
        },
      }),
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { text, speakerRole } = (await req.json()) as {
      text: string;
      speakerRole: SpeakerRole;
    };
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

    if (!elevenLabsApiKey) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY is not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requestedRole =
      speakerRole in DEFAULT_VOICE_ID_BY_ROLE ? speakerRole : "examiner";
    const fallbackRoles = [requestedRole, ...FALLBACK_ROLES_BY_ROLE[requestedRole]];
    const attempts: Array<{ role: SpeakerRole; voiceId: string }> = [];

    for (const role of fallbackRoles) {
      for (const voiceId of getVoiceCandidatesForRole(role)) {
        attempts.push({ role, voiceId });
      }
    }

    let ttsResponse: Response | null = null;
    let ttsErrorSummary = "";

    for (const attempt of attempts) {
      const response = await requestElevenLabsTts({
        voiceId: attempt.voiceId,
        role: attempt.role,
        text,
        apiKey: elevenLabsApiKey,
      });

      if (response.ok && response.body) {
        if (
          attempt.role !== requestedRole ||
          attempt.voiceId !== attempts[0]?.voiceId
        ) {
          console.warn(
            `ElevenLabs primary voice failed for "${requestedRole}". ` +
              `Recovered with role "${attempt.role}" and voice "${attempt.voiceId}".`
          );
        }
        ttsResponse = response;
        break;
      }

      const details = await response.text();
      ttsErrorSummary += `Role "${attempt.role}" voice "${attempt.voiceId}" failed ` +
        `(${response.status}): ${details || "No details"}\n`;
    }

    if (!ttsResponse?.body) {
      throw new Error(
        `ElevenLabs TTS failed for requested role "${requestedRole}". Attempts:\n${ttsErrorSummary}`
      );
    }

    const contentType =
      ttsResponse.headers.get("content-type") || "audio/mpeg";

    return new Response(ttsResponse.body, {
      headers: {
        "Content-Type": contentType,
        "Transfer-Encoding": "chunked",
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
