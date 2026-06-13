"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const { lang } = useI18n();

  const projects = [
    {
      title: "I Ching Oracle",
      descEn: "AI-powered divination tool. 64 hexagrams, DeepSeek interpretation, bilingual support.",
      descZh: "AI驱动的易经占卜工具。六十四卦，DeepSeek解读，双语支持。",
      url: "/read",
      status: "live",
      icon: "☯",
    },
    {
      title: lang === "en" ? "Coming Soon" : "敬请期待",
      descEn: "A new interactive web experience is brewing. Stay tuned.",
      descZh: "一款新的互动网页体验正在酝酿中，敬请期待。",
      url: "",
      status: "coming",
      icon: "🔮",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            {lang === "en" ? "Our Projects" : "我们的项目"}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            {lang === "en"
              ? "Crafting interactive web experiences powered by AI."
              : "打造AI驱动的互动网页体验。"
            }
          </p>
        </motion.div>

        <div className="space-y-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`glass p-8 ${p.status === "live" ? "glass-glow" : ""}`}
            >
              <div className="flex items-start gap-5">
                <span className="text-4xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[var(--text)]">{p.title}</h3>
                    {p.status === "live" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        Live
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--border)]">
                        {lang === "en" ? "Coming Soon" : "开发中"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {lang === "en" ? p.descEn : p.descZh}
                  </p>
                  {p.url ? (
                    <Link href={p.url} className="btn btn-primary btn-sm">
                      {lang === "en" ? "Try It" : "立即体验"} →
                    </Link>
                  ) : (
                    <button disabled className="btn btn-secondary btn-sm opacity-50">
                      {lang === "en" ? "Coming Soon" : "即将推出"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-12">
          <p className="text-[var(--text-muted)] text-sm">
            {lang === "en"
              ? "Have an idea? Let's build it together."
              : "有想法？一起打造下一个项目。"
            }
          </p>
          <a href="https://twitter.com/Fassfannqbjj" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] text-sm hover:underline mt-1 inline-block">
            @Fassfannqbjj
          </a>
        </motion.div>
      </div>
    </div>
  );
}
