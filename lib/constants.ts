import {
  LayoutDashboard,
  Activity,
  Users,
  Bell,
  Settings,
  Stethoscope,
  BarChart3,
  FileText,
  UploadCloud,
  Mail,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

// ── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/clinic", icon: LayoutDashboard },
  { label: "Incidents", href: "/clinic/incidents", icon: Activity },
  { label: "Students", href: "/clinic/students", icon: Users },
  { label: "Analytics", href: "/clinic/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/clinic/notifications", icon: Bell },
  { label: "Symptom Checker", href: "/clinic/symptom-checker", icon: Stethoscope },
  { label: "Reports", href: "/clinic/reports", icon: FileText },
  { label: "Settings", href: "/clinic/settings", icon: Settings },
];

// ── Status Colors ───────────────────────────────────────────────────────────
export const severityConfig = {
  critical: {
    label: "Critical",
    className: "bg-red-500/15 text-red-700 border-red-500/25 dark:text-red-400 dark:bg-red-500/20 dark:border-red-500/30",
    dotColor: "bg-red-500",
  },
  high: {
    label: "High",
    className: "bg-orange-500/15 text-orange-700 border-orange-500/25 dark:text-orange-400 dark:bg-orange-500/20 dark:border-orange-500/30",
    dotColor: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-400 dark:bg-amber-500/20 dark:border-amber-500/30",
    dotColor: "bg-amber-500",
  },
  low: {
    label: "Low",
    className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500/30",
    dotColor: "bg-emerald-500",
  },
} as const;

export const incidentStatusConfig = {
  reported: {
    label: "Reported",
    className: "bg-red-500/15 text-red-700 dark:text-red-400",
  },
  acknowledged: {
    label: "Acknowledged",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  responding: {
    label: "Responding",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
} as const;

export type Severity = keyof typeof severityConfig;
export type IncidentStatus = keyof typeof incidentStatusConfig;

// ── Symptom Categories ──────────────────────────────────────────────────────
export const symptomCategories = [
  { id: "head", label: "Head & Neurological", icon: "🧠" },
  { id: "respiratory", label: "Respiratory", icon: "🫁" },
  { id: "cardiac", label: "Cardiac & Chest", icon: "❤️" },
  { id: "abdominal", label: "Abdominal", icon: "🫃" },
  { id: "musculoskeletal", label: "Musculoskeletal", icon: "🦴" },
  { id: "skin", label: "Skin & Allergic", icon: "🩹" },
  { id: "mental", label: "Mental Health", icon: "🧘" },
  { id: "other", label: "Other / General", icon: "📋" },
] as const;

// ── Emergency Types ─────────────────────────────────────────────────────────
export const emergencyTypes = [
  "Breathing Difficulty",
  "Chest Pain",
  "Allergic Reaction",
  "Seizure",
  "Head Injury",
  "Fracture / Sprain",
  "Fainting / Unconscious",
  "Severe Bleeding",
  "Anxiety / Panic Attack",
  "Fever / Infection",
  "Asthma Attack",
  "Other",
] as const;

// ── Student Mobile Navigation ───────────────────────────────────────────
export const studentNavItems: NavItem[] = [
  { label: "Home", href: "/student", icon: LayoutDashboard },
  { label: "Emergency", href: "/student/emergency", icon: Activity },
  { label: "Health", href: "/student/health", icon: Stethoscope },
  { label: "Alerts", href: "/student/notifications", icon: Bell },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

// ── Emergency Type Config (Student Flow) ────────────────────────────────
export interface EmergencyTypeItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const emergencyTypeItems: EmergencyTypeItem[] = [
  { id: "asthma", label: "Asthma Attack", icon: "🫁", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-500/10" },
  { id: "fainting", label: "Fainting", icon: "😵", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-500/10" },
  { id: "injury", label: "Injury", icon: "🩹", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-500/10" },
  { id: "chest-pain", label: "Chest Pain", icon: "❤️‍🩹", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-500/10" },
  { id: "allergic", label: "Allergic Reaction", icon: "🤧", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-500/10" },
  { id: "seizure", label: "Seizure", icon: "⚡", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-500/10" },
  { id: "bleeding", label: "Severe Bleeding", icon: "🩸", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-500/10" },
  { id: "anxiety", label: "Panic / Anxiety", icon: "💭", color: "text-teal-600 dark:text-teal-400", bgColor: "bg-teal-500/10" },
  { id: "other", label: "Other", icon: "🆘", color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-500/10" },
];

// ── Symptom Checker Steps ───────────────────────────────────────────────
export const symptomFlowSteps = [
  { id: 1, title: "What's bothering you?", description: "Select the area where you feel discomfort" },
  { id: 2, title: "Describe your symptoms", description: "Select all symptoms that apply" },
  { id: 3, title: "How severe is it?", description: "Help us understand the intensity" },
  { id: 4, title: "Assessment", description: "Based on your responses" },
] as const;

// ── Notification Types ──────────────────────────────────────────────────
export const notificationTypes = {
  emergency: { label: "Emergency", color: "text-red-500", bgColor: "bg-red-500/10" },
  clinic: { label: "Clinic", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  announcement: { label: "Announcement", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  reminder: { label: "Reminder", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
} as const;

// ── Admin Navigation ──────────────────────────────────────────────────────────
export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Bulk Import", href: "/admin/import", icon: UploadCloud },
  { label: "Invitations", href: "/admin/invitations", icon: Mail },
  { label: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const adminUserStatusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
  },
} as const;

export type AdminUserStatus = keyof typeof adminUserStatusConfig;
