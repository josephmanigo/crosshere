"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bell, Stethoscope, Megaphone, Clock, AlertTriangle } from "lucide-react";
import type { StudentNotification } from "@/lib/mock-data";
import { notificationTypes } from "@/lib/constants";
import { staggerItem } from "@/lib/animations";

const typeIcons = {
  emergency: AlertTriangle,
  clinic: Stethoscope,
  announcement: Megaphone,
  reminder: Clock,
} as const;

interface NotificationCardProps {
  notification: StudentNotification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const config = notificationTypes[notification.type];
  const Icon = typeIcons[notification.type];

  // Format relative time
  const formatTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "flex gap-3 p-3.5 rounded-2xl border transition-colors",
        notification.read
          ? "bg-card/30 dark:bg-card/20 border-border/20"
          : "bg-card/60 dark:bg-card/40 border-border/40"
      )}
    >
      <div className={cn("rounded-xl p-2 shrink-0 self-start", config.bgColor)}>
        <Icon className={cn("size-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm leading-snug",
            notification.read ? "font-medium" : "font-semibold"
          )}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="size-2 rounded-full bg-crosshere shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-1.5">
          {formatTime(notification.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}
