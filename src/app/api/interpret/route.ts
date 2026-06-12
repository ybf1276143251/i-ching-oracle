import { NextRequest, NextResponse } from "next/server";
import { generateFullInterpretation } from "@/lib/deepseek";
import { createServerSupabase } from "@/lib/supabase/server";
import { HEXAGRAMS } from "@/lib/hexagrams";
import { CastHexagram } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "请先登录。" }, { status: 401 });
    }

    // Premium check
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, is_premium")
      .eq("id", user.id)
      .single();

    const isPremium = profile?.is_premium || profile?.plan === "premium";
    if (!isPremium) {
      return NextResponse.json(
        { error: "此功能仅限 Premium 会员使用。", requiresUpgrade: true },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { readingId, question, hexagramId, relatedHexagramId, changingLines } = body as {
      readingId?: string;
      question: string;
      hexagramId: number;
      relatedHexagramId?: number;
      changingLines: number[];
    };

    if (!question || !hexagramId) {
      return NextResponse.json({ error: "缺少必要参数。" }, { status: 400 });
    }

    const hexagram = HEXAGRAMS.find((h) => h.id === hexagramId);
    if (!hexagram) {
      return NextResponse.json({ error: "无效的卦象ID。" }, { status: 400 });
    }

    const relatedHexagram = relatedHexagramId
      ? HEXAGRAMS.find((h) => h.id === relatedHexagramId)
      : undefined;

    const cast: CastHexagram = {
      hexagram,
      changingLines: changingLines || [],
      isChanging: (changingLines || []).length > 0,
      relatedHexagram,
    };

    const interpretation = await generateFullInterpretation(question, cast);

    // Update reading
    if (readingId) {
      await supabase
        .from("readings")
        .update({ interpretation, is_premium: true })
        .eq("id", readingId)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true, interpretation });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Interpretation error:", message);
    return NextResponse.json({ error: `解读失败：${message}` }, { status: 500 });
  }
}
