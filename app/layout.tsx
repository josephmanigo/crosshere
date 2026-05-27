import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CROSSHERE — Healthcare Emergency Platform",
    template: "%s | CROSSHERE",
  },
  description:
    "Real-time healthcare emergency management ecosystem for schools and institutions. Monitor, respond, and resolve medical emergencies with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased", inter.variable, geistMono.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <MotionProvider>
            <AuthProvider>
              <TooltipProvider delayDuration={300}>
                {children}
              </TooltipProvider>
            </AuthProvider>
          </MotionProvider>
        </ThemeProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
