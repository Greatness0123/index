import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string
          name: string
          description: string
          url: string
          image_url: string | null
          category_id: string | null
          submitted_by: string | null
          is_featured: boolean
          is_approved: boolean
          pricing: string | null
          rating: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          url: string
          image_url?: string | null
          category_id?: string | null
          submitted_by?: string | null
          is_featured?: boolean
          is_approved?: boolean
          pricing?: string | null
          rating?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          url?: string
          image_url?: string | null
          category_id?: string | null
          submitted_by?: string | null
          is_featured?: boolean
          is_approved?: boolean
          pricing?: string | null
          rating?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
    }
  }
}
