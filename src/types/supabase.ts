export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          component_id: string | null
          event_action: string | null
          event_category: string | null
          event_label: string | null
          event_type: string
          event_value: string | null
          id: string
          metadata: Json | null
          occurred_at: string | null
          page_url: string | null
          visit_id: string
          visitor_id: string
          website_id: string | null
        }
        Insert: {
          component_id?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_type: string
          event_value?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          page_url?: string | null
          visit_id: string
          visitor_id: string
          website_id?: string | null
        }
        Update: {
          component_id?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_type?: string
          event_value?: string | null
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          page_url?: string | null
          visit_id?: string
          visitor_id?: string
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      pageviews: {
        Row: {
          id: string
          is_entrance: boolean | null
          is_exit: boolean | null
          page_title: string | null
          referrer: string | null
          time_on_page: number | null
          url: string
          viewed_at: string | null
          visit_id: string
          visitor_id: string
          website_id: string | null
        }
        Insert: {
          id?: string
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_title?: string | null
          referrer?: string | null
          time_on_page?: number | null
          url: string
          viewed_at?: string | null
          visit_id: string
          visitor_id: string
          website_id?: string | null
        }
        Update: {
          id?: string
          is_entrance?: boolean | null
          is_exit?: boolean | null
          page_title?: string | null
          referrer?: string | null
          time_on_page?: number | null
          url?: string
          viewed_at?: string | null
          visit_id?: string
          visitor_id?: string
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pageviews_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pageviews_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pageviews_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          browser: string | null
          browser_version: string | null
          city: string | null
          country: string | null
          device_type: string | null
          first_visit_at: string | null
          id: string
          ip_address: string | null
          language: string | null
          last_visit_at: string | null
          os: string | null
          os_version: string | null
          referrer: string | null
          region: string | null
          screen_height: number | null
          screen_width: number | null
          timezone: string | null
          user_agent: string | null
          user_id: string | null
          visit_count: number | null
          website_id: string | null
        }
        Insert: {
          browser?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          first_visit_at?: string | null
          id?: string
          ip_address?: string | null
          language?: string | null
          last_visit_at?: string | null
          os?: string | null
          os_version?: string | null
          referrer?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          timezone?: string | null
          user_agent?: string | null
          user_id?: string | null
          visit_count?: number | null
          website_id?: string | null
        }
        Update: {
          browser?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          first_visit_at?: string | null
          id?: string
          ip_address?: string | null
          language?: string | null
          last_visit_at?: string | null
          os?: string | null
          os_version?: string | null
          referrer?: string | null
          region?: string | null
          screen_height?: number | null
          screen_width?: number | null
          timezone?: string | null
          user_agent?: string | null
          user_id?: string | null
          visit_count?: number | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitors_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          duration: number | null
          ended_at: string | null
          entry_page: string | null
          exit_page: string | null
          id: string
          is_active: boolean | null
          referrer: string | null
          started_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          duration?: number | null
          ended_at?: string | null
          entry_page?: string | null
          exit_page?: string | null
          id?: string
          is_active?: boolean | null
          referrer?: string | null
          started_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          duration?: number | null
          ended_at?: string | null
          entry_page?: string | null
          exit_page?: string | null
          id?: string
          is_active?: boolean | null
          referrer?: string | null
          started_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      websites: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          pageview_count: number | null
          tracking_code: string | null
          updated_at: string | null
          url: string
          user_id: string
          visitor_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pageview_count?: number | null
          tracking_code?: string | null
          updated_at?: string | null
          url: string
          user_id: string
          visitor_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pageview_count?: number | null
          tracking_code?: string | null
          updated_at?: string | null
          url?: string
          user_id?: string
          visitor_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      invoke_cleanup_unverified_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
