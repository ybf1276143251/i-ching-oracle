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
          <h1 className="text-2xl font-bold text-gradient mb-2">Pro · $4.99/mo</h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            {lang === "en"
              ? "Pro access is currently available through our waitlist while we set up global payments."
              : "全球支付系统准备中，Pro 权限目前通过等待名单开放。"}
          </p>

          <div className="glass p-4 mb-6 text-left text-sm space-y-1.5">
            <p className="text-[var(--gold)] font-semibold text-center mb-2">Included</p>
            <p className="text-[var(--text-secondary)]">✓ Unlimited readings</p>
            <p className="text-[var(--text-secondary)]">✓ Advanced AI interpretation</p>
            <p className="text-[var(--text-secondary)]">✓ Priority access</p>
            <p className="text-[var(--text-secondary)]">✓ Early access to new features</p>
          </div>

          <div className="space-y-2 mb-3">
            <Link href="/payment/china" className="btn btn-primary w-full">
              💚 {lang === "en" ? "Pay with WeChat" : "微信支付"}
            </Link>
            <Link href="/payment/china" className="btn btn-secondary w-full">
              💙 {lang === "en" ? "Pay with Alipay" : "支付宝支付"}
            </Link>
          </div>

          <Link href="/pricing" className="btn btn-primary w-full mb-3">
            {lang === "en" ? "Join Pro Waitlist" : "加入 Pro 等待名单"}
          </Link>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            {lang === "en" ? "PayPal and card payments coming soon." : "PayPal 和银行卡支付即将上线。"}
          </p>

          <Link href="/activate" className="btn btn-ghost btn-sm">
            {lang === "en" ? "I have an activation code" : "我有激活码"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
