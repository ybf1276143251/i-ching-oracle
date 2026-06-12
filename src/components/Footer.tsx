"use client";

import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <span>☯</span>
            <span>I Ching Oracle &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[var(--muted)]">
            <a href="/seo" className="hover:text-[var(--gold)] transition-colors">{t.hexagrams64}</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] transition-colors">GitHub</a>
            <span>{t.poweredBy}</span>
          </div>
        </div>
        <p className="text-center text-xs text-[var(--muted)] mt-4 opacity-60">
          {t.disclaimer}
        </p>
      </div>
    </footer>
  );
}
