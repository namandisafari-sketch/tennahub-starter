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
      get_user_tenant_id: { Args: never; Returns: string }
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
    },
  },
} as const
