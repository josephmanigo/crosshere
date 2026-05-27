"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const weeklyData = [
  { day: "Mon", incidents: 4 },
  { day: "Tue", incidents: 6 },
  { day: "Wed", incidents: 8 },
  { day: "Thu", incidents: 5 },
  { day: "Fri", incidents: 7 },
  { day: "Sat", incidents: 2 },
  { day: "Sun", incidents: 1 },
];

export function AnalyticsPreview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Weekly Trend</h3>
          <p className="text-xs text-muted-foreground">Incidents this week</p>
        </div>
        <span className="text-2xl font-semibold tabular-nums">33</span>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 4px 12px oklch(0 0 0 / 10%)",
              }}
            />
            <Area
              type="monotone"
              dataKey="incidents"
              stroke="oklch(0.55 0.22 25)"
              strokeWidth={2}
              fill="url(#incidentGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
