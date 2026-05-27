import { cn } from "@/lib/utils";

interface PulseIndicatorProps {
  color?: "red" | "green" | "amber" | "blue";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorMap = {
  red: {
    dot: "bg-red-500",
    ring: "bg-red-500/40",
  },
  green: {
    dot: "bg-emerald-500",
    ring: "bg-emerald-500/40",
  },
  amber: {
    dot: "bg-amber-500",
    ring: "bg-amber-500/40",
  },
  blue: {
    dot: "bg-blue-500",
    ring: "bg-blue-500/40",
  },
};

const sizeMap = {
  sm: { dot: "size-1.5", ring: "size-3" },
  md: { dot: "size-2", ring: "size-4" },
  lg: { dot: "size-2.5", ring: "size-5" },
};

export function PulseIndicator({
  color = "red",
  size = "md",
  className,
}: PulseIndicatorProps) {
  const colors = colorMap[color];
  const sizes = sizeMap[size];

  return (
    <span className={cn("relative inline-flex items-center justify-center", className)}>
      <span
        className={cn(
          "absolute rounded-full animate-ping",
          colors.ring,
          sizes.ring
        )}
      />
      <span className={cn("relative rounded-full", colors.dot, sizes.dot)} />
    </span>
  );
}
