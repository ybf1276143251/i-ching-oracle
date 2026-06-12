import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, display_name, plan, readings_count, is_premium, premium_until, gumroad_email, created_at")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
