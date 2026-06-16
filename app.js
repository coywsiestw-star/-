/* ==========================================================================
   BioNutrient.AI - Client-side Interactive Logic
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, initializeFirestore, persistentLocalCache, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  projectId: "food-analyzer-ai-2026",
  appId: "1:835641669105:web:368dbacf2848337f0e8050",
  storageBucket: "food-analyzer-ai-2026.firebasestorage.app",
  apiKey: "AIzaSyD_VTqGFdByUG-eMirlYG7q34xljO6Xo4g",
  authDomain: "food-analyzer-ai-2026.firebaseapp.com",
  messagingSenderId: "835641669105"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

// Clean up old cached "火锅" to enforce new constraints
try {
    deleteDoc(doc(db, "foods", "火锅"));
    console.log("[Firebase] Cleaned up legacy '火锅' cache");
} catch(e) {}

// --- Fallback Mock Data (Seeds to Firebase automatically) ---
const mockData = {
    "西兰花": {
        name: "西兰花",
        scientificName: "Brassica oleracea var. italica",
        image: "assets/broccoli.png",
        score: 96,
        ratingTitle: "极力推荐食用",
        ratingDesc: "富含强效抗癌活性的黑芥子酶及还原态抗氧化成分，高膳食纤维，极低卡路里。",
        calories: "34 kcal",
        macros: {
            carbs: "6.6g",
            protein: "2.8g",
            fat: "0.4g",
            carbsPct: 35,
            proteinPct: 45,
            fatPct: 10
        },
        water: 89.3,
        compounds: [
            {
                name: "萝卜硫素",
                scientific: "Sulforaphane",
                desc: "天然强效的抗氧化剂，能激活人体细胞的 Nrf2 基因表达，促进二相解毒酶分泌，具有显著的防癌及抗炎特性。",
                tag: "异硫氰酸酯类",
                icon: "shield"
            },
            {
                name: "叶黄素与玉米黄质",
                scientific: "Lutein & Zeaxanthin",
                desc: "积聚在视网膜黄斑区的类胡萝卜素，能有效过滤高能有害蓝光，保护感光细胞免受氧化损伤。",
                tag: "类胡萝卜素",
                icon: "eye"
            },
            {
                name: "吲哚-3-甲醇",
                scientific: "Indole-3-carbinol",
                desc: "主要存在于十字花科蔬菜中，能在体内辅助平衡雌激素代谢，促进健康的细胞生长周期。",
                tag: "有机硫化物",
                icon: "activity"
            }
        ],
        micros: [
            { name: "维生素 C", amount: "89.2 mg", pct: 99, color: "cyan" },
            { name: "维生素 K", amount: "101.6 mcg", pct: 85, color: "cyan" },
            { name: "叶酸 (B9)", amount: "63.0 mcg", pct: 16, color: "cyan" },
            { name: "钾", amount: "316.0 mg", pct: 9, color: "cyan" },
            { name: "钙", amount: "47.0 mg", pct: 5, color: "cyan" },
            { name: "铁", amount: "0.73 mg", pct: 4, color: "cyan" }
        ]
    },
    "蓝莓": {
        name: "蓝莓",
        scientificName: "Vaccinium corymbosum",
        image: "assets/blueberry.png",
        score: 94,
        ratingTitle: "极佳抗氧化食材",
        ratingDesc: "自然界中活性花青素含量最高的食物之一，对心脑血管和记忆力具有显著保护作用。",
        calories: "57 kcal",
        macros: {
            carbs: "14.5g",
            protein: "0.7g",
            fat: "0.3g",
            carbsPct: 75,
            proteinPct: 12,
            fatPct: 8
        },
        water: 84.2,
        compounds: [
            {
                name: "花青素",
                scientific: "Anthocyanins",
                desc: "水溶性天然色素，可清除自由基，维护微细血管弹性，能够穿透血脑屏障保护神经细胞。",
                tag: "黄酮类化合物",
                icon: "zap"
            },
            {
                name: "紫檀芪",
                scientific: "Pterostilbene",
                desc: "白藜芦醇的天然类似物，脂溶性更好，易于吸收。有助于控制血糖并抑制炎症信号通路。",
                tag: "二苯乙烯类",
                icon: "heart"
            },
            {
                name: "鞣花酸",
                scientific: "Ellagic Acid",
                desc: "一种多酚成分，具有凝血调节及抑制微生物繁殖活性，能够减轻紫外线引起的胶原蛋白降解。",
                tag: "植物多酚",
                icon: "shield-alert"
            }
        ],
        micros: [
            { name: "维生素 K", amount: "19.3 mcg", pct: 24, color: "cyan" },
            { name: "维生素 C", amount: "9.7 mg", pct: 16, color: "cyan" },
            { name: "锰", amount: "0.33 mg", pct: 16, color: "cyan" },
            { name: "膳食纤维", amount: "2.4 g", pct: 10, color: "cyan" },
            { name: "维生素 E", amount: "0.57 mg", pct: 4, color: "cyan" },
            { name: "钾", amount: "77.0 mg", pct: 2, color: "cyan" }
        ]
    },
    "番茄": {
        name: "番茄",
        scientificName: "Solanum lycopersicum",
        image: "assets/tomato.png",
        score: 91,
        ratingTitle: "营养均衡常青藤",
        ratingDesc: "富含脂溶性番茄红素，熟食更易吸收，能降低心血管疾病发生风险，维持前列腺健康。",
        calories: "18 kcal",
        macros: {
            carbs: "3.9g",
            protein: "0.9g",
            fat: "0.2g",
            carbsPct: 20,
            proteinPct: 15,
            fatPct: 5
        },
        water: 94.5,
        compounds: [
            {
                name: "番茄红素",
                scientific: "Lycopene",
                desc: "极强的单线态氧消除剂，对细胞膜脂质防过氧化损伤能力优异，在红色成熟茄科食物中含量最丰富。",
                tag: "类胡萝卜素",
                icon: "heart-pulse"
            },
            {
                name: "谷胱甘肽",
                scientific: "Glutathione",
                desc: "人体核心排毒与免疫活性分子，番茄中含有其植物前体，能协同维C共同对抗细胞脂质过氧化。",
                tag: "三肽化合物",
                icon: "shield"
            },
            {
                name: "槲皮素",
                scientific: "Quercetin",
                desc: "天然黄酮醇类物质，能抑制肥大细胞释放组胺，从而具备天然的抗过敏及稳定血管活性。",
                tag: "黄酮类化合物",
                icon: "thermometer"
            }
        ],
        micros: [
            { name: "维生素 C", amount: "13.7 mg", pct: 23, color: "cyan" },
            { name: "维生素 A", amount: "42.0 mcg", pct: 17, color: "cyan" },
            { name: "钾", amount: "237.0 mg", pct: 7, color: "cyan" },
            { name: "维生素 K", amount: "7.9 mcg", pct: 7, color: "cyan" },
            { name: "叶酸 (B9)", amount: "15.0 mcg", pct: 4, color: "cyan" },
            { name: "镁", amount: "11.0 mg", pct: 3, color: "cyan" }
        ]
    },
    "牛肉": {
        name: "牛肉",
        scientificName: "Bos taurus",
        image: "assets/beef.png",
        score: 85,
        ratingTitle: "优质高蛋白食材",
        ratingDesc: "富含高质量的完全蛋白质、血红素铁和B族维生素，有助于肌肉合成与红细胞健康。",
        calories: "250 kcal",
        macros: {
            carbs: "0.0g",
            protein: "26.1g",
            fat: "15.4g",
            carbsPct: 0,
            proteinPct: 62,
            fatPct: 38
        },
        water: 63.8,
        compounds: [
            {
                name: "肌酸",
                scientific: "Creatine",
                desc: "在肌肉细胞中以磷酸肌酸形式存在，能在高强度爆发运动中快速再合成ATP（能量货币），提升肌肉爆发力与耐力。",
                tag: "含氮有机酸",
                icon: "zap"
            },
            {
                name: "肌肽",
                scientific: "Carnosine",
                desc: "强效细胞抗氧化剂，主要积聚在脑和肌肉组织中，能缓冲肌肉运动产生的酸性物质，减轻肌肉疲劳感。",
                tag: "二肽化合物",
                icon: "shield"
            },
            {
                name: "共轭亚油酸",
                scientific: "Conjugated Linoleic Acid",
                desc: "反刍动物肉类中特有的不饱和脂肪酸，有助于辅助脂肪代谢，支持健康的免疫响应。",
                tag: "不饱和脂肪酸",
                icon: "activity"
            }
        ],
        micros: [
            { name: "维生素 B12", amount: "2.6 mcg", pct: 108, color: "cyan" },
            { name: "锌", amount: "6.3 mg", pct: 57, color: "cyan" },
            { name: "硒", amount: "22.3 mcg", pct: 41, color: "cyan" },
            { name: "血红素铁", amount: "2.6 mg", pct: 14, color: "cyan" },
            { name: "维生素 B6", amount: "0.4 mg", pct: 20, color: "cyan" },
            { name: "磷", amount: "210.0 mg", pct: 21, color: "cyan" }
        ]
    },
    "猪肉": {
        name: "猪肉",
        scientificName: "Sus scrofa domesticus",
        image: "assets/pork.png",
        score: 78,
        ratingTitle: "常见高能量蛋白质来源",
        ratingDesc: "富含B族维生素（特别是维生素B1），能有效促进糖类代谢与能量转化，富含血红素铁。",
        calories: "297 kcal",
        macros: {
            carbs: "0.0g",
            protein: "18.5g",
            fat: "27.2g",
            carbsPct: 0,
            proteinPct: 40,
            fatPct: 60
        },
        water: 53.0,
        compounds: [
            {
                name: "硫胺素 (维生素 B1)",
                scientific: "Thiamine",
                desc: "人体糖代谢辅酶的重要成分，帮助快速将碳水化合物转化为能量，也是维持神经肌肉传导正常的关键物质。",
                tag: "B族维生素 / 辅酶",
                icon: "zap"
            },
            {
                name: "肌红蛋白",
                scientific: "Myoglobin",
                desc: "存在于肌肉组织中的色素蛋白，能够与氧气进行可逆性结合，在肌肉高强度活动缺氧时释放储备 of 氧气。",
                tag: "色素结合蛋白",
                icon: "shield"
            },
            {
                name: "肌肽",
                scientific: "Carnosine",
                desc: "具优秀的细胞抗氧化和抗糖化效应，保护毛细血管，有助于缓冲运动后肌肉堆积的乳酸。",
                tag: "二肽化合物",
                icon: "activity"
            }
        ],
        micros: [
            { name: "维生素 B1 (硫胺素)", amount: "0.96 mg", pct: 80, color: "cyan" },
            { name: "维生素 B6", amount: "0.46 mg", pct: 23, color: "cyan" },
            { name: "磷", amount: "190.0 mg", pct: 19, color: "cyan" },
            { name: "锌", amount: "2.1 mg", pct: 19, color: "cyan" },
            { name: "血红素铁", amount: "1.29 mg", pct: 7, color: "cyan" },
            { name: "钾", amount: "270.0 mg", pct: 6, color: "cyan" }
        ]
    }
};

// --- DOM Reference Cache ---
const screens = {
    input: document.getElementById('screen-input'),
    loading: document.getElementById('screen-loading'),
    dashboard: document.getElementById('screen-dashboard')
};

const elements = {
    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    
    // Upload & Search
    dragZone: document.getElementById('drag-zone'),
    fileInput: document.getElementById('file-input'),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    tagButtons: document.querySelectorAll('.tag-btn'),
    
    // Loading Animation
    loadingPreview: document.getElementById('loading-preview'),
    loadingPlaceholder: document.getElementById('loading-placeholder'),
    steps: [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ],
    
    // Dashboard Data Display
    btnBack: document.getElementById('btn-back-to-scan'),
    foodName: document.getElementById('display-food-name'),
    scientificName: document.getElementById('display-scientific-name'),
    foodImage: document.getElementById('display-food-image'),
    score: document.getElementById('display-score'),
    scoreProgressBar: document.getElementById('score-progress-bar'),
    ratingTitle: document.getElementById('display-rating-title'),
    ratingDesc: document.getElementById('display-rating-desc'),
    displayCalories: document.getElementById('display-calories'),
    
    // Macros
    macroCarbs: document.getElementById('macro-carbs'),
    macroProtein: document.getElementById('macro-protein'),
    macroFat: document.getElementById('macro-fat'),
    barCarbs: document.getElementById('bar-carbs'),
    barProtein: document.getElementById('bar-protein'),
    barFat: document.getElementById('bar-fat'),
    
    // Water
    waterPercentage: document.getElementById('display-water-percent'),
    waterWave: document.getElementById('water-wave'),
    waterChart: document.getElementById('waterChart'),
    toastNotification: document.getElementById('toastNotification'),
    toastMessage: document.getElementById('toastMessage'),
    
    // Dynamic lists
    compoundsContainer: document.getElementById('display-compounds'),
    microsContainer: document.getElementById('display-micros'),

    // Settings Panel controls
    settingsToggle: document.getElementById('btn-toggle-settings'),
    settingsPanel: document.getElementById('settings-panel'),
    apiProviderSelect: document.getElementById('select-api-provider'),
    apiKeyInput: document.getElementById('input-api-key'),
    btnSaveKey: document.getElementById('btn-save-key'),
    btnClearKey: document.getElementById('btn-clear-key'),
    apiStatusDot: document.getElementById('api-status-dot'),
    apiStatusText: document.getElementById('api-status-text')
};

// Custom Toast Logic
function showToast(message) {
    if (!elements.toastNotification) return;
    elements.toastMessage.textContent = message;
    elements.toastNotification.classList.remove('toast-hidden');
    elements.toastNotification.classList.add('toast-visible');
    
    setTimeout(() => {
        elements.toastNotification.classList.remove('toast-visible');
        elements.toastNotification.classList.add('toast-hidden');
    }, 4500);
}

// --- Active API State ---
let apiProvider = localStorage.getItem('api_provider') || 'gemini';
let apiKey = localStorage.getItem('api_key') || '';
let backendHasKey = false;
let backendStatus = { geminiConfigured: false, deepseekConfigured: false };

async function checkBackendStatus() {
    try {
        const response = await fetch('/api/status');
        if (response.ok) {
            backendStatus = await response.json();
            
            // Auto-switch provider if the user hasn't explicitly set a local key, 
            // and the current provider isn't configured on the backend, but the other one is.
            if (!apiKey) {
                if (apiProvider === 'gemini' && !backendStatus.geminiConfigured && backendStatus.deepseekConfigured) {
                    apiProvider = 'deepseek';
                    localStorage.setItem('api_provider', 'deepseek');
                } else if (apiProvider === 'deepseek' && !backendStatus.deepseekConfigured && backendStatus.geminiConfigured) {
                    apiProvider = 'gemini';
                    localStorage.setItem('api_provider', 'gemini');
                }
            }

            backendHasKey = backendStatus.geminiConfigured || backendStatus.deepseekConfigured;
            updateOnlineStatusUI();
            
            // Update dropdown UI if it exists
            if (elements.apiProviderSelect) {
                elements.apiProviderSelect.value = apiProvider;
            }
        }
    } catch (error) {
        console.error('获取后端共享 Key 状态失败:', error);
    }
}

// --- Initialize Lucide Icons & Settings ---
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize tsParticles
    if (window.tsParticles) {
        window.tsParticles.load("tsparticles", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: { enable: true, mode: "push" },
                    onHover: { enable: true, mode: "grab" },
                    resize: true
                },
                modes: {
                    push: { quantity: 3 },
                    grab: { distance: 150, links: { opacity: 0.6, color: "#10b981" } }
                }
            },
            particles: {
                color: { value: ["#10b981", "#ffffff", "#888888"] },
                links: {
                    color: "#10b981",
                    distance: 150,
                    enable: true,
                    opacity: 0.15,
                    width: 1
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "out" },
                    random: true,
                    speed: 0.8,
                    straight: false
                },
                number: { density: { enable: true, area: 800 }, value: 50 },
                opacity: { value: 0.4 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 2.5 } }
            },
            detectRetina: true
        });
    }

    await checkBackendStatus();
    if (window.lucide) {
        window.lucide.createIcons();
    }
    initApiSettings();
    setupEventListeners();
    checkBackendStatus();
});

// --- Dynamic Online Status UI Updater ---
function updateOnlineStatusUI() {
    const hasLocalKey = !!apiKey;
    const hasSharedKey = (apiProvider === 'gemini' && backendStatus.geminiConfigured) || 
                         (apiProvider === 'deepseek' && backendStatus.deepseekConfigured);
    
    if (hasLocalKey) {
        elements.apiStatusDot.className = 'status-dot green';
        elements.apiStatusText.textContent = `${apiProvider === 'gemini' ? 'Gemini' : 'DeepSeek'} 实时 AI 就绪`;
        elements.apiKeyInput.placeholder = '已配置 API Key (可输入新 Key 覆盖)';
    } else if (hasSharedKey) {
        elements.apiStatusDot.className = 'status-dot green';
        elements.apiStatusText.textContent = `${apiProvider === 'gemini' ? 'Gemini' : 'DeepSeek'} 实时 AI 就绪 (共享模式)`;
        elements.apiKeyInput.placeholder = '已启用服务器共享 Key (可输入覆盖)';
    } else {
        elements.apiStatusDot.className = 'status-dot yellow';
        elements.apiStatusText.textContent = '离线演示模式';
        elements.apiKeyInput.placeholder = '输入 API Key';
    }
}

// --- API Settings Initialization ---


function initApiSettings() {
    elements.apiProviderSelect.value = apiProvider;
    if (apiKey) {
        elements.apiKeyInput.value = '';
        elements.btnSaveKey.style.display = 'block'; // Always show save button so provider can be updated
        elements.btnClearKey.style.display = 'block';
    } else if (backendHasKey) {
        elements.apiKeyInput.value = '';
        elements.apiKeyInput.placeholder = '共享模式，无需输入 Key';
        elements.btnSaveKey.style.display = 'block';
        elements.btnClearKey.style.display = 'none';
        elements.apiStatusDot.className = 'status-dot green';
        elements.apiStatusText.textContent = '共享实时 AI 就绪';
    } else {
        elements.apiKeyInput.value = '';
        elements.btnSaveKey.style.display = 'block';
        elements.btnClearKey.style.display = 'none';
    }
    updateOnlineStatusUI();
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Toggle Settings Panel
    elements.settingsToggle.addEventListener('click', () => {
        elements.settingsPanel.classList.toggle('active');
    });

    // Save Key & Provider
    elements.btnSaveKey.addEventListener('click', () => {
        const provider = elements.apiProviderSelect.value;
        const inputKey = elements.apiKeyInput.value.trim();
        
        // If they pasted a new key, save it.
        if (inputKey) {
            localStorage.setItem('api_key', inputKey);
            apiKey = inputKey;
        }

        // Save provider regardless of local Key availability
        localStorage.setItem('api_provider', provider);
        apiProvider = provider;
        initApiSettings();
        elements.settingsPanel.classList.remove('active');
    });

    // Clear Key
    elements.btnClearKey.addEventListener('click', () => {
        localStorage.removeItem('api_key');
        apiKey = '';
        initApiSettings();
        elements.settingsPanel.classList.remove('active');
    });

    // Tab switching
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            elements.tabButtons.forEach(b => b.classList.remove('active'));
            elements.tabPanes.forEach(pane => pane.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });

    // Drag and drop events
    const dz = elements.dragZone;
    ['dragenter', 'dragover'].forEach(eventName => {
        dz.addEventListener(eventName, (e) => {
            e.preventDefault();
            dz.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dz.addEventListener(eventName, (e) => {
            e.preventDefault();
            dz.classList.remove('dragover');
        }, false);
    });

    dz.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleUploadedFile(files[0]);
        }
    });

    dz.addEventListener('click', () => {
        elements.fileInput.click();
    });

    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUploadedFile(e.target.files[0]);
        }
    });

    // Search Form
    elements.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = elements.searchInput.value.trim();
        if (query) {
            startAnalysisPipeline(query, null);
        }
    });

    // Quick tag buttons
    elements.tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const foodName = btn.getAttribute('data-food');
            startAnalysisPipeline(foodName, null);
        });
    });

    // Back to scanner button
    elements.btnBack.addEventListener('click', () => {
        switchScreen('input');
        // Reset loading states
        elements.steps.forEach(step => {
            step.className = 'step';
            step.querySelector('.step-icon').setAttribute('data-lucide', 'circle');
        });
        if (window.lucide) window.lucide.createIcons();
    });
}

/* ==========================================================================
   Global Navigation
   ========================================================================== */
const globalNavBtns = document.querySelectorAll('.global-nav-btn');
globalNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        globalNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        // Show target
        const targetScreen = btn.getAttribute('data-screen');
        const screenEl = document.getElementById(targetScreen);
        if (screenEl) screenEl.classList.add('active');
    });
});


/* ==========================================================================
   Wizard Navigation Logic
   ========================================================================== */
function goToWizardStep(stepNum) {
    document.querySelectorAll('.wizard-pane').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`wizard-step-${stepNum}`);
    if (target) target.classList.remove('hidden');
    
    document.querySelectorAll('.wizard-step-indicator').forEach(i => {
        if (parseInt(i.getAttribute('data-step')) <= stepNum) {
            i.classList.add('active');
        } else {
            i.classList.remove('active');
        }
    });
}

document.querySelectorAll('.btn-wizard-back').forEach(btn => {
    btn.addEventListener('click', () => {
        goToWizardStep(btn.getAttribute('data-target'));
    });
});


/* ==========================================================================
   Tag Selection Modal Logic
   ========================================================================== */
const modal = document.getElementById('tag-selection-modal');
const btnOpenModal = document.getElementById('btn-open-tag-modal');
const btnCloseModal = document.getElementById('btn-close-tag-modal');
const btnConfirmTags = document.getElementById('btn-confirm-tags');
const selectedTagsDisplay = document.getElementById('btn-open-tag-modal');

btnOpenModal.addEventListener('click', () => {
    modal.classList.add('active');
});

btnCloseModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Click outside to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

btnConfirmTags.addEventListener('click', () => {
    modal.classList.remove('active');
    // Read tags and display
    const activeTags = document.querySelectorAll('#tag-selection-modal .filter-tag.active');
    selectedTagsDisplay.innerHTML = '';
    if (activeTags.length === 0) {
        selectedTagsDisplay.innerHTML = '<span id="selected-tags-placeholder" style="color: rgba(255,255,255,0.4); font-size: 0.95rem; transition: color 0.3s;">尚未选择偏好标签，点击添加...</span>';
    } else {
        activeTags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'filter-tag active';
            span.textContent = tag.textContent;
            // Prevent interaction on these display chips
            span.style.cursor = 'pointer'; // let pointer events pass to parent
            selectedTagsDisplay.appendChild(span);
        });
    }
});

/* ==========================================================================
   Smart Recommendation Engine Logic
   ========================================================================== */
const filterTags = document.querySelectorAll('.filter-tag');
const btnGenerateRecommend = document.getElementById('btn-generate-recommend');
const recommendLoading = document.getElementById('recommend-loading');
const recommendKanban = document.getElementById('recommend-kanban');

// Handle multi-select tags
filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('active');
    });
});

// Generate Recommendations
// Particle Effect Logic
function createParticles(e, button) {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'btn-particle';
        
        // Random size
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Initial position (center of click)
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random end position
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        button.appendChild(particle);
        
        // Remove after animation
        setTimeout(() => particle.remove(), 1000);
    }
}

btnGenerateRecommend.addEventListener('click', async (e) => {
    createParticles(e, btnGenerateRecommend);
    
    const activeTags = Array.from(document.querySelectorAll('#screen-recommend .filter-tag.active')).map(t => t.textContent.trim());
    
    if (activeTags.length === 0) {
        showToast("请至少选择一个筛选标签进行探索哦！");
        return;
    }

    // Prepare Cache Key
    // Sort tags to ensure combination order doesn't matter for caching
    const sortedTags = [...activeTags].sort();
    const cacheKeyId = sortedTags.join("_");

    // Reset UI
    recommendKanban.classList.add('hidden');
    document.querySelectorAll('.kanban-body').forEach(el => el.innerHTML = '');
    recommendLoading.classList.remove('hidden');

    try {
        // 1. Try Firebase Cache First
        let recommendations = null;
        try {
            const cacheDoc = await getDoc(doc(db, "recommendations", cacheKeyId));
            if (cacheDoc.exists()) {
                const cachedData = cacheDoc.data().items;
                // Ignore legacy array cache
                if (cachedData && !Array.isArray(cachedData) && cachedData.carbs) {
                    recommendations = cachedData;
                    console.log("[Firebase] Loaded recommendations from cache:", cacheKeyId);
                } else {
                    console.log("[Firebase] Ignored legacy cache format");
                }
            }
        } catch (e) {
            console.warn("[Firebase] Cache error, falling back to API:", e);
        }

        // 2. Fallback to AI API
        if (!recommendations) {
            const response = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: apiProvider,
                    apiKey: localStorage.getItem('api_key') || '',
                    tags: sortedTags
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "推荐请求失败");
            }

            recommendations = await response.json();

            // Store in Firebase for future users
            try {
                await setDoc(doc(db, "recommendations", cacheKeyId), {
                    tags: sortedTags,
                    items: recommendations,
                    timestamp: new Date().toISOString()
                });
                console.log("[Firebase] Saved new recommendations to cache.");
            } catch (e) {
                console.warn("[Firebase] Could not save cache:", e);
            }
        }

        // 3. Render Kanban
        renderRecommendationKanban(recommendations);

    } catch (error) {
        console.error("Recommend error:", error);
        showToast(error.message);
        recommendLoading.classList.add('hidden');
    }
});

function renderRecommendationKanban(recommendationsData) {
    recommendLoading.classList.add('hidden');
    
    // Clear all columns
    document.querySelectorAll('.kanban-body').forEach(el => el.innerHTML = '');
    recommendKanban.classList.remove('hidden');

    if (!recommendationsData || Array.isArray(recommendationsData)) {
        showToast("数据格式异常，请重新生成或更换条件。");
        return;
    }

    const columnsMap = {
        'carbs': document.querySelector('#col-carbs .kanban-body'),
        'superfoods': document.querySelector('#col-superfoods .kanban-body'),
        'protein': document.querySelector('#col-protein .kanban-body'),
        'fat': document.querySelector('#col-fat .kanban-body'),
        'other': document.querySelector('#col-other .kanban-body')
    };

    // Iterate through the 5 categories
    Object.keys(columnsMap).forEach(key => {
        const container = columnsMap[key];
        const items = recommendationsData[key] || [];

        // Sort items by priority just in case AI didn't strictly sort them
        items.sort((a, b) => (a.priority || 99) - (b.priority || 99));

        if (items.length === 0) {
            container.innerHTML = '<div style="opacity: 0.5; font-size: 0.9rem; text-align: center; padding-top: 1rem;">暂无推荐</div>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'recommend-card';
            card.innerHTML = `
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase;">优先级 ${item.priority || '-'}</div>
                <h3 class="recommend-name" style="margin: 0; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center;">
                    ${item.name} <i data-lucide="arrow-right-circle" style="width: 18px; opacity: 0.5;"></i>
                </h3>
                <p class="recommend-reason" style="font-size: 0.85rem; line-height: 1.4; opacity: 0.8; margin: 0;">${item.reason}</p>
            `;

            // Click to analyze this specific food
            card.addEventListener('click', () => {
                // Switch back to search UI and run pipeline
                const navBtn = document.querySelector('[data-screen="screen-input"]');
                if(navBtn) navBtn.click();
                
                startAnalysisPipeline(item.name);
            });

            container.appendChild(card);
        });
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --- File Upload Handler ---
function handleUploadedFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('请上传有效的食物图像文件');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageSrc = e.target.result;
        
        const hasSharedKey = (apiProvider === 'gemini' && backendStatus.geminiConfigured) || 
                             (apiProvider === 'deepseek' && backendStatus.deepseekConfigured);
        if (apiKey || hasSharedKey) {
            if (apiProvider === 'gemini') {
                startAnalysisWithImage(imageSrc);
            } else {
                alert('DeepSeek 目前暂不支持多模态视觉识别，已自动切换为本地离线匹配模式。你可以使用文字搜索功能来调用 DeepSeek 分析任意食物！');
                const keys = Object.keys(foodDatabase);
                const randomFood = keys[Math.floor(Math.random() * keys.length)];
                startAnalysisPipeline(randomFood, imageSrc);
            }
        } else {
            const keys = Object.keys(foodDatabase);
            const randomFood = keys[Math.floor(Math.random() * keys.length)];
            startAnalysisPipeline(randomFood, imageSrc);
        }
    };
    reader.readAsDataURL(file);
}

// --- Screen Switching Helper ---
function switchScreen(screenName) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.remove('active');
    });
    
    // Timeout to allow smooth transition animation
    setTimeout(() => {
        screens[screenName].classList.add('active');
    }, 50);
}

// --- Scanning & Analysis Pipeline (Fast Reactive Implementation) ---
async function startAnalysisPipeline(foodName, imageSrc) {
    // 1. Prepare loading screen preview
    if (imageSrc) {
        elements.loadingPreview.src = imageSrc;
        elements.loadingPreview.style.display = 'block';
        elements.loadingPlaceholder.style.display = 'none';
    } else {
        elements.loadingPreview.style.display = 'none';
        elements.loadingPlaceholder.style.display = 'flex';
    }

    switchScreen('loading');

    // Reset loading steps
    elements.steps.forEach(step => {
        step.className = 'step';
        step.querySelector('.step-icon').setAttribute('data-lucide', 'circle');
    });
    if (window.lucide) window.lucide.createIcons();

    // Firebase Data Logic
    try {
        const docRef = doc(db, "foods", foodName);
        
        // 1. Try to read from local IndexedDB cache first
        try {
            const docSnapCache = await getDoc(docRef, { source: 'cache' });
            if (docSnapCache.exists()) {
                console.log("[Firebase] Loaded instantly from local cache!");
                setTimeout(() => {
                    switchScreen('dashboard');
                    renderDashboard(docSnapCache.data(), imageSrc);
                }, 800);
                return;
            }
        } catch (e) {
            console.log("[Firebase] Not in cache, fetching from cloud...");
        }

        // 2. Try to read from Cloud Firestore
        try {
            const docSnapServer = await getDoc(docRef, { source: 'server' });
            if (docSnapServer.exists()) {
                console.log("[Firebase] Loaded from Google Cloud!");
                switchScreen('dashboard');
                renderDashboard(docSnapServer.data(), imageSrc);
                return;
            }
        } catch (e) {
            console.warn("[Firebase] Cloud fetch failed.", e);
        }

        // 3. Fallback to seeding mock data
        if (typeof mockData !== 'undefined' && mockData[foodName]) {
            console.log("[Firebase] Seeding mock data to cloud...");
            try { await setDoc(docRef, mockData[foodName]); } catch(e) {}
            setTimeout(() => {
                switchScreen('dashboard');
                renderDashboard(mockData[foodName], imageSrc);
            }, 800);
            return;
        }
    } catch (firebaseErr) {
        console.error("Firebase error", firebaseErr);
    }

    // 4. Trigger AI Pipeline
    const hasSharedKey = (apiProvider === 'gemini' && backendStatus.geminiConfigured) || 
                         (apiProvider === 'deepseek' && backendStatus.deepseekConfigured);
    const isOnline = !!apiKey || hasSharedKey;
    const fetchPromise = (async () => {
        if (isOnline) {
            return await fetchFoodDetailsFromProxy(foodName, null);
        } else {
            let foodData = foodDatabase[foodName];
            if (!foodData) {
                const key = Object.keys(foodDatabase).find(k => foodName.includes(k) || k.includes(foodName));
                foodData = key ? foodDatabase[key] : foodDatabase["西兰花"];
            }
            await new Promise(r => setTimeout(r, 400));
            return foodData;
        }
    })();

    let animationFinished = false;
    const animateSteps = async () => {
        const delay = isOnline ? 350 : 100;
        for (let i = 0; i < 3; i++) {
            if (animationFinished) break;
            await new Promise(r => setTimeout(r, delay));
            if (animationFinished) break;
            setStepCompleted(elements.steps[i]);
            elements.steps[i+1].className = 'step active';
        }
    };

    const animPromise = animateSteps();

    try {
        const foodData = await fetchPromise;
        animationFinished = true;
        await animPromise;

        for (let i = 0; i < 4; i++) {
            setStepCompleted(elements.steps[i]);
        }

        // Save AI Result
        try {
            const docRef = doc(db, "foods", foodName);
            await setDoc(docRef, foodData);
        } catch(e) {}

        setTimeout(() => {
            renderDashboard(foodData, imageSrc);
            switchScreen('dashboard');
        }, isOnline ? 250 : 100);

    } catch (err) {
        console.error('Analysis failed:', err);
        
        // Handle constraint error
        if (err.message && err.message.includes('NOT_SPECIFIC_FOOD:')) {
            showToast(err.message.split('NOT_SPECIFIC_FOOD:')[1]);
            switchScreen('input');
            return;
        }

        // General fallback
        let foodData = typeof mockData !== 'undefined' ? (mockData[foodName] || mockData["西兰花"]) : null;
        if (!foodData) {
            showToast("加载失败，且没有可用的离线数据。");
            switchScreen('input');
            return;
        }
        
        for (let i = 0; i < 4; i++) setStepCompleted(elements.steps[i]);
        setTimeout(() => {
            renderDashboard(foodData, imageSrc);
            switchScreen('dashboard');
        }, 250);
    }
}

// --- Fetch Food Details from Proxy Backend ---
async function fetchFoodDetailsFromProxy(foodName, imageSrc) {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            provider: apiProvider,
            apiKey: apiKey,
            foodName: foodName,
            imageSrc: imageSrc
        })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP ${response.status}`);
    }

    return await response.json();
}

// --- Image-based query handler via Proxy ---
async function startAnalysisWithImage(imageSrc) {
    // 1. Show scanning screen
    elements.loadingPreview.src = imageSrc;
    elements.loadingPreview.style.display = 'block';
    elements.loadingPlaceholder.style.display = 'none';
    switchScreen('loading');

    // Start scanning timers
    elements.steps.forEach(step => {
        step.className = 'step';
        step.querySelector('.step-icon').setAttribute('data-lucide', 'circle');
    });
    if (window.lucide) window.lucide.createIcons();

    // Trigger stepactive transitions
    elements.steps[0].className = 'step active';

    const fetchPromise = fetchFoodDetailsFromProxy(null, imageSrc);

    let animationFinished = false;
    const animateSteps = async () => {
        for (let i = 0; i < 3; i++) {
            if (animationFinished) break;
            await new Promise(r => setTimeout(r, 450));
            if (animationFinished) break;
            setStepCompleted(elements.steps[i]);
            elements.steps[i+1].className = 'step active';
        }
    };

    const animPromise = animateSteps();

    try {
        const foodData = await fetchPromise;
        animationFinished = true;
        await animPromise;

        for (let i = 0; i < 4; i++) {
            setStepCompleted(elements.steps[i]);
        }

        setTimeout(() => {
            renderDashboard(foodData, imageSrc);
            switchScreen('dashboard');
        }, 250);

    } catch (err) {
        console.error('Image analysis failed:', err);
        alert(`图片识别失败: ${err.message}。已自动为你切换为本地离线匹配模式。`);
        const keys = Object.keys(foodDatabase);
        const randomFood = keys[Math.floor(Math.random() * keys.length)];
        renderDashboard(foodDatabase[randomFood], imageSrc);
        switchScreen('dashboard');
    }
}

function setStepCompleted(stepElement) {
    stepElement.className = 'step completed';
    const icon = stepElement.querySelector('.step-icon');
    icon.setAttribute('data-lucide', 'check-circle');
    if (window.lucide) window.lucide.createIcons();
}

// --- Render Dashboard with Visual Data ---
function renderDashboard(data, customImageSrc) {
    // Name & scientific name
    elements.foodName.textContent = data.name;
    elements.scientificName.textContent = data.scientificName;

    // Handle Image display: if we have an image asset or base64 file, use it.
    // If not (e.g. customized search), render a high-tech rotating SVG molecular model!
    const container = document.querySelector('.food-img-container');
    container.innerHTML = ''; // Clear container

    if (customImageSrc || data.image) {
        const img = document.createElement('img');
        img.className = 'food-showcase-image';
        img.src = customImageSrc || data.image;
        img.alt = data.name;
        container.appendChild(img);
    } else {
        // Render dynamic molecular structure SVG
        const molecularSvg = getMolecularSVG(data.name);
        const div = document.createElement('div');
        div.className = 'molecule-placeholder';
        div.innerHTML = molecularSvg;
        container.appendChild(div);
    }

    // Nutrition Score Meter Animation
    elements.score.textContent = data.score;
    elements.ratingTitle.textContent = data.ratingTitle;
    elements.ratingDesc.textContent = data.ratingDesc;
    
    const strokeDash = 264;
    const offset = strokeDash - (strokeDash * data.score / 100);
    elements.scoreProgressBar.style.strokeDashoffset = offset;

    // Calories
    if (elements.displayCalories) {
        const calString = data.calories || '-- kcal';
        elements.displayCalories.textContent = calString;
        
        const badge = document.getElementById('calories-badge-container');
        const tag = document.getElementById('calories-tag');
        
        if (badge && tag) {
            badge.className = 'calories-badge'; // reset
            const calMatch = calString.match(/(\d+(\.\d+)?)/);
            if (calMatch) {
                const calVal = parseFloat(calMatch[1]);
                if (calVal <= 100) {
                    badge.classList.add('cal-low');
                    tag.textContent = '低热量';
                } else if (calVal <= 250) {
                    badge.classList.add('cal-med');
                    tag.textContent = '中热量';
                } else {
                    badge.classList.add('cal-high');
                    tag.textContent = '高热量';
                }
                tag.style.display = 'inline-block';
            } else {
                badge.classList.add('cal-med');
                tag.style.display = 'none';
            }
        }
    }

    // Macronutrients
    elements.macroCarbs.textContent = data.macros.carbs;
    elements.macroProtein.textContent = data.macros.protein;
    elements.macroFat.textContent = data.macros.fat;
    
    elements.barCarbs.style.width = '0%';
    elements.barProtein.style.width = '0%';
    elements.barFat.style.width = '0%';
    
    // Delayed draw for aesthetic effect
    setTimeout(() => {
        elements.barCarbs.style.width = `${data.macros.carbsPct}%`;
        elements.barProtein.style.width = `${data.macros.proteinPct}%`;
        elements.barFat.style.width = `${data.macros.fatPct}%`;
    }, 200);

    // Water Content wave animation
    elements.waterPercentage.textContent = `${data.water}%`;
    
    const waveTranslate = 100 - data.water;
    elements.waterWave.style.setProperty('--wave-translate-y', `${waveTranslate}%`);
    elements.waterWave.style.transform = `translateY(${waveTranslate}%)`;

    // Render Bioactive Compounds
    elements.compoundsContainer.innerHTML = '';
    data.compounds.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'compound-card';
        card.innerHTML = `
            <div class="compound-icon">
                <i data-lucide="${comp.icon || 'shield'}"></i>
            </div>
            <div class="compound-details">
                <h4>${comp.name} <span>${comp.scientific || ''}</span></h4>
                <p class="compound-desc">${comp.desc}</p>
                <span class="compound-tag">${comp.tag}</span>
            </div>
        `;
        elements.compoundsContainer.appendChild(card);
    });

    // Render Vitamins & Minerals
    elements.microsContainer.innerHTML = '';
    const micros = data.micros || [];
    micros.forEach((micro, idx) => {
        const card = document.createElement('div');
        card.className = 'micro-card';
        card.innerHTML = `
            <div class="micro-header">
                <span class="micro-name">${micro.name}</span>
                <span class="micro-amount">${micro.amount}</span>
            </div>
            <div class="micro-bar-wrapper">
                <div class="micro-progress-track">
                    <div class="micro-progress-fill" id="micro-fill-${idx}"></div>
                </div>
                <span class="micro-pct">${micro.pct}%</span>
            </div>
        `;
        elements.microsContainer.appendChild(card);
        
        setTimeout(() => {
            const fill = document.getElementById(`micro-fill-${idx}`);
            if (fill) fill.style.width = `${micro.pct}%`;
        }, 300 + (idx * 50));
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --- Molecular structure SVG generator ---
function getMolecularSVG(foodName) {
    // Generates a beautiful glowing carbon-ring chemical lattice
    return `
    <svg class="molecule-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Connecting Lattice Lines -->
        <line x1="50" y1="30" x2="67" y2="40" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1.5"/>
        <line x1="67" y1="40" x2="67" y2="60" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1.5"/>
        <line x1="67" y1="60" x2="50" y2="70" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1.5"/>
        <line x1="50" y1="70" x2="33" y2="60" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1.5"/>
        <line x1="33" y1="60" x2="33" y2="40" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1.5"/>
        <line x1="33" y1="40" x2="50" y2="30" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1.5"/>
        
        <!-- Double bonds in carbon ring -->
        <line x1="48" y1="33" x2="36" y2="40" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1"/>
        <line x1="64" y1="42" x2="64" y2="58" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1"/>
        <line x1="48" y1="67" x2="36" y2="60" stroke="rgba(6, 182, 212, 0.4)" stroke-width="1"/>

        <!-- External functional groups chains -->
        <line x1="50" y1="30" x2="50" y2="15" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>
        <line x1="67" y1="40" x2="80" y2="33" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>
        <line x1="67" y1="60" x2="80" y2="67" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>
        <line x1="33" y1="60" x2="20" y2="67" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>
        <line x1="33" y1="40" x2="20" y2="33" stroke="rgba(16, 185, 129, 0.4)" stroke-width="1.5"/>

        <!-- Outer Group Elements Nodes -->
        <circle cx="50" cy="15" r="3" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)"/>
        <text x="47" y="10" fill="#9ca3af" font-size="6" font-family="sans-serif" font-weight="bold">OH</text>

        <circle cx="80" cy="33" r="3" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)"/>
        <text x="85" y="35" fill="#9ca3af" font-size="6" font-family="sans-serif" font-weight="bold">CH3</text>

        <circle cx="80" cy="67" r="3" fill="#8b5cf6" filter="drop-shadow(0 0 3px #8b5cf6)"/>
        <text x="85" y="70" fill="#9ca3af" font-size="6" font-family="sans-serif" font-weight="bold">NH2</text>

        <circle cx="20" cy="67" r="3" fill="#10b981" filter="drop-shadow(0 0 3px #10b981)"/>
        <text x="10" y="70" fill="#9ca3af" font-size="6" font-family="sans-serif" font-weight="bold">COOH</text>

        <circle cx="20" cy="33" r="3" fill="#06b6d4" filter="drop-shadow(0 0 3px #06b6d4)"/>
        <text x="12" y="32" fill="#9ca3af" font-size="6" font-family="sans-serif" font-weight="bold">O</text>

        <!-- Carbon Ring Nodes (Carbon atoms) -->
        <circle cx="50" cy="30" r="2" fill="#f3f4f6"/>
        <circle cx="67" cy="40" r="2" fill="#f3f4f6"/>
        <circle cx="67" cy="60" r="2" fill="#f3f4f6"/>
        <circle cx="50" cy="70" r="2" fill="#f3f4f6"/>
        <circle cx="33" cy="60" r="2" fill="#f3f4f6"/>
        <circle cx="33" cy="40" r="2" fill="#f3f4f6"/>
    </svg>
    `;
}

// --- Personalization Module Logic ---
const inputHeight = document.getElementById('input-height');
const inputWeight = document.getElementById('input-weight');
const inputTargetWeight = document.getElementById('input-target-weight');
const inputTimeframe = document.getElementById('input-timeframe');
const inputNotes = document.getElementById('input-notes');
const bmiBadge = document.getElementById('bmi-badge');
const btnGeneratePlan = document.getElementById('btn-generate-plan');
const planDashboard = document.getElementById('plan-dashboard');

function calculateBMI() {
    const h = parseFloat(inputHeight.value);
    const w = parseFloat(inputWeight.value);
    if (h > 0 && w > 0) {
        const hm = h / 100;
        const bmi = w / (hm * hm);
        bmiBadge.classList.remove('hidden', 'bmi-low', 'bmi-normal', 'bmi-high', 'bmi-obese');
        
        let status = '';
        if (bmi < 18.5) { status = '偏瘦'; bmiBadge.classList.add('bmi-low'); }
        else if (bmi < 24) { status = '正常'; bmiBadge.classList.add('bmi-normal'); }
        else if (bmi < 28) { status = '超重'; bmiBadge.classList.add('bmi-high'); }
        else { status = '肥胖'; bmiBadge.classList.add('bmi-obese'); }
        
        bmiBadge.textContent = `BMI: ${bmi.toFixed(1)} (${status})`;
    } else {
        bmiBadge.classList.add('hidden');
    }
}

inputHeight.addEventListener('input', calculateBMI);
inputWeight.addEventListener('input', calculateBMI);

btnGeneratePlan.addEventListener('click', async (e) => {
    createParticles(e, btnGeneratePlan);
    
    const h = inputHeight.value;
    const w = inputWeight.value;
    const tw = inputTargetWeight.value;
    
    if (!h || !w || !tw) {
        showToast("请先填写身高、当前体重和目标体重数据哦！");
        return;
    }

    const activeTags = Array.from(document.querySelectorAll('#tag-selection-modal .filter-tag.active')).map(t => t.textContent.trim());

    const requestData = {
        provider: apiProvider,
        apiKey: localStorage.getItem('api_key') || '',
        height: h,
        currentWeight: w,
        targetWeight: tw,
        timeframe: inputTimeframe.value,
        notes: inputNotes.value,
        tags: activeTags
    };

    planDashboard.classList.add('hidden');
    const planLoading = document.getElementById('plan-loading');
    planLoading.classList.remove('hidden');

    try {
        const response = await fetch('/api/generate_plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "计划生成失败");
        }

        const planData = await response.json();
        renderPlanDashboard(planData);
    } catch (error) {
        console.error("Plan generate error:", error);
        showToast(error.message);
        planLoading.classList.add('hidden');
    }
});

function renderPlanDashboard(plan) {
    const planLoading = document.getElementById('plan-loading');
    planLoading.classList.add('hidden');
    planDashboard.classList.remove('hidden');
    
    document.getElementById('plan-monthly').textContent = plan.monthly_goal || "暂无月度总目标";
    document.getElementById('plan-weekly').textContent = plan.weekly_goal || "暂无本周目标";
    
    if (plan.daily_goal) {
        document.getElementById('daily-cals').textContent = plan.daily_goal.calories ? plan.daily_goal.calories + ' 千卡' : '--';
        document.getElementById('daily-protein').textContent = plan.daily_goal.protein_g ? plan.daily_goal.protein_g + ' g' : '--';
        document.getElementById('daily-summary').textContent = plan.daily_goal.summary || "";
    }
    
    const mealsContainer = document.getElementById('meals-container');
    mealsContainer.innerHTML = '';
    if (plan.meals && Array.isArray(plan.meals)) {
        plan.meals.forEach(meal => {
            let optionsHtml = '';
            
            // New structure: multiple options
            if (meal.options && Array.isArray(meal.options)) {
                meal.options.forEach(opt => {
                    const foodsHtml = (opt.foods || []).map(f => `<span class="meal-food-item">${f}</span>`).join('');
                    optionsHtml += `
                        <div class="meal-option" style="margin-top: 10px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid var(--neon-mint);">
                            <div style="font-size: 0.85rem; color: #bbb; margin-bottom: 8px; display: flex; align-items: center; gap: 5px;">
                                <i data-lucide="check-circle-2" style="width: 14px;"></i> ${opt.name}
                            </div>
                            <div class="meal-foods" style="margin-top: 0;">${foodsHtml}</div>
                        </div>
                    `;
                });
            } else {
                // Fallback for old cached plans which just had meal.foods
                const foodsHtml = (meal.foods || []).map(f => `<span class="meal-food-item">${f}</span>`).join('');
                optionsHtml = `<div class="meal-foods">${foodsHtml}</div>`;
            }

            mealsContainer.innerHTML += `
                <div class="meal-card" style="padding: 1.5rem;">
                    <div class="meal-title" style="margin-bottom: 0.5rem;">
                        <span><i data-lucide="utensils" style="width:16px; margin-right:4px;"></i>${meal.type}</span>
                        <span class="meal-amount" style="background: rgba(16, 185, 129, 0.1); color: var(--neon-mint); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">${meal.amount}</span>
                    </div>
                    ${optionsHtml}
                </div>
            `;
        });
        // Re-initialize icons for newly added elements
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Export Plan as Image
const btnExportPlan = document.getElementById('btn-export-plan');
if (btnExportPlan) {
    btnExportPlan.addEventListener('click', async () => {
        const dashboard = document.getElementById('plan-dashboard');
        if (!dashboard) return;
        
        // Hide export button during screenshot
        btnExportPlan.style.display = 'none';
        
        // Enhance style temporarily for the screenshot
        const originalBg = dashboard.style.background;
        const originalPadding = dashboard.style.padding;
        const originalRadius = dashboard.style.borderRadius;
        
        dashboard.style.background = '#0d0d12'; // Solid background so text is readable
        dashboard.style.padding = '20px';
        dashboard.style.borderRadius = '16px';
        
        showToast('📸 正在生成长图，请稍候...');
        
        try {
            const canvas = await html2canvas(dashboard, {
                backgroundColor: '#0d0d12',
                scale: 2, // High resolution
                useCORS: true
            });
            const link = document.createElement('a');
            link.download = 'BioNutrient_专属周期饮食计划.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('✅ 计划已成功保存为长图！');
        } catch (error) {
            console.error('Export error:', error);
            showToast('❌ 保存图片失败，请稍后重试');
        } finally {
            // Restore styles
            dashboard.style.background = originalBg;
            dashboard.style.padding = originalPadding;
            dashboard.style.borderRadius = originalRadius;
            btnExportPlan.style.display = 'inline-flex';
        }
    });
}

