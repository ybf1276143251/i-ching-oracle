"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-6"><span className="text-gradient">{t.aboutTitle}</span></h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">{t.aboutDesc}</p>

          <div className="glass p-8 mb-8">
            <h2 className="text-xl font-semibold text-gradient mb-4">{lang === "en" ? "What is the I Ching?" : "什么是易经？"}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              {lang === "en"
                ? "The I Ching, or Book of Changes, is one of the oldest Chinese classical texts, dating back over 3,000 years. It has been used for centuries as a guide for decision-making, self-reflection, and understanding the patterns of change in life. Its 64 hexagrams represent archetypal situations and the dynamic transformations between them."
                : "《易经》，又称《周易》，是中国最古老的经典之一，距今已有三千多年历史。千百年来，它作为决策指南、自我反思工具，帮助人们理解生命中的变化规律。六十四卦代表了六十四种基本情境及其之间的动态转化。"
              }
            </p>
          </div>

          <div className="glass p-8">
            <h2 className="text-xl font-semibold text-gradient mb-4">{lang === "en" ? "How It Works" : "如何运作"}</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center text-sm">
              {[
                { icon: "🔮", title: lang === "en" ? "Ask" : "提问", desc: lang === "en" ? "Form your question with intention" : "以诚意提出你的问题" },
                { icon: "☯", title: lang === "en" ? "Cast" : "起卦", desc: lang === "en" ? "The I Ching responds through hexagrams" : "易经通过卦象回应你" },
                { icon: "✨", title: lang === "en" ? "Receive" : "解读", desc: lang === "en" ? "AI interprets the ancient wisdom" : "AI解读千年智慧" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl mb-3">{s.icon}</p>
                  <p className="font-medium text-[var(--text)] mb-1">{s.title}</p>
                  <p className="text-[var(--text-muted)]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
