"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Activity,
  Users,
  BarChart3,
  Bell,
  Settings,
  Stethoscope,
  Search,
  FileText,
  User,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const pages = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Students", href: "/students", icon: Users },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Symptom Checker", href: "/symptom-checker", icon: Stethoscope },
  { label: "Settings", href: "/settings", icon: Settings },
];

const recentStudents = [
  { label: "Emma Rodriguez", href: "/students?id=STU-001", detail: "Grade 10 • Active Emergency" },
  { label: "Noah Williams", href: "/students?id=STU-004", detail: "Grade 12 • Seizure Episode" },
  { label: "Sophia Patel", href: "/students?id=STU-003", detail: "Grade 9 • Allergic Reaction" },
];

const recentIncidents = [
  { label: "INC-1042 — Asthma Attack", href: "/incidents/INC-1042", detail: "Critical • Responding" },
  { label: "INC-1041 — Seizure", href: "/incidents/INC-1041", detail: "Critical • Responding" },
  { label: "INC-1040 — Allergic Reaction", href: "/incidents/INC-1040", detail: "High • Acknowledged" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const navigate = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, students, incidents..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center py-6 text-muted-foreground">
            <Search className="size-8 mb-2 opacity-50" />
            <p className="text-sm">No results found.</p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem key={page.href} onSelect={() => navigate(page.href)}>
              <page.icon className="size-4 text-muted-foreground" />
              <span>{page.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Students">
          {recentStudents.map((student) => (
            <CommandItem key={student.href} onSelect={() => navigate(student.href)}>
              <User className="size-4 text-muted-foreground" />
              <span>{student.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{student.detail}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Incidents">
          {recentIncidents.map((incident) => (
            <CommandItem key={incident.href} onSelect={() => navigate(incident.href)}>
              <Activity className="size-4 text-muted-foreground" />
              <span>{incident.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{incident.detail}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
