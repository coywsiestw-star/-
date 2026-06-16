const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname)));

// Endpoint to check if backend has shared keys configured
app.get("/api/status", (req, res) => {
    res.json({
        geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.API_KEY),
        deepseekConfigured: !!(process.env.DEEPSEEK_API_KEY || process.env.API_KEY)
    });
});

// Proxy endpoint to bypass CORS and securely process keys
app.post("/api/analyze", async (req, res) => {
    const { provider, apiKey, foodName, imageSrc } = req.body;

    // Resolve API Key: use request apiKey first, fallback to environment variables
    let finalApiKey = apiKey;
    if (!finalApiKey) {
        if (provider === "gemini") {
            finalApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        } else if (provider === "deepseek") {
            finalApiKey = process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
        }
    }

    try {
        if (!finalApiKey) {
            return res.status(400).json({ error: "请先配置并在设置面板中保存你的 API Key，或者联系管理员配置服务器共享 Key。" });
        }

        if (provider === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${finalApiKey}`;
            let requestBody;

            if (imageSrc) {
                // Multimodal request with image base64
                const base64Data = imageSrc.split(",")[1];
                const mimeType = imageSrc.split(";")[0].split(":")[1];
                
                requestBody = {
                    contents: [{
                        parts: [
                            { inlineData: { mimeType, data: base64Data } },
                            { text: "首先判断图片中的核心物体是否是具体的单品食物或食材（如苹果、牛肉、生菜等）。如果是复杂的混合菜肴（如火锅、满汉全席、套餐），或者是泛指的类别，或非食物，请直接返回 JSON：{ \"error\": \"NOT_SPECIFIC_FOOD\", \"message\": \"请上传或输入具体的食物单品或食材进行分析，例如'牛肉'或'生菜'，系统不支持分析混合菜肴（如火锅）。\" }。如果验证通过，请继续对其进行深度的微观分子及营养物质成分分析，返回的 JSON 结构必须严格包括：name, scientificName, score, ratingTitle, ratingDesc, calories, macros (carbs, protein, fat, carbsPct, proteinPct, fatPct), water, compounds (name, scientific, desc, tag, icon), micros (name, amount, pct)。不得包含 markdown 标记。" }
                        ]
                    }],
                    generationConfig: { responseMimeType: "application/json" }
                };
            } else {
                // Text request
                const promptText = `你是专业的食物生化成分及营养医学数据库。首先判断输入 "${foodName}" 是否是具体的单品食物或食材（如苹果、牛肉、生菜等）。如果是复杂的混合菜肴（如火锅、汉堡套餐），或者是泛指的类别，或非食物，请直接返回 JSON：{ "error": "NOT_SPECIFIC_FOOD", "message": "请输入具体的食物单品或食材进行分析，例如'牛肉'或'生菜'，系统不支持分析混合菜肴（如火锅）。" }。如果验证通过，请对食品 "${foodName}" 进行深度的微观分子及营养物质成分分析。你必须只返回一个 JSON 对象，不得包含任何 markdown 标记。其结构必须是：{ name, scientificName, score, ratingTitle, ratingDesc, calories, macros: { carbs, protein, fat, carbsPct, proteinPct, fatPct }, water, compounds: [ { name, scientific, desc, tag, icon } ], micros: [ { name, amount, pct } ] }`;
                requestBody = {
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: { responseMimeType: "application/json" }
                };
            }

            const apiResponse = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!apiResponse.ok) {
                const errText = await apiResponse.text();
                console.error("Gemini API Error details:", errText);
                return res.status(apiResponse.status).json({ error: `Gemini API 调用失败: 状态码 ${apiResponse.status}。请检查 API Key 是否正确，以及网络连接（可能需要代理）。` });
            }

            const result = await apiResponse.json();
            let textOutput = result.candidates[0].content.parts[0].text.trim();
            // Clean markdown
            if (textOutput.startsWith("```json")) textOutput = textOutput.substring(7);
            else if (textOutput.startsWith("```")) textOutput = textOutput.substring(3);
            if (textOutput.endsWith("```")) textOutput = textOutput.slice(0, -3);

            let parsedData;
            try {
                parsedData = JSON.parse(textOutput.trim());
            } catch (e) {
                return res.status(500).json({ error: "AI 返回的数据格式无法解析。" });
            }

            if (parsedData.error === "NOT_SPECIFIC_FOOD") {
                return res.status(400).json({ error: `NOT_SPECIFIC_FOOD:${parsedData.message}` });
            }

            return res.json(parsedData);

        } else if (provider === "deepseek") {
            if (imageSrc) {
                return res.status(400).json({ error: "NOT_SPECIFIC_FOOD:DeepSeek 引擎暂不支持图片识别，请手动打字搜索，或在设置中切换回 Gemini 引擎。" });
            }
            const url = "https://api.deepseek.com/chat/completions";
            const promptText = `请对食品或物品 "${foodName}" 进行深度的微观分子及营养物质成分分析。如果是任何食物（包括单品、混合菜肴、泛指类别等），请尽力分析它的营养成分。如果你认为这完全不是食物，请发挥想象力，编造或强行分析它的“化学成分”，也必须返回正常的营养结构。
你必须严格以 JSON 格式返回分析报告，不得包含任何 markdown 标记（如 \`\`\`json 等）。绝对不要返回 error 字段。
验证通过时，JSON 对象的格式必须严格与以下结构一致，绝对不要在外层嵌套其他键：
{
  "name": "${foodName}",
  "scientificName": "该食物的拉丁文学名，如 Sus scrofa domesticus",
  "score": 1到100之间的健康/营养推荐指数(整数，如 78)",
  "ratingTitle": "一句话推荐性评级，如 '肉类蛋白质来源'",
  "ratingDesc": "针对该食物微观物质构成的简短总结描述，1-2句",
  "calories": "热量(如 34 kcal)",
  "macros": { "carbs": "含量g", "protein": "含量g", "fat": "含量g", "carbsPct": 占比数字, "proteinPct": 占比数字, "fatPct": 占比数字 },
  "water": 水分重量百分比数字,
  "compounds": [ { "name": "化合物名", "scientific": "英文学名", "desc": "作用", "tag": "归类", "icon": "对应图标" } ],
  "micros": [ { "name": "微量元素", "amount": "含量", "pct": 比例数字 } ]
}`;

            const apiResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${finalApiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: "你是一个食物化学和营养学成分数据库。你必须以 JSON 格式返回分析报告，结构需要与用户的要求完全一致。不要在回复中夹带任何 Markdown 标记或 ```json 标记。" },
                        { role: "user", content: promptText }
                    ],
                    response_format: { type: "json_object" }
                })
            });

            if (!apiResponse.ok) {
                const errText = await apiResponse.text();
                console.error("DeepSeek API Error details:", errText);
                return res.status(apiResponse.status).json({ error: `DeepSeek API 调用失败: 状态码 ${apiResponse.status}。请确保你的 API Key 余额充足，或者检查接口请求是否受限。` });
            }

            const data = await apiResponse.json();
            let textOutput = data.choices[0].message.content.trim();
            // Clean markdown
            if (textOutput.startsWith("```json")) textOutput = textOutput.substring(7);
            else if (textOutput.startsWith("```")) textOutput = textOutput.substring(3);
            if (textOutput.endsWith("```")) textOutput = textOutput.slice(0, -3);

            let parsedData;
            try {
                parsedData = JSON.parse(textOutput);
                // Safe unwrap if DeepSeek nested the object
                if (parsedData && Object.keys(parsedData).length === 1 && typeof parsedData[Object.keys(parsedData)[0]] === 'object' && parsedData[Object.keys(parsedData)[0]] !== null && parsedData[Object.keys(parsedData)[0]].name) {
                    parsedData = parsedData[Object.keys(parsedData)[0]];
                }
            } catch(e) {
                return res.status(500).json({ error: "DeepSeek 返回格式错误" });
            }

            if (parsedData.error === "NOT_SPECIFIC_FOOD") {
                return res.status(400).json({ error: `NOT_SPECIFIC_FOOD:${parsedData.message}` });
            }

            res.json(parsedData);
        }

    } catch (error) {
        console.error("Proxy Backend Error:", error);
         res.status(500).json({ error: error.message });
    }
});

// --- Smart Recommendation Endpoint ---
app.post("/api/recommend", async (req, res) => {
    const { provider, apiKey, tags } = req.body;

    if (!tags || tags.length === 0) {
        return res.status(400).json({ error: "请提供至少一个筛选标签" });
    }

    const tagsString = tags.join("、");
    const promptText = `你是专业的临床营养师。用户选择了以下饮食条件：[${tagsString}]。
请基于这些条件综合考虑，推荐最匹配的具体食物单品或原生食材。
重要约束：必须是具体的食物单品或初级加工食材（如菠菜、三文鱼、豆腐、燕麦），绝对不能是复杂的混合菜肴（如火锅、汉堡套餐、佛跳墙）。

你必须严格只返回一个 JSON 对象，不得包含任何 markdown 标记（如 \`\`\`json 等）。
JSON 对象的键必须是这五个分类："carbs" (碳水), "superfoods" (超级食物), "protein" (蛋白质), "fat" (脂肪), "other" (其他微量补充)。
每个分类对应一个数组，数组内包含符合该分类的最推荐食材。每个食材必须包含 name, reason 和 priority（1代表最高优先级，数字越大优先级越低。请在每个分类内按 priority 从小到大排序）。每个分类推荐 5-8 种食材。如果没有合适的，可以返回空数组。

JSON 格式严格要求如下：
{
  "carbs": [
    { "name": "藜麦", "reason": "低GI复合碳水，富含膳食纤维...", "priority": 1 }
  ],
  "superfoods": [],
  "protein": [],
  "fat": [],
  "other": []
}`;

    try {
        if (provider === "gemini") {
            const finalKey = apiKey || process.env.GEMINI_API_KEY || process.env.API_KEY;
            if (!finalKey) return res.status(400).json({ error: "Gemini API Key 未提供" });
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${finalKey}`;
            
            const requestBody = {
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: { responseMimeType: "application/json" }
            };

            const apiResponse = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!apiResponse.ok) {
                return res.status(apiResponse.status).json({ error: "Gemini API 调用失败" });
            }

            const result = await apiResponse.json();
            let textOutput = result.candidates[0].content.parts[0].text.trim();
            if (textOutput.startsWith("```json")) textOutput = textOutput.substring(7);
            else if (textOutput.startsWith("```")) textOutput = textOutput.substring(3);
            if (textOutput.endsWith("```")) textOutput = textOutput.slice(0, -3);

            let parsed = JSON.parse(textOutput.trim());
            if (parsed.recommendations && typeof parsed.recommendations === 'object' && !Array.isArray(parsed.recommendations)) {
                parsed = parsed.recommendations;
            }
            return res.json(parsed);

        } else if (provider === "deepseek") {
            const finalKey = apiKey || process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
            if (!finalKey) return res.status(400).json({ error: "DeepSeek API Key 未提供" });
            const url = "https://api.deepseek.com/chat/completions";
            
            const requestBody = {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一个专业的临床营养师和 JSON 接口。你必须只返回一个严格的 JSON 对象，包含规定的五个类别数组键。" },
                    { role: "user", content: promptText }
                ],
                response_format: { type: "json_object" } 
            };

            const apiResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${finalKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!apiResponse.ok) {
                return res.status(apiResponse.status).json({ error: "DeepSeek API 调用失败" });
            }

            const result = await apiResponse.json();
            let textOutput = result.choices[0].message.content.trim();
            if (textOutput.startsWith("```json")) textOutput = textOutput.substring(7);
            else if (textOutput.startsWith("```")) textOutput = textOutput.substring(3);
            if (textOutput.endsWith("```")) textOutput = textOutput.slice(0, -3);

            let parsed = JSON.parse(textOutput.trim());
            // Safe unwrap in case DeepSeek nested it inside a "recommendations" or "data" key
            if (parsed.recommendations && typeof parsed.recommendations === 'object' && !Array.isArray(parsed.recommendations)) {
                parsed = parsed.recommendations;
            } else if (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) {
                parsed = parsed.data;
            }
            return res.json(parsed);
        }

    } catch (error) {
        console.error("Recommend error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate_plan', async (req, res) => {
    try {
        const { provider, apiKey, height, currentWeight, targetWeight, timeframe, notes, tags } = req.body;

        if (!provider) return res.status(400).json({ error: "请选择一个大模型提供商" });

        const bmi = (currentWeight / Math.pow(height / 100, 2)).toFixed(1);
        const tagStr = tags && tags.length > 0 ? tags.join('、') : '无特殊饮食偏好';

        const systemPrompt = `你是一个世界顶级的私人 AI 营养师。你专注于为用户制定精准的减脂、塑形或健康饮食计划。`;
        const userPrompt = `
我的身体数据如下：
- 身高：${height} cm
- 当前体重：${currentWeight} kg (BMI: ${bmi})
- 目标体重：${targetWeight} kg
- 期望周期：${timeframe}
- 补充说明 (运动习惯等)：${notes || '无'}
- 我的饮食风格/偏好：${tagStr}

请为我生成一个全面的周期饮食计划。你必须严格返回一个 JSON 对象，不得包含任何 Markdown 标记。

【极其重要的数据准确性要求】：
1. **科学计算热量**：请根据我的身高、当前体重和目标，科学估算我的基础代谢(BMR)和日常消耗(TDEE)。如果是减重，每天设置 300-500 千卡的安全热量缺口；如果是增肌，设置适度盈余。
2. **总和必须一致**：你设定的 \`daily_goal.calories\` 必须**绝对等于**各餐热量（早餐、午餐、晚餐、加餐）的总和！绝不能出现数学计算错误（例如日总目标是1800，但各餐加起来只有1200的情况）。
3. **宏量营养素准确**：根据目标体重设定充足的蛋白质（例如减脂期 1.5g-2.0g/kg），并将这些营养素科学分配到每餐中。

JSON 格式要求如下：
{
  "monthly_goal": "用一两句话描述这${timeframe}里，每个月的大致减重或身体变化目标。",
  "weekly_goal": "用一两句话描述本周具体需要执行的重点，如训练结合饮食。",
  "daily_goal": {
    "calories": 1800,
    "protein_g": 120,
    "summary": "一句话概括每日营养分配策略"
  },
  "meals": [
    { 
      "type": "早餐", 
      "amount": "约 400 千卡", 
      "options": [
        { "name": "方案A (快手便携)", "foods": ["全麦面包", "脱脂牛奶", "苹果"] },
        { "name": "方案B (高蛋白饱腹)", "foods": ["燕麦粥", "水煮蛋", "蓝莓"] },
        { "name": "方案C (风味满足)", "foods": ["杂粮煎饼", "无糖豆浆"] }
      ]
    },
    { 
      "type": "午餐", 
      "amount": "约 600 千卡", 
      "options": [
        { "name": "方案A (经典减脂)", "foods": ["糙米饭", "煎鸡胸肉", "西蓝花"] },
        { "name": "方案B (海鲜轻食)", "foods": ["荞麦面", "清蒸虾", "芦笋"] },
        { "name": "方案C (中式炒菜)", "foods": ["紫薯", "番茄炒蛋", "清炒菠菜"] }
      ]
    },
    { 
      "type": "晚餐", 
      "amount": "约 500 千卡", 
      "options": [
        { "name": "方案A (轻盈少碳水)", "foods": ["清蒸鱼", "菠菜", "豆腐"] },
        { "name": "方案B (高蛋白沙拉)", "foods": ["牛肉沙拉", "牛油果", "小番茄"] },
        { "name": "方案C (温暖炖汤)", "foods": ["冬瓜排骨汤", "木耳", "少许魔芋丝"] }
      ]
    },
    { 
      "type": "加餐(可选)", 
      "amount": "约 150 千卡", 
      "options": [
        { "name": "方案A", "foods": ["一小把杏仁", "黑咖啡"] },
        { "name": "方案B", "foods": ["无糖酸奶", "半个奇异果"] }
      ]
    }
  ]
}
`;

        if (provider === "gemini") {
            const finalKey = apiKey || process.env.GEMINI_API_KEY || process.env.API_KEY;
            if (!finalKey) return res.status(400).json({ error: "Gemini API Key 未提供" });

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${finalKey}`;
            const requestBody = {
                system_instruction: { parts: { text: systemPrompt } },
                contents: [{ parts: [{ text: userPrompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            };

            const apiResponse = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            if (!apiResponse.ok) return res.status(apiResponse.status).json({ error: "Gemini API 调用失败" });

            const result = await apiResponse.json();
            const textOutput = result.candidates[0].content.parts[0].text;
            return res.json(JSON.parse(textOutput.trim()));

        } else if (provider === "deepseek") {
            const finalKey = apiKey || process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
            if (!finalKey) return res.status(400).json({ error: "DeepSeek API Key 未提供" });

            const url = `https://api.deepseek.com/v1/chat/completions`;
            const dsPrompt = userPrompt + `\n\n注意：DeepSeek 的 json_object 模式要求返回对象，请确保返回最外层是上述的 JSON 对象。`;
            const requestBody = {
                model: "deepseek-chat",
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: dsPrompt }
                ],
                temperature: 0.7
            };

            const apiResponse = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${finalKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!apiResponse.ok) return res.status(apiResponse.status).json({ error: "DeepSeek API 调用失败" });

            const result = await apiResponse.json();
            let textOutput = result.choices[0].message.content.trim();
            if (textOutput.startsWith("```json")) textOutput = textOutput.substring(7);
            else if (textOutput.startsWith("```")) textOutput = textOutput.substring(3);
            if (textOutput.endsWith("```")) textOutput = textOutput.slice(0, -3);

            return res.json(JSON.parse(textOutput.trim()));
        }

    } catch (error) {
        console.error("Plan error:", error);
        res.status(500).json({ error: error.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Food Analyzer Server running at http://localhost:${PORT}`);
});
server.on('error', (e) => {
    console.error("Server error:", e);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});