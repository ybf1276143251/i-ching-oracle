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
          <span className="text-5xl block mb-3">⭐</span>
          <h2 className="text-2xl font-bold text-gradient">{lang === "en" ? "Upgrade to Pro" : "升级 Pro"}</h2>
        </div>
        <div className="space-y-2 mb-6 text-sm">
          {[lang === "en" ? "Unlimited readings" : "无限次占卜", lang === "en" ? "Priority AI interpretation" : "优先AI解读", lang === "en" ? "Advanced insights" : "高级洞察", lang === "en" ? "Ad-free experience" : "无广告体验"].map((f, i) => (
            <div key={i} className="flex items-center gap-2"><span className="text-[var(--gold)]">✓</span><span>{f}</span></div>
          ))}
        </div>
        <div className="space-y-3">
          <Link href="/payment/china" onClick={onClose} className="btn btn-primary w-full">
            🇨🇳 {lang === "en" ? "China · ¥0.9 / ¥9.9" : "中国用户 · ¥0.9 / ¥9.9"}
          </Link>
          <Link href="/payment/international" onClick={onClose} className="btn btn-secondary w-full">
            🌍 {lang === "en" ? "International · $0.9 / $9.9" : "国际用户 · $0.9 / $9.9"}
          </Link>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
          {lang === "en" ? "Pay once, activate via code." : "付款后获取激活码解锁。"}
        </p>
      </div>
    </div>
  );
}
