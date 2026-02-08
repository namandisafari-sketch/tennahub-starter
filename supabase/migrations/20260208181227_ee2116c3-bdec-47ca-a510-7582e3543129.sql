-- =====================================================
-- MISSING TABLES RESTORATION - PART 3: Pharmacy, Repair, Discipline, Visitor, etc.
-- =====================================================

-- Patients table (pharmacy)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  allergies TEXT,
  medical_notes TEXT,
  insurance_provider TEXT,
  insurance_number TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  prescription_number TEXT NOT NULL,
  doctor_name TEXT,
  doctor_phone TEXT,
  hospital_clinic TEXT,
  prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  dispensed_by UUID,
  dispensed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Prescription items table
CREATE TABLE IF NOT EXISTS public.prescription_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  dispensed_quantity INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Repair jobs table
CREATE TABLE IF NOT EXISTS public.repair_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  job_ref TEXT NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  device_type TEXT NOT NULL,
  device_brand TEXT,
  device_model TEXT,
  serial_number TEXT,
  reported_issue TEXT NOT NULL,
  diagnosis TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  estimated_cost NUMERIC DEFAULT 0,
  final_cost NUMERIC DEFAULT 0,
  deposit_paid NUMERIC DEFAULT 0,
  assigned_to UUID,
  technician_name TEXT,
  technician_fee NUMERIC NOT NULL DEFAULT 0,
  technician_paid BOOLEAN NOT NULL DEFAULT false,
  technician_paid_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  warranty_days INTEGER DEFAULT 0,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Repair job items table
CREATE TABLE IF NOT EXISTS public.repair_job_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.repair_jobs(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL DEFAULT 'part',
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Repair job payments table
CREATE TABLE IF NOT EXISTS public.repair_job_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.repair_jobs(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  reference_number TEXT,
  payment_type TEXT NOT NULL DEFAULT 'payment',
  received_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Spare parts table
CREATE TABLE IF NOT EXISTS public.spare_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  part_number TEXT,
  category TEXT,
  brand TEXT,
  model_compatibility TEXT,
  cost_price NUMERIC DEFAULT 0,
  selling_price NUMERIC DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  location TEXT,
  supplier_id UUID REFERENCES public.suppliers(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Discipline cases table
CREATE TABLE IF NOT EXISTS public.discipline_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  case_number TEXT NOT NULL,
  incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
  incident_type TEXT NOT NULL,
  incident_description TEXT NOT NULL,
  location TEXT,
  witnesses TEXT,
  reported_by UUID,
  action_taken TEXT NOT NULL,
  action_details TEXT,
  suspension_start_date DATE,
  suspension_end_date DATE,
  expulsion_date DATE,
  is_permanent_expulsion BOOLEAN DEFAULT false,
  parent_notified BOOLEAN DEFAULT false,
  parent_notified_at TIMESTAMP WITH TIME ZONE,
  parent_notified_by UUID,
  parent_acknowledged BOOLEAN DEFAULT false,
  parent_acknowledged_at TIMESTAMP WITH TIME ZONE,
  parent_response TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Visitor register table
CREATE TABLE IF NOT EXISTS public.visitor_register (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  phone TEXT,
  id_number TEXT,
  purpose TEXT NOT NULL,
  visiting_who TEXT,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  badge_number TEXT,
  notes TEXT,
  checked_in_by UUID,
  checked_out_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Send home records table
CREATE TABLE IF NOT EXISTS public.send_home_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  send_home_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  reason_category TEXT NOT NULL DEFAULT 'fees',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  notified_parent BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  gate_blocked BOOLEAN DEFAULT true,
  cleared_by UUID,
  cleared_at TIMESTAMP WITH TIME ZONE,
  cleared_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Gate override requests table
CREATE TABLE IF NOT EXISTS public.gate_override_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  gate_checkin_id UUID REFERENCES public.gate_checkins(id),
  reason TEXT NOT NULL,
  blocking_reasons TEXT[],
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  requested_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payroll records table
CREATE TABLE IF NOT EXISTS public.payroll_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  basic_salary NUMERIC NOT NULL DEFAULT 0,
  allowances NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  gross_salary NUMERIC NOT NULL DEFAULT 0,
  net_salary NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Salary advances table
CREATE TABLE IF NOT EXISTS public.salary_advances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  advance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason TEXT,
  is_deducted BOOLEAN NOT NULL DEFAULT false,
  deducted_in_payroll_id UUID REFERENCES public.payroll_records(id),
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Receipt settings table
CREATE TABLE IF NOT EXISTS public.receipt_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE UNIQUE,
  show_logo BOOLEAN DEFAULT true,
  show_header BOOLEAN DEFAULT true,
  header_text TEXT,
  footer_text TEXT,
  show_stamp_area BOOLEAN DEFAULT true,
  stamp_title TEXT DEFAULT 'Official Stamp',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tenant backups table
CREATE TABLE IF NOT EXISTS public.tenant_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  tenant_name TEXT NOT NULL,
  business_type TEXT,
  backup_data JSONB NOT NULL,
  deleted_by UUID,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_job_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discipline_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.send_home_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_override_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_backups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients access" ON public.patients FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Prescriptions access" ON public.prescriptions FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Prescription items access" ON public.prescription_items FOR ALL USING (prescription_id IN (SELECT id FROM prescriptions WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Repair jobs access" ON public.repair_jobs FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Repair job items access" ON public.repair_job_items FOR ALL USING (job_id IN (SELECT id FROM repair_jobs WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Repair job payments access" ON public.repair_job_payments FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Spare parts access" ON public.spare_parts FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Discipline cases access" ON public.discipline_cases FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Visitor register access" ON public.visitor_register FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Send home records access" ON public.send_home_records FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Gate override requests access" ON public.gate_override_requests FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Payroll records access" ON public.payroll_records FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Salary advances access" ON public.salary_advances FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Receipt settings access" ON public.receipt_settings FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Tenant backups access" ON public.tenant_backups FOR ALL USING (is_admin(auth.uid()));