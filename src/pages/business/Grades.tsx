import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/use-tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Award, Search, GraduationCap, ScanLine, User, AlertTriangle } from "lucide-react";
import { StudentScannerDialog } from "@/components/grades/StudentScannerDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Student {
  id: string;
  full_name: string;
  admission_number: string;
  photo_url?: string;
}

interface Exam {
  id: string;
  exam_date: string;
  max_marks: number;
  subject: { id: string; name: string; code: string } | null;
  exam_type: { name: string } | null;
}

interface TeacherAssignment {
  assignedClasses: string[];
  assignedSubjects: string[];
}

export default function Grades() {
  const { data: tenant, isLoading: tenantLoading } = useTenant();
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [focusedStudentId, setFocusedStudentId] = useState<string | null>(null);

  // Get current user and their teacher assignments
  const { data: teacherAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["teacher-assignments", tenant?.tenantId],
    queryFn: async () => {
      if (!tenant?.tenantId) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get profile with role
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .single();
      
      if (!profile) return null;

      const privilegedRoles = ["admin", "owner", "director", "superadmin"];

      // Check profile.role first (common storage location)
      if (profile.role && privilegedRoles.includes(profile.role)) {
        return { assignedClasses: "all", assignedSubjects: "all" } as const;
      }

      // Also check user_roles table as fallback
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleData?.role && privilegedRoles.includes(roleData.role)) {
        return { assignedClasses: "all", assignedSubjects: "all" } as const;
      }

      // Get teacher class assignments
      const { data: classAssignments } = await supabase
        .from("teacher_class_assignments")
        .select("class_id")
        .eq("tenant_id", tenant.tenantId)
        .eq("teacher_id", user.id);

      // Get teacher subject assignments
      const { data: subjectAssignments } = await supabase
        .from("teacher_subject_assignments")
        .select("subject_id")
        .eq("tenant_id", tenant.tenantId)
        .eq("teacher_id", user.id);

      return {
        assignedClasses: classAssignments?.map(a => a.class_id) || [],
        assignedSubjects: subjectAssignments?.map(a => a.subject_id) || [],
      } as TeacherAssignment;
    },
    enabled: !!tenant?.tenantId,
  });

  const isAdmin = teacherAssignments && "assignedClasses" in teacherAssignments && teacherAssignments.assignedClasses === "all";
  const hasAssignments = isAdmin || (
    teacherAssignments && 
    Array.isArray(teacherAssignments.assignedClasses) && 
    teacherAssignments.assignedClasses.length > 0
  );

  // Fetch classes (filtered by teacher assignments if not admin)
  const { data: classes } = useQuery({
    queryKey: ["school-classes", tenant?.tenantId, teacherAssignments],
    queryFn: async () => {
      if (!tenant?.tenantId) return [];
      
      let query = supabase
        .from("school_classes")
        .select("id, name, grade")
        .eq("tenant_id", tenant.tenantId)
        .eq("is_active", true)
        .order("name");

      // Filter by teacher assignments if not admin
      if (!isAdmin && teacherAssignments && Array.isArray(teacherAssignments.assignedClasses)) {
        if (teacherAssignments.assignedClasses.length === 0) return [];
        query = query.in("id", teacherAssignments.assignedClasses);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!tenant?.tenantId && !!teacherAssignments,
  });

  // Fetch exams for the selected class (filtered by assigned subjects)
  const { data: exams } = useQuery({
    queryKey: ["class-exams", tenant?.tenantId, selectedClass, teacherAssignments],
    queryFn: async () => {
      if (!tenant?.tenantId || !selectedClass) return [];
      
      let query = supabase
        .from("exams")
        .select("id, exam_date, max_marks, subject:subject_id(id, name, code), exam_type:exam_type_id(name)")
        .eq("tenant_id", tenant.tenantId)
        .eq("class_id", selectedClass)
        .order("exam_date", { ascending: false })
        .limit(50);

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data as unknown as Exam[];

      // Filter by assigned subjects if not admin
      if (!isAdmin && teacherAssignments && Array.isArray(teacherAssignments.assignedSubjects)) {
        filteredData = filteredData.filter(
          exam => exam.subject && teacherAssignments.assignedSubjects.includes(exam.subject.id)
        );
      }

      return filteredData;
    },
    enabled: !!tenant?.tenantId && !!selectedClass && !!teacherAssignments,
  });

  // Fetch students for selected class
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["class-students", selectedClass],
    queryFn: async () => {
      if (!selectedClass) return [];
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, admission_number, photo_url")
        .eq("class_id", selectedClass)
        .eq("is_active", true)
        .order("full_name");
      if (error) throw error;
      return data as Student[];
    },
    enabled: !!selectedClass,
  });

  // Fetch existing scores for the selected exam
  const { data: existingScores } = useQuery({
    queryKey: ["exam-scores", selectedExam],
    queryFn: async () => {
      if (!selectedExam) return [];
      const { data, error } = await supabase
        .from("student_exam_scores")
        .select("student_id, marks_obtained")
        .eq("exam_id", selectedExam);
      if (error) throw error;
      
      const scoresMap: Record<string, number | null> = {};
      (data as { student_id: string; marks_obtained: number | null }[])?.forEach((s) => {
        scoresMap[s.student_id] = s.marks_obtained;
      });
      setScores(scoresMap);
      return data;
    },
    enabled: !!selectedExam,
  });

  const selectedExamData = exams?.find((e) => e.id === selectedExam);
  const maxMarks = selectedExamData?.max_marks || 100;

  // Save scores mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!tenant?.tenantId || !selectedExam) {
        throw new Error("Please select class and exam");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const scoresToSave = Object.entries(scores)
        .filter(([_, score]) => score !== null && score !== undefined)
        .map(([studentId, marks]) => ({
          tenant_id: tenant.tenantId,
          student_id: studentId,
          exam_id: selectedExam,
          marks_obtained: marks,
          graded_by: user.id,
          graded_at: new Date().toISOString(),
        }));

      if (scoresToSave.length === 0) {
        throw new Error("No scores to save");
      }

      const { error } = await supabase
        .from("student_exam_scores")
        .upsert(scoresToSave, {
          onConflict: "student_id,exam_id",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-scores"] });
      toast({ title: "Scores saved successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleScoreChange = (studentId: string, value: string) => {
    const numValue = value === "" ? null : Math.min(maxMarks, Math.max(0, parseFloat(value) || 0));
    setScores((prev) => ({ ...prev, [studentId]: numValue }));
  };

  const handleStudentScanned = (student: {
    id: string;
    full_name: string;
    admission_number: string;
    class_name?: string;
  }) => {
    // Check if student is in the current class
    const studentInClass = students?.find(s => s.id === student.id);
    
    if (!studentInClass) {
      toast({
        title: "Student not in selected class",
        description: `${student.full_name} (${student.admission_number}) is in ${student.class_name || "another class"}. Please select their class first.`,
        variant: "destructive"
      });
      return;
    }

    // Focus on the student's row and scroll to it
    setFocusedStudentId(student.id);
    setSearchTerm(student.admission_number);
    
    // Auto-focus the input field after a short delay
    setTimeout(() => {
      const input = document.getElementById(`score-${student.id}`);
      if (input) {
        input.focus();
        (input as HTMLInputElement).select();
      }
    }, 100);
  };

  const filteredStudents = students?.filter((s) =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isReadyToGrade = selectedClass && selectedExam;

  if (tenantLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // No assignments warning for teachers
  if (!hasAssignments) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have not been assigned to any classes or subjects. Please contact your administrator to assign you to classes and subjects before you can enter marks.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6" />
            Marks Entry
          </h1>
          <p className="text-muted-foreground">
            Enter and manage student exam scores
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isReadyToGrade && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsScannerOpen(true)}
                className="gap-2"
              >
                <ScanLine className="h-4 w-4" />
                Scan Student
              </Button>
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Scores
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Selection Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class & Exam</CardTitle>
          <CardDescription>
            Choose the class and exam to enter marks
            {!isAdmin && (
              <span className="block text-xs text-amber-600 dark:text-amber-400 mt-1">
                Only showing your assigned classes and subjects
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setSelectedExam(""); setScores({}); setFocusedStudentId(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Exam</Label>
              <Select value={selectedExam} onValueChange={(v) => { setSelectedExam(v); setScores({}); setFocusedStudentId(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No exams for your assigned subjects
                    </div>
                  ) : (
                    exams?.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.subject?.name || "Unknown"} - {exam.exam_type?.name || "Exam"} ({exam.exam_date})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marks Entry Table */}
      {isReadyToGrade && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Scores {selectedExamData && `(Max: ${maxMarks})`}
                </CardTitle>
                <CardDescription>
                  {filteredStudents?.length || 0} students in selected class
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStudents && filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="w-16">Photo</TableHead>
                    <TableHead>Adm. No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-32">Score (0-{maxMarks})</TableHead>
                    <TableHead className="w-24">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, idx) => {
                    const score = scores[student.id];
                    const grade = getGrade(score, maxMarks);
                    const isFocused = focusedStudentId === student.id;
                    
                    return (
                      <TableRow 
                        key={student.id} 
                        className={isFocused ? "bg-primary/10 ring-2 ring-primary ring-inset" : ""}
                      >
                        <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.photo_url || undefined} alt={student.full_name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-mono">{student.admission_number}</TableCell>
                        <TableCell className="font-medium">{student.full_name}</TableCell>
                        <TableCell>
                          <Input
                            id={`score-${student.id}`}
                            type="number"
                            min={0}
                            max={maxMarks}
                            value={score ?? ""}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                            className="w-20"
                            placeholder="--"
                            onFocus={() => setFocusedStudentId(student.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${getGradeColor(grade)}`}>
                            {grade || "-"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No students found in this class</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isReadyToGrade && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Please select a class and exam to enter marks</p>
          </CardContent>
        </Card>
      )}

      {/* Student Scanner Dialog */}
      {tenant?.tenantId && (
        <StudentScannerDialog
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          tenantId={tenant.tenantId}
          onStudentFound={handleStudentScanned}
        />
      )}
    </div>
  );
}

// Helper function to calculate grade (Uganda O-Level grading)
function getGrade(score: number | null | undefined, maxMarks: number): string {
  if (score === null || score === undefined) return "";
  const percentage = (score / maxMarks) * 100;
  if (percentage >= 80) return "D1";
  if (percentage >= 70) return "D2";
  if (percentage >= 60) return "C3";
  if (percentage >= 55) return "C4";
  if (percentage >= 50) return "C5";
  if (percentage >= 45) return "C6";
  if (percentage >= 40) return "P7";
  if (percentage >= 35) return "P8";
  return "F9";
}

// Helper function to get grade color using semantic tokens
function getGradeColor(grade: string): string {
  if (grade.startsWith("D")) return "text-emerald-600 dark:text-emerald-400";
  if (grade.startsWith("C")) return "text-sky-600 dark:text-sky-400";
  if (grade.startsWith("P")) return "text-amber-600 dark:text-amber-400";
  if (grade === "F9") return "text-destructive";
  return "";
}
