"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-4xl mb-3 text-gradient">☰</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">Pro</h1>
          <p className="text-[var(--gold)] text-lg font-bold mb-6">{lang === "en" ? "$4.99/month" : "¥4.99/月"}</p>

          <div className="glass p-4 mb-8 text-left text-sm space-y-1.5">
            <p className="text-[var(--gold)] font-semibold text-center mb-2">{lang === "en" ? "Included" : "包含功能"}</p>
            <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Unlimited readings" : "无限次占卜"}</p>
            <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Advanced AI interpretation" : "高级AI解读"}</p>
            <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Priority access" : "优先访问"}</p>
            <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Early access to new features" : "新功能抢先体验"}</p>
          </div>

          <div className="space-y-3">
            <Link href="/payment/china" className="btn btn-primary w-full">
              {lang === "en" ? "China · WeChat / Alipay" : "中国用户 · 微信 / 支付宝"}
            </Link>
            <Link href="/pricing" className="btn btn-secondary w-full">
              {lang === "en" ? "International · Join Waitlist" : "国际用户 · 加入等待名单"}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
