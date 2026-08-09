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
      bot_guilds: {
        Row: {
          added_at: string | null
          guild_id: string
          guild_name: string
          id: string
        }
        Insert: {
          added_at?: string | null
          guild_id: string
          guild_name: string
          id?: string
        }
        Update: {
          added_at?: string | null
          guild_id?: string
          guild_name?: string
          id?: string
        }
        Relationships: []
      }
      execution_logs: {
        Row: {
          bot_user_id: string | null
          channel_id: string
          created_at: string
          error: string | null
          guild_id: string
          id: string
          job_id: string
          project_id: string
          requester_id: string
          status: string
        }
        Insert: {
          bot_user_id?: string | null
          channel_id: string
          created_at?: string
          error?: string | null
          guild_id: string
          id?: string
          job_id: string
          project_id: string
          requester_id: string
          status: string
        }
        Update: {
          bot_user_id?: string | null
          channel_id?: string
          created_at?: string
          error?: string | null
          guild_id?: string
          id?: string
          job_id?: string
          project_id?: string
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "workflow_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_memberships: {
        Row: {
          auth_user_id: string
          guild_id: string
          guild_name: string
          is_owner: boolean
          permissions: string
          synced_at: string
        }
        Insert: {
          auth_user_id: string
          guild_id: string
          guild_name: string
          is_owner?: boolean
          permissions: string
          synced_at?: string
        }
        Update: {
          auth_user_id?: string
          guild_id?: string
          guild_name?: string
          is_owner?: boolean
          permissions?: string
          synced_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          channel_id: string | null
          created_at: string
          definition: Json
          description: string | null
          guild_id: string | null
          id: string
          name: string
          owner_id: string
          published_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          channel_id?: string | null
          created_at?: string
          definition: Json
          description?: string | null
          guild_id?: string | null
          id: string
          name: string
          owner_id: string
          published_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel_id?: string | null
          created_at?: string
          definition?: Json
          description?: string | null
          guild_id?: string | null
          id?: string
          name?: string
          owner_id?: string
          published_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string
          definition: Json
          description: string | null
          id: string
          name: string
          owner_id: string | null
          schema_version: number
          scope: string
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          definition: Json
          description?: string | null
          id: string
          name: string
          owner_id?: string | null
          schema_version?: number
          scope?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          definition?: Json
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          schema_version?: number
          scope?: string
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      user_guilds: {
        Row: {
          guild_id: string
          guild_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          guild_id: string
          guild_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          guild_id?: string
          guild_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_guilds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          auth_user_id: string
          selected_guild_id: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          selected_guild_id?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          selected_guild_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_selected_guild_fkey"
            columns: ["auth_user_id", "selected_guild_id"]
            isOneToOne: false
            referencedRelation: "guild_memberships"
            referencedColumns: ["auth_user_id", "guild_id"]
          },
        ]
      }
      users: {
        Row: {
          access_token: string | null
          avatar: string | null
          created_at: string | null
          discord_id: string
          id: string
          last_login_at: string | null
          refresh_token: string | null
          token_expires_at: string | null
          username: string
        }
        Insert: {
          access_token?: string | null
          avatar?: string | null
          created_at?: string | null
          discord_id: string
          id?: string
          last_login_at?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          username: string
        }
        Update: {
          access_token?: string | null
          avatar?: string | null
          created_at?: string | null
          discord_id?: string
          id?: string
          last_login_at?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          username?: string
        }
        Relationships: []
      }
      workflow_jobs: {
        Row: {
          attempts: number
          channel_id: string
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          definition: Json
          guild_id: string
          id: string
          last_error: string | null
          project_id: string
          requester_id: string
          status: string
        }
        Insert: {
          attempts?: number
          channel_id: string
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          definition: Json
          guild_id: string
          id?: string
          last_error?: string | null
          project_id: string
          requester_id: string
          status?: string
        }
        Update: {
          attempts?: number
          channel_id?: string
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          definition?: Json
          guild_id?: string
          id?: string
          last_error?: string | null
          project_id?: string
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
