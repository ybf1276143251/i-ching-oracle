"use client";

import { createBrowserClient } from "@supabase/ssr";

function hasSupabaseConfig(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url.startsWith("http") && !url.includes("your-supabase");
}

export function createClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
