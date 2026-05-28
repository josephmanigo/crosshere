"use client";

import { motion } from "framer-motion";
import { Activity, Clock, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { EmergencyFeed } from "@/components/dashboard/emergency-feed";
import { MapPlaceholder } from "@/components/dashboard/map-placeholder";
import { AnalyticsPreview } from "@/components/dashboard/analytics-preview";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLiveIncidents } from "@/hooks/use-realtime-incidents";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import * as React from "react";

interface Stats {
  activeEmergencies: number;
  resolvedToday: number;
  pendingReview: number;
  avgResponseTime: number;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialIncidents: any[];
  stats: Stats;
}

export default function ClinicDashboardClient({ initialIncidents, stats }: Props) {
  const userId = useAuthStore((s) => s.user?.id);

  // Live incidents via Supabase Realtime
  const liveIncidents = useLiveIncidents(initialIncidents, (newIncident) => {
    if (newIncident.severity === "critical") {
      toast.error(`🚨 Critical Emergency: ${newIncident.type}`, {
        description: newIncident.location,
        duration: 10000,
      });
    }
  });

  // Live notifications
  useRealtimeNotifications(userId);

  // Derived live stats from realtime incidents
  const liveStats = React.useMemo(() => ({
    activeEmergencies: liveIncidents.filter((i) => i.status !== "resolved").length,
    resolvedToday: stats.resolvedToday,
    pendingReview: liveIncidents.filter((i) => ["reported", "acknowledged"].includes(i.status)).length,
    avgResponseTime: stats.avgResponseTime,
  }), [liveIncidents, stats]);

  const statCards = [
    {
      label: "Active Emergencies",
      value: liveStats.activeEmergencies,
      icon: AlertTriangle,
      iconColor: "text-red-500",
      bgColor: "bg-red-500/10",
      change: "Live count",
      pulse: true,
    },
    {
      label: "Avg Response Time",
      value: liveStats.avgResponseTime,
      icon: Clock,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
      suffix: " min",
      decimals: 1,
      change: "vs last week",
    },
    {
      label: "Resolved Today",
      value: liveStats.resolvedToday,
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      change: "Since midnight",
    },
    {
      label: "Pending Review",
      value: liveStats.pendingReview,
      icon: Activity,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "Awaiting action",
    },
  ];

  return (
    <div className="space-y-8 pt-2">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
          Emergency Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring and response management
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={staggerItem}>
            <GlassCard intensity="subtle" hover>
              <GlassCardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("rounded-xl p-2.5", stat.bgColor)}>
                    <stat.icon className={cn("size-5", stat.iconColor)} />
                  </div>
                  {stat.pulse && <PulseIndicator color="red" size="md" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-semibold tracking-tight">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Emergency Feed — 3 cols */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-3"
        >
          <GlassCard intensity="subtle">
            <GlassCardContent>
              <EmergencyFeed incidents={liveIncidents} />
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Right Column — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <MapPlaceholder />
          </motion.div>

          {/* Analytics Preview */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <AnalyticsPreview />
                <div className="mt-4 pt-3 border-t border-border/50">
                  <Link href="/clinic/analytics">
                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                      View full analytics
                      <ArrowUpRight className="size-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
