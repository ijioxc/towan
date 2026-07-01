import json
import re
from bs4 import BeautifulSoup

with open('/Users/ijioxc/.gemini/antigravity-ide/brain/f5d53d23-792f-45e7-be52-4e697684405b/.system_generated/steps/593/content.md', 'r') as f:
    html = f.read()

start_idx = html.find('id="bp_infinity"')
end_idx = html.find('id="bp_800"')
bp_html = html[start_idx:end_idx] if start_idx != -1 and end_idx != -1 else html

soup = BeautifulSoup(bp_html, 'html.parser')

# In Muse, the img_frame and txt_frame are often siblings inside a "clearfix colelem" or "clearfix grpelem" group.
# Let's find all text frames and image frames, and group them by their closest shared parent.
# Or better, just iterate over all groups!

projects = []

for group in soup.find_all('div', id=re.compile(r'^p?u\d+$')):
    # Find image link in this group
    link = group.find('a', class_=lambda c: c and 'clip_frame' in c)
    if not link:
        continue
    img = link.find('img')
    if not img:
        continue
        
    src = img.get('data-orig-src') or img.get('src')
    if src and src.startswith('images/blank.gif'):
        src = img.get('data-orig-src')
        
    if not src:
        continue
        
    src = src.split('?')[0]
    href = link.get('href')
    
    # Find text frame in this group
    txt = group.find('div', attrs={'data-muse-type': 'txt_frame'})
    if not txt:
        # try class
        txt = group.find('div', class_=lambda c: c and 'txt_frame' in c)
        
    if not txt:
        continue
        
    ps = [p.get_text(strip=True) for p in txt.find_all('p') if p.get_text(strip=True)]
    
    if len(ps) >= 2:
        category = ps[0]
        title = ps[1]
    elif len(ps) == 1:
        category = ""
        title = ps[0]
    else:
        continue
        
    projects.append({
        "title": title,
        "category": category,
        "image": "https://towan.com.tw/" + src,
        "link": "https://towan.com.tw/" + href
    })

# Deduplicate
seen = set()
unique_projects = []
for p in projects:
    if p['title'] not in seen:
        seen.add(p['title'])
        unique_projects.append(p)

print(f"Extracted {len(unique_projects)} unique projects")

with open('extracted_projects.json', 'w') as f:
    json.dump(unique_projects, f, indent=2, ensure_ascii=False)
