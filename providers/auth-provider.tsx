"use client";

import * as React from "react";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  // Prevent hydration mismatch by not rendering anything until mounted
  // Also wait for auth store to initialize
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-crosshere" />
      </div>
    );
  }

  return <>{children}</>;
}
