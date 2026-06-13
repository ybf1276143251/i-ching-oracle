import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName, phone } = body as {
      email: string;
      password: string;
      displayName?: string;
      phone?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: "请输入账号和密码。" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "密码长度至少为6位。" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
          phone: phone || null,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      message: "注册成功！",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试。" },
      { status: 500 }
    );
  }
}
