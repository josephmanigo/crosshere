"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Palette, Eye, BellRing, User, Accessibility } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [glassIntensity, setGlassIntensity] = React.useState([50]);
  const [selectedAccent, setSelectedAccent] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [fontSize, setFontSize] = React.useState("default");

  React.useEffect(() => { setMounted(true); }, []);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pt-2">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your CROSSHERE experience</p>
      </motion.div>

      <motion.div variants={staggerItem}>
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appearance"><Palette className="size-4 mr-1.5" /> Appearance</TabsTrigger>
            <TabsTrigger value="accessibility"><Accessibility className="size-4 mr-1.5" /> Accessibility</TabsTrigger>
            <TabsTrigger value="notifications"><BellRing className="size-4 mr-1.5" /> Notifications</TabsTrigger>
            <TabsTrigger value="profile"><User className="size-4 mr-1.5" /> Profile</TabsTrigger>
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
                          "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                          mounted && theme === t.value
                            ? "border-crosshere bg-crosshere/5 text-crosshere"
                            : "border-border hover:bg-muted/50 text-muted-foreground"
                        )}
                      >
                        <t.icon className="size-5" />
                        <span className="text-xs font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

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

                <Separator />

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

          {/* Accessibility */}
          <TabsContent value="accessibility" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">Reduced Motion</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Minimize animations and transitions</p>
                  </div>
                  <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">Font Size</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Adjust text size across the app</p>
                  </div>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="xl">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">High Contrast</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Increase contrast for better visibility</p>
                  </div>
                  <Switch />
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent className="space-y-5">
                {[
                  { label: "Emergency Alerts", desc: "Receive real-time emergency notifications", default: true },
                  { label: "Email Notifications", desc: "Daily summary and important updates", default: true },
                  { label: "SMS Notifications", desc: "Critical alerts via text message", default: true },
                  { label: "Push Notifications", desc: "Browser push notifications", default: false },
                  { label: "System Updates", desc: "Platform maintenance and feature updates", default: false },
                ].map((pref, i) => (
                  <React.Fragment key={pref.label}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold">{pref.label}</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
                      </div>
                      <Switch defaultChecked={pref.default} />
                    </div>
                    {i < 4 && <Separator />}
                  </React.Fragment>
                ))}
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <GlassCard intensity="subtle">
              <GlassCardContent className="space-y-5">
                <div className="flex items-center gap-4 mb-2">
                  <div className="size-16 rounded-2xl bg-crosshere/10 flex items-center justify-center text-crosshere text-xl font-semibold">
                    SM
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Sarah Mitchell</p>
                    <p className="text-sm text-muted-foreground">School Nurse • Admin</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="Sarah" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Mitchell" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="nurse@crosshere.edu" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button className="bg-crosshere hover:bg-crosshere/90 text-white">Save Changes</Button>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
