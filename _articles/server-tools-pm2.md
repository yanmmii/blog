---
title: 'PM2 簡介'
date: '2025-10-06'
excerpt: '用 PM2 讓 Next.js 站台在伺服器上穩定常駐、重啟與開機自啟，並掌握日誌與監控。'
---

## TL;DR

- `npm run start` 依賴當前 SSH 連線；關閉會話即終止。
- PM2 讓應用在背景常駐、自動重啟、集中日誌與資源監控。
- 最小使用集：`pm2 start npm --name "my-blog" -- run start` → `pm2 save` → `pm2 logs`。

## 為什麼不能只用 `npm run start`？

`npm run start` 執行於當前 session；一旦 SSH 中斷或終端關閉，進程會被回收。需要以系統層守護程式管理背景服務，因此選擇 PM2。

## PM2 功能速覽

- 背景常駐與崩潰自啟
- 集中日誌（stdout/stderr）
- 監控 CPU/記憶體
- 重啟策略與零停機 reload（適合多進程/叢集）
- 開機自動啟動設定

## 安裝

```bash
npm install -g pm2
# 或專案內：npx pm2 <command>
```

## 在 EC2 啟動 Next.js 生產站台

```bash
# 於專案根目錄，先建置
npm run build

# 以 npm script 方式由 PM2 管理（推薦）
pm2 start npm --name "my-blog" -- run start

# 儲存目前進程清單（重開機後可還原）
pm2 save
```

### 更新版本（部署後）

```bash
git pull
npm install
npm run build
pm2 restart my-blog
```

### 檢視與除錯

```bash
pm2 list          # 查看所有進程
pm2 logs my-blog  # 追蹤指定服務日誌
pm2 monit         # 即時監控儀表板
```

### 開機自動啟動

```bash
pm2 startup
pm2 save
```

### 叢集與零停機（進階）

若以 Node 伺服器模式運行（非 Next.js 靜態），可使用叢集模式：

```bash
pm2 start server.js -i max --name my-api
# 或 ecosystem.config.js 定義多服務，便於統一管理
```

## 常見問題

- 重啟後設定消失？
  - 忘記 `pm2 save`。請在設定妥當後執行一次。
- 連線卻看不到站台？
  - 檢查 `npm run start` 監聽的主機與埠、EC2 安全群組與防火牆規則。
- 日誌過大？
  - 設定日誌輪替（`pm2 install pm2-logrotate`）。

## 小結

PM2 是把 Next.js 應用帶到生產環境的關鍵工具：它讓服務穩定、可觀測並易於維運。把握「啟動 → 儲存 → 日誌 → 自啟」這條最小路徑即可上手。
