import type { Severity, IncidentStatus } from "./constants";

// ── Types ───────────────────────────────────────────────────────────────────
export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  avatar: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  lastVisit: string;
  status: "active" | "inactive";
}

export interface Incident {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  type: string;
  severity: Severity;
  status: IncidentStatus;
  location: string;
  description: string;
  symptoms: string[];
  reportedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  responder?: string;
  responseNotes?: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  type: "report" | "acknowledge" | "update" | "treatment" | "resolve";
}

export interface TreatmentLog {
  id: string;
  time: string;
  treatment: string;
  administeredBy: string;
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "emergency" | "system" | "sms" | "email" | "escalation";
  read: boolean;
  severity?: Severity;
}

export interface AnalyticsData {
  month: string;
  incidents: number;
  resolved: number;
  avgResponseTime: number;
}

export interface HeatmapCell {
  day: string;
  hour: number;
  value: number;
}

// ── Mock Students ───────────────────────────────────────────────────────────
export const mockStudents: Student[] = [
  {
    id: "STU-001",
    name: "Emma Rodriguez",
    grade: "Grade 10",
    section: "Section A",
    avatar: "ER",
    bloodType: "O+",
    allergies: ["Peanuts", "Penicillin"],
    conditions: ["Mild Asthma"],
    guardianName: "Maria Rodriguez",
    guardianPhone: "+1 (555) 123-4567",
    guardianEmail: "m.rodriguez@email.com",
    lastVisit: "2026-05-20",
    status: "active",
  },
  {
    id: "STU-002",
    name: "Liam Chen",
    grade: "Grade 11",
    section: "Section B",
    avatar: "LC",
    bloodType: "A+",
    allergies: [],
    conditions: ["Type 1 Diabetes"],
    guardianName: "Wei Chen",
    guardianPhone: "+1 (555) 234-5678",
    guardianEmail: "w.chen@email.com",
    lastVisit: "2026-05-22",
    status: "active",
  },
  {
    id: "STU-003",
    name: "Sophia Patel",
    grade: "Grade 9",
    section: "Section C",
    avatar: "SP",
    bloodType: "B+",
    allergies: ["Latex", "Shellfish"],
    conditions: [],
    guardianName: "Raj Patel",
    guardianPhone: "+1 (555) 345-6789",
    guardianEmail: "r.patel@email.com",
    lastVisit: "2026-05-18",
    status: "active",
  },
  {
    id: "STU-004",
    name: "Noah Williams",
    grade: "Grade 12",
    section: "Section A",
    avatar: "NW",
    bloodType: "AB-",
    allergies: ["Aspirin"],
    conditions: ["Epilepsy"],
    guardianName: "James Williams",
    guardianPhone: "+1 (555) 456-7890",
    guardianEmail: "j.williams@email.com",
    lastVisit: "2026-05-24",
    status: "active",
  },
  {
    id: "STU-005",
    name: "Ava Thompson",
    grade: "Grade 10",
    section: "Section B",
    avatar: "AT",
    bloodType: "O-",
    allergies: [],
    conditions: ["Anxiety Disorder"],
    guardianName: "Sarah Thompson",
    guardianPhone: "+1 (555) 567-8901",
    guardianEmail: "s.thompson@email.com",
    lastVisit: "2026-05-25",
    status: "active",
  },
  {
    id: "STU-006",
    name: "Ethan Kim",
    grade: "Grade 11",
    section: "Section A",
    avatar: "EK",
    bloodType: "A-",
    allergies: ["Bee Stings"],
    conditions: [],
    guardianName: "Min-Jun Kim",
    guardianPhone: "+1 (555) 678-9012",
    guardianEmail: "m.kim@email.com",
    lastVisit: "2026-05-15",
    status: "active",
  },
];

// ── Mock Incidents ──────────────────────────────────────────────────────────
export const mockIncidents: Incident[] = [
  {
    id: "INC-1042",
    studentId: "STU-001",
    studentName: "Emma Rodriguez",
    studentAvatar: "ER",
    type: "Asthma Attack",
    severity: "critical",
    status: "responding",
    location: "Building C, Room 204",
    description: "Student experiencing severe asthma attack during PE class. Inhaler not providing relief.",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Cyanosis"],
    reportedAt: "2026-05-26T09:42:00Z",
    acknowledgedAt: "2026-05-26T09:43:15Z",
    responder: "Nurse Sarah Mitchell",
    responseNotes: "Nebulizer treatment initiated. Monitoring oxygen saturation.",
  },
  {
    id: "INC-1041",
    studentId: "STU-004",
    studentName: "Noah Williams",
    studentAvatar: "NW",
    type: "Seizure",
    severity: "critical",
    status: "responding",
    location: "Science Lab, Room 312",
    description: "Student had a tonic-clonic seizure lasting approximately 2 minutes.",
    symptoms: ["Loss of consciousness", "Convulsions", "Confusion"],
    reportedAt: "2026-05-26T09:38:00Z",
    acknowledgedAt: "2026-05-26T09:38:45Z",
    responder: "Dr. Alan Rivera",
    responseNotes: "Post-ictal state. Vital signs stable. Parents contacted.",
  },
  {
    id: "INC-1040",
    studentId: "STU-003",
    studentName: "Sophia Patel",
    studentAvatar: "SP",
    type: "Allergic Reaction",
    severity: "high",
    status: "acknowledged",
    location: "Cafeteria",
    description: "Student reports swelling of lips and hives after lunch.",
    symptoms: ["Hives", "Lip swelling", "Itching"],
    reportedAt: "2026-05-26T09:30:00Z",
    acknowledgedAt: "2026-05-26T09:31:00Z",
  },
  {
    id: "INC-1039",
    studentId: "STU-005",
    studentName: "Ava Thompson",
    studentAvatar: "AT",
    type: "Anxiety / Panic Attack",
    severity: "medium",
    status: "responding",
    location: "Library, Study Room 2",
    description: "Student experiencing a panic attack before exam period.",
    symptoms: ["Hyperventilation", "Trembling", "Chest pain", "Dizziness"],
    reportedAt: "2026-05-26T09:15:00Z",
    acknowledgedAt: "2026-05-26T09:16:30Z",
    responder: "Counselor Marie Davis",
    responseNotes: "Breathing exercises initiated. Student calming down.",
  },
  {
    id: "INC-1038",
    studentId: "STU-002",
    studentName: "Liam Chen",
    studentAvatar: "LC",
    type: "Fever / Infection",
    severity: "low",
    status: "resolved",
    location: "Classroom 108",
    description: "Student has mild fever of 38.2°C with sore throat.",
    symptoms: ["Fever", "Sore throat", "Fatigue"],
    reportedAt: "2026-05-26T08:45:00Z",
    acknowledgedAt: "2026-05-26T08:47:00Z",
    resolvedAt: "2026-05-26T09:10:00Z",
    responder: "Nurse Sarah Mitchell",
    responseNotes: "Acetaminophen administered. Guardian contacted for pickup.",
  },
  {
    id: "INC-1037",
    studentId: "STU-006",
    studentName: "Ethan Kim",
    studentAvatar: "EK",
    type: "Fracture / Sprain",
    severity: "medium",
    status: "resolved",
    location: "Sports Field",
    description: "Student twisted ankle during soccer practice.",
    symptoms: ["Ankle swelling", "Pain on movement", "Bruising"],
    reportedAt: "2026-05-25T14:20:00Z",
    acknowledgedAt: "2026-05-25T14:22:00Z",
    resolvedAt: "2026-05-25T14:50:00Z",
    responder: "Coach Mike Anderson",
    responseNotes: "RICE protocol applied. X-ray recommended. Guardian picking up.",
  },
];

// ── Mock Timeline ───────────────────────────────────────────────────────────
export const mockTimeline: TimelineEntry[] = [
  { id: "TL-001", timestamp: "2026-05-26T09:42:00Z", action: "Emergency reported by PE Teacher Mr. Brooks", actor: "System", type: "report" },
  { id: "TL-002", timestamp: "2026-05-26T09:43:15Z", action: "Incident acknowledged by Nurse Sarah Mitchell", actor: "Nurse Mitchell", type: "acknowledge" },
  { id: "TL-003", timestamp: "2026-05-26T09:44:00Z", action: "Nurse en route to Building C, Room 204", actor: "Nurse Mitchell", type: "update" },
  { id: "TL-004", timestamp: "2026-05-26T09:45:30Z", action: "Arrived on scene. Student conscious but distressed.", actor: "Nurse Mitchell", type: "update" },
  { id: "TL-005", timestamp: "2026-05-26T09:46:00Z", action: "Nebulizer treatment administered (Albuterol 2.5mg)", actor: "Nurse Mitchell", type: "treatment" },
  { id: "TL-006", timestamp: "2026-05-26T09:50:00Z", action: "SpO2 improved from 89% to 94%. Student responding.", actor: "Nurse Mitchell", type: "update" },
];

// ── Mock Treatment Logs ─────────────────────────────────────────────────────
export const mockTreatmentLogs: TreatmentLog[] = [
  { id: "TR-001", time: "09:46 AM", treatment: "Albuterol Nebulizer (2.5mg)", administeredBy: "Nurse Sarah Mitchell", notes: "Patient tolerating well" },
  { id: "TR-002", time: "09:48 AM", treatment: "Oxygen Supplementation (2L/min)", administeredBy: "Nurse Sarah Mitchell", notes: "Via nasal cannula" },
  { id: "TR-003", time: "09:55 AM", treatment: "Prednisolone (30mg oral)", administeredBy: "Nurse Sarah Mitchell", notes: "To reduce airway inflammation" },
];

// ── Mock Notifications ──────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: "NOT-001", title: "Critical: Asthma Emergency", description: "Emma Rodriguez — Building C, Room 204. Immediate response required.", timestamp: "2026-05-26T09:42:00Z", type: "emergency", read: false, severity: "critical" },
  { id: "NOT-002", title: "Critical: Seizure Reported", description: "Noah Williams — Science Lab, Room 312. Medical team dispatched.", timestamp: "2026-05-26T09:38:00Z", type: "emergency", read: false, severity: "critical" },
  { id: "NOT-003", title: "SMS Sent to Guardian", description: "Notification sent to Maria Rodriguez regarding Emma's emergency.", timestamp: "2026-05-26T09:43:30Z", type: "sms", read: true },
  { id: "NOT-004", title: "Allergic Reaction Report", description: "Sophia Patel reports allergic symptoms. Nurse assigned.", timestamp: "2026-05-26T09:30:00Z", type: "emergency", read: true, severity: "high" },
  { id: "NOT-005", title: "System Maintenance Scheduled", description: "Platform update planned for tonight at 11:00 PM. Expected downtime: 15 minutes.", timestamp: "2026-05-26T08:00:00Z", type: "system", read: true },
  { id: "NOT-006", title: "Escalation: No Response", description: "INC-1040 escalated — no responder assigned after 5 minutes.", timestamp: "2026-05-26T09:35:00Z", type: "escalation", read: false, severity: "high" },
  { id: "NOT-007", title: "Email Sent to Parents", description: "Daily health summary sent to 243 guardians.", timestamp: "2026-05-26T07:00:00Z", type: "email", read: true },
  { id: "NOT-008", title: "Incident Resolved", description: "Liam Chen — Fever/Infection. Discharged to guardian.", timestamp: "2026-05-26T09:10:00Z", type: "system", read: true },
];

// ── Analytics Data ──────────────────────────────────────────────────────────
export const monthlyAnalytics: AnalyticsData[] = [
  { month: "Jan", incidents: 24, resolved: 23, avgResponseTime: 3.2 },
  { month: "Feb", incidents: 18, resolved: 18, avgResponseTime: 2.8 },
  { month: "Mar", incidents: 31, resolved: 29, avgResponseTime: 3.5 },
  { month: "Apr", incidents: 28, resolved: 27, avgResponseTime: 2.9 },
  { month: "May", incidents: 35, resolved: 32, avgResponseTime: 2.6 },
  { month: "Jun", incidents: 22, resolved: 22, avgResponseTime: 2.4 },
  { month: "Jul", incidents: 12, resolved: 12, avgResponseTime: 3.1 },
  { month: "Aug", incidents: 15, resolved: 15, avgResponseTime: 2.7 },
  { month: "Sep", incidents: 29, resolved: 28, avgResponseTime: 3.0 },
  { month: "Oct", incidents: 33, resolved: 31, avgResponseTime: 2.5 },
  { month: "Nov", incidents: 27, resolved: 26, avgResponseTime: 2.8 },
  { month: "Dec", incidents: 19, resolved: 19, avgResponseTime: 3.3 },
];

export const illnessBreakdown = [
  { category: "Respiratory", count: 45, percentage: 22 },
  { category: "Injury", count: 38, percentage: 18 },
  { category: "Allergy", count: 32, percentage: 16 },
  { category: "Infection", count: 28, percentage: 14 },
  { category: "Mental Health", count: 25, percentage: 12 },
  { category: "Cardiac", count: 15, percentage: 7 },
  { category: "Neurological", count: 12, percentage: 6 },
  { category: "Other", count: 10, percentage: 5 },
];

export const responseTimeDistribution = [
  { range: "< 1 min", count: 42 },
  { range: "1-2 min", count: 68 },
  { range: "2-3 min", count: 45 },
  { range: "3-5 min", count: 28 },
  { range: "5-10 min", count: 12 },
  { range: "> 10 min", count: 5 },
];

// ── Heatmap Data (Day x Hour) ───────────────────────────────────────────────
export const emergencyHeatmap: HeatmapCell[] = (() => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const data: HeatmapCell[] = [];
  const seed = [
    [0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 5, 3, 6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 4, 3, 4, 5, 5, 3, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 6, 4, 7, 5, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 3, 5, 4, 6, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 3, 5, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  ];
  days.forEach((day, di) => {
    for (let hour = 0; hour < 24; hour++) {
      data.push({ day, hour, value: seed[di][hour] });
    }
  });
  return data;
})();

// ── Dashboard Stats ─────────────────────────────────────────────────────────
export const dashboardStats = {
  activeEmergencies: 3,
  avgResponseTime: 2.6,
  resolvedToday: 8,
  pendingReview: 2,
  totalStudents: 1247,
  incidentsThisMonth: 35,
};

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT MOBILE DATA
// ══════════════════════════════════════════════════════════════════════════════

// ── Student Profile (Emma Rodriguez — the logged-in student) ────────────────
export const studentProfile = {
  id: "STU-001",
  name: "Emma Rodriguez",
  initials: "ER",
  grade: "Grade 10",
  section: "Section A",
  studentId: "2026-10A-042",
  bloodType: "O+",
  allergies: ["Peanuts", "Penicillin"],
  medications: ["Albuterol Inhaler (as needed)", "Cetirizine 10mg (daily)"],
  conditions: ["Mild Asthma"],
  weight: "52 kg",
  height: "162 cm",
  dateOfBirth: "2011-03-15",
  guardian: {
    name: "Maria Rodriguez",
    relation: "Mother",
    phone: "+1 (555) 123-4567",
    email: "m.rodriguez@email.com",
  },
  secondaryGuardian: {
    name: "Carlos Rodriguez",
    relation: "Father",
    phone: "+1 (555) 123-8901",
    email: "c.rodriguez@email.com",
  },
};

// ── Student Notifications ───────────────────────────────────────────────────
export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "emergency" | "clinic" | "announcement" | "reminder";
  read: boolean;
}

export const studentNotifications: StudentNotification[] = [
  { id: "SN-001", title: "Emergency Resolved", message: "Your asthma incident on May 22 has been fully resolved. Follow-up with Dr. Rivera recommended.", timestamp: "2026-05-26T10:00:00Z", type: "emergency", read: false },
  { id: "SN-002", title: "Clinic Appointment", message: "Your follow-up checkup is scheduled for May 28 at 10:30 AM.", timestamp: "2026-05-26T08:30:00Z", type: "clinic", read: false },
  { id: "SN-003", title: "Health Screening Week", message: "Annual health screening starts next week. Please bring your health card.", timestamp: "2026-05-25T14:00:00Z", type: "announcement", read: true },
  { id: "SN-004", title: "Medication Reminder", message: "Don't forget to take your Cetirizine today. Stay healthy!", timestamp: "2026-05-25T07:00:00Z", type: "reminder", read: true },
  { id: "SN-005", title: "Clinic Update", message: "School clinic will have extended hours this Friday until 5:00 PM.", timestamp: "2026-05-24T12:00:00Z", type: "clinic", read: true },
  { id: "SN-006", title: "Allergy Season Alert", message: "High pollen count expected this week. Students with allergies should carry medication.", timestamp: "2026-05-24T09:00:00Z", type: "announcement", read: true },
  { id: "SN-007", title: "Emergency Drill", message: "Emergency response drill scheduled for Thursday at 2:00 PM.", timestamp: "2026-05-23T16:00:00Z", type: "announcement", read: true },
  { id: "SN-008", title: "Medication Reminder", message: "Time for your daily Cetirizine. Tap to mark as taken.", timestamp: "2026-05-23T07:00:00Z", type: "reminder", read: true },
];

// ── Emergency Contacts ──────────────────────────────────────────────────────
export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  initials: string;
  type: "guardian" | "school" | "hotline";
  available?: boolean;
}

export const emergencyContacts: EmergencyContact[] = [
  { id: "EC-001", name: "Maria Rodriguez", relation: "Mother", phone: "+1 (555) 123-4567", initials: "MR", type: "guardian" },
  { id: "EC-002", name: "Carlos Rodriguez", relation: "Father", phone: "+1 (555) 123-8901", initials: "CR", type: "guardian" },
  { id: "EC-003", name: "School Clinic", relation: "Health Office", phone: "+1 (555) 900-0001", initials: "SC", type: "school", available: true },
  { id: "EC-004", name: "Nurse Sarah Mitchell", relation: "School Nurse", phone: "+1 (555) 900-0002", initials: "SM", type: "school", available: true },
  { id: "EC-005", name: "Emergency Services", relation: "911", phone: "911", initials: "911", type: "hotline" },
  { id: "EC-006", name: "Poison Control", relation: "National Hotline", phone: "1-800-222-1222", initials: "PC", type: "hotline" },
  { id: "EC-007", name: "Crisis Text Line", relation: "Text HOME to 741741", phone: "741741", initials: "CT", type: "hotline" },
];

// ── Symptom Checker Data ────────────────────────────────────────────────────
export const symptomBodyAreas = [
  { id: "head", label: "Head & Neck", icon: "🧠", symptoms: ["Headache", "Dizziness", "Blurred vision", "Sore throat", "Neck stiffness"] },
  { id: "chest", label: "Chest", icon: "❤️", symptoms: ["Chest pain", "Shortness of breath", "Rapid heartbeat", "Cough", "Wheezing"] },
  { id: "stomach", label: "Stomach", icon: "🫃", symptoms: ["Nausea", "Stomach pain", "Vomiting", "Diarrhea", "Loss of appetite"] },
  { id: "skin", label: "Skin", icon: "🩹", symptoms: ["Rash", "Hives", "Itching", "Swelling", "Bruising"] },
  { id: "limbs", label: "Arms & Legs", icon: "💪", symptoms: ["Joint pain", "Muscle ache", "Swelling", "Numbness", "Weakness"] },
  { id: "general", label: "General", icon: "🌡️", symptoms: ["Fever", "Fatigue", "Chills", "Sweating", "Fainting"] },
  { id: "mental", label: "Mental / Emotional", icon: "🧘", symptoms: ["Anxiety", "Panic attack", "Difficulty breathing", "Trembling", "Rapid heartbeat"] },
];

export const severityLevels = [
  { id: 1, label: "Mild", description: "Noticeable but manageable", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
  { id: 2, label: "Moderate", description: "Uncomfortable, hard to focus", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { id: 3, label: "Severe", description: "Very painful or distressing", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { id: 4, label: "Emergency", description: "Need immediate help", color: "text-red-500", bgColor: "bg-red-500/10" },
];

// ── Live Emergency Tracking Data ────────────────────────────────────────────
export const liveEmergencyData = {
  id: "INC-1042",
  type: "Asthma Attack",
  status: "responding" as const,
  reportedAt: "9:42 AM",
  location: "Building C, Room 204",
  responder: {
    name: "Sarah Mitchell",
    role: "School Nurse",
    initials: "SM",
    eta: "2 min",
  },
  timeline: [
    { time: "9:42 AM", label: "Emergency reported", status: "complete" as const, description: "SOS triggered from your device" },
    { time: "9:43 AM", label: "Help is on the way", status: "complete" as const, description: "Nurse Sarah Mitchell acknowledged" },
    { time: "9:44 AM", label: "Responder en route", status: "active" as const, description: "ETA: 2 minutes to your location" },
    { time: "—", label: "Responder arrived", status: "pending" as const, description: "Medical assessment will begin" },
    { time: "—", label: "Incident resolved", status: "pending" as const, description: "You're safe and cared for" },
  ],
  guardianNotified: true,
};

// ── Clinic Availability ─────────────────────────────────────────────────────
export const clinicStatus = {
  isOpen: true,
  hours: "7:30 AM — 4:00 PM",
  nurseOnDuty: "Sarah Mitchell",
  waitTime: "~5 min",
  nextAvailable: null as string | null,
};

