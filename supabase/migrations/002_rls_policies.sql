-- ============================================================
-- CROSSHERE — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: check if user is admin or clinic
CREATE OR REPLACE FUNCTION public.is_admin_or_clinic()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'clinic')
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: get student IDs linked to current parent
CREATE OR REPLACE FUNCTION public.get_my_student_ids()
RETURNS UUID[] AS $$
  SELECT ARRAY(
    SELECT student_id FROM public.parent_student WHERE parent_id = auth.uid()
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────
-- PROFILES
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admin can read all profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.get_my_role() = 'admin');

-- Clinic can read all profiles (for student lookups)
CREATE POLICY "profiles_select_clinic" ON public.profiles
  FOR SELECT USING (public.get_my_role() = 'clinic');

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can update any profile
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.get_my_role() = 'admin');

-- Admin can delete profiles
CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE USING (public.get_my_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- STUDENTS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Admin and clinic can read all students
CREATE POLICY "students_select_admin_clinic" ON public.students
  FOR SELECT USING (public.is_admin_or_clinic());

-- Student can read their own record
CREATE POLICY "students_select_own" ON public.students
  FOR SELECT USING (profile_id = auth.uid());

-- Parent can read linked students
CREATE POLICY "students_select_parent" ON public.students
  FOR SELECT USING (
    id = ANY(public.get_my_student_ids())
  );

-- Admin and clinic can insert students
CREATE POLICY "students_insert_admin_clinic" ON public.students
  FOR INSERT WITH CHECK (public.is_admin_or_clinic());

-- Admin and clinic can update students
CREATE POLICY "students_update_admin_clinic" ON public.students
  FOR UPDATE USING (public.is_admin_or_clinic());

-- Admin can delete students
CREATE POLICY "students_delete_admin" ON public.students
  FOR DELETE USING (public.get_my_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- PARENT_STUDENT
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;

-- Admin and clinic can read all links
CREATE POLICY "parent_student_select_admin_clinic" ON public.parent_student
  FOR SELECT USING (public.is_admin_or_clinic());

-- Parent can read their own links
CREATE POLICY "parent_student_select_own" ON public.parent_student
  FOR SELECT USING (parent_id = auth.uid());

-- Admin can manage all links
CREATE POLICY "parent_student_all_admin" ON public.parent_student
  FOR ALL USING (public.get_my_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- INCIDENTS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Admin and clinic can read all incidents
CREATE POLICY "incidents_select_admin_clinic" ON public.incidents
  FOR SELECT USING (public.is_admin_or_clinic());

-- Student can read their own incidents
CREATE POLICY "incidents_select_student" ON public.incidents
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM public.students WHERE profile_id = auth.uid()
    )
  );

-- Parent can read incidents for their linked students
CREATE POLICY "incidents_select_parent" ON public.incidents
  FOR SELECT USING (
    student_id = ANY(public.get_my_student_ids())
  );

-- Any authenticated user can report an incident (student SOS)
CREATE POLICY "incidents_insert_authenticated" ON public.incidents
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Clinic and admin can update incidents (respond, resolve)
CREATE POLICY "incidents_update_admin_clinic" ON public.incidents
  FOR UPDATE USING (public.is_admin_or_clinic());

-- Admin can delete incidents
CREATE POLICY "incidents_delete_admin" ON public.incidents
  FOR DELETE USING (public.get_my_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- INCIDENT_TIMELINE
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.incident_timeline ENABLE ROW LEVEL SECURITY;

-- Admin and clinic can read all timeline entries
CREATE POLICY "timeline_select_admin_clinic" ON public.incident_timeline
  FOR SELECT USING (public.is_admin_or_clinic());

-- Student can read timeline for their own incidents
CREATE POLICY "timeline_select_student" ON public.incident_timeline
  FOR SELECT USING (
    incident_id IN (
      SELECT i.id FROM public.incidents i
      JOIN public.students s ON s.id = i.student_id
      WHERE s.profile_id = auth.uid()
    )
  );

-- Parent can read timeline for linked students' incidents
CREATE POLICY "timeline_select_parent" ON public.incident_timeline
  FOR SELECT USING (
    incident_id IN (
      SELECT i.id FROM public.incidents i
      WHERE i.student_id = ANY(public.get_my_student_ids())
    )
  );

-- Any authenticated user can add timeline entries
CREATE POLICY "timeline_insert_authenticated" ON public.incident_timeline
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ────────────────────────────────────────────────────────────
-- TREATMENT_LOGS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.treatment_logs ENABLE ROW LEVEL SECURITY;

-- Admin and clinic can read and write all treatment logs
CREATE POLICY "treatment_logs_all_admin_clinic" ON public.treatment_logs
  FOR ALL USING (public.is_admin_or_clinic());

-- Student can read treatment logs for their own incidents
CREATE POLICY "treatment_logs_select_student" ON public.treatment_logs
  FOR SELECT USING (
    incident_id IN (
      SELECT i.id FROM public.incidents i
      JOIN public.students s ON s.id = i.student_id
      WHERE s.profile_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (recipient_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (recipient_id = auth.uid());

-- Service role can insert notifications for any user (via server actions)
-- Authenticated users (system/clinic) can insert notifications
CREATE POLICY "notifications_insert_authenticated" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admin can read all notifications
CREATE POLICY "notifications_select_admin" ON public.notifications
  FOR SELECT USING (public.get_my_role() = 'admin');

-- ────────────────────────────────────────────────────────────
-- INVITATIONS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Admin can manage all invitations
CREATE POLICY "invitations_all_admin" ON public.invitations
  FOR ALL USING (public.get_my_role() = 'admin');

-- Anyone can read an invitation by token (for acceptance flow)
CREATE POLICY "invitations_select_by_token" ON public.invitations
  FOR SELECT USING (TRUE); -- token-based lookup is handled in app logic

-- ────────────────────────────────────────────────────────────
-- AUDIT_LOGS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin can read all audit logs
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT USING (public.get_my_role() = 'admin');

-- Audit logs are written by the server (service role bypasses RLS)
-- No insert policy needed for client — server uses service role key

-- ────────────────────────────────────────────────────────────
-- ENABLE REALTIME
-- ────────────────────────────────────────────────────────────
-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incident_timeline;
