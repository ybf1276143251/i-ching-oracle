// ─── Core Types ──────────────────────────────────────────────

export type TrigramName =
  | "qian" | "dui" | "li" | "zhen"
  | "xun" | "kan" | "gen" | "kun";

export type LineType = "yang" | "yin" | "yang-changing" | "yin-changing";

export interface Hexagram {
  id: number;                // 1-64
  name: string;              // Chinese name
  nameEn: string;            // English name
  upperTrigram: TrigramName;
  lowerTrigram: TrigramName;
  lines: LineType[];         // 6 lines, bottom to top
  judgment: string;          // 卦辞
  judgmentEn: string;
  image: string;             // 象辞
  imageEn: string;
  description: string;       // Short description for SEO
  keywords: string[];
}

export interface CastHexagram {
  hexagram: Hexagram;
  changingLines: number[];   // 1-based indices of changing lines
  isChanging: boolean;       // Whether any lines are changing
  relatedHexagram?: Hexagram; // The transformed hexagram (if changing)
}

export interface Reading {
  id: string;
  userId?: string;
  question: string;
  castType: "three-coins" | "yarrow-stalks" | "random";
  primaryHexagram: number;
  relatedHexagram?: number;
  changingLines: number[];
  interpretation: string;
  summary: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  plan: "free" | "premium";
  readingsCount: number;
  isPremium: boolean;
  premiumUntil?: string;
  gumroadEmail?: string;
  createdAt: string;
}
