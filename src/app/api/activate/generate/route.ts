import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// GET — Return an unused activation code for the plan
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const plan = request.nextUrl.searchParams.get("plan") || "pro";
    if (!["pro", "lifetime"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Find an unused code
    const { data: code } = await supabase
      .from("activation_codes")
      .select("*")
      .eq("plan", plan)
      .eq("is_used", false)
      .limit(1)
      .single();

    if (!code) {
      return NextResponse.json({ error: "No available codes" }, { status: 404 });
    }

    return NextResponse.json({ code: code.code, plan: code.plan });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
