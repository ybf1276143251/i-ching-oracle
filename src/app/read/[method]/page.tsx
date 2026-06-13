"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
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

// Method definitions
const METHODS: Record<string, {
  icon: string; titleEn: string; titleZh: string;
  descEn: string; descZh: string;
  castType: CastType;
  inputLabelEn: string; inputLabelZh: string;
  placeholderEn: string; placeholderZh: string;
  showExtraInputs: boolean;
}> = {
  coins: {
    icon: "乾", titleEn: "Coin Divination", titleZh: "金钱卦",
    descEn: "Three coins tossed six times. The most widely used I Ching method, popularized during the Han Dynasty.",
    descZh: "三枚铜钱，投掷六次。自汉代以来最广泛使用的易经占卜方法。",
    castType: "three-coins",
    inputLabelEn: "What question do you hold in your heart?", inputLabelZh: "你心中怀着什么问题？",
    placeholderEn: "e.g. Should I change careers?\nHow can I improve my relationship?\nWhat should I focus on this month?",
    placeholderZh: "例如：我该换工作吗？\n如何改善我的人际关系？\n这个月应该关注什么？",
    showExtraInputs: false,
  },
  yarrow: {
    icon: "筮", titleEn: "Yarrow Stalk Divination", titleZh: "蓍草占卜",
    descEn: "The ancient traditional method using 50 yarrow stalks. Described in the Ten Wings, this is the original ritual.",
    descZh: "以五十根蓍草为工具的古老传统方法。载于《十翼》之中，是最原始的占卜仪式。",
    castType: "yarrow-stalks",
    inputLabelEn: "Form your question with sincerity and stillness.", inputLabelZh: "以诚敬之心默念你的问题。",
    placeholderEn: "Quiet your mind, then write your question here...", placeholderZh: "静心片刻，然后写下你的问题...",
    showExtraInputs: false,
  },
  plum: {
    icon: "梅", titleEn: "Plum Blossom Divination", titleZh: "梅花易数",
    descEn: "Created by Shao Yong in the Song Dynasty. Uses date, time, and observed numbers to form hexagrams instantly.",
    descZh: "北宋邵雍所创。以年月日时、所见数字起卦，随时随地皆可占。",
    castType: "random",
    inputLabelEn: "What do you seek guidance for?", inputLabelZh: "你寻求什么指引？",
    placeholderEn: "Describe your situation or question...", placeholderZh: "描述你当下的处境或问题...",
    showExtraInputs: true,
  },
  kingwen: {
    icon: "周", titleEn: "King Wen Oracle", titleZh: "文王卦",
    descEn: "The classical method attributed to King Wen of Zhou. Each hexagram is interpreted through the lens of the original judgments.",
    descZh: "相传周文王所创的经典解卦法。以卦辞为核心进行解读，直指事物本质。",
    castType: "three-coins",
    inputLabelEn: "Present your situation to the oracle.", inputLabelZh: "向卦象陈述你的情况。",
    placeholderEn: "What life situation do you need clarity on?", placeholderZh: "你在什么人生处境上需要明晰？",
    showExtraInputs: false,
  },
  numbers: {
    icon: "数", titleEn: "Number Divination", titleZh: "数字卦",
    descEn: "Generate a hexagram from three meaningful numbers. Simple yet profound — used when you need quick guidance.",
    descZh: "以三个有意义的数字起卦。简便而不失深意——在需要快速指引时使用。",
    castType: "random",
    inputLabelEn: "Choose three numbers that resonate with you.", inputLabelZh: "选择三个与你有缘的数字。",
    placeholderEn: "e.g. your birth date numbers, or three numbers that come to mind", placeholderZh: "例如：你的生日数字，或脑海中浮现的数字",
    showExtraInputs: true,
  },
};

export default function MethodPage() {
  const params = useParams();
  const method = (params?.method as string) || "coins";
  const m = METHODS[method] || METHODS.coins;
  const { t, lang } = useI18n();

  const [question, setQuestion] = useState("");
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
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
    try {
      const saved = localStorage.getItem(`iching-reading-${method}`);
      if (saved) { const p = JSON.parse(saved); setResult(p.result); setQuestion(p.question); setFullText(p.fullText || ""); }
    } catch {}
  }, [method]);

  useEffect(() => {
    if (result) {
      try { localStorage.setItem(`iching-reading-${method}`, JSON.stringify({ result, question, fullText })); } catch {}
    }
  }, [result, question, fullText, method]);

  const handleDivine = async () => {
    if (!question.trim()) { setError(lang === "en" ? "Please enter your question." : "请输入你的问题"); return; }
    setError(""); setLoading(true); setResult(null); setFullText("");
    try {
      const res = await fetch("/api/divine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), castType: m.castType }),
      });
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
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: result.readingId, question: question.trim(), hexagramId: result.cast.hexagram.id, relatedHexagramId: result.cast.relatedHexagram?.id, changingLines: result.cast.changingLines }),
      });
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
          <p className="text-5xl mb-4 text-gradient font-serif">{m.icon}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3">{lang === "en" ? m.titleEn : m.titleZh}</h1>
          <p className="text-[var(--text-muted)] text-sm max-w-lg mx-auto">{lang === "en" ? m.descEn : m.descZh}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass glass-glow p-8 md:p-10 mb-8">
          <label className="block text-sm text-[var(--text-muted)] mb-2">{lang === "en" ? m.inputLabelEn : m.inputLabelZh}</label>
          <textarea className="input min-h-[120px] resize-y text-base" placeholder={lang === "en" ? m.placeholderEn : m.placeholderZh} value={question} onChange={e => setQuestion(e.target.value)} maxLength={500} disabled={loading} />

          {m.showExtraInputs && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <input className="input text-center text-lg" placeholder={lang === "en" ? "Number 1" : "数字一"} value={num1} onChange={e => setNum1(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} />
              <input className="input text-center text-lg" placeholder={lang === "en" ? "Number 2" : "数字二"} value={num2} onChange={e => setNum2(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} />
              <input className="input text-center text-lg" placeholder={lang === "en" ? "Number 3" : "数字三"} value={num3} onChange={e => setNum3(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} />
            </div>
          )}

          <div className="flex items-center justify-between mt-4 mb-6">
            <span className="text-xs text-[var(--text-muted)]">{question.length}/500</span>
          </div>
          <button onClick={handleDivine} disabled={loading || !question.trim()} className="btn btn-primary w-full py-4 text-base font-semibold">
            {loading ? <><span className="inline-block animate-spin text-xl">☯</span> {lang === "en" ? "Casting..." : "起卦中..."}</> : <>{lang === "en" ? "Cast the Oracle" : "开始起卦"}</>}
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
                  <p className="text-[var(--text-secondary)] mb-4">{isPremium ? (lang === "en" ? "Unlock full AI reading." : "解锁完整AI解读。") : (lang === "en" ? "Upgrade to Pro for full reading." : "升级Pro获取完整解读。")}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={handleUnlock} disabled={interpreting} className="btn btn-primary">{interpreting ? <><span className="animate-spin">☯</span> {lang === "en" ? "Generating..." : "生成中..."}</> : <>解 {t.unlockFull}</>}</button>
                    {!isPremium && <button onClick={() => setShowModal(true)} className="btn btn-secondary">乾 {t.upgradePremium}</button>}
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
