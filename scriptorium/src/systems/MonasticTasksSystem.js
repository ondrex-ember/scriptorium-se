/* ═══ src/systems/MonasticTasksSystem.js ═══ */
const MonasticTasksSystem = {
    TASKS: [
        {
            id: 'vigilie',
            icon: '🌌',
            name: 'Vigilie (Noční modlitba)',
            name_en: 'Vigils (Night Prayer)',
            startHour: 2,
            endHour: 5,
            timeDisplay: '02:00 – 05:00',
            desc: 'Noční bdění v chóru, tišící mysl a posilující ducha před svítáním.',
            desc_en: 'Night vigil in the choir, hushing the mind and fortifying the spirit.',
            rewards: { vigor: 15, candle: 1 },
            bonusRewards: { vigor: 10, candle: 1 },
            rewardsText: '+15 Vigor, +1 Svíčka',
            bonusText: '✨ Včasný bonus: +10 Vigor, +1 Svíčka'
        },
        {
            id: 'laudes',
            icon: '🌅',
            name: 'Laudes (Ranní chvály)',
            name_en: 'Lauds (Morning Praise)',
            startHour: 5,
            endHour: 7,
            timeDisplay: '05:00 – 07:00',
            desc: 'Přivítání světla a nového dne posvátnými psalmy a hymny.',
            desc_en: 'Welcoming the light and a new day with holy psalms and hymns.',
            rewards: { research: 2, ink: 1 },
            bonusRewards: { research: 2, ink: 1, vigor: 15 },
            rewardsText: '+2 Zápisky, +1 Inkoust',
            bonusText: '✨ Včasný bonus: +2 Zápisky, +1 Inkoust, +15 Vigor'
        },
        {
            id: 'prima',
            icon: '⚒️',
            name: 'Prima & Labora (Práce a ranní hodinka)',
            name_en: 'Prime & Labora (Morning Work)',
            startHour: 7,
            endHour: 12,
            timeDisplay: '07:00 – 12:00',
            desc: 'Počátek poctivé fyzické i duchovní práce v klášterní dílně či na poli.',
            desc_en: 'The start of honest physical and spiritual work in workshop or field.',
            rewards: { bread: 1, vigor: 15 },
            bonusRewards: { bread: 1, vigor: 15 },
            rewardsText: '+1 Chléb, +15 Vigor',
            bonusText: '✨ Včasný bonus: +1 Chléb, +15 Vigor'
        },
        {
            id: 'sexta',
            icon: '☀️',
            name: 'Sexta & Refectorium (Polední odpočinek)',
            name_en: 'Sext & Refectorium (Midday Rest & Meal)',
            startHour: 12,
            endHour: 15,
            timeDisplay: '12:00 – 15:00',
            desc: 'Společný oběd v refektáři při čtení svatých spisů a polední modlitba.',
            desc_en: 'Common meal in the refectory during holy readings and midday prayer.',
            rewards: { bread: 1, parchment: 1 },
            bonusRewards: { parchment: 1, vigor: 20 },
            rewardsText: '+1 Chléb, +1 Pergamen',
            bonusText: '✨ Včasný bonus: +1 Pergamen, +20 Vigor'
        },
        {
            id: 'nona',
            icon: '📖',
            name: 'Nona & Lectio Divina (Duchovní čtení)',
            name_en: 'None & Lectio Divina (Spiritual Reading)',
            startHour: 15,
            endHour: 18,
            timeDisplay: '15:00 – 18:00',
            desc: 'Odpolední tiché studium rukopisů, meditace a hluboká kontemplace.',
            desc_en: 'Afternoon silent study of manuscripts, meditation and deep contemplation.',
            rewards: { research: 2, ink: 1 },
            bonusRewards: { research: 3, ink: 1 },
            rewardsText: '+2 Zápisky, +1 Inkoust',
            bonusText: '✨ Včasný bonus: +3 Zápisky, +1 Inkoust'
        },
        {
            id: 'vesperae',
            icon: '🌆',
            name: 'Vesperae (Večerní nešpory)',
            name_en: 'Vespers (Evening Prayer)',
            startHour: 18,
            endHour: 20,
            timeDisplay: '18:00 – 20:00',
            desc: 'Děkovná večerní modlitba za plodný den, rozsvěcení oltářních svící.',
            desc_en: 'Evening thanksgiving for a fruitful day, lighting altar candles.',
            rewards: { vigor: 15, candle: 1 },
            bonusRewards: { vigor: 15, candle: 1, research: 2 },
            rewardsText: '+15 Vigor, +1 Svíčka',
            bonusText: '✨ Včasný bonus: +15 Vigor, +1 Svíčka, +2 Zápisky'
        },
        {
            id: 'completorium',
            icon: '🌑',
            name: 'Completorium (Noční závěr)',
            name_en: 'Compline (Night Prayer)',
            startHour: 20,
            endHour: 24,
            timeDisplay: '20:00 – 24:00',
            desc: 'Poslední modlitba před nočním klidem, požehnání a příprava na spánek.',
            desc_en: 'Final prayer before the night silence, blessing and rest.',
            rewards: { parchment: 1, research: 2 },
            bonusRewards: { parchment: 1, research: 3, vigor: 15 },
            rewardsText: '+1 Pergamen, +2 Zápisky',
            bonusText: '✨ Včasný bonus: +1 Pergamen, +3 Zápisky, +15 Vigor'
        }
    ],

    init: function() {
        if (!GameState.monasticTasks) {
            GameState.monasticTasks = {
                lastDate: '',
                completedToday: [],
                streak: 0,
                perfectionClaimedToday: false
            };
        }
        this.checkDateReset();
    },

    getCurrentHour: function() {
        if (typeof TimeSys !== 'undefined' && typeof TimeSys.gameHour === 'function') {
            return TimeSys.gameHour();
        }
        return new Date().getHours();
    },

    getFormattedGameTime: function() {
        const now = new Date();
        let h = now.getHours();
        let m = now.getMinutes();
        if (typeof TimeSys !== 'undefined' && typeof TimeSys.gameHour === 'function') {
            h = TimeSys.gameHour();
            m = now.getMinutes();
        }
        const hs = String(h).padStart(2, '0');
        const ms = String(m).padStart(2, '0');
        return `${hs}:${ms}`;
    },

    isTaskInTimeWindow: function(task) {
        const h = this.getCurrentHour();
        if (task.startHour <= task.endHour) {
            return h >= task.startHour && h < task.endHour;
        } else {
            // Midnight wraparound case
            return h >= task.startHour || h < task.endHour;
        }
    },

    checkDateReset: function() {
        if (!GameState.monasticTasks) this.init();
        const todayStr = new Date().toISOString().split('T')[0];
        if (GameState.monasticTasks.lastDate !== todayStr) {
            if (GameState.monasticTasks.completedToday && GameState.monasticTasks.completedToday.length < this.TASKS.length) {
                if (GameState.monasticTasks.lastDate !== '') {
                    GameState.monasticTasks.streak = 0;
                }
            }
            GameState.monasticTasks.lastDate = todayStr;
            GameState.monasticTasks.completedToday = [];
            GameState.monasticTasks.perfectionClaimedToday = false;
        }
    },

    completeTask: function(taskId) {
        this.checkDateReset();
        if (GameState.monasticTasks.completedToday.includes(taskId)) return;

        const task = this.TASKS.find(t => t.id === taskId);
        if (!task) return;

        const lang = (GameState.settings && GameState.settings.language) || 'cs';

        // Check if inside canonical time window
        const inTime = this.isTaskInTimeWindow(task);
        if (!inTime) {
            if (typeof UI !== 'undefined' && UI.notify) {
                UI.notify(`⏳ ${lang === 'en' ? 'Duty can only be logged during ' : 'Povinnost lze odříkat pouze v čase '}${task.timeDisplay}!`, true);
            }
            return;
        }

        GameState.monasticTasks.completedToday.push(taskId);

        // Apply base rewards + bonus rewards for on-time recitation
        const r = Object.assign({}, task.rewards);
        if (inTime && task.bonusRewards) {
            for (const key in task.bonusRewards) {
                r[key] = (r[key] || 0) + task.bonusRewards[key];
            }
        }

        if (r.research) {
            GameState.inventory['research'] = (GameState.inventory['research'] || 0) + r.research;
        }
        if (r.ink) {
            GameState.inventory['ink'] = (GameState.inventory['ink'] || 0) + r.ink;
        }
        if (r.parchment) {
            GameState.inventory['parchment'] = (GameState.inventory['parchment'] || 0) + r.parchment;
        }
        if (r.candle) {
            GameState.inventory['candle'] = (GameState.inventory['candle'] || 0) + r.candle;
        }
        if (r.bread) {
            GameState.inventory['bread'] = (GameState.inventory['bread'] || 0) + r.bread;
        }
        if (r.vigor) {
            if (typeof VigorSystem !== 'undefined' && VigorSystem.addFatigue) {
                VigorSystem.addFatigue(-r.vigor);
            } else {
                GameState.fatigue = Math.max(0, (GameState.fatigue || 0) - r.vigor);
            }
        }

        const taskName = lang === 'en' ? task.name_en : task.name;
        if (typeof UI !== 'undefined' && UI.notify) {
            const rewardMsg = inTime ? `${task.rewardsText} (${lang === 'en' ? 'Bonus applied!' : 'Aplikován včasný bonus!'})` : task.rewardsText;
            UI.notify(`✝️ ${lang === 'en' ? 'Logged duty' : 'Splněna povinnost'}: ${taskName} (${rewardMsg})`);
        }

        // Check Daily Perfection
        if (GameState.monasticTasks.completedToday.length === this.TASKS.length && !GameState.monasticTasks.perfectionClaimedToday) {
            GameState.monasticTasks.perfectionClaimedToday = true;
            GameState.monasticTasks.streak = (GameState.monasticTasks.streak || 0) + 1;
            
            // Perfection Bonus
            GameState.inventory['research'] = (GameState.inventory['research'] || 0) + 5;
            GameState.inventory['parchment'] = (GameState.inventory['parchment'] || 0) + 2;
            if (typeof VigorSystem !== 'undefined' && VigorSystem.addFatigue) {
                VigorSystem.addFatigue(-30);
            }

            if (typeof UI !== 'undefined' && UI.notify) {
                UI.notify(`👑 ${lang === 'en' ? 'Daily Monastic Perfection!' : 'Dokonalý denní řád!'} (+5 Zápisky, +2 Pergamen, +30 Vigor, Streak: ${GameState.monasticTasks.streak})`);
            }
        }

        if (typeof Game !== 'undefined' && Game.save) Game.save();
        this.render();
    },

    render: function() {
        const el = document.getElementById('lore-tasks-content');
        if (!el) return;
        this.checkDateReset();

        const lang = (GameState.settings && GameState.settings.language) || 'cs';
        const st = GameState.monasticTasks;
        const count = st.completedToday.length;
        const total = this.TASKS.length;
        const pct = Math.round((count / total) * 100);
        const currentTimeStr = this.getFormattedGameTime();
        const currentHour = this.getCurrentHour();

        let h = `
        <div class="card" style="flex-direction:column; align-items:stretch; border-color:var(--accent-gold); background:rgba(197,160,89,0.12); margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
                <div>
                    <h3 style="margin:0; font-family:'Cinzel',serif; color:var(--accent-gold); font-size:1.15rem;">
                        📜 ${lang==='en'?'Horarium — Daily Monastic Duties':'Horarium — Denní mnišské povinnosti'}
                    </h3>
                    <div class="text-sm" style="color:var(--ink-secondary); margin-top:2px;">
                        ${lang==='en'?'Recite the 7 canonical hours in their dedicated time windows for extra grace and rewards.':'Odříkej 7 kanonických hodin v jejich vyhrazených časových oknech pro získání bonusů.'}
                    </div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:1rem; font-family:'Cinzel',serif; font-weight:bold; color:var(--accent-gold);">
                        ⏰ ${lang==='en'?'Monastery Time':'Klášterní čas'}: <span style="font-size:1.1rem; color:#ffd700;">${currentTimeStr}</span>
                    </div>
                    <div class="text-sm" style="opacity:0.95; margin-top:2px;">
                        🔥 ${lang==='en'?'Streak':'Denní řada'}: <strong>${st.streak} ${lang==='en'?'days':'dní'}</strong> (${count}/${total} ${lang==='en'?'done':'dnes'})
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div style="width:100%; height:12px; background:rgba(0,0,0,0.2); border:1px solid var(--accent-gold); border-radius:6px; overflow:hidden; position:relative;">
                <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #c5a059 0%, #ffd700 100%); transition:width 0.3s ease;"></div>
            </div>

            ${st.perfectionClaimedToday ? `
                <div style="margin-top:10px; padding:8px 12px; background:rgba(255,215,0,0.15); border:1px solid var(--accent-gold); border-radius:4px; font-size:0.85rem; text-align:center; color:var(--accent-gold); font-weight:bold;">
                    ✨ ${lang==='en'?'Daily Monastic Perfection achieved today! (+5 Notes, +2 Parchment, +30 Vigor)':'Dokonalý denní řád dnes splněn! (+5 Zápisků, +2 Pergameny, +30 Vigor)'}
                </div>
            ` : ''}
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
        `;

        this.TASKS.forEach(t => {
            const isDone = st.completedToday.includes(t.id);
            const inTime = this.isTaskInTimeWindow(t);
            const name = lang === 'en' ? t.name_en : t.name;
            const desc = lang === 'en' ? t.desc_en : t.desc;

            let cardBorder = isDone ? 'var(--accent-gold)' : (inTime ? 'var(--accent-gold)' : 'var(--ink-secondary)');
            let cardBg = isDone ? 'rgba(197,160,89,0.06)' : (inTime ? 'rgba(197,160,89,0.15)' : 'rgba(0,0,0,0.02)');

            h += `
            <div class="card" style="border-color:${cardBorder}; opacity:${isDone ? 0.75 : (inTime ? 1 : 0.85)}; background:${cardBg}; flex-wrap:wrap; gap:12px; align-items:center; box-sizing:border-box; width:100%; max-width:100%; overflow:hidden;">
                <div class="item-icon" style="background:${isDone ? '#c5a059' : (inTime ? '#ffd700' : '#e8dec0')}; flex-shrink:0; font-size:1.4rem;">${t.icon}</div>
                <div style="flex:1 1 200px; min-width:0; overflow-wrap:break-word;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong style="font-size:0.95rem; font-family:'Cinzel',serif;">${name}</strong>
                        <span style="font-size:0.75rem; background:${inTime ? 'rgba(255,215,0,0.25)' : 'rgba(197,160,89,0.2)'}; padding:2px 6px; border-radius:3px; color:var(--accent-gold); font-weight:bold; white-space:nowrap;">
                            ${t.timeDisplay} ${inTime ? '⚡ (Aktivní)' : ''}
                        </span>
                    </div>
                    <div class="text-sm" style="margin-top:3px; color:var(--ink-secondary); line-height:1.4;">${desc}</div>
                    <div class="text-sm" style="margin-top:4px; font-weight:bold; color:var(--accent-gold);">
                        🎁 ${lang==='en'?'Base Reward':'Základ'}: ${t.rewardsText}
                    </div>
                    <div class="text-sm" style="color:#d4af37; font-style:italic;">
                        ${t.bonusText}
                    </div>
                </div>
                <div style="flex:0 0 auto; max-width:100%; align-self:center;">
                    ${isDone ? `
                        <span style="font-weight:bold; color:var(--accent-gold); font-size:0.9rem; font-family:'Cinzel',serif;">
                            ✓ ${lang==='en'?'Logged':'Splněno'}
                        </span>
                    ` : (inTime ? `
                        <button class="craft-btn" onclick="MonasticTasksSystem.completeTask('${t.id}')" style="box-shadow:0 0 8px rgba(255,215,0,0.4); background:linear-gradient(135deg, #c5a059, #8c6d2d); white-space:normal; text-align:center;">
                            ✨ ${lang==='en'?'Recite (Bonus Gain!)':'Odříkat (S bonusy!)'}
                        </button>
                    ` : `
                        <button class="craft-btn" disabled style="opacity:0.6; cursor:not-allowed; background:#666; max-width:100%; white-space:normal; text-align:center; font-size:0.8rem; padding:6px 12px; word-break:break-word;">
                            ⏳ ${lang==='en'?'Awaits canonical hour':'Čeká na vyhrazený čas'}
                        </button>
                    `)}
                </div>
            </div>
            `;
        });

        h += `</div>`;
        el.innerHTML = h;
    }
};
