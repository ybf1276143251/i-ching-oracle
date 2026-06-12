import { Metadata } from "next";
import Link from "next/link";
import { HEXAGRAMS } from "@/lib/hexagrams";
import { hexagramToUnicode } from "@/lib/divination";

export const metadata: Metadata = {
  title: "易经64卦详解",
  description: "完整易经64卦列表，包含每卦的卦名、卦辞、象辞和详细解读。探索古老智慧。",
};

export default function SEOPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gradient text-center mb-2">
        易经64卦详解
      </h1>
      <p className="text-center text-[var(--muted)] mb-8">
        探索全部六十四卦的卦辞、象辞与智慧
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {HEXAGRAMS.map((hexagram) => (
          <Link
            key={hexagram.id}
            href={`/seo/${hexagram.id}`}
            className="card group text-center py-6 hover:border-[var(--gold)] transition-all"
          >
            <span className="text-3xl block mb-2">
              {hexagramToUnicode(hexagram.id)}
            </span>
            <p className="text-sm font-medium group-hover:text-[var(--gold)] transition-colors">
              {hexagram.name}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              {hexagram.nameEn}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
