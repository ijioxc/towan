#!/bin/bash
# 把 table/ 打包成可上傳到正式站的 zip。
# 會自動排除正式站上「只能由後台編輯，不該被本機開發版覆蓋」的資料檔：
#   data/about.json, data/contact.json, data/settings.json, data/works.json
# 圖片（media/projects）目前跟建置來源同步，不在排除範圍內，
# 若正式站上有透過後台上傳的新圖片，上傳前請自行確認不會被覆蓋掉。
#
# 用法：kitchen/scripts/package-deploy.sh [輸出檔名.zip]
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TABLE="$ROOT/table"
OUT="${1:-$ROOT/table-deploy-$(date +%Y%m%d-%H%M%S).zip}"

if [ ! -d "$TABLE" ]; then
  echo "找不到 $TABLE，請先在 kitchen/ 執行 npm run build" >&2
  exit 1
fi

cd "$TABLE"
rm -f "$OUT"
zip -r -q "$OUT" . \
  -x "data/about.json" \
  -x "data/contact.json" \
  -x "data/settings.json" \
  -x "data/works.json"

echo "已打包：$OUT"
echo ""
echo "已排除 4 個正式站專屬資料檔（正式站上的版本才是最新，不能被覆蓋）："
echo "  data/about.json, data/contact.json, data/settings.json, data/works.json"
echo "若是全新環境第一次部署，這 4 個檔案要另外手動上傳一次。"
