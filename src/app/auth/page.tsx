"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";

function AuthForm() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const supabase = createClient();
        if (supabase) await supabase.auth.refreshSession();
        router.push(redirect);
        router.refresh();
      } else {
        const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, displayName }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage(data.message || "OK");
        setMode("login");
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <span className="text-4xl">☯</span>
        <h1 className="text-2xl font-bold text-gradient mt-2">{mode === "login" ? t.login : t.register}</h1>
        <p className="text-[var(--muted)] text-sm mt-1">{mode === "login" ? "登录以查看占卜历史" : "创建账号以保存占卜记录"}</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {mode === "register" && <div><label className="block text-sm text-[var(--muted)] mb-1">{t.displayName}</label><input type="text" className="input" placeholder={t.displayName} value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>}
        <div><label className="block text-sm text-[var(--muted)] mb-1">{t.email}</label><input type="email" className="input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><label className="block text-sm text-[var(--muted)] mb-1">{t.password}</label><input type="password" className="input" placeholder="至少8位" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} /></div>
        {error && <div className="text-[var(--red-light)] text-sm bg-[var(--red)]/10 p-2 rounded">{error}</div>}
        {message && <div className="text-green-400 text-sm bg-green-900/20 p-2 rounded">{message}</div>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? "..." : mode === "login" ? t.login : t.register}</button>
        <div className="text-center text-sm text-[var(--muted)]">
          {mode === "login" ? <>{t.noAccount} <button type="button" onClick={() => setMode("register")} className="text-[var(--gold)] hover:underline">{t.register}</button></> : <>{t.hasAccount} <button type="button" onClick={() => setMode("login")} className="text-[var(--gold)] hover:underline">{t.login}</button></>}
        </div>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return <div className="max-w-md mx-auto px-4 py-16"><Suspense fallback={<div className="text-center text-[var(--muted)]">...</div>}><AuthForm /></Suspense></div>;
}
