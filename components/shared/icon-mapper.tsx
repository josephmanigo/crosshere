"use client";

import React from "react";
import { 
  Wind, 
  Activity, 
  Heart, 
  AlertCircle, 
  Zap, 
  Droplets, 
  Smile, 
  HelpCircle, 
  Brain, 
  Layers,
  Sparkles,
  Flame,
  ShieldAlert
} from "lucide-react";

export const iconMap = {
  "wind": Wind,
  "activity": Activity,
  "heart": Heart,
  "alert-circle": AlertCircle,
  "zap": Zap,
  "droplets": Droplets,
  "smile": Smile,
  "help-circle": HelpCircle,
  "brain": Brain,
  "layers": Layers,
  "sparkles": Sparkles,
  "flame": Flame,
  "shield-alert": ShieldAlert
} as const;

export type IconType = keyof typeof iconMap;

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export function IconRenderer({ name, className, size }: IconRendererProps) {
  const IconComponent = iconMap[name as IconType] || HelpCircle;
  return <IconComponent className={className} size={size} />;
}
