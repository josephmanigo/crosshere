"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { hoverLift } from "@/lib/animations";

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  intensity?: "subtle" | "medium" | "strong";
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

const intensityStyles = {
  subtle: "bg-card/50 dark:bg-card/30 backdrop-blur-sm",
  medium: "bg-card/70 dark:bg-card/50 backdrop-blur-md",
  strong: "bg-card/90 dark:bg-card/70 backdrop-blur-lg",
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
          "rounded-2xl border border-glass-border shadow-sm transition-shadow duration-300",
          intensityStyles[intensity],
          glow && "shadow-crosshere/5 dark:shadow-crosshere/10",
          hover && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </Wrapper>
  );
}

export { CardContent as GlassCardContent, CardHeader as GlassCardHeader, CardTitle as GlassCardTitle, CardDescription as GlassCardDescription };
