"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { 
  Building2, 
  Bell, 
  ShieldAlert, 
  Lock, 
  Palette,
  AlertTriangle,
  UploadCloud,
  Sun,
  Moon,
  Monitor,
  User,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { updateUser } from "@/lib/actions/admin";
import { toast } from "sonner";

const accentColors = [
  { name: "CROSSHERE Red", value: "#DC2626", oklch: "oklch(0.55 0.22 25)" },
  { name: "Crimson", value: "#BE123C", oklch: "oklch(0.5 0.2 15)" },
  { name: "Rose", value: "#E11D48", oklch: "oklch(0.55 0.22 0)" },
  { name: "Coral", value: "#EA580C", oklch: "oklch(0.6 0.2 40)" },
  { name: "Amber", value: "#D97706", oklch: "oklch(0.65 0.18 70)" },
  { name: "Blue", value: "#2563EB", oklch: "oklch(0.5 0.2 260)" },
  { name: "Violet", value: "#7C3AED", oklch: "oklch(0.5 0.22 290)" },
  { name: "Emerald", value: "#059669", oklch: "oklch(0.55 0.16 160)" },
];

export default function SystemSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [glassIntensity, setGlassIntensity] = React.useState([50]);
  const [selectedAccent, setSelectedAccent] = React.useState(0);

  // Profile Form state
  const authProfile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const [fullName, setFullName] = React.useState("");
  const [savingProfile, setSavingProfile] = React.useState(false);

  React.useEffect(() => { 
    setMounted(true); 
    if (authProfile?.full_name) {
      setFullName(authProfile.full_name);
    }
  }, [authProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !fullName) return;
    setSavingProfile(true);
    try {
      await updateUser(user.id, { full_name: fullName });
      toast.success("Profile updated successfully!");
      // Reload page to refresh store or wait for next navigation
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile changes");
    } finally {
      setSavingProfile(false);
    }
  };

  const initials = (authProfile?.full_name ?? "A")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure platform preferences, notifications, and security policies.
          </p>
        </div>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden h-auto p-1">
            <TabsTrigger value="appearance" className="shrink-0"><Palette className="size-4 mr-1.5" /> Appearance</TabsTrigger>
            <TabsTrigger value="organization" className="shrink-0"><Building2 className="size-4 mr-1.5" /> Organization</TabsTrigger>
            <TabsTrigger value="notifications" className="shrink-0"><Bell className="size-4 mr-1.5" /> Notifications</TabsTrigger>
            <TabsTrigger value="security" className="shrink-0"><ShieldAlert className="size-4 mr-1.5" /> Security & Access</TabsTrigger>
            <TabsTrigger value="profile" className="shrink-0"><User className="size-4 mr-1.5" /> Profile</TabsTrigger>
          </TabsList>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Theme</h3>
                  <p className="text-xs text-muted-foreground mb-4">Choose your preferred appearance</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: Monitor },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium",
                          mounted && theme === t.value
                            ? "border-crosshere bg-crosshere/5 text-crosshere"
                            : "border-border/50 bg-background/50 hover:bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <t.icon className="size-5" />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/50" />

                <div>
                  <h3 className="text-sm font-semibold mb-1">Accent Color</h3>
                  <p className="text-xs text-muted-foreground mb-4">Personalize your brand accent</p>
                  <div className="flex flex-wrap gap-3">
                    {accentColors.map((color, i) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedAccent(i)}
                        className={cn(
                          "size-10 rounded-full border-2 transition-all",
                          selectedAccent === i
                            ? "border-foreground scale-110 shadow-lg"
                            : "border-transparent hover:scale-105"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {accentColors[selectedAccent].name}
                  </p>
                </div>

                <Separator className="bg-border/50" />

                <div>
                  <h3 className="text-sm font-semibold mb-1">Glass Intensity</h3>
                  <p className="text-xs text-muted-foreground mb-4">Adjust the frosted glass effect</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-12">Subtle</span>
                    <Slider
                      value={glassIntensity}
                      onValueChange={setGlassIntensity}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-12 text-right">Strong</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {glassIntensity[0]}%
                  </p>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Organization Info */}
          <TabsContent value="organization" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="size-5 text-crosshere" />
                  <h2 className="text-lg font-semibold tracking-tight">Organization Information</h2>
                </div>
                <Separator className="bg-border/50 mb-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue="Greenwood High School" className="rounded-full bg-muted/50 border-transparent" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Primary Contact Email</Label>
                    <Input id="org-email" type="email" defaultValue="admin@greenwood.edu" className="rounded-full bg-muted/50 border-transparent" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Organization Logo</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="size-16 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                        <span className="text-xl font-bold text-muted-foreground">GW</span>
                      </div>
                      <Button variant="outline" size="sm" className="bg-background/50" onClick={() => toast.success("Feature coming soon!")}>
                        <UploadCloud className="mr-2 size-4" /> Upload New Logo
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
            
            {/* Danger Zone */}
            <GlassCard intensity="subtle" className="border-red-500/20 bg-red-500/5 mt-6">
              <GlassCardContent>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="size-5 text-red-500" />
                  <h2 className="text-lg font-semibold tracking-tight text-red-600 dark:text-red-400">Danger Zone</h2>
                </div>
                <Separator className="bg-red-500/10 mb-6" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Reset All Settings</h3>
                    <p className="text-sm text-muted-foreground">Restore all configuration back to factory defaults.</p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Factory Reset</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently reset all system configurations, notification preferences, and security policies to their default state.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => toast.success("Reset system settings back to default!")}>
                          Yes, reset everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="size-5 text-blue-500" />
                  <h2 className="text-lg font-semibold tracking-tight">System Notifications</h2>
                </div>
                <Separator className="bg-border/50 mb-6" />
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Daily Summary Emails</h3>
                      <p className="text-sm text-muted-foreground">Send a daily summary of incidents and system health.</p>
                    </div>
                    <Switch defaultChecked onCheckedChange={(val) => toast.success(`Daily summary emails ${val ? "enabled" : "disabled"}`)} />
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Critical Incident SMS Alerts</h3>
                      <p className="text-sm text-muted-foreground">Immediately notify system admins via SMS for critical incidents.</p>
                    </div>
                    <Switch defaultChecked onCheckedChange={(val) => toast.success(`Critical SMS alerts ${val ? "enabled" : "disabled"}`)} />
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">New User Registration</h3>
                      <p className="text-sm text-muted-foreground">Receive a notification when a new user joins the platform.</p>
                    </div>
                    <Switch onCheckedChange={(val) => toast.success(`Registration notifications ${val ? "enabled" : "disabled"}`)} />
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Security & Access */}
          <TabsContent value="security" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="size-5 text-emerald-500" />
                  <h2 className="text-lg font-semibold tracking-tight">Security & Access</h2>
                </div>
                <Separator className="bg-border/50 mb-6" />
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Require Two-Factor Authentication (2FA)</h3>
                      <p className="text-sm text-muted-foreground">Force all admin and clinic staff to use 2FA.</p>
                    </div>
                    <Switch defaultChecked onCheckedChange={(val) => toast.success(`Force 2FA requirement ${val ? "enabled" : "disabled"}`)} />
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Session Timeout</Label>
                      <Select defaultValue="30" onValueChange={(val) => toast.success(`Session timeout updated to ${val} minutes`)}>
                        <SelectTrigger className="rounded-full bg-muted/50 border-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Minutes</SelectItem>
                          <SelectItem value="30">30 Minutes</SelectItem>
                          <SelectItem value="60">1 Hour</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Password Expiry</Label>
                      <Select defaultValue="90" onValueChange={(val) => toast.success(`Password expiry updated to ${val} days`)}>
                        <SelectTrigger className="rounded-full bg-muted/50 border-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">Every 30 Days</SelectItem>
                          <SelectItem value="90">Every 90 Days</SelectItem>
                          <SelectItem value="180">Every 180 Days</SelectItem>
                          <SelectItem value="never">Never expire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Emergency Escalation */}
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert className="size-5 text-red-500" />
                  <h2 className="text-lg font-semibold tracking-tight">Emergency Escalation Policy</h2>
                </div>
                <Separator className="bg-border/50 mb-6" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Auto-escalation Timer</Label>
                    <p className="text-xs text-muted-foreground mb-2">Time before unacknowledged incidents escalate.</p>
                    <Select defaultValue="5" onValueChange={(val) => toast.success(`Escalation timer updated to ${val} minutes`)}>
                      <SelectTrigger className="rounded-full bg-muted/50 border-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Minutes</SelectItem>
                        <SelectItem value="5">5 Minutes</SelectItem>
                        <SelectItem value="10">10 Minutes</SelectItem>
                        <SelectItem value="15">15 Minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Default Fallback Contact</Label>
                    <p className="text-xs text-muted-foreground mb-2">Role notified when primary responder is unavailable.</p>
                    <Select defaultValue="admin" onValueChange={(val) => toast.success(`Fallback contact role set to: ${val}`)}>
                      <SelectTrigger className="rounded-full bg-muted/50 border-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">System Administrator</SelectItem>
                        <SelectItem value="principal">School Principal</SelectItem>
                        <SelectItem value="clinic_head">Head of Clinic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="size-16 rounded-2xl bg-crosshere/10 flex items-center justify-center text-crosshere text-xl font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{authProfile?.full_name ?? "User"}</p>
                      <p className="text-sm text-muted-foreground capitalize">{authProfile?.role ?? "User"} Account</p>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profile-fullname">Full Name</Label>
                      <Input 
                        id="profile-fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="rounded-full bg-muted/50 border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email Address (Read-only)</Label>
                      <Input 
                        id="profile-email"
                        value={authProfile?.email || ""}
                        disabled
                        className="rounded-full bg-muted/20 border-transparent cursor-not-allowed opacity-75"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={savingProfile} className="bg-crosshere hover:bg-crosshere/90 text-white">
                      {savingProfile ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Profile"}
                    </Button>
                  </div>
                </form>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

        </Tabs>
      </motion.div>
    </motion.div>
  );
}
