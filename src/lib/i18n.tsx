"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "zh";

interface Dict {
  siteName: string;
  tagline: string;
  home: string; readings: string; pricing: string; about: string;
  login: string; logout: string; register: string;
  heroTitle: string; heroSubtitle: string;
  startReading: string; learnMore: string;
  trust64: string; trustAI: string; trustReadings: string; trustBilingual: string;
  questionTitle: string; questionPlaceholder: string;
  generateReading: string; generating: string;
  resultTitle: string; relatedHexagram: string; changingLine: string;
  aiSummary: string; unlockFull: string; upgradePremium: string;
  premiumUser: string; freeUser: string;
  fullInterpretation: string;
  overview: string; career: string; love: string; wealth: string; growth: string; action: string;
  noHistory: string; firstDivination: string; newDivination: string;
  delete: string; confirmDelete: string;
  freeSummaryTag: string; premiumTag: string;
  email: string; password: string; displayName: string;
  noAccount: string; hasAccount: string;
  adminPanel: string; totalUsers: string; totalReadings: string; totalPayments: string; totalHexagrams: string;
  seedSEO: string; seeding: string; recentReadings: string; loading: string;
  poweredBy: string; disclaimer: string;
  judgment: string; imageText: string; description: string; keywords: string;
  upperTrigram: string; lowerTrigram: string; prevHexagram: string; nextHexagram: string; notFound: string;
  readingsLeft: string;
  pricingTitle: string; pricingSubtitle: string; freePlan: string; premiumPlan: string; lifetimePlan: string;
  perMonth: string; oneTime: string;
  feature1: string; feature2: string; feature3: string; feature4: string; feature5: string;
  getStarted: string; subscribeNow: string; buyLifetime: string;
  popular: string;
  aboutTitle: string; aboutDesc: string;
}

const en: Dict = {
  siteName: "I Ching Oracle",
  tagline: "Ancient Wisdom. Modern Intelligence.",
  home: "Home", readings: "Readings", pricing: "Pricing", about: "About",
  login: "Sign In", logout: "Sign Out", register: "Sign Up",
  heroTitle: "Ancient Wisdom.\nModern Intelligence.",
  heroSubtitle: "Ask any question and receive personalized guidance through the wisdom of the I Ching, interpreted by advanced AI.",
  startReading: "Start Free Reading",
  learnMore: "Learn More",
  trust64: "64 Hexagrams", trustAI: "AI Powered", trustReadings: "Readings Generated", trustBilingual: "Bilingual",
  questionTitle: "What guidance are you seeking today?",
  questionPlaceholder: "Should I change careers?\nHow can I improve my relationship?\nWhat should I focus on this month?",
  generateReading: "Generate Reading",
  generating: "Consulting the I Ching...",
  resultTitle: "Your Reading",
  relatedHexagram: "Related Hexagram",
  changingLine: "Changing Line",
  aiSummary: "Interpretation",
  unlockFull: "Unlock Full Reading",
  upgradePremium: "Upgrade to Premium",
  premiumUser: "Premium",
  freeUser: "Free",
  fullInterpretation: "Full Reading",
  overview: "Overall Meaning",
  career: "Career & Work",
  love: "Love & Relationships",
  wealth: "Wealth & Finance",
  growth: "Personal Growth",
  action: "Recommended Action",
  noHistory: "No readings yet",
  firstDivination: "Begin Your First Reading",
  newDivination: "New Reading",
  delete: "Delete", confirmDelete: "Delete this reading?",
  freeSummaryTag: "Free", premiumTag: "Premium",
  email: "Email", password: "Password", displayName: "Display Name",
  noAccount: "Don't have an account?", hasAccount: "Already have an account?",
  adminPanel: "Admin", totalUsers: "Users", totalReadings: "Readings", totalPayments: "Payments", totalHexagrams: "Hexagrams",
  seedSEO: "Seed SEO", seeding: "Seeding...", recentReadings: "Recent", loading: "Loading...",
  poweredBy: "Powered by AI", disclaimer: "For entertainment and self-reflection purposes only.",
  judgment: "Judgment", imageText: "Image", description: "Meaning", keywords: "Keywords",
  upperTrigram: "Upper Trigram", lowerTrigram: "Lower Trigram", prevHexagram: "Previous", nextHexagram: "Next", notFound: "Not Found",
  readingsLeft: "Today",
  pricingTitle: "Choose Your Path", pricingSubtitle: "Deepen your practice with unlimited access.",
  freePlan: "Free", premiumPlan: "Premium", lifetimePlan: "Lifetime",
  perMonth: "/month", oneTime: "one-time",
  feature1: "3 readings per day", feature2: "Unlimited readings", feature3: "Priority AI interpretation", feature4: "Advanced insights", feature5: "Lifetime access",
  getStarted: "Get Started Free", subscribeNow: "Subscribe Now", buyLifetime: "Buy Lifetime",
  popular: "Most Popular",
  aboutTitle: "About I Ching Oracle", aboutDesc: "We bridge the ancient Chinese Book of Changes with modern artificial intelligence. Our mission is to make the profound wisdom of the I Ching accessible to everyone seeking clarity, guidance, and self-reflection in the digital age.",
};

const zh: Dict = {
  siteName: "易经占卜",
  tagline: "千年智慧 · AI解读",
  home: "首页", readings: "占卜", pricing: "价格", about: "关于",
  login: "登录", logout: "退出", register: "注册",
  heroTitle: "千年智慧\n人工智能解读",
  heroSubtitle: "提出你的问题，AI 将为你呈现易经千年智慧的个性化指引。",
  startReading: "开始免费占卜",
  learnMore: "了解更多",
  trust64: "六十四卦", trustAI: "AI驱动", trustReadings: "占卜次数", trustBilingual: "双语体验",
  questionTitle: "你今天想寻求什么指引？",
  questionPlaceholder: "我应该换工作吗？\n如何改善我的人际关系？\n这个月我应该关注什么？",
  generateReading: "生成解读",
  generating: "起卦中...",
  resultTitle: "占卜结果",
  relatedHexagram: "之卦",
  changingLine: "变爻",
  aiSummary: "解读",
  unlockFull: "解锁完整解读",
  upgradePremium: "升级 Premium",
  premiumUser: "Premium",
  freeUser: "免费",
  fullInterpretation: "完整解读",
  overview: "卦象总览",
  career: "事业工作",
  love: "感情人际",
  wealth: "财运财富",
  growth: "个人成长",
  action: "行动建议",
  noHistory: "暂无记录",
  firstDivination: "开始第一次占卜",
  newDivination: "新占卜",
  delete: "删除", confirmDelete: "确定删除？",
  freeSummaryTag: "免费", premiumTag: "Premium",
  email: "邮箱", password: "密码", displayName: "昵称",
  noAccount: "没有账号？", hasAccount: "已有账号？",
  adminPanel: "管理", totalUsers: "用户", totalReadings: "占卜", totalPayments: "支付", totalHexagrams: "卦象",
  seedSEO: "生成SEO", seeding: "生成中...", recentReadings: "最近", loading: "加载中...",
  poweredBy: "AI驱动", disclaimer: "仅供娱乐与自我反思，不构成决策建议。",
  judgment: "卦辞", imageText: "象辞", description: "卦意", keywords: "关键词",
  upperTrigram: "上卦", lowerTrigram: "下卦", prevHexagram: "上一卦", nextHexagram: "下一卦", notFound: "未找到",
  readingsLeft: "今日",
  pricingTitle: "选择方案", pricingSubtitle: "解锁无限占卜，深入探索易经智慧。",
  freePlan: "免费", premiumPlan: "Premium", lifetimePlan: "终身",
  perMonth: "/月", oneTime: "一次性",
  feature1: "每日3次占卜", feature2: "无限次占卜", feature3: "优先AI解读", feature4: "高级洞察", feature5: "终身访问",
  getStarted: "免费开始", subscribeNow: "立即订阅", buyLifetime: "购买终身",
  popular: "最受欢迎",
  aboutTitle: "关于易经占卜", aboutDesc: "我们连接古老的《易经》智慧与现代人工智能。我们的使命是让每一个寻求清晰、指引与自我反思的人，都能在数字时代触达深邃的东方哲学。",
};

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("i18n-lang");
    if (stored === "en" || stored === "zh") return stored;
  } catch {}
  return "en";
}

interface I18nContextType { lang: Lang; t: Dict; toggleLang: () => void; }
const I18nContext = createContext<I18nContextType>({ lang: "en", t: en, toggleLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const toggleLang = () => setLang((prev) => {
    const next = prev === "en" ? "zh" : "en";
    try { localStorage.setItem("i18n-lang", next); } catch {}
    return next;
  });

  const displayLang = mounted ? lang : "en";
  return (
    <I18nContext.Provider value={{ lang: displayLang, t: displayLang === "en" ? en : zh, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() { return useContext(I18nContext); }
