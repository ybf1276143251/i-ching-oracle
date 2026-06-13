"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

interface PremiumModalProps { open: boolean; onClose: () => void; }

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  const { lang } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative glass max-w-md w-full animate-fadeUp z-10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] text-xl">✕</button>
        <div className="text-center mb-6">
          <span className="text-5xl block mb-3 text-gradient">☰</span>
          <h2 className="text-2xl font-bold text-gradient">{lang === "en" ? "Upgrade to Pro" : "升级 Pro"}</h2>
        </div>
        <div className="space-y-2 mb-6 text-sm">
          {[
            lang === "en" ? "Unlimited readings" : "无限次占卜",
            lang === "en" ? "Advanced AI interpretation" : "高级AI解读",
            lang === "en" ? "Priority access" : "优先访问",
            lang === "en" ? "Early access to new features" : "新功能抢先体验",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2"><span className="text-[var(--gold)]">✓</span><span>{f}</span></div>
          ))}
        </div>
        <div className="space-y-3">
          <Link href="/pricing" onClick={onClose} className="btn btn-primary w-full">
            $4.99/mo · {lang === "en" ? "Join Pro Waitlist" : "加入 Pro 等待名单"}
          </Link>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
          {lang === "en" ? "PayPal and card payments coming soon." : "PayPal 和银行卡支付即将上线。"}
        </p>
      </div>
    </div>
  );
}
