"use client";

import { useEffect, useState, useRef } from "react";
import { hexagramToUnicode, CastType } from "@/lib/divination";
import { useI18n } from "@/lib/i18n";
import PremiumModal from "@/components/PremiumModal";
import ParticleBackground from "@/components/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";

interface CastResult {
  readingId: string | null;
  cast: { hexagram: { id: number; name: string; nameEn: string; judgment: string; judgmentEn: string }; changingLines: number[]; isChanging: boolean; relatedHexagram: { id: number; name: string; nameEn: string } | null };
  summary: string;
}

function HexagramLines({ hexagramId, changingLines }: { hexagramId: number; changingLines: number[] }) {
  const id = hexagramId - 1;
  const bits: boolean[] = [];
  for (let i = 0; i < 6; i++) bits.push(((id >> i) & 1) === 1);
  return (
    <div className="flex flex-col items-center gap-1 my-4">
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
}

// ─── Trust stats ─────────────────────────────────────────────

function TrustSection() {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
      {[{ v: "64", l: t.trust64 }, { v: "AI", l: t.trustAI }, { v: "10K+", l: t.trustReadings }, { v: "EN/中", l: t.trustBilingual }].map((s, i) => (
        <div key={i} className="glass p-6 text-center">
          <p className="text-2xl font-bold text-gradient mb-1">{s.v}</p>
          <p className="text-xs text-[var(--text-muted)]">{s.l}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Reading sections ────────────────────────────────────────

function sectionTitles(lang: string, t: any) {
  return [
    { key: "overview", title: t.overview },
    { key: "career", title: t.career },
    { key: "love", title: t.love },
    { key: "wealth", title: t.wealth },
    { key: "growth", title: t.growth },
    { key: "action", title: t.action },
  ];
}

// Simple parser to split AI text into sections
function parseSections(text: string): Record<string, string> {
  const s: Record<string, string> = { overview: "", career: "", love: "", wealth: "", growth: "", action: "" };
  const keys = ["overview", "career", "love", "wealth", "growth", "action"];
  const markers = [
    /(?:overview|overall|卦象概述|卦象总览|总览)/i,
    /(?:career|work|事业|工作)/i,
    /(?:love|relationship|感情|人际|爱情)/i,
    /(?:wealth|finance|money|财运|财富|金钱)/i,
    /(?:growth|personal|成长|个人)/i,
    /(?:action|recommend|建议|行动)/i,
  ];

  // Try to split by markdown headings
  const parts = text.split(/(?=###?\s)/);
  let currentKey = "overview";

  for (const part of parts) {
    let matched = false;
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].test(part.substring(0, 80))) {
        currentKey = keys[i];
        matched = true;
        break;
      }
    }
    if (!matched && part === parts[0]) currentKey = "overview";
    s[currentKey] = (s[currentKey] ? s[currentKey] + "\n" : "") + part;
  }

  // If no sections were parsed, put everything in overview
  if (!s.overview && text) s.overview = text;

  return s;
}

// ─── Main Page ───────────────────────────────────────────────

export default function Home() {
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
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
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

  const sections = fullText ? parseSections(fullText) : null;
  const sectionMeta = sectionTitles(lang, t);

  return (
    <div className="relative">
      <PremiumModal open={showModal} onClose={() => setShowModal(false)} />
      <ParticleBackground />

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-3xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-sm text-[var(--gold)] tracking-[0.2em] uppercase mb-6">{t.tagline}</p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.08] mb-6">
              <span className="text-gradient">{t.heroTitle.split("\n")[0]}</span>
              <br />
              <span className="text-[var(--text)]">{t.heroTitle.split("\n")[1] || ""}</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#reading" className="btn btn-primary text-base px-10 py-4">🔮 {t.startReading}</a>
              <a href="#trust" className="btn btn-secondary text-base px-10 py-4">{t.learnMore}</a>
            </div>
          </motion.div>
        </div>

        {/* Hero glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--gold)] opacity-[0.03] blur-[120px] pointer-events-none" />
      </section>

      {/* ─── Trust ─── */}
      <section id="trust" className="max-w-5xl mx-auto px-6 pb-8">
        <TrustSection />
      </section>

      {/* ─── Reading Input ─── */}
      <section id="reading" className="max-w-2xl mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="glass glass-glow p-8 md:p-10">
          <h2 className="text-2xl font-bold text-gradient mb-2">{t.questionTitle}</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            {lang === "en" ? "Examples below. Be specific for deeper insight." : "下方有示例。问题越具体，解读越深入。"}
          </p>
          <textarea
            className="input min-h-[120px] resize-y mb-2 text-base"
            placeholder={t.questionPlaceholder}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            maxLength={500}
            disabled={loading}
          />
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-[var(--text-muted)]">{question.length}/500</span>
          </div>
          <button onClick={handleDivine} disabled={loading || !question.trim()} className="btn btn-primary w-full py-4 text-base">
            {loading ? <><span className="inline-block animate-spin">☯</span> {t.generating}</> : <>🔮 {t.generateReading}</>}
          </button>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
              {error}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ─── Results ─── */}
      <AnimatePresence>
        {result && (
          <motion.section ref={resultRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="max-w-3xl mx-auto px-6 pb-24">
            {/* Hexagram header */}
            <div className="glass glass-glow p-8 md:p-10 text-center mb-6">
              <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-4">{t.resultTitle}</p>
              <div className="text-8xl mb-4">{hexagramToUnicode(result.cast.hexagram.id)}</div>
              <h2 className="text-3xl font-bold text-gradient mb-1">{result.cast.hexagram.name}</h2>
              <p className="text-[var(--text-secondary)]">{result.cast.hexagram.nameEn} · #{result.cast.hexagram.id}</p>
              <HexagramLines hexagramId={result.cast.hexagram.id} changingLines={result.cast.changingLines} />

              {result.cast.changingLines.length > 0 && (
                <p className="text-xs text-[var(--text-muted)] mt-2">{t.changingLine} {result.cast.changingLines.join(", ")}</p>
              )}
              {result.cast.relatedHexagram && (
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] mb-2">{t.relatedHexagram}</p>
                  <div className="text-4xl">{hexagramToUnicode(result.cast.relatedHexagram.id)}</div>
                  <p className="text-base font-medium text-gradient">{result.cast.relatedHexagram.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{result.cast.relatedHexagram.nameEn}</p>
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="glass p-8 md:p-10 mb-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">{t.aiSummary}</h3>
              <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, "<br/>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
            </div>

            {/* Full reading */}
            {!fullText ? (
              <div className="glass p-8 md:p-10 text-center">
                <p className="text-[var(--text-secondary)] mb-4">
                  {isPremium ? (lang === "en" ? "Unlock your full AI reading with deep insights." : "解锁你的完整 AI 深度解读。") : (lang === "en" ? "Free summary above. Upgrade to Premium for the complete reading." : "以上为免费摘要。升级 Premium 获取完整解读。")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={handleUnlock} disabled={interpreting} className="btn btn-primary">
                    {interpreting ? <><span className="animate-spin">☯</span> {lang === "en" ? "Generating..." : "生成中..."}</> : <>🔮 {t.unlockFull}</>}
                  </button>
                  {!isPremium && (
                    <button onClick={() => setShowModal(true)} className="btn btn-secondary">⭐ {t.upgradePremium}</button>
                  )}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
                {sectionMeta.map(({ key, title }, i) => {
                  const content = sections?.[key];
                  if (!content || content.trim().length < 10) return null;
                  return (
                    <motion.div key={key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }} className="glass p-6 md:p-8">
                      <h3 className="text-base font-semibold text-gradient mb-3">{title}</h3>
                      <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/###?\s*(.+)/g, "<h3>$1</h3>") }} />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
