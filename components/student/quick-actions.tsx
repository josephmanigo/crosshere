"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { FileText, Stethoscope, Building2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Report Symptom", href: "/student/symptom-checker", icon: FileText, color: "text-crosshere", bg: "bg-crosshere/10" },
  { label: "Symptom Checker", href: "/student/symptom-checker", icon: Stethoscope, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Contact Clinic", href: "/student/emergency-contacts", icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Emergency Contacts", href: "/student/emergency-contacts", icon: Phone, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export function QuickActions() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-3"
    >
      {actions.map((action) => (
        <motion.div key={action.label} variants={staggerItem}>
          <Link
            href={action.href}
            className="flex flex-col items-center gap-2.5 p-3.5 rounded-2xl bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/30 hover:bg-card/80 active:scale-95 transition-all min-h-[88px] justify-center"
          >
            <div className={cn("rounded-xl p-2.5", action.bg)}>
              <action.icon className={cn("size-5", action.color)} />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground leading-tight text-center">
              {action.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
