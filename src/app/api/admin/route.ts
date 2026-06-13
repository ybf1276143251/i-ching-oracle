import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { HEXAGRAMS } from "@/lib/hexagrams";

// ─── GET: Admin dashboard stats ─────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授权。" }, { status: 401 });
    }

    // Check if user is admin (by email or custom claim)
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, email")
      .eq("id", user.id)
      .single();

    // Simple admin check — in production, use proper admin role
    const isAdmin = profile?.email && true; // All authenticated users can see stats for now

    if (!isAdmin) {
      return NextResponse.json({ error: "未授权。" }, { status: 403 });
    }

    // Gather stats
    const [
      { count: totalUsers },
      { count: totalReadings },
      { count: totalPayments },
      { data: recentReadings },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("readings").select("*", { count: "exact", head: true }),
      supabase.from("payment_orders").select("*", { count: "exact", head: true }),
      supabase
        .from("readings")
        .select("*, profiles(email, display_name)")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers ?? 0,
        totalReadings: totalReadings ?? 0,
        totalPayments: totalPayments ?? 0,
        totalHexagrams: HEXAGRAMS.length,
        recentReadings: recentReadings ?? [],
      },
    });
  } catch (error) {
    console.error("Admin error:", error);
    return NextResponse.json(
      { error: "获取管理数据失败。" },
      { status: 500 }
    );
  }
}

// ─── POST: Seed hexagram SEO pages ─────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授权。" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body as { action: string };

    if (action === "seed_hexagrams") {
      const hexagramPages = HEXAGRAMS.map((h) => ({
        id: h.id,
        name_zh: h.name,
        name_en: h.nameEn,
        slug: h.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        meta_title: `${h.name} - ${h.nameEn} | 易经占卜 I Ching Oracle`,
        meta_description: `易经第${h.id}卦${h.name}（${h.nameEn}）的完整解读、卦辞、象辞。${h.description}`,
      }));

      const { error } = await supabase
        .from("hexagram_pages")
        .upsert(hexagramPages, { onConflict: "id" });

      if (error) {
        return NextResponse.json(
          { error: "Seed failed: " + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `已写入 ${hexagramPages.length} 个卦象SEO页面。`,
      });
    }

    return NextResponse.json(
      { error: "未知操作。" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: "操作失败。" },
      { status: 500 }
    );
  }
}
