// ═══════════════════════════════════════════════════════════════════════════
// LettersDB — obsah Porty (P1, dávka 1: L1–L6 + 2 follow-upy).
// Zdroje: exempla (Vokabulář), anály, městská kniha olomoucká. MRD: templum-reference.md
// Texty inline (title_cs/en, text_cs/en) — vzor Chronicon; engine má fallback na i18n klíče.
// expiry_days: od prvního objevení ve frontě; urgent: ⚡ badge.
// ═══════════════════════════════════════════════════════════════════════════

const LettersDB = [

  // ── L1 — Farář: o falešné zpovědi (předehra Zpovědi) ──
  {
    id: 'l1_farar_zpoved',
    sender_cs: 'Farář Havel od Panny Marie', sender_en: 'Father Havel of Our Lady',
    seal: 'village',
    title_cs: 'List faráře Havla',
    title_en: 'A Letter from Father Havel',
    text_cs: '„Ctihodný bratře, doslechl jsem, že zpovídáš. Střez se vlažnosti — u nás vyprávějí o muži, jemuž sám ďábel v kněžském rouše uložil, aby se svého hříchu už nikdy nezpovídal. Váž slova pokání, jež ukládáš. Kraj si je pamatuje déle než ty. — Farář Havel od Panny Marie"',
    text_en: '"Venerable brother, I hear you now take confessions. Beware of laxity — here they tell of a man to whom the devil himself, robed as a priest, assigned the penance of never confessing his sin again. Weigh the penances you set. The countryside remembers them longer than you do. — Father Havel of Our Lady"',
    trigger: function () {
      return typeof TemplumSystem !== 'undefined' && TemplumSystem.isUnlocked();
    },
    choices: [
      {
        label_cs: '📜 Přečíst a uložit', label_en: '📜 Read and file',
        effect: function () {
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('church', 1);
        },
        notify_cs: 'Farářova slova zůstala v mysli. (Ecclesia +1)',
        notify_en: 'The priest\'s words linger. (Ecclesia +1)'
      }
    ]
  },

  // ── L2 — Křivě obviněná paní Ofka (⚡ 5 dní; první dvoudílný řetěz) ──
  {
    id: 'l2_ofka',
    sender_cs: 'Písař Jindřich', sender_en: 'Henry the Scribe',
    seal: 'village',
    urgent: true,
    expiry_days: 5,
    title_cs: 'Úpěnlivá prosba písaře Jindřicha',
    title_en: 'A Desperate Plea from Henry the Scribe',
    text_cs: '„Bratře v Kristu, píši za paní Ofku z Újezda. Nalezli u ní zavražděné dítě a krvavý nůž, ona však přísahá nevinu — a já jí věřím, neboť vrah měl důvod ji zničit. Pán ji chce upálit. Přimluvíš-li se, klášter si znepřátelí pána; mlčíš-li, shoří možná nevinná. — Písař Jindřich, v spěchu"',
    text_en: '"Brother in Christ, I write for Lady Ofka of Újezd. A murdered child and a bloody knife were found by her, yet she swears innocence — and I believe her, for the murderer had cause to ruin her. The lord means to burn her. Speak for her and the monastery earns the lord\'s enmity; stay silent and an innocent may burn. — Henry the scribe, in haste"',
    trigger: function () {
      if (typeof TemplumSystem === 'undefined' || !TemplumSystem.isUnlocked()) return false;
      const rel = GameState.contactRelation || {};
      return Object.keys(rel).some(k => (rel[k] || 0) >= 25);
    },
    onExpire: function () { GameState.flags.letterOfka = 'silent'; },
    choices: [
      {
        label_cs: '⚖️ Přimluvit se za paní Ofku', label_en: '⚖️ Speak for Lady Ofka',
        effect: function () {
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) {
            PersonaSystem.addInfluence('church', 4);
            PersonaSystem.addInfluence('village', 2);
          }
          GameState.flags.letterOfka = 'spoke';
          // TODO (šlechtic-řetěz): pán z Újezda si pamatuje — budoucí nepřítel
        },
        notify_cs: 'Klášter se přimluvil za paní Ofku. Pán z Újezda mlčí — zatím.',
        notify_en: 'The monastery spoke for Lady Ofka. The lord of Újezd says nothing — for now.'
      },
      {
        label_cs: '🤐 Mlčet', label_en: '🤐 Stay silent',
        effect: function () { GameState.flags.letterOfka = 'silent'; },
        notify_cs: 'Klášter mlčel. Někdy je i mlčení rozsudkem.',
        notify_en: 'The monastery stayed silent. Sometimes silence, too, is a verdict.'
      }
    ]
  },

  // ── L2b — rozuzlení (přimluvil ses): +7 dní po L2 ──
  {
    id: 'l2b_ofka_spoke',
    sender_cs: 'Písař Jindřich', sender_en: 'Henry the Scribe',
    seal: 'village',
    title_cs: 'Zpráva z Újezda: pravda vyšla najevo',
    title_en: 'News from Újezd: The Truth Comes Out',
    text_cs: '„Bratře — paní Ofka je volná! Tvá přímluva zdržela hranici a mezitím se bratr jejího muže opil a chvástal, že nůž vedl on, aby ji zničil. Kraj ví, kdo se zastal nevinné. Pán z Újezda ovšem neodpouští těm, kdo mu zkřížili vůli. — Jindřich"',
    text_en: '"Brother — Lady Ofka is free! Your intercession stayed the pyre, and meanwhile her husband\'s brother drank and boasted that he had guided the knife to ruin her. The countryside knows who stood up for the innocent. The lord of Újezd, however, does not forgive those who cross his will. — Henry"',
    trigger: function () {
      if (GameState.flags.letterOfka !== 'spoke') return false;
      const a = (GameState.letters && GameState.letters.archive || []).find(e => e.id === 'l2_ofka');
      return !!a && (Date.now() - a.ts) >= 7 * 24 * 60 * 60 * 1000;
    },
    choices: [
      {
        label_cs: '📜 Zaplaťpánbůh', label_en: '📜 Thanks be to God',
        effect: function () {
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('village', 2);
        },
        notify_cs: 'Paní Ofka je volná. Kraj si pamatuje. (vesnice +2)',
        notify_en: 'Lady Ofka is free. The countryside remembers. (village +2)'
      }
    ]
  },

  // ── L2c — rozuzlení (mlčel jsi / prošvihl): +7 dní po L2 ──
  {
    id: 'l2c_ofka_silent',
    sender_cs: 'Písař Jindřich', sender_en: 'Henry the Scribe',
    seal: 'village',
    title_cs: 'Zpráva z Újezda: po ohni',
    title_en: 'News from Újezd: After the Fire',
    text_cs: '„Bratře — paní Ofka shořela v pátek za úsvitu. O týden později se bratr jejího muže opil a chvástal, že nůž vedl on. Teď ho pán soudí, ale mrtvé to nohy nevrátí. Kraj se ptá, kde byl hlas kláštera. Nemám, co bych dodal. — Jindřich"',
    text_en: '"Brother — Lady Ofka burned on Friday at dawn. A week later her husband\'s brother drank and boasted that he had guided the knife. Now the lord tries him, but that returns no legs to the dead. The countryside asks where the monastery\'s voice was. I have nothing to add. — Henry"',
    trigger: function () {
      if (GameState.flags.letterOfka !== 'silent') return false;
      const a = (GameState.letters && GameState.letters.archive || []).find(e => e.id === 'l2_ofka');
      return !!a && (Date.now() - a.ts) >= 7 * 24 * 60 * 60 * 1000;
    },
    choices: [
      {
        label_cs: '🕯️ Odsloužit tichou modlitbu', label_en: '🕯️ Say a quiet prayer',
        effect: function () {
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('village', -2);
        },
        notify_cs: 'Kraj nezapomíná, kdo mlčel. (vesnice −2)',
        notify_en: 'The countryside does not forget who stayed silent. (village −2)'
      }
    ]
  },

  // ── L3 — Kupec Mikuláš: ceny a rada (anály 1342) ──
  {
    id: 'l3_kupec_ceny',
    sender_cs: 'Kupec Mikuláš', sender_en: 'Nicholas the Merchant',
    seal: 'village',
    title_cs: 'List kupce Mikuláše',
    title_en: 'A Letter from Nicholas the Merchant',
    text_cs: '„Bratře celeráři, na trhu se šeptá o slabé sklizni na Hané. Pamatuj léta MCCCXLII — strych žita za kopu! Kdo měl tehdy plnou sýpku, kupoval domy. Kdo prázdnou, prodával děti do služby. Radím: kupuj zrní teď, dokud mlynář prodává lacino. — Mikuláš, kupec od Dolního rynku"',
    text_en: '"Brother cellarer, the market whispers of a weak harvest in the Haná. Recall the year 1342 — a strych of rye for a threescore of groschen! Whoever had a full granary then bought houses. Whoever had an empty one sold his children into service. My counsel: buy grain now while the miller sells cheap. — Nicholas, merchant of the Lower Square"',
    trigger: function () {
      const r = GameState.researchedTechs || [];
      return r.includes('tech_numismatica')
          && typeof RankSystem !== 'undefined' && RankSystem.getSecularRankTier && RankSystem.getSecularRankTier() >= 2;
    },
    choices: [
      { label_cs: '📜 Vzít na vědomí', label_en: '📜 Take note',
        effect: function () {},
        notify_cs: 'Kupcova rada uložena v paměti celeráře.',
        notify_en: 'The merchant\'s counsel is filed in the cellarer\'s memory.' }
    ]
  },

  // ── L4 — Vdova Kačna: vosk za duši (první dopis s přílohou) ──
  {
    id: 'l4_vdova_vosk',
    sender_cs: 'Vdova Kačna z Chválkovic', sender_en: 'Widow Kačna of Chválkovice',
    seal: 'village',
    title_cs: 'Dar vdovy Kačny',
    title_en: 'The Widow Kačna\'s Gift',
    text_cs: '„Důstojný otče, posílám po čeledínovi hroudu vosku z úlů mého nebožtíka. Ať hoří za jeho duši při mši. Víc nemám — leda modlitbu, a tu si nechávám pro sebe, odpusťte. — Vdova Kačna z Chválkovic"',
    text_en: '"Reverend father, I send by my farmhand a lump of wax from my late husband\'s hives. Let it burn for his soul at mass. I have nothing more — save a prayer, and that one I keep for myself, forgive me. — Widow Kačna of Chválkovice"',
    trigger: function () {
      return !!(GameState.templum && GameState.templum.lastMass);
    },
    choices: [
      { label_cs: '🐝 Přijmout dar (3× vosk)', label_en: '🐝 Accept the gift (3× beeswax)',
        effect: function () {
          if (typeof Game !== 'undefined' && Game.addItem) Game.addItem('beeswax', 3);
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('church', 1);
        },
        notify_cs: 'Vosk vdovy Kačny uložen. Bude hořet při mši. (+3 vosk, Ecclesia +1)',
        notify_en: 'Widow Kačna\'s wax is stored. It will burn at mass. (+3 beeswax, Ecclesia +1)' }
    ]
  },

  // ── L5 — Bratr Prokop z Hradiska: mlýny (předehra vodních služeb) ──
  {
    id: 'l5_hradisko_mlyny',
    sender_cs: 'Bratr Prokop z Hradiska', sender_en: 'Brother Prokop of Hradisko',
    seal: 'abbot',
    title_cs: 'List bratra Prokopa z Hradiska',
    title_en: 'A Letter from Brother Prokop of Hradisko',
    text_cs: '„Bratře, náš klášter na Hradisku drží mlýny na rameni Moravy — a věz, že kolo nemele jen mouku. Pohání pilu, stoupu na tříslo i hamr. Váš mlynář má jen jedno kolo? Pak platí vodě daň z lenosti. Přijeď se podívat, než zamrzne řeka. — Bratr Prokop, Hradisko"',
    text_en: '"Brother, our monastery at Hradisko holds mills on a branch of the Morava — and know that the wheel grinds more than flour. It drives a saw, a tanbark stamp and a hammer-mill. Your miller has but one wheel? Then he pays the water a tax of idleness. Come and see before the river freezes. — Brother Prokop, Hradisko"',
    trigger: function () {
      return ((GameState.contactRelation || {}).mlynar || 0) >= 5;
    },
    choices: [
      { label_cs: '📜 Zajímavé…', label_en: '📜 Interesting…',
        effect: function () {},
        notify_cs: 'Hradiská kola se ti otiskla do mysli. Jednou možná…',
        notify_en: 'The Hradisko wheels turn in your mind. One day, perhaps…' }
    ]
  },

  // ── L6 — Biskupská kancelář: misál (14 dní; vstup vizitačního řetězu) ──
  {
    id: 'l6_biskup_misal',
    sender_cs: 'Kancelář biskupství olomouckého', sender_en: 'Chancery of the Bishopric of Olomouc',
    seal: 'abbot',
    expiry_days: 14,
    title_cs: 'List biskupské kanceláře',
    title_en: 'A Letter from the Bishop\'s Chancery',
    text_cs: '„Bratře, Jeho Milost biskup olomoucký doslechl se o vašem skriptoriu. Táže se, zda by vaše dílna svedla opis misálu hodný katedrálního oltáře. Odpověz po tomto poslu, leč važ slova: co slíbíš, to bude čteno nahlas. — Kancelář biskupství olomouckého"',
    text_en: '"Brother, His Grace the Bishop of Olomouc has heard of your scriptorium. He asks whether your workshop could produce a missal copy worthy of the cathedral altar. Reply by this messenger, but weigh your words: what you promise will be read aloud. — Chancery of the Bishopric of Olomouc"',
    trigger: function () {
      const m = GameState.rank && GameState.rank.monastic;
      return ['frater', 'armarius', 'prior'].includes(m)
          && (GameState.researchedTechs || []).includes('tech_codex_luxury');
    },
    onExpire: function () { GameState.flags.bishopMissal = 'ignored'; },
    choices: [
      { label_cs: '📜 Přijmout zakázku', label_en: '📜 Accept the commission',
        effect: function () { GameState.flags.bishopMissal = 'accepted'; GameState.flags.bishopMissalAcceptedAt = Date.now(); },
        notify_cs: 'Slíbil jsi biskupovi misál. Kancelář odpoví — a bude to čteno nahlas. (řetěz pokračuje)',
        notify_en: 'You promised the bishop a missal. The chancery will reply — and it will be read aloud. (the chain continues)' },
      { label_cs: '🙏 Pokorně odmítnout', label_en: '🙏 Humbly decline',
        effect: function () {
          GameState.flags.bishopMissal = 'declined';
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('church', -1);
        },
        notify_cs: 'Odmítl jsi. Kancelář mlčí — biskupové ale nezapomínají. (Ecclesia −1)',
        notify_en: 'You declined. The chancery is silent — but bishops do not forget. (Ecclesia −1)' }
    ]
  },

  // ═══ P2: BISKUPSKÝ ŘETĚZ (pokračování L6) — flags.bishopMissal řídí větvení ═══

  // ── L7 — Zadání: podmínky misálu (accepted + 3 dny) ──
  {
    id: 'l7_biskup_zadani',
    sender_cs: 'Kancelář biskupství olomouckého', sender_en: 'Chancery of the Bishopric of Olomouc',
    seal: 'abbot',
    title_cs: 'Podmínky biskupské kanceláře',
    title_en: 'Terms from the Bishop\'s Chancery',
    text_cs: '„Bratře, Jeho Milost přijímá tvůj slib. Žádá misál v podobě luxusního kodexu — pergamen čistý, iniciály zlacené, vazba pevná. Lhůta: tři týdny ode dneška. Odměna: sto dvacet grošů z biskupské pokladny. Kancelář počítá dny pečlivěji než modlitby. — Kancelář biskupství olomouckého"',
    text_en: '"Brother, His Grace accepts your promise. He requires the missal as a luxury codex — clean parchment, gilded initials, firm binding. Term: three weeks from today. Reward: one hundred and twenty groschen from the episcopal treasury. The chancery counts days more carefully than prayers. — Chancery of the Bishopric of Olomouc"',
    trigger: function () {
      if (GameState.flags.bishopMissal !== 'accepted') return false;
      const t0 = GameState.flags.bishopMissalAcceptedAt
        || (((GameState.letters && GameState.letters.archive) || []).find(e => e.id === 'l6_biskup_misal' || e.id === 'l10_biskup_druha_sance') || {}).ts;
      return !!t0 && (Date.now() - t0) >= 3 * 24 * 60 * 60 * 1000;
    },
    commitment: {
      flagKey: 'bishopMissal',
      deadlineFlagKey: 'bishopMissalDeadline',
      activeStatuses: ['commissioned'],
      forWhom_cs: 'Biskup olomoucký', forWhom_en: 'Bishop of Olomouc',
      what_cs: 'Luxusní kodex (misál pro katedrálu)', what_en: 'Luxury codex (missal for the cathedral)',
      reward_cs: '120 grošů + Ecclesia +8', reward_en: '120 groschen + Ecclesia +8',
      risk_cs: 'Ecclesia −3 při zmeškání lhůty', risk_en: 'Ecclesia −3 if the deadline is missed',
    },
    choices: [
      { label_cs: '📜 Přijímám podmínky', label_en: '📜 I accept the terms',
        effect: function () {
          GameState.flags.bishopMissal = 'commissioned';
          GameState.flags.bishopMissalDeadline = Date.now() + 21 * 24 * 60 * 60 * 1000;
        },
        notify_cs: 'Zakázka běží: luxusní kodex pro biskupa, 21 dní. Kancelář počítá.',
        notify_en: 'The commission runs: a luxury codex for the bishop, 21 days. The chancery is counting.' }
    ]
  },

  // ── L8 — Odevzdání (commissioned + kodex v ruce + před lhůtou) ──
  {
    id: 'l8_biskup_odevzdani',
    sender_cs: 'Kancelář biskupství olomouckého', sender_en: 'Chancery of the Bishopric of Olomouc',
    seal: 'abbot',
    title_cs: 'Posel kanceláře čeká na misál',
    title_en: 'The Chancery\'s Messenger Awaits the Missal',
    text_cs: '„Bratře, posel Jeho Milosti stojí u brány a doslechl se, že dílo je hotovo. Vydáš-li misál nyní, odměna sto dvaceti grošů bude vyplacena na místě. — Kancelář biskupství olomouckého"',
    text_en: '"Brother, His Grace\'s messenger stands at the gate, having heard the work is finished. Hand over the missal now and the reward of one hundred and twenty groschen will be paid on the spot. — Chancery of the Bishopric of Olomouc"',
    trigger: function () {
      return GameState.flags.bishopMissal === 'commissioned'
        && (GameState.inventory['luxury_codex'] || 0) >= 1
        && Date.now() < (GameState.flags.bishopMissalDeadline || 0);
    },
    choices: [
      { label_cs: '📜 Odevzdat misál (−1 luxusní kodex)', label_en: '📜 Hand over the missal (−1 luxury codex)',
        effect: function () {
          if ((GameState.inventory['luxury_codex'] || 0) < 1) {
            if (typeof UI !== 'undefined') UI.notify('⚠️ Kodex mezitím zmizel z polic.', true);
            return;
          }
          Game.removeItem('luxury_codex', 1);
          if (typeof CellariumSystem !== 'undefined' && CellariumSystem.addGrose) CellariumSystem.addGrose(120);
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('church', 8);
          GameState.flags.bishopMissal = 'delivered';
        },
        notify_cs: 'Misál předán poslu. +120 grošů, Ecclesia +8. Biskup si zapamatuje jméno kláštera.',
        notify_en: 'The missal is handed to the messenger. +120 groschen, Ecclesia +8. The bishop will remember the monastery\'s name.' }
    ]
  },

  // ── L9 — Zmeškaná lhůta (commissioned + po deadline) ──
  {
    id: 'l9_biskup_zmeskani',
    sender_cs: 'Kancelář biskupství olomouckého', sender_en: 'Chancery of the Bishopric of Olomouc',
    seal: 'abbot',
    title_cs: 'Chladný list kanceláře',
    title_en: 'A Cold Letter from the Chancery',
    text_cs: '„Bratře, lhůta minula a misál nepřišel. Jeho Milost slova nekomentuje — pouze si je zapisuje. Katedrála si opis pořídí jinde. — Kancelář biskupství olomouckého"',
    text_en: '"Brother, the term has passed and no missal has come. His Grace makes no comment on words — he merely writes them down. The cathedral will have its copy made elsewhere. — Chancery of the Bishopric of Olomouc"',
    trigger: function () {
      return GameState.flags.bishopMissal === 'commissioned'
        && (GameState.flags.bishopMissalDeadline || 0) > 0
        && Date.now() > GameState.flags.bishopMissalDeadline;
    },
    choices: [
      { label_cs: '🕯️ Sklopit hlavu', label_en: '🕯️ Bow the head',
        effect: function () {
          GameState.flags.bishopMissal = 'failed';
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('church', -3);
        },
        notify_cs: 'Slib nesplněn. Kancelář mlčí, ale pamatuje. (Ecclesia −3)',
        notify_en: 'A promise unkept. The chancery is silent, but it remembers. (Ecclesia −3)' }
    ]
  },

  // ── L10 — Druhá šance (declined/ignored + 14 dní) ──
  {
    id: 'l10_biskup_druha_sance',
    sender_cs: 'Kancelář biskupství olomouckého', sender_en: 'Chancery of the Bishopric of Olomouc',
    seal: 'abbot',
    title_cs: 'Kancelář píše podruhé',
    title_en: 'The Chancery Writes a Second Time',
    text_cs: '„Bratře, Jeho Milost se táže podruhé — a biskupové se dvakrát táží zřídka. Misál pro katedrální oltář: ano, či ne? Tentokrát postačí jedno slovo. — Kancelář biskupství olomouckého"',
    text_en: '"Brother, His Grace asks a second time — and bishops seldom ask twice. The missal for the cathedral altar: yes, or no? This time a single word will suffice. — Chancery of the Bishopric of Olomouc"',
    trigger: function () {
      if (!['declined', 'ignored'].includes(GameState.flags.bishopMissal)) return false;
      const a = ((GameState.letters && GameState.letters.archive) || []).find(e => e.id === 'l6_biskup_misal');
      return !!a && (Date.now() - a.ts) >= 14 * 24 * 60 * 60 * 1000;
    },
    choices: [
      { label_cs: '📜 Ano — přijímám', label_en: '📜 Yes — I accept',
        effect: function () {
          GameState.flags.bishopMissal = 'accepted';
          GameState.flags.bishopMissalAcceptedAt = Date.now();
        },
        notify_cs: 'Slíbil jsi biskupovi misál. Podmínky přijdou po poslu.',
        notify_en: 'You promised the bishop a missal. Terms will follow by messenger.' },
      { label_cs: '🚪 Ne — podruhé a naposledy', label_en: '🚪 No — a second and final time',
        effect: function () {
          GameState.flags.bishopMissal = 'refused_final';
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('church', -2);
        },
        notify_cs: 'Odmítl jsi podruhé. Biskupové se dvakrát táží zřídka — a potřetí nikdy. (Ecclesia −2)',
        notify_en: 'You refused a second time. Bishops seldom ask twice — and never a third. (Ecclesia −2)' }
    ]
  },

  // ═══ VISITATIO V1: ohlašovací dopis (MRD visitatio-reference.md) ═══
  {
    id: 'l11_visitatio_ohlaseni',
    sender_cs: 'Kancelář biskupství olomouckého', sender_en: 'Chancery of the Bishopric of Olomouc',
    seal: 'abbot',
    urgent: true,
    title_cs: 'Ohlášení vizitace',
    title_en: 'Notice of Visitation',
    get text_cs() {
      const warm = GameState.flags.bishopMissal === 'delivered';
      return warm
        ? '„Bratře, Jeho Milost biskup olomoucký zamýšlí navštívit váš dům, o němž slyšel dobré — i misál na katedrálním oltáři mluví ve váš prospěch. Za sedm dní stane u vaší brány. Ať dům svědčí o svém řádu. — Kancelář biskupství olomouckého"'
        : '„Bratře, Jeho Milost biskup olomoucký navštíví váš dům za sedm dní. Kancelář nepřipomíná, co bylo — Jeho Milost si to pamatuje sama. Ať dům svědčí o svém řádu lépe než dosavadní sliby. — Kancelář biskupství olomouckého"';
    },
    get text_en() {
      const warm = GameState.flags.bishopMissal === 'delivered';
      return warm
        ? '"Brother, His Grace the Bishop of Olomouc intends to visit your house, of which he has heard good things — the missal on the cathedral altar speaks in your favour too. In seven days he will stand at your gate. Let the house bear witness to its order. — Chancery of the Bishopric of Olomouc"'
        : '"Brother, His Grace the Bishop of Olomouc will visit your house in seven days. The chancery does not recall what has passed — His Grace remembers it himself. Let the house bear witness to its order better than promises have. — Chancery of the Bishopric of Olomouc"';
    },
    trigger: function () {
      if (GameState.flags.visitatioAt) return false;
      const m = GameState.rank && GameState.rank.monastic;
      if (!['armarius', 'prior'].includes(m)) return false;
      // V3-B: GM mimořádná vizitace (Chronicon unlock_flag "visitatio_force") — přeskočí misál i odstup
      if (GameState.flags.visitatio_force === true) return true;
      if (!['delivered', 'failed', 'refused_final'].includes(GameState.flags.bishopMissal)) return false;
      // V3-A: opakování — další vizitace nejdřív 60 dní po poslední
      if (GameState.flags.visitatioDone) {
        return (Date.now() - GameState.flags.visitatioDone) >= 60 * 24 * 60 * 60 * 1000;
      }
      // první vizitace: 10 dní od uzavření misálového řetězu
      const arch = (GameState.letters && GameState.letters.archive) || [];
      const closer = arch.filter(e => ['l8_biskup_odevzdani', 'l9_biskup_zmeskani', 'l10_biskup_druha_sance'].includes(e.id))
                         .sort((a, b) => b.ts - a.ts)[0];
      return !!closer && (Date.now() - closer.ts) >= 10 * 24 * 60 * 60 * 1000;
    },
    choices: [
      { label_cs: '🔔 Připravíme dům', label_en: '🔔 We shall prepare the house',
        effect: function () {
          GameState.flags.visitatioAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
          if (GameState.flags.visitatio_force) GameState.flags.visitatio_force = false; // GM flag spotřebován
        },
        notify_cs: 'Vizitace za 7 dní. Kostel ať svítí, mše ať zní, zásoby ať jsou plné.',
        notify_en: 'Visitation in 7 days. Let the church be lit, the mass be sung, the stores be full.' }
    ]
  },

  // ── L12 — Opat: nabídka holubího hejna (Porta) ──
  {
    id: 'l12_opat_holubi',
    sender_cs: 'Opat', sender_en: 'The Abbot',
    seal: 'abbot',
    title_cs: 'List opatův o holubech',
    title_en: "A Letter from the Abbot on Pigeons",
    text_cs: '„Bratře, žiji daleko a na váš dům zajíždím jen na návštěvu — cesta je dlouhá a zprávy k vám dochází pozdě, nebo vůbec. Mám pro vás hejno holubů z výcviku v opatství, zvyklých na let domů. Postavíte-li jim věž, pošlu je — a od té chvíle budeme mluvit rychleji než kůň dokáže jet. — Opat"',
    text_en: '"Brother, I live far away and visit your house only occasionally — the road is long, and word reaches you late, or not at all. I have a flock of pigeons, trained at the abbey, accustomed to flying home. Build them a tower, and I shall send them — and from that day we shall speak faster than any horse can ride. — The Abbot"',
    trigger: function () {
      if (GameState.flags && GameState.flags.porta_letter_received) return false;
      // GM/CHRONICON — Ondrex ručně nastaví GameState.flags.porta_offer = true,
      // až bude chtít tenhle dopis pustit hráčům (mirror vzoru visitatio_force).
      return !!(GameState.flags && GameState.flags.porta_offer);
    },
    choices: [
      {
        label_cs: '🕊️ Rádi je přivítáme', label_en: '🕊️ We shall gladly welcome them',
        effect: function () {
          if (!GameState.flags) GameState.flags = {};
          GameState.flags.porta_letter_received = true;
        },
        notify_cs: 'Opatova nabídka zapsána. Studium Porta — Holubí pošty čeká na svou chvíli.',
        notify_en: "The Abbot's offer is noted. The study of Porta — Pigeon Post awaits its time."
      }
    ]
  },

  {
    id: 'l24_voskar',
    sender_cs: 'Voskař', sender_en: 'The Wax Chandler',
    seal: 'church',
    title_cs: 'List voskařův na uvítanou', title_en: 'The Wax Chandler\'s Letter of Welcome',
    text_cs: '„Bratře, slyšel jsem, že klášter už zapaluje svíce vlastní výroby. Přesto — u kostela vždycky uvítám dalšího odběratele vosku, i kdyby jen jako pojistku pro léta, kdy vlastní úly zklamou. — Voskař u kostela“',
    text_en: '"Brother, I hear the monastery already lights candles of its own making. Still — by the church I always welcome another taker of wax, if only as insurance for years when your own hives disappoint. — The Wax Chandler by the Church"',
    trigger: function () { return (GameState.researchedTechs || []).includes('tech_candle'); },
    choices: [
      { label_cs: '🕯️ Odpovědět přátelsky', label_en: '🕯️ Reply in friendship',
        effect: function () { if (typeof SaeculumSystem !== 'undefined' && SaeculumSystem.addContactRelation) SaeculumSystem.addContactRelation('voskar', 2); },
        notify_cs: 'Voskař potěšen odpovědí. (Voskař +2)', notify_en: 'The chandler is pleased by the reply. (Wax Chandler +2)' }
    ]
  },
  {
    id: 'l25_lovec',
    sender_cs: 'Lovec', sender_en: 'The Hunter',
    seal: 'village',
    title_cs: 'List lovcův o stopách', title_en: 'The Hunter\'s Letter about Tracks',
    text_cs: '„Bratře, v lese za mokřady jsem viděl stopy zvěře, jakou jsem tam léta nezahlédl. Bude-li klášter chtít maso na hostinu, vím, kde hledat — jen ať vím dřív, kdy hostina bude, zvěř nečeká na pozvánky. — Lovec“',
    text_en: '"Brother, in the forest beyond the wetlands I saw tracks of game I have not seen there in years. Should the monastery want meat for a feast, I know where to look — only let me know beforehand when the feast shall be, for game does not wait on invitations. — The Hunter"',
    trigger: function () { return (GameState.researchedTechs || []).includes('tech_de_animalibus'); },
    choices: [
      { label_cs: '🏹 Objednat maso předem', label_en: '🏹 Order meat in advance',
        effect: function () { if (typeof SaeculumSystem !== 'undefined' && SaeculumSystem.addContactRelation) SaeculumSystem.addContactRelation('lovec', 3); },
        notify_cs: 'Lovec si poznamenal objednávku. (Lovec +3)', notify_en: 'The hunter noted the order. (Hunter +3)' }
    ]
  },
  {
    id: 'l26_sklar',
    sender_cs: 'Sklář', sender_en: 'The Glassmaker',
    seal: 'scholars',
    title_cs: 'List sklářův o benátských zrcadlech', title_en: 'The Glassmaker\'s Letter about Venetian Mirrors',
    text_cs: '„Bratře, závidím Benátčanům jejich zrcadla, ale co umím, umím poctivě — křivule a alembiky, co nepraskají při prvním ohřevu. Kdyby skriptorium potřebovalo sklo pro laboratoř, dejte vědět, dřív než pec vychladne na zimu. — Sklář z hutě v lesích“',
    text_en: '"Brother, I envy the Venetians their mirrors, but what I know, I know honestly — retorts and alembics that do not crack at first heating. Should the scriptorium need glass for its laboratory, let me know before the furnace cools for winter. — The Glassmaker from the Forest Works"',
    trigger: function () {
      return (GameState.researchedTechs || []).includes('tech_czech_glass')
          && (GameState.library && GameState.library.readBooks || []).includes('book_czech_glass');
    },
    choices: [
      { label_cs: '🔮 Odpovědět se zájmem', label_en: '🔮 Reply with interest',
        effect: function () { if (typeof SaeculumSystem !== 'undefined' && SaeculumSystem.addContactRelation) SaeculumSystem.addContactRelation('sklar', 3); },
        notify_cs: 'Sklář potěšen zájmem skriptoria. (Sklář +3)', notify_en: 'The glassmaker is pleased by the scriptorium\'s interest. (Glassmaker +3)' }
    ]
  },
  {
    id: 'l27_kamenik',
    sender_cs: 'Kameník', sender_en: 'The Stonemason',
    seal: 'village',
    title_cs: 'List kameníkův od lomu', title_en: 'The Stonemason\'s Letter from the Quarry',
    text_cs: '„Bratře, lom mi dal pěkný kus kamene, rovný a bez puklin — škoda by bylo dát ho na obyčejnou zeď. Kdyby kostel potřeboval něco důstojnějšího, nahrobek nebo chrlič, mám na to ruce i kámen zrovna teď. — Kameník od lomu“',
    text_en: '"Brother, the quarry has given me a fine block of stone, straight and without cracks — a shame to put it in an ordinary wall. Should the church need something more dignified, a gravestone or a gargoyle, I have both the hands and the stone for it right now. — The Stonemason from the Quarry"',
    trigger: function () { return (GameState.researchedTechs || []).includes('tech_carpentaria'); },
    choices: [
      { label_cs: '🪨 Odpovědět se zájmem', label_en: '🪨 Reply with interest',
        effect: function () { if (typeof SaeculumSystem !== 'undefined' && SaeculumSystem.addContactRelation) SaeculumSystem.addContactRelation('kamenik', 3); },
        notify_cs: 'Kameník si poznamenal zájem kláštera. (Kameník +3)', notify_en: 'The stonemason noted the monastery\'s interest. (Stonemason +3)' }
    ]
  },
  {
    id: 'l28_rybar',
    sender_cs: 'Rybář', sender_en: 'The Fisherman',
    seal: 'village',
    title_cs: 'List rybářův o úhořích', title_en: 'The Fisherman\'s Letter about Eels',
    text_cs: '„Bratře, síť mi dnes přinesla víc úhořů, než unesu domů. Ve vašem rybníce prý úhoře nechováte — škoda, na postní den nemá ryba lepšího souseda na talíři. První nabídka patří vám, než je odnesu na trh. — Rybář od říčky“',
    text_en: '"Brother, my net brought in more eels today than I can carry home. Your pond, I hear, keeps none — a pity, for on a fasting day no fish has a better companion on the plate. The first offer is yours, before I carry them to market. — The Fisherman by the Stream"',
    trigger: function () { return (GameState.researchedTechs || []).includes('tech_piscina_administratio'); },
    choices: [
      { label_cs: '🎣 Koupit úhoře (−9 grošů, +3 uhor)', label_en: '🎣 Buy the eels (−9 groschen, +3 eel)',
        effect: function () {
          if (typeof CellariumSystem !== 'undefined' && CellariumSystem.addGrose) CellariumSystem.addGrose(-9);
          if (typeof Game !== 'undefined' && Game.addItem) Game.addItem('uhor', 3);
          if (typeof SaeculumSystem !== 'undefined' && SaeculumSystem.addContactRelation) SaeculumSystem.addContactRelation('rybar', 2);
        },
        notify_cs: 'Úhoři koupeni. (−9 grošů, +3 úhoř, Rybář +2)', notify_en: 'The eels are bought. (−9 groschen, +3 eel, Fisherman +2)' }
    ]
  },
  {
    id: 'l29_stationarius',
    sender_cs: 'Stationarius', sender_en: 'The Stationarius',
    seal: 'scholars',
    title_cs: 'List stationaria o pecii', title_en: 'The Stationarius\'s Letter about the Pecia',
    text_cs: '„Bratře, po jarním knižním veletrhu mi zbylo pár složek (pecií) z rozpůjčeného exempláře — žáci si je opsali a vrátili. Prodám je lacino tomu, kdo o ně požádá první. Skriptorium jistě ví, k čemu jsou dobré. — Stationarius“',
    text_en: '"Brother, after the spring book fair I have a few peciae left from a rented-out exemplar — the students copied them and returned them. I shall sell them cheap to whoever asks first. The scriptorium surely knows their worth. — Stationarius"',
    trigger: function () { return (GameState.researchedTechs || []).includes('tech_writing_basics'); },
    choices: [
      { label_cs: '📚 Koupit pecie (−7 grošů)', label_en: '📚 Buy the peciae (−7 groschen)',
        effect: function () {
          if (typeof CellariumSystem !== 'undefined' && CellariumSystem.addGrose) CellariumSystem.addGrose(-7);
          if (typeof PersonaSystem !== 'undefined' && PersonaSystem.addInfluence) PersonaSystem.addInfluence('scholars', 2);
          if (typeof SaeculumSystem !== 'undefined' && SaeculumSystem.addContactRelation) SaeculumSystem.addContactRelation('stationarius', 3);
        },
        notify_cs: 'Pecie koupeny. (−7 grošů, Scholars +2, Stationarius +3)', notify_en: 'The peciae are bought. (−7 groschen, Scholars +2, Stationarius +3)' }
    ]
  },
];