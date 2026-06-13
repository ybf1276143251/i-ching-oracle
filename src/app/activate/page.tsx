"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function ActivatePage() {
  const { lang } = useI18n();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; plan?: string; message?: string } | null>(null);

  const handleActivate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.success) localStorage.setItem("iching-user-plan", data.plan || "lifetime");
      setResult(data);
    } catch {
      setResult({ error: lang === "en" ? "Network error" : "网络错误" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-md mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-4xl mb-4">🔑</p>
          <h1 className="text-2xl font-bold text-gradient mb-2">
            {lang === "en" ? "Activate Premium" : "激活 Premium"}
          </h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            {lang === "en" ? "Enter your activation code" : "输入你的激活码"}
          </p>

          <input
            className="input mb-4 text-center text-lg tracking-widest font-mono"
            placeholder="PRO-XXXX-XXXX-XXXX"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            disabled={loading}
          />

          <button onClick={handleActivate} disabled={loading || !code.trim()} className="btn btn-primary w-full mb-4">
            {loading ? (lang === "en" ? "Activating..." : "激活中...") : (lang === "en" ? "Activate" : "激活")}
          </button>

          {result?.success && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 mb-6 text-center">
              <p className="text-3xl mb-3">🎉</p>
              <p className="text-[var(--gold)] font-bold text-lg mb-2">
                {result.plan === "lifetime"
                  ? (lang === "en" ? "Welcome, Max Member!" : "尊敬的 Max 用户")
                  : (lang === "en" ? "Welcome, Pro Member!" : "尊敬的 Pro 用户")
                }
              </p>
              <p className="text-sm text-green-400 mb-3">
                {result.plan === "lifetime"
                  ? (lang === "en" ? "Enjoy lifetime access to all premium features. Thank you for your support!" : "您可以终身使用 Pro 版本的全部功能。感谢支持！")
                  : (lang === "en" ? "You can now enjoy unlimited readings, priority AI, and all premium features. Thank you!" : "您可以尽情使用无限占卜、优先AI解读等全部高级功能。感谢支持！")
                }
              </p>
              <Link href="/read/coins" className="btn btn-primary btn-sm">
                {lang === "en" ? "Start Your First Reading" : "开始占卜"}
              </Link>
            </motion.div>
          )}

          {result?.error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 mb-4">
              ❌ {result.error}
            </motion.div>
          )}

          <p className="text-xs text-[var(--text-muted)] mb-4">
            {lang === "en"
              ? "Don't have a code? Go to pricing to purchase."
              : "还没有激活码？前往购买。"}
          </p>

          <div className="flex gap-3">
            <Link href="/pricing" className="btn btn-secondary btn-sm flex-1">{lang === "en" ? "Pricing" : "购买"}</Link>
            <Link href="/read" className="btn btn-ghost btn-sm flex-1">{lang === "en" ? "Back" : "返回"}</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
