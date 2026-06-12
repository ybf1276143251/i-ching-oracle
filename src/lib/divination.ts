import { HEXAGRAMS, getHexagramById, getRelatedHexagram } from "./hexagrams";
import { CastHexagram, LineType } from "./types";

// Three-coin method: each throw produces a line value (6,7,8,9)
// 6 = old yin (yin-changing), 7 = young yang (yang), 8 = young yin (yin), 9 = old yang (yang-changing)
function throwThreeCoins(): LineType {
  const coin1 = Math.random() < 0.5 ? 2 : 3; // tails=2, heads=3
  const coin2 = Math.random() < 0.5 ? 2 : 3;
  const coin3 = Math.random() < 0.5 ? 2 : 3;
  const sum = coin1 + coin2 + coin3;

  switch (sum) {
    case 6: return "yin-changing";   // 2+2+2
    case 7: return "yang";            // 2+2+3 or permutations
    case 8: return "yin";             // 2+3+3 or permutations
    case 9: return "yang-changing";   // 3+3+3
    default: return "yin";
  }
}

// Yarrow-stalk method: simulate the complex 50-stalk procedure
// Simplified: uses the probability distribution of the traditional method
function yarrowStalkLine(): LineType {
  // Traditional probabilities: 6: 1/16, 7: 5/16, 8: 7/16, 9: 3/16
  const rand = Math.random();
  if (rand < 0.0625) return "yin-changing";        // 6
  if (rand < 0.0625 + 0.3125) return "yang";       // 7
  if (rand < 0.0625 + 0.3125 + 0.4375) return "yin"; // 8
  return "yang-changing";                            // 9
}

// Random number method: fast random generation
function randomLine(): LineType {
  const rand = Math.random();
  if (rand < 0.125) return "yin-changing";
  if (rand < 0.5) return "yin";
  if (rand < 0.625) return "yang-changing";
  return "yang";
}

export type CastType = "three-coins" | "yarrow-stalks" | "random";

function generateLine(castType: CastType): LineType {
  switch (castType) {
    case "three-coins": return throwThreeCoins();
    case "yarrow-stalks": return yarrowStalkLine();
    case "random": return randomLine();
  }
}

/**
 * Cast a hexagram using the specified method.
 * Returns the primary hexagram and, if any lines are changing, the related hexagram.
 */
export function castHexagram(castType: CastType = "three-coins"): CastHexagram {
  // Generate 6 lines, bottom to top (line 1 through line 6)
  const lines: LineType[] = [];
  for (let i = 0; i < 6; i++) {
    lines.push(generateLine(castType));
  }

  // Find the primary hexagram (interpret changing lines as their base type)
  const baseLines: LineType[] = lines.map(l =>
    l === "yang-changing" ? "yang" :
    l === "yin-changing" ? "yin" : l
  );

  const hexagram = HEXAGRAMS.find(h =>
    h.lines.every((line, i) => line === baseLines[i])
  );

  if (!hexagram) {
    throw new Error("Failed to match hexagram. This should never happen.");
  }

  // Find changing lines (1-based indices)
  const changingLines: number[] = [];
  for (let i = 0; i < 6; i++) {
    if (lines[i] === "yang-changing" || lines[i] === "yin-changing") {
      changingLines.push(i + 1);
    }
  }

  const isChanging = changingLines.length > 0;
  const relatedHexagram = isChanging
    ? getRelatedHexagram(hexagram, changingLines)
    : undefined;

  return {
    hexagram,
    changingLines,
    isChanging,
    relatedHexagram,
  };
}

/**
 * Format a hexagram's lines into Unicode trigram characters
 */
export function hexagramToUnicode(hexagramId: number): string {
  // Unicode hexagram characters start at U+4DC0 (䷀)
  return String.fromCodePoint(0x4DC0 + hexagramId - 1);
}

/**
 * Get line display info by position (1-based, 1=bottom)
 */
export function getLineInfo(lineType: LineType, position: number) {
  const positionNames = [
    "初", "二", "三", "四", "五", "上"
  ];
  const isYang = lineType === "yang" || lineType === "yang-changing";
  const name = positionNames[position - 1];
  const nature = isYang ? "九" : "六";

  return {
    position,
    name: position === 1 || position === 6 ? `${positionNames[position - 1]}${nature}` : `${nature}${positionNames[position - 1]}`,
    isYang,
    isChanging: lineType === "yang-changing" || lineType === "yin-changing",
  };
}
