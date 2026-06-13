"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { hexagramToUnicode, castFromNumbers } from "@/lib/divination";
import { useI18n } from "@/lib/i18n";
import PremiumModal from "@/components/PremiumModal";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const METHOD_ORDER = ["coins","yarrow","hexagram","plum","kingwen","numbers"];

function MethodNav({ current }: { current: string }) {
  const idx = METHOD_ORDER.indexOf(current);
  const prev = idx > 0 ? METHOD_ORDER[idx - 1] : null;
  const next = idx < METHOD_ORDER.length - 1 ? METHOD_ORDER[idx + 1] : null;
  return (<div className="flex justify-between mt-8 gap-4">{prev?<Link href={`/read/${prev}`} className="btn btn-ghost btn-sm">← {METHODS[prev]?.icon} {METHODS[prev]?.titleZh}</Link>:<div/>}{next?<Link href={`/read/${next}`} className="btn btn-ghost btn-sm">{METHODS[next]?.icon} {METHODS[next]?.titleZh} →</Link>:<div/>}</div>);
}

const HexagramLines = ({ hexagramId, changingLines }: { hexagramId: number; changingLines: number[] }) => {
  const id = hexagramId - 1; const bits: boolean[] = [];
  for (let i = 0; i < 6; i++) bits.push(((id >> i) & 1) === 1);
  return (<div className="flex flex-col items-center gap-1.5 my-5">{ [5,4,3,2,1,0].map(i => { const ln=i+1,yang=bits[i],ch=changingLines.includes(ln); return (<div key={i} className="flex items-center gap-3"><span className="text-xs text-[var(--text-muted)] w-4 text-right">{ln}</span>{yang?<div className="hex-line-yang"/>:<div className="flex gap-3" style={{width:90}}><div className="hex-line-yin-half"/><div className="hex-line-yin-half"/></div>}{ch&&<span className="text-[var(--gold)] text-xs font-bold">→</span>}</div>); })}</div>);
};

interface MethodConfig {
  icon: string; titleEn: string; titleZh: string;
  descEn: string; descZh: string; tags: string[];
  castType: string; method: string;
  inputLabelEn: string; inputLabelZh: string;
  placeholderEn: string; placeholderZh: string;
  useNumbers: boolean; numbersLabel: string;
  buttonTextEn: string; buttonTextZh: string; loadingTextEn: string; loadingTextZh: string;
}

const METHODS: Record<string, MethodConfig> = {
  coins: { icon:"乾",titleEn:"Coin Divination",titleZh:"金钱卦",descEn:"Three coins tossed six times. Each throw yields (6,7,8,9). Old yang/yin are changing lines.",descZh:"三枚铜钱投掷六次。每次投掷得6/7/8/9，老阳老阴为变爻。",tags:["三枚铜钱","投掷六次","6·7·8·9"],castType:"three-coins",method:"coins",inputLabelEn:"Hold your question, then cast the coins.",inputLabelZh:"心中默念问题，然后投掷铜钱。",placeholderEn:"e.g. Should I make this career move?",placeholderZh:"例如：我该做这个职业变动吗？",useNumbers:false,numbersLabel:"",buttonTextEn:"Toss the Coins",buttonTextZh:"投掷铜钱",loadingTextEn:"Tossing coins...",loadingTextZh:"铜钱抛掷中..."},
  yarrow: { icon:"筮",titleEn:"Yarrow Stalk Divination",titleZh:"蓍草占卜",descEn:"The most ancient method. 50 yarrow stalks — probabilities differ from coins (6:1/16 vs 1/8).",descZh:"最古老的占卜法。五十根蓍草推演，概率分布异于金钱卦。",tags:["五十根蓍草","分二挂一","古法仪式"],castType:"yarrow-stalks",method:"yarrow",inputLabelEn:"Quiet your mind and form your question with sincerity.",inputLabelZh:"静心凝神，以至诚之心默念问题。",placeholderEn:"In stillness, write your question...",placeholderZh:"静心片刻，写下你的问题...",useNumbers:false,numbersLabel:"",buttonTextEn:"Perform the Ritual",buttonTextZh:"行蓍草仪式",loadingTextEn:"Counting stalks...",loadingTextZh:"蓍草推演中..."},
  hexagram: { icon:"䷀",titleEn:"64 Hexagram Oracle",titleZh:"64卦占卜",descEn:"Directly receive one of the 64 hexagrams. Pure synchronicity — no casting needed.",descZh:"直接从六十四卦中接收一卦。无需投掷，直觉即卦象。",tags:["六十四卦","共时性","直觉指引"],castType:"random",method:"hexagram",inputLabelEn:"Open your mind and ask your question.",inputLabelZh:"敞开心扉，提出你的问题。",placeholderEn:"What does the universe want me to know?",placeholderZh:"宇宙想让我知道什么？",useNumbers:false,numbersLabel:"",buttonTextEn:"Receive the Hexagram",buttonTextZh:"接收卦象",loadingTextEn:"The oracle responds...",loadingTextZh:"卦象正在显现..."},
  plum: { icon:"梅",titleEn:"Plum Blossom Numerology",titleZh:"梅花易数",descEn:"Song Dynasty method. Numbers convert to trigrams: num1/8→upper, num2/8→lower, num3/6→changing line.",descZh:"北宋邵雍所创。上卦数÷8取余，下卦数÷8取余，动爻数÷6取余。有数即有卦。",tags:["年月日时","数字转卦","邵雍易学"],castType:"random",method:"plum",inputLabelEn:"Enter the date numbers for your question.",inputLabelZh:"输入与问题相关的日期数字。",placeholderEn:"What situation do you seek clarity on?",placeholderZh:"你寻求什么处境的明晰？",useNumbers:true,numbersLabel:"年月日时数字",buttonTextEn:"Calculate Hexagram",buttonTextZh:"推演卦象",loadingTextEn:"Calculating...",loadingTextZh:"推演中..."},
  kingwen: { icon:"周",titleEn:"King Wen Judgment",titleZh:"文王卦",descEn:"King Wen's method. Emphasis on the original judgment texts and their philosophical depth.",descZh:"周文王所创。以卦辞为核心，侧重经文的历史哲学深度。",tags:["周文王","卦辞为本","经学传统"],castType:"three-coins",method:"kingwen",inputLabelEn:"Present your situation to receive the King's judgment.",inputLabelZh:"呈上你的处境，聆听文王判词。",placeholderEn:"What matter requires ancient wisdom?",placeholderZh:"何事需要先王的智慧？",useNumbers:false,numbersLabel:"",buttonTextEn:"Seek the Judgment",buttonTextZh:"求文王判词",loadingTextEn:"Consulting...",loadingTextZh:"求问中..."},
  numbers: { icon:"数",titleEn:"Sacred Number Oracle",titleZh:"数字卦",descEn:"Three personal numbers become your hexagram. Each number maps to a trigram through division by 8 and 6.",descZh:"三个有意义的数字化为一卦。数÷8得卦，数÷6得变爻。",tags:["三数成卦","个人数字","数理易"],castType:"random",method:"numbers",inputLabelEn:"Choose three numbers that hold meaning.",inputLabelZh:"选三个与你有缘的数字。",placeholderEn:"What do you seek guidance for?",placeholderZh:"你寻求什么指引？",useNumbers:true,numbersLabel:"你的三个数字",buttonTextEn:"Generate from Numbers",buttonTextZh:"数字成卦",loadingTextEn:"Transforming...",loadingTextZh:"数字转化中..."},
};

export default function MethodPage() {
  const params = useParams();
  const method = (params?.method as string) || "coins";
  const m = METHODS[method] || METHODS.coins;
  const { t, lang } = useI18n();

  const [q, setQ] = useState(""); const [n1, setN1] = useState(""); const [n2, setN2] = useState(""); const [n3, setN3] = useState("");
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(""); const [interpreting, setInterpreting] = useState(false);
  const [fullText, setFullText] = useState(""); const [isPremium, setIsPremium] = useState(false);
  const [showModal, setShowModal] = useState(false); const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/user").then(r=>r.json()).then(d=>{if(d.user)setIsPremium(d.user.is_premium||d.user.plan==="premium")}).catch(()=>{});
    try{const s=localStorage.getItem(`iching-${method}`);if(s){const p=JSON.parse(s);setResult(p.result);setQ(p.q);setFullText(p.fullText||"");setN1(p.n1||"");setN2(p.n2||"");setN3(p.n3||"")}}catch{}
  },[method]);
  useEffect(()=>{if(result)try{localStorage.setItem(`iching-${method}`,JSON.stringify({result,q,fullText,n1,n2,n3}))}catch{}},[result,q,fullText,method]);

  const divine = async () => {
    if(!q.trim()){setError(lang==="en"?"Enter your question":"请输入问题");return}
    setError(""); setLoading(true); setResult(null); setFullText("");
    try{
      const body:any={question:q.trim(),castType:m.castType,method:m.method};
      if(m.useNumbers){body.num1=parseInt(n1)||1;body.num2=parseInt(n2)||2;body.num3=parseInt(n3)||3}
      const r=await fetch("/api/divine",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const d=await r.json(); if(!r.ok){if(d.limitReached)setShowModal(true);throw new Error(d.error)}
      setResult(d); setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth",block:"start"}),300);
    }catch(e){setError(e instanceof Error?e.message:"Error")}finally{setLoading(false)}
  };

  const unlock = async () => { if(!isPremium){setShowModal(true);return} if(!result)return; setInterpreting(true);
    try{const r=await fetch("/api/interpret",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({readingId:result.readingId,question:q.trim(),hexagramId:result.cast.hexagram.id,relatedHexagramId:result.cast.relatedHexagram?.id,changingLines:result.cast.changingLines})});const d=await r.json();if(!r.ok)throw new Error(d.error);setFullText(d.interpretation)}catch(e){setError(e instanceof Error?e.message:"Error")}finally{setInterpreting(false)}
  };

  return (<div className="relative min-h-screen pt-28 pb-24 px-6"><PremiumModal open={showModal} onClose={()=>setShowModal(false)}/>
    <div className="max-w-2xl mx-auto relative z-10">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center mb-10">
        <p className="text-6xl mb-4 text-gradient font-serif">{m.icon}</p>
        <h1 className="text-3xl font-bold text-gradient mb-2">{lang==="en"?m.titleEn:m.titleZh}</h1>
        <p className="text-[var(--text-muted)] text-sm max-w-lg mx-auto">{lang==="en"?m.descEn:m.descZh}</p>
        <div className="flex gap-2 justify-center mt-4 text-xs text-[var(--text-muted)]">{m.tags.map((s,i)=><span key={i} className="glass px-3 py-1 rounded-full">{s}</span>)}</div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass glass-glow p-8 mb-8">
        <label className="block text-sm text-[var(--text-muted)] mb-2">{lang==="en"?m.inputLabelEn:m.inputLabelZh}</label>
        <textarea className="input min-h-[120px] resize-y" placeholder={lang==="en"?m.placeholderEn:m.placeholderZh} value={q} onChange={e=>setQ(e.target.value)} maxLength={500} disabled={loading}/>
        {m.useNumbers&&(<div className="grid grid-cols-3 gap-3 mt-4">
          <div><label className="text-xs text-[var(--text-muted)] mb-1 block">{lang==="en"?"Upper Number":"上卦数"}</label><input className="input text-center" value={n1} onChange={e=>setN1(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="÷8"/></div>
          <div><label className="text-xs text-[var(--text-muted)] mb-1 block">{lang==="en"?"Lower Number":"下卦数"}</label><input className="input text-center" value={n2} onChange={e=>setN2(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="÷8"/></div>
          <div><label className="text-xs text-[var(--text-muted)] mb-1 block">{lang==="en"?"Moving Line":"动爻数"}</label><input className="input text-center" value={n3} onChange={e=>setN3(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="÷6"/></div>
        </div>)}
        <div className="flex items-center justify-between mt-4 mb-6"><span className="text-xs text-[var(--text-muted)]">{q.length}/500</span></div>
        <button onClick={divine} disabled={loading||!q.trim()} className="btn btn-primary w-full py-4 font-semibold text-base">{loading?<><span className="inline-block animate-spin text-xl">☯</span> {lang==="en"?m.loadingTextEn:m.loadingTextZh}</>:<>{m.icon} {lang==="en"?m.buttonTextEn:m.buttonTextZh}</>}</button>
        {error&&<motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-4 p-4 rounded-xl bg-red-500/10 border-red-500/20 text-sm text-red-300">{error}</motion.div>}
      </motion.div>

      <AnimatePresence>{result&&(<motion.div ref={ref} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
        <div className="glass glass-glow p-8 text-center mb-6">
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest mb-4">{t.resultTitle}</p>
          <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:100,delay:0.2}} className="text-8xl mb-4">{hexagramToUnicode(result.cast.hexagram.id)}</motion.div>
          <h2 className="text-3xl font-bold text-gradient mb-1">{result.cast.hexagram.name}</h2>
          <p className="text-[var(--text-secondary)]">{result.cast.hexagram.nameEn}·#{result.cast.hexagram.id}</p>
          <HexagramLines hexagramId={result.cast.hexagram.id} changingLines={result.cast.changingLines}/>
          {result.cast.changingLines.length>0&&<p className="text-xs text-[var(--text-muted)]">{t.changingLine} {result.cast.changingLines.join(", ")}</p>}
          {result.cast.relatedHexagram&&<div className="mt-6 pt-6 border-t border-[var(--border)]"><p className="text-xs text-[var(--text-muted)] mb-2">{t.relatedHexagram}</p><div className="text-4xl">{hexagramToUnicode(result.cast.relatedHexagram.id)}</div><p className="text-base font-medium text-gradient">{result.cast.relatedHexagram.name}</p></div>}
        </div>
        <div className="glass p-8 mb-6"><h3 className="text-lg font-semibold text-gradient mb-4">{t.aiSummary}</h3><div className="prose text-sm" dangerouslySetInnerHTML={{__html:result.summary.replace(/\n/g,"<br/>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}}/></div>
        {!fullText?(!isPremium?<div className="glass p-8 text-center"><p className="text-[var(--text-secondary)] mb-4">{lang==="en"?"Free summary. Upgrade to unlock the complete AI reading.":"免费摘要。升级解锁完整AI解读。"}</p><a href="/pricing" className="btn btn-primary">乾 {lang==="en"?"Upgrade to Pro · $4.99/mo":"升级 Pro · $4.99/月"}</a><p className="text-xs text-[var(--text-muted)] mt-3">{lang==="en"?"PayPal and card payments coming soon.":"PayPal 和银行卡支付即将上线。"}</p></div>:<div className="glass p-8 text-center"><p className="text-[var(--text-secondary)] mb-4">{lang==="en"?"Unlock your full AI reading.":"解锁完整AI解读。"}</p><button onClick={unlock} disabled={interpreting} className="btn btn-primary">{interpreting?<>☯...</>:<>释 {t.unlockFull}</>}</button></div>):(<motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass p-8"><h3 className="text-lg font-semibold text-gradient mb-6">{t.fullInterpretation}</h3><div className="prose text-sm" dangerouslySetInnerHTML={{__html:fullText.replace(/\n/g,"<br/>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}}/></motion.div>)}
      </motion.div>)}</AnimatePresence>

        {/* Method navigation */}
        <MethodNav current={method} />
    </div>
  </div>);
}
