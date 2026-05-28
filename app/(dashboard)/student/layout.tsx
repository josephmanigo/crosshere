import type { Metadata } from "next";
import { MobileNav } from "@/components/layout/student-nav";

export const metadata: Metadata = {
  title: {
    default: "CROSSHERE Student",
    template: "%s | CROSSHERE Student",
  },
  description:
    "Your personal emergency companion. Stay safe, stay connected with CROSSHERE.",
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20 bg-transparent">
      <main className="px-4 pt-[env(safe-area-inset-top)] pb-4 max-w-md mx-auto">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
