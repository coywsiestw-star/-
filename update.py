import sys
with open("server.js", "r", encoding="utf-8") as f:
    content = f.read()

status_endpoint = """// Endpoint to check if backend has shared keys configured
app.get('/api/status', (req, res) => {
    res.json({
        geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.API_KEY),
        deepseekConfigured: !!(process.env.DEEPSEEK_API_KEY || process.env.API_KEY)    
    });
});
"""

content = content.replace("app.post('/api/analyze', async (req, res) => {", status_endpoint + "\napp.post('/api/analyze', async (req, res) => {")

orig_logic = """    const { provider, apiKey, foodName, imageSrc } = req.body;

    try {
        if (!apiKey) {
            return res.status(400).json({ error: '请先配置并在设置面板中保存你的 API Key。' });
        }"""

new_logic = """    const { provider, apiKey, foodName, imageSrc } = req.body;

    // Resolve API Key: use request apiKey first, fallback to environment variables
    let finalApiKey = apiKey;
    if (!finalApiKey) {
        if (provider === 'gemini') {
            finalApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        } else if (provider === 'deepseek') {
            finalApiKey = process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
        }
    }

    try {
        if (!finalApiKey) {
            return res.status(400).json({ error: '请先配置并在设置面杽中保存你的 API Key，或者联系管理员配置服务器共享 Key。' });
        }"""

content = content.replace(orig_logic, new_logic)
content = content.replace("?key=${apiKey}", "?key=${finalApiKey}")
content = content.replace("'Authorization': `Bearer ${apiKey}`", "'Authorization': `Bearer ${finalApiKey}`")

with open("server.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated server.js")
