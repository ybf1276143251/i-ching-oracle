"use client";

import { useEffect, useState } from "react";
import { hexagramToUnicode, CastType } from "@/lib/divination";
import { useI18n } from "@/lib/i18n";
import PremiumModal from "@/components/PremiumModal";

interface CastResult {
  readingId: string | null;
  cast: {
    hexagram: { id: number; name: string; nameEn: string; judgment: string; judgmentEn: string };
    changingLines: number[];
    isChanging: boolean;
    relatedHexagram: { id: number; name: string; nameEn: string } | null;
  };
  summary: string;
}

function HexagramLines({ hexagramId, changingLines }: { hexagramId: number; changingLines: number[] }) {
  const id = hexagramId - 1;
  const lineBits: boolean[] = [];
  for (let i = 0; i < 6; i++) lineBits.push(((id >> i) & 1) === 1);
  return (
    <div className="flex flex-col items-center gap-1 my-4">
      {[5, 4, 3, 2, 1, 0].map((i) => {
        const ln = i + 1;
        const yang = lineBits[i];
        const ch = changingLines.includes(ln);
        return (
          <div key={i} className={`flex items-center gap-2 relative ${ch ? "hex-line-changing" : ""}`}>
            <span className="text-xs text-[var(--muted)] w-4 text-right">{ln}</span>
            {yang ? <div className="hex-line-yang" /> : <div className="flex gap-3" style={{ width: 80 }}><div className="hex-line-yin-half" /><div className="hex-line-yin-half" /></div>}
            {ch && <span className="text-[var(--red-light)] text-xs">→</span>}
          </div>
        );
      })}
    </div>
  );
}

function md(s: string) {
  return s.replace(/\n/g, "<br/>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/### (.+)/g, "<h3>$1</h3>").replace(/## (.+)/g, "<h2>$1</h2>");
}

export default function Home() {
  const { t, lang } = useI18n();
  const [question, setQuestion] = useState("");
  const [castType, setCastType] = useState<CastType>("three-coins");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CastResult | null>(null);
  const [error, setError] = useState("");
  const [interpreting, setInterpreting] = useState(false);
  const [fullInterpretation, setFullInterpretation] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => {
      if (d.user) setIsPremium(d.user.is_premium || d.user.plan === "premium");
    }).catch(() => {}).finally(() => setProfileLoaded(true));
  }, []);

  const handleDivine = async () => {
    if (!question.trim()) { setError(lang === "zh" ? "请输入问题" : "Enter your question"); return; }
    setError(""); setLoading(true); setResult(null); setFullInterpretation("");
    try {
      const res = await fetch("/api/divine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question.trim(), castType }) });
      const data = await res.json();
      if (!res.ok) {
        if (data.limitReached) setShowPremiumModal(true);
        throw new Error(data.error);
      }
      setResult(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  };

  const handleUnlock = async () => {
    if (!isPremium) { setShowPremiumModal(true); return; }
    if (!result) return;
    setInterpreting(true);
    try {
      const res = await fetch("/api/interpret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readingId: result.readingId, question: question.trim(), hexagramId: result.cast.hexagram.id, relatedHexagramId: result.cast.relatedHexagram?.id, changingLines: result.cast.changingLines }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFullInterpretation(data.interpretation);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setInterpreting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
      <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />

      {/* Hero */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">{t.heroTitle}</span></h1>
        <p className="text-[var(--muted)] text-lg max-w-xl mx-auto">{t.heroDesc}</p>
        {profileLoaded && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs">
            {isPremium ? (
              <span className="text-[var(--gold)] bg-[var(--gold)]/10 px-3 py-1 rounded-full">⭐ {t.premiumUser}</span>
            ) : (
              <span className="text-[var(--muted)] bg-[var(--border)]/50 px-3 py-1 rounded-full">
                {t.freeUser} · {t.dailyLimit}: {process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || 3}{t.dailyLimit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Question form */}
      <div className="card mb-8 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
        <label className="block text-sm text-[var(--muted)] mb-2">{t.questionLabel}</label>
        <textarea className="input min-h-[80px] resize-y" placeholder={t.questionPlaceholder} value={question} onChange={e => setQuestion(e.target.value)} maxLength={500} disabled={loading} />
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {(["three-coins", "yarrow-stalks", "random"] as CastType[]).map(type => (
              <button key={type} onClick={() => setCastType(type)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${castType === type ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]"}`} disabled={loading}>
                {type === "three-coins" ? t.coinMethod : type === "yarrow-stalks" ? t.yarrowMethod : t.randomMethod}
              </button>
            ))}
          </div>
          <span className="text-xs text-[var(--muted)]">{question.length}/500</span>
        </div>
        <button onClick={handleDivine} disabled={loading || !question.trim()} className="btn btn-primary w-full mt-4 py-3 text-base">
          {loading ? <><span className="inline-block animate-coinToss">🪙</span> {t.casting}</> : <><span>☯</span> {t.startDivination}</>}
        </button>
      </div>

      {error && <div className="card border-[var(--red)] bg-[var(--red)]/5 mb-8 animate-fadeIn"><p className="text-[var(--red-light)] text-sm">{error}</p></div>}

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          <div className="card card-gold text-center">
            <p className="text-[var(--muted)] text-sm mb-2">{t.resultTitle}</p>
            <div className="text-6xl mb-2">{hexagramToUnicode(result.cast.hexagram.id)}</div>
            <h2 className="text-2xl font-bold text-gradient mb-1">{result.cast.hexagram.name}</h2>
            <p className="text-[var(--muted)] text-sm">{result.cast.hexagram.nameEn} · #{result.cast.hexagram.id}</p>
            <HexagramLines hexagramId={result.cast.hexagram.id} changingLines={result.cast.changingLines} />
            {result.cast.changingLines.length > 0 && <p className="text-xs text-[var(--red-light)] mt-2">{t.changingLine}：第{result.cast.changingLines.join("、")}爻</p>}
            {result.cast.relatedHexagram && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted)] mb-1">{t.relatedHexagram}</p>
                <div className="text-3xl">{hexagramToUnicode(result.cast.relatedHexagram.id)}</div>
                <p className="text-sm font-medium text-gradient">{result.cast.relatedHexagram.name}</p>
                <p className="text-xs text-[var(--muted)]">{result.cast.relatedHexagram.nameEn}</p>
              </div>
            )}
          </div>

          {/* Free summary */}
          <div className="card animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-bold text-gradient mb-3">{t.aiSummary}</h3>
            <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: md(result.summary) }} />
          </div>

          {/* Premium CTA / Full interpretation */}
          {!fullInterpretation ? (
            <div className="card animate-fadeIn text-center" style={{ animationDelay: "0.3s" }}>
              <p className="text-[var(--muted)] text-sm mb-4">
                {isPremium
                  ? (lang === "zh" ? "Premium 会员，解锁你的完整深度解读。" : "Premium member — unlock your full deep reading.")
                  : (lang === "zh" ? "以上为免费摘要。升级 Premium 获取完整 AI 深度解读。" : "Free summary above. Upgrade to Premium for full AI deep reading.")
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={handleUnlock} disabled={interpreting} className="btn btn-primary">
                  {interpreting ? <><span className="animate-pulse">⏳</span> {t.interpreting}</> : <><span>🔮</span> {t.unlockFull}</>}
                </button>
                {!isPremium && (
                  <button onClick={() => setShowPremiumModal(true)} className="btn btn-secondary">
                    ⭐ {t.upgradePremium}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="card card-gold animate-fadeIn" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-lg font-bold text-gradient mb-3">{t.fullInterpretation}</h3>
              <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: md(fullInterpretation) }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
