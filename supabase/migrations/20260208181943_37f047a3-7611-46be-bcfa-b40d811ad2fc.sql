-- =====================================================
-- MISSING TABLES RESTORATION - PART 4A: Rental Base Tables
-- =====================================================

-- Rental Properties table
CREATE TABLE IF NOT EXISTS public.rental_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  property_type TEXT NOT NULL DEFAULT 'apartment',
  total_units INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  year_built INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental Units table
CREATE TABLE IF NOT EXISTS public.rental_units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.rental_properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  unit_type TEXT DEFAULT 'residential',
  floor_number INTEGER,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  size_sqm NUMERIC,
  monthly_rent NUMERIC NOT NULL DEFAULT 0,
  deposit_amount NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  amenities JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rental Tenants (people renting)
CREATE TABLE IF NOT EXISTS public.rental_tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  id_number TEXT,
  id_type TEXT DEFAULT 'national_id',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  occupation TEXT,
  employer TEXT,
  monthly_income NUMERIC,
  previous_address TEXT,
  previous_landlord_contact TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rental_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Rental properties access" ON public.rental_properties FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Rental units access" ON public.rental_units FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Rental tenants access" ON public.rental_tenants FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));