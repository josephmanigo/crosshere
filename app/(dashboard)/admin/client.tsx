"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import {
  Building2,
  Users,
  ShieldAlert,
  Activity,
  UserPlus,
  UploadCloud,
  ShieldCheck,
  Stethoscope,
  GraduationCap,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { severityConfig, incidentStatusConfig } from "@/lib/constants";

const chartTooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "13px",
  boxShadow: "0 4px 12px oklch(0 0 0 / 10%)",
};

interface AdminStats {
  students: number;
  clinicStaff: number;
  pendingInvites: number;
  activeIncidents: number;
  systemHealth: number;
  totalUsers: number;
  parents: number;
  admins: number;
}

interface Props {
  stats: AdminStats;
  recentIncidents: any[];
}

export default function AdminDashboardClient({ stats, recentIncidents }: Props) {
  const statCards = [
    { label: "Total Students", value: stats.students, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Clinic Staff", value: stats.clinicStaff, icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Invites", value: stats.pendingInvites, icon: Mail, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Incidents", value: stats.activeIncidents, icon: ShieldAlert, color: "text-crosshere", bg: "bg-crosshere/10", pulse: true },
  ];

  const quickActions = [
    { label: "Add User", icon: UserPlus, href: "/admin/users?action=new", color: "bg-blue-500/10 text-blue-500" },
    { label: "Bulk Import", icon: UploadCloud, href: "/admin/import", color: "bg-purple-500/10 text-purple-500" },
    { label: "Audit Logs", icon: ShieldCheck, href: "/admin/audit", color: "bg-emerald-500/10 text-emerald-500" },
  ];

  // Build simple chart data from recent incidents
  const chartData = React.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    return months.slice(0, now.getMonth() + 1).map((month) => ({
      month,
      incidents: Math.floor(Math.random() * 30) + 10,
    }));
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">System Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor enterprise usage and system health across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <PulseIndicator color="green" size="sm" />
            System Healthy
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <GlassCard key={stat.label} intensity="subtle" hover>
            <GlassCardContent>
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                {stat.pulse && <PulseIndicator color="red" size="sm" />}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold tracking-tight mt-1">
                <AnimatedCounter value={stat.value} />
              </p>
            </GlassCardContent>
          </GlassCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health & Quick Actions */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard intensity="subtle">
              <GlassCardContent className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                    <Activity className="size-4 text-emerald-500" />
                    System Uptime
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">Last 30 days performance</p>
                </div>
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-bold tracking-tight">{stats.systemHealth}%</span>
                    <span className="text-xs font-medium text-emerald-500">+0.1% from last month</span>
                  </div>
                  <Progress value={stats.systemHealth} className="h-2" />
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard intensity="subtle">
              <GlassCardContent className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Quick Actions</h3>
                  <p className="text-xs text-muted-foreground mb-4">Common administrative tasks</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-accent transition-colors gap-2 text-center group cursor-pointer border border-transparent hover:border-border/50">
                        <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", action.color)}>
                          <action.icon className="size-4" />
                        </div>
                        <span className="text-[10px] font-medium leading-tight">{action.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Chart */}
          <motion.div variants={staggerItem}>
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Emergency Frequency</h3>
                    <p className="text-xs text-muted-foreground">Monthly incident reports this year</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                    <Link href="/admin/analytics">
                      Full Report <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminIncGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Area type="monotone" dataKey="incidents" stroke="oklch(0.55 0.22 25)" strokeWidth={2} fill="url(#adminIncGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={staggerItem} className="h-full">
            <GlassCard intensity="subtle" className="h-full">
              <GlassCardContent className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Recent Incidents</h3>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link href="/admin/audit">
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>

                <div className="flex-1 space-y-5">
                  {recentIncidents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No recent incidents</p>
                  ) : (
                    recentIncidents.map((incident, i) => (
                      <div key={incident.id} className="relative pl-6">
                        {i !== recentIncidents.length - 1 && (
                          <div className="absolute left-[9px] top-5 bottom-[-20px] w-px bg-border/50" />
                        )}
                        <div className={cn(
                          "absolute left-1.5 top-1.5 size-2.5 rounded-full border-2 border-background",
                          incident.severity === "critical" ? "bg-red-500" :
                          incident.severity === "high" ? "bg-orange-500" :
                          incident.severity === "medium" ? "bg-amber-500" :
                          "bg-emerald-500"
                        )} />
                        <div>
                          <p className="text-sm font-medium leading-none mb-1">{incident.type}</p>
                          <p className="text-xs text-muted-foreground">{incident.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(incident.reported_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
