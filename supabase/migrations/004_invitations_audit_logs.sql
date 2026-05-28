-- Migration 004: Invitations, Audit Logs, and Utility Functions

-- ================================================
-- INVITATIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'clinic', 'parent', 'admin')),
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days') NOT NULL
);

-- ================================================
-- AUDIT LOGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  type TEXT NOT NULL CHECK (type IN ('user_action', 'system', 'security', 'data')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================================================
-- TREATMENT LOGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS treatment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  treatment TEXT NOT NULL,
  notes TEXT,
  administered_by TEXT NOT NULL,
  time TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ================================================
-- PARENT-STUDENT LINK TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS parent_student (
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'guardian',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (parent_id, student_id)
);

-- ================================================
-- RLS POLICIES
-- ================================================

-- Invitations: Only admins can manage
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage invitations" ON invitations
  FOR ALL USING (get_my_role() = 'admin');

-- Audit logs: Only admins can view
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (get_my_role() = 'admin');
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Treatment logs: Clinic/admin can manage
ALTER TABLE treatment_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clinic and admin can manage treatment logs" ON treatment_logs
  FOR ALL USING (is_admin_or_clinic());
CREATE POLICY "Students can view own treatment logs" ON treatment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents i
      JOIN students s ON s.id = i.student_id
      WHERE i.id = treatment_logs.incident_id AND s.profile_id = auth.uid()
    )
  );
CREATE POLICY "Parents can view linked student treatment logs" ON treatment_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents i
      JOIN parent_student ps ON ps.student_id = i.student_id
      WHERE i.id = treatment_logs.incident_id AND ps.parent_id = auth.uid()
    )
  );

-- Parent-student: Parents see own links
ALTER TABLE parent_student ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view own links" ON parent_student
  FOR SELECT USING (parent_id = auth.uid() OR is_admin_or_clinic());
CREATE POLICY "Admins can manage parent-student links" ON parent_student
  FOR ALL USING (get_my_role() = 'admin');

-- ================================================
-- UTILITY FUNCTIONS (RPCs)
-- ================================================

-- Average response time in minutes
CREATE OR REPLACE FUNCTION get_avg_response_time_minutes()
RETURNS NUMERIC
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    ROUND(
      AVG(
        EXTRACT(EPOCH FROM (acknowledged_at - reported_at)) / 60
      )::NUMERIC, 1
    ),
    0
  )
  FROM incidents
  WHERE acknowledged_at IS NOT NULL
    AND reported_at >= NOW() - INTERVAL '30 days';
$$;

-- Monthly analytics
CREATE OR REPLACE FUNCTION get_monthly_analytics()
RETURNS TABLE(
  month TEXT,
  incidents BIGINT,
  resolved BIGINT,
  avg_response_time NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    TO_CHAR(DATE_TRUNC('month', reported_at), 'Mon YYYY') AS month,
    COUNT(*) AS incidents,
    COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
    ROUND(AVG(
      CASE
        WHEN acknowledged_at IS NOT NULL THEN
          EXTRACT(EPOCH FROM (acknowledged_at - reported_at)) / 60
        ELSE NULL
      END
    )::NUMERIC, 1) AS avg_response_time
  FROM incidents
  WHERE reported_at >= NOW() - INTERVAL '12 months'
  GROUP BY DATE_TRUNC('month', reported_at)
  ORDER BY DATE_TRUNC('month', reported_at);
$$;

-- Write audit log RPC
CREATE OR REPLACE FUNCTION write_audit_log(
  p_actor_id UUID,
  p_actor_name TEXT,
  p_action TEXT,
  p_target TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'user_action',
  p_metadata JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO audit_logs (actor_id, actor_name, action, target, type, metadata)
  VALUES (p_actor_id, p_actor_name, p_action, p_target, p_type, p_metadata);
$$;

-- ================================================
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_treatment_logs_incident ON treatment_logs(incident_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON parent_student(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON parent_student(student_id);
