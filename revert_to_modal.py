import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Navigation
nav_old = """            <nav class="app-global-nav">
                <button class="global-nav-btn active" data-screen="screen-input">
                    <i data-lucide="search"></i> 成分解析
                </button>
                <button class="global-nav-btn" data-screen="screen-wizard">
                    <i data-lucide="wand-2"></i> 智能定制向导
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

# 2. Extract pieces
match_filters = re.search(r'(<!-- Dietary Preferences -->.*?</div>\s*</div>\s*<!-- Flavor Map -->.*?</div>\s*</div>)', html, flags=re.DOTALL)
filter_html = match_filters.group(1) if match_filters else "<!-- Missing tags -->"

match_kanban = re.search(r'(<!-- Recommendations Kanban 5 Columns -->.*?</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
kanban_html = match_kanban.group(1) if match_kanban else "<!-- Missing kanban -->"

match_dash = re.search(r'(<!-- Full Plan Dashboard -->.*?</div>\s*</div>\s*</div>\s*</div>)', html, flags=re.DOTALL)
dash_html = match_dash.group(1) if match_dash else "<!-- Missing dash -->"

match_loading2 = re.search(r'(<!-- Recommend Loading -->.*?</div>\s*</div>)', html, flags=re.DOTALL)
loading2_html = match_loading2.group(1) if match_loading2 else "<!-- Missing load2 -->"
loading2_html = loading2_html.replace('wizard-loading-2', 'recommend-loading')

match_loading3 = re.search(r'(<!-- Plan Loading -->.*?</div>\s*</div>)', html, flags=re.DOTALL)
loading3_html = match_loading3.group(1) if match_loading3 else "<!-- Missing load3 -->"
loading3_html = loading3_html.replace('wizard-loading-3', 'plan-loading')

# 3. Remove wizard entirely
html = re.sub(r'<!-- SCREEN: Wizard -->.*?</section>', '', html, flags=re.DOTALL)

# 4. Create Screen 4 (Recommend) and Screen 5 (Plan)
screen_recommend = f"""
            <!-- SCREEN 4: Smart Recommendation -->
            <section id="screen-recommend" class="screen">
                <div class="hero-section">
                    <h1 class="hero-title">AI<span class="gradient-text">智能发现</span></h1>
                    <p class="hero-subtitle">基于海量营养学数据，为您匹配最佳食材组合</p>
                </div>
                
                <div class="recommend-actions-container" style="text-align: center; margin-bottom: 2rem;">
                    <button id="btn-generate-recommend" class="particle-btn" style="max-width: 400px; margin: 0 auto;">
                        <span class="btn-text"><i data-lucide="sparkles"></i> 随机生成一些推荐组合</span>
                    </button>
                </div>

                {loading2_html}

                {kanban_html}
            </section>
"""

screen_plan = f"""
            <!-- SCREEN 5: Plan -->
            <section id="screen-plan" class="screen">
                <div class="hero-section">
                    <h1 class="hero-title">专属<span class="gradient-text">周期计划</span></h1>
                    <p class="hero-subtitle">设定目标，AI为您量身定制每个阶段的饮食大纲</p>
                </div>

                <!-- Personalization Input Box -->
                <div class="personalization-panel glass-card">
                    <h3 class="card-title" style="margin-bottom: 1.5rem;"><i data-lucide="user-circle"></i> 基础数据</h3>
                    
                    <div class="input-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                        <div class="input-group">
                            <label>当前身高 (cm)</label>
                            <input type="number" id="input-height" placeholder="例: 175" class="glass-input">
                        </div>
                        <div class="input-group">
                            <label>当前体重 (kg)</label>
                            <input type="number" id="input-weight" placeholder="例: 70" class="glass-input">
                        </div>
                        <div class="input-group">
                            <label>核心目标</label>
                            <select id="input-goal" class="glass-input">
                                <option value="减脂">减脂</option>
                                <option value="增肌">增肌</option>
                                <option value="塑形">保持/塑形</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label>期望周期 (月)</label>
                            <input type="number" id="input-duration" placeholder="例: 3" class="glass-input">
                        </div>
                    </div>
                    
                    <div class="input-group" style="margin-top: 1.5rem;">
                        <label>补充说明 (如：每周运动3次，每次40分钟)</label>
                        <input type="text" id="input-extra" placeholder="选填..." class="glass-input" style="width: 100%;">
                    </div>

                    <!-- Add Modal Trigger Button Here -->
                    <div class="modal-trigger-section" style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h4 style="margin: 0 0 10px 0; color: #ddd; font-size: 0.95rem;">专属饮食偏好</h4>
                            <div id="selected-tags-display" class="selected-tags-container" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                <span style="color: #888; font-size: 0.85rem; font-style: italic;">尚未选择任何偏好标签</span>
                            </div>
                        </div>
                        <button id="btn-open-tag-modal" class="btn-outline">
                            <i data-lucide="plus"></i> 选择偏好标签
                        </button>
                    </div>
                </div>

                <div class="recommend-actions-container" style="text-align: center; margin: 2rem 0;">
                    <button id="btn-generate-plan" class="particle-btn" style="max-width: 400px; margin: 0 auto;">
                        <span class="btn-text"><i data-lucide="target"></i> 一键生成全周期计划</span>
                    </button>
                </div>

                {loading3_html}

                {dash_html}
            </section>
"""

modal_html = f"""
    <!-- Tag Selection Modal -->
    <div id="tag-selection-modal" class="modal-overlay hidden">
        <div class="modal-content glass-card">
            <div class="modal-header">
                <h2><i data-lucide="settings-2"></i> 选择饮食偏好</h2>
                <button id="btn-close-tag-modal" class="modal-close-btn"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body filter-panel">
                {filter_html}
            </div>
            <div class="modal-footer">
                <button id="btn-confirm-tags" class="particle-btn" style="width: 100%;">
                    <span class="btn-text">确认并返回</span>
                </button>
            </div>
        </div>
    </div>
"""

# Insert screen 4 and 5 before </main>
html = html.replace('</main>', screen_recommend + screen_plan + '\n        </main>')

# Insert modal before </body>
html = html.replace('</body>', modal_html + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Done writing Modal HTML")
