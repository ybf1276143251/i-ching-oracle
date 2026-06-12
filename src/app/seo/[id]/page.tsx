import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HEXAGRAMS } from "@/lib/hexagrams";
import { hexagramToUnicode } from "@/lib/divination";
import Link from "next/link";

// ─── Generate static params for all 64 hexagrams ────────────

export function generateStaticParams() {
  return HEXAGRAMS.map((h) => ({ id: String(h.id) }));
}

// ─── Metadata ───────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hexagram = HEXAGRAMS.find((h) => h.id === parseInt(id));

  if (!hexagram) {
    return { title: "卦象未找到" };
  }

  return {
    title: `${hexagram.name} - ${hexagram.nameEn}`,
    description: `易经第${hexagram.id}卦${hexagram.name}（${hexagram.nameEn}）的完整解读。${hexagram.description}`,
    keywords: hexagram.keywords,
    openGraph: {
      title: `第${hexagram.id}卦 ${hexagram.name} - ${hexagram.nameEn} | 易经占卜`,
      description: hexagram.description,
    },
  };
}

// ─── Page component ─────────────────────────────────────────

export default async function HexagramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hexagram = HEXAGRAMS.find((h) => h.id === parseInt(id));

  if (!hexagram) {
    notFound();
  }

  const prevHexagram = HEXAGRAMS.find((h) => h.id === hexagram.id - 1);
  const nextHexagram = HEXAGRAMS.find((h) => h.id === hexagram.id + 1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-[var(--muted)] mb-6">
        <Link href="/seo" className="hover:text-[var(--gold)] transition-colors">
          64卦详解
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{hexagram.name}</span>
      </div>

      {/* Hexagram header */}
      <div className="card card-gold text-center mb-8">
        <div className="text-7xl mb-3">{hexagramToUnicode(hexagram.id)}</div>
        <h1 className="text-3xl font-bold text-gradient mb-1">
          {hexagram.name}
        </h1>
        <p className="text-[var(--muted)]">
          {hexagram.nameEn} · 第{hexagram.id}卦
        </p>
      </div>

      {/* Trigram info */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-xs text-[var(--muted)] mb-1">上卦（外卦）</p>
          <p className="text-lg font-medium">
            {hexagram.upperTrigram === "qian" && "☰ 乾"}
            {hexagram.upperTrigram === "dui" && "☱ 兌"}
            {hexagram.upperTrigram === "li" && "☲ 離"}
            {hexagram.upperTrigram === "zhen" && "☳ 震"}
            {hexagram.upperTrigram === "xun" && "☴ 巽"}
            {hexagram.upperTrigram === "kan" && "☵ 坎"}
            {hexagram.upperTrigram === "gen" && "☶ 艮"}
            {hexagram.upperTrigram === "kun" && "☷ 坤"}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-[var(--muted)] mb-1">下卦（内卦）</p>
          <p className="text-lg font-medium">
            {hexagram.lowerTrigram === "qian" && "☰ 乾"}
            {hexagram.lowerTrigram === "dui" && "☱ 兌"}
            {hexagram.lowerTrigram === "li" && "☲ 離"}
            {hexagram.lowerTrigram === "zhen" && "☳ 震"}
            {hexagram.lowerTrigram === "xun" && "☴ 巽"}
            {hexagram.lowerTrigram === "kan" && "☵ 坎"}
            {hexagram.lowerTrigram === "gen" && "☶ 艮"}
            {hexagram.lowerTrigram === "kun" && "☷ 坤"}
          </p>
        </div>
      </div>

      {/* Judgment */}
      <div className="card mb-4">
        <h2 className="text-lg font-bold text-gradient mb-2">卦辞</h2>
        <p className="text-lg mb-1">{hexagram.judgment}</p>
        <p className="text-sm text-[var(--muted)] italic">
          {hexagram.judgmentEn}
        </p>
      </div>

      {/* Image */}
      <div className="card mb-4">
        <h2 className="text-lg font-bold text-gradient mb-2">象辞</h2>
        <p className="text-lg mb-1">{hexagram.image}</p>
        <p className="text-sm text-[var(--muted)] italic">
          {hexagram.imageEn}
        </p>
      </div>

      {/* Description */}
      <div className="card mb-4">
        <h2 className="text-lg font-bold text-gradient mb-2">卦象解读</h2>
        <p className="text-sm leading-relaxed">{hexagram.description}</p>
      </div>

      {/* Keywords */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gradient mb-2">关键词</h2>
        <div className="flex flex-wrap gap-2">
          {hexagram.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-3 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--gold)]"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {prevHexagram ? (
          <Link
            href={`/seo/${prevHexagram.id}`}
            className="btn btn-secondary text-sm"
          >
            ← 第{prevHexagram.id}卦 {prevHexagram.name}
          </Link>
        ) : (
          <div />
        )}
        <Link href="/" className="btn btn-primary text-sm">
          ☯ 开始占卜
        </Link>
        {nextHexagram ? (
          <Link
            href={`/seo/${nextHexagram.id}`}
            className="btn btn-secondary text-sm"
          >
            第{nextHexagram.id}卦 {nextHexagram.name} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
