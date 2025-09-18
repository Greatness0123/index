import { createBrowserClient } from "@supabase/ssr"

export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

const createDummyClient = () => ({
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () =>
      Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
    signUp: () =>
      Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      neq: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
  }),
})

export const createClient = () => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return createDummyClient()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()

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
