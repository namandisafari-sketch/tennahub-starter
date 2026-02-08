-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CUSTOM TYPES
-- =============================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'tenant_owner', 'director', 'branch_manager', 'staff', 'accountant', 'marketer', 'customer', 'parent', 'renter');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- CORE TABLES
-- =============================================

-- Packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  monthly_price NUMERIC NOT NULL DEFAULT 0,
  yearly_price NUMERIC,
  features JSONB,
  max_users INTEGER DEFAULT 5,
  max_branches INTEGER DEFAULT 1,
  max_products INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  business_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  package_id UUID REFERENCES public.packages(id),
  status TEXT DEFAULT 'pending',
  is_trial BOOLEAN DEFAULT true,
  trial_days INTEGER DEFAULT 14,
  trial_end_date DATE,
  activated_at TIMESTAMPTZ,
  subscription_end_date DATE,
  referral_code TEXT UNIQUE,
  referred_by_code TEXT,
  business_code TEXT UNIQUE,
  parent_login_code TEXT UNIQUE,
  renter_login_code TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  late_arrival_minutes INTEGER DEFAULT 30,
  school_start_time TEXT DEFAULT '08:00',
  school_end_time TEXT DEFAULT '16:00',
  require_early_departure_reason BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (for RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id),
  role TEXT DEFAULT 'staff',
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}',
  branch_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Branches table
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_active BOOLEAN DEFAULT true,
  target_roles TEXT[],
  target_business_types TEXT[],
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- SCHOOL TABLES
-- =============================================

-- School classes
CREATE TABLE IF NOT EXISTS public.school_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  level TEXT NOT NULL,
  section TEXT,
  capacity INTEGER,
  class_teacher_id UUID,
  is_active BOOLEAN DEFAULT true,
  id_card_expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.school_classes(id),
  full_name TEXT NOT NULL,
  admission_number TEXT,
  date_of_birth DATE,
  gender TEXT,
  photo_url TEXT,
  parent_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Gate check-ins
CREATE TABLE IF NOT EXISTS public.gate_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL DEFAULT 'arrival',
  checked_at TIMESTAMPTZ DEFAULT now(),
  is_late BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Early departure requests
CREATE TABLE IF NOT EXISTS public.early_departure_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  requested_by UUID,
  requested_at TIMESTAMPTZ DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  gate_checkin_id UUID REFERENCES public.gate_checkins(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gate override requests (bursar)
CREATE TABLE IF NOT EXISTS public.gate_override_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  blocking_reasons TEXT[],
  status TEXT DEFAULT 'pending',
  requested_by UUID,
  requested_at TIMESTAMPTZ DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  valid_until DATE,
  gate_checkin_id UUID REFERENCES public.gate_checkins(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bursar rules
CREATE TABLE IF NOT EXISTS public.bursar_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  balance_operator TEXT,
  balance_amount NUMERIC,
  class_id UUID REFERENCES public.school_classes(id),
  requirement_id UUID,
  alert_message TEXT,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Term requirements
CREATE TABLE IF NOT EXISTS public.term_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  class_id UUID REFERENCES public.school_classes(id),
  term TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- School settings
CREATE TABLE IF NOT EXISTS public.school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  admission_prefix TEXT,
  admission_format TEXT,
  class_naming_format TEXT,
  streams TEXT[] DEFAULT '{}',
  student_id_prefix TEXT DEFAULT 'STU',
  student_id_digits INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admission settings
CREATE TABLE IF NOT EXISTS public.admission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  is_open BOOLEAN DEFAULT false,
  rules_and_regulations TEXT,
  disclaimer_text TEXT,
  require_photo BOOLEAN DEFAULT false,
  require_birth_certificate BOOLEAN DEFAULT false,
  require_previous_school_records BOOLEAN DEFAULT false,
  academic_year TEXT,
  admission_fee_amount NUMERIC DEFAULT 0,
  link_validity_hours INTEGER DEFAULT 72,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND role IN ('superadmin', 'admin'));
$$;

-- =============================================
-- ENABLE RLS
-- =============================================

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.early_departure_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_override_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bursar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.term_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

CREATE POLICY "Packages viewable by all" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Sponsors viewable by all" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Announcements viewable by all" ON public.announcements FOR SELECT USING (true);

CREATE POLICY "Profiles access" ON public.profiles FOR ALL USING (id = auth.uid() OR is_admin(auth.uid()));
CREATE POLICY "Allow profile creation" ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "User roles access" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR is_admin(auth.uid()));
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL USING (is_admin(auth.uid()));

-- Tenant-based policies
CREATE POLICY "Tenant access" ON public.tenants FOR SELECT USING (id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Branches access" ON public.branches FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "School classes access" ON public.school_classes FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Students access" ON public.students FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Gate checkins access" ON public.gate_checkins FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Early departure access" ON public.early_departure_requests FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Override requests access" ON public.gate_override_requests FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Bursar rules access" ON public.bursar_rules FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Term requirements access" ON public.term_requirements FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "School settings access" ON public.school_settings FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Admission settings access" ON public.admission_settings FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';