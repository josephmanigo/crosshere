"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ShieldAlert,
  HeartPulse,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Home", href: "/student", icon: Home },
  { label: "Emergency", href: "/student/emergency", icon: ShieldAlert },
  { label: "Health", href: "/student/health", icon: HeartPulse },
  { label: "Alerts", href: "/student/notifications", icon: Bell },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const active =
            item.href === "/student"
              ? pathname === "/student"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-colors min-w-[60px]",
                active
                  ? "text-crosshere"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <item.icon
                  className="size-[22px]"
                  strokeWidth={active ? 2.2 : 1.5}
                />
              </motion.div>
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
              {active && (
                <motion.span
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-crosshere"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
