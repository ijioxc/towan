#!/usr/bin/env python3
import json
import os
import shutil
import re
from pathlib import Path

# Paths
ROOT = Path('/Users/ijioxc/Downloads/towan')
ASTRO_DIR = ROOT / '【2】新網站程式碼 (astro-web)'
PREVIEW_DIR = ROOT / 'preview'

WORKS_JSON_PATHS = [
    PREVIEW_DIR / 'data' / 'works.json',
    ASTRO_DIR / 'public' / 'data' / 'works.json',
    ASTRO_DIR / 'data' / 'works.json'
]

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def get_ext(path):
    _, ext = os.path.splitext(path)
    return ext

def main():
    # Find the main works.json
    main_json = WORKS_JSON_PATHS[0]
    if not main_json.exists():
        print(f"Error: {main_json} not found.")
        return

    with open(main_json, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Patterns for auto-assigning hero banners
    BG_PATTERN = re.compile(r'(hero_bg|banner|back|bg)\.(jpg|jpeg|png|webp)$', re.I)
    OVERLAY_PATTERN = re.compile(r'(hero_overlay|logo|title|text)\.(svg|png)$', re.I)

    projects_dir = PREVIEW_DIR / 'media' / 'projects'
    projects_dir.mkdir(parents=True, exist_ok=True)

    updated_count = 0

    for w in data:
        print(f"Processing #{w.get('id')} - {w.get('title')}")
        
        # 1. Ensure inner_folder exists
        if not w.get('inner_folder'):
            title = w.get('title', '')
            w['inner_folder'] = f"{w['id']}-{slugify(title)}"
        
        inner_folder = w['inner_folder']
        target_dir = projects_dir / inner_folder
        target_dir.mkdir(parents=True, exist_ok=True)

        new_cover_name = "cover.jpg" # fallback

        # 2. Move cover image
        old_cover_rel = w.get('image', '').lstrip('/')
        if old_cover_rel:
            old_cover_path = PREVIEW_DIR / old_cover_rel
            if not old_cover_path.exists():
                old_cover_path = ASTRO_DIR / 'public' / old_cover_rel
            
            if old_cover_path.exists():
                ext = get_ext(old_cover_path.name)
                new_cover_name = f"cover{ext}"
                new_cover_path = target_dir / new_cover_name
                try:
                    shutil.copy2(old_cover_path, new_cover_path)
                    w['image'] = f"/media/projects/{inner_folder}/{new_cover_name}"
                except Exception as e:
                    print(f"  Warning: Failed to copy cover {old_cover_path} -> {e}")
            else:
                print(f"  Warning: Cover not found: {old_cover_path}")

        # 3. Move inner images from old work folder
        old_inner_dir = PREVIEW_DIR / 'media' / 'work' / inner_folder
        if old_inner_dir.exists() and old_inner_dir.is_dir():
            for item in old_inner_dir.iterdir():
                if item.is_file():
                    try:
                        shutil.copy2(item, target_dir / item.name)
                    except Exception as e:
                        print(f"  Warning: Failed to copy inner image {item} -> {e}")

        # 4. Auto-detect banners in target_dir
        if target_dir.exists():
            files_in_target = [f.name for f in target_dir.iterdir() if f.is_file()]
            
            hero_bg = None
            hero_overlay = None
            inner_images = []

            # Identify bg and overlay
            for f in files_in_target:
                if f.startswith('cover.'):
                    continue
                if not hero_bg and BG_PATTERN.search(f):
                    hero_bg = f
                elif not hero_overlay and OVERLAY_PATTERN.search(f):
                    hero_overlay = f

            # Assign and filter inner_images
            for f in files_in_target:
                # Don't add covers or hero images to inner_images
                if f.startswith('cover.'):
                    continue
                if f == hero_bg or f == hero_overlay:
                    continue
                inner_images.append(f)

            # Update json
            if hero_bg:
                w['hero_bg'] = hero_bg
            elif 'hero_bg' in w:
                del w['hero_bg']

            if hero_overlay:
                w['hero_overlay'] = hero_overlay
                w['hero_overlay_w'] = w.get('hero_overlay_w', 45) # Keep existing or default
            elif 'hero_overlay' in w:
                del w['hero_overlay']

            # Only update inner images if they exist or we found new ones
            if inner_images or w.get('inner_images'):
                # Sort inner images alphabetically to maintain order
                inner_images.sort()
                
                # Check for youtube/vimeo links in old inner_images to keep them
                old_inners = w.get('inner_images', [])
                video_links = [x for x in old_inners if x.startswith('youtube:') or x.startswith('vimeo:')]
                
                w['inner_images'] = video_links + inner_images

        updated_count += 1

    # Save to all possible locations
    for p in WORKS_JSON_PATHS:
        if p.parent.exists():
            with open(p, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Saved {p}")

    print(f"Finished updating {updated_count} projects!")

if __name__ == '__main__':
    main()
