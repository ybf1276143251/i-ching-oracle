import { Hexagram, LineType, TrigramName } from "./types";

// ─── Trigram bitmaps (bottom-to-top: bit0=line1, bit1=line2, bit2=line3) ──

const TRIGRAM_BITS: Record<TrigramName, [LineType, LineType, LineType]> = {
  qian: ["yang", "yang", "yang"], // ☰ 111
  dui:  ["yang", "yang", "yin"],  // ☱ 110
  li:   ["yang", "yin",  "yang"], // ☲ 101
  zhen: ["yang", "yin",  "yin"],  // ☳ 100
  xun:  ["yin",  "yang", "yang"], // ☴ 011
  kan:  ["yin",  "yang", "yin"],  // ☵ 010
  gen:  ["yin",  "yin",  "yang"], // ☶ 001
  kun:  ["yin",  "yin",  "yin"],  // ☷ 000
};

const TRIGRAM_NAMES = {
  qian: { name: "乾", nameEn: "Heaven", character: "☰" },
  dui:  { name: "兌", nameEn: "Lake", character: "☱" },
  li:   { name: "離", nameEn: "Fire", character: "☲" },
  zhen: { name: "震", nameEn: "Thunder", character: "☳" },
  xun:  { name: "巽", nameEn: "Wind", character: "☴" },
  kan:  { name: "坎", nameEn: "Water", character: "☵" },
  gen:  { name: "艮", nameEn: "Mountain", character: "☶" },
  kun:  { name: "坤", nameEn: "Earth", character: "☷" },
} as const;

// ─── Build hexagram lines from trigrams ─────────────────────

function buildLines(lower: TrigramName, upper: TrigramName): LineType[] {
  return [...TRIGRAM_BITS[lower], ...TRIGRAM_BITS[upper]];
}

// ─── Hexagram definition ─────────────────────────────────────
// id: King Wen sequence, lines computed from trigrams

interface HexagramDef {
  id: number;
  name: string;
  nameEn: string;
  upper: TrigramName;
  lower: TrigramName;
  judgment: string;
  judgmentEn: string;
  image: string;
  imageEn: string;
  description: string;
  keywords: string[];
}

const DEFS: HexagramDef[] = [
  { id: 1,  name: "乾為天", nameEn: "The Creative", upper: "qian", lower: "qian", judgment: "乾，元亨利貞。", judgmentEn: "The Creative works sublime success, furthering through perseverance.", image: "天行健，君子以自強不息。", imageEn: "The movement of heaven is full of power. Thus the superior man makes himself strong and untiring.", description: "纯阳之卦，创始之力。代表天、健、创造、刚健不息。六爻皆阳，大吉大利。", keywords: ["creativity", "strength", "leadership", "perseverance", "heaven"] },
  { id: 2,  name: "坤為地", nameEn: "The Receptive", upper: "kun", lower: "kun", judgment: "坤，元亨，利牝馬之貞。", judgmentEn: "The Receptive brings about sublime success.", image: "地勢坤，君子以厚德載物。", imageEn: "The earth's condition is receptive devotion.", description: "纯阴之卦，承载之力。代表地、顺、包容、柔顺宽厚。六爻皆阴，以柔克刚。", keywords: ["receptivity", "nurturing", "patience", "devotion", "earth"] },
  { id: 3,  name: "水雷屯", nameEn: "Difficulty at the Beginning", upper: "kan", lower: "zhen", judgment: "屯，元亨利貞。勿用有攸往，利建侯。", judgmentEn: "Difficulty at the Beginning works supreme success.", image: "雲雷屯，君子以經綸。", imageEn: "Clouds and thunder: the image of Difficulty at the Beginning.", description: "万物始生之难。创业之初充满艰辛，需要耐心经营，如同幼苗破土。", keywords: ["beginning", "struggle", "chaos", "birth", "perseverance"] },
  { id: 4,  name: "山水蒙", nameEn: "Youthful Folly", upper: "gen", lower: "kan", judgment: "蒙，亨。匪我求童蒙，童蒙求我。", judgmentEn: "Youthful Folly has success.", image: "山下出泉，蒙。君子以果行育德。", imageEn: "A spring wells up at the foot of the mountain.", description: "启蒙之卦。如山下清泉，需要求教者主动求学。代表学习和成长的开端。", keywords: ["learning", "inexperience", "education", "curiosity", "guidance"] },
  { id: 5,  name: "水天需", nameEn: "Waiting (Nourishment)", upper: "kan", lower: "qian", judgment: "需，有孚，光亨，貞吉，利涉大川。", judgmentEn: "Waiting. If you are sincere, you have light and success.", image: "雲上於天，需。君子以飲食宴樂。", imageEn: "Clouds rise up to heaven: the image of Waiting.", description: "等待之卦。云在天上，雨尚未下。耐心等待时机成熟，保持信念。", keywords: ["patience", "waiting", "nourishment", "timing", "trust"] },
  { id: 6,  name: "天水訟", nameEn: "Conflict", upper: "qian", lower: "kan", judgment: "訟，有孚窒惕，中吉，終凶。", judgmentEn: "Conflict. You are sincere and are being obstructed.", image: "天與水違行，訟。君子以作事謀始。", imageEn: "Heaven and water go their opposite ways.", description: "争讼之卦。天向上水向下，方向相反。有争议时寻求和解，不要走到最后。", keywords: ["conflict", "dispute", "compromise", "caution", "justice"] },
  { id: 7,  name: "地水師", nameEn: "The Army", upper: "kun", lower: "kan", judgment: "師，貞，丈人吉，无咎。", judgmentEn: "The Army needs perseverance and a strong man.", image: "地中有水，師。君子以容民畜眾。", imageEn: "In the middle of the earth is water.", description: "军队之卦。地下藏水，暗流涌动。代表组织、纪律和集体行动。", keywords: ["army", "discipline", "organization", "leadership", "collective"] },
  { id: 8,  name: "水地比", nameEn: "Holding Together (Union)", upper: "kan", lower: "kun", judgment: "比，吉。原筮，元永貞，无咎。", judgmentEn: "Holding Together brings good fortune.", image: "地上有水，比。先王以建萬國，親諸侯。", imageEn: "On the earth is water: the image of Holding Together.", description: "亲比之卦。水在地上，相亲无间。代表团结、合作与和谐共处。", keywords: ["unity", "community", "bonding", "harmony", "cooperation"] },
  { id: 9,  name: "風天小畜", nameEn: "The Taming Power of the Small", upper: "xun", lower: "qian", judgment: "小畜，亨。密雲不雨，自我西郊。", judgmentEn: "The Taming Power of the Small has success.", image: "風行天上，小畜。君子以懿文德。", imageEn: "The wind drives across heaven.", description: "小畜之卦。风行天上，云虽密但雨未下。以小积大，渐进蓄势。", keywords: ["restraint", "gentle", "cultivation", "small steps", "refinement"] },
  { id: 10, name: "天澤履", nameEn: "Treading (Conduct)", upper: "qian", lower: "dui", judgment: "履虎尾，不咥人，亨。", judgmentEn: "Treading upon the tail of the tiger.", image: "上天下澤，履。君子以辯上下，定民志。", imageEn: "Heaven above, the lake below.", description: "履践之卦。天在上泽在下，各安其位。如履虎尾，谨慎行事则无害。", keywords: ["conduct", "caution", "propriety", "danger", "balance"] },
  { id: 11, name: "地天泰", nameEn: "Peace", upper: "kun", lower: "qian", judgment: "泰，小往大來，吉亨。", judgmentEn: "Peace. The small departs, the great approaches.", image: "天地交，泰。后以財成天地之道。", imageEn: "Heaven and earth unite: the image of Peace.", description: "通泰之卦。地在上天在下，天地交合。万物通达，事业顺利，上下和谐。", keywords: ["peace", "harmony", "prosperity", "balance", "flourishing"] },
  { id: 12, name: "天地否", nameEn: "Standstill (Stagnation)", upper: "qian", lower: "kun", judgment: "否之匪人，不利君子貞，大往小來。", judgmentEn: "Standstill. Evil people do not further.", image: "天地不交，否。君子以儉德辟難。", imageEn: "Heaven and earth do not unite.", description: "闭塞之卦。天在上地在下，天地不交。阻塞不通，宜退守自保。", keywords: ["stagnation", "blockage", "retreat", "patience", "isolation"] },
  { id: 13, name: "天火同人", nameEn: "Fellowship with Men", upper: "qian", lower: "li", judgment: "同人于野，亨。利涉大川，利君子貞。", judgmentEn: "Fellowship with men in the open. Success.", image: "天與火，同人。君子以類族辨物。", imageEn: "Heaven together with fire.", description: "同人之卦。天与火同为阳，相互辉映。代表志同道合、团结协作。", keywords: ["fellowship", "community", "alliance", "harmony", "clarity"] },
  { id: 14, name: "火天大有", nameEn: "Possession in Great Measure", upper: "li", lower: "qian", judgment: "大有，元亨。", judgmentEn: "Possession in Great Measure. Supreme success.", image: "火在天上，大有。君子以遏惡揚善。", imageEn: "Fire in heaven above.", description: "大有之卦。火在天上，光明普照。丰收、富足，大获成功之象。", keywords: ["abundance", "wealth", "generosity", "achievement", "prosperity"] },
  { id: 15, name: "地山謙", nameEn: "Modesty", upper: "kun", lower: "gen", judgment: "謙，亨，君子有終。", judgmentEn: "Modesty creates success.", image: "地中有山，謙。君子以裒多益寡。", imageEn: "Within the earth, a mountain.", description: "谦虚之卦。高山隐于地下，示人以谦。满招损谦受益，谦虚者终有善果。", keywords: ["modesty", "humility", "balance", "fairness", "simplicity"] },
  { id: 16, name: "雷地豫", nameEn: "Enthusiasm", upper: "zhen", lower: "kun", judgment: "豫，利建侯行師。", judgmentEn: "Enthusiasm. It furthers one to install helpers.", image: "雷出地奮，豫。先王以作樂崇德。", imageEn: "Thunder comes resounding out of the earth.", description: "豫乐之卦。雷出于地，振奋人心。代表喜悦、音乐和积极向上的力量。", keywords: ["enthusiasm", "joy", "music", "inspiration", "momentum"] },
  { id: 17, name: "澤雷隨", nameEn: "Following", upper: "dui", lower: "zhen", judgment: "隨，元亨利貞，无咎。", judgmentEn: "Following has supreme success.", image: "澤中有雷，隨。君子以嚮晦入宴息。", imageEn: "Thunder in the middle of the lake.", description: "随从之卦。雷在泽中，顺势而动。代表顺应时势、灵活变通。", keywords: ["following", "adaptation", "flexibility", "rest", "flow"] },
  { id: 18, name: "山風蠱", nameEn: "Work on What Has Been Spoiled (Decay)", upper: "gen", lower: "xun", judgment: "蠱，元亨，利涉大川。先甲三日，後甲三日。", judgmentEn: "Work on What Has Been Spoiled has supreme success.", image: "山下有風，蠱。君子以振民育德。", imageEn: "The wind blows low on the mountain.", description: "蛊乱之卦。山下有风，风被山阻而成乱流。事物腐败后需要整顿革新。", keywords: ["decay", "repair", "renewal", "correction", "reform"] },
  { id: 19, name: "地澤臨", nameEn: "Approach", upper: "kun", lower: "dui", judgment: "臨，元亨利貞。至于八月有凶。", judgmentEn: "Approach has supreme success.", image: "澤上有地，臨。君子以教思无窮。", imageEn: "The earth above the lake.", description: "临近之卦。地在泽上，居高临下。代表亲临、监督和教导，好运将至。", keywords: ["approach", "teaching", "leadership", "opportunity", "advance"] },
  { id: 20, name: "風地觀", nameEn: "Contemplation (View)", upper: "xun", lower: "kun", judgment: "觀，盥而不薦，有孚顒若。", judgmentEn: "Contemplation. The ablution has been made.", image: "風行地上，觀。先王以省方，觀民設教。", imageEn: "The wind blows over the earth.", description: "观察之卦。风行地上，无所不观。代表观察、反思和省悟。", keywords: ["contemplation", "observation", "perspective", "reflection", "wisdom"] },
  { id: 21, name: "火雷噬嗑", nameEn: "Biting Through", upper: "li", lower: "zhen", judgment: "噬嗑，亨，利用獄。", judgmentEn: "Biting Through has success.", image: "雷電噬嗑。先王以明罰敕法。", imageEn: "Thunder and lightning.", description: "噬嗑之卦。雷电交加，咬合而通。代表以强力清除障碍，法治严明。", keywords: ["justice", "obstacles", "decisive", "enforcement", "breakthrough"] },
  { id: 22, name: "山火賁", nameEn: "Grace", upper: "gen", lower: "li", judgment: "賁，亨，小利有攸往。", judgmentEn: "Grace has success. In small matters.", image: "山下有火，賁。君子以明庶政。", imageEn: "Fire at the foot of the mountain.", description: "贲饰之卦。山下有火，照亮山形。代表文饰、美化与外在形式。", keywords: ["grace", "beauty", "art", "form", "elegance"] },
  { id: 23, name: "山地剝", nameEn: "Splitting Apart", upper: "gen", lower: "kun", judgment: "剝，不利有攸往。", judgmentEn: "Splitting Apart. It does not further.", image: "山附於地，剝。上以厚下安宅。", imageEn: "The mountain rests on the earth.", description: "剥落之卦。山附于地，山石剥落。代表衰败、剥蚀、根基动摇。", keywords: ["deterioration", "collapse", "foundation", "caution", "generosity"] },
  { id: 24, name: "地雷復", nameEn: "Return (The Turning Point)", upper: "kun", lower: "zhen", judgment: "復，亨。出入无疾，朋來无咎。", judgmentEn: "Return. Success. Going out and coming in without error.", image: "雷在地中，復。先王以至日閉關。", imageEn: "Thunder within the earth.", description: "回复之卦。一阳复生于地下。冬至阳生，万象更新，否极泰来。", keywords: ["return", "renewal", "cycle", "rebirth", "turning point"] },
  { id: 25, name: "天雷无妄", nameEn: "Innocence (The Unexpected)", upper: "qian", lower: "zhen", judgment: "无妄，元亨利貞。其匪正有眚。", judgmentEn: "Innocence. Supreme success.", image: "天下雷行，物與无妄。先王以茂對時。", imageEn: "Under heaven thunder rolls.", description: "无妄之卦。天下雷行，出乎自然。代表纯真、诚实和意外之事。", keywords: ["innocence", "natural", "unexpected", "sincerity", "spontaneity"] },
  { id: 26, name: "山天大畜", nameEn: "The Taming Power of the Great", upper: "gen", lower: "qian", judgment: "大畜，利貞。不家食吉，利涉大川。", judgmentEn: "The Taming Power of the Great.", image: "天在山中，大畜。君子以多識前言往行。", imageEn: "Heaven within the mountain.", description: "大畜之卦。天在山中，蓄积巨大能量。代表深厚的积蓄和准备。", keywords: ["accumulation", "wisdom", "preparation", "power", "knowledge"] },
  { id: 27, name: "山雷頤", nameEn: "The Corners of the Mouth (Providing Nourishment)", upper: "gen", lower: "zhen", judgment: "頤，貞吉。觀頤，自求口實。", judgmentEn: "The Corners of the Mouth.", image: "山下有雷，頤。君子以慎言語，節飲食。", imageEn: "At the foot of the mountain, thunder.", description: "颐养之卦。山下有雷，万物得养。代表养生、言语谨慎和自食其力。", keywords: ["nourishment", "sustenance", "moderation", "speech", "health"] },
  { id: 28, name: "澤風大過", nameEn: "Preponderance of the Great", upper: "dui", lower: "xun", judgment: "大過，棟橈，利有攸往，亨。", judgmentEn: "Preponderance of the Great.", image: "澤滅木，大過。君子以獨立不懼。", imageEn: "The lake rises above the trees.", description: "大过之卦。泽水淹没树木，过度之象。代表非常之时需要非常之举。", keywords: ["excess", "crisis", "independence", "courage", "extraordinary"] },
  { id: 29, name: "坎為水", nameEn: "The Abysmal (Water)", upper: "kan", lower: "kan", judgment: "習坎，有孚，維心亨，行有尚。", judgmentEn: "The Abysmal repeated.", image: "水洊至，習坎。君子以常德行，習教事。", imageEn: "Water flows on uninterruptedly.", description: "重险之卦。水流重叠，险中有险。代表危险与挑战，需如水般柔韧流动。", keywords: ["danger", "depth", "flow", "sincerity", "perseverance"] },
  { id: 30, name: "離為火", nameEn: "The Clinging (Fire)", upper: "li", lower: "li", judgment: "離，利貞，亨。畜牝牛吉。", judgmentEn: "The Clinging. Perseverance furthers.", image: "明兩作，離。大人以繼明照于四方。", imageEn: "That which is bright rises twice.", description: "光明之卦。日月在天，光明相续。代表依附、光明和文明之美。", keywords: ["clarity", "light", "illumination", "dependence", "beauty"] },
  { id: 31, name: "澤山咸", nameEn: "Influence (Wooing)", upper: "dui", lower: "gen", judgment: "咸，亨利貞，取女吉。", judgmentEn: "Influence. Success. Perseverance.", image: "山上有澤，咸。君子以虛受人。", imageEn: "A lake on the mountain.", description: "感应之卦。山上有泽，相互感应。代表感情、婚恋和心灵相通。", keywords: ["influence", "attraction", "love", "relationship", "openness"] },
  { id: 32, name: "雷風恆", nameEn: "Duration", upper: "zhen", lower: "xun", judgment: "恆，亨，无咎，利貞，利有攸往。", judgmentEn: "Duration. Success. No blame.", image: "雷風，恆。君子以立不易方。", imageEn: "Thunder and wind: the image of Duration.", description: "恒久之卦。雷风相随，持之以恒。代表稳定、婚姻和长久的坚持。", keywords: ["duration", "constancy", "commitment", "stability", "marriage"] },
  { id: 33, name: "天山遯", nameEn: "Retreat", upper: "qian", lower: "gen", judgment: "遯，亨，小利貞。", judgmentEn: "Retreat. Success. In what is small.", image: "天下有山，遯。君子以遠小人，不惡而嚴。", imageEn: "Mountain under heaven.", description: "退避之卦。山虽高，天更高。代表适时退让，以退为进。", keywords: ["retreat", "withdrawal", "strategy", "boundary", "prudence"] },
  { id: 34, name: "雷天大壯", nameEn: "The Power of the Great", upper: "zhen", lower: "qian", judgment: "大壯，利貞。", judgmentEn: "The Power of the Great.", image: "雷在天上，大壯。君子以非禮弗履。", imageEn: "Thunder in heaven above.", description: "大壮之卦。雷在天上，声势浩大。代表强盛与力量，但需以正用强。", keywords: ["power", "strength", "justice", "caution", "restraint"] },
  { id: 35, name: "火地晉", nameEn: "Progress", upper: "li", lower: "kun", judgment: "晉，康侯用錫馬蕃庶，晝日三接。", judgmentEn: "Progress. The powerful prince is honored.", image: "明出地上，晉。君子以自昭明德。", imageEn: "The sun rises over the earth.", description: "晋进之卦。日出地上，光明上升。代表晋升、进步和事业蒸蒸日上。", keywords: ["progress", "advancement", "success", "recognition", "growth"] },
  { id: 36, name: "地火明夷", nameEn: "Darkening of the Light", upper: "kun", lower: "li", judgment: "明夷，利艱貞。", judgmentEn: "Darkening of the Light.", image: "明入地中，明夷。君子以蒞眾，用晦而明。", imageEn: "The light has sunk into the earth.", description: "明夷之卦。光明沉入地下，晦暗不明。代表逆境中韬光养晦。", keywords: ["adversity", "darkness", "perseverance", "concealment", "caution"] },
  { id: 37, name: "風火家人", nameEn: "The Family (The Clan)", upper: "xun", lower: "li", judgment: "家人，利女貞。", judgmentEn: "The Family. The perseverance of the woman.", image: "風自火出，家人。君子以言有物，而行有恆。", imageEn: "Wind comes forth from fire.", description: "家人之卦。风从火出，家道兴旺。代表家庭、和谐与各尽其责。", keywords: ["family", "home", "harmony", "roles", "domestic"] },
  { id: 38, name: "火澤睽", nameEn: "Opposition", upper: "li", lower: "dui", judgment: "睽，小事吉。", judgmentEn: "Opposition. In small matters, good fortune.", image: "上火下澤，睽。君子以同而異。", imageEn: "Above fire, below the lake.", description: "睽违之卦。火向上泽向下，方向相反。代表分歧与对立，可小不可大。", keywords: ["opposition", "difference", "individuality", "tension", "paradox"] },
  { id: 39, name: "水山蹇", nameEn: "Obstruction", upper: "kan", lower: "gen", judgment: "蹇，利西南，不利東北。利見大人，貞吉。", judgmentEn: "Obstruction. The southwest furthers.", image: "山上有水，蹇。君子以反身修德。", imageEn: "Water on the mountain.", description: "蹇难之卦。山上有水，前行艰难。代表困境和阻碍，反求诸己。", keywords: ["obstacle", "hardship", "introspection", "self-improvement", "patience"] },
  { id: 40, name: "雷水解", nameEn: "Deliverance", upper: "zhen", lower: "kan", judgment: "解，利西南。无所往，其來復吉。", judgmentEn: "Deliverance. The southwest furthers.", image: "雷雨作，解。君子以赦過宥罪。", imageEn: "Thunder and rain set in.", description: "解脱之卦。雷雨大作，洗涤万物。代表困难解除，宽恕与新生。", keywords: ["deliverance", "release", "forgiveness", "relief", "resolution"] },
  { id: 41, name: "山澤損", nameEn: "Decrease", upper: "gen", lower: "dui", judgment: "損，有孚，元吉，无咎，可貞。", judgmentEn: "Decrease. If one is sincere.", image: "山下有澤，損。君子以懲忿窒欲。", imageEn: "At the foot of the mountain, the lake.", description: "损减之卦。山下有泽，减损以益。代表减少、克制欲望和舍弃。", keywords: ["decrease", "sacrifice", "simplicity", "restraint", "discipline"] },
  { id: 42, name: "風雷益", nameEn: "Increase", upper: "xun", lower: "zhen", judgment: "益，利有攸往，利涉大川。", judgmentEn: "Increase. It furthers one to undertake.", image: "風雷，益。君子以見善則遷，有過則改。", imageEn: "Wind and thunder: the image of Increase.", description: "增益之卦。风雷相得益彰。代表增长、助益和不断进步。", keywords: ["increase", "growth", "abundance", "improvement", "generosity"] },
  { id: 43, name: "澤天夬", nameEn: "Break-through (Resoluteness)", upper: "dui", lower: "qian", judgment: "夬，揚于王庭，孚號有厲。", judgmentEn: "Break-through. One must resolutely make the matter known.", image: "澤上於天，夬。君子以施祿及下。", imageEn: "The lake has risen up to heaven.", description: "夬决之卦。泽水在天上，决堤而下。代表决断和彻底的解决。", keywords: ["breakthrough", "resolution", "decisive", "truth", "separation"] },
  { id: 44, name: "天風姤", nameEn: "Coming to Meet", upper: "qian", lower: "xun", judgment: "姤，女壯，勿用取女。", judgmentEn: "Coming to Meet. The maiden is powerful.", image: "天下有風，姤。后以施命誥四方。", imageEn: "The wind blows under heaven.", description: "姤遇之卦。风行天下，无所不遇。代表邂逅、偶遇和意外相逢。", keywords: ["encounter", "meeting", "temptation", "warning", "influence"] },
  { id: 45, name: "澤地萃", nameEn: "Gathering Together (Massing)", upper: "dui", lower: "kun", judgment: "萃，亨。王假有廟。利見大人。", judgmentEn: "Gathering Together. Success.", image: "澤上於地，萃。君子以除戎器，戒不虞。", imageEn: "Over the earth, the lake.", description: "萃聚之卦。泽在地上，水聚成湖。代表聚集、团结和共同目标。", keywords: ["gathering", "assembly", "collective", "community", "preparation"] },
  { id: 46, name: "地風升", nameEn: "Pushing Upward", upper: "kun", lower: "xun", judgment: "升，元亨。用見大人，勿恤。南征吉。", judgmentEn: "Pushing Upward has supreme success.", image: "地中生木，升。君子以順德，積小以高大。", imageEn: "Within the earth, wood grows.", description: "上升之卦。地中长出树木，向上生长。代表晋升、发展和步步高升。", keywords: ["advancement", "rise", "promotion", "growth", "persistence"] },
  { id: 47, name: "澤水困", nameEn: "Oppression (Exhaustion)", upper: "dui", lower: "kan", judgment: "困，亨，貞，大人吉，无咎。有言不信。", judgmentEn: "Oppression. Success. Perseverance.", image: "澤无水，困。君子以致命遂志。", imageEn: "There is no water in the lake.", description: "困顿之卦。泽中无水，枯竭困乏。代表困境和考验，坚守正道。", keywords: ["oppression", "exhaustion", "adversity", "perseverance", "fate"] },
  { id: 48, name: "水風井", nameEn: "The Well", upper: "kan", lower: "xun", judgment: "井，改邑不改井，无喪无得。", judgmentEn: "The Well. The town may be changed.", image: "木上有水，井。君子以勞民勸相。", imageEn: "Water over wood: the image of The Well.", description: "水井之卦。木上有水，如井养人。代表根本资源和持续滋养。", keywords: ["well", "source", "foundation", "nourishment", "community"] },
  { id: 49, name: "澤火革", nameEn: "Revolution (Molting)", upper: "dui", lower: "li", judgment: "革，己日乃孚。元亨利貞，悔亡。", judgmentEn: "Revolution. On your own day you are believed.", image: "澤中有火，革。君子以治歷明時。", imageEn: "Fire in the lake: the image of Revolution.", description: "变革之卦。泽中有火，水火相革。代表彻底变革和除旧布新。", keywords: ["revolution", "change", "transformation", "timing", "renewal"] },
  { id: 50, name: "火風鼎", nameEn: "The Caldron", upper: "li", lower: "xun", judgment: "鼎，元吉亨。", judgmentEn: "The Caldron. Supreme good fortune.", image: "木上有火，鼎。君子以正位凝命。", imageEn: "Fire over wood: the image of The Caldron.", description: "鼎新之卦。木上生火，如鼎烹饪。代表建立新秩序和养贤用才。", keywords: ["caldron", "transformation", "nourishment", "civilization", "alchemy"] },
  { id: 51, name: "震為雷", nameEn: "The Arousing (Shock, Thunder)", upper: "zhen", lower: "zhen", judgment: "震，亨。震來虩虩，笑言啞啞。", judgmentEn: "Shock brings success.", image: "洊雷，震。君子以恐懼修省。", imageEn: "Thunder repeated: the image of Shock.", description: "震动之卦。雷声重叠，惊动百里。代表震惊、觉醒和反思自省。", keywords: ["shock", "awakening", "fear", "examination", "sudden change"] },
  { id: 52, name: "艮為山", nameEn: "Keeping Still (Mountain)", upper: "gen", lower: "gen", judgment: "艮其背，不獲其身。行其庭，不見其人。", judgmentEn: "Keeping Still. Keeping his back still.", image: "兼山，艮。君子以思不出其位。", imageEn: "Mountains standing close together.", description: "静止之卦。两山并立，岿然不动。代表停止、冥想和知止不殆。", keywords: ["stillness", "meditation", "stopping", "boundary", "inner peace"] },
  { id: 53, name: "風山漸", nameEn: "Development (Gradual Progress)", upper: "xun", lower: "gen", judgment: "漸，女歸吉，利貞。", judgmentEn: "Development. The maiden is given in marriage.", image: "山上有木，漸。君子以居賢德善俗。", imageEn: "On the mountain, a tree.", description: "渐进之卦。山上有树木，慢慢生长。代表渐进发展和稳步前行。", keywords: ["development", "gradual", "patience", "growth", "persistence"] },
  { id: 54, name: "雷澤歸妹", nameEn: "The Marrying Maiden", upper: "zhen", lower: "dui", judgment: "歸妹，征凶，无攸利。", judgmentEn: "The Marrying Maiden. Undertakings bring misfortune.", image: "澤上有雷，歸妹。君子以永終知敝。", imageEn: "Thunder over the lake.", description: "归妹之卦。雷在泽上，阴阳相感。代表婚姻和随从，需谨慎。", keywords: ["marriage", "adaptation", "secondary", "caution", "transitory"] },
  { id: 55, name: "雷火豐", nameEn: "Abundance (Fullness)", upper: "zhen", lower: "li", judgment: "豐，亨，王假之。勿憂，宜日中。", judgmentEn: "Abundance has success.", image: "雷電皆至，豐。君子以折獄致刑。", imageEn: "Both thunder and lightning come.", description: "丰盛之卦。雷电齐至，盛大光明。代表鼎盛与丰收，盛极必衰。", keywords: ["abundance", "fullness", "peak", "celebration", "clarity"] },
  { id: 56, name: "火山旅", nameEn: "The Wanderer", upper: "li", lower: "gen", judgment: "旅，小亨，旅貞吉。", judgmentEn: "The Wanderer. Success through smallness.", image: "山上有火，旅。君子以明慎用刑。", imageEn: "Fire on the mountain.", description: "旅行之卦。山上有火，如旅人举火。代表漂泊在外和客居他乡。", keywords: ["wanderer", "travel", "stranger", "adaptability", "transience"] },
  { id: 57, name: "巽為風", nameEn: "The Gentle (The Penetrating, Wind)", upper: "xun", lower: "xun", judgment: "巽，小亨，利有攸往，利見大人。", judgmentEn: "The Gentle. Success through what is small.", image: "隨風，巽。君子以申命行事。", imageEn: "Winds following one upon the other.", description: "巽入之卦。风随风，无所不入。代表柔顺、渗透和潜移默化。", keywords: ["gentleness", "penetration", "influence", "subtlety", "adaptation"] },
  { id: 58, name: "兌為澤", nameEn: "The Joyous (Lake)", upper: "dui", lower: "dui", judgment: "兌，亨，利貞。", judgmentEn: "The Joyous. Success. Perseverance.", image: "麗澤，兌。君子以朋友講習。", imageEn: "Lakes resting one on the other.", description: "喜悦之卦。两泽相连，互相滋养。代表欢乐、交谈和分享喜悦。", keywords: ["joy", "pleasure", "friendship", "exchange", "celebration"] },
  { id: 59, name: "風水渙", nameEn: "Dispersion (Dissolution)", upper: "xun", lower: "kan", judgment: "渙，亨。王假有廟。利涉大川。", judgmentEn: "Dispersion. Success.", image: "風行水上，渙。先王以享于帝立廟。", imageEn: "The wind drives over the water.", description: "涣散之卦。风行水上，涣然冰释。代表消散、化解和重新凝聚。", keywords: ["dispersion", "dissolution", "reconnection", "release", "unity"] },
  { id: 60, name: "水澤節", nameEn: "Limitation", upper: "kan", lower: "dui", judgment: "節，亨。苦節不可貞。", judgmentEn: "Limitation. Success.", image: "澤上有水，節。君子以制數度，議德行。", imageEn: "Water over lake.", description: "节制之卦。水在泽上，需有节制。代表制度、规范和适度约束。", keywords: ["limitation", "boundary", "moderation", "structure", "discipline"] },
  { id: 61, name: "風澤中孚", nameEn: "Inner Truth", upper: "xun", lower: "dui", judgment: "中孚，豚魚吉。利涉大川，利貞。", judgmentEn: "Inner Truth. Pigs and fishes. Good fortune.", image: "澤上有風，中孚。君子以議獄緩死。", imageEn: "Wind over lake.", description: "中孚之卦。风在泽上，诚信感人。代表诚信、信任和内心的真实。", keywords: ["truth", "sincerity", "trust", "authenticity", "connection"] },
  { id: 62, name: "雷山小過", nameEn: "Preponderance of the Small", upper: "zhen", lower: "gen", judgment: "小過，亨，利貞。可小事，不可大事。", judgmentEn: "Preponderance of the Small.", image: "山上有雷，小過。君子以行過乎恭。", imageEn: "Thunder on the mountain.", description: "小过之卦。雷在山上，略有过越。代表小过失和小调整，宜小不宜大。", keywords: ["smallness", "detail", "correction", "humility", "restraint"] },
  { id: 63, name: "水火既濟", nameEn: "After Completion", upper: "kan", lower: "li", judgment: "既濟，亨小，利貞。初吉終亂。", judgmentEn: "After Completion. Success in small matters.", image: "水在火上，既濟。君子以思患而豫防之。", imageEn: "Water over fire.", description: "既济之卦。水在火上，烹饪已成。代表已完成，但需防盛极而衰。", keywords: ["completion", "achievement", "vigilance", "impermanence", "order"] },
  { id: 64, name: "火水未濟", nameEn: "Before Completion", upper: "li", lower: "kan", judgment: "未濟，亨。小狐汔濟，濡其尾。", judgmentEn: "Before Completion. Success.", image: "火在水上，未濟。君子以慎辨物居方。", imageEn: "Fire over water.", description: "未济之卦。火在水上，水火未交。代表尚未完成，希望在前。", keywords: ["incomplete", "transition", "potential", "careful", "hope"] },
];

// ─── Build HEXAGRAMS with computed lines ────────────────────

export const HEXAGRAMS: Hexagram[] = DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  nameEn: d.nameEn,
  upperTrigram: d.upper,
  lowerTrigram: d.lower,
  lines: buildLines(d.lower, d.upper),
  judgment: d.judgment,
  judgmentEn: d.judgmentEn,
  image: d.image,
  imageEn: d.imageEn,
  description: d.description,
  keywords: d.keywords,
}));

// ─── Helper functions ────────────────────────────────────────

export function getHexagramById(id: number): Hexagram | undefined {
  return HEXAGRAMS.find(h => h.id === id);
}

export function getRelatedHexagram(primary: Hexagram, changingLines: number[]): Hexagram | undefined {
  if (changingLines.length === 0) return undefined;
  const newLines = [...primary.lines];
  for (const lineIdx of changingLines) {
    const i = lineIdx - 1;
    newLines[i] = newLines[i] === "yang" ? "yin" : "yang";
  }
  return HEXAGRAMS.find(h => h.lines.every((l, i) => l === newLines[i]));
}

export const TRIGRAM_MAP = TRIGRAM_NAMES;
