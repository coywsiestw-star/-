import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find the filter panel
match_filter = re.search(r'(<div class="filter-panel glass-card">.*?</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
if match_filter:
    filter_html = match_filter.group(1)
    
    # Remove all occurrences of filter_html from the doc
    # But wait, one of them has recommend-action button inside it.
    
    # Actually, let's just use regex to remove ALL filter-panels
    html = re.sub(r'<div class="filter-panel glass-card">.*?</div>\s*</div>\s*</div>', '', html, flags=re.DOTALL)
    
    # We must preserve the recommend-action from the first one if we deleted it
    # But actually, the recommend-action is INSIDE the filter-panel in screen-recommend.
    # Wait, let's look at index.html exactly.
    pass

# Read again to be safe
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's extract the clean filter groups
groups_match = re.search(r'(<div class="filter-group">.*?</div>\s*</div>\s*<div class="filter-group">.*?</div>\s*</div>\s*<div class="filter-group">.*?</div>\s*</div>)', html, flags=re.DOTALL)
if groups_match:
    filter_groups = groups_match.group(1)
    
    global_drawer = f"""
            <!-- Global Profile Drawer -->
            <div class="global-profile-wrapper">
                <button id="btn-toggle-profile" class="profile-toggle-btn">
                    <i data-lucide="sliders-horizontal"></i>
                    <span>我的饮食偏好设置</span>
                    <i data-lucide="chevron-down" id="profile-toggle-icon"></i>
                </button>
                <div id="global-profile-drawer" class="global-profile-drawer collapsed">
                    <div class="filter-panel glass-card">
                        {filter_groups}
                    </div>
                </div>
            </div>
"""
    
    # Now remove all filter-groups from the document
    html = re.sub(r'<div class="filter-group">.*?</div>\s*</div>\s*<div class="filter-group">.*?</div>\s*</div>\s*<div class="filter-group">.*?</div>\s*</div>', '', html, flags=re.DOTALL)
    
    # We also have an empty `<div class="filter-panel glass-card">` left in screen-plan.
    html = re.sub(r'<div class="filter-panel glass-card">\s*</div>', '', html, flags=re.DOTALL)
    
    # Also in screen-recommend, the filter-panel used to wrap the recommend action. 
    # Let's strip the `<div class="filter-panel glass-card">` wrapper from screen-recommend if it's there,
    # or just leave the recommend action.
    # Actually, in screen-recommend, we have:
    # <div class="filter-panel glass-card">
    #    ... (filter groups removed)
    #    <div class="recommend-action">...</div>
    # </div>
    # This is fine, we can keep the glass-card for the recommend button, or remove it so the button stands alone.
    # Let's leave it as is, but it might be empty if there are no filter-groups.
    
    # Insert global_drawer right after `</nav>`
    html = html.replace('</nav>', '</nav>\n' + global_drawer)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Done")
else:
    print("Failed to find filter groups")
