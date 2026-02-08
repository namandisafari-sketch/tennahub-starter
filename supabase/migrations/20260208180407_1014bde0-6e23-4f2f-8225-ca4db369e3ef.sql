-- =====================================================
-- COMPREHENSIVE DATABASE RESTORATION - PART 1
-- Missing Types, Functions, and Core Tables
-- =====================================================

-- Create missing types
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.tenant_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Create missing functions
CREATE OR REPLACE FUNCTION public.generate_referral_code() RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    code := 'KBT' || UPPER(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM tenants WHERE referral_code = code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_tenant_referral_code() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =====================================================
-- MISSING CORE TABLES
-- =====================================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    actor_id uuid,
    tenant_id uuid REFERENCES public.tenants(id),
    action text NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    customer_type text DEFAULT 'retail',
    notes text,
    credit_limit numeric DEFAULT 0,
    current_balance numeric DEFAULT 0,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    sku text,
    description text,
    category text,
    category_id uuid,
    unit_price numeric(10,2) DEFAULT 0 NOT NULL,
    cost_price numeric(10,2),
    stock_quantity integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Sales
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_id uuid,
    table_id uuid,
    sale_date timestamp with time zone DEFAULT now(),
    total_amount numeric(10,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0,
    tax_amount numeric(10,2) DEFAULT 0,
    payment_method text,
    payment_status text DEFAULT 'paid',
    order_type text DEFAULT 'counter',
    order_status text DEFAULT 'pending',
    order_number integer,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Sale Items
CREATE TABLE IF NOT EXISTS public.sale_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    product_id uuid,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Marketers
CREATE TABLE IF NOT EXISTS public.marketers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid,
    name text NOT NULL,
    phone text,
    email text,
    referral_code text NOT NULL UNIQUE,
    daily_rate numeric(10,2) DEFAULT 0,
    total_referrals integer DEFAULT 0,
    approved_signups integer DEFAULT 0,
    total_earned numeric(10,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.marketers ENABLE ROW LEVEL SECURITY;

-- Payment Uploads
CREATE TABLE IF NOT EXISTS public.payment_uploads (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    uploader_id uuid NOT NULL,
    package_id uuid NOT NULL REFERENCES public.packages(id),
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'UGX',
    payment_method text,
    transaction_ref text,
    receipt_url text,
    status public.payment_status DEFAULT 'pending',
    admin_notes text,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.payment_uploads ENABLE ROW LEVEL SECURITY;

-- Settings
CREATE TABLE IF NOT EXISTS public.settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    key text NOT NULL UNIQUE,
    value text NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- BUSINESS MODULE TABLES
-- =====================================================

-- Restaurant Tables
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    table_number text NOT NULL,
    capacity integer DEFAULT 4,
    status text DEFAULT 'available',
    location_zone text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Menu Categories
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

-- Expenses
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category text NOT NULL,
    description text,
    amount numeric NOT NULL DEFAULT 0,
    expense_date date NOT NULL DEFAULT CURRENT_DATE,
    payment_method text,
    receipt_url text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Employees
CREATE TABLE IF NOT EXISTS public.employees (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id uuid,
    full_name text NOT NULL,
    email text,
    phone text,
    role text DEFAULT 'staff',
    department text,
    salary numeric DEFAULT 0,
    hire_date date DEFAULT CURRENT_DATE,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Business Modules
CREATE TABLE IF NOT EXISTS public.business_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    icon text,
    category text DEFAULT 'general',
    applicable_business_types text[] DEFAULT '{}',
    is_core boolean DEFAULT false,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.business_modules ENABLE ROW LEVEL SECURITY;

-- Tenant Modules
CREATE TABLE IF NOT EXISTS public.tenant_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    module_code text NOT NULL,
    is_enabled boolean DEFAULT true,
    enabled_at timestamp with time zone DEFAULT now(),
    enabled_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(tenant_id, module_code)
);
ALTER TABLE public.tenant_modules ENABLE ROW LEVEL SECURITY;

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    contact_name text,
    email text,
    phone text,
    address text,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Product Categories
CREATE TABLE IF NOT EXISTS public.product_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid,
    name text NOT NULL,
    description text,
    business_type text,
    is_system boolean DEFAULT false,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Hotel Rooms
CREATE TABLE IF NOT EXISTS public.hotel_rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_number text NOT NULL,
    room_type text DEFAULT 'standard',
    capacity integer DEFAULT 2,
    price_per_night numeric DEFAULT 0,
    status text DEFAULT 'available',
    amenities jsonb DEFAULT '[]',
    floor text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;

-- Room Bookings
CREATE TABLE IF NOT EXISTS public.room_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_id uuid NOT NULL REFERENCES public.hotel_rooms(id) ON DELETE CASCADE,
    guest_name text NOT NULL,
    guest_phone text,
    guest_email text,
    guest_id_number text,
    check_in_date date NOT NULL,
    check_out_date date NOT NULL,
    actual_check_in timestamp with time zone,
    actual_check_out timestamp with time zone,
    total_amount numeric DEFAULT 0,
    amount_paid numeric DEFAULT 0,
    status text DEFAULT 'reserved',
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;