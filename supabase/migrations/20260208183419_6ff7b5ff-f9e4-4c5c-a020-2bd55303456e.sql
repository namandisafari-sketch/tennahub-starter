
-- Part 6: Add more missing columns for TypeScript compatibility

-- 1. Add missing columns to receipt_settings
ALTER TABLE public.receipt_settings
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS show_whatsapp_qr BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS seasonal_remark TEXT,
  ADD COLUMN IF NOT EXISTS show_seasonal_remark BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS footer_message TEXT DEFAULT 'Thank you for your business!',
  ADD COLUMN IF NOT EXISTS show_footer_message BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_customer BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_date_time BOOLEAN DEFAULT true;

-- 2. Add missing columns to uneb_school_settings
ALTER TABLE public.uneb_school_settings
  ADD COLUMN IF NOT EXISTS center_number TEXT,
  ADD COLUMN IF NOT EXISTS center_name TEXT,
  ADD COLUMN IF NOT EXISTS uce_registration_fee DECIMAL(15,2) DEFAULT 80000,
  ADD COLUMN IF NOT EXISTS uace_registration_fee DECIMAL(15,2) DEFAULT 120000,
  ADD COLUMN IF NOT EXISTS current_academic_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  ADD COLUMN IF NOT EXISTS registration_open BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS registration_deadline_uce DATE,
  ADD COLUMN IF NOT EXISTS registration_deadline_uace DATE;

-- 3. Add missing columns to ecd_rating_scale
ALTER TABLE public.ecd_rating_scale
  ADD COLUMN IF NOT EXISTS label TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Star',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'blue',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 4. Add missing columns to ecd_report_cards
ALTER TABLE public.ecd_report_cards
  ADD COLUMN IF NOT EXISTS total_school_days INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS days_present INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS teacher_comment TEXT,
  ADD COLUMN IF NOT EXISTS teacher_name TEXT;

-- 5. Add remark column to ecd_learning_ratings  
ALTER TABLE public.ecd_learning_ratings
  ADD COLUMN IF NOT EXISTS remark TEXT;

-- 6. Add boarding_status to students
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS boarding_status TEXT DEFAULT 'day';

-- 7. Create link_parent_to_student function if not exists
CREATE OR REPLACE FUNCTION public.link_parent_to_student(
  p_parent_id UUID,
  p_student_id UUID,
  p_relationship TEXT DEFAULT 'parent'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  INSERT INTO parent_students (parent_id, student_id, relationship)
  VALUES (p_parent_id, p_student_id, p_relationship)
  ON CONFLICT (parent_id, student_id) DO UPDATE
  SET relationship = p_relationship;
  
  result := json_build_object('success', true);
  RETURN result;
END;
$$;
