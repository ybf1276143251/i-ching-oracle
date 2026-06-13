"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  const { lang } = useI18n();
  const gumroadUrl = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL || "https://gumroad.com/l/iching-premium";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Modal */}
      <div
        className="relative card max-w-md w-full animate-fadeIn z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)] text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-5xl block mb-3">⭐</span>
          <h2 className="text-2xl font-bold text-gradient">
            {lang === "zh" ? "升级 Premium" : "Upgrade to Premium"}
          </h2>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6 text-sm">
          {[
            lang === "zh" ? "无限占卜次数" : "Unlimited divinations",
            lang === "zh" ? "完整 AI 深度解读" : "Full AI deep interpretation",
            lang === "zh" ? "历史记录永久保存" : "Permanent history records",
            lang === "zh" ? "一次购买，终身使用" : "One-time purchase, lifetime access",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[var(--gold)]">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Payment buttons */}
        <div className="space-y-3">
          {/* China — Alipay page */}
          <Link
            href="/payment"
            onClick={onClose}
            className="btn btn-primary w-full"
          >
            🇨🇳 {lang === "zh" ? "中国用户 · 支付宝 ¥9.9" : "China · Alipay ¥9.9"}
          </Link>

          {/* International — Gumroad */}
          <a
            href={gumroadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary w-full"
          >
            🌍 {lang === "zh" ? "国际用户 · $9.9" : "International · $9.9"}
          </a>
        </div>

        <p className="text-xs text-[var(--muted)] text-center mt-4">
          {lang === "zh"
            ? "购买后发送凭证至 1276143251@qq.com，24小时内开通。"
            : "Email your receipt to 1276143251@qq.com for activation within 24h."}
        </p>
      </div>
    </div>
  );
}
