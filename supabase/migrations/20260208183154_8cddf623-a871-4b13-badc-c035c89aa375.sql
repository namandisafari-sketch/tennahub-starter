
-- Part 5: Add missing columns and tables for TypeScript compatibility

-- 1. Add priority column to announcements
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- 2. Create chart_of_accounts table
CREATE TABLE IF NOT EXISTS public.chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  sub_type TEXT,
  parent_id UUID REFERENCES public.chart_of_accounts(id),
  balance DECIMAL(15,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for chart_of_accounts" ON public.chart_of_accounts;
CREATE POLICY "Tenant isolation for chart_of_accounts" ON public.chart_of_accounts
  FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- 3. Create term_requirements table for bursar_rules relation
CREATE TABLE IF NOT EXISTS public.term_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  term_id UUID REFERENCES public.academic_terms(id),
  name TEXT NOT NULL,
  description TEXT,
  is_mandatory BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.term_requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for term_requirements" ON public.term_requirements;
CREATE POLICY "Tenant isolation for term_requirements" ON public.term_requirements
  FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Add requirement_id FK to bursar_rules if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bursar_rules' AND column_name = 'requirement_id'
  ) THEN
    ALTER TABLE public.bursar_rules ADD COLUMN requirement_id UUID REFERENCES public.term_requirements(id);
  END IF;
END $$;

-- 4. Add missing columns to gate_override_requests
ALTER TABLE public.gate_override_requests 
  ADD COLUMN IF NOT EXISTS blocking_reason TEXT,
  ADD COLUMN IF NOT EXISTS override_reason TEXT,
  ADD COLUMN IF NOT EXISTS valid_for_date DATE,
  ADD COLUMN IF NOT EXISTS reviewer_notes TEXT;

-- 5. Create letter_settings table
CREATE TABLE IF NOT EXISTS public.letter_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  show_logo BOOLEAN DEFAULT true,
  logo_position TEXT DEFAULT 'center',
  show_school_name BOOLEAN DEFAULT true,
  show_address BOOLEAN DEFAULT true,
  show_phone BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT true,
  header_text TEXT,
  show_signature_line BOOLEAN DEFAULT true,
  signature_title TEXT DEFAULT 'Head Teacher',
  show_stamp_area BOOLEAN DEFAULT true,
  footer_text TEXT,
  margin_top INTEGER DEFAULT 20,
  margin_bottom INTEGER DEFAULT 20,
  margin_left INTEGER DEFAULT 20,
  margin_right INTEGER DEFAULT 20,
  line_spacing DECIMAL(3,1) DEFAULT 1.5,
  font_family TEXT DEFAULT 'Times New Roman',
  font_size INTEGER DEFAULT 12,
  use_custom_header BOOLEAN DEFAULT false,
  custom_header_image_url TEXT,
  use_custom_footer BOOLEAN DEFAULT false,
  custom_footer_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.letter_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for letter_settings" ON public.letter_settings;
CREATE POLICY "Tenant isolation for letter_settings" ON public.letter_settings
  FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- 6. Add missing columns to receipt_settings
ALTER TABLE public.receipt_settings
  ADD COLUMN IF NOT EXISTS receipt_prefix TEXT DEFAULT 'RCP',
  ADD COLUMN IF NOT EXISTS next_receipt_number INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS logo_alignment TEXT DEFAULT 'center',
  ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_address BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_date BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_time BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_cashier BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_student_info BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_class BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_balance BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_payment_method BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS paper_size TEXT DEFAULT '80mm',
  ADD COLUMN IF NOT EXISTS include_qr_code BOOLEAN DEFAULT false;

-- 7. Add fee_balance_threshold to tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS fee_balance_threshold DECIMAL(15,2) DEFAULT 0;

-- 8. Add staff_type to staff_permissions
ALTER TABLE public.staff_permissions ADD COLUMN IF NOT EXISTS staff_type TEXT DEFAULT 'general';

-- 9. Create uneb_school_settings table
CREATE TABLE IF NOT EXISTS public.uneb_school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  school_center_number TEXT,
  school_name TEXT,
  examination_body TEXT DEFAULT 'UNEB',
  is_registered BOOLEAN DEFAULT false,
  registration_year INTEGER,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.uneb_school_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant isolation for uneb_school_settings" ON public.uneb_school_settings;
CREATE POLICY "Tenant isolation for uneb_school_settings" ON public.uneb_school_settings
  FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
