import { MapPin } from "lucide-react";

export function MapPlaceholder() {
  return (
    <div className="relative rounded-2xl border border-border/50 overflow-hidden bg-surface h-full min-h-[300px]">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.55_0.22_25_/_6%)_0%,_transparent_70%)]" />

      {/* Pin markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-4/5 h-4/5">
          {/* Building A */}
          <div className="absolute top-[20%] left-[25%] flex flex-col items-center gap-1">
            <div className="size-8 rounded-full bg-crosshere/15 flex items-center justify-center border border-crosshere/30">
              <MapPin className="size-4 text-crosshere" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">Building A</span>
          </div>

          {/* Building C — Active */}
          <div className="absolute top-[35%] left-[55%] flex flex-col items-center gap-1">
            <div className="size-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/40 pulse-emergency">
              <MapPin className="size-4 text-red-500" />
            </div>
            <span className="text-[10px] font-medium text-red-600 dark:text-red-400 bg-background/80 px-1.5 py-0.5 rounded">Building C</span>
          </div>

          {/* Cafeteria */}
          <div className="absolute top-[60%] left-[35%] flex flex-col items-center gap-1">
            <div className="size-8 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
              <MapPin className="size-4 text-amber-500" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">Cafeteria</span>
          </div>

          {/* Sports Field */}
          <div className="absolute top-[70%] left-[70%] flex flex-col items-center gap-1">
            <div className="size-7 rounded-full bg-muted flex items-center justify-center border border-border/50">
              <MapPin className="size-3.5 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">Field</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border/50">
          Campus Map — Live View
        </span>
        <span className="text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50">
          2 active alerts
        </span>
      </div>
    </div>
  );
}
