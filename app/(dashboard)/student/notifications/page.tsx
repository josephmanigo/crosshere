"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NotificationCard } from "@/components/student/notification-card";
import { EmptyState } from "@/components/shared/empty-state";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { studentNotifications } from "@/lib/mock-data";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  // Group notifications by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: typeof studentNotifications }[] = [];

  const todayItems = studentNotifications.filter((n) => {
    const d = new Date(n.timestamp);
    return d.toDateString() === today.toDateString();
  });
  const yesterdayItems = studentNotifications.filter((n) => {
    const d = new Date(n.timestamp);
    return d.toDateString() === yesterday.toDateString();
  });
  const earlierItems = studentNotifications.filter((n) => {
    const d = new Date(n.timestamp);
    return d.toDateString() !== today.toDateString() && d.toDateString() !== yesterday.toDateString();
  });

  if (todayItems.length > 0) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (earlierItems.length > 0) groups.push({ label: "Earlier", items: earlierItems });

  const unreadCount = studentNotifications.filter((n) => !n.read).length;

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
          <Link href="/student" className="p-2 -ml-2 rounded-xl hover:bg-muted/50">
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
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
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
        groups.map((group) => (
          <motion.div key={group.label} variants={staggerItem} className="space-y-2.5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              {group.label}
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {group.items.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </motion.div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
