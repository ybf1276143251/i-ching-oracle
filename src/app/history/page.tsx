"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { hexagramToUnicode } from "@/lib/divination";
import { Reading } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function HistoryPage() {
  const { t } = useI18n();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/auth?redirect=/history"); return; }
      fetchHistory();
    });
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) { const data = await res.json(); setReadings(data.readings || []); }
    } catch {} finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    try { const res = await fetch(`/api/history?id=${id}`, { method: "DELETE" }); if (res.ok) setReadings((p) => p.filter((r) => r.id !== id)); } catch {}
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><p className="text-[var(--muted)]">{t.loading}</p></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gradient">{t.history}</h1>
        <Link href="/" className="btn btn-secondary text-sm py-1.5 px-3">+ {t.newDivination}</Link>
      </div>
      {readings.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-5xl block mb-4">🔮</span>
          <p className="text-[var(--muted)]">{t.noHistory}</p>
          <Link href="/" className="btn btn-primary mt-4">{t.firstDivination}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {readings.map((r) => (
            <div key={r.id} className="card group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl opacity-60">{hexagramToUnicode(r.primaryHexagram)}</span>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{r.question}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">{new Date(r.createdAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{r.summary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.isPremium ? <span className="text-xs text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full">{t.premiumTag}</span> : <span className="text-xs text-[var(--muted)] bg-[var(--border)] px-2 py-0.5 rounded-full">{t.freeSummaryTag}</span>}
                  <button onClick={() => handleDelete(r.id)} className="text-xs text-[var(--muted)] hover:text-[var(--red-light)] opacity-0 group-hover:opacity-100 transition-opacity">{t.delete}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
