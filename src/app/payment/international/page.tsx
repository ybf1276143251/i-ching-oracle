"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

function InternationalPaymentContent() {
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

  const handleVerifyPayment = async () => {
    setStep("verifying");
    await new Promise(r => setTimeout(r, 2500));
    try {
      const res = await fetch(`/api/activate/generate?plan=${plan}`);
      const data = await res.json();
      if (res.ok && data.code) { setActivationCode(data.code); setStep("success"); }
      else { setStep("failed"); }
    } catch { setStep("failed"); }
  };

  const copyCode = () => { navigator.clipboard.writeText(activationCode); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (checking) return <div className="min-h-screen pt-24 text-center text-[var(--text-muted)]">Loading...</div>;
  if (!loggedIn) return (
    <div className="min-h-screen pt-24 pb-16"><div className="max-w-md mx-auto px-6"><div className="glass p-8 text-center">
      <p className="text-4xl mb-4">🔐</p>
      <h2 className="text-xl font-bold text-gradient mb-3">Sign in to continue</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">You need an account before making a payment. Sign in with your email.</p>
      <Link href={`/auth?redirect=${encodeURIComponent(window.location.pathname+window.location.search)}`} className="btn btn-primary w-full mb-3">Sign In / Register</Link>
      <Link href="/" className="btn btn-ghost btn-sm">← Back</Link>
    </div></div></div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-3xl mb-3">🌍</p>
          <p className="text-4xl mb-3">{plan === "pro" ? "☰" : "䷀"}</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">
            {plan === "pro" ? "Pro" : "Lifetime"}
          </h1>
          <p className="text-[var(--gold)] text-lg font-bold mb-4">
            {plan === "pro" ? "$0.9/mo" : "$9.9 lifetime"}
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {(["pro", "lifetime"] as const).map(p => (
              <button key={p} onClick={() => { setPlan(p); setStep("pay"); }} className={`btn btn-sm ${plan === p ? "btn-primary" : "btn-ghost"} text-xs`}>
                {p === "pro" ? "Pro" : "Lifetime"}
              </button>
            ))}
          </div>

          <div className="glass p-4 mb-6 text-left text-sm space-y-1.5">
            <p className="text-[var(--gold)] font-semibold text-center mb-2">Included</p>
            {["Unlimited readings", "Priority AI interpretation", "Advanced insights", "Ad-free experience"].map((f, i) => (
              <p key={i} className="text-[var(--text-secondary)]">✓ {f}</p>
            ))}
            {plan === "lifetime" && <p className="text-[var(--text-secondary)]">✓ Lifetime access</p>}
          </div>

          <AnimatePresence mode="wait">
            {step === "pay" && (
              <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="glass p-6 mb-6">
                  <p className="text-[var(--text-secondary)] text-sm mb-2">PingPong · {lang === "en" ? "Coming soon" : "即将上线"}</p>
                  <p className="text-xs text-[var(--text-muted)]">Pay via Twitter DM for now — instant activation code delivery.</p>
                </div>
                <p className="text-[var(--gold)] font-bold text-lg mb-4">{plan === "pro" ? "$0.9" : "$9.9"}</p>
                <button onClick={handleVerifyPayment} className="btn btn-primary w-full mb-3">
                  {lang === "en" ? "I've Paid — Verify" : "我已付款，验证"}
                </button>
              </motion.div>
            )}

            {step === "verifying" && (
              <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
                <p className="text-4xl animate-spin mb-4">☯</p>
                <p className="text-[var(--text-secondary)]">Verifying payment...</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-[var(--gold)] font-semibold mb-2">Payment Verified!</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">Your activation code:</p>
                <div className="glass p-4 mb-4 font-mono text-[var(--gold)] text-lg break-all select-all">{activationCode}</div>
                <button onClick={copyCode} className="btn btn-secondary btn-sm mb-3">{copied ? "Copied!" : "Copy Code"}</button>
                <Link href="/activate" className="btn btn-primary w-full block">🔑 Activate Now</Link>
              </motion.div>
            )}

            {step === "failed" && (
              <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
                <p className="text-3xl mb-3">📋</p>
                <p className="text-[var(--text)] font-semibold mb-2">Need Manual Activation</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">Contact me on Twitter for your activation code.</p>
                <a href="https://twitter.com/Fassfannqbjj" target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full mb-3">
                  🐦 @Fassfannqbjj
                </a>
                <button onClick={handleVerifyPayment} className="btn btn-ghost btn-sm">Retry</button>
              </motion.div>
            )}
          </AnimatePresence>

          <Link href="/read" className="btn btn-ghost btn-sm mt-4">← Back</Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function InternationalPaymentPage() {
  return <Suspense fallback={<div className="min-h-screen pt-24 text-center text-[var(--text-muted)]">Loading...</div>}><InternationalPaymentContent /></Suspense>;
}
