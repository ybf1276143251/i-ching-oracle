import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";

function genCode(plan: string, username: string): string {
  const prefix = plan === "lifetime" ? "MAX" : "PRO";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const time = Date.now().toString(36).substring(-4).toUpperCase();
  const userPart = username.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "X");
  return `${prefix}-${userPart}-${random}${time}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "请先登录 / Please sign in first." }, { status: 401 });

    const plan = request.nextUrl.searchParams.get("plan") || "pro";
    if (!["pro", "lifetime"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Try existing unused code first
    const { data: existing } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("plan", plan)
      .eq("is_used", false)
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json({ code: existing.code, plan: existing.plan });
    }

    // Generate new code and insert via admin
    const email = user.email || "user";
    const username = email.split("@")[0];
    const code = genCode(plan, username);

    try {
      const admin = createAdminSupabase();
      await admin.from("activation_codes").insert({ code, plan, is_used: false });
    } catch (e) {
      console.error("Insert code error:", e);
    }

    return NextResponse.json({ code, plan });
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
