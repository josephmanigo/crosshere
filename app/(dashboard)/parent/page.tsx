"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, Phone, Mail, Building2, Calendar, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function ParentPortalPage() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome, Maria</h1>
        <p className="text-sm text-muted-foreground mt-1">Here&apos;s your child&apos;s health overview</p>
      </motion.div>

      {/* Child Status */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="medium">
          <GlassCardContent >
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-crosshere/10 text-crosshere text-lg font-semibold">ER</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Emma Rodriguez</h2>
                <p className="text-sm text-muted-foreground">Grade 10 • Section A</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 px-5 py-4">
              <Shield className="size-8 text-emerald-600 dark:text-emerald-400" />
              <div className="flex-1">
                <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300">Your child is safe</p>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">No active emergencies or incidents</p>
              </div>
              <CheckCircle2 className="size-6 text-emerald-500" />
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Recent Notifications */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
        <div className="space-y-2">
          {[
            { title: "Fever resolved — Emma is well", time: "May 22, 10:30 AM" },
            { title: "Annual health checkup completed", time: "May 10, 2:00 PM" },
            { title: "Medication reminder: Inhaler refill due", time: "May 5, 9:00 AM" },
          ].map((n) => (
            <GlassCard key={n.title} intensity="subtle" hover>
              <GlassCardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Clinic Visits */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-3">Clinic Visit Summaries</h2>
        <GlassCard intensity="subtle">
          <GlassCardContent >
            <Accordion type="single" collapsible>
              {[
                { date: "May 22, 2026", reason: "Fever / Infection", outcome: "Acetaminophen administered. Sent home with guardian." },
                { date: "May 10, 2026", reason: "Annual Health Checkup", outcome: "All vitals normal. Vision and hearing tests passed. Inhaler prescription renewed." },
                { date: "Mar 15, 2026", reason: "Mild Asthma Episode", outcome: "Nebulizer treatment. Recovered in clinic. Returned to class." },
              ].map((visit, i) => (
                <AccordionItem key={i} value={`visit-${i}`}>
                  <AccordionTrigger className="text-sm hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Calendar className="size-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{visit.reason}</p>
                        <p className="text-xs text-muted-foreground">{visit.date}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pl-7">
                    {visit.outcome}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Contacts */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-3">School Contacts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-crosshere/10 p-2"><Building2 className="size-4 text-crosshere" /></div>
                <p className="text-sm font-semibold">School Clinic</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1.5"><Phone className="size-3" /> +1 (555) 100-2000</p>
                <p className="flex items-center gap-1.5"><Mail className="size-3" /> clinic@school.edu</p>
              </div>
            </GlassCardContent>
          </GlassCard>
          <GlassCard intensity="subtle">
            <GlassCardContent >
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-xl bg-blue-500/10 p-2"><Phone className="size-4 text-blue-500" /></div>
                <p className="text-sm font-semibold">Emergency Hotline</p>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1.5"><Phone className="size-3" /> +1 (555) 911-0000</p>
                <p className="text-xs">Available 24/7</p>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </motion.div>
    </motion.div>
  );
}
