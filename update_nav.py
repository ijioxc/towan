import os

files = [
    'src/pages/index.astro',
    'src/pages/works/index.astro',
    'src/pages/about.astro',
    'src/pages/contact.astro',
    'src/layouts/Base.astro'
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Change nav text size
    content = content.replace('text-xs tracking-widest', 'text-[10px] sm:text-xs tracking-widest')
    
    # Change margins
    content = content.replace('mr-3 md:mr-7', 'mr-2 sm:mr-4 md:mr-7')
    content = content.replace('mr-2 md:mr-4', 'mr-1 sm:mr-2 md:mr-4')
    
    with open(f, 'w') as file:
        file.write(content)

print("Updated nav responsive classes")
