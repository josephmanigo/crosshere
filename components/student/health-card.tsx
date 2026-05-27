"use client";

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Phone, Droplets, AlertCircle, QrCode, ArrowUpRight } from "lucide-react";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { studentProfile } from "@/lib/mock-data";

export function HealthCard() {
  return (
    <GlassCard size="sm" intensity="subtle">
      <GlassCardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-crosshere/10 p-2">
              <Heart className="size-4 text-crosshere" />
            </div>
            <h3 className="text-sm font-semibold">Health Card</h3>
          </div>
          <Link href="/student/health">
            <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
              <ArrowUpRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center p-2.5 rounded-xl bg-muted/50">
            <Droplets className="size-4 text-red-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Blood Type</p>
            <p className="text-sm font-semibold">{studentProfile.bloodType}</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-muted/50">
            <AlertCircle className="size-4 text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Allergies</p>
            <p className="text-sm font-semibold">{studentProfile.allergies.length}</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-muted/50">
            <Heart className="size-4 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Conditions</p>
            <p className="text-sm font-semibold">{studentProfile.conditions.length}</p>
          </div>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="text-xs text-muted-foreground py-2 hover:no-underline">
              View full details
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-1">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Allergies</p>
                <div className="flex gap-1.5 flex-wrap">
                  {studentProfile.allergies.map((a) => (
                    <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Conditions</p>
                <div className="flex gap-1.5 flex-wrap">
                  {studentProfile.conditions.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Medications</p>
                <div className="flex gap-1.5 flex-wrap">
                  {studentProfile.medications.map((m) => (
                    <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Emergency Contact</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{studentProfile.guardian.name} ({studentProfile.guardian.relation})</span>
                  <Button variant="ghost" size="icon-xs">
                    <Phone className="size-3.5 text-crosshere" />
                  </Button>
                </div>
              </div>
              {/* QR Code placeholder */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="rounded-lg bg-muted p-2">
                  <QrCode className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">Emergency QR Card</p>
                  <p className="text-[10px] text-muted-foreground">Share your health info with responders</p>
                </div>
                <Link href="/student/health">
                  <Button variant="ghost" size="xs" className="text-crosshere text-xs">
                    View
                  </Button>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </GlassCardContent>
    </GlassCard>
  );
}
