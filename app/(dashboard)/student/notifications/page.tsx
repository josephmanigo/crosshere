"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { NotificationCard } from "@/components/student/notification-card";
import { EmptyState } from "@/components/shared/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { ArrowLeft, Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/actions/notifications";
import { toast } from "sonner";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data || []);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err.message || "Failed to mark all as read");
    }
  };

  const handleMarkOneRead = async (id: string, isAlreadyRead: boolean) => {
    if (isAlreadyRead) return;
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  // Group notifications by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: any[] }[] = [];

  const todayItems = notifications.filter((n) => {
    const d = new Date(n.created_at);
    return d.toDateString() === today.toDateString();
  });
  const yesterdayItems = notifications.filter((n) => {
    const d = new Date(n.created_at);
    return d.toDateString() === yesterday.toDateString();
  });
  const earlierItems = notifications.filter((n) => {
    const d = new Date(n.created_at);
    return d.toDateString() !== today.toDateString() && d.toDateString() !== yesterday.toDateString();
  });

  if (todayItems.length > 0) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (earlierItems.length > 0) groups.push({ label: "Earlier", items: earlierItems });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
        <Loader2 className="size-8 animate-spin text-crosshere" />
        <p className="text-xs text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/student" className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-crosshere hover:text-crosshere hover:bg-crosshere/5 gap-1.5 rounded-xl border border-crosshere/10"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
        )}
      </motion.div>

      {/* Notification Groups */}
      {groups.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! We'll let you know when something important happens."
        />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <motion.div key={group.label} variants={staggerItem} className="space-y-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                {group.label}
              </h2>
              <GlassCard intensity="subtle" className="border border-border/10">
                <GlassCardContent className="p-3 space-y-2">
                  <AnimatePresence initial={false}>
                    {group.items.map((notification) => (
                      <NotificationCard 
                        key={notification.id} 
                        notification={notification} 
                        onClick={() => handleMarkOneRead(notification.id, notification.read)}
                      />
                    ))}
                  </AnimatePresence>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
