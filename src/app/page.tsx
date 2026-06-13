"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import ParticleBackground from "@/components/ParticleBackground";
import YinYangAnimation from "@/components/YinYangAnimation";
import { motion } from "framer-motion";

const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.7 } }) };
const fadeInView = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

// Divination methods
const methods = [
  { key: "coins", icon: "乾", titleEn: "Coin Divination", titleZh: "金钱卦", descEn: "Three coins, six throws. The most popular I Ching method.", descZh: "三枚铜钱，投掷六次。最流行的易经占卜法。", href: "/read/coins" },
  { key: "yarrow", icon: "筮", titleEn: "Yarrow Stalk", titleZh: "蓍草占卜", descEn: "50 yarrow stalks. The ancient traditional method.", descZh: "五十根蓍草。最古老的占卜方法。", href: "/read/yarrow" },
  { key: "hexagram", icon: "䷀", titleEn: "64 Hexagrams", titleZh: "64卦占卜", descEn: "Browse all hexagrams and find your guidance.", descZh: "浏览全部六十四卦，找到你的指引。", href: "/seo" },
  { key: "plum", icon: "梅", titleEn: "Plum Blossom", titleZh: "梅花易数", descEn: "Based on time, date and numbers. Instant divination.", descZh: "以时间、日期、数字起卦。即时占卜。", href: "/read/plum" },
  { key: "kingwen", icon: "周", titleEn: "King Wen Oracle", titleZh: "文王卦", descEn: "The classic King Wen interpretation method.", descZh: "周文王创立的经典解卦法。", href: "/read/kingwen" },
  { key: "numerology", icon: "数", titleEn: "Number Divination", titleZh: "数字卦", descEn: "Use meaningful numbers to generate your hexagram.", descZh: "用有意义的数字生成卦象。", href: "/read/numbers" },
];

export default function LandingPage() {
  const { t, lang } = useI18n();

  return (
    <div className="relative">
      <ParticleBackground />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <div className="w-[500px] h-[500px] rounded-full bg-[var(--gold)] blur-[150px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.p variants={fadeIn} custom={0} className="text-sm text-[var(--gold)] tracking-[0.25em] uppercase mb-8 font-medium">{t.tagline}</motion.p>
            <motion.div variants={fadeIn} custom={1} className="mb-10"><YinYangAnimation /></motion.div>
            <motion.h1 variants={fadeIn} custom={2} className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 tracking-tight">
              <span className="text-gradient">Ancient Wisdom</span><br />
              <span className="text-[var(--text)]">Modern Intelligence</span>
            </motion.h1>
            <motion.p variants={fadeIn} custom={3} className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              {lang === "en" ? "The 3,000-year-old Book of Changes meets AI. Choose your divination method and receive profound guidance." : "三千年《易经》智慧邂逅AI。选择你的占卜方式，获得深度指引。"}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Divination Methods */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView} className="text-3xl md:text-4xl font-bold text-gradient text-center mb-12">
            {lang === "en" ? "Choose Your Divination" : "选择占卜方式"}
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((m, i) => (
              <motion.div
                key={m.key}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } } }}
              >
                <Link href={m.href} className="glass p-6 block group hover:border-[var(--border-hover)] transition-all duration-300 h-full">
                  <p className="text-5xl mb-3 font-serif text-gradient">{m.icon}</p>
                  <h3 className="text-base font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--gold)] transition-colors">
                    {lang === "en" ? m.titleEn : m.titleZh}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {lang === "en" ? m.descEn : m.descZh}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What is I Ching */}
      <section id="learn" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView} className="text-center mb-16">
            <p className="text-sm text-[var(--gold)] tracking-[0.2em] uppercase mb-4">{lang === "en" ? "Ancient Wisdom" : "千年智慧"}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">{lang === "en" ? "What is the I Ching?" : "什么是易经？"}</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
              {lang === "en" ? "The I Ching (Book of Changes) is humanity's oldest oracle — a profound philosophical system guiding seekers for over three millennia through 64 archetypal hexagrams." : "《易经》是人类最古老的智慧典籍——一部深刻的哲学体系，通过六十四卦三千年来指引着无数求道者。"}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "☯", title: lang === "en" ? "Yin & Yang" : "阴阳", desc: lang === "en" ? "The fundamental duality. Balance is the key." : "存在的基本二元性。平衡是关键。" },
              { icon: "☰", title: lang === "en" ? "The Trigrams" : "八卦", desc: lang === "en" ? "Eight symbols forming the 64 hexagrams." : "八个符号，组成六十四卦。" },
              { icon: "🔮", title: lang === "en" ? "Personal Guidance" : "人生指引", desc: lang === "en" ? "Timeless wisdom for your specific situation." : "为你当下的处境提供永恒智慧。" },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } } }} className="glass p-8 text-center group">
                <p className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</p>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 64 Hexagrams grid */}
      <section className="py-24 px-6 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView}>
            <p className="text-sm text-[var(--gold)] tracking-[0.2em] uppercase mb-4">{lang === "en" ? "The 64 Gates" : "六十四门"}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">{lang === "en" ? "Each Hexagram Tells a Story" : "每一卦，一个故事"}</h2>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-3xl mx-auto mb-12">
              {"䷀䷁䷂䷃䷄䷅䷆䷇䷈䷉䷊䷋䷌䷍䷎䷏䷐䷑䷒䷓䷔䷕䷖䷗䷘䷙䷚䷛䷜䷝䷞䷟䷠䷡䷢䷣䷤䷥䷦䷧䷨䷩䷪䷫䷬䷭䷮䷯䷰䷱䷲䷳䷴䷵䷶䷷䷸䷹䷺䷻䷼䷽䷾䷿".split("").map((h, i) => (
                <Link key={i} href={`/seo/${i + 1}`}>
                  <motion.span
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1, transition: { delay: i * 0.015, duration: 0.3 } } }}
                    className="block text-xl md:text-3xl text-[var(--gold)]/60 hover:text-[var(--gold)] hover:scale-125 transition-all cursor-pointer"
                  >
                    {h}
                  </motion.span>
                </Link>
              ))}
            </div>
            <p className="text-[var(--text-muted)] text-xs">{lang === "en" ? "Click any hexagram to explore" : "点击任意卦象探索详情"}</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-6">{lang === "en" ? "How It Works" : "如何使用"}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "问", title: lang === "en" ? "Ask" : "提问", desc: lang === "en" ? "Form your question with sincerity." : "以真诚提出你的问题。" },
              { step: "02", icon: "卦", title: lang === "en" ? "Cast" : "起卦", desc: lang === "en" ? "I Ching responds through hexagrams." : "易经以卦象回应。" },
              { step: "03", icon: "释", title: lang === "en" ? "Receive" : "解读", desc: lang === "en" ? "AI interprets the ancient wisdom." : "AI解读千年智慧。" },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.2 } } }} className="text-center">
                <p className="text-5xl mb-4 font-serif text-gradient">{item.icon}</p>
                <p className="text-xs text-[var(--gold)] tracking-widest mb-2">{item.step}</p>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] rounded-full bg-[var(--gold)] blur-[120px] opacity-[0.04]" />
        </div>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInView}>
            <div className="text-6xl mb-6">☯</div>
            <h2 className="text-4xl font-bold text-gradient mb-6">
              {lang === "en" ? "Ready to Discover Your Path?" : "准备好探索你的道路了吗？"}
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10">
              {lang === "en" ? "Thousands have found clarity through the I Ching." : "无数人通过易经找到了清晰的方向。"}
            </p>
            <Link href="/read/coins" className="btn btn-primary text-xl px-16 py-6 rounded-2xl font-bold shadow-[0_0_60px_rgba(212,175,55,0.2)]">
              {lang === "en" ? "Ask the Oracle" : "向易经提问"}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
