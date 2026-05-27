"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { EmergencyTypeItem } from "@/lib/constants";

interface EmergencyTypeCardProps {
  item: EmergencyTypeItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function EmergencyTypeCard({ item, selected, onSelect }: EmergencyTypeCardProps) {
  return (
    <motion.button
      className={cn(
        "flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all min-h-[100px] justify-center",
        "active:scale-95",
        selected
          ? "border-crosshere/40 bg-crosshere/5 dark:bg-crosshere/10 shadow-sm"
          : "border-border/30 bg-card/50 dark:bg-card/30 hover:bg-card/80"
      )}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(item.id)}
      aria-pressed={selected}
      id={`emergency-type-${item.id}`}
    >
      <span className="text-2xl" role="img" aria-label={item.label}>
        {item.icon}
      </span>
      <span className={cn(
        "text-xs font-medium leading-tight text-center",
        selected ? "text-crosshere" : "text-foreground"
      )}>
        {item.label}
      </span>
    </motion.button>
  );
}
