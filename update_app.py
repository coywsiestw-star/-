import sys, re

with open("app.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace active API state
content = content.replace("let apiKey = localStorage.getItem('api_key') || '';", "let apiKey = localStorage.getItem('api_key') || '';\nlet backendHasKey = false;")

# Replace DOMContentLoaded
orig_dom = """document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
    initApiSettings();
    setupEventListeners();
});"""

new_dom = """document.addEventListener('DOMContentLoaded', async () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
    await checkBackendStatus();
    initApiSettings();
    setupEventListeners();
});"""

content = content.replace(orig_dom, new_dom)

# Add checkBackendStatus and replace initApiSettings
orig_init = """function initApiSettings() {
    elements.apiProviderSelect.value = apiProvider;
    if (apiKey) {
        elements.apiKeyInput.value = '';
        elements.apiKeyInput.placeholder = '已配置 API Key (可输入新 Key 覅盖)';
        elements.btnSaveKey.style.display = 'block'; // Always show save button so provider can be updated
        elements.btnClearKey.style.display = 'block';
        elements.apiStatusDot.className = 'status-dot green';
        elements.apiStatusText.textContent = `${apiProvider === 'gemini' ? 'Gemin9' : 'DeepSeek'} 实时 AI 就绪`;
    } else {
        elements.apiKeyInput.value = '';
        elements.apiKeyInput.placeholder = '输入 API Key';
        elements.btnSaveKey.style.display = 'block';
        elements.btnClearKey.style.display = 'none';
        elements.apiStatusDot.className = 'status-dot yellow';
        elements.apiStatusText.textContent = '离线演示模式';
    }
}"""

new_init = """async function checkBackendStatus() {
    try {
        const res = await fetch('/api/status');
        const status = await res.json();
        backendHasKey = status.geminiConfigured || status.deepseekConfigured || status.genericConfigured;
    } catch (e) {
        console.error("无法获取后端共享 Key 状怃:", e);
    }
}

function initApiSettings() {
    elements.apiProviderSelect.value = apiProvider;
    if (apiKey) {
        elements.apiKeyInput.value = '';
        elements.apiKeyInput.placeholder = '已配置 API Key (可输入新 Key 覅癖)�;
        elements.btnSaveKey.style.display = 'block'; // Always show save button so provider can be updated
        elements.btnClearKey.style.display = 'block';
        elements.apiStatusDot.className = 'status-dot green';
        elements.apiStatusText.textContent = `${apiProvider === 'gemini' ? 'Gemini' : 'DeepSeek'} 实时 AI 就绪`;
    } else if (backendHasKey) {
        elements.apiKeyInput.value = '';
        elements.apiKeyInput.placeholder = '共享模式，无需输入 Key';
        elements.btnSaveKey.style.display = 'block';
        elements.btnClearKey.style.display = 'none';
        elements.apiStatusDot.className = 'status-dot green';
        elements.apiStatusText.textContent = '共享%��时 AI 就绪';
    } else {
        elements.apiKeyInput.value = '';
        elements.apiKeyInput.placeholder = '输入 API Key';
        elements.btnSaveKey.style.display = 'block';
        elements.btnClearKey.style.display = 'none';
        elements.apiStatusDot.className = 'status-dot yellow';
        elements.apiStatusText.textContent = '离线演示模弐';
    }
}"""

content = content.replace(orig_init, new_init)

content = content.replace("const isOnline = !!apiKey;", "const isOnline = !!apiKey || backendHasKey;")

with open("app.js", "w", encoding="utf-8") as f:
    f.write(content)
