"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function ChinaPaymentPage() {
  const { lang } = useI18n();
  const [showActivation, setShowActivation] = useState(false);
  // Simulated activation code (in production this comes from backend after admin verifies payment)
  const mockCode = lang === "en" ? "After payment, activation code will appear here" : "支付后联系客服获取激活码";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-3xl mb-3">🇨🇳</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">
            {lang === "en" ? "China Payment" : "中国用户支付"}
          </h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            {lang === "en" ? "Scan QR code to pay via Alipay or WeChat" : "使用支付宝或微信扫码支付"}
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

          {/* QR Codes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl p-3">
              <img src="/wechat-qr.jpg" alt="WeChat Pay" className="w-full rounded-lg" />
              <p className="text-zinc-500 text-xs mt-1 text-center">微信支付</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <img src="/alipay-qr.jpg" alt="Alipay" className="w-full rounded-lg" />
              <p className="text-zinc-500 text-xs mt-1 text-center">支付宝</p>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-6">
            {lang === "en" ? "After payment, contact us on Twitter @Fassfannqbjj or email 1276143251@qq.com to receive your activation code." : "支付后联系 Twitter @Fassfannqbjj 或发送邮件到 1276143251@qq.com 获取激活码。"}
          </p>

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
