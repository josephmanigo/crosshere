"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  MapPin,
  RefreshCw,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { incidentStatusConfig } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { getIncidents } from "@/lib/actions/incidents";
import { useLiveIncidents } from "@/hooks/use-realtime-incidents";
import { toast } from "sonner";

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStudentName(incident: any): string {
  return incident.students?.profiles?.full_name ?? "Unknown Student";
}

function getStudentInitials(incident: any): string {
  const name = getStudentName(incident);
  return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function IncidentsPage() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rawIncidents, setRawIncidents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load initial data
  const loadIncidents = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIncidents({ limit: 100 });
      setRawIncidents(data ?? []);
    } catch (err) {
      toast.error("Failed to load incidents");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  // Live updates via Realtime
  const incidents = useLiveIncidents(rawIncidents);

  const filtered = incidents.filter((inc) => {
    const studentName = getStudentName(inc).toLowerCase();
    const matchSearch =
      studentName.includes(search.toLowerCase()) ||
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.type.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || inc.severity === severityFilter;
    const matchStatus = statusFilter === "all" || inc.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  const summaryStats = [
    {
      label: "Total Active",
      value: incidents.filter((i) => i.status !== "resolved").length,
      icon: Activity,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Critical",
      value: incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length,
      icon: AlertTriangle,
      iconColor: "text-red-600",
      bgColor: "bg-red-600/10",
    },
    {
      label: "Responding",
      value: incidents.filter((i) => i.status === "responding").length,
      icon: Clock,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Resolved Today",
      value: incidents.filter((i) => {
        if (i.status !== "resolved" || !i.resolved_at) return false;
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return new Date(i.resolved_at) >= today;
      }).length,
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Incidents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, manage, and review all emergency incidents
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadIncidents} disabled={loading}>
          <RefreshCw className={cn("size-4 mr-2", loading && "animate-spin")} />
          Refresh
        </Button>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <GlassCard key={stat.label} intensity="subtle">
            <GlassCardContent>
              <div className="flex items-center gap-3">
                <div className={cn("rounded-xl p-2", stat.bgColor)}>
                  <stat.icon className={cn("size-4", stat.iconColor)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-full bg-muted/50 border-transparent"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-40 h-10 rounded-full bg-muted/50 border-transparent">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-10 rounded-full bg-muted/50 border-transparent">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="reported">Reported</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="responding">Responding</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="default" className="h-10">
          <Download className="size-4 mr-2" /> Export
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Responder</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="size-4 animate-spin" />
                          Loading incidents...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        No incidents found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((incident) => {
                      const isActive = incident.status !== "resolved";
                      const studentName = getStudentName(incident);
                      const initials = getStudentInitials(incident);
                      const responderName = (incident as any).responder?.full_name ?? "—";

                      return (
                        <TableRow
                          key={incident.id}
                          className="cursor-pointer hover:bg-muted/30"
                          onClick={() => router.push(`/clinic/incidents/${incident.id}`)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <PulseIndicator
                                  color={incident.severity === "critical" ? "red" : "amber"}
                                  size="sm"
                                />
                              )}
                              <span className="text-sm font-mono font-medium">
                                {incident.id.slice(0, 8).toUpperCase()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="size-7">
                                <AvatarFallback className="bg-muted text-[10px] font-medium">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{incident.type}</TableCell>
                          <TableCell>
                            <StatusBadge severity={incident.severity} />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs capitalize",
                                incidentStatusConfig[incident.status as keyof typeof incidentStatusConfig]?.className
                              )}
                            >
                              {incidentStatusConfig[incident.status as keyof typeof incidentStatusConfig]?.label ?? incident.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3" />
                              {incident.location}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <p>{formatTime(incident.reported_at)}</p>
                              <p className="text-muted-foreground">{formatDate(incident.reported_at)}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {responderName}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon-xs">
                              <ArrowUpRight className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {incidents.length} incidents
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
