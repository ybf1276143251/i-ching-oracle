import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录。" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, is_premium")
      .eq("id", user.id)
      .single();

    const isPremium = profile?.is_premium || profile?.plan === "premium";

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const { data: readings, error, count } = await supabase
      .from("readings")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: "获取历史记录失败。" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      readings,
      user: { isPremium },
      pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
    });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "获取历史记录失败。" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录。" }, { status: 401 });
    }

    const url = new URL(request.url);
    const readingId = url.searchParams.get("id");
    if (!readingId) {
      return NextResponse.json({ error: "请提供要删除的记录ID。" }, { status: 400 });
    }

    const { error } = await supabase
      .from("readings")
      .delete()
      .eq("id", readingId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: "删除记录失败。" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete reading error:", error);
    return NextResponse.json({ error: "删除记录失败。" }, { status: 500 });
  }
}
