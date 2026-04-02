# 人类判官 vs AI 判官 · Human Judge vs AI Judge

> A browser-based intent-classification game where you compete head-to-head against a large language model to label real e-commerce customer-service tickets.

[中文说明](#中文说明) | [English](#english)

---

## 中文说明

### 项目简介

每局随机抽取 **10 条真实售后工单**，玩家和 AI 各自判断客户意图，结算时对比「你的判断 · AI · 数据标注」三方差异。游戏的核心乐趣在于三方不一致时——那才是值得思考的工单。

### 功能特性

- 随机抽取工单，每局体验不同
- 11 种意图分类（取消订单、申请退款、查询物流……）
- AI 实时调用 DeepSeek 大模型完成分类，并给出置信度与判断理由
- 逐题对比三方结论，高亮分歧
- 局末统计：三方一致率、你与 AI 一致率、你与标注一致率
- 支持 API 失败重试 / 跳过

### 技术架构

```
index.html
└── src/main.tsx              # React 应用挂载点
    └── src/App.tsx           # 游戏状态机（4 个阶段）
        ├── components/Intro.tsx        # 欢迎页
        ├── components/TicketRound.tsx  # 答题页
        ├── components/Verdict.tsx      # 单题结算页
        └── components/Summary.tsx      # 总结统计页
            └── src/lib/claudeClassify.ts  # DeepSeek API 调用层
                └── src/data/tickets.json  # 预标注工单数据集
```

#### 游戏状态流转

```
intro  →  playing (×10)  →  verdict  →  summary
                ↑_________________________↓ (再来一局)
```

| 状态 | 对应组件 | 说明 |
|------|----------|------|
| `intro` | `Intro` | 规则说明 + 开始按钮 |
| `playing` | `TicketRound` | 展示工单，玩家选择意图，同时异步调用 AI |
| `verdict` | `Verdict` | 三方对比，展示 AI 置信度与理由 |
| `summary` | `Summary` | 10 题汇总统计，可展开查看分歧工单 |

### 技术选型

| 层次 | 技术 | 理由 |
|------|------|------|
| UI 框架 | React 18 | 组件化 + Hooks 状态管理，无额外复杂度 |
| 语言 | TypeScript 5 | 类型安全，Game Phase / RoundResult 有明确类型约束 |
| 构建工具 | Vite 5 | 极速 HMR，`import.meta.env` 原生支持 `VITE_*` 环境变量 |
| 样式 | Tailwind CSS 3 | 实用类优先，配合自定义 `fade-in` 动画 |
| AI 推理 | DeepSeek `deepseek-chat` | 性价比高，OpenAI 兼容接口，JSON 模式稳定 |
| 数据 | 本地 JSON | 工单数据静态打包，无需后端 |

### 安全架构

API Key **不暴露给浏览器**。请求链路如下：

```
浏览器 (src/lib/claudeClassify.ts)
  └─ POST /api/classify          ← 同源请求，无 key
       └─ api/classify.ts        ← Vercel Serverless Function
            └─ DeepSeek API      ← key 只在服务端读取
```

`DEEPSEEK_API_KEY` 不带 `VITE_` 前缀，因此 Vite 不会将其打包进前端 JS，只有服务端运行时（Node.js）可以读取。

### 本地开发

**环境要求**：Node.js ≥ 18，Vercel CLI

```bash
# 1. 克隆仓库
git clone <repo-url>
cd post-agent-game

# 2. 安装依赖
npm install

# 3. 安装 Vercel CLI（全局，只需一次）
npm install -g vercel

# 4. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 5. 用 vercel dev 启动（同时运行 Vite + Serverless Functions）
vercel dev
```

访问 `http://localhost:3000` 即可游玩。

> 必须使用 `vercel dev` 而非 `npm run dev`，因为后者只启动 Vite，无法运行 `api/classify.ts` 服务端函数。

### 环境变量

| 变量名 | 必填 | 读取位置 | 说明 |
|--------|------|----------|------|
| `DEEPSEEK_API_KEY` | ✅ | 仅服务端 | DeepSeek API Key，从 [platform.deepseek.com](https://platform.deepseek.com) 获取 |

### 在线部署

推荐使用 **Vercel**，在项目 **Settings → Environment Variables** 中添加 `DEEPSEEK_API_KEY`（**不加** `VITE_` 前缀）。详细步骤见 [English 部分](#deployment)。

---

## English

### Overview

**Human Judge vs AI Judge** is a lightweight browser game built around intent classification of real e-commerce after-sales tickets. In each round, 10 tickets are randomly sampled from the dataset; you pick the customer's intent from 11 categories, and a DeepSeek LLM does the same in real time. The final screen shows where the three sources — you, AI, and the human-annotated ground truth — agree or diverge.

### Features

- Random ticket sampling — every round is different
- 11 intent categories (cancel order, request refund, track shipment, etc.)
- Real-time AI classification via DeepSeek with confidence score and reasoning
- Per-ticket three-way comparison with divergence highlighting
- End-of-round stats: triple-match rate, player–AI match, player–label match
- API error handling with retry / skip

### Architecture

```
index.html
└── src/main.tsx              # React app entry
    └── src/App.tsx           # Game state machine (4 phases)
        ├── components/Intro.tsx        # Welcome screen
        ├── components/TicketRound.tsx  # Classification screen
        ├── components/Verdict.tsx      # Per-ticket verdict
        └── components/Summary.tsx      # Round summary & stats
            └── src/lib/claudeClassify.ts  # DeepSeek API client
                └── src/data/tickets.json  # Pre-labeled ticket dataset
```

#### Game Phase Flow

```
intro  →  playing (×10)  →  verdict  →  summary
                ↑___________________________↓ (play again)
```

| Phase | Component | Description |
|-------|-----------|-------------|
| `intro` | `Intro` | Rules overview + start button |
| `playing` | `TicketRound` | Display ticket, player picks intent, AI called async |
| `verdict` | `Verdict` | Three-way comparison, AI confidence + reasoning |
| `summary` | `Summary` | 10-ticket stats, expandable divergence list |

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| UI framework | React 18 | Component model + Hooks — no extra state library needed |
| Language | TypeScript 5 | Strict types for game phases and round results |
| Build tool | Vite 5 | Instant HMR; native `import.meta.env` support for `VITE_*` variables |
| Styling | Tailwind CSS 3 | Utility-first; custom `fade-in` keyframe animation |
| AI inference | DeepSeek `deepseek-chat` | Cost-effective, OpenAI-compatible API, reliable JSON mode |
| Data | Static JSON | Ticket dataset bundled at build time — no backend required |

### Security Architecture

The API key is **never exposed to the browser**. The request chain is:

```
Browser (src/lib/claudeClassify.ts)
  └─ POST /api/classify          ← same-origin, no key in request
       └─ api/classify.ts        ← Vercel Serverless Function
            └─ DeepSeek API      ← key read only on the server
```

`DEEPSEEK_API_KEY` has no `VITE_` prefix, so Vite never bundles it into the frontend JS. It is only available to the server-side Node.js runtime.

### Local Development

**Requirements**: Node.js ≥ 18, Vercel CLI

```bash
# 1. Clone the repository
git clone <repo-url>
cd post-agent-game

# 2. Install dependencies
npm install

# 3. Install Vercel CLI (global, one-time)
npm install -g vercel

# 4. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your DeepSeek API key

# 5. Start with vercel dev (runs Vite + Serverless Functions together)
vercel dev
```

Open `http://localhost:3000` to play.

> You must use `vercel dev` instead of `npm run dev`. The plain Vite dev server cannot run `api/classify.ts`.

### Environment Variables

| Variable | Required | Read by | Description |
|----------|----------|---------|-------------|
| `DEEPSEEK_API_KEY` | ✅ | Server only | DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com) |

### Deployment

#### Recommended: Vercel

Vercel offers the simplest zero-config deployment for Vite SPAs.

**Step 1 — Import the project**

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your Git repository (GitHub / GitLab / Bitbucket)
3. Vercel auto-detects Vite; leave the default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

**Step 2 — Add environment variables**

In the project's **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `DEEPSEEK_API_KEY` | `sk-xxxxxxxxxxxxxxxx` |

Enable all three environments (Production / Preview / Development) so it works in preview deployments too. Do **not** add a `VITE_` prefix — that would expose the key in the browser bundle.

**Step 3 — Deploy**

Click **Deploy**. Vercel runs `npm run build`, uploads `dist/`, and gives you a `*.vercel.app` URL in about 30 seconds.

Every subsequent `git push` to the main branch triggers an automatic redeploy.

#### Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Set `DEEPSEEK_API_KEY` in **Site Configuration → Environment Variables** on the Netlify dashboard.

#### Alternative: Cloudflare Pages

1. Connect your Git repository in the Cloudflare Pages dashboard
2. Set build command: `npm run build`, output: `dist`
3. Add `DEEPSEEK_API_KEY` under **Settings → Environment Variables**

---

### Build Commands

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # TypeScript check + production build → dist/
npm run preview  # Preview the production build locally
```

### Project Structure

```
post-agent-game/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.local.example      # Template — copy to .env.local
├── src/
│   ├── main.tsx            # React root
│   ├── App.tsx             # Game state machine
│   ├── index.css           # Tailwind directives + global styles
│   ├── types.ts            # Shared TypeScript types
│   ├── components/
│   │   ├── Intro.tsx
│   │   ├── TicketRound.tsx
│   │   ├── Verdict.tsx
│   │   └── Summary.tsx
│   ├── lib/
│   │   └── claudeClassify.ts   # DeepSeek API client
│   └── data/
│       └── tickets.json        # Pre-labeled customer service tickets
└── .tracking/                  # Project planning docs (not shipped)
```

### License

MIT
