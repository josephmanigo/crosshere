"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Get notifications for current user */
export async function getMyNotifications(limit = 50) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

/** Get unread notification count */
export async function getUnreadCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", user.id)
    .eq("read", false);

  if (error) return 0;
  return count ?? 0;
}

/** Mark a notification as read */
export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("recipient_id", user.id); // RLS safety

  if (error) throw new Error(error.message);
  revalidatePath("/clinic/notifications");
  revalidatePath("/student/notifications");
  revalidatePath("/parent");
}

/** Mark all notifications as read */
export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_id", user.id)
    .eq("read", false);

  if (error) throw new Error(error.message);
  revalidatePath("/clinic/notifications");
  revalidatePath("/student/notifications");
  revalidatePath("/parent");
}

/** Send notification to a specific user */
export async function sendNotification(
  recipientId: string,
  title: string,
  description: string,
  type: string,
  severity?: string,
  incidentId?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("notifications").insert({
    recipient_id: recipientId,
    title,
    description,
    type,
    severity,
    incident_id: incidentId,
  });

  if (error) throw new Error(error.message);
}
