"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────

export type Lang = "zh" | "en";

interface Dict {
  siteName: string;
  home: string;
  hexagrams64: string;
  history: string;
  login: string;
  logout: string;
  register: string;
  heroTitle: string;
  heroDesc: string;
  questionLabel: string;
  questionPlaceholder: string;
  coinMethod: string;
  yarrowMethod: string;
  randomMethod: string;
  startDivination: string;
  casting: string;
  resultTitle: string;
  relatedHexagram: string;
  changingLine: string;
  aiSummary: string;
  unlockFull: string;
  unlockPrice: string;
  freeReadings: string;
  interpreting: string;
  fullInterpretation: string;
  noHistory: string;
  firstDivination: string;
  newDivination: string;
  delete: string;
  confirmDelete: string;
  freeSummaryTag: string;
  premiumTag: string;
  email: string;
  password: string;
  displayName: string;
  noAccount: string;
  hasAccount: string;
  adminPanel: string;
  totalUsers: string;
  totalReadings: string;
  totalPayments: string;
  totalHexagrams: string;
  seedSEO: string;
  seeding: string;
  recentReadings: string;
  loading: string;
  poweredBy: string;
  disclaimer: string;
  // Hexagram page
  judgment: string;
  imageText: string;
  description: string;
  keywords: string;
  upperTrigram: string;
  lowerTrigram: string;
  prevHexagram: string;
  nextHexagram: string;
  notFound: string;
  upgradePremium: string;
  premiumUser: string;
  freeUser: string;
  readingsLeft: string;
  dailyLimit: string;
  limitReached: string;
}

const zh: Dict = {
  siteName: "易经占卜",
  home: "首页",
  hexagrams64: "64卦详解",
  history: "历史记录",
  login: "登录",
  logout: "退出",
  register: "注册",
  heroTitle: "易经占卜",
  heroDesc: "以千年智慧，解今日之惑。输入你的问题，随缘起卦，AI为你参透玄机。",
  questionLabel: "你的问题",
  questionPlaceholder: "例如：我该不该接受这份新工作？我和TA的关系会如何发展？...",
  coinMethod: "💰 金钱卦",
  yarrowMethod: "🌿 蓍草卦",
  randomMethod: "🎲 随机卦",
  startDivination: "开始占卜",
  casting: "起卦中...",
  resultTitle: "占卜结果",
  relatedHexagram: "之卦（变卦）",
  changingLine: "变爻",
  aiSummary: "📜 AI 摘要解读",
  unlockFull: "解锁完整解读",
  unlockPrice: "$9.99",
  freeReadings: "新用户可免费解锁 3 次完整解读",
  interpreting: "AI解读中...",
  fullInterpretation: "🔮 完整深度解读",
  noHistory: "还没有占卜记录",
  firstDivination: "开始第一次占卜",
  newDivination: "新占卜",
  delete: "删除",
  confirmDelete: "确定要删除这条记录吗？",
  freeSummaryTag: "免费摘要",
  premiumTag: "✨ 完整解读",
  email: "邮箱",
  password: "密码",
  displayName: "昵称（可选）",
  noAccount: "没有账号？",
  hasAccount: "已有账号？",
  adminPanel: "管理后台",
  totalUsers: "用户总数",
  totalReadings: "占卜总数",
  totalPayments: "支付订单",
  totalHexagrams: "卦象数",
  seedSEO: "📝 生成64卦SEO页面数据",
  seeding: "写入中...",
  recentReadings: "最近占卜",
  loading: "加载中...",
  poweredBy: "Powered by AI",
  disclaimer: "本平台仅供娱乐和文化参考，不构成任何决策建议。",
  judgment: "卦辞",
  imageText: "象辞",
  description: "卦象解读",
  keywords: "关键词",
  upperTrigram: "上卦（外卦）",
  lowerTrigram: "下卦（内卦）",
  prevHexagram: "上一卦",
  nextHexagram: "下一卦",
  notFound: "卦象未找到",
  upgradePremium: "升级 Premium",
  premiumUser: "Premium 会员",
  freeUser: "免费用户",
  readingsLeft: "今日剩余",
  dailyLimit: "次/天",
  limitReached: "今日免费次数已用完",
};

const en: Dict = {
  siteName: "I Ching Oracle",
  home: "Home",
  hexagrams64: "64 Hexagrams",
  history: "History",
  login: "Login",
  logout: "Logout",
  register: "Register",
  heroTitle: "I Ching Oracle",
  heroDesc: "Ancient wisdom for modern questions. Ask, cast, and let AI reveal the hidden patterns.",
  questionLabel: "Your Question",
  questionPlaceholder: "e.g. Should I take this new job? Where is my relationship heading?...",
  coinMethod: "💰 Coin",
  yarrowMethod: "🌿 Yarrow",
  randomMethod: "🎲 Random",
  startDivination: "Start Divination",
  casting: "Casting...",
  resultTitle: "Divination Result",
  relatedHexagram: "Related Hexagram",
  changingLine: "Changing Line",
  aiSummary: "📜 AI Summary",
  unlockFull: "Unlock Full Reading",
  unlockPrice: "$9.99",
  freeReadings: "New users get 3 free full readings",
  interpreting: "Interpreting...",
  fullInterpretation: "🔮 Full Interpretation",
  noHistory: "No readings yet",
  firstDivination: "Start Your First Divination",
  newDivination: "New Reading",
  delete: "Delete",
  confirmDelete: "Are you sure you want to delete this reading?",
  freeSummaryTag: "Free Summary",
  premiumTag: "✨ Premium",
  email: "Email",
  password: "Password",
  displayName: "Display Name (optional)",
  noAccount: "Don't have an account?",
  hasAccount: "Already have an account?",
  adminPanel: "Admin Panel",
  totalUsers: "Total Users",
  totalReadings: "Total Readings",
  totalPayments: "Payment Orders",
  totalHexagrams: "Hexagrams",
  seedSEO: "📝 Seed Hexagram SEO Pages",
  seeding: "Seeding...",
  recentReadings: "Recent Readings",
  loading: "Loading...",
  poweredBy: "Powered by AI",
  disclaimer: "This platform is for entertainment and cultural reference only.",
  judgment: "Judgment",
  imageText: "Image",
  description: "Interpretation",
  keywords: "Keywords",
  upperTrigram: "Upper Trigram",
  lowerTrigram: "Lower Trigram",
  prevHexagram: "Previous",
  nextHexagram: "Next",
  notFound: "Hexagram Not Found",
  upgradePremium: "Upgrade to Premium",
  premiumUser: "Premium",
  freeUser: "Free",
  readingsLeft: "Today",
  dailyLimit: "/day",
  limitReached: "Daily free limit reached",
};

// ─── Context ──────────────────────────────────────────────────

interface I18nContextType {
  lang: Lang;
  t: Dict;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "zh",
  t: zh,
  toggleLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  const toggleLang = () => setLang((prev) => (prev === "zh" ? "en" : "zh"));

  return (
    <I18nContext.Provider value={{ lang, t: lang === "zh" ? zh : en, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
