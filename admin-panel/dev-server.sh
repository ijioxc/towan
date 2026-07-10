#!/bin/bash
# 建立一個模擬正式主機結構的測試環境，並啟動本機 PHP 伺服器。
# 測試資料是複製品，不會動到 public/ 裡真正的網站資料。
# 埠號可用 PORT 環境變數覆寫（預設 8931），方便多個開發環境並存。
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEST="$ROOT/scratch/admin-test"
PORT="${PORT:-8931}"

mkdir -p "$TEST/data" "$TEST/media/projects" "$TEST/secret-admin" "$TEST/images"
cp "$ROOT/admin-panel/index.php" "$TEST/secret-admin/index.php"
for f in works.json about.json contact.json settings.json; do
  if [ ! -f "$TEST/data/$f" ]; then
    cp "$ROOT/public/data/$f" "$TEST/data/$f"
  fi
done
cp -n "$ROOT/public/images/"towanlogo-*.png "$TEST/images/" 2>/dev/null || true

echo "管理頁測試網址： http://127.0.0.1:$PORT/secret-admin/"
echo "（密語為 index.php 裡的 PASSPHRASE 設定值）"
exec php -S "127.0.0.1:$PORT" -t "$TEST"
