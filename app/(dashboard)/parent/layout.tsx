import { Cross } from "lucide-react";
import Link from "next/link";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
          <Link href="/parent" className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-crosshere flex items-center justify-center">
              <Cross className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-tight">CROSSHERE</span>
            <span className="text-xs text-muted-foreground ml-1">Parent Portal</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
