"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ResponseTimerProps {
  startTime: string;
  className?: string;
}

export function ResponseTimer({ startTime, className }: ResponseTimerProps) {
  const [elapsed, setElapsed] = React.useState("0:00");
  const [minutes, setMinutes] = React.useState(0);

  React.useEffect(() => {
    const start = new Date(startTime).getTime();

    const update = () => {
      const diff = Math.max(0, Date.now() - start);
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsed(`${mins}:${secs.toString().padStart(2, "0")}`);
      setMinutes(mins);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Clock className="size-3.5" />
      <span
        className={cn(
          "text-sm font-mono font-semibold tabular-nums",
          minutes < 2 && "text-emerald-600 dark:text-emerald-400",
          minutes >= 2 && minutes < 5 && "text-amber-600 dark:text-amber-400",
          minutes >= 5 && "text-red-600 dark:text-red-400"
        )}
      >
        {elapsed}
      </span>
    </div>
  );
}
