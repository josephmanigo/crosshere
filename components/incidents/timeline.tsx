"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";
import type { TimelineEntry } from "@/lib/mock-data";

const typeConfig = {
  report: { color: "bg-red-500", label: "Report" },
  acknowledge: { color: "bg-amber-500", label: "Acknowledge" },
  update: { color: "bg-blue-500", label: "Update" },
  treatment: { color: "bg-emerald-500", label: "Treatment" },
  resolve: { color: "bg-green-600", label: "Resolved" },
};

interface TimelineProps {
  entries: TimelineEntry[];
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

      <div className="space-y-4">
        {entries.map((entry) => {
          const config = typeConfig[entry.type];
          return (
            <motion.div
              key={entry.id}
              variants={staggerItem}
              className="flex gap-4 relative"
            >
              {/* Dot */}
              <div className={cn("size-[22px] rounded-full border-2 border-background shrink-0 z-10", config.color)} />

              {/* Content */}
              <div className="flex-1 -mt-0.5 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    entry.type === "treatment" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                    entry.type === "report" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {config.label}
                  </span>
                </div>
                <p className="text-sm">{entry.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{entry.actor}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
