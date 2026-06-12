# ☯ 易经占卜 I Ching Oracle

基于 **Next.js 15** 的 AI 智能易经占卜平台。输入问题 → 随机起卦 → AI 解卦，融合千年易经智慧与现代人工智能。

## 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 16** | 全栈框架（App Router + SSR/SSG） |
| **TypeScript** | 类型安全 |
| **Tailwind CSS** | 样式 |
| **Supabase** | 数据库 + 认证 |
| **DeepSeek API** | AI 解卦（DeepSeek-Chat） |
| **Gumroad** | Premium 购买平台 |
| **Vercel** | 一键部署 |

## 功能

### 已完成 ✅
- 🎯 首页输入问题，随机起卦（金钱卦/蓍草卦/随机卦）
- 🀄 完整 64 卦数据（卦辞、象辞、中英文对照）
- 🤖 AI 免费摘要解读（DeepSeek-Chat-mini）
- 🔐 用户注册/登录（Supabase Auth）
- 📜 占卜历史记录
- ⭐ Free 摘要 + Premium 完整深度解读
- 💳 Gumroad 购买 Premium（终身 $19.99）
- 📝 64 卦 SEO 静态页面（SSG）
- 🛡️ 管理后台基础结构
- 🎨 暗色主题 + 响应式设计

### 待扩展 🔧
- [ ] 微信/支付宝支付
- [ ] 多语言支持（英语版本）
- [ ] 每日一卦
- [ ] 社区分享功能
- [ ] 邮件通知

## 项目结构

```
i-ching-oracle/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── divine/        # 起卦
│   │   │   ├── interpret/     # AI 解卦
│   │   │   ├── auth/          # 认证
│   │   │   ├── history/       # 历史记录
│   │   │   └── admin/         # 管理后台
│   │   ├── auth/              # 登录/注册页面
│   │   ├── history/           # 历史记录页面
│   │   ├── admin/             # 管理后台页面
│   │   ├── seo/               # 64卦SEO页面
│   │   │   └── [id]/          # 单个卦象详情
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页（占卜）
│   │   └── globals.css        # 全局样式
│   ├── components/            # React 组件
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/                   # 核心逻辑
│   │   ├── types.ts           # TypeScript 类型
│   │   ├── hexagrams.ts       # 64卦完整数据
│   │   ├── divination.ts      # 起卦算法
│   │   ├── openai.ts          # OpenAI 集成
│   │   └── supabase/          # Supabase 客户端
│   └── proxy.ts               # 路由保护
├── supabase/
│   └── schema.sql             # 数据库 Schema
├── .env.local                 # 环境变量
└── README.md
```

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd i-ching-oracle
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

编辑 `.env.local`，填入你的 API Keys：

```env
# Supabase (从 https://supabase.com 获取)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# DeepSeek (从 https://platform.deepseek.com 获取)
DEEPSEEK_API_KEY=sk-...

# Gumroad (Premium 购买链接)
GUMROAD_PRODUCT_URL=https://your-product.gumroad.com/l/iching-premium

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FREE_READING_LIMIT=3
```

### 4. 配置 Supabase

1. 在 [Supabase](https://supabase.com) 创建一个新项目
2. 进入 **SQL Editor**
3. 复制 `supabase/schema.sql` 的全部内容并执行
4. 进入 **Authentication → Settings**：
   - 启用 Email/Password 登录
   - 设置 Site URL: `http://localhost:3000`
   - 添加 Redirect URL: `http://localhost:3000/api/auth/callback`

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

### 6. 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. 配置环境变量（同上）
4. 部署！

## API 文档

### POST /api/divine — 起卦并获取摘要

```json
// Request
{ "question": "我应该接受这份工作吗？", "castType": "three-coins" }

// Response
{
  "success": true,
  "readingId": "uuid",
  "cast": {
    "hexagram": { "id": 1, "name": "乾為天", "nameEn": "The Creative" },
    "changingLines": [3],
    "isChanging": true,
    "relatedHexagram": { "id": 10, "name": "天澤履" }
  },
  "summary": "乾卦为六十四卦之首..."
}
```

### POST /api/interpret — 获取完整解读（付费）

```json
// Request
{ "readingId": "uuid", "question": "...", "hexagramId": 1, "changingLines": [3] }

// Response
{ "success": true, "interpretation": "## 卦象概述\n..." }
```

## 许可证

MIT License

---

<p align="center">
  <strong>☯ 以千年智慧，解今日之惑 ☯</strong>
</p>
