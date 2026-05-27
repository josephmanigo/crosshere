"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Activity, Users, Download, Filter } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { monthlyAnalytics, illnessBreakdown, responseTimeDistribution, dashboardStats } from "@/lib/mock-data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const chartTooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "13px",
  boxShadow: "0 4px 12px oklch(0 0 0 / 10%)",
};

const stats = [
  { label: "Total Emergencies (YTD)", value: 2450, icon: Activity, color: "text-crosshere", bg: "bg-crosshere/10", change: "+8%", up: true },
  { label: "Avg Response Time", value: dashboardStats.avgResponseTime, suffix: " min", decimals: 1, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", change: "-12%", up: false },
  { label: "Resolution Rate", value: 98.2, suffix: "%", decimals: 1, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "+1.1%", up: true },
  { label: "Students Affected", value: 1420, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", change: "+5%", up: true },
];

const barColors = [
  "oklch(0.55 0.22 25)", 
  "oklch(0.6 0.15 15)", 
  "oklch(0.65 0.1 40)", 
  "oklch(0.55 0.08 250)", 
  "oklch(0.7 0.05 80)", 
  "oklch(0.5 0.12 30)", 
  "oklch(0.6 0.06 60)", 
  "oklch(0.45 0.1 40)"
];

export default function AdminAnalyticsPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">System Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide health and usage metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 border-border/50">
            <Filter className="mr-2 size-4" />
            Last 12 Months
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-border/50">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.label} intensity="subtle" hover>
            <GlassCardContent>
              <div className="flex items-start justify-between mb-3">
                <div className={cn("rounded-xl p-2.5", s.bg)}>
                  <s.icon className={cn("size-5", s.color)} />
                </div>
                <span className={cn("text-xs font-medium flex items-center gap-0.5 px-2 py-1 rounded-md", s.up ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")}>
                  {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {s.change}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold tracking-tight mt-1">
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </p>
            </GlassCardContent>
          </GlassCard>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <motion.div variants={staggerItem}>
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <h3 className="text-sm font-semibold mb-1">Incident Frequency Over Time</h3>
              <p className="text-xs text-muted-foreground mb-6">Comparing reported vs resolved incidents globally.</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAnalytics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminIncGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="adminResGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.6 0.18 150)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.6 0.18 150)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area type="monotone" dataKey="incidents" stroke="oklch(0.55 0.22 25)" strokeWidth={2} fill="url(#adminIncGrad)" />
                    <Area type="monotone" dataKey="resolved" stroke="oklch(0.6 0.18 150)" strokeWidth={2} fill="url(#adminResGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Illness Breakdown */}
        <motion.div variants={staggerItem}>
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <h3 className="text-sm font-semibold mb-1">Global Health Categories</h3>
              <p className="text-xs text-muted-foreground mb-6">Distribution of emergency types platform-wide.</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={illnessBreakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={90} />
                    <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                      {illnessBreakdown.map((_, i) => (
                        <Cell key={i} fill={barColors[i % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1">
        <motion.div variants={staggerItem}>
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <h3 className="text-sm font-semibold mb-1">Global Response Time Distribution</h3>
              <p className="text-xs text-muted-foreground mb-6">Time from incident report to acknowledgment across all connected locations.</p>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                    <Bar dataKey="count" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
