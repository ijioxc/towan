import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace href="/"
    content = re.sub(r'href="/"', r'href={import.meta.env.BASE_URL}', content)
    
    # Replace href="/something" (excluding http/https)
    content = re.sub(r'href="/([^"]+)"', r'href={import.meta.env.BASE_URL + "\1"}', content)
    
    # Replace src="/something"
    content = re.sub(r'src="/([^"]+)"', r'src={import.meta.env.BASE_URL + "\1"}', content)
    
    # Replace navigate('/...')
    content = re.sub(r"navigate\('/'\)", r"navigate(import.meta.env.BASE_URL)", content)
    content = re.sub(r"navigate\('/([^']+)'\)", r"navigate(import.meta.env.BASE_URL + '\1')", content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.astro'):
            process_file(os.path.join(root, file))

# Also fix generate_desc.py or anywhere works/index.json is generated?
# index.json generates urls like `url: '/works/01'`
