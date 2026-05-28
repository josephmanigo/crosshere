"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { adminUserStatusConfig, type AdminUserStatus } from "@/lib/constants";
import { 
  Users, 
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Mail,
  UserX,
  UserCheck,
  Key,
  Plus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getUsers, updateUser, deactivateUser, sendInvitation } from "@/lib/actions/admin";
import { toast } from "sonner";

const roleConfig = {
  student: { label: "Student", className: "bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  parent: { label: "Parent", className: "bg-purple-500/15 text-purple-700 dark:text-purple-400" },
  clinic: { label: "Clinic Staff", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  admin: { label: "System Admin", className: "bg-crosshere/15 text-crosshere dark:text-crosshere" },
};

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [loading, setLoading] = React.useState(true);

  // Invitation Form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [inviteName, setInviteName] = React.useState("");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("student");
  const [inviting, setInviting] = React.useState(false);

  // Edit User Form
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);
  const [editRole, setEditRole] = React.useState("student");
  const [editName, setEditName] = React.useState("");
  const [savingEdit, setSavingEdit] = React.useState(false);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load users
  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(debouncedSearch, activeTab);
      setUsers(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTab]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Send Invitation
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRole) {
      toast.error("Please fill in all fields");
      return;
    }
    setInviting(true);
    try {
      await sendInvitation(inviteEmail, inviteRole);
      toast.success(`Invitation successfully sent to ${inviteEmail}!`);
      setIsCreateDialogOpen(false);
      setInviteEmail("");
      setInviteName("");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  // Edit User Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      await updateUser(editingUser.id, {
        role: editRole,
        full_name: editName
      });
      toast.success("User updated successfully!");
      setIsEditDialogOpen(false);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setSavingEdit(false);
    }
  };

  // Deactivate User Action
  const handleToggleActive = async (user: any) => {
    const actionText = user.is_active ? "deactivate" : "reactivate";
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      toast.success(`User successfully ${user.is_active ? "deactivated" : "reactivated"}!`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${actionText} user`);
    }
  };

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
          <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage students, parents, clinic staff, and administrators.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-crosshere hover:bg-crosshere/90 text-white">
          <Plus className="mr-2 size-4" />
          Add User
        </Button>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col xl:flex-row items-center justify-between p-4 border-b border-border/50 gap-4">
                <div className="w-full xl:flex-1 overflow-x-auto">
                  <TabsList className="bg-muted/50 w-full min-w-max h-auto p-1 flex">
                    <TabsTrigger value="all" className="text-xs shrink-0 flex-1">All Users</TabsTrigger>
                    <TabsTrigger value="student" className="text-xs shrink-0 flex-1">Students</TabsTrigger>
                    <TabsTrigger value="parent" className="text-xs shrink-0 flex-1">Parents</TabsTrigger>
                    <TabsTrigger value="clinic" className="text-xs shrink-0 flex-1">Clinic Staff</TabsTrigger>
                    <TabsTrigger value="admin" className="text-xs shrink-0 flex-1">Admins</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="flex items-center w-full xl:w-auto gap-2 shrink-0">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9 rounded-full bg-muted/50 border-transparent h-9 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 border-border/50" onClick={loadUsers}>
                    <Filter className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-6 animate-spin text-crosshere" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-border/50">
                        <TableHead className="w-[250px]">User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                        <TableHead className="text-right align-middle pr-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            No users found matching your criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => {
                          const initials = (user.full_name ?? "U")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <TableRow key={user.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="size-9 border border-border/50">
                                    <AvatarFallback className="bg-muted text-xs font-medium">
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium leading-none mb-1">{user.full_name ?? "—"}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className={cn("text-[10px] uppercase font-semibold border-transparent", roleConfig[user.role as keyof typeof roleConfig]?.className)}>
                                  {roleConfig[user.role as keyof typeof roleConfig]?.label ?? user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={cn("size-2 rounded-full", user.is_active ? "bg-emerald-500" : "bg-gray-500")} />
                                  <span className={cn("text-xs font-medium", user.is_active ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500")}>
                                    {user.is_active ? "Active" : "Inactive"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right pr-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                                      <MoreVertical className="size-4 text-muted-foreground" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => {
                                      setEditingUser(user);
                                      setEditName(user.full_name ?? "");
                                      setEditRole(user.role);
                                      setIsEditDialogOpen(true);
                                    }}>
                                      <Edit2 className="mr-2 size-4 text-muted-foreground" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleToggleActive(user)}
                                      className={cn(
                                        user.is_active 
                                          ? "text-orange-600 dark:text-orange-400 focus:text-orange-600 focus:bg-orange-500/10" 
                                          : "text-emerald-600 dark:text-emerald-400 focus:text-emerald-600 focus:bg-emerald-500/10"
                                      )}
                                    >
                                      {user.is_active ? (
                                        <>
                                          <UserX className="mr-2 size-4" />
                                          Deactivate User
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="mr-2 size-4" />
                                          Reactivate User
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
              
              <div className="p-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>Showing {users.length} users</span>
              </div>
            </Tabs>
          </GlassCardContent>
        </GlassCard>
      </motion.div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleInviteSubmit}>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account and send an invitation email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name (optional)</Label>
                <Input id="name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="john@school.edu" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="clinic">Clinic Staff</SelectItem>
                    <SelectItem value="admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={inviting} className="bg-crosshere hover:bg-crosshere/90 text-white">
                {inviting ? "Inviting..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit User Profile</DialogTitle>
              <DialogDescription>
                Update role and info for {editingUser?.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editRole">Role</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="clinic">Clinic Staff</SelectItem>
                    <SelectItem value="admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={savingEdit} className="bg-crosshere hover:bg-crosshere/90 text-white">
                {savingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
