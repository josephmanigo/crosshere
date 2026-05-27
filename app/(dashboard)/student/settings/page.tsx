"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Accessibility,
  Bell,
  MapPin,
  Volume2,
  Eye,
  Sparkles,
  Shield,
  LogOut,
  ChevronRight,
  Cross,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [autoLocation, setAutoLocation] = React.useState(true);
  const [soundAlerts, setSoundAlerts] = React.useState(true);
  const [largeText, setLargeText] = React.useState(false);
  const [showSignOut, setShowSignOut] = React.useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <Link href="/student" className="p-2 -ml-2 rounded-xl hover:bg-muted/50">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={staggerItem}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
          Appearance
        </h2>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
                    theme === option.value
                      ? "border-crosshere/40 bg-crosshere/5 dark:bg-crosshere/10 text-crosshere"
                      : "border-border/30 bg-muted/30 text-muted-foreground"
                  }`}
                  onClick={() => setTheme(option.value)}
                >
                  <option.icon className="size-5" />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Accessibility */}
      <motion.div variants={staggerItem}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
          Accessibility
        </h2>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-2">
                  <Sparkles className="size-4 text-purple-500" />
                </div>
                <div>
                  <Label htmlFor="reduced-motion" className="text-sm font-medium cursor-pointer">
                    Reduced Motion
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Minimize animations</p>
                </div>
              </div>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2">
                  <Eye className="size-4 text-blue-500" />
                </div>
                <div>
                  <Label htmlFor="large-text" className="text-sm font-medium cursor-pointer">
                    Larger Text
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Increase text size</p>
                </div>
              </div>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={setLargeText}
              />
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Emergency Preferences */}
      <motion.div variants={staggerItem}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
          Emergency Preferences
        </h2>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-2">
                  <MapPin className="size-4 text-emerald-500" />
                </div>
                <div>
                  <Label htmlFor="auto-location" className="text-sm font-medium cursor-pointer">
                    Auto Location
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Share location during emergencies</p>
                </div>
              </div>
              <Switch
                id="auto-location"
                checked={autoLocation}
                onCheckedChange={setAutoLocation}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/10 p-2">
                  <Volume2 className="size-4 text-amber-500" />
                </div>
                <div>
                  <Label htmlFor="sound-alerts" className="text-sm font-medium cursor-pointer">
                    Sound Alerts
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Play sounds for emergency updates</p>
                </div>
              </div>
              <Switch
                id="sound-alerts"
                checked={soundAlerts}
                onCheckedChange={setSoundAlerts}
              />
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* About */}
      <motion.div variants={staggerItem}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
          About
        </h2>
        <GlassCard size="sm" intensity="subtle">
          <GlassCardContent>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-crosshere flex items-center justify-center">
                <Cross className="size-5 text-crosshere-foreground" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">CROSSHERE</p>
                <p className="text-xs text-muted-foreground">Version 1.0.0 • Student App</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Sign Out */}
      <motion.div variants={staggerItem} className="pt-2">
        <Button
          variant="ghost"
          className="w-full h-12 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
          onClick={() => setShowSignOut(true)}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </motion.div>

      {/* Sign Out Confirmation */}
      <AlertDialog open={showSignOut} onOpenChange={setShowSignOut}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of CROSSHERE?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again to access your health information and emergency features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
