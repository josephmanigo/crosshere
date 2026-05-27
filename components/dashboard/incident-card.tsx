"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { MapPin, Clock, Eye, AlertTriangle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerItem } from "@/lib/animations";
import type { Incident } from "@/lib/mock-data";

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function getElapsedMinutes(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / 60000);
}

export function IncidentCard({ incident, onClick }: IncidentCardProps) {
  const elapsed = getElapsedMinutes(incident.reportedAt);
  const isActive = incident.status !== "resolved";

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "group relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:-translate-y-0.5",
        "bg-card/60 dark:bg-card/40 backdrop-blur-sm border-border/50",
        incident.severity === "critical" && isActive && "border-red-500/30 dark:border-red-500/20"
      )}
      onClick={onClick}
    >
      {/* Critical glow */}
      {incident.severity === "critical" && isActive && (
        <div className="absolute inset-0 rounded-2xl bg-red-500/[0.03] dark:bg-red-500/[0.05] pointer-events-none" />
      )}

      <div className="relative flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar className="size-10">
            <AvatarFallback className="bg-muted text-sm font-medium">
              {incident.studentAvatar}
            </AvatarFallback>
          </Avatar>
          {isActive && (
            <span className="absolute -bottom-0.5 -right-0.5">
              <PulseIndicator
                color={incident.severity === "critical" ? "red" : incident.severity === "high" ? "amber" : "blue"}
                size="sm"
              />
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-sm font-medium truncate">{incident.studentName}</p>
              <p className="text-xs text-muted-foreground">{incident.id}</p>
            </div>
            <StatusBadge severity={incident.severity} pulse={incident.severity === "critical" && isActive} />
          </div>

          <p className="text-sm font-medium text-foreground/90 mt-2 mb-2">{incident.type}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {incident.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatTime(incident.reportedAt)}
            </span>
            {isActive && (
              <span className={cn(
                "flex items-center gap-1 font-medium",
                elapsed > 5 ? "text-red-600 dark:text-red-400" : elapsed > 2 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
              )}>
                <AlertTriangle className="size-3" />
                {elapsed}m ago
              </span>
            )}
          </div>

          {/* Responder */}
          {incident.responder && (
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-medium text-foreground/70">Responder:</span> {incident.responder}
            </p>
          )}
        </div>

        {/* View arrow */}
        <Button
          variant="ghost"
          size="icon-xs"
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1"
        >
          <ArrowUpRight className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
