"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bell, Stethoscope, Megaphone, Clock, AlertTriangle, Mail, MessageSquare, Shield } from "lucide-react";
import { notificationTypes } from "@/lib/constants";
import { staggerItem } from "@/lib/animations";

const typeIcons = {
  emergency: AlertTriangle,
  clinic: Stethoscope,
  announcement: Megaphone,
  reminder: Clock,
  system: Bell,
  sms: MessageSquare,
  email: Mail,
  escalation: Shield,
} as const;

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    description?: string;
    message?: string;
    type: string;
    read: boolean;
    created_at?: string;
    timestamp?: string;
  };
  onClick?: () => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const config = notificationTypes[notification.type as keyof typeof notificationTypes] || {
    label: "System",
    color: "text-muted-foreground",
    bgColor: "bg-muted/10"
  };
  const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell;
  const timestamp = notification.created_at || notification.timestamp || new Date().toISOString();
  const description = notification.description || notification.message || "";

  // Format relative time
  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      const mins = Math.floor(diff / (1000 * 60));
      return mins <= 1 ? "Just now" : `${mins}m ago`;
    }
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <motion.div
      variants={staggerItem}
      onClick={onClick}
      className={cn(
        "flex gap-3 p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden",
        onClick && "cursor-pointer active:scale-[0.99]",
        notification.read
          ? "bg-card/25 dark:bg-card/15 border-border/10 hover:bg-card/45 dark:hover:bg-card/25"
          : "bg-card/70 dark:bg-card/45 border-primary/20 dark:border-primary/25 shadow-sm hover:border-primary/30"
      )}
    >
      {/* Premium Glass reflection effect on unread */}
      {!notification.read && (
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/2 to-transparent pointer-events-none" />
      )}

      <div className={cn("rounded-xl p-2.5 shrink-0 self-start border border-border/5", config.bgColor)}>
        <Icon className={cn("size-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm leading-snug tracking-tight",
            notification.read ? "font-medium text-foreground/80" : "font-semibold text-foreground"
          )}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="size-2 rounded-full bg-crosshere animate-pulse shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">
          {formatTime(timestamp)}
        </p>
      </div>
    </motion.div>
  );
}
