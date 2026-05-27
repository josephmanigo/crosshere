"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

interface EmergencyButtonProps {
  onActivate?: () => void;
  size?: "default" | "compact";
}

export function EmergencyButton({ onActivate, size = "default" }: EmergencyButtonProps) {
  const [holdProgress, setHoldProgress] = React.useState(0);
  const [isHolding, setIsHolding] = React.useState(false);
  const holdTimerRef = React.useRef<ReturnType<typeof setInterval>>(null);
  const holdStartRef = React.useRef<number>(0);
  const HOLD_DURATION = 1500; // 1.5 seconds

  const startHold = React.useCallback(() => {
    setIsHolding(true);
    holdStartRef.current = Date.now();

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        setIsHolding(false);
        setHoldProgress(0);
        onActivate?.();
      }
    }, 16);
  }, [onActivate]);

  const cancelHold = React.useCallback(() => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    setIsHolding(false);
    setHoldProgress(0);
  }, []);

  React.useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
    };
  }, []);

  const buttonSize = size === "compact" ? "size-32" : "size-44";
  const iconSize = size === "compact" ? "size-8" : "size-10";
  const svgSize = size === "compact" ? 140 : 188;
  const radius = size === "compact" ? 62 : 86;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Progress ring SVG */}
        <svg
          className="absolute inset-0 -rotate-90 pointer-events-none z-10"
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}
        >
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - holdProgress)}
            opacity={isHolding ? 0.8 : 0}
            className="transition-opacity duration-150"
          />
        </svg>

        <motion.button
          className={cn(
            "relative rounded-full flex items-center justify-center",
            "bg-gradient-to-br from-red-500 via-crosshere to-red-700",
            "shadow-[0_8px_40px_oklch(0.55_0.22_25_/_30%)]",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crosshere/30",
            "transition-shadow duration-200 select-none touch-none",
            buttonSize
          )}
          animate={
            isHolding
              ? { scale: 0.95 }
              : { scale: [1, 1.02, 1] }
          }
          transition={
            isHolding
              ? { type: "spring", stiffness: 400, damping: 30 }
              : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          aria-label="Emergency SOS — Hold for 1.5 seconds to activate"
          role="button"
          id="emergency-sos-button"
        >
          {/* Outer pulse rings */}
          <span
            className="absolute inset-0 rounded-full bg-crosshere/15"
            style={{
              animation: isHolding ? "none" : "emergency-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <span
            className="absolute -inset-2 rounded-full bg-crosshere/8"
            style={{
              animation: isHolding ? "none" : "emergency-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.8s",
            }}
          />

          {/* Inner glass highlight */}
          <span className="absolute inset-1.5 rounded-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

          {/* Icon + text */}
          <div className="relative flex flex-col items-center gap-1.5 text-white">
            <Phone className={iconSize} strokeWidth={1.8} />
            <span className="text-lg font-bold tracking-wider">SOS</span>
          </div>
        </motion.button>
      </div>

      <p className="text-sm text-muted-foreground text-center font-medium max-w-[200px]">
        {isHolding ? (
          <span className="text-crosshere font-semibold">
            Keep holding... {Math.round(holdProgress * 100)}%
          </span>
        ) : (
          "Hold for emergency help"
        )}
      </p>
    </div>
  );
}
