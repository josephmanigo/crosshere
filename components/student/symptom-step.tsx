"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cardSlideLeft, cardSlideRight } from "@/lib/animations";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SymptomStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  direction?: "forward" | "backward";
  showBack?: boolean;
}

export function SymptomStep({
  stepNumber,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = "Continue",
  nextDisabled = false,
  direction = "forward",
  showBack = true,
}: SymptomStepProps) {
  const variants = direction === "forward" ? cardSlideLeft : cardSlideRight;

  return (
    <motion.div
      key={`step-${stepNumber}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-5"
    >
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {stepNumber} of {totalSteps}</span>
          <span>{Math.round((stepNumber / totalSteps) * 100)}%</span>
        </div>
        <Progress value={(stepNumber / totalSteps) * 100} className="h-1.5" />
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Content */}
      <div className="min-h-[200px]">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {showBack && onBack && (
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl"
            onClick={onBack}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Button>
        )}
        {onNext && (
          <Button
            className="flex-1 h-12 rounded-2xl"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel}
            {nextLabel === "Continue" && <ArrowRight className="size-4 ml-1" />}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
