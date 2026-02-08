export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admission_settings: {
        Row: {
          academic_year: string | null
          admission_fee_amount: number | null
          created_at: string | null
          disclaimer_text: string | null
          id: string
          is_open: boolean | null
          link_validity_hours: number | null
          require_birth_certificate: boolean | null
          require_photo: boolean | null
          require_previous_school_records: boolean | null
          rules_and_regulations: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          admission_fee_amount?: number | null
          created_at?: string | null
          disclaimer_text?: string | null
          id?: string
          is_open?: boolean | null
          link_validity_hours?: number | null
          require_birth_certificate?: boolean | null
          require_photo?: boolean | null
          require_previous_school_records?: boolean | null
          rules_and_regulations?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          admission_fee_amount?: number | null
          created_at?: string | null
          disclaimer_text?: string | null
          id?: string
          is_open?: boolean | null
          link_validity_hours?: number | null
          require_birth_certificate?: boolean | null
          require_photo?: boolean | null
          require_previous_school_records?: boolean | null
          rules_and_regulations?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admission_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          starts_at: string | null
          target_business_types: string[] | null
          target_roles: string[] | null
          title: string
          type: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          target_business_types?: string[] | null
          target_roles?: string[] | null
          title: string
          type?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string | null
          target_business_types?: string[] | null
          target_roles?: string[] | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          tenant_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          tenant_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      bursar_rules: {
        Row: {
          alert_message: string | null
          balance_amount: number | null
          balance_operator: string | null
          class_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          requirement_id: string | null
          rule_name: string
          rule_type: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          alert_message?: string | null
          balance_amount?: number | null
          balance_operator?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          requirement_id?: string | null
          rule_name: string
          rule_type: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          alert_message?: string | null
          balance_amount?: number | null
          balance_operator?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          requirement_id?: string | null
          rule_name?: string
          rule_type?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bursar_rules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bursar_rules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      business_modules: {
        Row: {
          applicable_business_types: string[] | null
          category: string | null
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_core: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          applicable_business_types?: string[] | null
          category?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_core?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          applicable_business_types?: string[] | null
          category?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_core?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          current_balance: number | null
          customer_type: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          customer_type?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          current_balance?: number | null
          customer_type?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      early_departure_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          gate_checkin_id: string | null
          id: string
          reason: string
          requested_at: string | null
          requested_by: string | null
          status: string | null
          student_id: string
          tenant_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          gate_checkin_id?: string | null
          id?: string
          reason: string
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
          student_id: string
          tenant_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          gate_checkin_id?: string | null
          id?: string
          reason?: string
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
          student_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "early_departure_requests_gate_checkin_id_fkey"
            columns: ["gate_checkin_id"]
            isOneToOne: false
            referencedRelation: "gate_checkins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "early_departure_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "early_departure_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string | null
          salary: number | null
          tenant_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string | null
          salary?: number | null
          tenant_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string | null
          salary?: number | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          payment_method: string | null
          receipt_url: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_url?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_checkins: {
        Row: {
          check_type: string
          checked_at: string | null
          created_at: string | null
          id: string
          is_late: boolean | null
          notes: string | null
          student_id: string
          tenant_id: string
        }
        Insert: {
          check_type?: string
          checked_at?: string | null
          created_at?: string | null
          id?: string
          is_late?: boolean | null
          notes?: string | null
          student_id: string
          tenant_id: string
        }
        Update: {
          check_type?: string
          checked_at?: string | null
          created_at?: string | null
          id?: string
          is_late?: boolean | null
          notes?: string | null
          student_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_checkins_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_checkins_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_override_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          blocking_reasons: string[] | null
          created_at: string | null
          gate_checkin_id: string | null
          id: string
          reason: string
          requested_at: string | null
          requested_by: string | null
          status: string | null
          student_id: string
          tenant_id: string
          valid_until: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          blocking_reasons?: string[] | null
          created_at?: string | null
          gate_checkin_id?: string | null
          id?: string
          reason: string
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
          student_id: string
          tenant_id: string
          valid_until?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          blocking_reasons?: string[] | null
          created_at?: string | null
          gate_checkin_id?: string | null
          id?: string
          reason?: string
          requested_at?: string | null
          requested_by?: string | null
          status?: string | null
          student_id?: string
          tenant_id?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_override_requests_gate_checkin_id_fkey"
            columns: ["gate_checkin_id"]
            isOneToOne: false
            referencedRelation: "gate_checkins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_override_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_override_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_rooms: {
        Row: {
          amenities: Json | null
          capacity: number | null
          created_at: string | null
          floor: string | null
          id: string
          is_active: boolean | null
          price_per_night: number | null
          room_number: string
          room_type: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          amenities?: Json | null
          capacity?: number | null
          created_at?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean | null
          price_per_night?: number | null
          room_number: string
          room_type?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          amenities?: Json | null
          capacity?: number | null
          created_at?: string | null
          floor?: string | null
          id?: string
          is_active?: boolean | null
          price_per_night?: number | null
          room_number?: string
          room_type?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rooms_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      marketers: {
        Row: {
          approved_signups: number | null
          created_at: string | null
          daily_rate: number | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          referral_code: string
          total_earned: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_signups?: number | null
          created_at?: string | null
          daily_rate?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          referral_code: string
          total_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_signups?: number | null
          created_at?: string | null
          daily_rate?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          referral_code?: string
          total_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          business_type: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_branches: number | null
          max_products: number | null
          max_users: number | null
          monthly_price: number
          name: string
          updated_at: string | null
          yearly_price: number | null
        }
        Insert: {
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_branches?: number | null
          max_products?: number | null
          max_users?: number | null
          monthly_price?: number
          name: string
          updated_at?: string | null
          yearly_price?: number | null
        }
        Update: {
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_branches?: number | null
          max_products?: number | null
          max_users?: number | null
          monthly_price?: number
          name?: string
          updated_at?: string | null
          yearly_price?: number | null
        }
        Relationships: []
      }
      payment_uploads: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          package_id: string
          payment_method: string | null
          receipt_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          tenant_id: string
          transaction_ref: string | null
          uploader_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          package_id: string
          payment_method?: string | null
          receipt_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tenant_id: string
          transaction_ref?: string | null
          uploader_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          package_id?: string
          payment_method?: string | null
          receipt_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tenant_id?: string
          transaction_ref?: string | null
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_uploads_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_uploads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          business_type: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          name: string
          tenant_id: string | null
        }
        Insert: {
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name: string
          tenant_id?: string | null
        }
        Update: {
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          name?: string
          tenant_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          min_stock_level: number | null
          name: string
          sku: string | null
          stock_quantity: number | null
          tenant_id: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_stock_level?: number | null
          name: string
          sku?: string | null
          stock_quantity?: number | null
          tenant_id: string
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          min_stock_level?: number | null
          name?: string
          sku?: string | null
          stock_quantity?: number | null
          tenant_id?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          phone: string | null
          role: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          permissions?: Json | null
          phone?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          phone?: string | null
          role?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          capacity: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          location_zone: string | null
          status: string | null
          table_number: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_zone?: string | null
          status?: string | null
          table_number: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_zone?: string | null
          status?: string | null
          table_number?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      room_bookings: {
        Row: {
          actual_check_in: string | null
          actual_check_out: string | null
          amount_paid: number | null
          check_in_date: string
          check_out_date: string
          created_at: string | null
          created_by: string | null
          guest_email: string | null
          guest_id_number: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          notes: string | null
          room_id: string
          status: string | null
          tenant_id: string
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          amount_paid?: number | null
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          created_by?: string | null
          guest_email?: string | null
          guest_id_number?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          room_id: string
          status?: string | null
          tenant_id: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          amount_paid?: number | null
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          created_by?: string | null
          guest_email?: string | null
          guest_id_number?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          room_id?: string
          status?: string | null
          tenant_id?: string
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          order_number: number | null
          order_status: string | null
          order_type: string | null
          payment_method: string | null
          payment_status: string | null
          sale_date: string | null
          table_id: string | null
          tax_amount: number | null
          tenant_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: number | null
          order_status?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          sale_date?: string | null
          table_id?: string | null
          tax_amount?: number | null
          tenant_id: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: number | null
          order_status?: string | null
          order_type?: string | null
          payment_method?: string | null
          payment_status?: string | null
          sale_date?: string | null
          table_id?: string | null
          tax_amount?: number | null
          tenant_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      school_classes: {
        Row: {
          capacity: number | null
          class_teacher_id: string | null
          created_at: string | null
          grade: string
          id: string
          id_card_expiry_date: string | null
          is_active: boolean | null
          level: string
          name: string
          section: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          class_teacher_id?: string | null
          created_at?: string | null
          grade: string
          id?: string
          id_card_expiry_date?: string | null
          is_active?: boolean | null
          level: string
          name: string
          section?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          class_teacher_id?: string | null
          created_at?: string | null
          grade?: string
          id?: string
          id_card_expiry_date?: string | null
          is_active?: boolean | null
          level?: string
          name?: string
          section?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_classes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      school_settings: {
        Row: {
          admission_format: string | null
          admission_prefix: string | null
          class_naming_format: string | null
          created_at: string | null
          id: string
          streams: string[] | null
          student_id_digits: number | null
          student_id_prefix: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          admission_format?: string | null
          admission_prefix?: string | null
          class_naming_format?: string | null
          created_at?: string | null
          id?: string
          streams?: string[] | null
          student_id_digits?: number | null
          student_id_prefix?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          admission_format?: string | null
          admission_prefix?: string | null
          class_naming_format?: string | null
          created_at?: string | null
          id?: string
          streams?: string[] | null
          student_id_digits?: number | null
          student_id_prefix?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          admission_number: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string
          gender: string | null
          id: string
          is_active: boolean | null
          parent_id: string | null
          photo_url: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          admission_number?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          photo_url?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          admission_number?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          parent_id?: string | null
          photo_url?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_modules: {
        Row: {
          created_at: string | null
          enabled_at: string | null
          enabled_by: string | null
          id: string
          is_enabled: boolean | null
          module_code: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_enabled?: boolean | null
          module_code: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          enabled_at?: string | null
          enabled_by?: string | null
          id?: string
          is_enabled?: boolean | null
          module_code?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_modules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          activated_at: string | null
          address: string | null
          business_code: string | null
          business_type: string | null
          created_at: string | null
          email: string | null
          id: string
          is_trial: boolean | null
          late_arrival_minutes: number | null
          logo_url: string | null
          name: string
          package_id: string | null
          parent_login_code: string | null
          phone: string | null
          referral_code: string | null
          referred_by_code: string | null
          renter_login_code: string | null
          require_early_departure_reason: boolean | null
          school_end_time: string | null
          school_start_time: string | null
          settings: Json | null
          status: string | null
          subscription_end_date: string | null
          trial_days: number | null
          trial_end_date: string | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          address?: string | null
          business_code?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_trial?: boolean | null
          late_arrival_minutes?: number | null
          logo_url?: string | null
          name: string
          package_id?: string | null
          parent_login_code?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by_code?: string | null
          renter_login_code?: string | null
          require_early_departure_reason?: boolean | null
          school_end_time?: string | null
          school_start_time?: string | null
          settings?: Json | null
          status?: string | null
          subscription_end_date?: string | null
          trial_days?: number | null
          trial_end_date?: string | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          address?: string | null
          business_code?: string | null
          business_type?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_trial?: boolean | null
          late_arrival_minutes?: number | null
          logo_url?: string | null
          name?: string
          package_id?: string | null
          parent_login_code?: string | null
          phone?: string | null
          referral_code?: string | null
          referred_by_code?: string | null
          renter_login_code?: string | null
          require_early_departure_reason?: boolean | null
          school_end_time?: string | null
          school_start_time?: string | null
          settings?: Json | null
          status?: string | null
          subscription_end_date?: string | null
          trial_days?: number | null
          trial_end_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenants_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      term_requirements: {
        Row: {
          amount: number
          class_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          tenant_id: string
          term: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tenant_id: string
          term?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          class_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tenant_id?: string
          term?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "term_requirements_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "school_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "term_requirements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: { Args: never; Returns: string }
      get_user_tenant_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "superadmin"
        | "admin"
        | "tenant_owner"
        | "director"
        | "branch_manager"
        | "staff"
        | "accountant"
        | "marketer"
        | "customer"
        | "parent"
        | "renter"
      payment_status: "pending" | "approved" | "rejected"
      tenant_status: "pending" | "active" | "suspended" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "superadmin",
        "admin",
        "tenant_owner",
        "director",
        "branch_manager",
        "staff",
        "accountant",
        "marketer",
        "customer",
        "parent",
        "renter",
      ],
      payment_status: ["pending", "approved", "rejected"],
      tenant_status: ["pending", "active", "suspended", "rejected"],
    },
  },
} as const
