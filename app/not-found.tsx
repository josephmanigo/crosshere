import Link from "next/link";
import { Cross, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mx-auto size-14 rounded-2xl bg-crosshere/10 flex items-center justify-center mb-8">
          <Cross className="size-7 text-crosshere" strokeWidth={2} />
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-bold tracking-tighter text-foreground/10 mb-2">404</h1>
        <h2 className="text-xl font-semibold tracking-tight mb-2">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-8 text-balance">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-crosshere hover:bg-crosshere/90 text-white w-full sm:w-auto">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
