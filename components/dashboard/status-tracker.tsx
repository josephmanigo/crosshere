"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { IncidentStatus } from "@/lib/constants";

const steps: { key: IncidentStatus; label: string }[] = [
  { key: "reported", label: "Reported" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "responding", label: "Responding" },
  { key: "resolved", label: "Resolved" },
];

interface StatusTrackerProps {
  currentStatus: IncidentStatus;
  className?: string;
}

export function StatusTracker({ currentStatus, className }: StatusTrackerProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {steps.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isUpcoming = i > currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-1 flex-1">
            {/* Step dot */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "size-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300",
                  isCompleted && "bg-emerald-500 text-white",
                  isCurrent && "bg-crosshere text-white ring-4 ring-crosshere/20",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-3.5" /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-medium whitespace-nowrap",
                isCurrent ? "text-crosshere" : isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 rounded-full transition-colors duration-300 mb-5",
                isCompleted ? "bg-emerald-500" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
