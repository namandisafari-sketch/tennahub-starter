-- =====================================================
-- MISSING TABLES RESTORATION - PART 2: Report Cards & ECD
-- =====================================================

-- School subjects (separate from legacy subjects table)
CREATE TABLE IF NOT EXISTS public.school_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  level TEXT DEFAULT 'all',
  category TEXT DEFAULT 'core',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Student report cards
CREATE TABLE IF NOT EXISTS public.student_report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.school_classes(id),
  school_name TEXT,
  school_badge TEXT,
  student_name TEXT,
  student_photo TEXT,
  stream TEXT,
  roll_number TEXT,
  position_in_class INTEGER,
  total_students INTEGER,
  total_score NUMERIC(5,2) DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  class_teacher_comment TEXT,
  head_teacher_comment TEXT,
  class_teacher_signature TEXT,
  head_teacher_signature TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  fees_balance NUMERIC DEFAULT 0,
  next_term_fees NUMERIC DEFAULT 0,
  term_end_date DATE,
  next_term_start_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  UNIQUE(tenant_id, student_id, term_id)
);

-- Report card scores
CREATE TABLE IF NOT EXISTS public.report_card_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_card_id UUID NOT NULL REFERENCES public.student_report_cards(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.school_subjects(id) ON DELETE CASCADE,
  formative_score NUMERIC(5,2) DEFAULT 0,
  school_based_score NUMERIC(5,2) DEFAULT 0,
  total_score NUMERIC(5,2) GENERATED ALWAYS AS ((formative_score * 0.2) + (school_based_score * 0.8)) STORED,
  competency_score NUMERIC(3,2) DEFAULT 0,
  grade TEXT,
  grade_descriptor TEXT,
  subject_remark TEXT,
  teacher_name TEXT,
  teacher_initials TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(report_card_id, subject_id)
);

-- Report card skills
CREATE TABLE IF NOT EXISTS public.report_card_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_card_id UUID NOT NULL REFERENCES public.student_report_cards(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_category TEXT DEFAULT 'generic',
  rating TEXT,
  remark TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(report_card_id, skill_name)
);

-- Report card activities
CREATE TABLE IF NOT EXISTS public.report_card_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_card_id UUID NOT NULL REFERENCES public.student_report_cards(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  performance TEXT,
  remark TEXT,
  average_score NUMERIC,
  grade TEXT,
  teacher_initials TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student monthly attendance
CREATE TABLE IF NOT EXISTS public.student_monthly_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  days_present INTEGER DEFAULT 0,
  days_absent INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, student_id, term_id, month, year)
);

-- ECD Report cards
CREATE TABLE IF NOT EXISTS public.ecd_report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.academic_terms(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.school_classes(id),
  class_teacher_name TEXT,
  class_teacher_comment TEXT,
  head_teacher_name TEXT,
  head_teacher_comment TEXT,
  total_score NUMERIC(10,2) DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT NULL,
  class_rank INTEGER DEFAULT NULL,
  total_students_in_class INTEGER DEFAULT NULL,
  is_prefect BOOLEAN DEFAULT false,
  monthly_attendance JSONB DEFAULT '[]'::jsonb,
  fees_balance NUMERIC(12,2) DEFAULT 0,
  next_term_fees NUMERIC(12,2) DEFAULT 0,
  term_closing_date DATE,
  next_term_start_date DATE,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, student_id, term_id)
);

-- ECD Learning areas
CREATE TABLE IF NOT EXISTS public.ecd_learning_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ECD Learning ratings
CREATE TABLE IF NOT EXISTS public.ecd_learning_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_card_id UUID NOT NULL REFERENCES ecd_report_cards(id) ON DELETE CASCADE,
  learning_area_id UUID NOT NULL REFERENCES ecd_learning_areas(id) ON DELETE CASCADE,
  rating_code TEXT,
  comment TEXT,
  numeric_score NUMERIC(5,1) DEFAULT NULL,
  grade_remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_card_id, learning_area_id)
);

-- ECD Skills
CREATE TABLE IF NOT EXISTS public.ecd_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ECD Skills ratings
CREATE TABLE IF NOT EXISTS public.ecd_skills_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_card_id UUID NOT NULL REFERENCES ecd_report_cards(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES ecd_skills(id) ON DELETE CASCADE,
  rating_code TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_card_id, skill_id)
);

-- ECD Rating scale
CREATE TABLE IF NOT EXISTS public.ecd_rating_scale (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  numeric_value INTEGER DEFAULT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ECD Learning activities
CREATE TABLE IF NOT EXISTS public.ecd_learning_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📝',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ECD Activity ratings
CREATE TABLE IF NOT EXISTS public.ecd_activity_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_card_id UUID NOT NULL REFERENCES ecd_report_cards(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES ecd_learning_activities(id) ON DELETE CASCADE,
  rating_code TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_card_id, activity_id)
);

-- Enable RLS
ALTER TABLE public.school_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_card_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_card_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_card_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_monthly_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_learning_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_learning_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_skills_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_rating_scale ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecd_activity_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "School subjects access" ON public.school_subjects FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Student report cards access" ON public.student_report_cards FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Report card scores access" ON public.report_card_scores FOR ALL USING (report_card_id IN (SELECT id FROM student_report_cards WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Report card skills access" ON public.report_card_skills FOR ALL USING (report_card_id IN (SELECT id FROM student_report_cards WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Report card activities access" ON public.report_card_activities FOR ALL USING (report_card_id IN (SELECT id FROM student_report_cards WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Student monthly attendance access" ON public.student_monthly_attendance FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "ECD report cards access" ON public.ecd_report_cards FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "ECD learning areas access" ON public.ecd_learning_areas FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "ECD learning ratings access" ON public.ecd_learning_ratings FOR ALL USING (report_card_id IN (SELECT id FROM ecd_report_cards WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "ECD skills access" ON public.ecd_skills FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "ECD skills ratings access" ON public.ecd_skills_ratings FOR ALL USING (report_card_id IN (SELECT id FROM ecd_report_cards WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "ECD rating scale access" ON public.ecd_rating_scale FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "ECD learning activities access" ON public.ecd_learning_activities FOR ALL USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "ECD activity ratings access" ON public.ecd_activity_ratings FOR ALL USING (report_card_id IN (SELECT id FROM ecd_report_cards WHERE tenant_id = get_user_tenant_id()));