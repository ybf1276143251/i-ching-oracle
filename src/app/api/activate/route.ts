import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// POST — Validate and activate a code
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录 / Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body as { code: string };

    if (!code || code.trim().length < 8) {
      return NextResponse.json({ error: "无效的激活码 / Invalid activation code." }, { status: 400 });
    }

    // Look up the code
    const { data: activation, error: lookupError } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("code", code.trim())
      .single();

    if (lookupError || !activation) {
      return NextResponse.json({ error: "激活码不存在 / Activation code not found." }, { status: 404 });
    }

    if (activation.is_used) {
      return NextResponse.json({ error: "此激活码已被使用 / This code has already been used." }, { status: 409 });
    }

    // Mark code as used
    const now = new Date().toISOString();
    await supabase
      .from("activation_codes")
      .update({
        is_used: true,
        used_by: user.id,
        used_at: now,
      })
      .eq("id", activation.id);

    // Upgrade user plan
    const plan = activation.plan; // "pro" or "lifetime"
    const premiumUntil = plan === "lifetime"
      ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString() // 100 years
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days for pro

    await supabase
      .from("profiles")
      .update({
        plan,
        is_premium: true,
        premium_until: premiumUntil,
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      plan,
      message: plan === "lifetime" ? "终身会员已激活！/ Lifetime activated!" : "Pro 会员已激活！/ Pro activated!",
    });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "激活失败 / Activation failed." }, { status: 500 });
  }
}
