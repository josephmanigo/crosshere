"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Get all users (admin only) */
export async function getUsers(search?: string, role?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (role && role !== "all") {
    query = query.eq("role", role);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

/** Get admin dashboard stats */
export async function getAdminStats() {
  const supabase = await createClient();

  const [
    studentsRes, parentsRes, clinicRes, adminsRes,
    activeIncidentsRes, pendingInvitesRes
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "parent"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "clinic"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin"),
    supabase.from("incidents").select("id", { count: "exact", head: true }).in("status", ["reported", "acknowledged", "responding"]),
    supabase.from("invitations").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const totalUsers =
    (studentsRes.count ?? 0) +
    (parentsRes.count ?? 0) +
    (clinicRes.count ?? 0) +
    (adminsRes.count ?? 0);

  return {
    students: studentsRes.count ?? 0,
    parents: parentsRes.count ?? 0,
    clinicStaff: clinicRes.count ?? 0,
    admins: adminsRes.count ?? 0,
    totalUsers,
    activeIncidents: activeIncidentsRes.count ?? 0,
    pendingInvites: pendingInvitesRes.count ?? 0,
    systemHealth: 99.9,
  };
}

/** Update a user's role or active status */
export async function updateUser(
  userId: string,
  updates: { role?: string; is_active?: boolean; full_name?: string }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) throw new Error(error.message);

  // Write audit log
  const { data: { user } } = await supabase.auth.getUser();
  const { data: actor } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .single();

  await supabase.rpc("write_audit_log", {
    p_actor_id: user?.id,
    p_actor_name: actor?.full_name ?? "Admin",
    p_action: `Updated user profile`,
    p_target: userId,
    p_type: "user_action",
    p_metadata: updates,
  });

  revalidatePath("/admin/users");
}

/** Send an invitation email */
export async function sendInvitation(
  email: string,
  role: string,
  studentId?: string
) {
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Create invitation record
  const { data: invitation, error: invErr } = await supabase
    .from("invitations")
    .insert({
      email,
      role,
      student_id: studentId ?? null,
      invited_by: user.id,
    })
    .select()
    .single();

  if (invErr) throw new Error(invErr.message);

  // Use Supabase Admin to send invite email
  const { error: authErr } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: {
      role,
      invitation_token: invitation.token,
      ...(studentId ? { student_id: studentId } : {}),
    },
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", "")}/register?token=${invitation.token}`,
  });

  if (authErr) {
    // Clean up invitation record if email failed
    await supabase.from("invitations").delete().eq("id", invitation.id);
    throw new Error(authErr.message);
  }

  // Write audit log
  const { data: actor } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  await supabase.rpc("write_audit_log", {
    p_actor_id: user.id,
    p_actor_name: actor?.full_name ?? "Admin",
    p_action: `Sent invitation to ${email} (role: ${role})`,
    p_target: email,
    p_type: "user_action",
  });

  revalidatePath("/admin/invitations");
  return invitation;
}

/** Cancel an invitation */
export async function cancelInvitation(invitationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("invitations")
    .update({ status: "cancelled" })
    .eq("id", invitationId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/invitations");
}

/** Get all invitations */
export async function getInvitations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invitations")
    .select(`*, invited_by:profiles(full_name)`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/** Get audit logs */
export async function getAuditLogs(limit = 100) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

/** Deactivate a user account */
export async function deactivateUser(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ is_active: false })
    .eq("id", userId);

  if (error) throw new Error(error.message);

  const { data: { user } } = await supabase.auth.getUser();
  const { data: actor } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .single();

  await supabase.rpc("write_audit_log", {
    p_actor_id: user?.id,
    p_actor_name: actor?.full_name ?? "Admin",
    p_action: `Deactivated user account`,
    p_target: userId,
    p_type: "user_action",
  });

  revalidatePath("/admin/users");
}
