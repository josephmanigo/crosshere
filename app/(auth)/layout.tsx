import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Cross } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-crosshere">
        {/* Ambient pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.65_0.2_25_/_30%)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.4_0.15_15_/_40%)_0%,_transparent_60%)]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between px-12 py-8 text-white w-full h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Cross className="size-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight">CROSSHERE</span>
          </div>

          {/* Hero Content */}
          <div className="max-w-lg mb-16">
            <h1 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight mb-4">
              Every second counts in an emergency
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Real-time healthcare emergency management for schools. Monitor, respond, and resolve
              medical emergencies with speed and precision.
            </p>
          </div>

          {/* Footer */}
          <p className="text-sm text-white/40">
            © 2026 CROSSHERE. Developed by Quan Technologies.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative">
        <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 lg:top-8 lg:right-12 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="size-9 rounded-xl bg-crosshere flex items-center justify-center">
              <Cross className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold tracking-tight">CROSSHERE</span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
