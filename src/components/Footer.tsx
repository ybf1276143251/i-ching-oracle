"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-sm font-semibold text-gradient mb-3">{t.siteName}</p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{t.tagline}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text)] mb-3 uppercase tracking-wider">Product</p>
            <div className="space-y-2">
              <Link href="/" className="block text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">{t.home}</Link>
              <Link href="/pricing" className="block text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">{t.pricing}</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text)] mb-3 uppercase tracking-wider">Company</p>
            <div className="space-y-2">
              <Link href="/about" className="block text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">{t.about}</Link>
              <Link href="/seo" className="block text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">{t.trust64}</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text)] mb-3 uppercase tracking-wider">Legal</p>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">© {new Date().getFullYear()} I Ching Oracle. {t.poweredBy} · Designed with Ancient Wisdom</p>
          <p className="text-xs text-[var(--text-muted)]">{t.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
