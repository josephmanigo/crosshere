"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmergencyButton } from "@/components/student/emergency-button";
import { EmergencyFlow } from "@/components/student/emergency-flow";
import { HealthCard } from "@/components/student/health-card";
import { QuickActions } from "@/components/student/quick-actions";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { CheckCircle2, Shield, ChevronRight, Clock, Bell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { getMyStudentProfile } from "@/lib/actions/students";
import { getMyNotifications } from "@/lib/actions/notifications";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { getStudentIncidents } from "@/lib/actions/incidents";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentMobilePage() {
  const [emergencyOpen, setEmergencyOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [activeIncidents, setActiveIncidents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const user = useAuthStore((s) => s.user);
  const authProfile = useAuthStore((s) => s.profile);

  // Realtime notifications
  const { unreadCount } = useRealtimeNotifications(user?.id, (newNotif) => {
    setNotifications((prev) => [newNotif, ...prev]);
  });

  React.useEffect(() => {
    async function loadData() {
      try {
        const [studentData, notifData] = await Promise.all([
          getMyStudentProfile().catch(() => null),
          getMyNotifications(10).catch(() => []),
        ]);

        setProfile(studentData);
        setNotifications(notifData ?? []);

        if (studentData?.id) {
          const incidents = await getStudentIncidents(studentData.id).catch(() => []);
          setActiveIncidents(incidents.filter((i: any) => i.status !== "resolved"));
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const displayName = authProfile?.full_name?.split(" ")[0] ?? "Student";
  const initials = (authProfile?.full_name ?? "S")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const actualUnread = notifications.filter((n) => !n.read).length + unreadCount;
  const hasActiveEmergency = activeIncidents.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-crosshere" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 pt-2"
      >
        {/* ── Greeting ── */}
        <motion.div variants={staggerItem} className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <h1 className="text-xl font-semibold tracking-tight">{displayName}</h1>
          </div>
          <div className="flex items-center gap-2">
            {actualUnread > 0 && (
              <Link href="/student/notifications" className="relative p-2">
                <Bell className="size-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 size-4 rounded-full bg-crosshere text-white text-[9px] font-bold flex items-center justify-center">
                  {actualUnread > 9 ? "9+" : actualUnread}
                </span>
              </Link>
            )}
            <Link href="/student/health">
              <Avatar className="size-10">
                <AvatarFallback className="bg-crosshere/10 text-crosshere text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </motion.div>

        {/* ── Emergency Status ── */}
        <motion.div
          variants={staggerItem}
          className={cn(
            "flex items-center gap-2.5 rounded-2xl border px-4 py-3",
            hasActiveEmergency
              ? "bg-red-500/10 dark:bg-red-500/15 border-red-500/20"
              : "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20"
          )}
        >
          <Shield className={cn("size-5 shrink-0", hasActiveEmergency ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400")} />
          <div className="flex-1">
            <p className={cn("text-sm font-medium", hasActiveEmergency ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300")}>
              {hasActiveEmergency ? "Active Emergency" : "All Clear"}
            </p>
            <p className={cn("text-xs", hasActiveEmergency ? "text-red-600/70 dark:text-red-400/70" : "text-emerald-600/70 dark:text-emerald-400/70")}>
              {hasActiveEmergency
                ? `${activeIncidents[0]?.type} — help is on the way`
                : "No active emergencies"}
            </p>
          </div>
          {hasActiveEmergency
            ? <PulseIndicator color="red" size="md" />
            : <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />}
        </motion.div>

        {/* ── SOS Button ── */}
        <motion.div variants={staggerItem} className="flex justify-center py-3">
          <EmergencyButton onActivate={() => setEmergencyOpen(true)} />
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div variants={staggerItem}>
          <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
          <QuickActions />
        </motion.div>

        {/* ── Clinic Availability ── */}
        <motion.div variants={staggerItem}>
          <GlassCard size="sm" intensity="subtle">
            <GlassCardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-emerald-500/10 p-2">
                    <PulseIndicator color="green" size="md" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">School Clinic</p>
                    <p className="text-xs text-muted-foreground">
                      Open now • 7:30 AM — 4:00 PM
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>~5 min</span>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* ── Health Card ── */}
        <motion.div variants={staggerItem}>
          <HealthCard />
        </motion.div>

        {/* ── Recent Notifications ── */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent</h2>
            <Link href="/student/notifications" className="text-xs text-crosshere font-medium flex items-center gap-0.5">
              See all <ChevronRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-colors",
                  item.read
                    ? "bg-card/30 dark:bg-card/20 border-border/20"
                    : "bg-card/60 dark:bg-card/40 border-border/40"
                )}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-1.5">
                    {!item.read && <span className="size-1.5 rounded-full bg-crosshere shrink-0" />}
                    <p className={cn("text-sm truncate", !item.read && "font-semibold")}>{item.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0 capitalize">{item.type}</Badge>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No recent notifications</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Emergency Flow Drawer */}
      <EmergencyFlow open={emergencyOpen} onOpenChange={setEmergencyOpen} />
    </>
  );
}
