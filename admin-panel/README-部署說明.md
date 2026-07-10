# TOWAN 作品管理頁 — 部署說明

這個資料夾是網站的「作品管理頁」：網站持有者用瀏覽器打開秘密網址，
就能新增／編輯／刪除作品、上傳照片、調整順序，存檔即生效，不需要重新 build。

只能跑在支援 PHP 的主機（towan.com.tw 的 Apache 主機可以），GitHub Pages 上不會作用。

## 部署前要改的兩件事

1. **通關密語**：密語存在 `_private/passphrase.txt`，這個檔案不進版控。
   第一次執行 `index.php` 會自動產生一組隨機密語；部署後打開這個檔案
   （在主機上，不是本機的 git 檔案）改成自己好記的密語。
   千萬不要把密語寫回 `index.php` 或其他會 commit 的檔案。
2. **秘密路徑**：上傳時把整個資料夾改名成你要的秘密字，
   例如改成 `studio-x7k2`，管理頁網址就是 `https://towan.com.tw/studio-x7k2/`。
   不要用 `admin`、`manage` 這種猜得到的名字。

## 上傳到正式主機的步驟（搬家日）

base 已固定為 `'/'`，不需要再改任何設定。第一次部署用
`【4】上傳包 (Upload)/towan-new-site.zip`（裡面已含 dist、data、19 個新作品的
media、後台資料夾），上傳到目標資料夾解壓縮即可；作品內頁大圖
（`media/work/` 的 96 個舊資料夾）在主機端從 `/preview/media/work/` 複製過來，
不用重新上傳。

**之後更新程式碼**：只上傳 `dist/` 的內容，但**不要覆蓋主機上的
`data/works.json` 和 `media/`** —— 那是後台正在管理的正式資料，
本機這份只是開發用樣本。

4. 用瀏覽器開 `https://towan.com.tw/<秘密字>/`，輸入密語，
   確認：作品列表有出現 → 隨便改一筆再改回來 → 前台網站有跟著變。

完成後主機上的結構長這樣：

```
網站根目錄/
├── index.html …（dist 的內容）
├── .htaccess            ← 讓新作品網址 /works/<id> 正常運作
├── data/works.json      ← 作品資料（管理頁改的就是這份）
├── media/works/         ← 封面圖
├── media/work/<資料夾>/  ← 各作品內頁照片
└── <秘密字>/            ← 本資料夾
    ├── index.php
    ├── .htaccess
    └── _private/        ← 金鑰與自動備份（外部讀不到，自動產生）
```

## 主機權限

PHP 需要能寫入 `data/`、`media/`、`<秘密字>/_private/`。
一般虛擬主機用 FTP 上傳的檔案預設就可以；如果儲存時出現「寫入失敗」，
把這三個資料夾權限設成 755（資料夾）／644（檔案），擁有者為執行 PHP 的帳號。

## 資料流（給之後維護的人）

- 前台的作品牆與作品內頁讀 `data/works.json`。
- 新增的作品沒有預先建好的靜態頁，根目錄 `.htaccess` 會把
  `/works/<id>` 導到 `works/view/index.html?id=<id>`（執行期渲染）。
- 每次儲存前自動備份到 `_private/backups/`，保留最近 20 份，管理頁上可一鍵還原。
- 刪除作品只從清單移除，照片檔案保留在主機上（安全考量，避免誤刪）。

## 本機測試

```bash
cd astro-web
bash admin-panel/dev-server.sh   # 啟動 http://127.0.0.1:8931（模擬正式主機結構）
```

測試環境用的是複製出來的資料（`scratch/admin-test/`），怎麼改都不會動到真正的網站資料。

## 監測建議

到 https://uptimerobot.com 註冊免費帳號，新增一個 HTTP(s) 監測指向
`https://towan.com.tw/`，網站掛掉時會寄 email 通知。
