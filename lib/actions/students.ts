"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Get all students (clinic/admin) */
export async function getStudents(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("students")
    .select(`
      *,
      profiles(full_name, email, avatar_url)
    `)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`student_number.ilike.%${search}%,grade.ilike.%${search}%,section.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

/** Get current student's own profile */
export async function getMyStudentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      profiles(full_name, email, avatar_url)
    `)
    .eq("profile_id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Get a student by ID */
export async function getStudentById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      profiles(full_name, email, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Update a student's health profile */
export async function updateStudentProfile(
  studentId: string,
  updates: {
    blood_type?: string;
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
    weight?: string;
    height?: string;
    date_of_birth?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("students")
    .update(updates)
    .eq("id", studentId);

  if (error) throw new Error(error.message);
  revalidatePath("/student/health");
  revalidatePath("/clinic/students");
}

/** Get students linked to the current parent */
export async function getMyLinkedStudents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("parent_student")
    .select(`
      students(
        *,
        profiles(full_name, email, avatar_url),
        incidents(id, type, severity, status, reported_at, location)
      )
    `)
    .eq("parent_id", user.id);

  if (error) throw new Error(error.message);
  return data?.map((row) => row.students) ?? [];
}

/** Bulk insert students (admin CSV import) */
export async function bulkImportStudents(
  students: Array<{
    student_number: string;
    grade: string;
    section: string;
    blood_type?: string;
    allergies?: string[];
    conditions?: string[];
  }>
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .upsert(students, { onConflict: "student_number" })
    .select();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/import");
  revalidatePath("/clinic/students");
  return data;
}
