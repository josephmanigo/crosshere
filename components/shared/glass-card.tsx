"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hoverLift } from "@/lib/animations";

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  intensity?: "subtle" | "medium" | "strong";
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const intensityStyles = {
  subtle: "bg-card/45 dark:bg-card/20 backdrop-blur-[12px]",
  medium: "bg-card/65 dark:bg-card/35 backdrop-blur-[20px]",
  strong: "bg-card/85 dark:bg-card/55 backdrop-blur-[28px]",
};

export function GlassCard({
  intensity = "medium",
  hover = false,
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const Wrapper = hover ? motion.div : "div";
  const motionProps = hover ? hoverLift : {};

  return (
    <Wrapper {...motionProps} className={cn(typeof className === "string" && className.includes("h-full") && "h-full")}>
      <Card
        className={cn(
          "rounded-3xl border border-glass-border shadow-lg relative overflow-hidden transition-all duration-300",
          intensityStyles[intensity],
          glow && "shadow-[0_0_20px_rgba(122,0,16,0.06)] dark:shadow-[0_0_25px_rgba(254,211,215,0.08)]",
          hover && "cursor-pointer hover:shadow-xl hover:border-glass-border/30 dark:hover:border-white/20",
          className
        )}
        {...props}
      >
        {/* Top-left glass reflection highlight line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 dark:via-white/15 to-transparent pointer-events-none" />
        <div className="absolute left-0 inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 dark:via-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">{children}</div>
      </Card>
    </Wrapper>
  );
}

export { CardContent as GlassCardContent, CardHeader as GlassCardHeader, CardTitle as GlassCardTitle, CardDescription as GlassCardDescription } from "@/components/ui/card";
