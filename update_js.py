import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add Wizard helper logic right before Smart Recommendation Engine Logic
wizard_logic = """
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

"""
js = js.replace('/* ==========================================================================\n   Smart Recommendation Engine Logic', wizard_logic + '/* ==========================================================================\n   Smart Recommendation Engine Logic')

# 2. Update btnGenerateRecommend and loading
js = js.replace("document.getElementById('btn-generate-recommend')", "document.getElementById('btn-wizard-next-1')")
js = js.replace("document.getElementById('recommend-loading')", "document.getElementById('wizard-loading-2')")

# Insert UI step switch when clicking Next 1
# We find: createParticles(e, btnGenerateRecommend);
js = js.replace("    createParticles(e, btnGenerateRecommend);", "    createParticles(e, btnGenerateRecommend);\n    goToWizardStep(2);")

# Update btnGeneratePlan and loading
js = js.replace("document.getElementById('btn-generate-plan')", "document.getElementById('btn-wizard-next-2')")
# Wait, planLoading might be fetched inline: `document.getElementById('plan-loading')`
js = js.replace("document.getElementById('plan-loading')", "document.getElementById('wizard-loading-3')")

# Insert UI step switch when clicking Next 2
js = js.replace("    createParticles(e, btnGeneratePlan);", "    createParticles(e, btnGeneratePlan);\n    goToWizardStep(3);")

# Update tags query: Both recommend and plan should read from #wizard-step-1
js = js.replace("#screen-recommend .filter-tag.active", "#wizard-step-1 .filter-tag.active")
js = js.replace("#global-profile-drawer .filter-tag.active", "#wizard-step-1 .filter-tag.active")
# Actually, the python script earlier probably changed them back to #screen-recommend or #global-profile-drawer.
# I will just replace .filter-tag.active with #wizard-step-1 .filter-tag.active where it's missing or wrong
js = re.sub(r"document\.querySelectorAll\('([^']+)\.filter-tag\.active'\)", r"document.querySelectorAll('#wizard-step-1 .filter-tag.active')", js)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated app.js for wizard logic")
