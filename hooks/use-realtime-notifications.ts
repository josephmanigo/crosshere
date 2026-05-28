"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface RealtimeNotification {
  id: string;
  recipient_id: string;
  title: string;
  description: string;
  type: string;
  severity?: string;
  read: boolean;
  incident_id?: string;
  created_at: string;
}

/**
 * Subscribe to realtime notifications for the current user.
 * Shows a toast whenever a new notification arrives.
 */
export function useRealtimeNotifications(
  userId: string | undefined,
  onNewNotification?: (notification: RealtimeNotification) => void
) {
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as RealtimeNotification;

          // Show toast for new notifications
          const isCritical =
            notification.severity === "critical" ||
            notification.type === "emergency";

          if (isCritical) {
            toast.error(notification.title, {
              description: notification.description,
              duration: 8000,
            });
          } else {
            toast(notification.title, {
              description: notification.description,
              duration: 5000,
            });
          }

          setUnreadCount((prev) => prev + 1);
          if (onNewNotification) onNewNotification(notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNewNotification]);

  return { unreadCount, setUnreadCount };
}
