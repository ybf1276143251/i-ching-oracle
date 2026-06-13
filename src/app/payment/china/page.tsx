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
  const [plan, setPlan] = useState<"pro" | "lifetime">((searchParams.get("plan") as "pro" | "lifetime") || "pro");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setChecking(false); return; }
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
      setChecking(false);
    });
  }, []);
  const [step, setStep] = useState<"pay" | "verifying" | "success" | "failed">("pay");
  const [activationCode, setActivationCode] = useState("");
  const [copied, setCopied] = useState(false);

  const price = plan === "pro" ? "¥0.9" : "¥9.9";
  const priceUsd = plan === "pro" ? "$0.9" : "$9.9";

  const handleVerifyPayment = async () => {
    setStep("verifying");
    // Simulate payment verification delay
    await new Promise(r => setTimeout(r, 2500));

    try {
      const res = await fetch(`/api/activate/generate?plan=${plan}`);
      const data = await res.json();
      if (res.ok && data.code) {
        setActivationCode(data.code);
        setStep("success");
      } else {
        setStep("failed");
      }
    } catch {
      setStep("failed");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (checking) return <div className="min-h-screen pt-24 text-center text-[var(--text-muted)]">Loading...</div>;
  if (!loggedIn) return (
    <div className="min-h-screen pt-24 pb-16"><div className="max-w-md mx-auto px-6"><div className="glass p-8 text-center">
      <p className="text-4xl mb-4">🔐</p>
      <h2 className="text-xl font-bold text-gradient mb-3">{lang==="en"?"Sign in to continue":"请先登录"}</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">{lang==="en"?"You need an account before making a payment. China users: phone number. International: email.":"支付前需要注册账号。国内用户用手机号，国际用户用邮箱。"}</p>
      <Link href={`/auth?redirect=${encodeURIComponent(window.location.pathname+window.location.search)}`} className="btn btn-primary w-full mb-3">{lang==="en"?"Sign In / Register":"登录 / 注册"}</Link>
      <Link href="/" className="btn btn-ghost btn-sm">← {lang==="en"?"Back":"返回"}</Link>
    </div></div></div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-4xl mb-3">{plan === "pro" ? "☰" : "䷀"}</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">
            {plan === "pro" ? "Pro" : "Max"}
          </h1>
          <p className="text-[var(--gold)] text-lg font-bold mb-4">
            {plan === "pro" ? (lang === "en" ? "$0.9/mo" : "¥0.9/月") : (lang === "en" ? "$9.9 lifetime" : "¥9.9 终身")}
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {(["pro", "lifetime"] as const).map(p => (
              <button key={p} onClick={() => { setPlan(p); setStep("pay"); }}
                className={`btn btn-sm ${plan === p ? "btn-primary" : "btn-ghost"} text-xs`}>
                {p === "pro" ? "Pro" : "Max"} · {p === "pro" ? (lang === "en" ? "$0.9" : "¥0.9") : (lang === "en" ? "$9.9" : "¥9.9")}
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="glass p-4 mb-6 text-left text-sm space-y-1.5">
            <p className="text-[var(--gold)] font-semibold text-center mb-2">{lang === "en" ? "Included" : "包含功能"}</p>
            {[lang === "en" ? "Unlimited readings" : "无限次占卜", lang === "en" ? "Priority AI interpretation" : "优先AI解读", lang === "en" ? "Advanced insights" : "高级洞察", lang === "en" ? "Ad-free experience" : "无广告体验"].map((f, i) => (
              <p key={i} className="text-[var(--text-secondary)]">✓ {f}</p>
            ))}
            {plan === "lifetime" && <p className="text-[var(--text-secondary)]">✓ {lang === "en" ? "Lifetime access" : "终身访问"}</p>}
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
                <p className="text-[var(--gold)] font-bold text-lg mb-4">{price} / {priceUsd}</p>
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
                <button onClick={copyCode} className="btn btn-secondary btn-sm mb-3">
                  {copied ? (lang === "en" ? "Copied!" : "已复制！") : (lang === "en" ? "Copy Code" : "复制激活码")}
                </button>
                <Link href="/activate" className="btn btn-primary w-full block">
                  🔑 {lang === "en" ? "Go to Activation" : "去激活"}
                </Link>
              </motion.div>
            )}

            {step === "failed" && (
              <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                <p className="text-3xl mb-3">📋</p>
                <p className="text-[var(--text)] font-semibold mb-2">{lang === "en" ? "Need Manual Activation" : "需要手动激活"}</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                  {lang === "en" ? "Auto-verification failed. Contact me directly:" : "自动验证未成功，请直接联系我："}
                </p>
                <div className="glass p-4 mb-3 text-sm space-y-2 text-left">
                  <p className="text-[var(--text-secondary)]">
                    💬 {lang === "en" ? "WeChat" : "微信"}：<span className="text-[var(--gold)]">Aaaa_ybf1128</span>
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    🐦 Twitter：<span className="text-[var(--gold)]">@Fassfannqbjj</span>
                  </p>
                </div>
                <button onClick={handleVerifyPayment} className="btn btn-secondary btn-sm">
                  {lang === "en" ? "Retry Verification" : "重新验证"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <Link href="/read" className="btn btn-ghost btn-sm mt-4">← {lang === "en" ? "Back" : "返回"}</Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ChinaPaymentPage() {
  return <Suspense fallback={<div className="min-h-screen pt-24 text-center text-[var(--text-muted)]">Loading...</div>}><ChinaPaymentContent /></Suspense>;
}
