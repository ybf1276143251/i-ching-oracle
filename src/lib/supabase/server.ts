import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function hasSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url.startsWith("http") && !url.includes("your-supabase");
}

export async function createServerSupabase() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL in .env.local");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}

// Admin client with service role (use with caution, server-side only)
export async function createAdminSupabase() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL in .env.local");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}
