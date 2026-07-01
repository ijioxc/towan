import json
import os
import urllib.request
import time

# Create backup of current index.json
if os.path.exists('src/pages/works/index.json'):
    os.rename('src/pages/works/index.json', 'src/pages/works/index.json.bak')

with open('extracted_projects.json', 'r') as f:
    projects = json.load(f)

# Ensure images directory exists
os.makedirs('public/images/original', exist_ok=True)

new_projects = []

for idx, p in enumerate(projects):
    img_url = p['image']
    filename = img_url.split('/')[-1]
    local_path = f"public/images/original/{filename}"
    
    # Download image if not exists
    if not os.path.exists(local_path):
        try:
            print(f"Downloading {img_url} ...")
            req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(local_path, 'wb') as out_file:
                out_file.write(response.read())
            time.sleep(0.1) # small delay to be polite
        except Exception as e:
            print(f"Failed to download {img_url}: {e}")
            
    # Modify data to point to local image
    new_projects.append({
        "id": str(idx + 1),
        "title": p['title'],
        "category": p['category'],
        "image": f"/images/original/{filename}",
        "link": p['link']
    })

# Write the new index.json
with open('src/pages/works/index.json', 'w') as f:
    json.dump(new_projects, f, indent=2, ensure_ascii=False)

print(f"Successfully processed {len(new_projects)} projects.")
