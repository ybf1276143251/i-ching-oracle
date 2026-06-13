"use client";

import { useEffect, useState, useRef } from "react";
import { hexagramToUnicode } from "@/lib/divination";
import { useI18n } from "@/lib/i18n";
import PremiumModal from "@/components/PremiumModal";
import ParticleBackground from "@/components/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";

interface CastResult {
  readingId: string | null;
  cast: { hexagram: { id: number; name: string; nameEn: string; judgment: string; judgmentEn: string }; changingLines: number[]; isChanging: boolean; relatedHexagram: { id: number; name: string; nameEn: string } | null };
  summary: string;
}

const HexagramLines = ({ hexagramId, changingLines }: { hexagramId: number; changingLines: number[] }) => {
  const id = hexagramId - 1;
  const bits: boolean[] = [];
  for (let i = 0; i < 6; i++) bits.push(((id >> i) & 1) === 1);
  return (
    <div className="flex flex-col items-center gap-1.5 my-5">
      {[5, 4, 3, 2, 1, 0].map(i => {
        const ln = i + 1; const yang = bits[i]; const ch = changingLines.includes(ln);
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-[var(--text-muted)] w-4 text-right">{ln}</span>
            {yang ? <div className="hex-line-yang" /> : <div className="flex gap-3" style={{ width: 90 }}><div className="hex-line-yin-half" /><div className="hex-line-yin-half" /></div>}
            {ch && <span className="text-[var(--gold)] text-xs font-bold">→</span>}
          </div>
        );
      })}
    </div>
  );
};

export default function ReadPage() {
  const { t, lang } = useI18n();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CastResult | null>(null);
  const [error, setError] = useState("");
  const [interpreting, setInterpreting] = useState(false);
  const [fullText, setFullText] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => {
      if (d.user) setIsPremium(d.user.is_premium || d.user.plan === "premium");
    }).catch(() => {});
  }, []);

  const handleDivine = async () => {
    if (!question.trim()) { setError(lang === "en" ? "Please enter your question." : "请输入你的问题"); return; }
    setError(""); setLoading(true); setResult(null); setFullText("");
    try {
      const res = await fetch("/api/divine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: question.trim(), castType: "three-coins" }) });
      const data = await res.json();
      if (!res.ok) { if (data.limitReached) setShowModal(true); throw new Error(data.error); }
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  };

  const handleUnlock = async () => {
    if (!isPremium) { setShowModal(true); return; }
    if (!result) return;
    setInterpreting(true);
    try {
      const res = await fetch("/api/interpret", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readingId: result.readingId, question: question.trim(), hexagramId: result.cast.hexagram.id, relatedHexagramId: result.cast.relatedHexagram?.id, changingLines: result.cast.changingLines }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setFullText(d.interpretation);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setInterpreting(false); }
  };

  return (
    <div className="relative min-h-screen">
      <PremiumModal open={showModal} onClose={() => setShowModal(false)} />
      <ParticleBackground />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <p className="text-sm text-[var(--gold)] tracking-[0.2em] uppercase mb-4">{lang === "en" ? "The Oracle Awaits" : "易经在等待"}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">{t.questionTitle}</h1>
          <p className="text-[var(--text-muted)] text-sm">{lang === "en" ? "Be specific. The deeper the question, the deeper the answer." : "越具体的问题，越深刻的回答。"}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="glass glass-glow p-8 md:p-10 mb-8">
          <textarea className="input min-h-[140px] resize-y text-base" placeholder={t.questionPlaceholder} value={question} onChange={e => setQuestion(e.target.value)} maxLength={500} disabled={loading} />
          <div className="flex items-center justify-between mt-4 mb-6">
            <span className="text-xs text-[var(--text-muted)]">{question.length}/500</span>
          </div>
          <button onClick={handleDivine} disabled={loading || !question.trim()} className="btn btn-primary w-full py-4 text-base font-semibold">
            {loading ? <><span className="inline-block animate-spin text-xl">☯</span> {t.generating}</> : <>🔮 {t.generateReading}</>}
          </button>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">{error}</motion.div>}
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div ref={resultRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="glass glass-glow p-8 md:p-10 text-center mb-6">
                <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-4">{t.resultTitle}</p>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} className="text-8xl mb-4">{hexagramToUnicode(result.cast.hexagram.id)}</motion.div>
                <h2 className="text-3xl font-bold text-gradient mb-1">{result.cast.hexagram.name}</h2>
                <p className="text-[var(--text-secondary)]">{result.cast.hexagram.nameEn} · #{result.cast.hexagram.id}</p>
                <HexagramLines hexagramId={result.cast.hexagram.id} changingLines={result.cast.changingLines} />
                {result.cast.changingLines.length > 0 && <p className="text-xs text-[var(--text-muted)]">{t.changingLine} {result.cast.changingLines.join(", ")}</p>}
                {result.cast.relatedHexagram && (
                  <div className="mt-6 pt-6 border-t border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)] mb-2">{t.relatedHexagram}</p>
                    <div className="text-4xl">{hexagramToUnicode(result.cast.relatedHexagram.id)}</div>
                    <p className="text-base font-medium text-gradient">{result.cast.relatedHexagram.name}</p>
                  </div>
                )}
              </div>

              <div className="glass p-8 md:p-10 mb-6">
                <h3 className="text-lg font-semibold text-gradient mb-4">{t.aiSummary}</h3>
                <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, "<br/>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
              </div>

              {!fullText ? (
                <div className="glass p-8 md:p-10 text-center">
                  <p className="text-[var(--text-secondary)] mb-4">{isPremium ? (lang === "en" ? "Unlock your complete AI reading." : "解锁完整AI解读。") : (lang === "en" ? "Upgrade to Premium for the full reading." : "升级Premium获取完整解读。")}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={handleUnlock} disabled={interpreting} className="btn btn-primary">{interpreting ? <><span className="animate-spin">☯</span> {lang === "en" ? "Generating..." : "生成中..."}</> : <>🔮 {t.unlockFull}</>}</button>
                    {!isPremium && <button onClick={() => setShowModal(true)} className="btn btn-secondary">⭐ {t.upgradePremium}</button>}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 md:p-10">
                  <h3 className="text-lg font-semibold text-gradient mb-6">{t.fullInterpretation}</h3>
                  <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: fullText.replace(/\n/g, "<br/>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/###?\s*(.+)/g, "<h3>$1</h3>") }} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
