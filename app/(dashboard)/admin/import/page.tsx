"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  ArrowRight,
  Download,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ImportStep = "upload" | "preview" | "importing" | "result";

const mockPreviewData = [
  { id: 1, name: "Alice Johnson", email: "alice@school.edu", role: "student", status: "valid" },
  { id: 2, name: "Bob Smith", email: "bob@school.edu", role: "student", status: "valid" },
  { id: 3, name: "Carol Davis", email: "invalid-email", role: "parent", status: "invalid", error: "Invalid email format" },
  { id: 4, name: "David Wilson", email: "david@school.edu", role: "unknown", status: "invalid", error: "Invalid role" },
  { id: 5, name: "Eve Brown", email: "eve@school.edu", role: "student", status: "duplicate", warning: "Email already exists" },
];

export default function BulkImportPage() {
  const [step, setStep] = React.useState<ImportStep>("upload");
  const [progress, setProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStep("preview");
    }
  };

  const startImport = () => {
    setStep("importing");
    setProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("result"), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const resetFlow = () => {
    setStep("upload");
    setProgress(0);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 pt-2"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Bulk Import</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Import students, parents, or staff from CSV or Excel files.
        </p>
      </motion.div>

      {/* Main Content Area */}
      <motion.div variants={staggerItem}>
        <GlassCard intensity="subtle" className="min-h-[500px] flex flex-col">
          <GlassCardContent className="flex-1 flex flex-col">
            {/* Stepper Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-4">
                {[
                  { id: "upload", label: "1. Upload File" },
                  { id: "preview", label: "2. Preview Data" },
                  { id: "importing", label: "3. Importing" },
                  { id: "result", label: "4. Results" }
                ].map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      step === s.id ? "text-crosshere" : 
                      ["upload", "preview", "importing", "result"].indexOf(step) > i ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </span>
                    {i < 3 && <ArrowRight className="size-3.5 mx-3 text-muted-foreground/50" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Step Content */}
            <div className="flex-1 p-6 flex flex-col">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: UPLOAD */}
                {step === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col items-center justify-center"
                  >
                    <div 
                      className="w-full max-w-2xl border-2 border-dashed border-border rounded-2xl p-12 text-center hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="size-16 rounded-full bg-crosshere/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <UploadCloud className="size-8 text-crosshere" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Click to upload or drag and drop</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Support for CSV, XLS, and XLSX files up to 10MB
                      </p>
                      
                      <div className="flex justify-center gap-3">
                        <Badge variant="outline" className="bg-background">.csv</Badge>
                        <Badge variant="outline" className="bg-background">.xlsx</Badge>
                      </div>
                      
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                      />
                    </div>
                    
                    <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileSpreadsheet className="size-4" />
                      Need a template? 
                      <a href="#" className="text-crosshere hover:underline font-medium">Download CSV Template</a>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PREVIEW */}
                {step === "preview" && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Data Preview</h3>
                        <p className="text-sm text-muted-foreground">Review the parsed data before importing. We found 2 errors.</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep("upload")}>Cancel</Button>
                        <Button className="bg-crosshere hover:bg-crosshere-crimson text-white" onClick={startImport}>
                          Import 3 Valid Rows
                        </Button>
                      </div>
                    </div>

                    <div className="border border-border/50 rounded-xl overflow-hidden flex-1">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email Address</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Validation Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPreviewData.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/20">
                              <TableCell className="p-0 relative">
                                <div className={cn(
                                  "absolute left-0 top-0 bottom-0 w-1",
                                  row.status === "valid" ? "bg-emerald-500" :
                                  row.status === "invalid" ? "bg-red-500" : "bg-amber-500"
                                )} />
                              </TableCell>
                              <TableCell className="font-medium">{row.name}</TableCell>
                              <TableCell className={cn(row.error?.includes("email") && "text-red-500 font-medium")}>
                                {row.email}
                              </TableCell>
                              <TableCell className="capitalize">{row.role}</TableCell>
                              <TableCell>
                                {row.status === "valid" ? (
                                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                    <CheckCircle2 className="size-3.5" /> Ready
                                  </div>
                                ) : row.status === "invalid" ? (
                                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
                                    <XCircle className="size-3.5" /> {row.error}
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-medium">
                                    <AlertTriangle className="size-3.5" /> {row.warning}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: IMPORTING */}
                {step === "importing" && (
                  <motion.div
                    key="importing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col items-center justify-center"
                  >
                    <div className="w-full max-w-md space-y-6 text-center">
                      <div className="size-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto relative">
                        <RefreshCw className="size-8 text-blue-500 animate-spin" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Importing Data...</h3>
                        <p className="text-sm text-muted-foreground">Please wait while we process the records.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: RESULT */}
                {step === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center py-10"
                  >
                    <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                      <CheckCircle2 className="size-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Import Complete</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-8">
                      Successfully processed the bulk import file. Invitations have been sent to new users automatically.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Successfully Imported</p>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">3</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Failed / Skipped</p>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">2</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={resetFlow}>
                        Import Another File
                      </Button>
                      <Button className="bg-crosshere hover:bg-crosshere-crimson text-white">
                        <Download className="mr-2 size-4" />
                        Download Error Report
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
