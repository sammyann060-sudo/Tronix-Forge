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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      bot_runs: {
        Row: {
          bot_id: string | null
          bot_name: string
          id: string
          martingale: number
          profit: number
          stake: number
          started_at: string
          status: string
          stop_loss: number
          stopped_at: string | null
          symbol: string
          take_profit: number
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          bot_name: string
          id?: string
          martingale?: number
          profit?: number
          stake?: number
          started_at?: string
          status?: string
          stop_loss?: number
          stopped_at?: string | null
          symbol: string
          take_profit?: number
          user_id: string
        }
        Update: {
          bot_id?: string | null
          bot_name?: string
          id?: string
          martingale?: number
          profit?: number
          stake?: number
          started_at?: string
          status?: string
          stop_loss?: number
          stopped_at?: string | null
          symbol?: string
          take_profit?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_runs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      bots: {
        Row: {
          created_at: string
          description: string
          id: string
          market: string
          name: string
          source: string
          status: string
          credits_used: number
          user_id: string
          xml: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          market?: string
          name: string
          source?: string
          status?: string
          credits_used?: number
          user_id: string
          xml: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          market?: string
          name?: string
          source?: string
          status?: string
          credits_used?: number
          user_id?: string
          xml?: string
        }
        Relationships: [
          {
            foreignKeyName: "bots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deriv_accounts: {
        Row: {
          account_type: string
          api_token: string
          balance: number
          created_at: string
          currency: string
          id: string
          login_id: string
          status: string
          user_id: string
        }
        Insert: {
          account_type?: string
          api_token: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          login_id: string
          status?: string
          user_id: string
        }
        Update: {
          account_type?: string
          api_token?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          login_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      hosting_requests: {
        Row: {
          amount_usd: number
          brand: Json
          chosen_domain: string | null
          created_at: string
          domains: string[]
          id: string
          notes: string | null
          paid: boolean
          requested_by: string
          status: string
          user_id: string
        }
        Insert: {
          amount_usd?: number
          brand: Json
          chosen_domain?: string | null
          created_at?: string
          domains?: string[]
          id?: string
          notes?: string | null
          paid?: boolean
          requested_by: string
          status?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          brand?: Json
          chosen_domain?: string | null
          created_at?: string
          domains?: string[]
          id?: string
          notes?: string | null
          paid?: boolean
          requested_by?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          status: string
          plan: string
          ai_credits: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string
          status?: string
          plan?: string
          ai_credits?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          status?: string
          plan?: string
          ai_credits?: number
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          active: boolean
          created_at: string
          id: string
          kind: string
          name: string
          sort_order: number
          units: string
          usd: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          kind: string
          name: string
          sort_order?: number
          units: string
          usd?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          kind?: string
          name?: string
          sort_order?: number
          units?: string
          usd?: number
        }
        Relationships: []
      }
      package_purchases: {
        Row: {
          amount_usd: number
          created_at: string
          id: string
          package_id: string | null
          payment_method: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_usd?: number
          created_at?: string
          id?: string
          package_id?: string | null
          payment_method?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          created_at?: string
          id?: string
          package_id?: string | null
          payment_method?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          contract_id: string | null
          contract_type: string
          created_at: string
          entry_spot: number | null
          exit_spot: number | null
          id: string
          payout: number
          profit: number
          run_id: string | null
          stake: number
          status: string
          symbol: string
          user_id: string
        }
        Insert: {
          contract_id?: string | null
          contract_type: string
          created_at?: string
          entry_spot?: number | null
          exit_spot?: number | null
          id?: string
          payout?: number
          profit?: number
          run_id?: string | null
          stake?: number
          status?: string
          symbol: string
          user_id: string
        }
        Update: {
          contract_id?: string | null
          contract_type?: string
          created_at?: string
          entry_spot?: number | null
          exit_spot?: number | null
          id?: string
          payout?: number
          profit?: number
          run_id?: string | null
          stake?: number
          status?: string
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "bot_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
