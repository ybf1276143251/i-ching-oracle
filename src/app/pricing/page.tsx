"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

function WaitlistModal({ open, onClose, lang }: { open: boolean; onClose: () => void; lang: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Not configured");
      const { error: insertError } = await supabase.from("pro_waitlist").insert({
        email: email.trim(),
        name: name.trim() || null,
        country: country.trim() || null,
      });
      if (insertError) throw insertError;
      setDone(true);
    } catch (err) {
      setError(lang === "en" ? "Something went wrong. Please try again." : "提交失败，请重试。");
    } finally { setLoading(false); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative glass glass-glow max-w-md w-full p-8 md:p-10 z-10 animate-fadeUp" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text)] text-xl">✕</button>

        {!done ? (
          <>
            <p className="text-3xl mb-4 text-center">☰</p>
            <h2 className="text-2xl font-bold text-gradient text-center mb-2">
              {lang === "en" ? "Join Pro Waitlist" : "加入 Pro 等待名单"}
            </h2>
            <p className="text-[var(--text-muted)] text-sm text-center mb-6">
              {lang === "en" ? "Be the first to get Pro access at $4.99/month." : "抢先获取 Pro 权限，$4.99/月。"}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{lang === "en" ? "Email *" : "邮箱 *"}</label>
                <input type="email" className="input" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{lang === "en" ? "Name (optional)" : "姓名（选填）"}</label>
                <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">{lang === "en" ? "Country (optional)" : "国家（选填）"}</label>
                <input type="text" className="input" value={country} onChange={e => setCountry(e.target.value)} />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={loading || !email.trim()} className="btn btn-primary w-full text-sm">
                {loading ? (lang === "en" ? "Submitting..." : "提交中...") : (lang === "en" ? "Join Waitlist" : "加入等待名单")}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-4xl mb-4">✅</p>
            <h3 className="text-xl font-bold text-gradient mb-3">
              {lang === "en" ? "Thank you for your interest!" : "感谢你的关注！"}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-2">
              {lang === "en"
                ? "Pro access is currently available through manual activation while we prepare our global payment system."
                : "我们正在准备全球支付系统，Pro 权限目前通过手动激活开通。"}
            </p>
            <p className="text-[var(--text-muted)] text-xs">
              {lang === "en" ? "We will contact you within 24 hours." : "我们会在 24 小时内联系你。"}
            </p>
            <button onClick={onClose} className="btn btn-primary btn-sm mt-6">
              {lang === "en" ? "Close" : "关闭"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { t, lang } = useI18n();
  const [userPlan, setUserPlan] = useState("free");
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => {
      if (d.user) setUserPlan(d.user.plan || "free");
    }).catch(() => {});
  }, []);

  const isPaid = userPlan !== "free";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} lang={lang} />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">{t.pricingTitle}</span></h1>
          <p className="text-[var(--text-secondary)] text-lg">{t.pricingSubtitle}</p>
          {isPaid && (
            <div className="mt-6 inline-block glass p-4 text-sm">
              <span className="text-[var(--gold)] font-bold">
                {lang === "en" ? "Current Plan: " : "当前方案："}
                {userPlan === "lifetime" ? "Max" : "Pro"}
              </span>
              <span className="text-[var(--text-muted)] ml-2">
                {lang === "en" ? "— Thank you for your support!" : "— 感谢你的支持！"}
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="glass p-8 flex flex-col text-center">
            <p className="text-4xl mb-2 opacity-40">☰</p>
            <h3 className="text-lg font-semibold mb-2">{t.freePlan}</h3>
            <p className="text-4xl font-bold mb-1">$0</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{lang === "en" ? "forever" : "永久"}</p>
            <ul className="space-y-2 mb-8 flex-1 text-sm text-[var(--text-secondary)] text-left">
              <li>✓ {lang === "en" ? "Basic readings" : "基础解读"}</li>
              <li>✓ {lang === "en" ? "Limited daily usage" : "每日限量使用"}</li>
            </ul>
            <Link href="/read/coins" className="btn btn-secondary w-full text-sm">{t.getStarted}</Link>
          </div>

          {/* Pro */}
          <div className="glass glass-glow p-8 flex flex-col text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-[#0A0A0A] text-xs font-bold px-4 py-1 rounded-full">{t.popular}</span>
            <p className="text-4xl mb-2 text-gradient">☰</p>
            <h3 className="text-lg font-semibold mb-2">Pro</h3>
            <p className="text-4xl font-bold mb-1">$4.99</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{lang === "en" ? "/month" : "/月"}</p>
            <ul className="space-y-2 mb-8 flex-1 text-sm text-[var(--text-secondary)] text-left">
              <li>✓ {lang === "en" ? "Unlimited readings" : "无限次占卜"}</li>
              <li>✓ {lang === "en" ? "Advanced AI interpretation" : "高级AI解读"}</li>
              <li>✓ {lang === "en" ? "Priority access" : "优先访问"}</li>
              <li>✓ {lang === "en" ? "Early access to new features" : "新功能抢先体验"}</li>
            </ul>
            <div className="space-y-2 mb-3">
              <Link href="/payment/china" className="btn btn-primary w-full text-sm">
                💚 {lang === "en" ? "Pay with WeChat" : "微信支付"}
              </Link>
              <Link href="/payment/china" className="btn btn-secondary w-full text-sm">
                💙 {lang === "en" ? "Pay with Alipay" : "支付宝支付"}
              </Link>
            </div>
            <button onClick={() => setShowWaitlist(true)} className="btn btn-secondary w-full text-sm">
              {lang === "en" ? "Join Pro Waitlist" : "加入 Pro 等待名单"}
            </button>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              {lang === "en" ? "PayPal and card payments coming soon." : "PayPal 和银行卡支付即将上线。"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
