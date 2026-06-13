"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { t, lang, toggleLang } = useI18n();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [plan, setPlan] = useState<string>("free");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => l.subscription.unsubscribe();
  }, []);

  // Fetch plan on mount and when user changes
  useEffect(() => {
    if (!user) { setPlan("free"); return; }
    // Check localStorage first for immediate display
    const localPlan = localStorage.getItem("iching-user-plan");
    if (localPlan === "pro" || localPlan === "lifetime") setPlan(localPlan);
    // Then verify from server
    fetch("/api/user").then(r => r.json()).then(d => {
      if (d.user) {
        const p = d.user.plan || "free";
        setPlan(p);
        localStorage.setItem("iching-user-plan", p);
      }
    }).catch(() => {});
  }, [user]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[rgba(212,175,55,0.1)]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="text-2xl">☯</span>
          <span className="text-base font-semibold text-gradient hidden sm:inline">
            {t.siteName}
          </span>
          {plan !== "free" && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${plan === "lifetime" ? "text-[var(--gold)] border-[var(--gold)] bg-[var(--gold)]/10" : "text-[var(--gold)] border-[var(--gold)]/50 bg-[var(--gold)]/5"}`}>
              {plan === "lifetime" ? "MAX" : "PRO"}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[{ href: "/", label: t.home }, { href: "/pricing", label: t.pricing }, { href: "/about", label: t.about }].map(item => (
            <Link key={item.href} href={item.href} className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-white/5">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-all">
            {lang === "en" ? "中文" : "EN"}
          </button>

          {user ? (
            <button onClick={async () => { const s = createClient(); if (s) await s.auth.signOut(); setUser(null); }} className="btn btn-ghost btn-sm text-xs">
              {t.logout}
            </button>
          ) : (
            <Link href="/auth" className="btn btn-ghost btn-sm text-xs">{t.login}</Link>
          )}

          <button
            onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/'}
            className="btn btn-ghost btn-sm text-xs"
            title={lang === "en" ? "Go back" : "返回"}
          >
            ← {lang === "en" ? "Back" : "返回"}
          </button>

          <button className="md:hidden text-[var(--text)] text-xl ml-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-[var(--border)] bg-[#0A0A0A]/95 backdrop-blur-xl px-4 py-3 space-y-1 overflow-hidden">
            {[{ href: "/", label: t.home }, { href: "/pricing", label: t.pricing }, { href: "/about", label: t.about }].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--text-secondary)] rounded-lg hover:bg-white/5">{item.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
