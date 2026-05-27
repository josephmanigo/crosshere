"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatusTracker } from "@/components/dashboard/status-tracker";
import { ResponseTimer } from "@/components/dashboard/response-timer";
import { Timeline } from "@/components/incidents/timeline";
import { PageHeader } from "@/components/shared/page-header";
import { mockIncidents, mockTimeline, mockTreatmentLogs } from "@/lib/mock-data";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function IncidentDetailPage() {
  const incident = mockIncidents[0]; // Demo: first incident

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Back + Header */}
      <motion.div variants={staggerItem}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{incident.id}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{incident.type}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge severity={incident.severity} pulse />
            <ResponseTimer startTime={incident.reportedAt} />
          </div>
        </div>
      </motion.div>

      {/* Status Tracker */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent >
            <StatusTracker currentStatus={incident.status} />
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Details */}
        <motion.div variants={staggerItem} className="lg:col-span-3 space-y-6">
          {/* Student Profile */}
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-4">Student Profile</h3>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-crosshere/10 text-crosshere text-lg font-semibold">
                    {incident.studentAvatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold">{incident.studentName}</p>
                  <p className="text-sm text-muted-foreground">{incident.studentId} • Grade 10</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Location</p>
                  <p className="flex items-center gap-1.5 font-medium"><MapPin className="size-3.5" />{incident.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Responder</p>
                  <p className="flex items-center gap-1.5 font-medium"><User className="size-3.5" />{incident.responder || "—"}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-xs text-muted-foreground mb-2">Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {incident.symptoms.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{incident.description}</p>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Treatment Logs */}
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-4">Treatment Log</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Time</TableHead>
                    <TableHead className="text-xs">Treatment</TableHead>
                    <TableHead className="text-xs">Administered By</TableHead>
                    <TableHead className="text-xs">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTreatmentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs font-mono">{log.time}</TableCell>
                      <TableCell className="text-sm font-medium">{log.treatment}</TableCell>
                      <TableCell className="text-sm">{log.administeredBy}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GlassCardContent>
          </GlassCard>

          {/* Response Notes */}
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-3">Response Notes</h3>
              <Textarea
                defaultValue={incident.responseNotes}
                placeholder="Add response notes..."
                className="min-h-[100px] resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button size="sm" className="bg-crosshere hover:bg-crosshere/90 text-white">
                  Save Notes
                </Button>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Right — Timeline */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <h3 className="text-sm font-semibold mb-4">Live Timeline</h3>
              <Timeline entries={mockTimeline} />
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
