---
title: '我的開發工作流：Git 與 npm 核心觀念'
date: '2025-10-06'
excerpt: '用最少概念掌握 Git 與 npm：從 commit 與分支到 scripts 與鎖版，涵蓋常見錯誤與實用清單。'
---

## TL;DR

- Git 管版本、npm 管依賴；兩者是日常開發與部署的基礎。
- `.gitignore` 務必忽略 `node_modules`；使用 `package-lock.json` 鎖定套件版本。
- 最常用流：`git switch -c` 分支 → `add/commit` → `push/PR`。

## Git：不僅是備份，更是時光機

Git 以「快照（commit）」記錄專案狀態，可安全嘗試、快速回滾，並友善協作。

### 推薦工作流（個人/小組適用）

```bash
# 初始化（若尚未是 Git 倉庫）
git init

# 建立功能分支
git switch -c feat/setup-lint

# 開發與暫存變更
git add .
git commit -m "Feat: add ESLint and basic rules"

# 推送並建立 PR
git push -u origin feat/setup-lint
```

重點：
- 每次提交（commit）只做一件事，訊息使用祈使句與型別（Feat/Fix/Docs）。
- 以分支隔離開發，PR 審查後合併到主分支。

### `.gitignore` 要點

```gitignore
node_modules/
.next/
.DS_Store
```

- `node_modules` 由 `npm install` 產生，請勿追蹤。
- 建置輸出（如 `.next`）與 OS 檔案亦應忽略。

### 常見錯誤

- 誤把 `node_modules` 推上去 → 先加入 `.gitignore`，再移除追蹤：
  ```bash
  git rm -r --cached node_modules
  git commit -m "Fix: remove node_modules from repo"
  ```

## npm：依賴與腳本的管家

`npm` 管理專案所需套件與指令腳本。

### `package.json` 核心欄位

- `dependencies`: 執行期需要，例如 `next`, `react`。
- `devDependencies`: 只在開發/建置使用，例如 `typescript`, `tailwindcss`。
- `scripts`: 常用任務入口，例如 `dev`, `build`, `start`, `lint`。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### `node_modules` 與 `package-lock.json`

- `node_modules`: 實際安裝的套件檔案，體積大、不入版控。
- `package-lock.json`: 鎖定每個套件精準版本，確保所有環境一致性（務必納入版控）。

### 常用指令速覽

```bash
npm install           # 依 package.json 安裝依賴
npm run dev          # 本機啟動開發伺服器
npm run build        # 產生生產版
npm run start        # 啟動生產版伺服器
npm run lint         # 執行 ESLint
```

## 工作日常手冊（Cheat Sheet）

- 新任務：`git switch -c feat/...`
- 開發 → `git add -p` 精準加入改動 → `git commit`
- 推送：`git push -u origin 分支` → 建立 PR → 合併
- 同步：`git pull --rebase`（保持簡潔歷史）

## 小結

理解 Git 的版本節點與 npm 的鎖版規則，可顯著降低「壞環境」與「壞提交」造成的風險。把握上述最小流程，日常開發就穩了。
