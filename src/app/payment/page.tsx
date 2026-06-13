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
          <p className="text-5xl mb-4 text-gradient">☰</p>
          <h1 className="text-3xl font-bold text-gradient mb-3">
            {lang === "en" ? "Upgrade Your Experience" : "升级体验"}
          </h1>

          {/* Features */}
          <div className="glass p-5 mb-8 text-left text-sm space-y-2">
            <p className="text-[var(--gold)] font-semibold text-center mb-3 text-base">
              {lang === "en" ? "What You Get" : "你将获得"}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✓</span> {lang === "en" ? "Unlimited readings" : "无限次占卜"}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✓</span> {lang === "en" ? "Priority AI interpretation" : "优先AI解读"}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✓</span> {lang === "en" ? "Advanced insights & analysis" : "高级洞察与分析"}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✓</span> {lang === "en" ? "Ad-free experience" : "无广告体验"}
            </p>
          </div>

          {/* Payment options */}
          <p className="text-[var(--text-muted)] text-sm mb-4">
            {lang === "en" ? "Choose your payment method" : "选择支付方式"}
          </p>

          <div className="space-y-3 mb-6">
            <Link href="/payment/china" className="btn btn-primary w-full">
              🇨🇳 {lang === "en" ? "China · Alipay / WeChat" : "中国用户 · 支付宝 / 微信"}
            </Link>
            <Link href="/payment/international" className="btn btn-secondary w-full">
              🌍 {lang === "en" ? "International · PingPong" : "国际用户 · PingPong"}
            </Link>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-4">
            {lang === "en"
              ? "Already purchased? Enter your activation code."
              : "已经购买？输入激活码解锁。"}
          </p>

          <Link href="/activate" className="btn btn-secondary w-full text-sm">
            🔑 {lang === "en" ? "Activate Code" : "激活码解锁"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
