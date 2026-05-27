"use client";

import { motion } from "framer-motion";
import { Activity, Clock, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { EmergencyFeed } from "@/components/dashboard/emergency-feed";
import { MapPlaceholder } from "@/components/dashboard/map-placeholder";
import { AnalyticsPreview } from "@/components/dashboard/analytics-preview";
import { dashboardStats } from "@/lib/mock-data";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const statCards = [
  {
    label: "Active Emergencies",
    value: dashboardStats.activeEmergencies,
    icon: AlertTriangle,
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    change: "+2 since yesterday",
    pulse: true,
  },
  {
    label: "Avg Response Time",
    value: dashboardStats.avgResponseTime,
    icon: Clock,
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    suffix: " min",
    decimals: 1,
    change: "-0.3 min vs last week",
  },
  {
    label: "Resolved Today",
    value: dashboardStats.resolvedToday,
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    change: "92% resolution rate",
  },
  {
    label: "Pending Review",
    value: dashboardStats.pendingReview,
    icon: Activity,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    change: "2 awaiting action",
  },
];

export default function DashboardPage() {
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
              <GlassCardContent >
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
            <GlassCardContent >
              <EmergencyFeed />
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
              <GlassCardContent >
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
