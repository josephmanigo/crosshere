"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SymptomStep } from "@/components/student/symptom-step";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem, cardSlideLeft } from "@/lib/animations";
import { symptomBodyAreas, severityLevels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { IconRenderer } from "@/components/shared/icon-mapper";
import {
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Heart,
} from "lucide-react";

export default function SymptomCheckerPage() {
  const [step, setStep] = React.useState(0); // 0 = intro, 1-4 = steps
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState<"forward" | "backward">("forward");

  const goForward = () => { setDirection("forward"); setStep((s) => s + 1); };
  const goBack = () => { setDirection("backward"); setStep((s) => s - 1); };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const selectedAreaData = symptomBodyAreas.find((a) => a.id === selectedArea);
  const selectedSeverityData = severityLevels.find((s) => s.id === selectedSeverity);

  // Assessment result based on severity
  const getAssessment = () => {
    if (!selectedSeverity) return null;
    if (selectedSeverity >= 4) return { level: "Emergency", color: "text-red-500", bg: "bg-red-500/10", advice: "Seek immediate emergency help. Use the SOS button or call your school nurse.", action: "emergency" };
    if (selectedSeverity >= 3) return { level: "Urgent", color: "text-orange-500", bg: "bg-orange-500/10", advice: "Visit the school clinic as soon as possible. A nurse will assess your condition.", action: "clinic" };
    if (selectedSeverity >= 2) return { level: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10", advice: "Consider visiting the clinic today. Rest and stay hydrated in the meantime.", action: "clinic" };
    return { level: "Mild", color: "text-emerald-500", bg: "bg-emerald-500/10", advice: "Monitor your symptoms. Rest and drink water. Visit the clinic if symptoms persist.", action: "self-care" };
  };

  return (
    <div className="space-y-5 pt-2">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/student" className="p-2 -ml-2 rounded-xl hover:bg-muted/50">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Symptom Checker</h1>
          <p className="text-xs text-muted-foreground">AI-guided health assessment</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Intro */}
        {step === 0 && (
          <motion.div
            key="intro"
            variants={cardSlideLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            <GlassCard size="sm" intensity="subtle">
              <GlassCardContent className="text-center space-y-4">
                <div className="mx-auto size-16 rounded-2xl bg-crosshere/10 flex items-center justify-center">
                  <Stethoscope className="size-8 text-crosshere" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-base font-semibold">How can I help?</h2>
                  <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                    I&apos;ll guide you through a few questions to understand how you&apos;re feeling and suggest what to do next.
                  </p>
                </div>
              </GlassCardContent>
            </GlassCard>

            <div className="space-y-2.5 px-1">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Takes about 2 minutes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Private and confidential</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Get personalized guidance</span>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-2xl text-base"
              onClick={goForward}
            >
              Let&apos;s begin
            </Button>
          </motion.div>
        )}

        {/* Step 1: Body Area */}
        {step === 1 && (
          <SymptomStep
            key="step1"
            stepNumber={1}
            totalSteps={4}
            title="What's bothering you?"
            description="Select the area where you feel discomfort"
            onNext={goForward}
            onBack={goBack}
            nextDisabled={!selectedArea}
            direction={direction}
            showBack={true}
          >
            <div className="grid grid-cols-2 gap-3">
              {symptomBodyAreas.map((area) => (
                <button
                  key={area.id}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all active:scale-95",
                    selectedArea === area.id
                      ? "border-crosshere/40 bg-crosshere/5 dark:bg-crosshere/10"
                      : "border-border/30 bg-card/50 dark:bg-card/30"
                  )}
                  onClick={() => {
                    setSelectedArea(area.id);
                    setSelectedSymptoms([]);
                  }}
                >
                  <div className={cn(
                    "size-9 rounded-xl flex items-center justify-center bg-muted/40",
                    selectedArea === area.id ? "bg-crosshere/10" : ""
                  )}>
                    <IconRenderer 
                      name={area.icon} 
                      className={cn("size-5", selectedArea === area.id ? "text-crosshere" : "text-muted-foreground")} 
                    />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    selectedArea === area.id ? "text-crosshere" : "text-foreground"
                  )}>
                    {area.label}
                  </span>
                </button>
              ))}
            </div>
          </SymptomStep>
        )}

        {/* Step 2: Symptoms */}
        {step === 2 && selectedAreaData && (
          <SymptomStep
            key="step2"
            stepNumber={2}
            totalSteps={4}
            title="Describe your symptoms"
            description={`Select all symptoms you're experiencing in ${selectedAreaData.label}`}
            onNext={goForward}
            onBack={goBack}
            nextDisabled={selectedSymptoms.length === 0}
            direction={direction}
          >
            <div className="space-y-2.5">
              {selectedAreaData.symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    className={cn(
                      "w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98]",
                      isSelected
                        ? "border-crosshere/40 bg-crosshere/5 dark:bg-crosshere/10"
                        : "border-border/30 bg-card/50 dark:bg-card/30"
                    )}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    <div className={cn(
                      "size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      isSelected ? "border-crosshere bg-crosshere" : "border-border"
                    )}>
                      {isSelected && <CheckCircle2 className="size-3 text-white" />}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isSelected && "text-crosshere"
                    )}>
                      {symptom}
                    </span>
                  </button>
                );
              })}
            </div>
          </SymptomStep>
        )}

        {/* Step 3: Severity */}
        {step === 3 && (
          <SymptomStep
            key="step3"
            stepNumber={3}
            totalSteps={4}
            title="How severe is it?"
            description="Help us understand the intensity"
            onNext={goForward}
            onBack={goBack}
            nextLabel="Get Assessment"
            nextDisabled={!selectedSeverity}
            direction={direction}
          >
            <div className="space-y-2.5">
              {severityLevels.map((level) => (
                <button
                  key={level.id}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.98]",
                    selectedSeverity === level.id
                      ? "border-crosshere/40 bg-crosshere/5 dark:bg-crosshere/10"
                      : "border-border/30 bg-card/50 dark:bg-card/30"
                  )}
                  onClick={() => setSelectedSeverity(level.id)}
                >
                  <div className={cn("rounded-xl p-2", level.bgColor)}>
                    <span className={cn("text-lg font-bold", level.color)}>{level.id}</span>
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm font-semibold", selectedSeverity === level.id && "text-crosshere")}>
                      {level.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </SymptomStep>
        )}

        {/* Step 4: Assessment */}
        {step === 4 && (() => {
          const assessment = getAssessment();
          if (!assessment) return null;

          return (
            <SymptomStep
              key="step4"
              stepNumber={4}
              totalSteps={4}
              title="Assessment"
              description="Based on your responses"
              onBack={goBack}
              direction={direction}
              showBack={true}
            >
              <div className="space-y-4">
                {/* Result Card */}
                <GlassCard size="sm" intensity="medium" glow>
                  <GlassCardContent className="text-center space-y-3">
                    <div className={cn("mx-auto size-14 rounded-2xl flex items-center justify-center", assessment.bg)}>
                      {assessment.action === "emergency" ? (
                        <AlertTriangle className={cn("size-7", assessment.color)} />
                      ) : (
                        <Heart className={cn("size-7", assessment.color)} />
                      )}
                    </div>
                    <div>
                      <Badge className={cn("mb-2", assessment.bg, assessment.color, "border-transparent")}>
                        {assessment.level}
                      </Badge>
                      <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                        {assessment.advice}
                      </p>
                    </div>
                  </GlassCardContent>
                </GlassCard>

                {/* Symptoms summary */}
                <div className="space-y-1.5 px-1">
                  <p className="text-xs font-medium text-muted-foreground">Your symptoms:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSymptoms.map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  {assessment.action === "emergency" && (
                    <Link href="/student/emergency">
                      <Button className="w-full h-12 rounded-2xl bg-crosshere hover:bg-crosshere/90 text-white">
                        <AlertTriangle className="size-4 mr-2" />
                        Get Emergency Help
                      </Button>
                    </Link>
                  )}
                  {assessment.action === "clinic" && (
                    <Link href="/student/emergency-contacts">
                      <Button className="w-full h-12 rounded-2xl">
                        <Building2 className="size-4 mr-2" />
                        Contact School Clinic
                      </Button>
                    </Link>
                  )}
                  <Link href="/student">
                    <Button variant="ghost" className="w-full h-10 rounded-2xl text-muted-foreground">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </SymptomStep>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
