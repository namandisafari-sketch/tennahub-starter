-- =====================================================
-- MISSING TABLES RESTORATION - PART 4B: Leases & Related Tables
-- =====================================================

-- Leases table
CREATE TABLE IF NOT EXISTS public.leases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.rental_units(id) ON DELETE CASCADE,
  rental_tenant_id UUID NOT NULL REFERENCES public.rental_tenants(id) ON DELETE CASCADE,
  lease_number TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  deposit_amount NUMERIC DEFAULT 0,
  deposit_paid NUMERIC DEFAULT 0,
  payment_due_day INTEGER DEFAULT 1,
  late_fee_amount NUMERIC DEFAULT 0,
  late_fee_grace_days INTEGER DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'active',
  terms_and_conditions TEXT,
  special_conditions TEXT,
  move_in_date DATE,
  move_out_date DATE,
  renewal_reminder_days INTEGER DEFAULT 30,
  auto_renew BOOLEAN DEFAULT false,
  outstanding_balance NUMERIC DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental ID cards table
CREATE TABLE IF NOT EXISTS public.rental_id_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  rental_tenant_id UUID NOT NULL REFERENCES public.rental_tenants(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.rental_units(id),
  card_number TEXT NOT NULL,
  qr_code_data TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental payment proofs table
CREATE TABLE IF NOT EXISTS public.rental_payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.rental_id_cards(id),
  lease_id UUID REFERENCES public.leases(id),
  payer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_provider TEXT,
  transaction_reference TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental payments table
CREATE TABLE IF NOT EXISTS public.rental_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  lease_id UUID NOT NULL REFERENCES public.leases(id) ON DELETE CASCADE,
  rental_tenant_id UUID NOT NULL REFERENCES public.rental_tenants(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  reference_number TEXT,
  payment_type TEXT NOT NULL DEFAULT 'rent',
  status TEXT NOT NULL DEFAULT 'completed',
  late_fee_applied NUMERIC DEFAULT 0,
  notes TEXT,
  received_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maintenance requests table
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.rental_units(id) ON DELETE CASCADE,
  rental_tenant_id UUID REFERENCES public.rental_tenants(id),
  request_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  scheduled_date DATE,
  completed_date DATE,
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  contractor_name TEXT,
  contractor_phone TEXT,
  resolution_notes TEXT,
  reported_by TEXT,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Property inspections table
CREATE TABLE IF NOT EXISTS public.property_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES public.rental_units(id) ON DELETE CASCADE,
  lease_id UUID REFERENCES public.leases(id) ON DELETE SET NULL,
  inspection_type TEXT NOT NULL DEFAULT 'move_in',
  inspection_date DATE NOT NULL,
  inspector_name TEXT,
  overall_condition TEXT DEFAULT 'good',
  notes TEXT,
  findings JSONB DEFAULT '[]'::jsonb,
  tenant_signature_url TEXT,
  manager_signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inspections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Leases access" ON public.leases FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Rental ID cards access" ON public.rental_id_cards FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Rental payment proofs access" ON public.rental_payment_proofs FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Rental payments access" ON public.rental_payments FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Maintenance requests access" ON public.maintenance_requests FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Property inspections access" ON public.property_inspections FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));