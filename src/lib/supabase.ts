import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string; role: "admin" | "member"; phone: string | null; avatar_url: string | null };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], never>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      checklist_lists: {
        Row: { id: string; name: string; type: "daily" | "packing" | "documents" | "custom"; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["checklist_lists"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["checklist_lists"]["Row"]>;
      };
      checklist_items: {
        Row: { id: string; list_id: string; text: string; checked: boolean; checked_by: string | null; checked_at: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["checklist_items"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["checklist_items"]["Row"]>;
      };
      vibe_posts: {
        Row: { id: string; user_id: string; day_number: number; type: "photo" | "text"; content: string; sticker: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["vibe_posts"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["vibe_posts"]["Row"]>;
      };
      day_cards: {
        Row: { id: string; day_number: number; type: string; title: string; description: string | null; time: string | null; image_url: string | null; document_url: string | null; metadata: Record<string, unknown> | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["day_cards"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["day_cards"]["Row"]>;
      };
    };
  };
};
