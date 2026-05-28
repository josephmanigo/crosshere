"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { 
  Search,
  Download,
  List,
  Clock,
  LogIn,
  UserPlus,
  UploadCloud,
  Settings,
  AlertTriangle,
  Loader2,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getAuditLogs } from "@/lib/actions/admin";
import { toast } from "sonner";

const typeConfig = {
  login: { icon: LogIn, color: "text-blue-500", bg: "bg-blue-500/10" },
  logout: { icon: LogIn, color: "text-gray-500", bg: "bg-gray-500/10" },
  user_action: { icon: UserPlus, color: "text-purple-500", bg: "bg-purple-500/10" },
  import: { icon: UploadCloud, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  escalation: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  settings: { icon: Settings, color: "text-amber-500", bg: "bg-amber-500/10" },
  delete: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-600/10" },
  system: { icon: Settings, color: "text-indigo-500", bg: "bg-indigo-500/10" }
};

export default function AuditLogsPage() {
  const [viewMode, setViewMode] = React.useState<"timeline" | "table">("timeline");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs(200);
      setLogs(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filteredLogs = logs.filter(log => {
    const actorName = log.actor_name || "";
    const action = log.action || "";
    const target = log.target || "";
    
    const matchesSearch = 
      actorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (typeFilter === "all") return matchesSearch;
    return matchesSearch && log.type === typeFilter;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No logs to export.");
      return;
    }
    const headers = ["Timestamp", "Type", "Actor", "Action", "Target"];
    const rows = filteredLogs.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.type,
      log.actor_name,
      log.action,
      log.target || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `crosshere_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and review system activity for security and compliance.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-muted/50 p-1 rounded-xl flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 rounded-lg px-3", viewMode === "timeline" ? "bg-background shadow-sm" : "")}
              onClick={() => setViewMode("timeline")}
            >
              <Clock className="size-4 mr-2" /> Timeline
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 rounded-lg px-3", viewMode === "table" ? "bg-background shadow-sm" : "")}
              onClick={() => setViewMode("table")}
            >
              <List className="size-4 mr-2" /> Table
            </Button>
          </div>
          <Button variant="outline" className="border-border/50" onClick={handleExportCSV}>
            <Download className="mr-2 size-4" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent className="flex flex-col min-h-[600px]">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border/50 gap-4 bg-muted/10">
              <div className="flex items-center w-full sm:w-auto gap-3 flex-wrap">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-9 rounded-full bg-muted/50 border-transparent h-9 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px] h-9 rounded-full bg-muted/50 border-transparent">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="login">Logins</SelectItem>
                    <SelectItem value="logout">Logouts</SelectItem>
                    <SelectItem value="user_action">User Actions</SelectItem>
                    <SelectItem value="import">Data Imports</SelectItem>
                    <SelectItem value="escalation">Escalations</SelectItem>
                    <SelectItem value="settings">Settings Changes</SelectItem>
                    <SelectItem value="system">System Events</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="h-9 bg-background/50 border-border/50" onClick={loadLogs}>
                  <Clock className="mr-2 size-4 text-muted-foreground" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="flex-1 p-0 relative">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="size-8 animate-spin text-crosshere" />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {viewMode === "timeline" ? (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6"
                    >
                      <div className="space-y-8">
                        {filteredLogs.map((log, i) => {
                          const tConf = typeConfig[log.type as keyof typeof typeConfig] || typeConfig.system;
                          const LogIcon = tConf.icon;
                          
                          return (
                            <div key={log.id} className="relative pl-10">
                              {/* Timeline line */}
                              {i !== filteredLogs.length - 1 && (
                                <div className="absolute left-4 top-10 bottom-[-32px] w-px bg-border/50" />
                              )}
                              
                              {/* Timeline icon */}
                              <div className={cn(
                                "absolute left-0 top-1 size-8 rounded-full border-4 border-background flex items-center justify-center",
                                tConf.bg
                              )}>
                                <LogIcon className={cn("size-3.5", tConf.color)} />
                              </div>
                              
                              <div className="bg-muted/10 border border-border/30 rounded-xl p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {log.action}
                                  </p>
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(log.created_at).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">{log.actor_name}</span>
                                  {log.target && (
                                    <>
                                      <span>&rarr;</span>
                                      <Badge variant="secondary" className="bg-background border-border/50 text-xs font-normal">
                                        {log.target}
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {filteredLogs.length === 0 && (
                          <div className="text-center py-10 text-muted-foreground">
                            No audit logs found matching your criteria.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Event Type</TableHead>
                            <TableHead>Actor</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Target</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLogs.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                No audit logs found.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredLogs.map((log) => {
                              const tConf = typeConfig[log.type as keyof typeof typeConfig] || typeConfig.system;
                              const LogIcon = tConf.icon;
                              return (
                                <TableRow key={log.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                    {new Date(log.created_at).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider", tConf.bg, tConf.color)}>
                                      <LogIcon className="size-3" />
                                      {log.type.replace('_', ' ')}
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">{log.actor_name}</TableCell>
                                  <TableCell>{log.action}</TableCell>
                                  <TableCell>
                                    {log.target ? (
                                      <Badge variant="secondary" className="bg-transparent border-border/50 text-xs font-normal">
                                        {log.target}
                                      </Badge>
                                    ) : "—"}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
            
            <div className="p-4 border-t border-border/50 mt-auto bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
              <span>Showing {filteredLogs.length} events</span>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
