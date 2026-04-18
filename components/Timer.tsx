"use client";

interface TimerProps {
  totalSeconds: number;
  elapsedSeconds: number;
  /** Pass false before the candidate has spoken their first word */
  isStarted?: boolean;
}

export default function Timer({
  totalSeconds,
  elapsedSeconds,
  isStarted = true,
}: TimerProps) {
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const percent = isStarted
    ? Math.min(100, (elapsedSeconds / totalSeconds) * 100)
    : 0;

  const isWarning = isStarted && remaining <= 120 && remaining > 0;
  const isDanger = isStarted && remaining <= 60;
  const isExpired = isStarted && remaining === 0;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`font-mono text-2xl font-bold tabular-nums transition-colors ${
          !isStarted
            ? "text-slate-500"
            : isExpired
            ? "text-red-400"
            : isDanger
            ? "text-red-400 animate-pulse"
            : isWarning
            ? "text-orange-300"
            : "text-slate-100"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden min-w-[80px]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isExpired || isDanger
              ? "bg-red-500"
              : isWarning
              ? "bg-orange-400"
              : "bg-blue-400"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
