// 这个行业的分类体系：类别、标签词表、机构（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（解读、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "policy", label: "政策监管", feedLabel: "政策与监管", section: "政策与监管", guide: "监管部门、政府与交易所发布的规则、通知、口径、处罚与自律措施：央行货币政策工具、金融监管总局与证监会规章与罚单、财政部税费政策、交易所规则调整、地方与楼市调控。作者对政策的解读归观点，政策落地后的价格与资金反应归市场。" },
  { key: "macro", label: "宏观数据", feedLabel: "宏观数据", section: "宏观与市场", guide: "官方发布的经济与金融统计结果：GDP、CPI/PPI、PMI、社融与信贷、进出口、就业、居民收入、财政收支、国际收支，以及官方对利率与汇率的定价调整（LPR、MLF、存款准备金率）。机构对数据的预测与解读归观点。" },
  { key: "markets", label: "市场行情", feedLabel: "市场行情", section: "宏观与市场", guide: "可指认的价格、成交与资金面变化：A股/港股/美股指数与板块异动、债市与收益率、汇率与商品、加密资产、北向与两融资金、重要的估值或点位变化，以及驱动这些变化的已发生事件。单只个股的日常涨跌不单独成条，只有出现明确驱动因素时才收。" },
  { key: "institutions", label: "机构动态", feedLabel: "机构动态", section: "机构动态", guide: "持牌与大型金融机构自身的经营和治理：银行、券商、保险、基金、信托、资管、交易所、支付机构的财报与业绩、人事任免、股权变动与并购、牌照与合规、战略与组织调整。它们发行的产品归产品与资金。" },
  { key: "industry", label: "行业生态", feedLabel: "行业生态", section: "机构动态", guide: "整个金融行业层面的消息：市场规模与竞争格局、行业协会与自律组织、从业人员与薪酬、非持牌机构的重大动作、区域金融与金融中心政策。单个机构的经营归机构动态，产品发行归产品与资金。" },
  { key: "products", label: "产品与资金", feedLabel: "产品与资金", section: "产品与资金", guide: "面向投资者或客户的具体产品与资金动作：新基金与 ETF 的发行和募集结果、指数发布、理财产品与存款产品调整、IPO 与再融资、债券发行、信贷与保险产品条款变化、费率与利率调整、重大投融资与并购交易金额。" },
  { key: "fintech", label: "金融科技", feedLabel: "金融科技", section: "金融科技", guide: "技术改变金融服务与交易方式：数字人民币、支付清算与跨境结算、风控与征信科技、量化交易与交易系统、区块链与稳定币、金融数据与模型在业务中的落地。与金融业务无关的纯技术发布不归此类。" },
  { key: "view", label: "观点解读", section: "观点与解读", guide: "重点是作者的判断、解释或预测，以及让读者看懂、会用金融知识的内容：机构研报观点、经济学家与分析师预测、政策解读、市场复盘、从业者访谈、概念科普与避坑指引。当事人发布自己的消息即使带态度，也不因此归观点；只有态度和预测而无方法或事实的短评同样归此类。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的"N 个新模型"、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。金融没有单一主导的发布类，所以设 null。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = [
  "gdp", "cpi", "ppi", "pmi", "ipo", "etf", "lpr", "mlf", "a股", "港股", "美股", "债市",
  "央行", "美联储", "社融", "降准", "降息", "加息", "国债", "公募", "私募", "券商", "资管", "北向资金",
];

/**
 * 内容理解一步给每篇资料判的"内容类型"（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["policy_release", "data_release", "market_move", "corporate_event", "product_launch", "research_view", "opinion_analysis", "guide_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些"分类标签"之一。 */
export const CATEGORY_TAGS = [
  "政策监管", "宏观数据", "市场行情", "机构动态", "行业生态", "产品与资金", "金融科技", "观点解读", "解读科普", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "A股", "港股", "美股", "债券", "商品/黄金", "外汇", "利率", "公募基金", "私募/资管", "银行", "保险", "券商", "信托",
  "加密资产", "数字支付", "IPO/再融资", "并购", "财报", "监管处罚", "量化交易", "信用/风险", "房地产金融", "美联储/海外",
] as const;

/** 可选的实体标签（机构、监管、交易所）。 */
export const ENTITY_TAGS = ["央行", "证监会", "金融监管总局", "财政部", "国家统计局", "上交所", "深交所", "美联储", "欧洲央行", "国际货币基金组织"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  股市: "A股", 股票: "A股", 沪深股市: "A股", 大A: "A股", 港股市场: "港股", 美股市场: "美股",
  债券市场: "债券", 债市: "债券", 汇率: "外汇", 人民币汇率: "外汇", 黄金: "商品/黄金", 大宗商品: "商品/黄金", 原油: "商品/黄金",
  基金: "公募基金", 公募: "公募基金", 私募基金: "私募/资管", 资管: "私募/资管", 理财: "私募/资管",
  数字货币: "加密资产", 加密货币: "加密资产", 虚拟货币: "加密资产", 稳定币: "加密资产", 比特币: "加密资产",
  支付: "数字支付", 第三方支付: "数字支付", 数字人民币: "数字支付",
  融资: "IPO/再融资", 上市: "IPO/再融资", 新股: "IPO/再融资", 定增: "IPO/再融资", 并购重组: "并购", 收购: "并购",
  业绩: "财报", 年报: "财报", 季报: "财报", 罚单: "监管处罚", 处罚: "监管处罚", 罚款: "监管处罚",
  银保监会: "金融监管总局", 银保监: "金融监管总局", 加息: "利率", 降息: "利率", 降准: "利率", 存款准备金率: "利率",
  量化: "量化交易", 程序化交易: "量化交易", 风险: "信用/风险", 违约: "信用/风险", 房地产: "房地产金融", 楼市: "房地产金融",
  美联储加息: "美联储/海外", 海外市场: "美联储/海外",
  政策: "政策监管", 监管: "政策监管", 法规: "政策监管", 经济数据: "宏观数据", 统计数据: "宏观数据",
  行情: "市场行情", 大盘: "市场行情", 公司动态: "机构动态", 银行动态: "机构动态", 产品: "产品与资金", 发行: "产品与资金",
  科技金融: "金融科技", 金融科技应用: "金融科技", 观点: "观点解读", 评论: "观点解读", 研报: "观点解读",
  教程: "解读科普", 科普: "解读科普", 指南: "解读科普", 解读: "解读科普", 避坑: "解读科普",
};

// ── 机构与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 机构主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是机构自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  pboc: { name: "中国人民银行", displayTag: "央行", aliases: ["中国人民银行", "央行", "人民银行"], otherNames: ["外汇局", "国家外汇管理局"] },
  csrc: { name: "中国证监会", displayTag: "证监会", aliases: ["中国证监会", "证监会"] },
  nfra: { name: "国家金融监督管理总局", displayTag: "金融监管总局", aliases: ["国家金融监督管理总局", "金融监管总局", "银保监会"] },
  mof: { name: "财政部", displayTag: null, aliases: ["财政部"] },
  stats: { name: "国家统计局", displayTag: null, aliases: ["国家统计局", "统计局"] },
  sse: { name: "上海证券交易所", displayTag: null, aliases: ["上海证券交易所", "上交所"] },
  szse: { name: "深圳证券交易所", displayTag: null, aliases: ["深圳证券交易所", "深交所"] },
  fed: { name: "美联储", displayTag: "美联储", aliases: ["美联储", "联邦储备", "Federal Reserve", "联储"] },
  icbc: { name: "工商银行", displayTag: null, aliases: ["工商银行", "中国工商银行", "工行", "ICBC"] },
  ccb: { name: "建设银行", displayTag: null, aliases: ["建设银行", "中国建设银行", "建行", "CCB"] },
  abc: { name: "农业银行", displayTag: null, aliases: ["农业银行", "中国农业银行", "农行", "ABC"] },
  boc: { name: "中国银行", displayTag: null, aliases: ["中国银行", "中行", "BOC"] },
  cmb: { name: "招商银行", displayTag: null, aliases: ["招商银行", "招行", "CMB"] },
  pingan: { name: "中国平安", displayTag: null, aliases: ["中国平安", "平安保险", "平安集团"] },
  citic: { name: "中信证券", displayTag: null, aliases: ["中信证券", "中信建投"] },
  htsc: { name: "华泰证券", displayTag: null, aliases: ["华泰证券", "华泰"] },
  eastmoney: { name: "东方财富", displayTag: null, aliases: ["东方财富", "东财"] },
  ant: { name: "蚂蚁集团", displayTag: null, aliases: ["蚂蚁集团", "蚂蚁金服", "支付宝", "Ant Group"] },
};

/**
 * 身份词典：摘要和标题里出现的机构，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "pboc", name: "中国人民银行", patterns: [/央行|人民银行|pbc|外汇局/i] },
  { id: "csrc", name: "中国证监会", patterns: [/证监会|csrc/i] },
  { id: "nfra", name: "国家金融监督管理总局", patterns: [/金融监管总局|银保监会|金监总局|nfra/i] },
  { id: "mof", name: "财政部", patterns: [/财政部|财政政策/i] },
  { id: "stats", name: "国家统计局", patterns: [/国家统计局|统计局/i] },
  { id: "sse", name: "上海证券交易所", patterns: [/上交所|上海证券交易所/i] },
  { id: "szse", name: "深圳证券交易所", patterns: [/深交所|深圳证券交易所/i] },
  { id: "fed", name: "美联储", patterns: [/美联储|联储|federal reserve|\bfomc\b/i] },
  { id: "icbc", name: "工商银行", patterns: [/工商银行|工行|icbc/i] },
  { id: "cmb", name: "招商银行", patterns: [/招商银行|招行|\bcmb\b/i] },
  { id: "pingan", name: "中国平安", patterns: [/中国平安|平安保险|平安集团/i] },
  { id: "citic", name: "中信证券", patterns: [/中信证券|中信建投/i] },
  { id: "htsc", name: "华泰证券", patterns: [/华泰证券/i] },
  { id: "eastmoney", name: "东方财富", patterns: [/东方财富/i] },
  { id: "ant", name: "蚂蚁集团", patterns: [/蚂蚁集团|蚂蚁金服|支付宝/i] },
];

/** 这些域名上的文章，发布方就是对应的机构（交易所与媒体平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "pboc", domains: ["pbc.gov.cn"] },
  { entityId: "csrc", domains: ["csrc.gov.cn"] },
  { entityId: "nfra", domains: ["nfra.gov.cn"] },
  { entityId: "mof", domains: ["mof.gov.cn"] },
  { entityId: "stats", domains: ["stats.gov.cn"] },
  { entityId: "fed", domains: ["federalreserve.gov"] },
];

/** 原文里的这些写法也算提到了对应机构。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "pboc", pattern: /货币政策司|公开市场业务/i },
  { entityId: "csrc", pattern: /发行监管司|上市公司监管/i },
];
