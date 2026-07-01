import json
import os
import re

with open('extracted_projects.json', 'r') as f:
    extracted = json.load(f)

works_dir = 'public/media/works'
work_dir = 'public/media/work'

# Get all works files
works_files = {f.lower(): f for f in os.listdir(works_dir) if f.endswith('.jpg') or f.endswith('.png')}

# Get all work dirs
work_dirs = {d.lower().replace(' ', '').replace(',', ''): d for d in os.listdir(work_dir) if os.path.isdir(os.path.join(work_dir, d))}

new_index = []

for idx, p in enumerate(extracted):
    # 1. Match cover image
    img_url = p['image']
    # e.g. p116-crop-u501118.jpg -> p116
    match = re.search(r'(p\d+)-crop', img_url.lower())
    if match:
        p_name = match.group(1) + '.jpg'
    else:
        # fallback, just take the first part
        p_name = img_url.split('/')[-1].split('-')[0].lower() + '.jpg'
        
    cover_image = None
    if p_name in works_files:
        cover_image = f"/media/works/{works_files[p_name]}"
    else:
        # try matching without .jpg
        p_base = p_name.replace('.jpg', '')
        for wf in works_files:
            if wf.startswith(p_base):
                cover_image = f"/media/works/{works_files[wf]}"
                break
                
    if not cover_image:
        print(f"Warning: Cover image not found for {p['title']} ({img_url})")
        # fallback to the original cropped one if needed, but the user wants local
        cover_image = p['image'] # this might break if they delete original, but let's hope it matches

    # 2. Match inner page folder
    link = p['link']
    # e.g. daycare113.html -> daycare113
    link_base = link.split('/')[-1].replace('.html', '').lower().replace('%2c', '').replace('-', '')
    
    inner_folder = None
    # exact match?
    if link_base in work_dirs:
        inner_folder = work_dirs[link_base]
    else:
        # Try to find a folder that is a substring or vice versa
        for wd_lower, wd_real in work_dirs.items():
            if wd_lower in link_base or link_base in wd_lower:
                inner_folder = wd_real
                break
                
    # If still not found, try to match by title
    title_lower = p['title'].lower().replace(' ', '').replace(',', '')
    if not inner_folder:
        for wd_lower, wd_real in work_dirs.items():
            if wd_lower in title_lower or title_lower in wd_lower:
                inner_folder = wd_real
                break
                
    inner_images = []
    if inner_folder:
        folder_path = os.path.join(work_dir, inner_folder)
        images = [img for img in os.listdir(folder_path) if img.lower().endswith(('.jpg', '.png'))]
        images.sort() # sort alphabetically
        inner_images = images
    else:
        print(f"Warning: Inner folder not found for {p['title']} ({link})")
        
    project_id = str(idx + 1)
    
    new_index.append({
        "id": project_id,
        "title": p['title'],
        "category": p['category'],
        "image": cover_image,
        "link": link,
        "inner_folder": inner_folder,
        "inner_images": inner_images
    })
    
# Write to src/pages/works/index.json
with open('src/pages/works/index.json', 'w') as f:
    json.dump(new_index, f, indent=2, ensure_ascii=False)
    
print(f"Successfully processed {len(new_index)} projects.")
