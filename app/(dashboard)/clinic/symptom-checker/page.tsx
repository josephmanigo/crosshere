"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Stethoscope, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { symptomCategories } from "@/lib/constants";
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from "@/lib/animations";
import { cn } from "@/lib/utils";

const symptomsByCategory: Record<string, string[]> = {
  head: ["Headache", "Dizziness", "Blurred Vision", "Confusion", "Nausea", "Fainting"],
  respiratory: ["Shortness of breath", "Wheezing", "Cough", "Chest tightness", "Rapid breathing"],
  cardiac: ["Chest pain", "Palpitations", "Rapid heartbeat", "Fainting", "Swelling"],
  abdominal: ["Stomach pain", "Nausea", "Vomiting", "Diarrhea", "Bloating", "Loss of appetite"],
  musculoskeletal: ["Joint pain", "Swelling", "Inability to move", "Bruising", "Fracture concern"],
  skin: ["Rash", "Hives", "Itching", "Swelling", "Redness", "Blisters"],
  mental: ["Anxiety", "Panic attack", "Difficulty breathing", "Trembling", "Chest pain", "Crying"],
  other: ["Fever", "Fatigue", "Chills", "General weakness", "Other"],
};

const steps = ["Select Area", "Symptoms", "Severity", "Duration", "Review"];

export default function SymptomCheckerPage() {
  const [step, setStep] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
  const [severity, setSeverity] = React.useState(5);
  const [duration, setDuration] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const canProceed = () => {
    if (step === 0) return selectedCategory !== null;
    if (step === 1) return selectedSymptoms.length > 0;
    if (step === 2) return true;
    if (step === 3) return duration !== "";
    return true;
  };

  const urgencyLevel = severity >= 8 ? "high" : severity >= 5 ? "moderate" : "low";
  const urgencyConfig = {
    high: { label: "High Urgency", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/30", desc: "Please visit the clinic immediately or contact emergency services." },
    moderate: { label: "Moderate", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", desc: "Consider visiting the school clinic today. Monitor symptoms." },
    low: { label: "Low Urgency", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", desc: "Monitor your symptoms. Visit the clinic if they persist or worsen." },
  };

  if (submitted) {
    const u = urgencyConfig[urgencyLevel];
    return (
      <motion.div variants={scaleIn} initial="hidden" animate="visible" className="max-w-lg mx-auto pt-8 space-y-6">
        <div className="text-center">
          <div className={cn("mx-auto size-16 rounded-2xl flex items-center justify-center mb-4 border", u.bg)}>
            {urgencyLevel === "high" ? <AlertTriangle className={cn("size-8", u.color)} /> : <Activity className={cn("size-8", u.color)} />}
          </div>
          <h2 className="text-xl font-semibold mb-1">Assessment Complete</h2>
          <Badge className={cn("text-sm font-medium", u.bg, u.color)} variant="outline">{u.label}</Badge>
        </div>

        <GlassCard intensity="medium">
          <GlassCardContent className="space-y-4">
            <p className="text-sm">{u.desc}</p>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium">{symptomCategories.find((c) => c.id === selectedCategory)?.label}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Reported Symptoms</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSymptoms.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Severity</p>
                <p className="text-sm font-medium">{severity}/10</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="text-sm font-medium">{duration}</p>
              </div>
            </div>
          </GlassCardContent>
        </GlassCard>

        <div className="flex gap-3">
          {urgencyLevel === "high" && (
            <Button className="flex-1 bg-crosshere hover:bg-crosshere/90 text-white h-11">
              <Stethoscope className="size-4" /> See a Nurse Now
            </Button>
          )}
          <Button variant="outline" className="flex-1 h-11" onClick={() => { setSubmitted(false); setStep(0); setSelectedCategory(null); setSelectedSymptoms([]); setSeverity(5); setDuration(""); }}>
            Start Over
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-lg mx-auto pt-2 space-y-6">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight">Symptom Checker</h1>
        <p className="text-sm text-muted-foreground mt-1">Guided assessment — not a medical diagnosis</p>
      </motion.div>

      {/* Progress */}
      <motion.div variants={staggerItem} className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {steps.length}</span>
          <span>{steps[step]}</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </motion.div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {/* Step 0: Select Area */}
        {step === 0 && (
          <motion.div key="step0" variants={fadeInUp} initial="hidden" animate="visible" exit="exit">
            <GlassCard intensity="subtle">
              <GlassCardContent >
                <h3 className="text-sm font-semibold mb-4">Which area is affected?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {symptomCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                        selectedCategory === cat.id
                          ? "border-crosshere bg-crosshere/5"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Step 1: Select Symptoms */}
        {step === 1 && selectedCategory && (
          <motion.div key="step1" variants={fadeInUp} initial="hidden" animate="visible" exit="exit">
            <GlassCard intensity="subtle">
              <GlassCardContent >
                <h3 className="text-sm font-semibold mb-4">Select your symptoms</h3>
                <div className="space-y-2.5">
                  {symptomsByCategory[selectedCategory]?.map((symptom) => (
                    <label key={symptom} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                      <Checkbox
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => toggleSymptom(symptom)}
                      />
                      <span className="text-sm">{symptom}</span>
                    </label>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Step 2: Severity */}
        {step === 2 && (
          <motion.div key="step2" variants={fadeInUp} initial="hidden" animate="visible" exit="exit">
            <GlassCard intensity="subtle">
              <GlassCardContent >
                <h3 className="text-sm font-semibold mb-4">How severe are your symptoms?</h3>
                <div className="flex justify-center mb-6">
                  <span className={cn(
                    "text-6xl font-bold tabular-nums",
                    severity >= 8 ? "text-red-500" : severity >= 5 ? "text-amber-500" : "text-emerald-500"
                  )}>
                    {severity}
                  </span>
                  <span className="text-2xl text-muted-foreground self-end mb-2 ml-1">/10</span>
                </div>
                <div className="flex justify-between gap-2">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setSeverity(n)}
                      className={cn(
                        "size-9 rounded-xl text-sm font-medium transition-all",
                        severity === n
                          ? n >= 8 ? "bg-red-500 text-white" : n >= 5 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Step 3: Duration */}
        {step === 3 && (
          <motion.div key="step3" variants={fadeInUp} initial="hidden" animate="visible" exit="exit">
            <GlassCard intensity="subtle">
              <GlassCardContent >
                <h3 className="text-sm font-semibold mb-4">How long have you had these symptoms?</h3>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-12">
                    <Clock className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Just started">Just started (minutes)</SelectItem>
                    <SelectItem value="A few hours">A few hours</SelectItem>
                    <SelectItem value="Since today">Since today</SelectItem>
                    <SelectItem value="1-2 days">1-2 days</SelectItem>
                    <SelectItem value="3-7 days">3-7 days</SelectItem>
                    <SelectItem value="More than a week">More than a week</SelectItem>
                  </SelectContent>
                </Select>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div key="step4" variants={fadeInUp} initial="hidden" animate="visible" exit="exit">
            <GlassCard intensity="subtle">
              <GlassCardContent className="space-y-4">
                <h3 className="text-sm font-semibold">Review your assessment</h3>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Area</p>
                  <p className="text-sm font-medium">{symptomCategories.find((c) => c.id === selectedCategory)?.label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Symptoms</p>
                  <div className="flex flex-wrap gap-1.5">{selectedSymptoms.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Severity</p>
                    <p className="text-sm font-medium">{severity}/10</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="text-sm font-medium">{duration}</p>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-11">
            <ArrowLeft className="size-4" /> Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 h-11 bg-crosshere hover:bg-crosshere/90 text-white"
          >
            Next <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={() => setSubmitted(true)}
            className="flex-1 h-11 bg-crosshere hover:bg-crosshere/90 text-white"
          >
            <Check className="size-4" /> Submit Assessment
          </Button>
        )}
      </div>
    </motion.div>
  );
}
