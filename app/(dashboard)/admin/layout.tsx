"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Users, Activity, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for Admin */}
      <div className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col">
        <div className="h-14 border-b border-border flex items-center px-4">
          <span className="font-bold text-lg tracking-tight">CROSSHERE <span className="text-crosshere">Admin</span></span>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1 px-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-muted text-foreground">
            <Activity className="size-4" /> Overview
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-muted text-muted-foreground">
            <Users className="size-4" /> User Management
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-muted text-muted-foreground">
            <FileText className="size-4" /> System Reports
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-muted text-muted-foreground">
            <Settings className="size-4" /> Configuration
          </Link>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 rounded-full bg-crosshere/10 text-crosshere flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">Administrator</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center px-6 bg-card/30 backdrop-blur-sm sticky top-0 z-30">
          <h1 className="text-sm font-medium">Enterprise Management Console</h1>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
