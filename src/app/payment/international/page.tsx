"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function InternationalPaymentPage() {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-3xl mb-3">🌍</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">
            {lang === "en" ? "International Payment" : "国际用户支付"}
          </h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            PingPong · {lang === "en" ? "Secure cross-border payment" : "安全跨境支付"}
          </p>

          {/* Features */}
          <div className="glass p-4 mb-6 text-left text-sm space-y-2">
            <p className="text-[var(--gold)] font-semibold text-center mb-2">
              {lang === "en" ? "Included Features" : "包含功能"}
            </p>
            <p>✓ {lang === "en" ? "Unlimited readings" : "无限次占卜"}</p>
            <p>✓ {lang === "en" ? "Priority AI interpretation" : "优先AI解读"}</p>
            <p>✓ {lang === "en" ? "Advanced insights" : "高级洞察"}</p>
            <p>✓ {lang === "en" ? "Ad-free experience" : "无广告体验"}</p>
          </div>

          {/* PingPong placeholder */}
          <div className="glass p-6 mb-6">
            <p className="text-[var(--text-muted)] text-sm mb-3">
              {lang === "en" ? "PingPong payment integration coming soon." : "PingPong 支付接入中，即将上线。"}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {lang === "en" ? "For now, contact @Fassfannqbjj on Twitter to pay via alternative methods." : "暂时请通过 Twitter @Fassfannqbjj 联系获取其他支付方式。"}
            </p>
          </div>

          <a href="https://twitter.com/Fassfannqbjj" target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full mb-3">
            🐦 {lang === "en" ? "Contact on Twitter" : "Twitter 联系"}
          </a>

          <Link href="/activate" className="btn btn-primary w-full mb-3">
            {lang === "en" ? "I Have an Activation Code" : "我有激活码，去激活"}
          </Link>
          <Link href="/read" className="btn btn-ghost btn-sm">
            ← {lang === "en" ? "Back" : "返回"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
