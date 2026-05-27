"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { emergencyContacts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Shield,
  Users,
  Building2,
  Siren,
} from "lucide-react";

const sectionIcons = {
  guardian: Users,
  school: Building2,
  hotline: Siren,
};

const sectionLabels = {
  guardian: "Parents & Guardians",
  school: "School Health Team",
  hotline: "Emergency Hotlines",
};

export default function EmergencyContactsPage() {
  const guardians = emergencyContacts.filter((c) => c.type === "guardian");
  const school = emergencyContacts.filter((c) => c.type === "school");
  const hotlines = emergencyContacts.filter((c) => c.type === "hotline");

  const sections = [
    { type: "guardian" as const, contacts: guardians },
    { type: "school" as const, contacts: school },
    { type: "hotline" as const, contacts: hotlines },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <Link href="/student" className="p-2 -ml-2 rounded-xl hover:bg-muted/50">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Emergency Contacts</h1>
          <p className="text-xs text-muted-foreground">People who care about you</p>
        </div>
      </motion.div>

      {/* Quick Call Banner */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-crosshere/5 dark:bg-crosshere/10 border border-crosshere/15">
          <div className="rounded-xl bg-crosshere/10 p-2.5">
            <Shield className="size-5 text-crosshere" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Need immediate help?</p>
            <p className="text-xs text-muted-foreground">Call 911 for life-threatening emergencies</p>
          </div>
          <Button size="sm" className="rounded-xl bg-crosshere hover:bg-crosshere/90 text-white shrink-0 gap-1.5">
            <Phone className="size-3.5" />
            911
          </Button>
        </div>
      </motion.div>

      {/* Contact Sections */}
      {sections.map((section) => {
        const SectionIcon = sectionIcons[section.type];
        const sectionLabel = sectionLabels[section.type];

        return (
          <motion.div key={section.type} variants={staggerItem} className="space-y-2.5">
            <div className="flex items-center gap-2 px-1">
              <SectionIcon className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">{sectionLabel}</h2>
            </div>

            <div className="space-y-2">
              {section.contacts.map((contact) => (
                <GlassCard size="sm" key={contact.id} intensity="subtle">
                  <GlassCardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11">
                        <AvatarFallback
                          className={cn(
                            "text-xs font-semibold",
                            section.type === "guardian" && "bg-crosshere/10 text-crosshere",
                            section.type === "school" && "bg-blue-500/10 text-blue-500",
                            section.type === "hotline" && "bg-amber-500/10 text-amber-500"
                          )}
                        >
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium truncate">{contact.name}</p>
                          {contact.available && (
                            <PulseIndicator color="green" size="sm" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{contact.relation}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{contact.phone}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full size-10"
                          aria-label={`Call ${contact.name}`}
                        >
                          <Phone className="size-4 text-crosshere" />
                        </Button>
                        {section.type !== "hotline" && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full size-10"
                            aria-label={`Message ${contact.name}`}
                          >
                            <MessageCircle className="size-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
