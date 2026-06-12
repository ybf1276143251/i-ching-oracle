import { NextRequest, NextResponse } from "next/server";
import { castHexagram, CastType } from "@/lib/divination";
import { generateSummary } from "@/lib/deepseek";
import { createServerSupabase } from "@/lib/supabase/server";

const FREE_DAILY_LIMIT = parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || "3");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, castType = "three-coins" } = body as {
      question: string;
      castType?: CastType;
    };

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "请提出你想要占卜的问题。" }, { status: 400 });
    }
    if (question.length > 500) {
      return NextResponse.json({ error: "问题请控制在500字以内。" }, { status: 400 });
    }

    // Check daily limit for free users
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, is_premium")
        .eq("id", user.id)
        .single();

      const isPremium = profile?.is_premium || profile?.plan === "premium";

      if (!isPremium) {
        // Count today's readings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count } = await supabase
          .from("readings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", today.toISOString());

        if ((count ?? 0) >= FREE_DAILY_LIMIT) {
          return NextResponse.json(
            { error: `今日免费占卜次数已用完（${FREE_DAILY_LIMIT}次/天），请升级 Premium。`, limitReached: true },
            { status: 429 }
          );
        }
      }
    }

    // Cast hexagram + AI summary
    const cast = castHexagram(castType);
    const summary = await generateSummary(question, cast);

    // Save reading
    let readingId: string | null = null;
    try {
      if (user) {
        const { data: reading } = await supabase
          .from("readings")
          .insert({
            user_id: user.id,
            question: question.trim(),
            cast_type: castType,
            primary_hexagram: cast.hexagram.id,
            related_hexagram: cast.relatedHexagram?.id ?? null,
            changing_lines: cast.changingLines,
            summary,
            is_premium: false,
          })
          .select("id")
          .single();

        readingId = reading?.id ?? null;
      }
    } catch { /* non-critical */ }

    return NextResponse.json({
      success: true,
      readingId,
      cast: {
        hexagram: {
          id: cast.hexagram.id,
          name: cast.hexagram.name,
          nameEn: cast.hexagram.nameEn,
          judgment: cast.hexagram.judgment,
          judgmentEn: cast.hexagram.judgmentEn,
          upperTrigram: cast.hexagram.upperTrigram,
          lowerTrigram: cast.hexagram.lowerTrigram,
        },
        changingLines: cast.changingLines,
        isChanging: cast.isChanging,
        relatedHexagram: cast.relatedHexagram
          ? { id: cast.relatedHexagram.id, name: cast.relatedHexagram.name, nameEn: cast.relatedHexagram.nameEn }
          : null,
      },
      summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Divination error:", message);
    return NextResponse.json({ error: `占卜出错：${message}` }, { status: 500 });
  }
}
