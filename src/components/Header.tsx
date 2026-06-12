"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, lang, toggleLang } = useI18n();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-2xl">☯</span>
          <span className="text-base font-bold text-gradient hidden sm:inline">
            {t.siteName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--gold)] transition-colors text-sm">
            {t.home}
          </Link>
          <Link href="/seo" className="text-[var(--muted)] hover:text-[var(--gold)] transition-colors text-sm">
            {t.hexagrams64}
          </Link>
          <Link href="/history" className="text-[var(--muted)] hover:text-[var(--gold)] transition-colors text-sm">
            {t.history}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="text-xs px-2 py-1 rounded border border-[var(--border)] text-[var(--muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
          >
            {lang === "zh" ? "EN" : "中"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)] hidden sm:inline">
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={async () => {
                  const supabase = createClient();
                  if (supabase) await supabase.auth.signOut();
                  setUser(null);
                }}
                className="text-xs text-[var(--muted)] hover:text-[var(--red-light)] transition-colors"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn btn-secondary text-xs py-1 px-3">
              {t.login}
            </Link>
          )}

          <button
            className="md:hidden text-[var(--gold)] text-xl ml-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-2">
          <Link href="/" className="block text-sm py-1" onClick={() => setMenuOpen(false)}>{t.home}</Link>
          <Link href="/seo" className="block text-sm py-1" onClick={() => setMenuOpen(false)}>{t.hexagrams64}</Link>
          <Link href="/history" className="block text-sm py-1" onClick={() => setMenuOpen(false)}>{t.history}</Link>
        </div>
      )}
    </header>
  );
}
