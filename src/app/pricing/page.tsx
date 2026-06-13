"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function PricingPage() {
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">{t.pricingTitle}</span></h1>
          <p className="text-[var(--text-secondary)] text-lg">{t.pricingSubtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="glass p-8 flex flex-col text-center">
            <p className="text-4xl mb-2 opacity-40">☰</p>
            <h3 className="text-lg font-semibold mb-2">{t.freePlan}</h3>
            <p className="text-4xl font-bold mb-1">$0</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{lang === "en" ? "forever" : "永久"}</p>
            <ul className="space-y-2 mb-8 flex-1 text-sm text-[var(--text-secondary)] text-left">
              <li>✓ {t.feature1}</li>
              <li>✓ {lang === "en" ? "Basic interpretation" : "基础解读"}</li>
            </ul>
            <Link href="/read" className="btn btn-secondary w-full text-sm">{t.getStarted}</Link>
          </div>

          {/* Pro */}
          <div className="glass glass-glow p-8 flex flex-col text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-[#0A0A0A] text-xs font-bold px-4 py-1 rounded-full">{t.popular}</span>
            <p className="text-4xl mb-2 text-gradient">☰</p>
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-1">{lang === "en" ? "$0.9" : "¥0.9"}</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{lang === "en" ? "/month" : "/月"}</p>
            <ul className="space-y-2 mb-8 flex-1 text-sm text-[var(--text-secondary)] text-left">
              <li>✓ {lang === "en" ? "Unlimited readings" : "无限次占卜"}</li>
              <li>✓ {lang === "en" ? "Priority AI interpretation" : "优先AI解读"}</li>
              <li>✓ {lang === "en" ? "Advanced insights" : "高级洞察"}</li>
              <li>✓ {lang === "en" ? "Ad-free experience" : "无广告"}</li>
            </ul>
            <Link href="/payment?plan=pro" className="btn btn-primary w-full text-sm">{t.subscribeNow}</Link>
          </div>

          {/* Max */}
          <div className="glass p-8 flex flex-col text-center">
            <p className="text-4xl mb-2 text-gradient">䷀</p>
            <h3 className="text-lg font-semibold mb-2">Max</h3>
            <p className="text-4xl font-bold mb-1">{lang === "en" ? "$9.9" : "¥9.9"}</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{t.oneTime}</p>
            <ul className="space-y-2 mb-8 flex-1 text-sm text-[var(--text-secondary)] text-left">
              <li>✓ {lang === "en" ? "All Pro features" : "Pro全部功能"}</li>
              <li>✓ {t.feature5}</li>
              <li>✓ {lang === "en" ? "Forever updates" : "永久更新"}</li>
            </ul>
            <Link href="/payment?plan=lifetime" className="btn btn-primary w-full text-sm">{lang === "en" ? "Buy Max" : "购买 Max"}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
