"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Activity, Users, Download, Filter, Loader2 } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getMonthlyAnalytics, getIncidentBreakdown, getResponseTimeDistribution } from "@/lib/actions/analytics";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const chartTooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "13px",
  boxShadow: "0 4px 12px oklch(0 0 0 / 10%)",
};

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
  const [monthlyData, setMonthlyData] = React.useState<any[]>([]);
  const [breakdownData, setBreakdownData] = React.useState<any[]>([]);
  const [responseTimeData, setResponseTimeData] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadAnalyticsData = React.useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      const [monthly, breakdown, responseTime, avgResponseRes, resolutionRes, studentsAffectedRes] = await Promise.all([
        getMonthlyAnalytics().catch(() => []),
        getIncidentBreakdown().catch(() => []),
        getResponseTimeDistribution().catch(() => []),
        (supabase.rpc("get_avg_response_time_minutes") as any).catch(() => ({ data: 0 })),
        (supabase.from("incidents").select("id, status") as any).catch(() => ({ data: [] })),
        (supabase.from("incidents").select("student_id", { count: "exact" }) as any).catch(() => ({ count: 0 })),
      ]);

      setMonthlyData(monthly);
      setBreakdownData(breakdown);
      setResponseTimeData(responseTime);

      const totalEmergencies = breakdown.reduce((acc, curr) => acc + curr.count, 0);
      const avgResponse = avgResponseRes?.data || 0;
      
      // Calculate resolution rate
      const allIncidents = resolutionRes?.data || [];
      const resolvedCount = allIncidents.filter((i: any) => i.status === "resolved").length;
      const resolutionRate = allIncidents.length > 0 ? (resolvedCount / allIncidents.length) * 100 : 100;

      const newStats = [
        { label: "Total Emergencies", value: totalEmergencies, icon: Activity, color: "text-crosshere", bg: "bg-crosshere/10", change: "+5%", up: true },
        { label: "Avg Response Time", value: Number(avgResponse), suffix: " min", decimals: 1, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", change: "-8%", up: false },
        { label: "Resolution Rate", value: Number(resolutionRate), suffix: "%", decimals: 1, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", change: "+1.2%", up: true },
        { label: "Students Affected", value: studentsAffectedRes?.count || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", change: "+2%", up: true },
      ];
      setStats(newStats);
    } catch (err: any) {
      toast.error(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Export report as CSV
  const handleExportCSV = () => {
    if (breakdownData.length === 0) {
      toast.error("No data to export.");
      return;
    }
    const headers = ["Category", "Incident Count", "Percentage"];
    const rows = breakdownData.map(d => [d.category, d.count, `${d.percentage}%`]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crosshere_health_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-crosshere" />
      </div>
    );
  }

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
          <Button variant="outline" size="sm" className="h-9 border-border/50" onClick={loadAnalyticsData}>
            <Filter className="mr-2 size-4" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-border/50" onClick={handleExportCSV}>
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
                {monthlyData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No timeline data available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                )}
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
                {breakdownData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No category data available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdownData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={90} />
                      <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                        {breakdownData.map((_, i) => (
                          <Cell key={i} fill={barColors[i % barColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
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
                {responseTimeData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No response time data available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseTimeData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} vertical={false} />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                      <Bar dataKey="count" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
