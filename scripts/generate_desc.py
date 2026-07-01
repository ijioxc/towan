import json
import random

with open('src/pages/works/index.json', 'r') as f:
    projects = json.load(f)

templates = [
    "This project, {title}, showcases our comprehensive approach to {category}. We focused on highlighting the core brand values through impactful visual storytelling and precise execution, ensuring a seamless user experience.",
    "For {title}, we developed a bespoke {category} strategy that elevates the brand's presence. Every detail in this project was crafted to resonate with the target audience while maintaining a clean, modern aesthetic.",
    "Exploring new boundaries in {category}, our work on {title} integrates innovative design principles. The visual language was carefully curated to reflect both elegance and dynamic energy.",
    "The {title} project is a prime example of our dedication to high-quality {category}. By blending creative vision with technical precision, we delivered a solution that stands out in its field.",
    "With {title}, our goal was to redefine what {category} could look like. The resulting design emphasizes clarity, engaging visuals, and a strong foundational narrative that drives impact."
]

for p in projects:
    if not p.get('description'):
        t = p.get('title', 'this project')
        c = p.get('category', 'design')
        desc = random.choice(templates).format(title=t, category=c)
        p['description'] = desc

with open('src/pages/works/index.json', 'w') as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

print("Added descriptions to projects.")
