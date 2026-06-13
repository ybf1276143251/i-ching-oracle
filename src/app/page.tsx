"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import ParticleBackground from "@/components/ParticleBackground";
import YinYangAnimation from "@/components/YinYangAnimation";
import { motion } from "framer-motion";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7 } }) };
const fadeInView = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

function StatsBadge({ value, label }: { value: string; label: string }) {
  return <div className="text-center"><p className="text-3xl font-bold text-gradient">{value}</p><p className="text-xs text-[var(--text-muted)] mt-1">{label}</p></div>;
}

export default function LandingPage() {
  const { t, lang } = useI18n();

  return (
    <div className="relative">
      <ParticleBackground />

      {/* ━━━━━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-[500px] h-[500px] rounded-full bg-[var(--gold)] blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.p variants={fadeIn} custom={0} className="text-sm text-[var(--gold)] tracking-[0.25em] uppercase mb-8 font-medium">
              {t.tagline}
            </motion.p>

            <motion.div variants={fadeIn} custom={1} className="mb-10">
              <YinYangAnimation />
            </motion.div>

            <motion.h1 variants={fadeIn} custom={2} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 tracking-tight">
              <span className="text-gradient">Ancient Wisdom</span>
              <br />
              <span className="text-[var(--text)]">Modern Intelligence</span>
            </motion.h1>

            <motion.p variants={fadeIn} custom={3} className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              {lang === "en"
                ? "The 3,000-year-old Book of Changes meets cutting-edge AI. Ask any question about your life, career, or relationships — and receive profound guidance rooted in ancient Chinese philosophy."
                : "三千年《易经》智慧邂逅现代人工智能。提出你关于人生、事业或关系的任何问题，获得根植于中国古典哲学的深度指引。"
              }
            </motion.p>

            <motion.div variants={fadeIn} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/read" className="btn btn-primary text-lg px-12 py-5 rounded-2xl font-semibold">
                🔮 {lang === "en" ? "Try the Oracle" : "开始占卜"}
              </Link>
              <a href="#learn" className="btn btn-secondary text-lg px-12 py-5 rounded-2xl">
                {lang === "en" ? "Discover More" : "了解更多"}
              </a>
            </motion.div>

            <motion.div variants={fadeIn} custom={5} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <StatsBadge value="64" label={lang === "en" ? "Hexagrams" : "卦象"} />
              <StatsBadge value="3K+" label={lang === "en" ? "Years of Wisdom" : "年智慧"} />
              <StatsBadge value="AI" label={lang === "en" ? "Powered by AI" : "AI驱动"} />
              <StatsBadge value="∞" label={lang === "en" ? "Possibilities" : "无限可能"} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━ WHAT IS I CHING ━━━━━━━━━━━━━━━━━━━━ */}
      <section id="learn" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInView} className="text-center mb-16">
            <p className="text-sm text-[var(--gold)] tracking-[0.2em] uppercase mb-4">{lang === "en" ? "Ancient Wisdom" : "千年智慧"}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">{lang === "en" ? "What is the I Ching?" : "什么是易经？"}</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
              {lang === "en"
                ? "The I Ching (Book of Changes) is humanity's oldest oracle — a profound philosophical system that has guided emperors, scholars, and seekers for over three millennia. It reveals the patterns of change that govern our lives through 64 archetypal hexagrams."
                : "《易经》，又称《周易》，是人类最古老的智慧典籍——一部深刻的哲学体系，三千年来指引着帝王、学者与求道者。它通过六十四卦揭示支配生命变化的宇宙规律。"
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "☯", title: lang === "en" ? "Yin & Yang" : "阴阳", desc: lang === "en" ? "The fundamental duality of existence — light and dark, action and rest, expansion and contraction. Balance is the key to harmony." : "存在的基本二元性——光明与黑暗、行动与休息、扩张与收缩。平衡是和谐的关键。" },
              { icon: "☰", title: lang === "en" ? "The Trigrams" : "八卦", desc: lang === "en" ? "Eight fundamental symbols representing Heaven, Earth, Thunder, Wind, Water, Fire, Mountain, and Lake. Combined to form the 64 hexagrams." : "八个基本符号代表天、地、雷、风、水、火、山、泽。两两相重组成六十四卦。" },
              { icon: "🔮", title: lang === "en" ? "Personal Guidance" : "人生指引", desc: lang === "en" ? "Each hexagram offers timeless wisdom for your specific situation — career decisions, relationships, personal growth, and life's crossroads." : "每一卦为你当下的处境提供永恒的智慧——职业决策、人际关系、个人成长和人生十字路口。" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } } }}
                className="glass p-8 text-center group hover:border-[var(--border-hover)] transition-all duration-500"
              >
                <p className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</p>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━ THE 64 HEXAGRAMS ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 md:py-32 px-6 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView}>
            <p className="text-sm text-[var(--gold)] tracking-[0.2em] uppercase mb-4">{lang === "en" ? "The 64 Gates of Wisdom" : "六十四道智慧之门"}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">{lang === "en" ? "Each Hexagram Tells a Story" : "每一卦，都是一个故事"}</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              {lang === "en"
                ? "From 'The Creative' to 'Before Completion', each of the 64 hexagrams represents a unique life situation — with profound insights waiting to be discovered through AI interpretation."
                : "从「乾为天」到「火水未济」，六十四卦代表着六十四种人生情境——通过AI解读，深层的智慧等待被发现的。"
              }
            </p>

            {/* Hexagram showcase grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 max-w-3xl mx-auto mb-12">
              {"䷀䷁䷂䷃䷄䷅䷆䷇䷈䷉䷊䷋䷌䷍䷎䷏䷐䷑䷒䷓䷔䷕䷖䷗䷘䷙䷚䷛䷜䷝䷞䷟䷠䷡䷢䷣䷤䷥䷦䷧䷨䷩䷪䷫䷬䷭䷮䷯䷰䷱䷲䷳䷴䷵䷶䷷䷸䷹䷺䷻䷼䷽䷾䷿".split("").map((h, i) => (
                <Link key={i} href={`/seo/${i + 1}`}>
                  <motion.span
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.015, duration: 0.3 } } }}
                    className="block text-xl md:text-3xl text-[var(--gold)]/60 hover:text-[var(--gold)] hover:scale-125 transition-all cursor-pointer"
                  >
                    {h}
                  </motion.span>
                </Link>
              ))}
            </div>

            <Link href="/read" className="btn btn-primary text-lg px-12 py-5 rounded-2xl font-semibold">
              🔮 {lang === "en" ? "Begin Your Reading" : "开始你的占卜"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">{lang === "en" ? "How It Works" : "如何使用"}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "✍️", title: lang === "en" ? "Ask Your Question" : "提出问题", desc: lang === "en" ? "Form your question with sincerity and clarity. The more specific your question, the deeper the guidance." : "以真诚与清晰提出你的问题。问题越具体，指引越深入。" },
              { step: "02", icon: "☯", title: lang === "en" ? "Receive Your Hexagram" : "获得卦象", desc: lang === "en" ? "I Ching responds with one of the 64 hexagrams. Each line carries meaning, each change reveals insight." : "易经以六十四卦之一回应你。每一爻皆有意义，每一变皆藏玄机。" },
              { step: "03", icon: "✨", title: lang === "en" ? "AI Deep Interpretation" : "AI深度解读", desc: lang === "en" ? "Our AI translates ancient Chinese wisdom into personal, actionable guidance for your modern life." : "AI将古老的中国智慧转化为针对你现代生活的个性化、可行动的指引。" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } } }}
                className="text-center"
              >
                <p className="text-5xl mb-4">{item.icon}</p>
                <p className="text-xs text-[var(--gold)] tracking-widest mb-2">{item.step}</p>
                <h3 className="text-xl font-semibold text-[var(--text)] mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                {i < 2 && <div className="hidden md:block absolute right-0 top-1/2 text-[var(--gold)]/30 text-2xl">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━ FINAL CTA ━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-24 md:py-32 px-6 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full bg-[var(--gold)] blur-[120px] opacity-[0.04]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView}>
            <div className="text-6xl mb-6">☯</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              {lang === "en" ? "Ready to Discover Your Path?" : "准备好探索你的道路了吗？"}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
              {lang === "en"
                ? "Thousands have found clarity through the I Ching. The ancient oracle awaits your question."
                : "无数人通过易经找到了清晰的方向。古老的智慧等待着你的提问。"
              }
            </p>
            <Link href="/read" className="btn btn-primary text-xl px-16 py-6 rounded-2xl font-bold shadow-[0_0_60px_rgba(212,175,55,0.2)]">
              🔮 {lang === "en" ? "Ask the Oracle" : "向易经提问"}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
