// ═══════════════════════════════════════════════════════════════════════════
// TUTORIAL SYSTEM — Průvodce prvními kroky ve hře
// ═══════════════════════════════════════════════════════════════════════════

const TutorialSystem = {
    _interval: null,

    STEPS: [
        {
            id: 'scavenge',
            title: '1/6: Paběrkování (Získávání zdrojů)',
            title_en: '1/6: Scavenging (Gathering Resources)',
            desc: 'Přejdi do Pracovny → Paběrkování a stiskni tlačítko u akce \'Průzkum okolí\' nebo \'Sběr bylin\' pro získání úštěpků, větve a vláken.',
            desc_en: 'Go to Workroom → Scavenge and click \'Scour the grounds\' or \'Gather herbs\' to collect rocks, sticks, and fibers.',
            check: function() {
                if (!GameState || !GameState.inventory) return false;
                return (GameState.inventory['fiber'] || 0) > 0 ||
                       (GameState.inventory['rock'] || 0) > 0 ||
                       (GameState.inventory['stick'] || 0) > 0 ||
                       (GameState.inventory['sharp_stone'] || 0) > 0 ||
                       (GameState.inventory['stone_knife'] || 0) > 0;
            },
            getTarget: function() {
                const activeScreen = document.querySelector('.screen.active')?.id;
                if (activeScreen !== 'screen-home') {
                    return document.getElementById('nav-home');
                }
                const scavContent = document.getElementById('home-scavenge-content');
                if (!scavContent || scavContent.style.display === 'none') {
                    return document.getElementById('home-sub-scavenge');
                }
                return document.querySelector('button[onclick*="Game.scavenge(\'basic\')"]') ||
                       document.querySelector('button[onclick*="Game.scavenge(\'nature\')"]') ||
                       document.querySelector('button[onclick*="Game.scavenge"]');
            }
        },
        {
            id: 'craft_knife',
            title: '2/6: Výroba kamenného nože',
            title_en: '2/6: Crafting a Stone Knife',
            desc: 'Otevři záložku Výroba. Z vláken vyrob provaz, z kamene úštěpek a následně vyrob Kamenný nůž. Nůž ti zpřístupní lov.',
            desc_en: 'Open the Crafting tab. Craft rope from fibers, sharp stone from rocks, and then craft a Stone Knife. It unlocks hunting.',
            check: function() {
                if (!GameState || !GameState.inventory) return false;
                return (GameState.inventory['stone_knife'] || 0) > 0;
            },
            getTarget: function() {
                const activeScreen = document.querySelector('.screen.active')?.id;
                if (activeScreen !== 'screen-craft') {
                    return document.getElementById('nav-craft');
                }
                const btnKnife = document.querySelector('button[onclick*="stone_knife"]');
                if (btnKnife) return btnKnife;
                const btnRope = document.querySelector('button[onclick*="rope"]');
                if (btnRope) return btnRope;
                const btnStone = document.querySelector('button[onclick*="sharp_stone"]');
                if (btnStone) return btnStone;
                return document.getElementById('screen-craft');
            }
        },
        {
            id: 'hunt_fat',
            title: '3/6: Lov zvěře (Získání tuku)',
            title_en: '3/6: Hunting Game (Obtaining Fat)',
            desc: 'S kamenným nožem se vrať do Pracovny → Paběrkování a stiskni tlačítko u akce \'Lov zvěře\' pro získání tuku.',
            desc_en: 'With your stone knife, return to Workroom → Scavenge and click \'Hunt game\' to obtain fat.',
            check: function() {
                if (!GameState || !GameState.inventory) return false;
                return (GameState.inventory['fat'] || 0) > 0;
            },
            getTarget: function() {
                const activeScreen = document.querySelector('.screen.active')?.id;
                if (activeScreen !== 'screen-home') {
                    return document.getElementById('nav-home');
                }
                const scavContent = document.getElementById('home-scavenge-content');
                if (!scavContent || scavContent.style.display === 'none') {
                    return document.getElementById('home-sub-scavenge');
                }
                return document.querySelector('button[onclick*="Game.scavenge(\'hunt\')"]') || scavContent;
            }
        },
        {
            id: 'craft_candle',
            title: '4/6: Výroba svíčky',
            title_en: '4/6: Crafting a Candle',
            desc: 'Přejdi do záložky Výroba a z tuku a provazu vyrob svíčku.',
            desc_en: 'Switch to the Crafting tab and craft a candle using fat and rope.',
            check: function() {
                if (!GameState || !GameState.inventory) return false;
                return (GameState.inventory['candle'] || 0) > 0;
            },
            getTarget: function() {
                // Ensure candle recipe is visible in tutorial
                if (GameState && GameState.unlockedRecipes && !GameState.unlockedRecipes.includes('candle')) {
                    GameState.unlockedRecipes.push('candle');
                }
                const activeScreen = document.querySelector('.screen.active')?.id;
                if (activeScreen !== 'screen-craft') {
                    return document.getElementById('nav-craft');
                }
                return document.querySelector('button[onclick*="candle"]') || document.getElementById('screen-craft');
            }
        },
        {
            id: 'light_candle',
            title: '5/6: Rozsvícení světla (Svíčka nebo Louč)',
            title_en: '5/6: Lighting the Room (Candle or Torch)',
            desc: 'Vrať se do Pracovny a rozsviť svíčku (nebo louč) pro získání světla potřebného pro studium.',
            desc_en: 'Return to the Workroom and light a candle (or torch) to gain light needed for research.',
            check: function() {
                if (!GameState || !GameState.flags) return false;
                return !!GameState.flags.candleLit || !!GameState.flags.torchLit;
            },
            getTarget: function() {
                const activeScreen = document.querySelector('.screen.active')?.id;
                if (activeScreen !== 'screen-home') {
                    return document.getElementById('nav-home');
                }
                const btnCandle = document.getElementById('btn-light-candle');
                const btnTorch = document.getElementById('btn-light-torch');
                if (btnCandle && !btnCandle.disabled) return btnCandle;
                if (btnTorch && !btnTorch.disabled) return btnTorch;
                return btnCandle || btnTorch || document.getElementById('btn-ignite') || document.getElementById('screen-home');
            }
        },
        {
            id: 'scriptorium_research',
            title: '6/6: Studium ve Scriptoriu',
            title_en: '6/6: Scriptorium & Research',
            desc: 'Se světlem přejdi do záložky Scriptorium a zahaj svůj první výzkum!',
            desc_en: 'With your light source ready, open the Scriptorium tab and begin your research!',
            check: function() {
                const activeScreen = document.querySelector('.screen.active')?.id;
                return activeScreen === 'screen-lore';
            },
            getTarget: function() {
                const activeScreen = document.querySelector('.screen.active')?.id;
                if (activeScreen !== 'screen-lore') {
                    return document.getElementById('nav-lore');
                }
                return document.querySelector('.card button[onclick*="research"]') ||
                       document.querySelector('#screen-lore button') ||
                       document.getElementById('screen-lore');
            }
        }
    ],

    _ensureState: function() {
        if (!GameState) return;
        if (!GameState.tutorial) {
            GameState.tutorial = {
                active: false,
                step: 0,
                completed: false
            };
        }
    },

    init: function() {
        this._ensureState();
        this.startLoop();
    },

    startTutorialFromModal: function() {
        this._ensureState();
        GameState.tutorial.active = true;
        if (GameState.tutorial.completed) {
            GameState.tutorial.step = 0;
            GameState.tutorial.completed = false;
        }
        // Unlock candle recipe if not unlocked
        if (!GameState.unlockedRecipes) GameState.unlockedRecipes = [];
        if (!GameState.unlockedRecipes.includes('candle')) {
            GameState.unlockedRecipes.push('candle');
        }

        if (typeof Game !== 'undefined' && Game.save) Game.save();
        if (typeof UI !== 'undefined' && UI.closeAboutModal) UI.closeAboutModal();
        if (typeof UI !== 'undefined' && UI.notify) UI.notify('🧭 Průvodce hrou aktivován! Sleduj animované šipky.');
        this.render();
    },

    stopTutorial: function() {
        this._ensureState();
        GameState.tutorial.active = false;
        if (typeof Game !== 'undefined' && Game.save) Game.save();
        this.clearOverlay();
        if (typeof UI !== 'undefined' && UI.notify) UI.notify('Průvodce hrou byl pozastaven.');
    },

    resetTutorial: function() {
        this._ensureState();
        GameState.tutorial.step = 0;
        GameState.tutorial.active = true;
        GameState.tutorial.completed = false;
        if (typeof Game !== 'undefined' && Game.save) Game.save();
        this.render();
        if (typeof UI !== 'undefined' && UI.notify) UI.notify('Průvodce hrou byl restartován od 1. kroku.');
    },

    nextStep: function() {
        this._ensureState();
        if (GameState.tutorial.step < this.STEPS.length - 1) {
            GameState.tutorial.step++;
            if (typeof Game !== 'undefined' && Game.save) Game.save();
            if (typeof UI !== 'undefined' && UI.notify) UI.notify('✨ Krok splněn! Pokračujeme dále.');
            this.render();
        } else {
            this.completeTutorial();
        }
    },

    completeTutorial: function() {
        this._ensureState();
        GameState.tutorial.active = false;
        GameState.tutorial.completed = true;
        if (typeof Game !== 'undefined' && Game.save) Game.save();
        this.clearOverlay();

        if (typeof NotificationSystem !== 'undefined' && NotificationSystem.modal) {
            NotificationSystem.modal({
                title: '🎉 Gratulujeme, bratře!',
                body: 'Úspěšně jsi dokončil první kroky v klášterním skriptoriu! Nyní umíš získávat suroviny, vyrábět nástroje, rozsvěcet světlo a bádat v rukopisech. Bůh ti žehnej na další cestě.'
            });
        } else if (typeof UI !== 'undefined' && UI.notify) {
            UI.notify('🎉 Průvodce dokončen! Vítej ve Scriptorium.');
        }
    },

    startLoop: function() {
        if (this._interval) clearInterval(this._interval);
        this._interval = setInterval(() => {
            if (GameState && GameState.tutorial && GameState.tutorial.active && !GameState.tutorial.completed) {
                this.checkProgress();
                this.updateArrowPosition();
            } else {
                this.clearOverlay();
            }
        }, 600);
    },

    checkProgress: function() {
        this._ensureState();
        if (!GameState || !GameState.tutorial || !GameState.tutorial.active || GameState.tutorial.completed) return;

        const current = this.STEPS[GameState.tutorial.step];
        if (current && current.check()) {
            this.nextStep();
        }
    },

    render: function() {
        this._ensureState();
        if (!GameState || !GameState.tutorial || !GameState.tutorial.active || GameState.tutorial.completed) {
            this.clearOverlay();
            return;
        }

        let guideBar = document.getElementById('tutorial-guide-bar');
        if (!guideBar) {
            guideBar = document.createElement('div');
            guideBar.id = 'tutorial-guide-bar';
            document.body.appendChild(guideBar);
        }

        const step = this.STEPS[GameState.tutorial.step];
        const lang = (GameState.settings && GameState.settings.language) || 'cs';
        const isCs = lang === 'cs';

        guideBar.className = 'tutorial-guide-bar';
        guideBar.innerHTML = `
            <div class="tutorial-guide-content">
                <div class="tutorial-guide-badge">🧭 ${isCs ? step.title : step.title_en}</div>
                <div class="tutorial-guide-desc">${isCs ? step.desc : step.desc_en}</div>
            </div>
            <div class="tutorial-guide-actions">
                <button class="tutorial-btn-skip" onclick="TutorialSystem.nextStep()">${isCs ? 'Přeskočit' : 'Skip'}</button>
                <button class="tutorial-btn-close" onclick="TutorialSystem.stopTutorial()" title="Ukončit">✕</button>
            </div>
        `;

        this.updateArrowPosition();
    },

    updateArrowPosition: function() {
        this._ensureState();
        if (!GameState || !GameState.tutorial || !GameState.tutorial.active || GameState.tutorial.completed) {
            this.clearOverlay();
            return;
        }

        const step = this.STEPS[GameState.tutorial.step];
        if (!step) return;

        const targetEl = step.getTarget();
        let arrowEl = document.getElementById('tutorial-animated-arrow');

        if (!targetEl || !this._isVisible(targetEl)) {
            if (arrowEl) arrowEl.style.display = 'none';
            return;
        }

        if (!arrowEl) {
            arrowEl = document.createElement('div');
            arrowEl.id = 'tutorial-animated-arrow';
            arrowEl.className = 'tutorial-arrow-pulse';
            arrowEl.innerHTML = `
                <div class="arrow-icon">👇</div>
                <div class="arrow-label">${(GameState.settings && GameState.settings.language === 'en') ? 'Click here!' : 'Zde klikni!'}</div>
            `;
            document.body.appendChild(arrowEl);
        }

        arrowEl.style.display = 'flex';
        const rect = targetEl.getBoundingClientRect();

        const arrowX = rect.left + (rect.width / 2) - 40;
        const arrowY = rect.top - 65;

        if (arrowY < 10) {
            arrowEl.style.top = (rect.bottom + 10) + 'px';
            arrowEl.querySelector('.arrow-icon').textContent = '👆';
        } else {
            arrowEl.style.top = arrowY + 'px';
            arrowEl.querySelector('.arrow-icon').textContent = '👇';
        }
        arrowEl.style.left = Math.max(10, Math.min(window.innerWidth - 90, arrowX)) + 'px';
    },

    _isVisible: function(el) {
        if (!el) return false;
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    },

    clearOverlay: function() {
        const guideBar = document.getElementById('tutorial-guide-bar');
        if (guideBar) guideBar.remove();
        const arrowEl = document.getElementById('tutorial-animated-arrow');
        if (arrowEl) arrowEl.remove();
    }
};
