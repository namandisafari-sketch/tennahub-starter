-- =====================================================
-- COMPREHENSIVE DATABASE RESTORATION - PART 2
-- RLS Policies for all new tables
-- =====================================================

-- Audit Logs RLS
CREATE POLICY "Admins can view all logs" ON public.audit_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('superadmin', 'admin')));

-- Customers RLS
CREATE POLICY "Users can view their tenant customers" ON public.customers
  FOR SELECT USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can insert customers for their tenant" ON public.customers
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can update their tenant customers" ON public.customers
  FOR UPDATE USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can delete their tenant customers" ON public.customers
  FOR DELETE USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Products RLS
CREATE POLICY "Users can view their tenant products" ON public.products
  FOR SELECT USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()) OR is_active = true);
CREATE POLICY "Users can insert products for their tenant" ON public.products
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can update their tenant products" ON public.products
  FOR UPDATE USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can delete their tenant products" ON public.products
  FOR DELETE USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Sales RLS
CREATE POLICY "Users can view their tenant sales" ON public.sales
  FOR SELECT USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can insert sales for their tenant" ON public.sales
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can update their tenant sales" ON public.sales
  FOR UPDATE USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can delete their tenant sales" ON public.sales
  FOR DELETE USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Sale Items RLS
CREATE POLICY "Users can manage sale items" ON public.sale_items FOR ALL
  USING (sale_id IN (SELECT id FROM sales WHERE tenant_id = get_user_tenant_id()));

-- Marketers RLS
CREATE POLICY "Admins can manage marketers" ON public.marketers
  USING (is_admin(auth.uid()));
CREATE POLICY "Marketers can view their own data" ON public.marketers
  FOR SELECT USING (user_id = auth.uid());

-- Payment Uploads RLS
CREATE POLICY "Users can view their tenant payments" ON public.payment_uploads
  FOR SELECT USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can insert payments" ON public.payment_uploads
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Settings RLS
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.settings
  USING (is_admin(auth.uid()));

-- Restaurant Tables RLS
CREATE POLICY "Restaurant tables access" ON public.restaurant_tables FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()) OR is_active = true);

-- Menu Categories RLS
CREATE POLICY "Menu categories access" ON public.menu_categories FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()) OR is_active = true);

-- Expenses RLS
CREATE POLICY "Expenses access" ON public.expenses FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Employees RLS
CREATE POLICY "Employees access" ON public.employees FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Business Modules RLS
CREATE POLICY "Anyone can view active modules" ON public.business_modules
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage modules" ON public.business_modules
  USING (is_admin(auth.uid()));

-- Tenant Modules RLS
CREATE POLICY "Tenant modules access" ON public.tenant_modules FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Suppliers RLS
CREATE POLICY "Suppliers access" ON public.suppliers FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Product Categories RLS
CREATE POLICY "Categories access" ON public.product_categories
  FOR SELECT USING (is_system = true OR tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));
CREATE POLICY "Users can manage their tenant categories" ON public.product_categories FOR ALL
  USING (tenant_id = get_user_tenant_id() AND is_system = false);

-- Hotel Rooms RLS
CREATE POLICY "Hotel rooms access" ON public.hotel_rooms FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- Room Bookings RLS
CREATE POLICY "Room bookings access" ON public.room_bookings FOR ALL
  USING (tenant_id = get_user_tenant_id() OR is_admin(auth.uid()));

-- =====================================================
-- TRIGGERS
-- =====================================================
DROP TRIGGER IF EXISTS set_tenant_referral_code_trigger ON public.tenants;
CREATE TRIGGER set_tenant_referral_code_trigger 
  BEFORE INSERT ON public.tenants 
  FOR EACH ROW EXECUTE FUNCTION public.set_tenant_referral_code();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketers_updated_at BEFORE UPDATE ON public.marketers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_restaurant_tables_updated_at BEFORE UPDATE ON public.restaurant_tables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_modules_updated_at BEFORE UPDATE ON public.business_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hotel_rooms_updated_at BEFORE UPDATE ON public.hotel_rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON public.room_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_customers_tenant ON public.customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sales_tenant ON public.sales(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON public.sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON public.sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_expenses_tenant ON public.expenses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_employees_tenant ON public.employees(tenant_id);