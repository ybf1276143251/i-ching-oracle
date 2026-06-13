"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import PremiumModal from "@/components/PremiumModal";
import { useState } from "react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function PricingPage() {
  const { t, lang } = useI18n();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <PremiumModal open={showModal} onClose={() => setShowModal(false)} />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="text-gradient">{t.pricingTitle}</span></h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto">{t.pricingSubtitle}</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <motion.div variants={item} className="glass p-8 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{t.freePlan}</h3>
            <p className="text-4xl font-bold mb-1">$0</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{t.perMonth}</p>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
              <li>✓ {t.feature1}</li>
              <li>✓ {lang === "en" ? "Basic AI interpretation" : "基础AI解读"}</li>
              <li className="text-[var(--text-muted)]">{lang === "en" ? "Ads supported" : "广告支持"}</li>
            </ul>
            <a href="/" className="btn btn-secondary w-full text-sm">{t.getStarted}</a>
          </motion.div>

          {/* Premium */}
          <motion.div variants={item} className="glass glass-glow p-8 flex flex-col relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-[#0A0A0A] text-xs font-bold px-4 py-1 rounded-full">{t.popular}</span>
            <h3 className="text-lg font-semibold mb-2">{t.premiumPlan}</h3>
            <p className="text-4xl font-bold mb-1">$9.99</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{t.perMonth}</p>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
              <li>✓ {t.feature2}</li>
              <li>✓ {t.feature3}</li>
              <li>✓ {t.feature4}</li>
              <li>✓ {lang === "en" ? "Ad-free experience" : "无广告"}</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="btn btn-primary w-full text-sm">{t.subscribeNow}</button>
          </motion.div>

          {/* Lifetime */}
          <motion.div variants={item} className="glass p-8 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{t.lifetimePlan}</h3>
            <p className="text-4xl font-bold mb-1">$29</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{t.oneTime}</p>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-[var(--text-secondary)]">
              <li>✓ {t.feature2}</li>
              <li>✓ {t.feature5}</li>
              <li>✓ {t.feature4}</li>
              <li>✓ {lang === "en" ? "Everything in Premium" : "Premium所有功能"}</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="btn btn-primary w-full text-sm">{t.buyLifetime}</button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
