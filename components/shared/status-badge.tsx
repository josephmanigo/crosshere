import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { severityConfig, type Severity } from "@/lib/constants";

interface StatusBadgeProps {
  severity: Severity;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ severity, pulse = false, className }: StatusBadgeProps) {
  const config = severityConfig[severity];

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full shrink-0",
          config.dotColor,
          pulse && severity === "critical" && "animate-pulse"
        )}
      />
      {config.label}
    </Badge>
  );
}
