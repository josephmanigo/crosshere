"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="rounded-2xl bg-muted/50 p-4 mb-5">
        <Icon className="size-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm text-balance mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
