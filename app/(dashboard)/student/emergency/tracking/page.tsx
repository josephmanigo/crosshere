"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { staggerContainer, staggerItem, breatheAnimation } from "@/lib/animations";
import { liveEmergencyData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  Circle,
  Phone,
  X,
  ArrowLeft,
  Shield,
} from "lucide-react";

const statusStepIcons = {
  complete: CheckCircle2,
  active: Clock,
  pending: Circle,
};

export default function EmergencyTrackingPage() {
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const data = liveEmergencyData;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <Link href="/student/emergency" className="p-2 -ml-2 rounded-xl hover:bg-muted/50">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-base font-semibold">Live Tracking</h1>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          onClick={() => setCancelOpen(true)}
        >
          <X className="size-4" />
        </Button>
      </motion.div>

      {/* Emergency Badge */}
      <motion.div variants={staggerItem} className="flex justify-center">
        <Badge
          className="px-4 py-1.5 text-sm rounded-full bg-crosshere/10 text-crosshere border-crosshere/20 gap-2"
          variant="outline"
        >
          <PulseIndicator color="red" size="sm" />
          {data.type}
        </Badge>
      </motion.div>

      {/* Responder Card */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="medium" glow>
          <GlassCardContent>
            <motion.div
              animate={breatheAnimation}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-crosshere/10 text-crosshere text-lg font-semibold">
                    {data.responder.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                  <UserCheck className="size-2.5 text-white" />
                </span>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold">{data.responder.name}</p>
                <p className="text-sm text-muted-foreground">{data.responder.role}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="size-3 text-crosshere" />
                  <span className="text-sm font-semibold text-crosshere">ETA: {data.responder.eta}</span>
                </div>
              </div>
              <Button variant="outline" size="icon" className="rounded-full shrink-0">
                <Phone className="size-4 text-crosshere" />
              </Button>
            </motion.div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Location */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 px-1">
          <MapPin className="size-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">{data.location}</p>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={staggerItem}>
        <h2 className="text-sm font-semibold mb-4">Status</h2>
        <div className="space-y-0">
          {data.timeline.map((entry, i) => {
            const Icon = statusStepIcons[entry.status];
            const isLast = i === data.timeline.length - 1;

            return (
              <div key={entry.label} className="flex gap-3">
                {/* Vertical line + icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "size-7 rounded-full flex items-center justify-center shrink-0 border",
                      entry.status === "complete" && "bg-emerald-500/15 border-emerald-500/30",
                      entry.status === "active" && "bg-crosshere/15 border-crosshere/30",
                      entry.status === "pending" && "bg-muted/50 border-border/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-3.5",
                        entry.status === "complete" && "text-emerald-500",
                        entry.status === "active" && "text-crosshere",
                        entry.status === "pending" && "text-muted-foreground/50"
                      )}
                    />
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-px h-10",
                        entry.status === "complete" ? "bg-emerald-500/30" : "bg-border/40"
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-6 flex-1">
                  <div className="flex items-center gap-2 -mt-0.5">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        entry.status === "pending" && "text-muted-foreground/50"
                      )}
                    >
                      {entry.label}
                    </p>
                    {entry.status === "active" && (
                      <PulseIndicator color="red" size="sm" />
                    )}
                  </div>
                  <p className={cn(
                    "text-xs mt-0.5",
                    entry.status === "pending"
                      ? "text-muted-foreground/40"
                      : "text-muted-foreground"
                  )}>
                    {entry.description}
                  </p>
                  {entry.status !== "pending" && (
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{entry.time}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Guardian Status */}
      <motion.div variants={staggerItem}>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2">
                <Shield className="size-4 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Guardian Notified</p>
                <p className="text-xs text-muted-foreground">
                  Maria Rodriguez has been alerted
                </p>
              </div>
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Cancel Confirmation */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Emergency?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this emergency alert? The responder will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Active</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/student" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Cancel Emergency
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
