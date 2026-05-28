"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, GlassCardContent } from "@/components/shared/glass-card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2
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
import { bulkImportStudents } from "@/lib/actions/students";
import { toast } from "sonner";

type ImportStep = "upload" | "preview" | "importing" | "result";

interface ParsedStudent {
  student_number: string;
  grade: string;
  section: string;
  blood_type: string;
  allergies: string[];
  conditions: string[];
  status: "valid" | "invalid";
  error?: string;
}

export default function BulkImportPage() {
  const [step, setStep] = React.useState<ImportStep>("upload");
  const [progress, setProgress] = React.useState(0);
  const [fileName, setFileName] = React.useState("");
  const [parsedData, setParsedData] = React.useState<ParsedStudent[]>([]);
  const [validCount, setValidCount] = React.useState(0);
  const [invalidCount, setInvalidCount] = React.useState(0);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) {
      toast.error("CSV file must contain a header row and at least one data row.");
      return;
    }

    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, "").toLowerCase());
    
    const numIdx = headers.indexOf("student_number");
    const gradeIdx = headers.indexOf("grade");
    const secIdx = headers.indexOf("section");
    const bloodIdx = headers.indexOf("blood_type");
    const allergyIdx = headers.indexOf("allergies");
    const condIdx = headers.indexOf("conditions");

    if (numIdx === -1 || gradeIdx === -1 || secIdx === -1) {
      toast.error("Missing required headers: student_number, grade, section");
      return;
    }

    const students: ParsedStudent[] = [];
    let valid = 0;
    let invalid = 0;

    for (let i = 1; i < lines.length; i++) {
      // Very basic comma-split regex supporting quotes for arrays
      const columns = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ""));
      
      const studentNum = columns[numIdx] || "";
      const gradeVal = columns[gradeIdx] || "";
      const secVal = columns[secIdx] || "";
      const bloodType = bloodIdx !== -1 ? columns[bloodIdx] || "" : "";
      
      const allergiesRaw = allergyIdx !== -1 ? columns[allergyIdx] || "" : "";
      const allergies = allergiesRaw ? allergiesRaw.split(";").map(a => a.trim()).filter(Boolean) : [];

      const condsRaw = condIdx !== -1 ? columns[condIdx] || "" : "";
      const conditions = condsRaw ? condsRaw.split(";").map(c => c.trim()).filter(Boolean) : [];

      let status: "valid" | "invalid" = "valid";
      let error = "";

      if (!studentNum) {
        status = "invalid";
        error = "Missing Student Number";
      } else if (!gradeVal) {
        status = "invalid";
        error = "Missing Grade";
      } else if (!secVal) {
        status = "invalid";
        error = "Missing Section";
      }

      if (status === "valid") valid++;
      else invalid++;

      students.push({
        student_number: studentNum,
        grade: gradeVal,
        section: secVal,
        blood_type: bloodType,
        allergies,
        conditions,
        status,
        error
      });
    }

    setParsedData(students);
    setValidCount(valid);
    setInvalidCount(invalid);
    setStep("preview");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const startImport = async () => {
    setStep("importing");
    setProgress(10);

    const validStudents = parsedData.filter(s => s.status === "valid").map(s => ({
      student_number: s.student_number,
      grade: s.grade,
      section: s.section,
      blood_type: s.blood_type || null,
      allergies: s.allergies,
      conditions: s.conditions
    }));

    if (validStudents.length === 0) {
      toast.error("No valid students found to import.");
      setStep("preview");
      return;
    }

    try {
      setProgress(40);
      await bulkImportStudents(validStudents as any);
      setProgress(90);
      setTimeout(() => {
        setProgress(100);
        setStep("result");
        toast.success("Successfully imported student profiles!");
      }, 400);
    } catch (err: any) {
      toast.error(err.message || "Bulk import failed");
      setStep("preview");
    }
  };

  const resetFlow = () => {
    setStep("upload");
    setProgress(0);
    setParsedData([]);
    setFileName("");
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,student_number,grade,section,blood_type,allergies,conditions\n"
      + "2026-10A-001,Grade 10,Section A,O+,Peanuts;Penicillin,Mild Asthma\n"
      + "2026-11B-002,Grade 11,Section B,A+,None,Diabetes";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "crosshere_student_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          Import students or staff health profiles directly from a CSV template.
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
                        Upload your CSV template with students data
                      </p>
                      
                      <div className="flex justify-center gap-3">
                        <Badge variant="outline" className="bg-background">.csv</Badge>
                      </div>
                      
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        accept=".csv"
                        onChange={handleFileSelect}
                      />
                    </div>
                    
                    <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                      <FileSpreadsheet className="size-4" />
                      Need a template? 
                      <button onClick={downloadTemplate} className="text-crosshere hover:underline font-medium">Download CSV Template</button>
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
                        <h3 className="text-lg font-semibold">Data Preview ({fileName})</h3>
                        <p className="text-sm text-muted-foreground">
                          Review the parsed records. We found {validCount} valid and {invalidCount} invalid rows.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={resetFlow}>Cancel</Button>
                        <Button className="bg-crosshere hover:bg-crosshere/90 text-white" disabled={validCount === 0} onClick={startImport}>
                          Import {validCount} Valid Rows
                        </Button>
                      </div>
                    </div>

                    <div className="border border-border/50 rounded-xl overflow-hidden flex-1 max-h-[350px] overflow-y-auto">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead>Student Number</TableHead>
                            <TableHead>Grade & Section</TableHead>
                            <TableHead>Blood Type</TableHead>
                            <TableHead>Allergies / Conditions</TableHead>
                            <TableHead>Validation Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedData.map((row, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/20">
                              <TableCell className="p-0 relative">
                                <div className={cn(
                                  "absolute left-0 top-0 bottom-0 w-1",
                                  row.status === "valid" ? "bg-emerald-500" : "bg-red-500"
                                )} />
                              </TableCell>
                              <TableCell className="font-medium">{row.student_number || "—"}</TableCell>
                              <TableCell>{row.grade} {row.section}</TableCell>
                              <TableCell>{row.blood_type || "—"}</TableCell>
                              <TableCell className="text-xs max-w-xs truncate">
                                {row.allergies.length > 0 && `Allergies: ${row.allergies.join(", ")}`}
                                {row.conditions.length > 0 && ` | Conditions: ${row.conditions.join(", ")}`}
                                {row.allergies.length === 0 && row.conditions.length === 0 && "None"}
                              </TableCell>
                              <TableCell>
                                {row.status === "valid" ? (
                                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                                    <CheckCircle2 className="size-3.5" /> Ready
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium">
                                    <XCircle className="size-3.5" /> {row.error}
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
                        <Loader2 className="size-8 text-blue-500 animate-spin" />
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
                      Successfully processed the bulk import file. Student health profiles have been updated and are now live in the system.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Successfully Imported</p>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{validCount}</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Failed / Skipped</p>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">{invalidCount}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={resetFlow}>
                        Import Another File
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
