import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update global nav
nav_old = """            <nav class="app-global-nav">
                <button class="global-nav-btn active" data-screen="screen-input">
                    <i data-lucide="search"></i> 成分解析
                </button>
                <button class="global-nav-btn" data-screen="screen-recommend">
                    <i data-lucide="compass"></i> 智能发现
                </button>
            </nav>"""
nav_new = """            <nav class="app-global-nav">
                <button class="global-nav-btn active" data-screen="screen-input">
                    <i data-lucide="search"></i> 成分解析
                </button>
                <button class="global-nav-btn" data-screen="screen-recommend">
                    <i data-lucide="compass"></i> 智能发现
                </button>
                <button class="global-nav-btn" data-screen="screen-plan">
                    <i data-lucide="target"></i> 专属计划
                </button>
            </nav>"""
html = html.replace(nav_old, nav_new)

# 2. Extract personalization-panel
match_pers = re.search(r'(<!-- Personalization Module -->.*?</div>\s*</div>\s*)<!-- Recommendations Loading -->', html, flags=re.DOTALL)
if match_pers:
    pers_html = match_pers.group(1)
    html = html.replace(pers_html, '')
else:
    print("Could not find personalization panel")

# 3. Extract plan-dashboard
match_dash = re.search(r'(<!-- Full Plan Dashboard -->.*?)</section>', html, flags=re.DOTALL)
if match_dash:
    dash_html = match_dash.group(1)
    html = html.replace(dash_html, '')
else:
    print("Could not find plan dashboard")

# 4. Extract filter panel (to duplicate)
match_filter = re.search(r'(<div class="filter-panel glass-card">.*?</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
if match_filter:
    filter_html = match_filter.group(1)
    # Remove the recommendation generate button from the copied filter html
    filter_html_plan = re.sub(r'<div class="recommend-action">.*?</div>\s*</div>', '</div>', filter_html, flags=re.DOTALL)
else:
    print("Could not find filter panel")

# 5. Build screen-plan
if match_pers and match_dash and match_filter:
    screen_plan = f"""
            <!-- SCREEN 5: Plan -->
            <section id="screen-plan" class="screen">
                <div class="hero-section" style="padding: 1rem 0 2rem;">
                    <h1 class="hero-title">定制<span class="gradient-text">专属周期计划</span></h1>
                    <p class="hero-subtitle">结合您的身体数据与饮食偏好，生成精准的阶段性饮食指南</p>
                </div>

                {filter_html_plan}

                {pers_html}

                <!-- Plan Loading -->
                <div id="plan-loading" class="recommend-loading hidden">
                    <div class="ai-loader">
                        <div class="ai-orb"></div>
                        <div class="ai-orb"></div>
                        <div class="ai-orb"></div>
                        <div class="ai-orb"></div>
                    </div>
                    <p class="loading-text-glow">AI 正在根据您的体型数据生成计划...</p>
                </div>

                {dash_html}
            </section>
"""
    # Insert before </main>
    html = html.replace('</main>', screen_plan + '\n        </main>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Done index.html updates")
