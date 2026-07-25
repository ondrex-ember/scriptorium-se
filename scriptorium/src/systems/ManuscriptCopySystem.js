/* ═══ src/systems/ManuscriptCopySystem.js ═══ */
const ManuscriptCopySystem = {
    MANUSCRIPTS: [
        {
            id: 'zalmar_anselm',
            name: 'Žaltář sv. Anselma',
            name_en: 'Psalter of St. Anselm',
            folios: 10,
            icon: '📖',
            vigorCost: 5,
            inkCost: 1,
            rewardResearch: 15,
            rewardParchment: 2,
            desc: 'Krátký modlitební žaltář se zdobenými iniciálami.',
            desc_en: 'A short prayer psalter with illuminated initials.'
        },
        {
            id: 'pravidlo_benedikt',
            name: 'Pravidlo sv. Benedikta',
            name_en: 'Rule of St. Benedict',
            folios: 20,
            icon: '📜',
            vigorCost: 6,
            inkCost: 1,
            rewardResearch: 35,
            rewardParchment: 3,
            desc: 'Základní řeholní řád kázající poslušnost, modlitbu a práci.',
            desc_en: 'Fundamental monastic rule preaching obedience, prayer and labor.'
        },
        {
            id: 'olomoucky_misal',
            name: 'Olomoucký Misál',
            name_en: 'Olomouc Missal',
            folios: 35,
            icon: '📕',
            vigorCost: 8,
            inkCost: 1,
            rewardResearch: 60,
            rewardParchment: 5,
            desc: 'Liturgický kodex s mešními texty a hudební neumovou notací.',
            desc_en: 'Liturgical codex with mass texts and musical neume notation.'
        },
        {
            id: 'physiologus_bestiar',
            name: 'Physiologus & Bestiář',
            name_en: 'Physiologus & Bestiary',
            folios: 50,
            icon: '🐉',
            vigorCost: 10,
            inkCost: 1,
            rewardResearch: 100,
            rewardParchment: 8,
            desc: 'Alegorický spis o bájných i reálných zvířatech a křesťanské symbolice.',
            desc_en: 'Allegorical treatise on mythical and real beasts with Christian symbolism.'
        },
        {
            id: 'kronika_trojanska',
            name: 'Kronika Trojánská',
            name_en: 'Trojan Chronicle',
            folios: 75,
            icon: '⚔️',
            vigorCost: 12,
            inkCost: 2,
            rewardResearch: 160,
            rewardParchment: 12,
            desc: 'Světský epos o pádu Tróje, vyhledávaná četba středověkých učenců.',
            desc_en: 'Secular epic on the fall of Troy, prized reading among medieval scholars.'
        },
        {
            id: 'codex_gigas',
            name: 'Codex Gigas (Ďáblova Bible)',
            name_en: 'Codex Gigas (Devil\'s Bible)',
            folios: 120,
            icon: '👹',
            vigorCost: 15,
            inkCost: 2,
            rewardResearch: 300,
            rewardParchment: 20,
            desc: 'Monumentální foliant obsahující veškeré vědění světa.',
            desc_en: 'Monumental folio containing all the wisdom of the medieval world.'
        }
    ],

    init: function() {
        if (!GameState.manuscriptCopy) {
            GameState.manuscriptCopy = {
                activeId: 'zalmar_anselm',
                progress: {},
                autoCopy: false
            };
        }
        if (!GameState.manuscriptCopy.progress) GameState.manuscriptCopy.progress = {};
    },

    getActiveManuscript: function() {
        this.init();
        const activeId = GameState.manuscriptCopy.activeId || 'zalmar_anselm';
        return this.MANUSCRIPTS.find(m => m.id === activeId) || this.MANUSCRIPTS[0];
    },

    getProgress: function(id) {
        this.init();
        if (!GameState.manuscriptCopy.progress[id]) {
            GameState.manuscriptCopy.progress[id] = { copiedFolios: 0, completedCount: 0 };
        }
        return GameState.manuscriptCopy.progress[id];
    },

    selectManuscript: function(id) {
        this.init();
        GameState.manuscriptCopy.activeId = id;
        if (typeof Game !== 'undefined' && Game.save) Game.save();
        this.renderAll();
    },

    copyFolios: function(count = 1) {
        this.init();
        const ms = this.getActiveManuscript();
        const prog = this.getProgress(ms.id);
        const lang = (GameState.settings && GameState.settings.language) || 'cs';

        let copiedInThisBatch = 0;
        for (let i = 0; i < count; i++) {
            // Check Ink
            const currentInk = GameState.inventory['ink'] || 0;
            if (currentInk < ms.inkCost) {
                if (typeof UI !== 'undefined' && UI.notify) {
                    UI.notify(`⚠️ ${lang==='en'?'Not enough ink!':'Nedostatek inkoustu!'} (${ms.inkCost} ✒️)`, true);
                }
                break;
            }

            // Consume Ink
            GameState.inventory['ink'] = currentInk - ms.inkCost;

            // Vigor cost
            if (typeof VigorSystem !== 'undefined' && VigorSystem.addFatigue) {
                VigorSystem.addFatigue(ms.vigorCost);
            }

            prog.copiedFolios += 1;
            copiedInThisBatch += 1;

            // Check completion
            if (prog.copiedFolios >= ms.folios) {
                prog.copiedFolios = 0;
                prog.completedCount += 1;

                // Grant rewards
                GameState.inventory['research'] = (GameState.inventory['research'] || 0) + ms.rewardResearch;
                GameState.inventory['parchment'] = (GameState.inventory['parchment'] || 0) + ms.rewardParchment;

                const msName = lang === 'en' ? ms.name_en : ms.name;
                if (typeof UI !== 'undefined' && UI.notify) {
                    UI.notify(`🎉 ${lang==='en'?'Completed manuscript copy!':'Dokončen opis rukopisu!'}: ${msName} (+${ms.rewardResearch} 📜, +${ms.rewardParchment} 📄)`);
                }
                break;
            }
        }

        if (copiedInThisBatch > 0) {
            if (typeof Game !== 'undefined' && Game.save) Game.save();
            this.renderAll();
        }
    },

    toggleAutoCopy: function() {
        this.init();
        GameState.manuscriptCopy.autoCopy = !GameState.manuscriptCopy.autoCopy;
        if (GameState.manuscriptCopy.autoCopy) {
            this.startAutoTimer();
        } else {
            this.stopAutoTimer();
        }
        this.renderAll();
    },

    startAutoTimer: function() {
        if (this._autoInterval) clearInterval(this._autoInterval);
        this._autoInterval = setInterval(() => {
            if (GameState.manuscriptCopy && GameState.manuscriptCopy.autoCopy) {
                this.copyFolios(1);
            } else {
                this.stopAutoTimer();
            }
        }, 4000);
    },

    stopAutoTimer: function() {
        if (this._autoInterval) {
            clearInterval(this._autoInterval);
            this._autoInterval = null;
        }
    },

    renderWidget: function() {
        this.init();
        const ms = this.getActiveManuscript();
        const prog = this.getProgress(ms.id);
        const lang = (GameState.settings && GameState.settings.language) || 'cs';

        const msName = lang === 'en' ? ms.name_en : ms.name;
        const total = ms.folios;
        const current = prog.copiedFolios;
        const pct = Math.round((current / total) * 100);

        // Generate folio block indicators
        let folioBlocks = '';
        const maxDisplayFolios = Math.min(total, 30);
        const foliosPerBox = total / maxDisplayFolios;
        for (let i = 0; i < maxDisplayFolios; i++) {
            const isDone = (i + 1) * foliosPerBox <= current;
            folioBlocks += `<div style="width:12px; height:16px; border:1px solid var(--accent-gold); border-radius:2px; background:${isDone ? '#c5a059' : 'rgba(0,0,0,0.15)'}; display:inline-block;" title="Folium ${i+1}"></div>`;
        }

        return `
        <div class="card" style="flex-direction:column; align-items:stretch; border-color:var(--accent-gold); background:rgba(197,160,89,0.12); margin-bottom:15px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:8px;">
                <div>
                    <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--accent-gold); font-family:'Cinzel',serif; font-weight:bold;">
                        ✒️ ${lang==='en'?'Active Manuscript Transcription':'Aktivní opisování rukopisu'}
                    </span>
                    <h3 style="margin:2px 0 0 0; font-family:'Cinzel',serif; font-size:1.1rem; color:var(--ink-primary);">
                        ${ms.icon} ${msName} <span style="font-size:0.85rem; font-weight:normal; opacity:0.8;">(${prog.completedCount}x ${lang==='en'?'copied':'opsáno'})</span>
                    </h3>
                </div>
                <div style="font-family:'Cinzel',serif; font-weight:bold; font-size:1rem; color:var(--accent-gold);">
                    ${current} / ${total} ${lang==='en'?'folios':'folií'} (${pct}%)
                </div>
            </div>

            <!-- Medieval Animated Progress Bar -->
            <div style="width:100%; height:20px; background:rgba(0,0,0,0.25); border:1px solid var(--accent-gold); border-radius:4px; overflow:hidden; position:relative; margin-bottom:8px;">
                <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #9e7d3b 0%, #c5a059 50%, #ffd700 100%); transition:width 0.4s ease; position:relative;">
                    <span style="position:absolute; right:2px; top:-2px; font-size:14px; animation:quillWiggle 1s infinite ease-in-out;">✒️</span>
                </div>
            </div>

            <!-- Folio Blocks Representation -->
            <div style="display:flex; flex-wrap:wrap; gap:3px; margin-bottom:10px; justify-content:center;">
                ${folioBlocks}
            </div>

            <!-- Controls -->
            <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:6px;">
                    <button class="craft-btn" onclick="ManuscriptCopySystem.copyFolios(1)">
                        ✒️ ${lang==='en'?'Copy 1 Folio':'Opsat 1 folium'} (${ms.inkCost} ✒️)
                    </button>
                    <button class="craft-btn" onclick="ManuscriptCopySystem.copyFolios(5)">
                        📜 ${lang==='en'?'Copy 5 Folios':'Opsat 5 folií'}
                    </button>
                </div>
                <div>
                    <button class="action-btn" onclick="ManuscriptCopySystem.toggleAutoCopy()" style="background:${GameState.manuscriptCopy.autoCopy ? '#2e7d32' : 'var(--accent-wax)'};">
                        ⚡ ${lang==='en'?'Auto-transcribe':'Automatika'}: ${GameState.manuscriptCopy.autoCopy ? (lang==='en'?'ON':'ZAP') : (lang==='en'?'OFF':'VYP')}
                    </button>
                </div>
            </div>
        </div>
        `;
    },

    renderPage: function() {
        const el = document.getElementById('lore-manuscripts-content');
        if (!el) return;

        const lang = (GameState.settings && GameState.settings.language) || 'cs';

        let h = this.renderWidget();

        h += `
        <h3 style="margin:20px 0 10px 0; font-family:'Cinzel',serif; color:var(--accent-gold);">
            📚 ${lang==='en'?'Manuscript Catalog':'Katalog rukopisů k opisu'}
        </h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
        `;

        this.MANUSCRIPTS.forEach(ms => {
            const isSelected = (ms.id === GameState.manuscriptCopy.activeId);
            const prog = this.getProgress(ms.id);
            const msName = lang === 'en' ? ms.name_en : ms.name;
            const msDesc = lang === 'en' ? ms.desc_en : ms.desc;

            h += `
            <div class="card" style="border-color:${isSelected ? 'var(--accent-gold)' : 'var(--ink-secondary)'}; background:${isSelected ? 'rgba(197,160,89,0.1)' : 'rgba(0,0,0,0.02)'}; flex-wrap:wrap; gap:12px; align-items:center; box-sizing:border-box; width:100%; max-width:100%; overflow:hidden;">
                <div class="item-icon" style="background:${isSelected ? '#c5a059' : '#e8dec0'}; flex-shrink:0; font-size:1.4rem;">${ms.icon}</div>
                <div style="flex:1 1 200px; min-width:0; overflow-wrap:break-word;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong style="font-size:1rem; font-family:'Cinzel',serif;">${msName}</strong>
                        <span style="font-size:0.75rem; background:rgba(197,160,89,0.2); padding:2px 6px; border-radius:3px; color:var(--accent-gold); font-weight:bold; white-space:nowrap;">${ms.folios} folií</span>
                    </div>
                    <div class="text-sm" style="margin-top:3px; color:var(--ink-secondary); line-height:1.4;">${msDesc}</div>
                    <div class="text-sm" style="margin-top:4px; font-weight:bold; color:var(--accent-gold);">
                        🎁 ${lang==='en'?'Completion Reward':'Odměna za opsání'}: +${ms.rewardResearch} 📜 Zápisky, +${ms.rewardParchment} 📄 Pergamen
                    </div>
                </div>
                <div style="flex:0 0 auto; max-width:100%; align-self:center;">
                    ${isSelected ? `
                        <span style="font-weight:bold; color:var(--accent-gold); font-family:'Cinzel',serif; font-size:0.9rem;">
                            ✓ ${lang==='en'?'Active':'Vybráno'} (${prog.copiedFolios}/${ms.folios})
                        </span>
                    ` : `
                        <button class="craft-btn" onclick="ManuscriptCopySystem.selectManuscript('${ms.id}')">
                            ✒️ ${lang==='en'?'Select':'Vybrat k opisu'}
                        </button>
                    `}
                </div>
            </div>
            `;
        });

        h += `</div>`;
        el.innerHTML = h;
    },

    renderAll: function() {
        const pageEl = document.getElementById('lore-manuscripts-content');
        if (pageEl && pageEl.style.display !== 'none') {
            this.renderPage();
        }
        const researchWidget = document.getElementById('manuscript-copy-widget');
        if (researchWidget) {
            researchWidget.innerHTML = this.renderWidget();
        }
    }
};
