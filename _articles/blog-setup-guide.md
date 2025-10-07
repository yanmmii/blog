---
title: '從零開始建立極簡個人部落格'
date: '2025-10-06'
excerpt: 'Next.js + TypeScript + Tailwind 建站到 EC2 部署的實戰教程：初始化、內容系統、建置與常駐。'
---

## TL;DR

- 初始化：Next.js（App Router）+ TS + Tailwind
- 內容：以 Markdown（`_articles`, `_projects`）作為 Git-based CMS
- 建置啟動：`npm run build` → `npm run start`
- 部署：EC2 拉取程式碼、安裝依賴、用 PM2 常駐

## 前置準備

- Node.js 18+、npm
- GitHub 倉庫與本機開發環境
- 基礎 Linux/SSH 操作能力（部署階段）

## 建立專案骨架

可用 `create-next-app` 或手動建立；以下以標準初始化為例：

```bash
npx create-next-app@latest my-blog --ts --eslint --tailwind --app
cd my-blog
npm run dev
```

專案結構重點：
- `src/app`：App Router 頁面
- `src/components`：共享 UI
- `src/app/globals.css`：全域樣式（含 Tailwind）

## 加入內容系統（Markdown）

- 新增資料夾：`_articles`, `_projects`
- 每篇以 Markdown 撰寫，於檔頭使用 YAML front matter

```md
---
title: '文章標題'
date: '2025-10-06'
excerpt: '一句話說明內文。'
---

內文使用 Markdown，支援程式碼區塊與標題。
```

在伺服器端（或 build 時）讀取檔案，搭配 `gray-matter` 解析 front matter、`remark` 轉 HTML。頁面端用 `@tailwindcss/typography` 的 `prose` 提升排版。

### 讀取文章的概念範例

```ts
// 假設在 lib/articles.ts（簡化示意）
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const articlesDir = path.join(process.cwd(), '_articles')

export function listArticles() {
  return fs.readdirSync(articlesDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(articlesDir, file), 'utf8')
      const { data } = matter(raw)
      return { slug: file.replace(/\.md$/, ''), ...data }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
```

## 執行與建置

```bash
npm run dev    # 開發
npm run lint   # Lint 檢查
npm run build  # 產生生產版
npm run start  # 啟動生產伺服器（預設 3000）
```

## 部署到 AWS EC2

1. 連線與環境
   ```bash
   ssh ubuntu@YOUR_EC2_IP
   # 安裝 nvm + Node.js LTS（略）
   ```
2. 拉下程式碼與安裝依賴
   ```bash
   git clone https://github.com/you/my-blog.git
   cd my-blog
   npm install
   npm run build
   ```
3. 以 PM2 常駐（見〈PM2 簡介〉一文）
   ```bash
   npx pm2 start npm --name "my-blog" -- run start
   npx pm2 save
   ```

### 進階：開機自動啟動

```bash
npx pm2 startup
npx pm2 save
```

## 上線前檢查清單

- `npm run lint` 無錯誤
- 主要路由可開啟（`/`, `/articles/[slug]`, `/projects`）
- `.gitignore` 已忽略 `node_modules`, `.next`
- 安全性：未外洩憑證、未暴露敏感環境變數

## 小結

本文將從建置到部署的最小路徑串起來：建立專案骨架 → Markdown 內容系統 → 建置與部署 → PM2 常駐。照此流程可快速把個人部落格上線並逐步擴充。
