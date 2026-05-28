"use server";

import { createClient } from "@/lib/supabase/server";

/** Get monthly incident analytics */
export async function getMonthlyAnalytics() {
  const supabase = await createClient();

  // Get incidents grouped by month for the past 12 months
  const { data, error } = await supabase.rpc("get_monthly_analytics");

  if (error || !data) {
    // Fallback: return empty array if RPC not set up yet
    return [];
  }

  return data as Array<{
    month: string;
    incidents: number;
    resolved: number;
    avgResponseTime: number;
  }>;
}

/** Get incident type breakdown */
export async function getIncidentBreakdown() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .select("type, severity")
    .order("type");

  if (error) throw new Error(error.message);

  // Group by type
  const grouped: Record<string, number> = {};
  for (const incident of data ?? []) {
    grouped[incident.type] = (grouped[incident.type] ?? 0) + 1;
  }

  const total = Object.values(grouped).reduce((a, b) => a + b, 0);

  return Object.entries(grouped).map(([category, count]) => ({
    category,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

/** Get severity distribution */
export async function getSeverityDistribution() {
  const supabase = await createClient();

  const severities = ["critical", "high", "medium", "low"];
  const results = await Promise.all(
    severities.map(async (severity) => {
      const { count } = await supabase
        .from("incidents")
        .select("id", { count: "exact", head: true })
        .eq("severity", severity);
      return { severity, count: count ?? 0 };
    })
  );

  return results;
}

/** Get response time distribution */
export async function getResponseTimeDistribution() {
  const supabase = await createClient();

  // Get all resolved incidents with response times
  const { data, error } = await supabase
    .from("incidents")
    .select("reported_at, acknowledged_at")
    .not("acknowledged_at", "is", null);

  if (error) throw new Error(error.message);

  const ranges = [
    { range: "< 1 min", min: 0, max: 1 },
    { range: "1-2 min", min: 1, max: 2 },
    { range: "2-3 min", min: 2, max: 3 },
    { range: "3-5 min", min: 3, max: 5 },
    { range: "5-10 min", min: 5, max: 10 },
    { range: "> 10 min", min: 10, max: Infinity },
  ];

  const distribution = ranges.map(({ range, min, max }) => ({
    range,
    count: (data ?? []).filter((incident) => {
      if (!incident.acknowledged_at) return false;
      const responseMs =
        new Date(incident.acknowledged_at).getTime() -
        new Date(incident.reported_at).getTime();
      const responseMin = responseMs / 60000;
      return responseMin >= min && responseMin < max;
    }).length,
  }));

  return distribution;
}

/** Get analytics for admin overview */
export async function getAdminAnalytics() {
  const supabase = await createClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentIncidents } = await supabase
    .from("incidents")
    .select("severity, status, reported_at")
    .gte("reported_at", thirtyDaysAgo.toISOString())
    .order("reported_at");

  return {
    recentIncidents: recentIncidents ?? [],
  };
}
