-- ============================================================
-- CROSSHERE — Initial Database Schema
-- Run this in your Supabase SQL Editor (Project → SQL Editor → New Query)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES (extends auth.users)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'clinic', 'student', 'parent')),
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2. STUDENTS (health profile)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.students (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_number  TEXT UNIQUE NOT NULL,
  grade           TEXT NOT NULL,
  section         TEXT NOT NULL,
  blood_type      TEXT,
  allergies       TEXT[] DEFAULT '{}',
  conditions      TEXT[] DEFAULT '{}',
  medications     TEXT[] DEFAULT '{}',
  weight          TEXT,
  height          TEXT,
  date_of_birth   DATE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_visit      DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────
-- 3. PARENT_STUDENT (many-to-many link)
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.parent_student (
  parent_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, student_id)
);

-- ────────────────────────────────────────────────────────────
-- 4. INCIDENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.incidents (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id       UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reported_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  responder_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type             TEXT NOT NULL,
  severity         TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status           TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'acknowledged', 'responding', 'resolved')),
  location         TEXT NOT NULL,
  description      TEXT NOT NULL,
  symptoms         TEXT[] DEFAULT '{}',
  response_notes   TEXT,
  reported_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at  TIMESTAMPTZ,
  resolved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Index for common queries
CREATE INDEX incidents_student_id_idx ON public.incidents(student_id);
CREATE INDEX incidents_status_idx ON public.incidents(status);
CREATE INDEX incidents_severity_idx ON public.incidents(severity);
CREATE INDEX incidents_reported_at_idx ON public.incidents(reported_at DESC);

-- ────────────────────────────────────────────────────────────
-- 5. INCIDENT_TIMELINE
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.incident_timeline (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  actor_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name  TEXT NOT NULL,
  action      TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('report', 'acknowledge', 'update', 'treatment', 'resolve')),
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX timeline_incident_id_idx ON public.incident_timeline(incident_id);

-- ────────────────────────────────────────────────────────────
-- 6. TREATMENT_LOGS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.treatment_logs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id      UUID NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  treatment        TEXT NOT NULL,
  administered_by  TEXT NOT NULL,
  notes            TEXT,
  time             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX treatment_logs_incident_id_idx ON public.treatment_logs(incident_id);

-- ────────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('emergency', 'system', 'sms', 'email', 'escalation', 'clinic', 'announcement', 'reminder')),
  severity     TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  read         BOOLEAN NOT NULL DEFAULT FALSE,
  incident_id  UUID REFERENCES public.incidents(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_recipient_id_idx ON public.notifications(recipient_id);
CREATE INDEX notifications_read_idx ON public.notifications(recipient_id, read);

-- ────────────────────────────────────────────────────────────
-- 8. INVITATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.invitations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'clinic', 'student', 'parent')),
  student_id  UUID REFERENCES public.students(id) ON DELETE SET NULL,
  invited_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX invitations_email_idx ON public.invitations(email);
CREATE INDEX invitations_token_idx ON public.invitations(token);

-- ────────────────────────────────────────────────────────────
-- 9. AUDIT_LOGS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.audit_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  action     TEXT NOT NULL,
  target     TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('login', 'logout', 'user_action', 'settings', 'escalation', 'import', 'delete', 'system')),
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_actor_id_idx ON public.audit_logs(actor_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs(created_at DESC);

-- ────────────────────────────────────────────────────────────
-- 10. HELPER VIEWS
-- ────────────────────────────────────────────────────────────

-- Incidents with student info and responder name
CREATE VIEW public.incidents_with_details AS
SELECT
  i.*,
  s.student_number,
  s.grade,
  s.section,
  p_student.full_name AS student_name,
  p_responder.full_name AS responder_name
FROM public.incidents i
JOIN public.students s ON s.id = i.student_id
LEFT JOIN public.profiles p_student ON p_student.id = s.profile_id
LEFT JOIN public.profiles p_responder ON p_responder.id = i.responder_id;

-- Notifications with unread count per user
CREATE VIEW public.notification_summary AS
SELECT
  recipient_id,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE read = FALSE) AS unread_count
FROM public.notifications
GROUP BY recipient_id;

-- ────────────────────────────────────────────────────────────
-- 11. FUNCTION: write_audit_log (for server-side use)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.write_audit_log(
  p_actor_id   UUID,
  p_actor_name TEXT,
  p_action     TEXT,
  p_target     TEXT,
  p_type       TEXT,
  p_metadata   JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_logs (actor_id, actor_name, action, target, type, metadata)
  VALUES (p_actor_id, p_actor_name, p_action, p_target, p_type, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
