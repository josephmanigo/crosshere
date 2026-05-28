"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "reported" | "acknowledged" | "responding" | "resolved";

export interface IncidentFilters {
  status?: IncidentStatus | "all";
  severity?: IncidentSeverity | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

/** Fetch all incidents (clinic/admin) with optional filters */
export async function getIncidents(filters: IncidentFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("incidents")
    .select(`
      *,
      students!inner(
        student_number, grade, section,
        profiles(full_name, avatar_url)
      ),
      responder:profiles!incidents_responder_id_fkey(full_name)
    `)
    .order("reported_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.severity && filters.severity !== "all") {
    query = query.eq("severity", filters.severity);
  }
  if (filters.search) {
    query = query.or(
      `type.ilike.%${filters.search}%,location.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, (filters.offset + (filters.limit ?? 20)) - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

/** Get a single incident with full details */
export async function getIncident(id: string) {
  const supabase = await createClient();

  const [incidentRes, timelineRes, treatmentRes] = await Promise.all([
    supabase
      .from("incidents")
      .select(`
        *,
        students!inner(
          student_number, grade, section, blood_type, allergies, conditions, medications,
          profiles(full_name, avatar_url)
        ),
        responder:profiles!incidents_responder_id_fkey(full_name),
        reported_by:profiles!incidents_reported_by_fkey(full_name)
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("incident_timeline")
      .select("*")
      .eq("incident_id", id)
      .order("timestamp", { ascending: true }),
    supabase
      .from("treatment_logs")
      .select("*")
      .eq("incident_id", id)
      .order("time", { ascending: true }),
  ]);

  if (incidentRes.error) throw new Error(incidentRes.error.message);

  return {
    incident: incidentRes.data,
    timeline: timelineRes.data ?? [],
    treatments: treatmentRes.data ?? [],
  };
}

/** Get incidents for a specific student */
export async function getStudentIncidents(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("student_id", studentId)
    .order("reported_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Create a new incident (SOS from student or report from clinic) */
export async function createIncident(input: {
  student_id: string;
  type: string;
  severity: IncidentSeverity;
  location: string;
  description: string;
  symptoms: string[];
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("incidents")
    .insert({
      ...input,
      reported_by: user.id,
      status: "reported",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Add initial timeline entry
  await supabase.from("incident_timeline").insert({
    incident_id: data.id,
    actor_id: user.id,
    actor_name: "Student",
    action: `Emergency reported: ${input.type}`,
    type: "report",
  });

  // Notify all clinic staff
  const { data: clinicStaff } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "clinic");

  if (clinicStaff && clinicStaff.length > 0) {
    await supabase.from("notifications").insert(
      clinicStaff.map((staff) => ({
        recipient_id: staff.id,
        title: `${input.severity === "critical" ? "🚨 CRITICAL" : "⚠️"} ${input.type}`,
        description: `${input.location} — ${input.description.slice(0, 100)}`,
        type: "emergency",
        severity: input.severity,
        incident_id: data.id,
      }))
    );
  }

  revalidatePath("/clinic");
  revalidatePath("/clinic/incidents");
  return data;
}

/** Update incident status */
export async function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus,
  responseNotes?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const updateData: Record<string, unknown> = { status };
  if (status === "acknowledged") updateData.acknowledged_at = new Date().toISOString();
  if (status === "responding") {
    updateData.responder_id = user.id;
    updateData.acknowledged_at = updateData.acknowledged_at ?? new Date().toISOString();
  }
  if (status === "resolved") {
    updateData.resolved_at = new Date().toISOString();
    if (responseNotes) updateData.response_notes = responseNotes;
  }

  const { error } = await supabase
    .from("incidents")
    .update(updateData)
    .eq("id", incidentId);

  if (error) throw new Error(error.message);

  // Add timeline entry
  const actionLabels: Record<IncidentStatus, string> = {
    reported: "Incident reported",
    acknowledged: `Incident acknowledged by ${profile?.full_name ?? "Clinic Staff"}`,
    responding: `Responding — ${profile?.full_name ?? "Clinic Staff"} en route`,
    resolved: `Incident resolved by ${profile?.full_name ?? "Clinic Staff"}`,
  };

  const typeMap: Record<IncidentStatus, "report" | "acknowledge" | "update" | "treatment" | "resolve"> = {
    reported: "report",
    acknowledged: "acknowledge",
    responding: "update",
    resolved: "resolve",
  };

  await supabase.from("incident_timeline").insert({
    incident_id: incidentId,
    actor_id: user.id,
    actor_name: profile?.full_name ?? "Clinic Staff",
    action: actionLabels[status],
    type: typeMap[status],
  });

  revalidatePath(`/clinic/incidents/${incidentId}`);
  revalidatePath("/clinic/incidents");
  revalidatePath("/clinic");
}

/** Add a timeline entry (update note) */
export async function addTimelineEntry(
  incidentId: string,
  action: string,
  type: "update" | "treatment"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("incident_timeline").insert({
    incident_id: incidentId,
    actor_id: user.id,
    actor_name: profile?.full_name ?? "Staff",
    action,
    type,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/clinic/incidents/${incidentId}`);
}

/** Add a treatment log entry */
export async function addTreatmentLog(
  incidentId: string,
  treatment: string,
  notes: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("treatment_logs").insert({
    incident_id: incidentId,
    treatment,
    notes,
    administered_by: profile?.full_name ?? "Staff",
  });

  if (error) throw new Error(error.message);

  // Also add timeline entry
  await addTimelineEntry(incidentId, `Treatment administered: ${treatment}`, "treatment");

  revalidatePath(`/clinic/incidents/${incidentId}`);
}

/** Get dashboard stats for clinic */
export async function getClinicDashboardStats() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [activeRes, resolvedTodayRes, pendingRes, avgRes] = await Promise.all([
    supabase
      .from("incidents")
      .select("id", { count: "exact", head: true })
      .in("status", ["reported", "acknowledged", "responding"]),
    supabase
      .from("incidents")
      .select("id", { count: "exact", head: true })
      .eq("status", "resolved")
      .gte("resolved_at", today.toISOString()),
    supabase
      .from("incidents")
      .select("id", { count: "exact", head: true })
      .in("status", ["reported", "acknowledged"]),
    supabase.rpc("get_avg_response_time_minutes"),
  ]);

  return {
    activeEmergencies: activeRes.count ?? 0,
    resolvedToday: resolvedTodayRes.count ?? 0,
    pendingReview: pendingRes.count ?? 0,
    avgResponseTime: avgRes.data ?? 0,
  };
}
