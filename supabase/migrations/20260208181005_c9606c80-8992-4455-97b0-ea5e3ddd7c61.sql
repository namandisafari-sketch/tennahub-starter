-- =====================================================
-- MISSING TABLES RESTORATION - PART 1: School & Academic Tables
-- =====================================================

-- Academic terms table
CREATE TABLE IF NOT EXISTS public.academic_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  term_number INTEGER NOT NULL CHECK (term_number BETWEEN 1 AND 3),
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, term_number, year)
);

-- Subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  level TEXT NOT NULL DEFAULT 'all',
  is_core BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Parents table
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  occupation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Parent-student linking table
CREATE TABLE IF NOT EXISTS public.parent_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'parent',
  is_primary_contact BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Student attendance table
CREATE TABLE IF NOT EXISTS public.student_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.school_classes(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  recorded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Student grades/marks table
CREATE TABLE IF NOT EXISTS public.student_grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id),
  term_id UUID NOT NULL REFERENCES public.academic_terms(id),
  assessment_type TEXT NOT NULL DEFAULT 'exam',
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  grade TEXT,
  remarks TEXT,
  recorded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fee structure table
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'all',
  term_id UUID REFERENCES public.academic_terms(id),
  amount NUMERIC NOT NULL DEFAULT 0,
  fee_type TEXT NOT NULL DEFAULT 'tuition',
  is_mandatory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student fees table
CREATE TABLE IF NOT EXISTS public.student_fees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.academic_terms(id),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  balance NUMERIC GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
  status TEXT NOT NULL DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, term_id)
);

-- Fee payments table
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_fee_id UUID NOT NULL REFERENCES public.student_fees(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id),
  amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  reference_number TEXT,
  receipt_number TEXT,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  received_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Attendance table for employees
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIME,
  check_out TIME,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer payments table
CREATE TABLE IF NOT EXISTS public.customer_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  reference_number TEXT,
  notes TEXT,
  received_by UUID,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Staff permissions table
CREATE TABLE IF NOT EXISTS public.staff_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  allowed_modules TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  UNIQUE(profile_id, tenant_id)
);

-- Staff invitations table
CREATE TABLE IF NOT EXISTS public.staff_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  allowed_modules TEXT[] NOT NULL DEFAULT '{}',
  invited_by UUID,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.academic_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Academic terms access" ON public.academic_terms FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Subjects access" ON public.subjects FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Parents access" ON public.parents FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()) OR user_id = auth.uid());
CREATE POLICY "Parent students access" ON public.parent_students FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Student attendance access" ON public.student_attendance FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Student grades access" ON public.student_grades FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Fee structures access" ON public.fee_structures FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Student fees access" ON public.student_fees FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Fee payments access" ON public.fee_payments FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Attendance access" ON public.attendance FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Customer payments access" ON public.customer_payments FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Staff permissions access" ON public.staff_permissions FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Staff invitations access" ON public.staff_invitations FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));