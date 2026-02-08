-- =====================================================
-- COMPREHENSIVE DATABASE RESTORATION - PART 3 (Fixed)
-- Seed Data: Business Modules and Categories
-- =====================================================

-- Insert default business modules
INSERT INTO public.business_modules (code, name, description, icon, category, applicable_business_types, is_core, display_order) VALUES
-- Core modules (all businesses)
('dashboard', 'Dashboard', 'Business overview and analytics', 'LayoutDashboard', 'core', '{}', true, 1),
('pos', 'Point of Sale', 'Process sales and transactions', 'ShoppingCart', 'core', '{}', true, 2),
('products', 'Products & Inventory', 'Manage products and stock', 'Package', 'core', '{}', true, 3),
('sales', 'Sales & Orders', 'View and manage orders', 'Receipt', 'core', '{}', true, 4),
('customers', 'Customers', 'Customer management', 'Users', 'core', '{}', true, 5),
('employees', 'Employees', 'Staff management', 'UserCircle', 'core', '{}', true, 6),
('expenses', 'Expenses', 'Track business expenses', 'Wallet', 'core', '{}', true, 7),
('reports', 'Reports', 'Business reports and analytics', 'BarChart3', 'core', '{}', true, 8),
('settings', 'Settings', 'Business settings', 'Settings', 'core', '{}', true, 100),
-- Restaurant/Bar/Cafe modules
('menu', 'Menu Management', 'Create and manage food/drink menus', 'UtensilsCrossed', 'restaurant', ARRAY['restaurant', 'bar', 'cafe'], false, 10),
('tables', 'Table Management', 'Manage restaurant tables', 'MapPin', 'restaurant', ARRAY['restaurant', 'bar', 'cafe'], false, 11),
('qr_menu', 'QR Code Menus', 'Digital menus with QR codes', 'QrCode', 'restaurant', ARRAY['restaurant', 'bar', 'cafe'], false, 12),
('kitchen', 'Kitchen Display', 'Kitchen order management', 'ChefHat', 'restaurant', ARRAY['restaurant', 'bar', 'cafe'], false, 13),
-- Hotel/Lodge modules
('rooms', 'Room Management', 'Manage hotel rooms', 'Bed', 'hotel', ARRAY['hotel', 'lodge', 'guest_house'], false, 20),
('bookings', 'Room Bookings', 'Manage reservations', 'CalendarDays', 'hotel', ARRAY['hotel', 'lodge', 'guest_house'], false, 21),
-- Salon/Spa modules
('services', 'Services', 'Manage service offerings', 'Scissors', 'salon', ARRAY['salon', 'spa', 'barber'], false, 30),
('appointments', 'Appointments', 'Schedule and manage appointments', 'Calendar', 'salon', ARRAY['salon', 'spa', 'barber'], false, 31),
-- Pharmacy/Healthcare modules
('prescriptions', 'Prescriptions', 'Manage prescriptions', 'Pill', 'pharmacy', ARRAY['pharmacy', 'hospital', 'clinic'], false, 40),
('patients', 'Patients', 'Patient records management', 'HeartPulse', 'pharmacy', ARRAY['pharmacy', 'hospital', 'clinic'], false, 41),
-- Repair/Workshop modules
('jobs', 'Job Cards', 'Track repair jobs', 'Wrench', 'repair', ARRAY['garage', 'repair_shop', 'tech_repair'], false, 50),
('parts', 'Spare Parts', 'Parts inventory', 'Cog', 'repair', ARRAY['garage', 'repair_shop', 'tech_repair', 'car_spares'], false, 51),
-- School modules
('students', 'Students', 'Manage student enrollment and records', 'Users', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 10),
('classes', 'Classes', 'Manage school classes', 'Layout', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 11),
('fees', 'Fees', 'Student fees management', 'DollarSign', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 12),
('attendance', 'Attendance', 'Track student attendance', 'ClipboardCheck', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 13),
('exams', 'Exams', 'Manage examinations', 'FileText', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 14),
('report_cards', 'Report Cards', 'Generate student reports', 'FileSpreadsheet', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 15),
('parents', 'Parents', 'Parent management and communication', 'Users', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 16),
('staff', 'Staff', 'School staff management', 'UserCircle', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 17),
('gate', 'Gate Check-in', 'Student check-in and check-out', 'DoorOpen', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 18),
('student_cards', 'Student ID Cards', 'Generate student ID cards', 'CreditCard', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 19),
('letters', 'Letters', 'Create and manage letters', 'Mail', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 20),
('visitor_register', 'Visitor Register', 'Track school visitors', 'ClipboardList', 'school', ARRAY['kindergarten', 'primary_school', 'secondary_school', 'school'], false, 21),
-- Rental modules
('properties', 'Properties', 'Manage rental properties', 'Building', 'rental', ARRAY['rental', 'property_management'], false, 60),
('units', 'Units', 'Manage rental units', 'Home', 'rental', ARRAY['rental', 'property_management'], false, 61),
('tenants_rental', 'Tenants', 'Manage property tenants', 'Users', 'rental', ARRAY['rental', 'property_management'], false, 62),
('leases', 'Leases', 'Manage lease agreements', 'FileText', 'rental', ARRAY['rental', 'property_management'], false, 63),
('maintenance', 'Maintenance', 'Track maintenance requests', 'Wrench', 'rental', ARRAY['rental', 'property_management'], false, 64)
ON CONFLICT (code) DO NOTHING;

-- Insert system product categories
INSERT INTO public.product_categories (name, business_type, is_system, display_order) VALUES
-- Restaurant categories
('Appetizers', 'restaurant', true, 1),
('Main Course', 'restaurant', true, 2),
('Beverages', 'restaurant', true, 3),
('Desserts', 'restaurant', true, 4),
('Sides', 'restaurant', true, 5),
('Soups & Salads', 'restaurant', true, 6),
-- Supermarket categories
('Groceries', 'supermarket', true, 1),
('Fresh Produce', 'supermarket', true, 2),
('Dairy & Eggs', 'supermarket', true, 3),
('Meat & Poultry', 'supermarket', true, 4),
('Snacks & Confectionery', 'supermarket', true, 6),
('Household Items', 'supermarket', true, 7),
('Personal Care', 'supermarket', true, 8),
-- Pharmacy categories
('Prescription Drugs', 'pharmacy', true, 1),
('Over-the-Counter', 'pharmacy', true, 2),
('Vitamins & Supplements', 'pharmacy', true, 3),
('Medical Devices', 'pharmacy', true, 5),
-- Salon categories
('Hair Services', 'salon', true, 1),
('Nail Services', 'salon', true, 2),
('Skincare', 'salon', true, 3),
('Hair Products', 'salon', true, 4),
-- Hardware categories
('Tools', 'hardware', true, 1),
('Electrical', 'hardware', true, 2),
('Plumbing', 'hardware', true, 3),
('Building Materials', 'hardware', true, 4),
-- General categories
('General', 'other', true, 1),
('Electronics', 'other', true, 2),
('Clothing', 'other', true, 3),
('Accessories', 'other', true, 4),
('Services', 'other', true, 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ADDITIONAL TABLES/COLUMNS (without altering role type)
-- =====================================================

-- Profiles additions
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branch_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{}';

-- Packages additions
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS business_type text;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS monthly_price numeric DEFAULT 0;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS yearly_price numeric;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS max_users integer DEFAULT 5;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS max_branches integer DEFAULT 1;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS max_products integer;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS features jsonb;
ALTER TABLE public.packages ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Add Tenants INSERT policy for signup
DROP POLICY IF EXISTS "Authenticated users can create tenants" ON public.tenants;
CREATE POLICY "Authenticated users can create tenants" ON public.tenants
  FOR INSERT TO authenticated WITH CHECK (true);

-- Add Tenants UPDATE policy
DROP POLICY IF EXISTS "Tenant owners can update their tenant" ON public.tenants;
CREATE POLICY "Tenant owners can update their tenant" ON public.tenants
  FOR UPDATE USING (id = get_user_tenant_id() OR is_admin(auth.uid()));