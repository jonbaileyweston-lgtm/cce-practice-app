"use client";

interface TimerProps {
  totalSeconds: number;
  elapsedSeconds: number;
}

export default function Timer({ totalSeconds, elapsedSeconds }: TimerProps) {
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const percent = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  const isWarning = remaining <= 120 && remaining > 60;
  const isDanger = remaining <= 60;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`font-mono text-2xl font-bold tabular-nums ${
          isDanger
            ? "text-red-600"
            : isWarning
            ? "text-orange-500"
            : "text-slate-700"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden min-w-[80px]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isDanger
              ? "bg-red-500"
              : isWarning
              ? "bg-orange-400"
              : "bg-blue-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
