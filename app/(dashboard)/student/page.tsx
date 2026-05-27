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
import { studentProfile, studentNotifications, clinicStatus } from "@/lib/mock-data";
import { CheckCircle2, Shield, ChevronRight, Clock, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentMobilePage() {
  const [emergencyOpen, setEmergencyOpen] = React.useState(false);
  const unreadCount = studentNotifications.filter((n) => !n.read).length;

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
            <h1 className="text-xl font-semibold tracking-tight">{studentProfile.name.split(" ")[0]}</h1>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Link href="/student/notifications" className="relative p-2">
                <Bell className="size-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 size-4 rounded-full bg-crosshere text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              </Link>
            )}
            <Link href="/student/health">
              <Avatar className="size-10">
                <AvatarFallback className="bg-crosshere/10 text-crosshere text-sm font-semibold">
                  {studentProfile.initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </motion.div>

        {/* ── Emergency Status ── */}
        <motion.div
          variants={staggerItem}
          className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-4 py-3"
        >
          <Shield className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">All Clear</p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">No active emergencies</p>
          </div>
          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
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
                      {clinicStatus.isOpen ? "Open now" : "Closed"} • {clinicStatus.hours}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{clinicStatus.waitTime}</span>
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
            {studentNotifications.slice(0, 3).map((item) => (
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
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{item.message}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0 capitalize">{item.type}</Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Emergency Flow Drawer */}
      <EmergencyFlow open={emergencyOpen} onOpenChange={setEmergencyOpen} />
    </>
  );
}
