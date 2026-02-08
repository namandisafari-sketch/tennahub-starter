-- =====================================================
-- MISSING TABLES RESTORATION - PART 4C: Remaining Tables (Only New)
-- =====================================================

-- School packages table
CREATE TABLE IF NOT EXISTS public.school_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  school_level TEXT NOT NULL DEFAULT 'all',
  price_per_term NUMERIC NOT NULL,
  student_limit INTEGER,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- School subscriptions table
CREATE TABLE IF NOT EXISTS public.school_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.school_packages(id),
  term_id UUID NOT NULL REFERENCES public.academic_terms(id),
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT DEFAULT 'pending',
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, term_id)
);

-- Purchase orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.suppliers(id),
  order_number TEXT NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_date DATE,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Purchase order items table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  received_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Installation purchases table
CREATE TABLE IF NOT EXISTS public.installation_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  business_address TEXT,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  installation_date DATE,
  installation_notes TEXT,
  installed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- School holidays table
CREATE TABLE IF NOT EXISTS public.school_holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  type TEXT DEFAULT 'holiday',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_company TEXT,
  author_photo_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teacher class assignments table
CREATE TABLE IF NOT EXISTS public.teacher_class_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  is_class_teacher BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

-- Teacher subject assignments table
CREATE TABLE IF NOT EXISTS public.teacher_subject_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID REFERENCES school_classes(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, subject_id, class_id)
);

-- Enable RLS on new tables
ALTER TABLE public.school_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subject_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies - using DROP IF EXISTS to avoid duplicates
DROP POLICY IF EXISTS "School packages viewable by all" ON public.school_packages;
CREATE POLICY "School packages viewable by all" ON public.school_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "School subscriptions access" ON public.school_subscriptions;
CREATE POLICY "School subscriptions access" ON public.school_subscriptions FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Purchase orders access" ON public.purchase_orders;
CREATE POLICY "Purchase orders access" ON public.purchase_orders FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Purchase order items access" ON public.purchase_order_items;
CREATE POLICY "Purchase order items access" ON public.purchase_order_items FOR ALL USING (purchase_order_id IN (SELECT id FROM purchase_orders WHERE tenant_id = get_user_tenant_id()));

DROP POLICY IF EXISTS "Installation purchases access" ON public.installation_purchases;
CREATE POLICY "Installation purchases access" ON public.installation_purchases FOR ALL USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "School holidays access" ON public.school_holidays;
CREATE POLICY "School holidays access" ON public.school_holidays FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Testimonials viewable by all" ON public.testimonials;
CREATE POLICY "Testimonials viewable by all" ON public.testimonials FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Testimonials admin access" ON public.testimonials;
CREATE POLICY "Testimonials admin access" ON public.testimonials FOR ALL USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Teacher class assignments access" ON public.teacher_class_assignments;
CREATE POLICY "Teacher class assignments access" ON public.teacher_class_assignments FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

DROP POLICY IF EXISTS "Teacher subject assignments access" ON public.teacher_subject_assignments;
CREATE POLICY "Teacher subject assignments access" ON public.teacher_subject_assignments FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));