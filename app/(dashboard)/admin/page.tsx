import { getAdminStats } from "@/lib/actions/admin";
import { getIncidents } from "@/lib/actions/incidents";
import AdminDashboardClient from "./client";

export default async function AdminDashboardPage() {
  const [stats, recentIncidents] = await Promise.all([
    getAdminStats().catch(() => ({
      students: 0, parents: 0, clinicStaff: 0, admins: 0,
      totalUsers: 0, activeIncidents: 0, pendingInvites: 0, systemHealth: 99.9,
    })),
    getIncidents({ limit: 5 }).catch(() => []),
  ]);

  return <AdminDashboardClient stats={stats} recentIncidents={recentIncidents} />;
}
