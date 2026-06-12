import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Remove Wizard logic completely
js = re.sub(r'/\* ==+ \n   Wizard Navigation Logic\n   ==+ \*/.*?(?=/\* ==+ \n   Smart Recommendation Engine)', '', js, flags=re.DOTALL)

# 2. Add Modal logic before Smart Recommendation Engine
modal_logic = """
/* ==========================================================================
   Tag Selection Modal Logic
   ========================================================================== */
const modal = document.getElementById('tag-selection-modal');
const btnOpenModal = document.getElementById('btn-open-tag-modal');
const btnCloseModal = document.getElementById('btn-close-tag-modal');
const btnConfirmTags = document.getElementById('btn-confirm-tags');
const selectedTagsDisplay = document.getElementById('selected-tags-display');

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
        selectedTagsDisplay.innerHTML = '<span style="color: #888; font-size: 0.85rem; font-style: italic;">尚未选择任何偏好标签</span>';
    } else {
        activeTags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'filter-tag active';
            span.textContent = tag.textContent;
            // Prevent interaction on these display chips
            span.style.cursor = 'default';
            span.style.pointerEvents = 'none';
            selectedTagsDisplay.appendChild(span);
        });
    }
});

"""
js = js.replace('/* ==========================================================================\n   Smart Recommendation Engine Logic', modal_logic + '/* ==========================================================================\n   Smart Recommendation Engine Logic')

# 3. Fix btnGenerateRecommend references
js = js.replace("document.getElementById('btn-wizard-next-1')", "document.getElementById('btn-generate-recommend')")
js = js.replace("document.getElementById('wizard-loading-2')", "document.getElementById('recommend-loading')")
js = js.replace("    createParticles(e, btnGenerateRecommend);\n    goToWizardStep(2);", "    createParticles(e, btnGenerateRecommend);")

# 4. Fix btnGeneratePlan references
js = js.replace("document.getElementById('btn-wizard-next-2')", "document.getElementById('btn-generate-plan')")
js = js.replace("document.getElementById('wizard-loading-3')", "document.getElementById('plan-loading')")
js = js.replace("    createParticles(e, btnGeneratePlan);\n    goToWizardStep(3);", "    createParticles(e, btnGeneratePlan);")

# 5. Fix tags query:
# Recommend should query from #screen-recommend .filter-tag.active
# Plan should query from #tag-selection-modal .filter-tag.active
# Currently they all query from #wizard-step-1 .filter-tag.active
# Wait, I need to be careful. Let's just fix `const activeTags` manually.
# In generate_recommend:
js = js.replace("const activeTags = Array.from(document.querySelectorAll('#wizard-step-1 .filter-tag.active')).map(el => el.textContent.trim());", 
                "const activeTags = Array.from(document.querySelectorAll('#screen-recommend .filter-tag.active')).map(el => el.textContent.trim());")

# In generate_plan:
# It probably also uses #wizard-step-1. We need it to use #tag-selection-modal
# Actually, the python script earlier might have used a regex. Let's just replace all remaining #wizard-step-1 with #tag-selection-modal for safety, because the only other place is inside generate_plan.
js = js.replace("#wizard-step-1 .filter-tag.active", "#tag-selection-modal .filter-tag.active")


with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Done writing app.js for Modal")
