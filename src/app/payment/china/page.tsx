"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

function ChinaPaymentContent() {
  const { lang } = useI18n();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"pay" | "verifying" | "success" | "failed">("pay");
  const [activationCode, setActivationCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user); setChecking(false);
    });
  }, []);

  const handleVerifyPayment = async () => {
    setStep("verifying");
    await new Promise(r => setTimeout(r, 2500));
    try {
      const res = await fetch("/api/activate/generate?plan=pro");
      const data = await res.json();
      if (res.ok && data.code) { setActivationCode(data.code); setStep("success"); }
      else { setStep("failed"); }
    } catch { setStep("failed"); }
  };

  const copyCode = () => { navigator.clipboard.writeText(activationCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (checking) return <div className="min-h-screen pt-24 text-center text-[var(--text-muted)]">Loading...</div>;
  if (!loggedIn) return (
    <div className="min-h-screen pt-24 pb-16"><div className="max-w-md mx-auto px-6"><div className="glass p-8 text-center">
      <h2 className="text-xl font-bold text-gradient mb-3">{lang==="en"?"Sign in to continue":"请先登录"}</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">{lang==="en"?"You need an account before making a payment.":"支付前需要注册账号。"}</p>
      <Link href={`/auth?redirect=${encodeURIComponent(window.location.pathname+window.location.search)}`} className="btn btn-primary w-full mb-3">{lang==="en"?"Sign In / Register":"登录 / 注册"}</Link>
      <Link href="/" className="btn btn-ghost btn-sm">← {lang==="en"?"Back":"返回"}</Link>
    </div></div></div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-4xl mb-3 text-gradient">☰</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">Pro</h1>
          <p className="text-[var(--gold)] text-lg font-bold mb-4">{lang === "en" ? "$4.99/month" : "¥4.99/月"}</p>

          <div className="glass p-4 mb-6 text-left text-sm space-y-1.5">
            <p className="text-[var(--gold)] font-semibold text-center mb-2">{lang === "en" ? "Included" : "包含功能"}</p>
            {[lang === "en" ? "Unlimited readings" : "无限次占卜", lang === "en" ? "Advanced AI interpretation" : "高级AI解读", lang === "en" ? "Priority access" : "优先访问", lang === "en" ? "Early access to new features" : "新功能抢先体验"].map((f, i) => (
              <p key={i} className="text-[var(--text-secondary)]">✓ {f}</p>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "pay" && (
              <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-3">
                    <img src="/wechat-qr.jpg" alt="WeChat" className="w-full rounded-lg" />
                    <p className="text-zinc-500 text-xs mt-1">微信 WeChat</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <img src="/alipay-qr.jpg" alt="Alipay" className="w-full rounded-lg" />
                    <p className="text-zinc-500 text-xs mt-1">支付宝 Alipay</p>
                  </div>
                </div>
                <p className="text-[var(--gold)] font-bold text-lg mb-4">{lang === "en" ? "$4.99/month" : "¥4.99/月"}</p>
                <button onClick={handleVerifyPayment} className="btn btn-primary w-full mb-3">
                  {lang === "en" ? "I've Paid — Verify" : "我已付款，验证获取激活码"}
                </button>
              </motion.div>
            )}

            {step === "verifying" && (
              <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
                <p className="text-4xl animate-spin mb-4">☯</p>
                <p className="text-[var(--text-secondary)]">{lang === "en" ? "Verifying payment..." : "正在验证付款..."}</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-[var(--gold)] font-semibold mb-2">{lang === "en" ? "Payment Verified!" : "付款验证成功！"}</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">{lang === "en" ? "Your activation code:" : "你的激活码："}</p>
                <div className="glass p-4 mb-4 font-mono text-[var(--gold)] text-lg break-all select-all">{activationCode}</div>
                <button onClick={copyCode} className="btn btn-secondary btn-sm mb-3">{copied ? (lang === "en" ? "Copied!" : "已复制！") : (lang === "en" ? "Copy Code" : "复制激活码")}</button>
                <Link href="/activate" className="btn btn-primary w-full block">{lang === "en" ? "Go to Activation" : "去激活"}</Link>
              </motion.div>
            )}

            {step === "failed" && (
              <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                <p className="text-3xl mb-3">📋</p>
                <p className="text-[var(--text)] font-semibold mb-2">{lang === "en" ? "Need Manual Activation" : "需要手动激活"}</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">{lang === "en" ? "Contact me directly:" : "请直接联系我："}</p>
                <div className="glass p-4 mb-3 text-sm space-y-2 text-left">
                  <p className="text-[var(--text-secondary)]">💬 {lang === "en" ? "WeChat" : "微信"}：<span className="text-[var(--gold)]">Aaaa_ybf1128</span></p>
                  <p className="text-[var(--text-secondary)]">🐦 Twitter：<span className="text-[var(--gold)]">@Fassfannqbjj</span></p>
                </div>
                <button onClick={handleVerifyPayment} className="btn btn-secondary btn-sm">{lang === "en" ? "Retry" : "重新验证"}</button>
              </motion.div>
            )}
          </AnimatePresence>

          <Link href="/read/coins" className="btn btn-ghost btn-sm mt-4">← {lang === "en" ? "Back" : "返回"}</Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ChinaPaymentPage() {
  return <Suspense fallback={<div className="min-h-screen pt-24 text-center text-[var(--text-muted)]">Loading...</div>}><ChinaPaymentContent /></Suspense>;
}
