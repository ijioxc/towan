#!/usr/bin/env python3
"""從舊網站 (towan.com.tw) 的作品頁抓取固定樣式的標題區資料：
   大標題（EN）、中文副標、設計項目列（EN / 中文），寫回 works.json。
   用法：python3 scripts/fetch_old_meta.py [--dry-run]
"""
import json, re, html, sys, time, urllib.request

DATA = 'public/data/works.json'
DRY = '--dry-run' in sys.argv

def page_lines(url: str) -> list[str]:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    s = urllib.request.urlopen(req, timeout=20).read().decode('utf-8', 'replace')
    body = s[s.find('<body'):]
    body = re.sub(r'<(script|style).*?</\1>', '', body, flags=re.S)
    text = re.sub(r'<[^>]+>', '\n', body)
    lines = [html.unescape(l).replace('\xa0', ' ').strip() for l in text.split('\n')]
    return [l for l in lines if l]

def extract(lines: list[str]) -> tuple[str, str, list[str]]:
    """回傳 (title, subtitle, services)。頁面結構：標題、中文副標、設計項目…直到 About/導覽。"""
    stop_words = {'About', 'Contact', 'Works', 'ABOUT', 'CONTACT', 'WORKS', '← DISCOVER  MORE', '← DISCOVER MORE'}
    head = []
    for l in lines:
        if l in stop_words or l.startswith('©'):
            break
        head.append(l)
    if not head:
        return '', '', []
    title = head[0]
    rest = head[1:]
    subtitle = ''
    if rest and '/' not in rest[0]:
        subtitle = rest[0]
        rest = rest[1:]
    services = [l for l in rest if '/' in l and len(l) < 60]
    return title, subtitle, services

def main():
    works = json.load(open(DATA, encoding='utf-8'))
    updated, failed = 0, []
    for w in works:
        url = w.get('link', '')
        if not url.startswith('http'):
            continue
        try:
            title, subtitle, services = extract(page_lines(url))
            if not title:
                failed.append((w['id'], url, '解析不到標題'))
                continue
            print(f"#{w['id']:>3} {title!r} | 副標: {subtitle!r} | 項目: {services}")
            if not DRY:
                if subtitle and not w.get('subtitle'):
                    w['subtitle'] = subtitle
                if services and not w.get('services'):
                    w['services'] = services
            updated += 1
        except Exception as e:
            failed.append((w['id'], url, str(e)))
        time.sleep(0.2)
    if not DRY:
        json.dump(works, open(DATA, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
        print(f'\n已寫入 {DATA}')
    print(f'成功 {updated} 筆；失敗 {len(failed)} 筆')
    for f in failed:
        print('  失敗:', *f)

if __name__ == '__main__':
    main()
