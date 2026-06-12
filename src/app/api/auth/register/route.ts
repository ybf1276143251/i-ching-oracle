import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body as {
      email: string;
      password: string;
      displayName?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "请输入邮箱和密码。" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "密码长度至少为8位。" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split("@")[0],
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
          }
        : null,
      message: "注册成功！请查看邮箱确认链接（如已开启邮箱确认）。",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试。" },
      { status: 500 }
    );
  }
}
