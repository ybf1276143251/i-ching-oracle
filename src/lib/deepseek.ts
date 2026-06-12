import OpenAI from "openai";
import { Hexagram, CastHexagram } from "./types";
import { getLineInfo } from "./divination";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "sk-placeholder",
  baseURL: "https://api.deepseek.com",
});

// ─── Fallback summary ────────────────────────────────────────

function fallbackSummary(question: string, cast: CastHexagram): string {
  const h = cast.hexagram;
  const rel = cast.relatedHexagram;
  const changing = cast.changingLines.length > 0
    ? `\n\n其中第${cast.changingLines.join("、")}爻为变爻，提示变化的关键所在。`
    : "";
  const relatedInfo = rel
    ? `\n\n此卦动变出第${rel.id}卦「${rel.name}」，表示事情可能向此方向发展。`
    : "";

  return `## 占卜结果

**本卦**：第${h.id}卦「${h.name}」

### 卦象解读

${h.judgment}

${h.description}${changing}${relatedInfo}

### 对你问题的启示

关于你提出的「${question}」，本卦「${h.name}」给出的核心启示是：

${h.judgment}

${rel ? `同时，变卦「${rel.name}」提示你，事情正在变化之中，需顺势而为。` : ""}

> 💡 此为本地卦象解读。配置 DeepSeek API Key 后可获得 AI 个性化深度解读。`;
}

// ─── Fallback full interpretation ────────────────────────────

function fallbackFull(question: string, cast: CastHexagram): string {
  const h = cast.hexagram;
  const rel = cast.relatedHexagram;
  const changeInfo = cast.changingLines.length > 0
    ? `\n\n### 变爻启示\n\n第${cast.changingLines.join("、")}爻为变爻，表示当前问题的关键转折点。关注这些爻位所代表的变化趋势。`
    : "\n\n### 卦辞启示\n\n本卦无变爻，当以卦辞为核心，静观其变。";

  return `## 完整解读

### 卦象概述

第${h.id}卦「${h.name}」，${h.description}

**卦辞**：${h.judgment}

**象辞**：${h.image}

### 问题对应

关于你提出的「${question}」，本卦的核心回应是：

${h.judgment}${changeInfo}

${rel ? `### 变卦指引\n\n本卦动变出第${rel.id}卦「${rel.name}」。${rel.description}\n\n这表示事情正在向${rel.name}的方向发展，需要关注这一转变。` : ""}

### 行动建议

1. **审时度势** — 理解当前所处的卦象阶段，顺势而为
2. **保持耐心** — 易经强调时机的重要性，不可操之过急
3. **内省修身** — 反求诸己，提升自身修为以应对变化

### 吉凶趋势

总体而言，本卦「${h.name}」提示${h.judgment}。需要特别注意${cast.changingLines.length > 0 ? `第${cast.changingLines.join("、")}爻的变化` : "卦辞的指引"}。

> 💡 此为本地卦象解读。配置 DeepSeek API Key 后可获得 AI 个性化深度解读。`;
}

// ─── Common prompt builders ──────────────────────────────────

function getSystemPrompt(): string {
  return `你是一位精通《易经》的智者，学贯中西，深谙卦象变化与人生哲理。你的解读融合传统智慧与现代视角，语言优美而富有启发性。

格式规则：
- 使用markdown格式
- 用中文回复
- 包含卦名
- 解读要有层次感
- 对提问者用"你"称呼
- 保持神秘感和仪式感，但不故作玄虚`;
}

function buildPrompt(question: string, cast: CastHexagram, type: "summary" | "full"): string {
  const h = cast.hexagram;
  const changingSection = cast.isChanging && cast.relatedHexagram
    ? `\n\n变卦：第${cast.relatedHexagram.id}卦「${cast.relatedHexagram.name}」`
    : "\n\n本卦无变爻，以卦辞为主。";

  const base = `## 占卜问题\n> ${question}\n\n## 起卦结果\n**本卦**：第${h.id}卦「${h.name}」\n**卦辞**：${h.judgment}\n**象辞**：${h.image}\n**卦象说明**：${h.description}${changingSection}`;

  if (type === "summary") {
    return `${base}\n\n## 任务\n请用100-200字给出一段简短而有力的摘要解读，直接点出卦象对问题的核心启示。`;
  }
  return `${base}\n\n## 任务\n请提供一份完整的解读：1.卦象概述 2.问题对应 3.爻辞启示 4.行动建议 5.吉凶趋势。用优美有深度的中文。`;
}

// ─── Free Summary ────────────────────────────────────────────

export async function generateSummary(question: string, cast: CastHexagram): Promise<string> {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: buildPrompt(question, cast, "summary") },
      ],
      max_tokens: 400,
      temperature: 0.8,
    });
    const text = response.choices[0]?.message?.content;
    return text || fallbackSummary(question, cast);
  } catch {
    return fallbackSummary(question, cast);
  }
}

// ─── Full Interpretation ─────────────────────────────────────

export async function generateFullInterpretation(question: string, cast: CastHexagram): Promise<string> {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: buildPrompt(question, cast, "full") },
      ],
      max_tokens: 1200,
      temperature: 0.85,
    });
    const text = response.choices[0]?.message?.content;
    return text || fallbackFull(question, cast);
  } catch {
    return fallbackFull(question, cast);
  }
}

// ─── Historical context ──────────────────────────────────────

export async function generateHistoricalContext(hexagram: Hexagram): Promise<string> {
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: `请为易经第${hexagram.id}卦「${hexagram.name}」撰写一段150字左右的历史文化背景介绍，包括该卦在中华文化中的地位和常见理解。` },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content || "";
  } catch {
    return "";
  }
}
