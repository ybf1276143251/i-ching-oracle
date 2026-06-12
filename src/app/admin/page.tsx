"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

interface AdminStats {
  totalUsers: number;
  totalReadings: number;
  totalPayments: number;
  totalHexagrams: number;
  recentReadings: Array<{
    id: string;
    question: string;
    primary_hexagram: number;
    created_at: string;
    profiles?: { email?: string; display_name?: string } | null;
  }>;
}

export default function AdminPage() {
  const { t, lang } = useI18n();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");
  const router = useRouter();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.status === 401 || res.status === 403) { router.push("/auth?redirect=/admin"); return; }
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {} finally { setLoading(false); }
  };

  const handleSeed = async () => {
    setSeeding(true); setSeedMessage("");
    try {
      const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "seed_hexagrams" }) });
      const data = await res.json();
      setSeedMessage(data.message || data.error || "OK");
    } catch { setSeedMessage("Error"); }
    finally { setSeeding(false); }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--muted)]">{t.loading}</div>;
  if (!stats) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-[var(--red-light)]">{lang === "zh" ? "无法加载管理数据" : "Failed to load admin data"}</div>;

  const statItems = [
    { label: t.totalUsers, value: stats.totalUsers, icon: "👥" },
    { label: t.totalReadings, value: stats.totalReadings, icon: "🔮" },
    { label: t.totalPayments, value: stats.totalPayments, icon: "💳" },
    { label: t.totalHexagrams, value: stats.totalHexagrams, icon: "☯" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gradient mb-8">{t.adminPanel}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statItems.map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold text-gradient">{s.value}</p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gradient mb-3">{lang === "zh" ? "操作" : "Actions"}</h2>
        <button onClick={handleSeed} disabled={seeding} className="btn btn-secondary text-sm">{seeding ? t.seeding : t.seedSEO}</button>
        {seedMessage && <p className="text-sm text-[var(--gold)] mt-2">{seedMessage}</p>}
      </div>
      <div className="card">
        <h2 className="text-lg font-bold text-gradient mb-3">{t.recentReadings}</h2>
        {stats.recentReadings.length === 0 ? <p className="text-sm text-[var(--muted)]">{t.noHistory}</p> : (
          <div className="space-y-3">
            {stats.recentReadings.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{r.question}</p>
                  <p className="text-xs text-[var(--muted)]">{r.profiles?.email || r.profiles?.display_name || (lang === "zh" ? "匿名" : "Anonymous")} · {new Date(r.created_at).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US")}</p>
                </div>
                <span className="text-xs text-[var(--muted)] ml-4 whitespace-nowrap">{lang === "zh" ? "卦" : "Hex"}{r.primary_hexagram}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
