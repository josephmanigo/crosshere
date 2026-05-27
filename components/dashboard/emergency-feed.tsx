"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentCard } from "./incident-card";
import { staggerContainer } from "@/lib/animations";
import { mockIncidents } from "@/lib/mock-data";
import type { Severity } from "@/lib/constants";

export function EmergencyFeed() {
  const [filter, setFilter] = React.useState("all");

  const filtered = filter === "all"
    ? mockIncidents
    : mockIncidents.filter((inc) => inc.severity === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Emergency Feed</h2>
        <span className="text-xs text-muted-foreground">
          {mockIncidents.filter((i) => i.status !== "resolved").length} active
        </span>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="h-8 w-full justify-start overflow-x-auto overflow-y-hidden no-scrollbar">
          <TabsTrigger value="all" className="text-xs px-3 h-6 shrink-0">All</TabsTrigger>
          <TabsTrigger value="critical" className="text-xs px-3 h-6 shrink-0">Critical</TabsTrigger>
          <TabsTrigger value="high" className="text-xs px-3 h-6 shrink-0">High</TabsTrigger>
          <TabsTrigger value="medium" className="text-xs px-3 h-6 shrink-0">Medium</TabsTrigger>
          <TabsTrigger value="low" className="text-xs px-3 h-6 shrink-0">Low</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[520px] pr-3">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          key={filter}
          className="space-y-3"
        >
          {filtered.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
