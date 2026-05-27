"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { adminInvitations } from "@/lib/mock-data";
import { 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Send,
  Trash2,
  RefreshCw,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const roleConfig = {
  student: { label: "Student", className: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  parent: { label: "Parent", className: "bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  clinic: { label: "Clinic Staff", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  admin: { label: "System Admin", className: "bg-crosshere/15 text-crosshere dark:text-crosshere" },
};

export default function InvitationsPage() {
  const [activeTab, setActiveTab] = React.useState("pending");
  const [isBulkInviteOpen, setIsBulkInviteOpen] = React.useState(false);

  const filteredInvites = adminInvitations.filter(inv => inv.status === activeTab);

  const stats = [
    { label: "Total Sent", value: adminInvitations.length, icon: Send, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending", value: adminInvitations.filter(i => i.status === "pending").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Accepted", value: adminInvitations.filter(i => i.status === "accepted").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Expired", value: adminInvitations.filter(i => i.status === "expired").length, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

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
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Invitations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user invitations and monitor onboarding status.
          </p>
        </div>
        <Button onClick={() => setIsBulkInviteOpen(true)} className="bg-crosshere hover:bg-crosshere-crimson text-white">
          <Plus className="mr-2 size-4" />
          Bulk Invite
        </Button>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} intensity="subtle">
            <GlassCardContent>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("size-4", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight leading-none">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent>
            <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-4 border-b border-border/50 bg-muted/20">
                <div className="w-full overflow-x-auto">
                  <TabsList className="bg-background/50 w-full min-w-max h-auto p-1 flex">
                    <TabsTrigger value="pending" className="text-xs shrink-0 flex-1">Pending</TabsTrigger>
                    <TabsTrigger value="accepted" className="text-xs shrink-0 flex-1">Accepted</TabsTrigger>
                    <TabsTrigger value="expired" className="text-xs shrink-0 flex-1">Expired</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead>Email Address</TableHead>
                      <TableHead>Target Role</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Expires / Accepted</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          No {activeTab} invitations found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvites.map((invite) => (
                        <TableRow key={invite.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Mail className="size-4 text-muted-foreground" />
                              {invite.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={cn("text-[10px] uppercase font-semibold border-transparent", roleConfig[invite.role as keyof typeof roleConfig].className)}>
                              {roleConfig[invite.role as keyof typeof roleConfig].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(invite.sentAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {invite.status === "accepted" ? (
                              <span className="text-emerald-500 font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="size-3.5" /> Accepted
                              </span>
                            ) : invite.status === "expired" ? (
                              <span className="text-red-500 font-medium flex items-center gap-1.5">
                                <XCircle className="size-3.5" /> Expired
                              </span>
                            ) : (
                              new Date(invite.expiresAt).toLocaleDateString()
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                                  <MoreVertical className="size-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                {(invite.status === "pending" || invite.status === "expired") && (
                                  <DropdownMenuItem>
                                    <RefreshCw className="mr-2 size-4 text-muted-foreground" />
                                    Resend Invite
                                  </DropdownMenuItem>
                                )}
                                {invite.status === "pending" && (
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-500/10">
                                    <Trash2 className="mr-2 size-4" />
                                    Revoke
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Bulk Invite Dialog */}
      <Dialog open={isBulkInviteOpen} onOpenChange={setIsBulkInviteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Invite Users</DialogTitle>
            <DialogDescription>
              Invite multiple users at once by entering their email addresses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Assign Role</Label>
              <Select defaultValue="student">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="clinic">Clinic Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emails">Email Addresses (comma separated or one per line)</Label>
              <Textarea 
                id="emails" 
                placeholder="student1@school.edu&#10;student2@school.edu"
                className="h-32 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkInviteOpen(false)}>Cancel</Button>
            <Button className="bg-crosshere hover:bg-crosshere-crimson text-white">Send Invitations</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
