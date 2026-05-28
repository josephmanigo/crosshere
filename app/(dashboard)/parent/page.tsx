"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Phone, Mail, Building2, Calendar, ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useAuthStore } from "@/store/auth-store";
import { getMyLinkedStudents } from "@/lib/actions/students";
import { getMyNotifications } from "@/lib/actions/notifications";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { severityConfig, incidentStatusConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ParentPortalPage() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);

  // Realtime notifications
  const { unreadCount } = useRealtimeNotifications(user?.id, (newNotif) => {
    setNotifications((prev) => [newNotif, ...prev]);
  });

  React.useEffect(() => {
    async function loadData() {
      try {
        const [studentsData, notifData] = await Promise.all([
          getMyLinkedStudents().catch(() => []),
          getMyNotifications(10).catch(() => []),
        ]);
        setStudents(studentsData as any[]);
        setNotifications(notifData ?? []);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] ?? "Parent";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-crosshere" />
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, {firstName}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {students.length > 0
            ? `Monitoring ${students.length} child${students.length > 1 ? "ren" : ""}`
            : "Here's your child's health overview"}
        </p>
      </motion.div>

      {/* Children */}
      {students.length === 0 ? (
        <motion.div variants={staggerItem}>
          <GlassCard intensity="subtle">
            <GlassCardContent className="text-center py-12">
              <p className="text-muted-foreground text-sm">No linked students found.</p>
              <p className="text-xs text-muted-foreground mt-1">Contact your school admin to link your child&apos;s account.</p>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      ) : (
        students.map((student: any) => {
          const studentName = student?.profiles?.full_name ?? "Student";
          const initials = studentName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
          const recentIncidents = student?.incidents ?? [];
          const activeIncidents = recentIncidents.filter((i: any) => i.status !== "resolved");
          const hasActiveEmergency = activeIncidents.length > 0;

          return (
            <motion.div key={student.id} variants={staggerItem}>
              <GlassCard intensity="medium">
                <GlassCardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="size-14">
                      <AvatarFallback className="bg-crosshere/10 text-crosshere text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold">{studentName}</h2>
                      <p className="text-sm text-muted-foreground">
                        {student.grade} • {student.section}
                      </p>
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-3 rounded-2xl border px-5 py-4",
                    hasActiveEmergency
                      ? "bg-red-500/10 dark:bg-red-500/15 border-red-500/20"
                      : "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20"
                  )}>
                    {hasActiveEmergency ? (
                      <AlertTriangle className="size-8 text-red-600 dark:text-red-400" />
                    ) : (
                      <Shield className="size-8 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <div className="flex-1">
                      <p className={cn("text-base font-semibold", hasActiveEmergency ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300")}>
                        {hasActiveEmergency ? "Active Incident" : "Your child is safe"}
                      </p>
                      <p className={cn("text-sm", hasActiveEmergency ? "text-red-600/70 dark:text-red-400/70" : "text-emerald-600/70 dark:text-emerald-400/70")}>
                        {hasActiveEmergency
                          ? `${activeIncidents[0].type} — School is responding`
                          : "No active emergencies or incidents"}
                      </p>
                    </div>
                    {hasActiveEmergency
                      ? <PulseIndicator color="red" size="md" />
                      : <CheckCircle2 className="size-6 text-emerald-500" />}
                  </div>

                  {/* Recent Incidents */}
                  {recentIncidents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <p className="text-xs font-semibold text-muted-foreground mb-3">RECENT INCIDENTS</p>
                      <div className="space-y-2">
                        {recentIncidents.slice(0, 3).map((incident: any) => (
                          <div key={incident.id} className="flex items-center justify-between py-1">
                            <div>
                              <p className="text-sm font-medium">{incident.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(incident.reported_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn("text-[10px]", incidentStatusConfig[incident.status as keyof typeof incidentStatusConfig]?.className)}
                            >
                              {incidentStatusConfig[incident.status as keyof typeof incidentStatusConfig]?.label ?? incident.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          );
        })
      )}

      {/* Recent Notifications */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <GlassCard intensity="subtle">
              <GlassCardContent className="text-center py-8 text-sm text-muted-foreground">
                No notifications yet
              </GlassCardContent>
            </GlassCard>
          ) : (
            notifications.slice(0, 5).map((n: any) => (
              <GlassCard key={n.id} intensity="subtle" hover>
                <GlassCardContent className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="size-1.5 rounded-full bg-crosshere shrink-0" />}
                      <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </GlassCardContent>
              </GlassCard>
            ))
          )}
        </div>
      </motion.div>

      {/* School Contacts */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-3">School Contacts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-crosshere/10 p-2"><Building2 className="size-4 text-crosshere" /></div>
                <p className="text-sm font-semibold">School Clinic</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <a href="tel:+15551002000" className="flex items-center gap-1.5 hover:underline hover:text-crosshere transition-colors">
                  <Phone className="size-3 text-crosshere shrink-0" />
                  <span>+1 (555) 100-2000</span>
                </a>
                <a href="mailto:clinic@school.edu" className="flex items-center gap-1.5 hover:underline hover:text-crosshere transition-colors">
                  <Mail className="size-3 text-muted-foreground shrink-0" />
                  <span>clinic@school.edu</span>
                </a>
              </div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-blue-500/10 p-2"><Phone className="size-4 text-blue-500" /></div>
                <p className="text-sm font-semibold">Emergency Hotline</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <a href="tel:+15559110000" className="flex items-center gap-1.5 hover:underline hover:text-blue-500 transition-colors">
                  <Phone className="size-3 text-blue-500 shrink-0" />
                  <span>+1 (555) 911-0000</span>
                </a>
                <p className="text-xs">Available 24/7</p>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </motion.div>
    </motion.div>
  );
}
