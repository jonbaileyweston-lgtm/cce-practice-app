"use client";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelect: (voice: SpeechSynthesisVoice | null) => void;
}

export default function VoiceSelector({
  voices,
  selectedVoice,
  onSelect,
}: VoiceSelectorProps) {
  const englishVoices = voices.filter((v) => v.lang.startsWith("en"));

  if (englishVoices.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-slate-500 whitespace-nowrap">
        Examiner voice:
      </label>
      <select
        className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-[200px]"
        value={selectedVoice?.name ?? ""}
        onChange={(e) => {
          const voice = englishVoices.find((v) => v.name === e.target.value);
          onSelect(voice ?? null);
        }}
      >
        {englishVoices.map((v) => (
          <option key={v.name} value={v.name}>
            {v.name.replace(/Microsoft\s+/i, "").replace(/\s*\(.*\)/, "")} ({v.lang})
          </option>
        ))}
      </select>
    </div>
  );
}
