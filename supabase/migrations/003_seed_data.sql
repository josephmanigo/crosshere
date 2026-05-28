-- ============================================================
-- CROSSHERE — Seed Data for Demo
-- Run AFTER 002_rls_policies.sql
-- NOTE: Replace UUIDs with your actual auth.users IDs after
--       creating users in Supabase Auth Dashboard, or use the
--       Supabase Auth API to create them programmatically.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- INSTRUCTIONS TO CREATE DEMO USERS:
-- 1. Go to Supabase → Authentication → Users → Add User
-- 2. Create these 4 users with email/password auth:
--    - admin@crosshere.com        / password: Admin@1234
--    - nurse@school.edu           / password: Clinic@1234
--    - emma.student@school.edu    / password: Student@1234
--    - maria.parent@email.com     / password: Parent@1234
-- 3. Set their metadata: { "role": "admin" } etc.
-- 4. The trigger will auto-create profiles for them.
-- 5. Then run the rest of this seed file.
-- ────────────────────────────────────────────────────────────

-- Insert demo students (after profiles are created by auth trigger)
-- You'll need to update the profile_id UUIDs to match your actual auth users.

-- Demo student (linked to the student auth user)
INSERT INTO public.students (student_number, grade, section, blood_type, allergies, conditions, medications, weight, height, date_of_birth, status, last_visit)
VALUES
  ('2026-10A-042', 'Grade 10', 'Section A', 'O+', ARRAY['Peanuts', 'Penicillin'], ARRAY['Mild Asthma'], ARRAY['Albuterol Inhaler (as needed)', 'Cetirizine 10mg (daily)'], '52 kg', '162 cm', '2011-03-15', 'active', '2026-05-20'),
  ('2026-11B-018', 'Grade 11', 'Section B', 'A+', ARRAY[]::TEXT[], ARRAY['Type 1 Diabetes'], ARRAY['Insulin (as prescribed)'], '68 kg', '175 cm', '2010-06-22', 'active', '2026-05-22'),
  ('2026-09C-033', 'Grade 9', 'Section C', 'B+', ARRAY['Latex', 'Shellfish'], ARRAY[]::TEXT[], ARRAY[]::TEXT[], '48 kg', '158 cm', '2012-11-08', 'active', '2026-05-18'),
  ('2026-12A-007', 'Grade 12', 'Section A', 'AB-', ARRAY['Aspirin'], ARRAY['Epilepsy'], ARRAY['Lamotrigine 100mg'], '75 kg', '180 cm', '2009-07-30', 'active', '2026-05-24'),
  ('2026-10B-055', 'Grade 10', 'Section B', 'O-', ARRAY[]::TEXT[], ARRAY['Anxiety Disorder'], ARRAY['Sertraline 50mg (daily)'], '55 kg', '165 cm', '2011-09-14', 'active', '2026-05-25');
