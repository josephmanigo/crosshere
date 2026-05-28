"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, Mail, MessageSquare, Shield, Check, CheckCheck, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/actions/notifications";
import { toast } from "sonner";

const typeIcons = {
  emergency: AlertTriangle,
  system: Bell,
  sms: MessageSquare,
  email: Mail,
  escalation: Shield,
  clinic: Bell,
  announcement: Bell,
  reminder: Bell,
};

const typeColors = {
  emergency: "text-red-500 bg-red-500/10 border-red-500/20",
  system: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  sms: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  email: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  escalation: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  clinic: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  announcement: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  reminder: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
};

function formatRelative(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface NotificationItemProps {
  notification: any;
  onClick: () => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Bell;
  const colorClass = typeColors[notification.type as keyof typeof typeColors] || typeColors.system;

  return (
    <motion.div
      variants={staggerItem}
      onClick={onClick}
      className={cn(
        "flex gap-3.5 p-4 rounded-2xl transition-all duration-300 cursor-pointer border relative overflow-hidden",
        "active:scale-[0.99]",
        notification.read
          ? "bg-card/20 hover:bg-card/40 border-border/10 text-foreground/80"
          : "bg-card/85 hover:bg-card/95 border-primary/20 shadow-sm text-foreground"
      )}
    >
      {!notification.read && (
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/3 to-transparent pointer-events-none" />
      )}

      <div className={cn("rounded-xl p-2.5 h-fit shrink-0 border border-border/5", colorClass.split(" ")[1])}>
        <Icon className={cn("size-4", colorClass.split(" ")[0])} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm tracking-tight leading-snug", !notification.read ? "font-semibold" : "font-medium")}>
            {notification.title}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {!notification.read && <PulseIndicator color="blue" size="sm" />}
            <span className="text-[10px] text-muted-foreground/70 font-medium">{formatRelative(notification.created_at || notification.timestamp)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.description}</p>
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = React.useState("all");
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadNotifications = React.useCallback(async () => {
    try {
      const data = await getMyNotifications(100);
      setNotifications(data || []);
    } catch (err: any) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = tab === "all"
    ? notifications
    : notifications.filter((n) => n.type === tab);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="size-8 animate-spin text-crosshere" />
        <p className="text-xs text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pt-2">
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs hover:bg-crosshere/5 border-crosshere/20 text-crosshere hover:text-crosshere font-semibold rounded-xl"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        )}
      </motion.div>

      <motion.div variants={staggerItem}>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="w-full overflow-x-auto">
            <TabsList className="w-full min-w-max h-auto p-1 flex bg-muted/40 backdrop-blur-md rounded-2xl border border-border/10">
              <TabsTrigger value="all" className="shrink-0 flex-1 rounded-xl">All</TabsTrigger>
              <TabsTrigger value="emergency" className="shrink-0 flex-1 rounded-xl">Emergencies</TabsTrigger>
              <TabsTrigger value="system" className="shrink-0 flex-1 rounded-xl">System</TabsTrigger>
              <TabsTrigger value="sms" className="shrink-0 flex-1 rounded-xl">SMS</TabsTrigger>
              <TabsTrigger value="email" className="shrink-0 flex-1 rounded-xl">Email</TabsTrigger>
              <TabsTrigger value="escalation" className="shrink-0 flex-1 rounded-xl">Escalation</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle" className="border border-border/10 shadow-xl">
          <GlassCardContent className="p-3">
            <ScrollArea className="h-[600px] pr-3">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                key={tab}
                className="space-y-2.5"
              >
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/75">
                      <Bell className="size-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">No notifications</p>
                      <p className="text-xs text-muted-foreground mt-0.5">There are no notifications in this category.</p>
                    </div>
                  </div>
                ) : (
                  filtered.map((n) => (
                    <NotificationItem 
                      key={n.id} 
                      notification={n} 
                      onClick={() => handleMarkOneRead(n.id, n.read)}
                    />
                  ))
                )}
              </motion.div>
            </ScrollArea>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
