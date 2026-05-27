"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { mockStudents } from "@/lib/mock-data";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/mock-data";

function StudentDrawer({ student }: { student: Student }) {
  return (
    <SheetContent className="w-[400px] sm:w-[480px] p-0">
      <ScrollArea className="h-full">
        <div className="p-6">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="bg-crosshere/10 text-crosshere text-xl font-semibold">
                  {student.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-lg">{student.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{student.id} • {student.grade}</p>
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="profile">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="medical" className="flex-1">Medical</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Grade</p>
                  <p className="text-sm font-medium">{student.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Section</p>
                  <p className="text-sm font-medium">{student.section}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                  <Badge variant="outline" className={cn("text-xs", student.status === "active" ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "")}>
                    {student.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Last Visit</p>
                  <p className="text-sm font-medium">{student.lastVisit}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Guardian Contact</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm">{student.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{student.guardianPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{student.guardianEmail}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Blood Type</p>
                <Badge variant="outline" className="text-xs">{student.bloodType}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Allergies</p>
                {student.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {student.allergies.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs text-amber-600 dark:text-amber-400 border-amber-500/30">{a}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None reported</p>
                )}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Conditions</p>
                {student.conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {student.conditions.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30">{c}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">None reported</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-3 mt-4">
              <p className="text-sm text-muted-foreground">Recent incident history will appear here.</p>
              <div className="space-y-2">
                {["Fever (May 20)", "Annual Checkup (Apr 15)", "Minor Cut (Mar 8)"].map((h) => (
                  <div key={h} className="p-3 rounded-xl bg-muted/50 text-sm">{h}</div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </SheetContent>
  );
}

export default function StudentsPage() {
  const [search, setSearch] = React.useState("");
  const [gradeFilter, setGradeFilter] = React.useState("all");

  const filtered = mockStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || s.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pt-2">
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Students</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage student records and health profiles</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="Grade 9">Grade 9</SelectItem>
            <SelectItem value="Grade 10">Grade 10</SelectItem>
            <SelectItem value="Grade 11">Grade 11</SelectItem>
            <SelectItem value="Grade 12">Grade 12</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="default" className="h-10">
          <Download className="size-4" /> Export
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle">
          <GlassCardContent >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student) => (
                  <TableRow key={student.id} className="cursor-pointer hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-muted text-xs font-medium">{student.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{student.id}</TableCell>
                    <TableCell className="text-sm">{student.grade}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{student.bloodType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", student.status === "active" ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "")}>
                        {student.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{student.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">View</Button>
                        </SheetTrigger>
                        <StudentDrawer student={student} />
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
