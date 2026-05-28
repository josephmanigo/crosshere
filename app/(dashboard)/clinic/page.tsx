import { getIncidents, getClinicDashboardStats } from "@/lib/actions/incidents";
import ClinicDashboardClient from "./client";

export default async function DashboardPage() {
  // Fetch data server-side for initial render
  const [incidents, stats] = await Promise.all([
    getIncidents({ limit: 10 }).catch(() => []),
    getClinicDashboardStats().catch(() => ({
      activeEmergencies: 0,
      resolvedToday: 0,
      pendingReview: 0,
      avgResponseTime: 0,
    })),
  ]);

  return <ClinicDashboardClient initialIncidents={incidents} stats={stats} />;
}
