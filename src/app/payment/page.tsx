"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

function PaymentContent() {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") === "lifetime" ? "lifetime" : "pro";
  const price = plan === "pro" ? (lang === "en" ? "$0.9/mo" : "¥0.9/月") : (lang === "en" ? "$9.9 lifetime" : "¥9.9 终身");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
      <p className="text-5xl mb-4 text-gradient">{plan === "pro" ? "☰" : "䷀"}</p>
      <h1 className="text-3xl font-bold text-gradient mb-1">
        {plan === "pro" ? "Pro" : lang === "en" ? "Lifetime" : "终身"}
      </h1>
      <p className="text-[var(--gold)] text-lg font-bold mb-6">{price}</p>

      <div className="glass p-5 mb-8 text-left text-sm space-y-2">
        <p className="text-[var(--gold)] font-semibold text-center mb-3 text-base">{lang === "en" ? "What You Get" : "你将获得"}</p>
        <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Unlimited readings" : "无限次占卜"}</p>
        <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Priority AI interpretation" : "优先AI解读"}</p>
        <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Advanced insights" : "高级洞察"}</p>
        <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Ad-free experience" : "无广告"}</p>
        {plan === "lifetime" && <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Lifetime access" : "终身访问"}</p>}
      </div>

      <p className="text-[var(--text-muted)] text-sm mb-4">{lang === "en" ? "Choose payment method" : "选择支付方式"}</p>

      <div className="space-y-3 mb-6">
        <Link href={`/payment/china?plan=${plan}`} className="btn btn-primary w-full">
          🇨🇳 {lang === "en" ? "China · WeChat / Alipay" : "中国用户 · 微信 / 支付宝"}
        </Link>
        <Link href={`/payment/international?plan=${plan}`} className="btn btn-secondary w-full">
          🌍 {lang === "en" ? "International · PingPong" : "国际用户 · PingPong"}
        </Link>
      </div>

      <Link href="/activate" className="btn btn-secondary w-full text-sm">
        🔑 {lang === "en" ? "I have a code" : "激活码解锁"}
      </Link>
    </motion.div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <Suspense fallback={<div className="text-center text-[var(--text-muted)]">Loading...</div>}>
          <PaymentContent />
        </Suspense>
      </div>
    </div>
  );
}
