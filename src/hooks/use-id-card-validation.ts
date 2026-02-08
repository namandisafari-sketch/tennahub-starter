import { supabase } from "@/integrations/supabase/client";
import { isPast, parseISO, isValid } from "date-fns";

export interface IDCardValidationResult {
  isValid: boolean;
  reason: string | null;
  student: {
    id: string;
    full_name: string;
    admission_number: string;
    is_active: boolean;
    class_id: string | null;
    class_name?: string;
    id_card_expiry_date?: string | null;
  } | null;
}

/**
 * Validates a student's ID card for gate check-in
 * Checks:
 * 1. Student exists
 * 2. Student is active (not left/withdrawn)
 * 3. ID card has not expired (based on class expiry date)
 */
export async function validateStudentIDCard(
  admissionNumber: string,
  tenantId: string
): Promise<IDCardValidationResult> {
  // Find student by admission number with class info
  const { data: student, error } = await supabase
    .from("students")
    .select(`
      id,
      full_name,
      admission_number,
      is_active,
      class_id,
      school_classes!class_id (
        name,
        id_card_expiry_date
      )
    `)
    .eq("tenant_id", tenantId)
    .eq("admission_number", admissionNumber)
    .maybeSingle();

  if (error) {
    console.error("Error validating student ID card:", error);
    return {
      isValid: false,
      reason: "Error checking student records",
      student: null,
    };
  }

  if (!student) {
    return {
      isValid: false,
      reason: "Student not found with this ID",
      student: null,
    };
  }

  // Check if student is active
  if (!student.is_active) {
    return {
      isValid: false,
      reason: "STUDENT_INACTIVE",
      student: {
        id: student.id,
        full_name: student.full_name,
        admission_number: student.admission_number,
        is_active: student.is_active,
        class_id: student.class_id,
        class_name: (student.school_classes as any)?.name,
        id_card_expiry_date: (student.school_classes as any)?.id_card_expiry_date,
      },
    };
  }

  // Check card expiry date from class settings
  const classData = student.school_classes as { name: string; id_card_expiry_date: string | null } | null;
  const expiryDate = classData?.id_card_expiry_date;

  if (expiryDate) {
    const parsedDate = parseISO(expiryDate);
    if (isValid(parsedDate) && isPast(parsedDate)) {
      return {
        isValid: false,
        reason: "CARD_EXPIRED",
        student: {
          id: student.id,
          full_name: student.full_name,
          admission_number: student.admission_number,
          is_active: student.is_active,
          class_id: student.class_id,
          class_name: classData?.name,
          id_card_expiry_date: expiryDate,
        },
      };
    }
  }

  // Card is valid
  return {
    isValid: true,
    reason: null,
    student: {
      id: student.id,
      full_name: student.full_name,
      admission_number: student.admission_number,
      is_active: student.is_active,
      class_id: student.class_id,
      class_name: classData?.name,
      id_card_expiry_date: expiryDate,
    },
  };
}
