# 個人部落格與作品集 - 產品需求文件 (PRD)

## 1. 專案簡介

本專案旨在建立一個個人部落格與作品集網站，風格參考 [GRENADE Blog](https://grenade.tw/blog/)，打造一個簡潔、載入快速、易於維護的平台。主要用於記錄程式學習筆記、分享技術文章、以及展示個人專案。

## 2. 目標使用者

- **主要使用者**：自己。需要一個簡單方便的流程來發布文章和管理內容。
- **次要使用者**：對技術、程式開發有興趣的讀者、潛在的雇主或合作夥伴。

## 3. 功能需求 (Functional Requirements)

### FR1: 部落格系統
- **文章列表頁 (首頁)**：
    - 以卡片或列表形式顯示所有文章。
    - 依照發布日期降序排列 (最新的在最上面)。
    - 每篇文章應顯示標題、發布日期和簡短的摘要。
- **文章內頁**：
    - 顯示完整的文章內容。
    - 支援 Markdown 語法，特別是程式碼區塊 (Code Block) 的語法高亮 (Syntax Highlighting)。
    - 頁面 URL 應為對 SEO 友善的 slug (例如: `/blog/how-to-build-a-blog`)。
- **內容管理**：
    - 能直接透過新增/修改 Markdown (`.md`) 檔案來建立或更新文章。
    - 每篇 Markdown 檔案應包含 `frontmatter` 區塊，用於定義標題 (title)、日期 (date)、摘要 (excerpt) 等元資料。

### FR2: 關於我 (About) 頁面
- 一個靜態頁面，用於自我介紹、放置聯繫方式或社群連結 (GitHub, LinkedIn 等)。

### FR3: 專案 (Projects) 頁面
- 一個靜態頁面，用於展示個人作品集。
- 每個專案應包含專案名稱、簡介、使用的技術、以及相關連結 (例如：GitHub 儲存庫、線上 Demo 網站)。

### FR4: 留言功能 (Guestbook/Comments)
- 參考 grenade.tw，可以建立一個全站的留言板 (Guestbook)。
- 或者在每篇文章下方整合留言系統。
- 推薦使用基於 GitHub Issues/Discussions 的服務，例如 [Giscus](https://giscus.app/zh-TW) 或 [utterances](https://utteranc.es/)，對開發者友善且無需自建後端。

### FR5: 網站導航
- 頁首 (Header) 應有清晰的導航列，至少包含「部落格」、「關於我」、「專案」等連結。
- 頁尾 (Footer) 可放置版權資訊及社群連結。

## 4. 非功能性需求 (Non-Functional Requirements)

- **NFR1: 效能**：網站載入速度要快。優先考慮使用靜態網站生成 (Static Site Generation, SSG) 技術。
- **NFR2: 設計**：整體風格簡潔、現代。注重排版與可讀性，提供舒適的閱讀體驗。可參考 grenade.tw 的深色主題 (Dark Mode)。
- **NFR3: 響應式設計 (RWD)**：在桌面、平板、手機等不同尺寸的裝置上都有良好的瀏覽體驗。
- **NFR4: 易於部署**：開發流程順暢，最好能透過 `git push` 就自動化部署到線上。

## 5. 建議技術棧 (Technology Stack)

- **框架 (Framework)**：[**Next.js**](https://nextjs.org/) 或 [**Astro**](https://astro.build/)。兩者都非常適合靜態網站生成，效能優異。Next.js 基於 React，生態系龐大；Astro 則對內容型網站有特別優化。
- **樣式 (Styling)**：[**Tailwind CSS**](https://tailwindcss.com/)。一個 Utility-First 的 CSS 框架，非常適合用來打造客製化且簡潔的設計。
- **內容處理**：
    - Markdown 檔案。
    - 使用 `gray-matter` 函式庫來解析 `frontmatter`。
    - 使用 `remark` 或 `react-markdown` 來將 Markdown 轉換為 HTML。
- **部署 (Deployment)**：[**Vercel**](https://vercel.com/) (與 Next.js 整合度最高) 或 [**Netlify**](https://www.netlify.com/) / [**GitHub Pages**](https://pages.github.com/)。

## 6. MVP (最小可行性產品) 規劃

1.  **初始化專案**：使用 Next.js 或 Astro 建立專案基本架構。
2.  **建立文章系統**：
    - 撰寫 1-2 篇範例 Markdown 文章。
    - 實作讀取 `.md` 檔案並在首頁列出文章標題的功能。
    - 實作點擊標題能連結到文章內頁並顯示完整內容的功能。
3.  **完成基本排版**：使用 Tailwind CSS 建立基本的導航列、頁尾，並調整文章頁的字體與間距。
4.  **部署上線**：將第一版部署到 Vercel 或 GitHub Pages，確保流程通順。

## 7. 未來規劃 (Future Enhancements)

- 文章標籤 (Tags) 或分類 (Categories) 功能。
- 站內搜尋功能。
- RSS Feed 訂閱功能。
- 亮色/深色模式切換。
