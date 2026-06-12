import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Navigation
nav_old = """            <nav class="app-global-nav">
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
nav_new = """            <nav class="app-global-nav">
                <button class="global-nav-btn active" data-screen="screen-input">
                    <i data-lucide="search"></i> 成分解析
                </button>
                <button class="global-nav-btn" data-screen="screen-wizard">
                    <i data-lucide="wand-2"></i> 智能定制向导
                </button>
            </nav>"""
html = html.replace(nav_old, nav_new)

# 2. Extract components
# Extract filter-groups
match_filters = re.search(r'(<!-- Dietary Preferences -->.*?</div>\s*</div>\s*<!-- Flavor Map -->.*?</div>\s*</div>)', html, flags=re.DOTALL)
filter_html = match_filters.group(1) if match_filters else "<!-- Missing tags -->"

# Extract personalization panel
match_pers = re.search(r'(<div class="personalization-panel glass-card">.*?</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
pers_html = match_pers.group(1) if match_pers else "<!-- Missing pers panel -->"
# Remove the plan-generate button from pers_html if it exists
pers_html = re.sub(r'<div class="recommend-action">.*?</div>', '', pers_html, flags=re.DOTALL)

# Extract recommend kanban
match_kanban = re.search(r'(<!-- Recommendations Kanban 5 Columns -->.*?</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
kanban_html = match_kanban.group(1) if match_kanban else "<!-- Missing kanban -->"

# Extract plan dashboard
match_dash = re.search(r'(<!-- Full Plan Dashboard -->.*?</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
dash_html = match_dash.group(1) if match_dash else "<!-- Missing dash -->"

# 3. Remove screen-recommend and screen-plan entirely
html = re.sub(r'<!-- SCREEN 4: Smart Recommendation -->.*?</section>', '', html, flags=re.DOTALL)
html = re.sub(r'<!-- SCREEN 5: Plan -->.*?</section>', '', html, flags=re.DOTALL)

# 4. Build screen-wizard
wizard_html = f"""
            <!-- SCREEN: Wizard -->
            <section id="screen-wizard" class="screen">
                <div class="hero-section" style="padding: 1rem 0 1rem;">
                    <h1 class="hero-title">AI<span class="gradient-text">饮食定制向导</span></h1>
                    <p class="hero-subtitle">三步生成您的完美生活指南</p>
                </div>

                <!-- Wizard Stepper -->
                <div class="wizard-stepper">
                    <div class="wizard-step-indicator active" data-step="1">
                        <div class="step-circle">1</div>
                        <div class="step-label">完善画像</div>
                    </div>
                    <div class="wizard-line"></div>
                    <div class="wizard-step-indicator" data-step="2">
                        <div class="step-circle">2</div>
                        <div class="step-label">食材探索</div>
                    </div>
                    <div class="wizard-line"></div>
                    <div class="wizard-step-indicator" data-step="3">
                        <div class="step-circle">3</div>
                        <div class="step-label">周期计划</div>
                    </div>
                </div>

                <!-- Wizard Content -->
                <div class="wizard-content">
                    
                    <!-- STEP 1: Profile -->
                    <div id="wizard-step-1" class="wizard-pane active">
                        <h2 class="pane-title"><i data-lucide="user"></i> 第一步：构建您的饮食画像</h2>
                        
                        <div class="filter-panel glass-card">
                            {filter_html}
                        </div>
                        
                        <div style="margin-top: 1.5rem;">
                            {pers_html}
                        </div>

                        <div class="wizard-actions">
                            <button id="btn-wizard-next-1" class="particle-btn">
                                <span class="btn-text">下一步：探索最佳食材组合 <i data-lucide="arrow-right"></i></span>
                            </button>
                        </div>
                    </div>

                    <!-- STEP 2: Recommend -->
                    <div id="wizard-step-2" class="wizard-pane hidden">
                        <div class="pane-header">
                            <button class="btn-wizard-back" data-target="1"><i data-lucide="arrow-left"></i> 返回修改画像</button>
                            <h2 class="pane-title"><i data-lucide="compass"></i> 第二步：为您匹配的优质食材</h2>
                        </div>

                        <!-- Recommend Loading -->
                        <div id="wizard-loading-2" class="recommend-loading hidden">
                            <div class="ai-loader">
                                <div class="ai-orb"></div><div class="ai-orb"></div><div class="ai-orb"></div><div class="ai-orb"></div>
                            </div>
                            <p class="loading-text-glow">AI 正在云端进行深度营养解码与多维匹配...</p>
                        </div>

                        {kanban_html}

                        <div class="wizard-actions">
                            <button id="btn-wizard-next-2" class="particle-btn">
                                <span class="btn-text">最终步：生成全周期饮食计划 <i data-lucide="arrow-right"></i></span>
                            </button>
                        </div>
                    </div>

                    <!-- STEP 3: Plan -->
                    <div id="wizard-step-3" class="wizard-pane hidden">
                        <div class="pane-header">
                            <button class="btn-wizard-back" data-target="2"><i data-lucide="arrow-left"></i> 返回调整食材</button>
                        </div>

                        <!-- Plan Loading -->
                        <div id="wizard-loading-3" class="recommend-loading hidden">
                            <div class="ai-loader">
                                <div class="ai-orb"></div><div class="ai-orb"></div><div class="ai-orb"></div><div class="ai-orb"></div>
                            </div>
                            <p class="loading-text-glow">AI 正在为您生成科学周密的阶段性目标...</p>
                        </div>

                        {dash_html}
                    </div>

                </div>
            </section>
"""

# Insert before </main>
html = html.replace('</main>', wizard_html + '\n        </main>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Done writing wizard HTML")
