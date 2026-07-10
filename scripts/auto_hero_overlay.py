#!/usr/bin/env python3
"""依檔名規律自動指派作品內頁的「主視覺底圖」與「文字疊圖」。

規則(僅在尚未設定時才動,不覆蓋既有的 hero_overlay):
- 底圖:inner_images 中檔名含 "back" 的第一張 → 移到 inner_images[0](主視覺)
- 疊圖:檔名含 "logo"/"title" 的第一張 → 設為 hero_overlay,並從 inner_images 移除
        (否則 logo 會在內頁下方變成一張獨立大圖),hero_overlay_w 給預設 45
- 兩者皆無的作品:完全不動

安全:先備份 works.json;既有 hero_overlay 不覆蓋;inner_dims 保留不動。
"""
import json
import re
import shutil
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORKS = ROOT / "public" / "data" / "works.json"
BACK = re.compile(r"back", re.I)
LOGO = re.compile(r"logo|title", re.I)
DEFAULT_OVERLAY_W = 45

data = json.loads(WORKS.read_text(encoding="utf-8"))

# 備份
stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
bak = WORKS.with_name(f"works.json.bak-autohero-{stamp}")
shutil.copy(WORKS, bak)

set_hero = 0
set_overlay = 0
skipped_overlay_exists = 0
ambiguous = []
untouched = 0

for w in data:
    imgs = list(w.get("inner_images") or [])
    if not imgs:
        untouched += 1
        continue
    changed = False

    # --- 底圖 → inner_images[0] ---
    backs = [i for i in imgs if BACK.search(i)]
    if backs and imgs[0] != backs[0]:
        b = backs[0]
        imgs.remove(b)
        imgs.insert(0, b)
        set_hero += 1
        changed = True

    # --- 疊圖 → hero_overlay(不覆蓋既有) ---
    if w.get("hero_overlay"):
        skipped_overlay_exists += 1
    else:
        logos = [i for i in imgs if LOGO.search(i)]
        if len(logos) > 1:
            ambiguous.append((w.get("id"), logos))
        if logos:
            lg = logos[0]
            imgs.remove(lg)
            w["hero_overlay"] = lg
            w.setdefault("hero_overlay_w", DEFAULT_OVERLAY_W)
            if not w.get("hero_overlay_w"):
                w["hero_overlay_w"] = DEFAULT_OVERLAY_W
            set_overlay += 1
            changed = True

    if changed:
        w["inner_images"] = imgs
    else:
        untouched += 1

WORKS.write_text(
    json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

print(f"備份: {bak.name}")
print(f"設定主視覺底圖(移到首位): {set_hero} 筆")
print(f"設定文字疊圖: {set_overlay} 筆")
print(f"疊圖已存在、略過: {skipped_overlay_exists} 筆")
print(f"未動: {untouched} 筆")
if ambiguous:
    print(f"多個 logo 候選(取第一個,可到後台調整): {ambiguous}")
