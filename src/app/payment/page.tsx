"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function PaymentPage() {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <div className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-5xl mb-4">⭐</p>
          <h1 className="text-3xl font-bold text-gradient mb-3">
            {lang === "en" ? "Upgrade to Premium" : "升级 Premium"}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">
            {lang === "en" ? "Lifetime access · Unlimited readings · Full AI interpretation" : "终身访问 · 无限占卜 · 完整AI解读"}
          </p>

          <div className="mb-8">
            <p className="text-5xl font-bold text-gradient">$9.9 / ¥9.9</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {lang === "en" ? "One-time payment · Lifetime Premium" : "一次性支付 · 终身 Premium"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 mx-auto max-w-[260px] mb-6">
            <img src="/alipay-qr.jpg" alt="Payment QR Code" className="w-full rounded-xl" />
            <p className="text-zinc-500 text-xs mt-2 text-center">
              {lang === "en" ? "Alipay / WeChat Pay" : "支付宝 / 微信支付"}
            </p>
          </div>

          <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-5 mb-6 text-left text-sm space-y-3">
            <h3 className="font-semibold text-[var(--gold)] text-center mb-3">
              {lang === "en" ? "📋 After Payment" : "📋 付款后"}
            </h3>
            <div className="space-y-2 text-[var(--text-secondary)]">
              <p>{lang === "en" ? "1. Screenshot your payment confirmation" : "1. 截图支付凭证"}</p>
              <p>{lang === "en" ? "2. Include your registered email" : "2. 附上注册邮箱"}</p>
              <p>{lang === "en" ? "3. Send via any channel below" : "3. 通过以下任一方式发送"}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <a href="https://twitter.com/Fassfannqbjj" target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full">
              🐦 Twitter / X — @Fassfannqbjj
            </a>
            <div className="glass p-3 text-sm text-[var(--text-secondary)]">
              📧 1276143251@qq.com
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-6">
            {lang === "en" ? "Activation within 24 hours after verification" : "审核通过后24小时内开通"}
          </p>

          <Link href="/read" className="btn btn-primary">
            ← {lang === "en" ? "Back to Oracle" : "返回占卜"}
          </Link>
        </div>
      </div>
    </div>
  );
}
