"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Mail, MessageSquare, Shield, Check, CheckCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { mockNotifications } from "@/lib/mock-data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/mock-data";

const typeIcons = {
  emergency: AlertTriangle,
  system: Bell,
  sms: MessageSquare,
  email: Mail,
  escalation: Shield,
};

const typeColors = {
  emergency: "text-red-500 bg-red-500/10",
  system: "text-blue-500 bg-blue-500/10",
  sms: "text-emerald-500 bg-emerald-500/10",
  email: "text-purple-500 bg-purple-500/10",
  escalation: "text-amber-500 bg-amber-500/10",
};

function formatRelative(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function NotificationItem({ notification }: { notification: Notification }) {
  const Icon = typeIcons[notification.type];
  const colorClass = typeColors[notification.type];

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "flex gap-3 p-4 rounded-xl transition-colors cursor-pointer",
        "hover:bg-muted/50",
        !notification.read && "bg-muted/30"
      )}
    >
      <div className={cn("rounded-xl p-2.5 h-fit shrink-0", colorClass.split(" ")[1])}>
        <Icon className={cn("size-4", colorClass.split(" ")[0])} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm", !notification.read ? "font-semibold" : "font-medium")}>
            {notification.title}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            {!notification.read && <PulseIndicator color="blue" size="sm" />}
            <span className="text-xs text-muted-foreground">{formatRelative(notification.timestamp)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.description}</p>
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = React.useState("all");
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const filtered = tab === "all"
    ? mockNotifications
    : mockNotifications.filter((n) => n.type === tab);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pt-2">
      <motion.div variants={staggerItem} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <CheckCheck className="size-4" /> Mark all read
        </Button>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="w-full overflow-x-auto">
            <TabsList className="w-full min-w-max h-auto p-1 flex">
              <TabsTrigger value="all" className="shrink-0 flex-1">All</TabsTrigger>
              <TabsTrigger value="emergency" className="shrink-0 flex-1">Emergencies</TabsTrigger>
              <TabsTrigger value="system" className="shrink-0 flex-1">System</TabsTrigger>
              <TabsTrigger value="sms" className="shrink-0 flex-1">SMS</TabsTrigger>
              <TabsTrigger value="email" className="shrink-0 flex-1">Email</TabsTrigger>
              <TabsTrigger value="escalation" className="shrink-0 flex-1">Escalation</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </motion.div>

      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent >
            <ScrollArea className="h-[600px]">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                key={tab}
                className="space-y-1"
              >
                {filtered.map((n) => (
                  <NotificationItem key={n.id} notification={n} />
                ))}
              </motion.div>
            </ScrollArea>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
