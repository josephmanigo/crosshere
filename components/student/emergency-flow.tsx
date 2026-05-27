"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { EmergencyTypeCard } from "@/components/student/emergency-type-card";
import { emergencyTypeItems } from "@/lib/constants";
import { cardSlideLeft } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { MapPin, Loader2, CheckCircle2, ArrowLeft, Send } from "lucide-react";

interface EmergencyFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FlowStep = "type" | "details" | "sending" | "confirmed";

export function EmergencyFlow({ open, onOpenChange }: EmergencyFlowProps) {
  const router = useRouter();
  const [step, setStep] = React.useState<FlowStep>("type");
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState("");
  const [sendingProgress, setSendingProgress] = React.useState(0);

  const reset = React.useCallback(() => {
    setStep("type");
    setSelectedType(null);
    setNotes("");
    setSendingProgress(0);
  }, []);

  const handleClose = React.useCallback(
    (value: boolean) => {
      if (!value) reset();
      onOpenChange(value);
    },
    [onOpenChange, reset]
  );

  const handleSend = React.useCallback(() => {
    setStep("sending");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      setSendingProgress(Math.min(progress, 1));
      if (progress >= 1) {
        clearInterval(interval);
        setStep("confirmed");
      }
    }, 80);
  }, []);

  const handleGoToTracking = React.useCallback(() => {
    handleClose(false);
    router.push("/student/emergency/tracking");
  }, [handleClose, router]);

  const selectedTypeLabel = emergencyTypeItems.find((t) => t.id === selectedType)?.label;

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[92vh] rounded-t-3xl">
        <div className="mx-auto w-full max-w-md pb-8">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className="text-lg font-semibold">
              {step === "type" && "What's happening?"}
              {step === "details" && "Additional details"}
              {step === "sending" && "Sending alert..."}
              {step === "confirmed" && "Help is on the way"}
            </DrawerTitle>
            <DrawerDescription className="text-sm">
              {step === "type" && "Select the type of emergency"}
              {step === "details" && "Optional — help responders prepare"}
              {step === "sending" && "Alerting school health team"}
              {step === "confirmed" && "Stay calm, a responder has been notified"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {step === "type" && (
                <motion.div
                  key="type"
                  variants={cardSlideLeft}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {emergencyTypeItems.map((item) => (
                      <EmergencyTypeCard
                        key={item.id}
                        item={item}
                        selected={selectedType === item.id}
                        onSelect={setSelectedType}
                      />
                    ))}
                  </div>

                  {/* Location indicator */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <MapPin className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Location auto-captured • Building C, 2nd Floor
                    </p>
                  </div>

                  <Button
                    className="w-full h-12 text-base rounded-2xl"
                    disabled={!selectedType}
                    onClick={() => setStep("details")}
                    id="emergency-flow-next"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {step === "details" && (
                <motion.div
                  key="details"
                  variants={cardSlideLeft}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <div className="rounded-2xl bg-crosshere/5 dark:bg-crosshere/10 border border-crosshere/20 p-3 text-center">
                    <p className="text-sm font-medium text-crosshere">{selectedTypeLabel}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium block" htmlFor="emergency-notes">
                      Can you tell us more? <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Textarea
                      id="emergency-notes"
                      placeholder="Describe what you're experiencing..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px] rounded-xl resize-none text-base"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-2xl"
                      onClick={() => setStep("type")}
                    >
                      <ArrowLeft className="size-4 mr-1" />
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-12 rounded-2xl bg-crosshere hover:bg-crosshere/90 text-white"
                      onClick={handleSend}
                      id="emergency-flow-send"
                    >
                      <Send className="size-4 mr-1" />
                      Send Alert
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "sending" && (
                <motion.div
                  key="sending"
                  variants={cardSlideLeft}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center py-12 gap-6"
                >
                  <motion.div
                    className="relative size-20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="size-20 text-crosshere" strokeWidth={1.5} />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <p className="text-base font-semibold">Contacting help...</p>
                    <p className="text-sm text-muted-foreground">
                      {sendingProgress < 0.3 && "Capturing your location"}
                      {sendingProgress >= 0.3 && sendingProgress < 0.6 && "Alerting school health team"}
                      {sendingProgress >= 0.6 && sendingProgress < 0.9 && "Notifying your guardian"}
                      {sendingProgress >= 0.9 && "Almost done..."}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-[200px] h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-crosshere rounded-full"
                      style={{ width: `${sendingProgress * 100}%` }}
                    />
                  </div>
                </motion.div>
              )}

              {step === "confirmed" && (
                <motion.div
                  key="confirmed"
                  variants={cardSlideLeft}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center py-8 gap-5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="size-20 rounded-full bg-emerald-500/15 flex items-center justify-center"
                  >
                    <CheckCircle2 className="size-10 text-emerald-500" />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold">Alert Sent Successfully</h3>
                    <p className="text-sm text-muted-foreground max-w-[280px]">
                      A responder has been notified and is heading your way. Stay where you are.
                    </p>
                  </div>

                  <div className="w-full space-y-3 pt-2">
                    <Button
                      className="w-full h-12 rounded-2xl bg-crosshere hover:bg-crosshere/90 text-white"
                      onClick={handleGoToTracking}
                      id="emergency-flow-track"
                    >
                      Track Responder
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-10 rounded-2xl text-muted-foreground"
                      onClick={() => handleClose(false)}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
