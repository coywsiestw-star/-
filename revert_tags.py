import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract the filter groups from the global drawer
match_filters = re.search(r'(<div class="filter-panel glass-card">.*?</div>\s*</div>)', html, flags=re.DOTALL)
if match_filters:
    filter_html = match_filters.group(1)
else:
    print("Could not find filter html in global drawer")
    filter_html = ""

# 2. Remove the global drawer completely
html = re.sub(r'<!-- Global Profile Drawer -->.*?</div>\s*</div>\s*</div>', '', html, flags=re.DOTALL)

# 3. Inject the filter panel back into screen-recommend
# Find where the recommend action button is, or just insert it at the beginning of screen-recommend
# It was previously right after the hero section in screen-recommend
recommend_hero_pattern = r'(<section id="screen-recommend" class="screen">\s*<div class="hero-section"[^>]*>.*?</div>\s*)'
html = re.sub(recommend_hero_pattern, r'\1\n                ' + filter_html.replace('\\', '\\\\') + '\n', html, count=1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done switching to Option 3 HTML")
