---
title: '從零開始打造現代化個人部落格：我的實戰全紀錄'
date: '2025-10-06'
excerpt: '本文詳細記錄了如何使用 Next.js, TypeScript, Tailwind CSS 從頭建立一個功能完整的個人部落格，並將其部署到 AWS EC2 雲端主機的全過程。'
---

## 前言

一直想擁有一個完全屬於自己、能夠自由揮灑的空間來記錄學習與專案。在研究了多種方案後，我最終選擇了目前最前沿的技術棧來打造這個部落格。這不僅是一個網站，更是我對現代 Web 開發技術的一次深度實踐。

## Phase 1: 技術選型與專案初始化

我們的目標是建立一個快速、現代化且易於維護的網站。因此，我選擇了以下技術組合：

- **框架**: [Next.js](https://nextjs.org/) (使用 App Router)
- **語言**: [TypeScript](https://www.typescriptlang.org/)
- **樣式**: [Tailwind CSS](https://tailwindcss.com/)

這個組合是目前的業界標竿。我們透過 `npx create-next-app@latest` 指令開始，雖然中途因為環境問題手動建立了 `package.json` 和設定檔，但這也讓我們更深入地理解了 Next.js 專案的底層結構。

## Phase 2: 內容管理架構

對於個人部落格，最優雅的內容管理方式莫過於 "Git-based CMS"，也就是直接使用 Markdown 檔案來撰寫文章。

- 我們建立了 `_notes` 和 `_projects` 資料夾來存放內容。
- 使用 `gray-matter` 套件來解析每個 Markdown 檔案頭部的 `frontmatter` (元資料，如標題和日期)。
- 使用 `remark` 和 `remark-html` 將 Markdown 內文轉換為 HTML，以便在頁面上顯示。

這個作法的最大好處是：**高效、免費、安全，且所有內容都受到 Git 的版本控制。**

## Phase 3: 前端頁面實作

我們使用 React 元件來建構網站的各個部分：

1.  **主頁面 (`/`)**: 一個靜態的歡迎頁面。
2.  **筆記頁面 (`/notes`)**: 透過 Node.js 的 `fs` 模組讀取 `_notes` 資料夾中的所有檔案，動態生成文章列表。
3.  **專案頁面 (`/projects`)**: 與筆記頁面同理，讀取 `_projects` 資料夾來展示作品集。
4.  **文章內頁 (`/notes/[slug]`)**: 一個動態路由頁面。它根據 URL 中的 `slug` 找到對應的 Markdown 檔案，並將其內容渲染出來。我們還使用了 `@tailwindcss/typography` 的 `prose` 樣式，輕鬆地讓文章排版變得美觀。

## Phase 4: 部署到 AWS EC2

這是從開發到上線的最後一哩路。

1.  **版本控制**: 我們將所有程式碼（除了 `node_modules`）推送到 GitHub 倉庫。
2.  **伺服器設定**: 在 EC2 (Ubuntu) 上安裝了 `nvm` 和 `Node.js`。
3.  **建置與執行**: 我們在 EC2 上 `git pull` 最新的程式碼，執行 `npm install` 安裝依賴，然後用 `npm run build` 建立生產版本。
4.  **持續運行**: 最後，使用 `pm2` 來啟動我們的 Next.js 應用，確保它能在背景持續運行，並在伺服器重啟後自動恢復。

## 結論

從一個想法到一個真正上線的網站，這個過程涵蓋了現代 Web 開發的全流程。雖然途中遇到了一些挑戰（例如 Git 的大檔案問題和本地與伺服器環境的差異），但解決這些問題的過程正是學習的精髓所在。

希望這份紀錄對同樣想建立自己網站的你有所幫助！
