#!/usr/bin/env python3
"""回填 works.json 的 inner_dims（檔名 -> [寬, 高]）。

圖檔來源優先順序：
1. public/media/work/<inner_folder>/（若存在）
2. 舊站備份 【3】舊版網站與過渡備份 (Old Backups)/image/work/<inner_folder>/

找不到的圖會列出但不影響其他筆；已有 inner_dims 的檔名不重算。
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
WORKS_JSON = ROOT / "public" / "data" / "works.json"
SOURCES = [
    ROOT / "public" / "media" / "work",
    ROOT.parent / "【3】舊版網站與過渡備份 (Old Backups)" / "image" / "work",
]


def find_file(folder: str, name: str) -> Path | None:
    for src in SOURCES:
        p = src / folder / name
        if p.is_file():
            return p
    return None


def main() -> None:
    works = json.loads(WORKS_JSON.read_text(encoding="utf-8"))
    filled = 0
    missing: list[str] = []

    for w in works:
        folder = w.get("inner_folder") or ""
        files = list(w.get("inner_images") or [])
        if w.get("hero_overlay"):
            files.append(w["hero_overlay"])
        if not folder or not files:
            continue
        dims = dict(w.get("inner_dims") or {})
        for f in files:
            if f in dims:
                continue
            path = find_file(folder, f)
            if not path:
                missing.append(f"{w.get('id')}: {folder}/{f}")
                continue
            try:
                with Image.open(path) as im:
                    dims[f] = [im.width, im.height]
                    filled += 1
            except Exception as e:  # 壞檔跳過
                missing.append(f"{w.get('id')}: {folder}/{f} ({e})")
        if dims:
            w["inner_dims"] = dims

    WORKS_JSON.write_text(
        json.dumps(works, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"補上 {filled} 張圖的尺寸")
    if missing:
        print(f"找不到 {len(missing)} 張：")
        for m in missing:
            print("  -", m)
        sys.exit(0)


if __name__ == "__main__":
    main()
