---
title: 'Hello World'
date: '2025-10-06'
excerpt: '用 Next.js + Tailwind 啟動開發環境與撰寫第一篇文章的快速入門。'
---

## TL;DR

- 啟動開發伺服器：`npm install && npm run dev`
- 新增文章：在 `_articles` 建立 Markdown，包含 YAML front matter
- 頁面會自動讀取並渲染內容（支援程式碼區塊與排版）

## 前置準備

- 已安裝 Node.js 18+、npm
- 專案已在本機 clone 完成並位於根目錄

## 啟動開發伺服器

```bash
npm install
npm run dev
```

預設會在 `http://localhost:3000` 提供熱更新開發體驗。修改內容後儲存，瀏覽器自動重新整理。

## 撰寫第一篇文章

在 `_articles` 新增一個檔案，例如：`getting-started.md`。建議檔名使用小寫與連字號（slug 化），方便路由生成與版本控制。

### Front Matter 範例

```md
---
title: '從 Hello World 開始'
date: '2025-10-06'
excerpt: '在本機啟動專案並建立第一篇文章。'
---

## 內容

這是我的第一篇文章！

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`)
}

greet('World')
```
```

重點：
- `title` 與 `date` 會作為列表顯示與排序依據。
- `excerpt` 會用在文章列表或 SEO 摘要。

## 常見問題（FAQ）

- 看不到新文章？
  - 確認檔案放在 `_articles` 並包含正確 front matter。
  - 重啟開發伺服器以重新載入檔案系統。
- 程式碼區塊沒有樣式？
  - 本專案已啟用 `@tailwindcss/typography`。請以三個反引號包住並指定語言，例如 ` ```ts`、` ```bash`。

## 小結

你已完成本機啟動與內容撰寫的最小流程。接著可前往其他文章，了解 Git/npm 工作流、部署與 PM2 常駐管理。
