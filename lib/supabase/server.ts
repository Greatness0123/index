import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export const createClient = cache(async () => {
  const cookieStore = await cookies()

  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
        signUp: () =>
          Promise.resolve({ data: { user: null, session: null }, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChanged: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      },
      from: (table: string) => ({
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: () =>
              Promise.resolve({ data: null, error: { message: "Supabase not configured", code: "PGRST116" } }),
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
            order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
          }),
          neq: (column: string, value: any) => ({
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
            order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
          }),
          not: (column: string, operator: string, value: any) => ({
            limit: (count: number) => Promise.resolve({ data: [], error: null }),
          }),
          order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
        }),
        insert: (values: any) => ({
          select: (columns?: string) => ({
            single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
          }),
        }),
        update: (values: any) => ({
          eq: (column: string, value: any) =>
            Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        }),
        delete: () => ({
          eq: (column: string, value: any) =>
            Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        }),
        upsert: (values: any, options?: any) =>
          Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      }),
      rpc: (functionName: string, params?: any) =>
        Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    }
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
})

// Legacy export for backward compatibility
export const createSupabaseClient = createClient

export { createClient as createServerClient }
