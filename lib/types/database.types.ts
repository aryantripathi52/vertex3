// Database types for Vertex3 — generated from Supabase schema
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          phone: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          skills: string[] | null;
          github_url: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          referral_code: string;
          referred_by: string | null;
          plan: "free" | "pro";
          is_onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          phone?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          skills?: string[] | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          referral_code: string;
          referred_by?: string | null;
          plan?: "free" | "pro";
          is_onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      hackathons: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          organizer: string | null;
          prize_pool: number | null;
          deadline: string | null;
          tags: string[] | null;
          image_url: string | null;
          registration_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          organizer?: string | null;
          prize_pool?: number | null;
          deadline?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          registration_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["hackathons"]["Insert"]>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          hackathon_id: string | null;
          leader_id: string;
          description: string | null;
          required_skills: string[] | null;
          max_members: number;
          is_open: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          hackathon_id?: string | null;
          leader_id: string;
          description?: string | null;
          required_skills?: string[] | null;
          max_members?: number;
          is_open?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          is_read: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          is_read?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
