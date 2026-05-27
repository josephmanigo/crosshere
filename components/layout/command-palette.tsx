"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Bell,
  Settings,
  Search,
  FileText,
  User,
  Shield,
  Mail,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const clinicPages = [
  { label: "Dashboard", href: "/clinic", icon: LayoutDashboard },
  { label: "Students", href: "/clinic/students", icon: Users },
  { label: "Incidents", href: "/clinic/incidents", icon: Activity },
  { label: "Reports", href: "/clinic/reports", icon: FileText },
  { label: "Notifications", href: "/clinic/notifications", icon: Bell },
  { label: "Settings", href: "/clinic/settings", icon: Settings },
];

const adminPages = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Invitations", href: "/admin/invitations", icon: Mail },
  { label: "Audit Logs", href: "/admin/audit", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const recentStudents = [
  { label: "Emma Rodriguez", href: "/clinic/students?id=STU-001", detail: "Grade 10 • Active Emergency" },
  { label: "Noah Williams", href: "/clinic/students?id=STU-004", detail: "Grade 12 • Seizure Episode" },
  { label: "Sophia Patel", href: "/clinic/students?id=STU-003", detail: "Grade 9 • Allergic Reaction" },
];

const recentIncidents = [
  { label: "INC-1042 — Asthma Attack", href: "/clinic/incidents/INC-1042", detail: "Critical • Responding" },
  { label: "INC-1041 — Seizure", href: "/clinic/incidents/INC-1041", detail: "Critical • Responding" },
  { label: "INC-1040 — Allergic Reaction", href: "/clinic/incidents/INC-1040", detail: "High • Acknowledged" },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const pages = isAdmin ? adminPages : clinicPages;

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
      <CommandInput placeholder={isAdmin ? "Search pages, users, logs..." : "Search pages, students, incidents..."} />
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

        {!isAdmin && (
          <>
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
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
