import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

    const body = await request.json();
    const { code } = body as { code: string };
    if (!code || code.trim().length < 6) {
      return NextResponse.json({ error: "无效的激活码" }, { status: 400 });
    }

    const trimmed = code.trim().toUpperCase();

    // Look up code
    const { data: activation, error: lookupError } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("code", trimmed)
      .single();

    if (lookupError || !activation) {
      return NextResponse.json({ error: "激活码不存在" }, { status: 404 });
    }

    if (activation.is_used) {
      return NextResponse.json({ error: "此激活码已被使用" }, { status: 409 });
    }

    // Enforce ownership: code must be reserved for THIS user (unless null = admin code)
    if (activation.reserved_for && activation.reserved_for !== user.id) {
      return NextResponse.json({ error: "此激活码不属于你的账号" }, { status: 403 });
    }

    const plan = activation.plan;

    // Mark as used
    await supabase.from("activation_codes").update({
      is_used: true, used_by: user.id, used_at: new Date().toISOString(),
    }).eq("id", activation.id);

    // Upgrade user
    const admin = createAdminSupabase();
    const premiumUntil = plan === "lifetime"
      ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await admin.from("profiles").update({
      plan, is_premium: true, premium_until: premiumUntil,
    }).eq("id", user.id);

    return NextResponse.json({
      success: true, plan,
      message: plan === "lifetime" ? "终身会员已激活！" : "Pro 会员已激活！",
    });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "激活失败" }, { status: 500 });
  }
}
