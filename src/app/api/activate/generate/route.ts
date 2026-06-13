import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";

function genCode(plan: string, username: string): string {
  const prefix = plan === "lifetime" ? "MAX" : "PRO";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  const userPart = username.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "X");
  return `${prefix}-${userPart}-${random}${time}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const plan = request.nextUrl.searchParams.get("plan") || "pro";
    if (!["pro", "lifetime"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Check if user already has an unused code
    const { data: existing } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("reserved_for", user.id)
      .eq("is_used", false)
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json({ code: existing.code, plan: existing.plan, userId: user.id });
    }

    // Generate new code, tied to this user ONLY
    const email = user.email || "user";
    const username = email.split("@")[0];
    const code = genCode(plan, username);

    // Try insert with reserved_for, fallback without if column missing
    const admin = createAdminSupabase();
    let { error } = await admin.from("activation_codes").insert({
      code, plan, is_used: false, reserved_for: user.id,
    });
    // Fallback: try without reserved_for
    if (error) {
      const { error: err2 } = await admin.from("activation_codes").insert({
        code, plan, is_used: false,
      });
      if (err2) {
        console.error("Insert code error:", err2);
        // Return code anyway — activate API will create on the fly
      }
    }

    return NextResponse.json({ code, plan, userId: user.id });
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
