"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Activity, Users, Brain } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { monthlyAnalytics, illnessBreakdown, responseTimeDistribution, emergencyHeatmap } from "@/lib/mock-data";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const chartTooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "13px",
  boxShadow: "0 4px 12px oklch(0 0 0 / 10%)",
};

const stats = [
  { label: "Total Incidents (YTD)", value: 293, icon: Activity, color: "text-crosshere", bg: "bg-crosshere/10", change: "+12%", up: true },
  { label: "Avg Response Time", value: 2.8, suffix: " min", decimals: 1, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", change: "-15%", up: false },
  { label: "Students Affected", value: 187, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", change: "+3%", up: true },
];

const insights = [
  { title: "Respiratory Spike Expected", desc: "Seasonal trends predict a 23% increase in respiratory incidents next month.", trend: "+23%", up: true },
  { title: "Faster Response Trend", desc: "Response times have improved by 15% over the past quarter.", trend: "-15%", up: false },
  { title: "Mental Health Increase", desc: "Anxiety-related incidents up 18% — exam season correlation detected.", trend: "+18%", up: true },
];

const barColors = ["oklch(0.55 0.22 25)", "oklch(0.6 0.15 15)", "oklch(0.65 0.1 40)", "oklch(0.55 0.08 250)", "oklch(0.7 0.05 80)", "oklch(0.5 0.12 30)", "oklch(0.6 0.06 60)", "oklch(0.45 0.1 40)"];

export default function AnalyticsPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 pt-2"
    >
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Incident trends, response metrics, and predictive insights</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.label} intensity="subtle" hover>
            <GlassCardContent >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("rounded-xl p-2.5", s.bg)}>
                  <s.icon className={cn("size-5", s.color)} />
                </div>
                <span className={cn("text-xs font-medium flex items-center gap-0.5", s.up ? "text-red-500" : "text-emerald-500")}>
                  {s.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {s.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-semibold tracking-tight mt-1">
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
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-1">Monthly Incidents</h3>
              <p className="text-xs text-muted-foreground mb-4">Incidents vs resolved this year</p>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAnalytics} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.6 0.18 150)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.6 0.18 150)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area type="monotone" dataKey="incidents" stroke="oklch(0.55 0.22 25)" strokeWidth={2} fill="url(#incGrad)" />
                    <Area type="monotone" dataKey="resolved" stroke="oklch(0.6 0.18 150)" strokeWidth={2} fill="url(#resGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Illness Breakdown */}
        <motion.div variants={staggerItem}>
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-1">Illness Categories</h3>
              <p className="text-xs text-muted-foreground mb-4">Distribution by type</p>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={illnessBreakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={90} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time */}
        <motion.div variants={staggerItem} className="h-full">
          <GlassCard intensity="subtle" className="h-full">
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-1">Response Time Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">How quickly emergencies are addressed</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="count" fill="oklch(0.55 0.22 25)" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Heatmap */}
        <motion.div variants={staggerItem} className="h-full">
          <GlassCard intensity="subtle" className="h-full flex flex-col">
            <GlassCardContent className="flex-1 flex flex-col">
              <h3 className="text-sm font-semibold mb-1">Emergency Heatmap</h3>
              <p className="text-xs text-muted-foreground mb-4">Frequency by day and hour</p>
              <div className="overflow-x-auto h-[220px] flex flex-col justify-end">
                <div className="min-w-[500px]">
                  {/* Hour labels */}
                  <div className="flex mb-1 pl-10">
                    {Array.from({ length: 24 }).map((_, h) => (
                      <span key={h} className="flex-1 text-center text-[9px] text-muted-foreground">
                        {h % 3 === 0 ? `${h}` : ""}
                      </span>
                    ))}
                  </div>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <div key={day} className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] text-muted-foreground w-9 text-right pr-1">{day}</span>
                      <div className="flex flex-1 gap-0.5">
                        {emergencyHeatmap
                          .filter((c) => c.day === day)
                          .map((cell) => (
                            <div
                              key={`${cell.day}-${cell.hour}`}
                              className="flex-1 aspect-square rounded-sm transition-colors"
                              style={{
                                backgroundColor: cell.value === 0
                                  ? "var(--muted)"
                                  : `oklch(0.55 0.22 25 / ${Math.min(cell.value * 14, 100)}%)`,
                              }}
                              title={`${cell.day} ${cell.hour}:00 — ${cell.value} incidents`}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                  {/* Legend */}
                  <div className="flex items-center justify-end gap-1 mt-2 pr-1">
                    <span className="text-[9px] text-muted-foreground">Less</span>
                    {[0, 2, 4, 6, 8].map((v) => (
                      <div
                        key={v}
                        className="size-3 rounded-sm"
                        style={{
                          backgroundColor: v === 0 ? "var(--muted)" : `oklch(0.55 0.22 25 / ${v * 14}%)`,
                        }}
                      />
                    ))}
                    <span className="text-[9px] text-muted-foreground">More</span>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>

      {/* Predictive Insights */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="size-5 text-crosshere" />
          Predictive Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {insights.map((ins) => (
            <GlassCard key={ins.title} intensity="subtle" hover>
              <GlassCardContent >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">AI Insight</span>
                  <span className={cn("text-sm font-semibold flex items-center gap-0.5", ins.up ? "text-red-500" : "text-emerald-500")}>
                    {ins.up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    {ins.trend}
                  </span>
                </div>
                <h4 className="text-sm font-semibold mb-1">{ins.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{ins.desc}</p>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
