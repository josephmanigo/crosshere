"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  Printer,
  Clock,
  BarChart3,
  Shield,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

// ── Mock Reports ────────────────────────────────────────────────────────────
interface Report {
  id: string;
  title: string;
  type: "weekly" | "monthly" | "incident" | "compliance" | "custom";
  generatedAt: string;
  period: string;
  author: string;
  status: "ready" | "generating" | "scheduled";
  size: string;
  stats?: { incidents: number; resolved: number; avgResponse: string };
}

const mockReports: Report[] = [
  {
    id: "RPT-2026-021",
    title: "Weekly Incident Summary",
    type: "weekly",
    generatedAt: "2026-05-25T16:00:00Z",
    period: "May 19 – May 25, 2026",
    author: "System",
    status: "ready",
    size: "2.4 MB",
    stats: { incidents: 18, resolved: 17, avgResponse: "2.4 min" },
  },
  {
    id: "RPT-2026-020",
    title: "Monthly Health Report — May",
    type: "monthly",
    generatedAt: "2026-05-25T12:00:00Z",
    period: "May 1 – May 25, 2026",
    author: "System",
    status: "ready",
    size: "5.8 MB",
    stats: { incidents: 35, resolved: 32, avgResponse: "2.6 min" },
  },
  {
    id: "RPT-2026-019",
    title: "Compliance Audit — Q2",
    type: "compliance",
    generatedAt: "2026-05-20T09:00:00Z",
    period: "Q2 2026",
    author: "Admin",
    status: "ready",
    size: "3.1 MB",
  },
  {
    id: "RPT-2026-018",
    title: "Incident Detail — INC-1042",
    type: "incident",
    generatedAt: "2026-05-26T09:50:00Z",
    period: "May 26, 2026",
    author: "Nurse Sarah Mitchell",
    status: "ready",
    size: "1.2 MB",
    stats: { incidents: 1, resolved: 0, avgResponse: "1.2 min" },
  },
  {
    id: "RPT-2026-017",
    title: "Weekly Incident Summary",
    type: "weekly",
    generatedAt: "2026-05-18T16:00:00Z",
    period: "May 12 – May 18, 2026",
    author: "System",
    status: "ready",
    size: "2.1 MB",
    stats: { incidents: 14, resolved: 14, avgResponse: "2.8 min" },
  },
  {
    id: "RPT-2026-016",
    title: "Student Health Trend Analysis",
    type: "custom",
    generatedAt: "2026-05-15T10:00:00Z",
    period: "Jan – May 2026",
    author: "Dr. Alan Rivera",
    status: "ready",
    size: "4.5 MB",
    stats: { incidents: 293, resolved: 280, avgResponse: "2.9 min" },
  },
  {
    id: "RPT-2026-SCHED-001",
    title: "Monthly Health Report — June",
    type: "monthly",
    generatedAt: "",
    period: "Jun 1 – Jun 30, 2026",
    author: "System",
    status: "scheduled",
    size: "—",
  },
];

const reportTypeConfig: Record<
  Report["type"],
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  weekly: {
    label: "Weekly",
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  monthly: {
    label: "Monthly",
    icon: BarChart3,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  incident: {
    label: "Incident",
    icon: FileText,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  compliance: {
    label: "Compliance",
    icon: Shield,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  custom: {
    label: "Custom",
    icon: TrendingUp,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
};

const statusBadgeConfig: Record<
  Report["status"],
  { label: string; className: string }
> = {
  ready: {
    label: "Ready",
    className:
      "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  generating: {
    label: "Generating...",
    className:
      "text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "text-muted-foreground border-border bg-muted/50",
  },
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return "Scheduled";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ReportsPage() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");

  const filtered = mockReports.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const readyReports = mockReports.filter((r) => r.status === "ready").length;
  const totalIncidents = mockReports
    .filter((r) => r.stats)
    .reduce((acc, r) => acc + (r.stats?.incidents || 0), 0);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
            Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate, view, and download health and incident reports
          </p>
        </div>
        <Button className="bg-crosshere hover:bg-crosshere/90 text-white hidden sm:flex">
          <FileText className="size-4" />
          Generate Report
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={staggerItem}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <GlassCard intensity="subtle">
          <GlassCardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-blue-500/10">
                <FileText className="size-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Reports</p>
                <p className="text-xl font-semibold tracking-tight">
                  <AnimatedCounter value={mockReports.length} />
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard intensity="subtle">
          <GlassCardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-emerald-500/10">
                <Download className="size-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ready to Download</p>
                <p className="text-xl font-semibold tracking-tight">
                  <AnimatedCounter value={readyReports} />
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
        <GlassCard intensity="subtle">
          <GlassCardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-xl p-2 bg-amber-500/10">
                <Users className="size-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incidents Covered</p>
                <p className="text-xl font-semibold tracking-tight">
                  <AnimatedCounter value={totalIncidents} />
                </p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="incident">Incident</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Report List */}
      <motion.div variants={staggerItem} className="space-y-3">
        {filtered.length === 0 ? (
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="size-10 mb-3 opacity-30" />
                <p className="text-sm">No reports match your filters.</p>
              </div>
            </GlassCardContent>
          </GlassCard>
        ) : (
          filtered.map((report) => {
            const typeConf = reportTypeConfig[report.type];
            const statusConf = statusBadgeConfig[report.status];
            const TypeIcon = typeConf.icon;

            return (
              <GlassCard
                key={report.id}
                intensity="subtle"
                hover
              >
                <GlassCardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Icon + Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "rounded-xl p-2.5 shrink-0",
                          typeConf.bg
                        )}
                      >
                        <TypeIcon className={cn("size-5", typeConf.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-semibold truncate">
                            {report.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] shrink-0", statusConf.className)}
                          >
                            {statusConf.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="font-mono">{report.id}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {report.period}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDateTime(report.generatedAt)}
                          </span>
                          <span>by {report.author}</span>
                        </div>

                        {/* Inline stats */}
                        {report.stats && (
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs">
                              <span className="font-medium text-foreground">
                                {report.stats.incidents}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                incidents
                              </span>
                            </span>
                            <span className="text-xs">
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                {report.stats.resolved}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                resolved
                              </span>
                            </span>
                            <span className="text-xs">
                              <span className="font-medium text-foreground">
                                {report.stats.avgResponse}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                avg response
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                      {report.status === "ready" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                          >
                            <Eye className="size-3.5" />
                            <span className="hidden sm:inline ml-1">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                          >
                            <Printer className="size-3.5" />
                            <span className="hidden sm:inline ml-1">Print</span>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="size-3.5" />
                            <span className="ml-1">Download</span>
                          </Button>
                        </>
                      )}
                      {report.status === "scheduled" && (
                        <span className="text-xs text-muted-foreground italic">
                          Auto-generates on period end
                        </span>
                      )}
                      {report.status === "generating" && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                          <div className="size-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                          Processing...
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            );
          })
        )}
      </motion.div>

      {/* Footer */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {mockReports.length} reports
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
