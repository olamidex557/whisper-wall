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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      confessions: {
        Row: {
          content: string
          created_at: string
          downvotes: number
          fingerprint: string
          id: string
          is_approved: boolean
          tag: Database["public"]["Enums"]["confession_tag"]
          upvotes: number
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number
          fingerprint: string
          id?: string
          is_approved?: boolean
          tag?: Database["public"]["Enums"]["confession_tag"]
          upvotes?: number
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number
          fingerprint?: string
          id?: string
          is_approved?: boolean
          tag?: Database["public"]["Enums"]["confession_tag"]
          upvotes?: number
        }
        Relationships: []
      }
      post_limits: {
        Row: {
          fingerprint: string
          id: string
          post_count: number
          post_date: string
        }
        Insert: {
          fingerprint: string
          id?: string
          post_count?: number
          post_date?: string
        }
        Update: {
          fingerprint?: string
          id?: string
          post_count?: number
          post_date?: string
        }
        Relationships: []
      }
      replies: {
        Row: {
          confession_id: string
          content: string
          created_at: string
          fingerprint: string
          id: string
        }
        Insert: {
          confession_id: string
          content: string
          created_at?: string
          fingerprint: string
          id?: string
        }
        Update: {
          confession_id?: string
          content?: string
          created_at?: string
          fingerprint?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          confession_id: string
          created_at: string
          fingerprint: string
          id: string
          reason: string
        }
        Insert: {
          confession_id: string
          created_at?: string
          fingerprint: string
          id?: string
          reason: string
        }
        Update: {
          confession_id?: string
          created_at?: string
          fingerprint?: string
          id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          confession_id: string
          created_at: string
          fingerprint: string
          id: string
          vote_type: string
        }
        Insert: {
          confession_id: string
          created_at?: string
          fingerprint: string
          id?: string
          vote_type: string
        }
        Update: {
          confession_id?: string
          created_at?: string
          fingerprint?: string
          id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      confessions_public: {
        Row: {
          content: string | null
          created_at: string | null
          downvotes: number | null
          id: string | null
          is_approved: boolean | null
          tag: Database["public"]["Enums"]["confession_tag"] | null
          upvotes: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          id?: string | null
          is_approved?: boolean | null
          tag?: Database["public"]["Enums"]["confession_tag"] | null
          upvotes?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          downvotes?: number | null
          id?: string | null
          is_approved?: boolean | null
          tag?: Database["public"]["Enums"]["confession_tag"] | null
          upvotes?: number | null
        }
        Relationships: []
      }
      replies_public: {
        Row: {
          confession_id: string | null
          content: string | null
          created_at: string | null
          id: string | null
        }
        Insert: {
          confession_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
        }
        Update: {
          confession_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "replies_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      votes_public: {
        Row: {
          confession_id: string | null
          created_at: string | null
          id: string | null
          vote_type: string | null
        }
        Insert: {
          confession_id?: string | null
          created_at?: string | null
          id?: string | null
          vote_type?: string | null
        }
        Update: {
          confession_id?: string | null
          created_at?: string | null
          id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_confession_id_fkey"
            columns: ["confession_id"]
            isOneToOne: false
            referencedRelation: "confessions_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_email_by_id: { Args: { user_id_input: string }; Returns: string }
      get_user_id_by_email: { Args: { email_input: string }; Returns: string }
      handle_vote: {
        Args: {
          p_confession_id: string
          p_fingerprint: string
          p_vote_type: string
        }
        Returns: undefined
      }
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
      confession_tag:
        | "love"
        | "regret"
        | "secret"
        | "funny"
        | "work"
        | "family"
        | "friendship"
        | "other"
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
      confession_tag: [
        "love",
        "regret",
        "secret",
        "funny",
        "work",
        "family",
        "friendship",
        "other",
      ],
    },
  },
} as const
