"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Building2, Users, ShieldAlert, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-5xl"
    >
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor enterprise usage and system health across all connected schools.
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Schools", value: "142", icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Users", value: "48.2k", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "System Health", value: "99.9%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Active Incidents", value: "3", icon: ShieldAlert, color: "text-crosshere", bg: "bg-crosshere/10" },
        ].map((stat) => (
          <GlassCard key={stat.label} intensity="subtle">
            <GlassCardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold tracking-tight mt-1">{stat.value}</p>
            </GlassCardContent>
          </GlassCard>
        ))}
      </motion.div>
    </motion.div>
  );
}
