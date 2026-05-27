"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { EmergencyButton } from "@/components/student/emergency-button";
import { EmergencyFlow } from "@/components/student/emergency-flow";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { emergencyTypeItems } from "@/lib/constants";
import { emergencyContacts } from "@/lib/mock-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function EmergencyPage() {
  const [flowOpen, setFlowOpen] = React.useState(false);

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 pt-2"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <h1 className="text-xl font-semibold tracking-tight">Emergency</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Get immediate help when you need it
          </p>
        </motion.div>

        {/* SOS Button */}
        <motion.div variants={staggerItem} className="flex justify-center py-4">
          <EmergencyButton onActivate={() => setFlowOpen(true)} />
        </motion.div>

        {/* How are you feeling? */}
        <motion.div variants={staggerItem}>
          <h2 className="text-sm font-semibold mb-3">How are you feeling?</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {emergencyTypeItems.slice(0, 6).map((type) => (
              <button
                key={type.id}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card/50 dark:bg-card/30 border border-border/30 active:scale-95 transition-transform min-h-[80px] justify-center"
                onClick={() => setFlowOpen(true)}
              >
                <span className="text-xl">{type.icon}</span>
                <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div variants={staggerItem}>
          <GlassCard size="sm" intensity="subtle">
            <GlassCardContent>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2">
                  <MapPin className="size-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Your Location</p>
                  <p className="text-xs text-muted-foreground">Building C, 2nd Floor • Auto-detected</p>
                </div>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>

        {/* Emergency Contacts Quick Access */}
        <motion.div variants={staggerItem}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Quick Contacts</h2>
            <Link href="/student/emergency-contacts" className="text-xs text-crosshere font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {emergencyContacts.filter(c => c.type === "guardian").slice(0, 2).map((contact) => (
              <GlassCard size="sm" key={contact.id} intensity="subtle">
                <GlassCardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="text-xs bg-crosshere/10 text-crosshere font-semibold">
                        {contact.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.relation}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="text-crosshere shrink-0">
                      <Phone className="size-4" />
                    </Button>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <EmergencyFlow open={flowOpen} onOpenChange={setFlowOpen} />
    </>
  );
}
