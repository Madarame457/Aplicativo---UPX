/* =========================================================
   EcoQuest — LÓGICA DO APP
   O conteúdo (perguntas, criadores, guia) fica em dados.js.
   ========================================================= */

/* ---------- Configurações do jogo ---------- */
const SAVE_KEY = 'ecoquest_save_v1';
const MAX_LIVES = 5;
const LIFE_REGEN_MINUTES = 3;          
const XP_PER_CORRECT = 10;
const XP_LEVEL_FIRST_CLEAR = 50;       
const XP_REPLAY_BONUS = 10;            
const XP_EVENT_FIRST_CLEAR = 40;

const LIFE_REGEN_MS = LIFE_REGEN_MINUTES * 60 * 1000;


/* ---------- Estado salvo no aparelho ---------- */
function defaultSave() {
  return {
    isLoggedIn: false,
    user: { name: '', email: '' },
    xp: 0,
    streak: 0,
    lastPlayedDate: null,     
    lives: MAX_LIVES,
    livesUpdatedAt: Date.now(),
    completedLevels: [],
    completedEvents: [],
    totalCorrect: 0,          
    pledges: [],              
    pledgesRewarded: []       
  };
}

const XP_PLEDGE = 5;          
let save = loadSave();

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    return { ...defaultSave(), ...JSON.parse(raw) };
  } catch (e) {
    return defaultSave();
  }
}

function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {
   
  }
}


/* ---------- Estado da sessão (não é salvo) ---------- */
const session = {
  currentTab: 'learn',
  screen: 'tab',    
  quiz: null,       
  timer: null,
  timeLeft: 0
};


/* ---------- Utilidades ---------- */
function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


const FILLER_WORDS = new Set(['a', 'o', 'as', 'os', 'no', 'na', 'nos', 'nas', 'e', 'de', 'do', 'da', 'lixeira', 'cor', 'vai']);
function normalizeAnswer(text) {
  return String(text)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word && !FILLER_WORDS.has(word))
    .join(' ');
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayKey() {
  return dateKey(new Date());
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

function refreshIcons() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function fireConfetti(options) {
  if (typeof window.confetti === 'function') window.confetti(options);
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Título do jogador conforme o XP, e quanto falta para o próximo
function getRank(xp) {
  let index = 0;
  RANKS.forEach((rank, i) => { if (xp >= rank.xp) index = i; });
  const current = RANKS[index];
  const next = RANKS[index + 1] || null;
  const percent = next ? Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100) : 100;
  return { current, next, percent };
}

function factCard(fact) {
  return `
    <div class="bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
      <span class="text-3xl shrink-0">🌍</span>
      <div class="text-xs text-emerald-950 leading-relaxed">
        <span class="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-0.5">Você sabia?</span>
        ${esc(fact)}
      </div>
    </div>`;
}


/* ---------- Sons ---------- */
let audioCtx = null;

function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {
    return;
  }
  const now = audioCtx.currentTime;

  const tone = (freq, start, duration, wave = 'sine', volume = 0.2, endFreq = null) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now + start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + start + duration * 0.7);
    gain.gain.setValueAtTime(volume, now + start);
    gain.gain.exponentialRampToValueAtTime(0.01, now + start + duration);
    osc.start(now + start);
    osc.stop(now + start + duration);
  };

  if (type === 'correct') {
    tone(523.25, 0, 0.3, 'triangle', 0.3, 880);
  } else if (type === 'wrong') {
    tone(220, 0, 0.15, 'sawtooth', 0.25);
    tone(164.81, 0.15, 0.2, 'sawtooth', 0.25);
  } else if (type === 'win') {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.08, 0.25));
  }
}


/* ---------- Vidas (recarregam com o tempo) ---------- */
function refreshLives() {
  if (save.lives >= MAX_LIVES) {
    save.lives = MAX_LIVES;
    return;
  }
  const elapsed = Date.now() - save.livesUpdatedAt;
  const gained = Math.floor(elapsed / LIFE_REGEN_MS);
  if (gained > 0) {
    save.lives = Math.min(MAX_LIVES, save.lives + gained);
    save.livesUpdatedAt += gained * LIFE_REGEN_MS;
    if (save.lives === MAX_LIVES) save.livesUpdatedAt = Date.now();
    persist();
  }
}

function loseLife() {
  if (save.lives === MAX_LIVES) save.livesUpdatedAt = Date.now();
  save.lives = Math.max(0, save.lives - 1);
  persist();
}

function gainLife() {
  if (save.lives < MAX_LIVES) {
    save.lives++;
    if (save.lives === MAX_LIVES) save.livesUpdatedAt = Date.now();
    persist();
  }
}

function msToNextLife() {
  if (save.lives >= MAX_LIVES) return 0;
  return Math.max(0, LIFE_REGEN_MS - (Date.now() - save.livesUpdatedAt));
}

function formatCountdown(ms) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}


/* ---------- Ofensiva (dias seguidos) ---------- */

function currentStreak() {
  if (save.lastPlayedDate === todayKey() || save.lastPlayedDate === yesterdayKey()) {
    return save.streak;
  }
  return 0;
}

// Chamado ao terminar uma lição. Retorna true se a ofensiva subiu hoje.
function registerPlayToday() {
  const today = todayKey();
  if (save.lastPlayedDate === today) return false;
  save.streak = save.lastPlayedDate === yesterdayKey() ? save.streak + 1 : 1;
  save.lastPlayedDate = today;
  persist();
  return true;
}


/* ---------- Progresso nas fases ---------- */
function isLevelCompleted(levelId) {
  return save.completedLevels.includes(levelId);
}

function isLevelUnlocked(index) {
  return index === 0 || isLevelCompleted(LEVELS[index - 1].id);
}

function allLevelsCompleted() {
  return LEVELS.every(level => isLevelCompleted(level.id));
}

function isEventUnlocked(event) {
  return !event.requiresAllLevels || allLevelsCompleted();
}


/* ---------- Cabeçalho ---------- */
function renderHeader() {
  refreshLives();
  document.getElementById('xp-count').textContent = save.xp;
  document.getElementById('streak-count').textContent = currentStreak();
  document.getElementById('lives-count').textContent = save.lives;

  const pill = document.getElementById('lives-pill');
  pill.title = save.lives >= MAX_LIVES
    ? 'Vidas cheias'
    : `Próxima vida em ${formatCountdown(msToNextLife())}`;


  document.querySelectorAll('[data-life-countdown]').forEach(el => {
    el.textContent = formatCountdown(msToNextLife());
  });
}

setInterval(() => {
  if (!save.isLoggedIn) return;
  const before = save.lives;
  renderHeader();
  // Se uma vida voltou com a trilha aberta, redesenha o aviso de vidas
  if (save.lives !== before && session.screen === 'tab' && session.currentTab === 'learn') {
    switchTab('learn');
  }
}, 1000);


/* =========================================================
   TELA DE CADASTRO / LOGIN
   ========================================================= */
function renderLoginView(errorMsg = '') {
  const viewport = document.getElementById('app-viewport');
  document.getElementById('app-header').classList.add('hidden');
  document.getElementById('app-nav').classList.add('hidden');
  hideFeedback();

  const floaters = ['🥤', '📄', '🍾', '🥫', '🍎', '🔋', '♻️', '🌱']
    .map((e, i) => `<span class="floater" style="left:${6 + i * 12}%; animation-delay:${i * 0.9}s; animation-duration:${9 + (i % 3) * 2}s">${e}</span>`)
    .join('');

  viewport.innerHTML = `
    <div class="relative min-h-full overflow-hidden bg-gradient-to-b from-[#081c15] via-[#1b4332] to-[#0b2a20] text-white">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">${floaters}</div>

      <div class="relative p-6 min-h-full flex flex-col justify-between items-center">
        <div class="w-full text-center mt-6 space-y-3">
          <div class="inline-block bg-emerald-400/15 p-4 rounded-[28px] border border-emerald-300/30 glow">
            <span class="text-6xl inline-block spin-slow">♻️</span>
          </div>
          <h1 class="text-4xl font-black tracking-tight">Eco<span class="text-emerald-400">Quest</span></h1>
          <p class="text-sm text-emerald-100/90 px-4 font-semibold">Aprenda a reciclar jogando, com fases, eventos e memes virais!</p>
        </div>

        <div class="w-full mt-6 bg-rose-500/15 border border-rose-300/30 rounded-2xl p-3 flex items-center gap-3">
          <span class="text-3xl">⚠️</span>
          <p class="text-[11px] text-rose-50 leading-relaxed">
            <strong class="text-white">O Brasil recicla só 8,7% do seu lixo.</strong>
            Cada pessoa que aprende a separar certo muda esse número. Bora?
          </p>
        </div>

        <form onsubmit="handleLogin(event)" class="w-full bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 space-y-3 shadow-2xl my-6" novalidate>
          <h2 class="text-sm font-extrabold text-emerald-300 text-center uppercase tracking-wider">Crie sua EcoConta</h2>

          <div class="space-y-1.5">
            <label for="login-name" class="text-[10px] font-bold text-slate-300">SEU NOME / APELIDO</label>
            <input type="text" id="login-name" maxlength="30" autocomplete="nickname" value="${esc(save.user.name)}" placeholder="Ex: EcoJogador"
              class="w-full p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:border-emerald-400" />
          </div>

          <div class="space-y-1.5">
            <label for="login-email" class="text-[10px] font-bold text-slate-300">E-MAIL (OPCIONAL)</label>
            <input type="email" id="login-email" maxlength="80" autocomplete="email" value="${esc(save.user.email)}" placeholder="seu@email.com"
              class="w-full p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-white font-bold text-sm focus:outline-none focus:border-emerald-400" />
          </div>

          <p id="login-error" class="text-[11px] font-bold text-rose-300 ${errorMsg ? '' : 'hidden'}">${esc(errorMsg)}</p>

          <button type="submit" class="btn-3d w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl mt-2">
            Começar a jogar 🚀
          </button>

          <p class="text-[10px] text-emerald-200/60 text-center">Seu progresso fica salvo neste aparelho.</p>
        </form>

        <div class="text-[10px] text-emerald-300/60 text-center pb-2">
          EcoQuest &copy; Projeto Educacional Sustentável
        </div>
      </div>
    </div>
  `;
}

function handleLogin(event) {
  if (event) event.preventDefault();
  const name = document.getElementById('login-name').value.trim();
  const email = document.getElementById('login-email').value.trim();

  if (!name) {
    renderLoginView('Digite seu nome ou apelido para continuar.');
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    save.user.name = name;
    renderLoginView('Esse e-mail não parece válido. Corrija ou deixe em branco.');
    return;
  }

  save.user = { name, email };
  save.isLoggedIn = true;
  persist();
  playSound('correct');
  switchTab('learn');
}

function logout() {
  save.isLoggedIn = false;
  persist();
  renderLoginView();
}


let resetArmedUntil = 0;
function resetProgress(button) {
  if (Date.now() > resetArmedUntil) {
    resetArmedUntil = Date.now() + 4000;
    if (button) {
      button.innerHTML = 'Toque de novo para apagar';
      button.classList.add('bg-rose-600', 'text-white', 'border-rose-600');
      setTimeout(() => {
        if (document.body.contains(button) && Date.now() > resetArmedUntil) switchTab('creators');
      }, 4100);
    }
    return;
  }
  resetArmedUntil = 0;
  save = defaultSave();
  persist();
  renderLoginView();
}


/* =========================================================
   NAVEGAÇÃO ENTRE ABAS
   ========================================================= */
function switchTab(tab) {
  if (!save.isLoggedIn) {
    renderLoginView();
    return;
  }

  stopTimer();
  hideFeedback();
  session.quiz = null;
  session.currentTab = tab;
  session.screen = 'tab';
  closeGuideModal();

  document.getElementById('app-header').classList.remove('hidden');
  document.getElementById('app-nav').classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    const active = btn.id === `nav-${tab}`;
    btn.className = `nav-btn flex flex-col items-center gap-1 transition-all ${active ? 'text-[#1b4332] font-extrabold' : 'text-slate-400 font-semibold'}`;
    btn.querySelector('div').className = `p-1 rounded-xl ${active ? 'bg-emerald-100' : ''}`;
  });

  const viewport = document.getElementById('app-viewport');
  viewport.scrollTop = 0;

  if (tab === 'learn') renderLearnTab(viewport);
  else if (tab === 'events') renderEventsTab(viewport);
  else if (tab === 'guide') renderGuideTab(viewport);
  else if (tab === 'impact') renderImpactTab(viewport);
  else if (tab === 'creators') renderCreatorsTab(viewport);

  renderHeader();
  refreshIcons();
}


/* =========================================================
   ABA APRENDER — trilha de fases
   ========================================================= */
function renderLearnTab(container) {
  const done = LEVELS.filter(l => isLevelCompleted(l.id)).length;
  const percent = Math.round((done / LEVELS.length) * 100);
  const currentIndex = LEVELS.findIndex((l, i) => isLevelUnlocked(i) && !isLevelCompleted(l.id));
  const zigzag = [0, -56, -28, 28, 56];
  const { current: rank, next: nextRank, percent: rankPercent } = getRank(save.xp);

  let posInUnit = 0;
  const trail = LEVELS.map((level, i) => {
    const unlocked = isLevelUnlocked(i);
    const completed = isLevelCompleted(level.id);
    const isCurrent = i === currentIndex;

    let unitHeader = '';
    if (level.unit) {
      posInUnit = 0;
      const unitLocked = !unlocked;
      unitHeader = `
        <div class="w-full z-10 ${i > 0 ? 'mt-4' : ''}">
          <div class="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-md border-b-4 ${unitLocked ? 'bg-slate-200 border-slate-300 text-slate-500' : 'bg-gradient-to-r from-[#1b4332] to-emerald-700 border-[#081c15] text-white'}">
            <span class="text-3xl">${unitLocked ? '🔒' : level.unit.emoji}</span>
            <div>
              <h3 class="font-black text-sm">${esc(level.unit.title)}</h3>
              <p class="text-[11px] ${unitLocked ? '' : 'text-emerald-100/90'}">${esc(level.unit.subtitle)}</p>
            </div>
          </div>
        </div>`;
    }
    const offset = zigzag[posInUnit % zigzag.length];
    posInUnit++;

    const color = unlocked ? `${level.color} text-white` : 'bg-slate-300 text-slate-500';
    const icon = unlocked ? level.icon : '🔒';

    return `
      ${unitHeader}
      <div class="z-10 flex flex-col items-center" style="transform: translateX(${offset}px)">
        ${isCurrent ? `<span class="mb-2 bg-white border-2 border-[#1b4332] text-[#1b4332] text-[10px] font-black px-3 py-1 rounded-xl shadow tooltip-down">COMEÇAR</span>` : ''}
        <div class="relative">
          ${isCurrent ? '<span class="absolute inset-0 rounded-full ring-pulse" aria-hidden="true"></span>' : ''}
          <button onclick="startLevelQuiz('${level.id}')" ${unlocked ? '' : 'disabled'}
            class="level-node relative ${color} ${isCurrent ? 'level-current' : ''}"
            aria-label="${esc(level.title)}${unlocked ? '' : ' (bloqueada)'}">
            ${icon}
          </button>
          ${completed ? `<span class="absolute -top-1 -right-1 bg-amber-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border-2 border-white shadow">✓</span>` : ''}
        </div>
        <div class="bg-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md mt-2 border ${unlocked ? 'text-slate-800' : 'text-slate-400'} text-center max-w-[220px]">
          ${esc(level.title)} ${completed ? '<span class="text-amber-500">⭐</span>' : ''}
        </div>
      </div>
    `;
  }).join('');

  const livesNotice = save.lives < MAX_LIVES ? `
    <div class="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center gap-3 text-xs text-rose-900">
      <span class="text-2xl">❤️</span>
      <div>
        <strong>${save.lives} de ${MAX_LIVES} vidas.</strong>
        Próxima vida em <span data-life-countdown class="font-black">${formatCountdown(msToNextLife())}</span>.
        <span class="block text-[11px] text-rose-700">Dica: acertar tudo num teste do Guia Lixo devolve 1 vida!</span>
      </div>
    </div>` : '';

  const masterBanner = allLevelsCompleted() ? `
    <button onclick="switchTab('events')" class="w-full text-left bg-gradient-to-r from-purple-700 to-indigo-900 text-white rounded-2xl p-4 shadow-lg border border-purple-400/40 press">
      <div class="flex items-center gap-3">
        <span class="text-4xl">👑</span>
        <div class="flex-1">
          <h3 class="font-black text-sm">Você é Mestre da Reciclagem!</h3>
          <p class="text-[11px] text-purple-100/80">O Chefão Final foi liberado na aba Eventos.</p>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5"></i>
      </div>
    </button>` : '';

  container.innerHTML = `
    <div class="p-5 space-y-5 pb-24">

      <div class="bg-gradient-to-br from-[#081c15] via-[#1b4332] to-emerald-700 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
        <div class="relative z-10 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-xl font-black">Olá, ${esc(save.user.name)}! 👋</h2>
            <span class="shrink-0 bg-white/15 border border-white/20 text-[10px] font-black px-2.5 py-1 rounded-full">${rank.icone} ${esc(rank.titulo)}</span>
          </div>

          <div>
            <div class="flex justify-between text-[11px] text-emerald-100 font-bold">
              <span>Trilha</span><span>${done}/${LEVELS.length} fases</span>
            </div>
            <div class="mt-1 h-2.5 bg-emerald-950/60 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-400 rounded-full transition-all" style="width:${percent}%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] text-amber-100 font-bold">
              <span>${nextRank ? `Próximo título: ${esc(nextRank.titulo)}` : 'Título máximo alcançado!'}</span>
              <span>${nextRank ? `${save.xp}/${nextRank.xp} XP` : `${save.xp} XP`}</span>
            </div>
            <div class="mt-1 h-2.5 bg-emerald-950/60 rounded-full overflow-hidden">
              <div class="h-full bg-amber-400 rounded-full transition-all" style="width:${rankPercent}%"></div>
            </div>
          </div>
        </div>
        <span class="absolute -right-4 -bottom-6 text-9xl opacity-10" aria-hidden="true">♻️</span>
      </div>

      ${livesNotice}
      ${masterBanner}
      ${factCard(randomItem(FATOS))}

      <div class="relative flex flex-col items-center gap-8 py-2">
        <div class="absolute w-2 bg-slate-200 top-8 bottom-8 rounded-full"></div>
        ${trail}
      </div>

      <button onclick="switchTab('impact')" class="w-full text-left bg-white border-2 border-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm press">
        <span class="text-3xl">🌎</span>
        <div class="flex-1 text-xs text-slate-700">
          <strong class="block text-slate-900 text-sm">Por que tudo isso importa?</strong>
          Veja os números do lixo no Brasil e assuma seus compromissos.
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-emerald-700"></i>
      </button>
    </div>
  `;
}


/* =========================================================
   ABA EVENTOS
   ========================================================= */
function renderEventsTab(container) {
  const cards = EVENTS.map(ev => {
    const unlocked = isEventUnlocked(ev);
    const completed = save.completedEvents.includes(ev.id);
    const doneLevels = LEVELS.filter(l => isLevelCompleted(l.id)).length;

    if (!unlocked) {
      return `
        <div class="bg-slate-200 text-slate-500 rounded-2xl p-4 border-2 border-dashed border-slate-300">
          <div class="flex items-center gap-3">
            <span class="text-4xl grayscale">🔒</span>
            <div class="flex-1">
              <span class="bg-slate-300 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">${esc(ev.badge)}</span>
              <h3 class="font-bold text-sm mt-1">${esc(ev.title)}</h3>
              <p class="text-[11px] mt-0.5">${esc(ev.subtitle)} (${doneLevels}/${LEVELS.length})</p>
            </div>
          </div>
        </div>`;
    }

    return `
      <button onclick="startEventQuiz('${ev.id}')" class="w-full text-left bg-gradient-to-r ${ev.style} text-white rounded-2xl p-4 shadow-lg border press">
        <div class="flex items-center gap-3">
          <span class="text-4xl">${ev.icon}</span>
          <div class="flex-1">
            <span class="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">${esc(ev.badge)}</span>
            ${completed ? '<span class="ml-1 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">✓ CONCLUÍDO</span>' : ''}
            <h3 class="font-bold text-sm mt-1">${esc(ev.title)}</h3>
            <p class="text-[11px] text-white/80 mt-0.5">${esc(ev.subtitle)}</p>
          </div>
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </div>
      </button>`;
  }).join('');

  container.innerHTML = `
    <div class="p-5 space-y-4 pb-24">
      <div class="text-center">
        <span class="bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-amber-300">Desafios especiais</span>
        <h2 class="text-xl font-black text-slate-900 mt-2">Eventos e Desafios Virais 🏆</h2>
        <p class="text-xs text-slate-500 mt-0.5">Enfrente perguntas com os maiores memes da internet!</p>
      </div>
      ${cards}
    </div>
  `;
}


/* =========================================================
   ABA GUIA LIXO
   ========================================================= */
function renderGuideTab(container) {
  const cards = Object.entries(GUIDE_DATABASE).map(([key, item]) => `
    <button onclick="openGuideModal('${key}')" class="w-full text-left p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#1b4332] shadow-sm transition-all flex items-center justify-between group press">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl ${item.colorBg} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
          ${item.icon}
        </div>
        <div>
          <h4 class="font-black text-sm text-slate-800">${esc(item.title)}</h4>
          <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md text-slate-600 bg-slate-100">Lixeira ${esc(item.colorName)}</span>
        </div>
      </div>
      <div class="flex items-center gap-1 text-xs font-bold text-[#1b4332]">
        <span>Ver regras</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </div>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="p-5 space-y-4 pb-24">
      <div class="text-center">
        <h2 class="text-xl font-black text-slate-900">Guia do Lixo Interativo 🎨</h2>
        <p class="text-xs text-slate-500 mt-1">Toque numa categoria para ver as regras e fazer um <strong>teste rápido</strong>!</p>
      </div>
      <div class="grid grid-cols-1 gap-3">${cards}</div>
      <p class="text-[10px] text-slate-400 text-center">Cores conforme a Resolução CONAMA nº 275/2001. Algumas cidades usam a coleta "seco x úmido": confira as regras da sua prefeitura.</p>
    </div>
  `;
}

function openGuideModal(key) {
  const item = GUIDE_DATABASE[key];
  if (!item) return;

  document.getElementById('modal-icon').textContent = item.icon;
  document.getElementById('modal-title').textContent = item.title;

  const tag = document.getElementById('modal-color-tag');
  tag.textContent = `LIXEIRA ${item.colorName.toUpperCase()}`;
  tag.className = `text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white ${item.colorBg}`;

  document.getElementById('modal-content').innerHTML = `
    <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
      <span class="font-bold text-slate-500 uppercase text-[10px]">Tempo de decomposição:</span>
      <p class="font-black text-slate-900">${esc(item.degradation)}</p>
    </div>
    <div class="space-y-1">
      <h5 class="font-extrabold text-slate-900 text-xs">🧼 Como preparar para o descarte:</h5>
      <p class="bg-emerald-50 text-emerald-950 p-2.5 rounded-xl border border-emerald-200 text-[11px]">${esc(item.prep)}</p>
    </div>
    <div class="space-y-1.5">
      <h5 class="font-extrabold text-slate-900 text-xs">📋 O que pode e o que não pode:</h5>
      <div class="space-y-1">
        ${item.rules.map(r => `<p class="p-2 rounded-lg bg-slate-100 text-[11px]">${esc(r)}</p>`).join('')}
      </div>
    </div>
    <div class="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-[11px]">
      <strong>💡 Atenção:</strong> ${esc(item.tip)}
    </div>
  `;

  document.getElementById('modal-test-btn').onclick = () => {
    closeGuideModal();
    startGuideQuiz(key);
  };

  document.getElementById('guide-modal').classList.remove('hidden');
  refreshIcons();
}

function closeGuideModal() {
  document.getElementById('guide-modal').classList.add('hidden');
}


/* =========================================================
   ABA IMPACTO — por que reciclar importa
   ========================================================= */
function renderImpactTab(container) {
  const stats = IMPACTO_STATS.map((s, i) => `
    <div class="bg-gradient-to-br ${s.cor} text-white rounded-2xl p-4 shadow-md ${i === 0 ? 'col-span-2' : ''}">
      <span class="text-2xl">${s.icone}</span>
      <p class="mt-1 leading-none"><span class="text-2xl font-black">${esc(s.valor)}</span> <span class="text-[11px] font-bold opacity-80">${esc(s.unidade)}</span></p>
      <p class="text-[11px] mt-1 opacity-90 leading-snug">${esc(s.texto)}</p>
    </div>
  `).join('');

  const path = CAMINHO_DO_LIXO.map((step, i) => `
    <div class="flex items-start gap-3">
      <div class="flex flex-col items-center">
        <div class="w-11 h-11 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-xl">${step.icone}</div>
        ${i < CAMINHO_DO_LIXO.length - 1 ? '<div class="w-1 h-6 bg-emerald-200 rounded-full my-1"></div>' : ''}
      </div>
      <div class="pt-1">
        <h4 class="font-black text-xs text-slate-900">${i + 1}. ${esc(step.titulo)}</h4>
        <p class="text-[11px] text-slate-600">${esc(step.texto)}</p>
      </div>
    </div>
  `).join('');

  const rs = CINCO_RS.map((item, i) => `
    <div class="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-2xl p-3">
      <span class="w-9 h-9 shrink-0 rounded-xl bg-lime-100 flex items-center justify-center text-lg">${item.icone}</span>
      <div>
        <h4 class="font-black text-xs text-slate-900">${i + 1}º ${esc(item.r)}</h4>
        <p class="text-[11px] text-slate-600">${esc(item.texto)}</p>
      </div>
    </div>
  `).join('');

  const pledges = COMPROMISSOS.map(p => {
    const on = save.pledges.includes(p.id);
    return `
      <button onclick="togglePledge('${p.id}')" aria-pressed="${on}"
        class="w-full text-left flex items-center gap-3 p-3 rounded-2xl border-2 transition-all press ${on ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}">
        <span class="text-xl">${p.icone}</span>
        <span class="flex-1 text-xs font-bold ${on ? 'text-emerald-900' : 'text-slate-700'}">${esc(p.texto)}</span>
        <span class="w-6 h-6 shrink-0 rounded-lg border-2 flex items-center justify-center text-xs font-black ${on ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'}">✓</span>
      </button>`;
  }).join('');

  const lessons = save.completedLevels.length + save.completedEvents.length;

  container.innerHTML = `
    <div class="p-5 space-y-6 pb-24">
      <div class="text-center">
        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-emerald-300">Por que reciclar?</span>
        <h2 class="text-xl font-black text-slate-900 mt-2">O lixo e o planeta 🌍</h2>
        <p class="text-xs text-slate-500 mt-1">Os números mostram o tamanho do problema, e o quanto a sua atitude conta.</p>
      </div>

      <section class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">📊 O lixo no Brasil</h3>
        <div class="grid grid-cols-2 gap-3">${stats}</div>
        <p class="text-[10px] text-slate-400">Fontes: Panorama dos Resíduos Sólidos no Brasil 2025 (Abrema), dados de 2024; Abal e Abralatas (latas, 2024).</p>
      </section>

      <section class="bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white rounded-3xl p-5 space-y-2 shadow-lg">
        <h3 class="font-black text-sm">Por que isso importa?</h3>
        <ul class="text-[12px] text-emerald-50 space-y-1.5 leading-relaxed">
          <li>🌳 <strong>Poupa a natureza:</strong> menos árvores, minério e petróleo tirados do planeta.</li>
          <li>⚡ <strong>Economiza energia:</strong> reciclar alumínio gasta cerca de 95% menos energia.</li>
          <li>🌊 <strong>Protege rios e oceanos:</strong> menos plástico chegando aos animais.</li>
          <li>🦟 <strong>Cuida da saúde:</strong> lixo largado atrai ratos e mosquitos que transmitem doenças.</li>
          <li>🤝 <strong>Gera renda:</strong> milhares de catadores vivem da reciclagem.</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">🚛 O caminho do reciclável</h3>
        <div class="bg-white border-2 border-slate-200 rounded-2xl p-4">${path}</div>
      </section>

      <section class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">🔁 Os 5 Rs (em ordem de importância)</h3>
        <div class="space-y-2">${rs}</div>
      </section>

      <section class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">🤝 Meus compromissos</h3>
        <p class="text-[11px] text-slate-500">Toque para assumir. Cada compromisso novo vale +${XP_PLEDGE} XP.</p>
        <div class="space-y-2">${pledges}</div>
      </section>

      <section class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
        <p class="text-[11px] font-bold text-amber-700 uppercase">Seu impacto no EcoQuest</p>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <div><span class="block text-xl font-black text-amber-900">${save.totalCorrect}</span><span class="text-[10px] text-amber-800">acertos</span></div>
          <div><span class="block text-xl font-black text-amber-900">${lessons}</span><span class="text-[10px] text-amber-800">lições</span></div>
          <div><span class="block text-xl font-black text-amber-900">${save.pledges.length}/${COMPROMISSOS.length}</span><span class="text-[10px] text-amber-800">compromissos</span></div>
        </div>
      </section>
    </div>
  `;
}

function togglePledge(id) {
  const index = save.pledges.indexOf(id);
  if (index >= 0) {
    save.pledges.splice(index, 1);
  } else {
    save.pledges.push(id);
    if (!save.pledgesRewarded.includes(id)) {
      save.pledgesRewarded.push(id);
      save.xp += XP_PLEDGE;
      playSound('correct');
      fireConfetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    }
  }
  persist();
  const viewport = document.getElementById('app-viewport');
  const scroll = viewport.scrollTop;
  renderImpactTab(viewport);
  viewport.scrollTop = scroll;
  renderHeader();
  refreshIcons();
}


/* =========================================================
   ABA CRIADORES — os dados ficam em dados.js
   ========================================================= */
function avatarHTML(index, emoji, color) {
  return `
    <button onclick="rerollAvatar(${index})" id="avatar-${index}" title="Toque para trocar o avatar"
      class="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-md border-2 border-white press avatar-pop">
      ${emoji}
    </button>`;
}

function rerollAvatar(index) {
  const el = document.getElementById(`avatar-${index}`);
  if (!el) return;
  const current = el.textContent.trim();
  let emoji = randomItem(AVATARES);
  while (emoji === current && AVATARES.length > 1) emoji = randomItem(AVATARES);
  el.outerHTML = avatarHTML(index, emoji, randomItem(AVATAR_CORES));
}

function renderCreatorsTab(container) {
  const emojis = shuffle(AVATARES);
  const colors = shuffle(AVATAR_CORES);

  const people = CRIADORES.map((p, i) => `
    <div class="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center gap-3">
      ${avatarHTML(i, emojis[i % emojis.length], colors[i % colors.length])}
      <div>
        <h4 class="font-black text-sm text-slate-800">${esc(p.nome)}</h4>
        <p class="text-[11px] text-slate-500">${esc(p.funcao)}</p>
      </div>
    </div>
  `).join('');

  const inspirations = INSPIRACOES.map((insp, i) => `
    <div class="${i === 0 ? 'bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white border-emerald-500/30' : 'bg-white text-slate-800 border-slate-200'} p-4 rounded-2xl shadow-sm border space-y-1">
      <h4 class="font-extrabold text-xs ${i === 0 ? 'text-emerald-300' : 'text-slate-900'}">${insp.icone} ${esc(insp.titulo)}</h4>
      <p class="text-[11px] leading-relaxed ${i === 0 ? 'text-slate-200' : 'text-slate-600'}">${esc(insp.texto)}</p>
    </div>
  `).join('');

  const { current: rank } = getRank(save.xp);

  container.innerHTML = `
    <div class="p-5 space-y-5 pb-24">
      <div class="text-center">
        <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-emerald-300">Projeto acadêmico</span>
        <h2 class="text-xl font-black text-slate-900 mt-2">Criadores e Inspirações 🚀</h2>
        <p class="text-xs text-slate-500">Conheça quem fez o EcoQuest e as referências do projeto!</p>
      </div>

      <div class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">👥 Integrantes do grupo</h3>
        ${people}
        <p class="text-[10px] text-slate-400 text-center">🎲 Toque num avatar para sortear outro.</p>
      </div>

      <div class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">💡 Inspirações do projeto</h3>
        ${inspirations}
      </div>

      <div class="space-y-3">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">🙋 Sua conta</h3>
        <div class="bg-white p-4 rounded-2xl border-2 border-slate-200 space-y-3">
          <div class="text-xs text-slate-600">
            <p><strong class="text-slate-900">${esc(save.user.name)}</strong>${save.user.email ? ` · ${esc(save.user.email)}` : ''}</p>
            <p class="mt-1">${rank.icone} ${esc(rank.titulo)} · ${save.xp} XP · ${save.completedLevels.length}/${LEVELS.length} fases · ofensiva de ${currentStreak()} dia(s)</p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="logout()" class="py-2.5 rounded-xl border-2 border-slate-200 text-xs font-bold text-slate-700 press flex items-center justify-center gap-1">
              <i data-lucide="log-out" class="w-4 h-4"></i> Sair
            </button>
            <button onclick="resetProgress(this)" class="py-2.5 rounded-xl border-2 border-rose-200 text-xs font-bold text-rose-700 press flex items-center justify-center gap-1">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Apagar progresso
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}


/* =========================================================
   LIÇÕES (fases, eventos e testes do guia)
   ========================================================= */
function startLevelQuiz(levelId) {
  const index = LEVELS.findIndex(l => l.id === levelId);
  if (index < 0 || !isLevelUnlocked(index)) return;
  startQuiz('level', levelId, LEVELS[index].questions, 'learn');
}

function startEventQuiz(eventId) {
  const ev = EVENTS.find(e => e.id === eventId);
  if (!ev || !isEventUnlocked(ev)) return;
  startQuiz('event', eventId, ev.questions, 'events');
}

function startGuideQuiz(guideKey) {
  const guide = GUIDE_DATABASE[guideKey];
  if (!guide || !guide.quiz) return;
  startQuiz('guide', guideKey, guide.quiz, 'guide');
}

function startQuiz(kind, id, questions, returnTab) {
  refreshLives();
  session.currentTab = returnTab;

 
  const practice = kind === 'guide';

  if (!practice && save.lives <= 0) {
    renderOutOfLives();
    return;
  }

  session.screen = 'other';
  session.quiz = {
    kind,
    id,
    returnTab,
    practice,
    questions: questions.map(q => ({ ...q })),  
    originalCount: questions.length,
    index: 0,
    correctCount: 0,
    mistakes: 0,
    xpEarned: 0,
    answered: false,
    selected: null,
    typed: ''
  };


  document.getElementById('app-nav').classList.add('hidden');
  renderQuestion();
}

function exitQuiz() {
  const returnTab = session.quiz ? session.quiz.returnTab : 'learn';
  switchTab(returnTab);
}

function stopTimer() {
  clearInterval(session.timer);
  session.timer = null;
}

function renderQuestion() {
  stopTimer();
  hideFeedback();

  const quiz = session.quiz;
  const q = quiz.questions[quiz.index];
  quiz.answered = false;
  quiz.selected = null;
  quiz.typed = '';

  const progressPercent = Math.round((quiz.correctCount / quiz.questions.length) * 100);
  const isChoice = q.type === 'choice' || q.type === 'timer';

  const answerArea = isChoice
    ? `<div class="space-y-2.5 pt-1">
        ${q.options.map((opt, idx) => `
          <button onclick="selectOption(${idx})" id="opt-${idx}"
            class="option-card w-full text-left p-3.5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white hover:border-[#1b4332] transition-all font-bold text-sm text-slate-700 flex items-center justify-between gap-2">
            <span>${esc(opt)}</span>
            <span class="w-6 h-6 shrink-0 rounded-lg border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">${String.fromCharCode(65 + idx)}</span>
          </button>
        `).join('')}
      </div>`
    : `<div class="space-y-2 pt-2">
        <input type="text" id="write-input" oninput="handleTyping(this.value)" onkeydown="if (event.key === 'Enter') checkAnswer()"
          autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite sua resposta..."
          class="w-full p-4 rounded-2xl border-2 border-slate-300 focus:border-[#1b4332] outline-none font-extrabold text-base text-slate-800 bg-white shadow-inner" />
        <p class="text-[10px] text-slate-400 font-semibold">Acentos e letras maiúsculas não importam.</p>
      </div>`;

  const retryTag = q._retry
    ? `<span class="inline-block mb-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">🔁 ERRO ANTERIOR</span>`
    : '';

  document.getElementById('app-viewport').innerHTML = `
    <div class="p-5 space-y-4 pb-48">
      <div class="flex items-center gap-3">
        <button onclick="exitQuiz()" class="text-slate-400 hover:text-slate-600" aria-label="Sair da lição">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
        <div class="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
          <div class="bg-emerald-500 h-full transition-all duration-300 rounded-full" style="width:${progressPercent}%"></div>
        </div>
        ${q.type === 'timer'
          ? `<div class="flex items-center gap-1 bg-amber-100 text-amber-800 font-black px-2.5 py-0.5 rounded-full border border-amber-300 text-xs">
               <i data-lucide="timer" class="w-3.5 h-3.5 text-amber-600"></i>
               <span id="timer-display">${q.timeLimit}s</span>
             </div>`
          : `<span class="text-xs font-bold text-slate-500">${quiz.index + 1}/${quiz.questions.length}</span>`}
      </div>

      ${q.type === 'timer' ? `
        <div class="h-1.5 bg-amber-100 rounded-full overflow-hidden">
          <div id="timer-bar" class="h-full bg-amber-500 rounded-full" style="width:100%; transition: width 1s linear"></div>
        </div>` : ''}

      <div class="flex items-start gap-3 my-1">
        <div class="w-14 h-14 rounded-2xl ${q.mascot.bg} border-2 flex items-center justify-center text-2xl shadow-sm shrink-0">
          ${q.mascot.avatar}
        </div>
        <div class="relative bg-white border-2 border-slate-200 p-3 rounded-2xl shadow-sm flex-1">
          <span class="text-[10px] font-black uppercase text-[#1b4332] block mb-0.5">${esc(q.mascot.name)}:</span>
          <p class="text-xs text-slate-700 font-semibold italic">"${esc(q.mascot.quote)}"</p>
        </div>
      </div>

      <div>
        ${retryTag}
        <h3 class="text-base font-black text-slate-900 leading-snug">${esc(q.question)}</h3>
      </div>

      ${answerArea}

      <button id="verify-btn" disabled onclick="checkAnswer()" class="w-full mt-4 py-3.5 bg-slate-300 text-slate-500 font-black text-sm rounded-2xl shadow-md transition-all">
        Verificar resposta
      </button>
    </div>
  `;

  refreshIcons();

  if (q.type === 'write') {
    const input = document.getElementById('write-input');
    if (input) input.focus();
  }

  if (q.type === 'timer') {
    session.timeLeft = q.timeLimit;
    requestAnimationFrame(() => {
      const bar = document.getElementById('timer-bar');
      if (bar) bar.style.width = `${((q.timeLimit - 1) / q.timeLimit) * 100}%`;
    });
    session.timer = setInterval(() => {
      session.timeLeft--;
      const disp = document.getElementById('timer-display');
      const bar = document.getElementById('timer-bar');
      if (disp) disp.textContent = `${Math.max(0, session.timeLeft)}s`;
      if (bar) bar.style.width = `${Math.max(0, (session.timeLeft - 1) / q.timeLimit) * 100}%`;
      if (session.timeLeft <= 0) {
        stopTimer();
        checkAnswer(true);
      }
    }, 1000);
  }
}

function selectOption(index) {
  const quiz = session.quiz;
  if (!quiz || quiz.answered) return;
  quiz.selected = index;

  document.querySelectorAll('.option-card').forEach((btn, idx) => {
    btn.className = idx === index
      ? 'option-card w-full text-left p-3.5 rounded-2xl border-2 border-b-4 border-[#1b4332] bg-emerald-50 font-black text-sm text-emerald-950 flex items-center justify-between gap-2'
      : 'option-card w-full text-left p-3.5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white font-bold text-sm text-slate-700 flex items-center justify-between gap-2';
  });
  setVerifyEnabled(true);
}

function handleTyping(value) {
  const quiz = session.quiz;
  if (!quiz || quiz.answered) return;
  quiz.typed = value;
  setVerifyEnabled(value.trim().length > 0);
}

function setVerifyEnabled(enabled) {
  const btn = document.getElementById('verify-btn');
  if (!btn) return;
  btn.disabled = !enabled;
  btn.className = enabled
    ? 'w-full mt-4 py-3.5 bg-[#1b4332] hover:bg-[#081c15] text-white font-black text-sm rounded-2xl shadow-lg transition-all press'
    : 'w-full mt-4 py-3.5 bg-slate-300 text-slate-500 font-black text-sm rounded-2xl shadow-md transition-all';
}

function checkAnswer(isTimeOut = false) {
  const quiz = session.quiz;
  if (!quiz || quiz.answered) return;

  const q = quiz.questions[quiz.index];
  const isChoice = q.type === 'choice' || q.type === 'timer';


  if (!isTimeOut) {
    if (isChoice && quiz.selected === null) return;
    if (!isChoice && !quiz.typed.trim()) return;
  }

  stopTimer();
  quiz.answered = true;

  let isCorrect = false;
  if (isChoice) {
    isCorrect = !isTimeOut && quiz.selected === q.correct;
  } else {
    const accepted = (Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]).map(normalizeAnswer);
    isCorrect = !isTimeOut && accepted.includes(normalizeAnswer(quiz.typed));
  }

  setVerifyEnabled(false);
  document.getElementById('verify-btn').classList.add('hidden');
  if (isChoice) {
    document.querySelectorAll('.option-card').forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove('hover:border-[#1b4332]');
      if (idx === q.correct) {
        btn.className = 'option-card w-full text-left p-3.5 rounded-2xl border-2 border-b-4 border-emerald-500 bg-emerald-100 font-black text-sm text-emerald-950 flex items-center justify-between gap-2';
      } else if (idx === quiz.selected) {
        btn.className = 'option-card w-full text-left p-3.5 rounded-2xl border-2 border-b-4 border-rose-400 bg-rose-50 font-bold text-sm text-rose-900 flex items-center justify-between gap-2 shake';
      } else {
        btn.classList.add('opacity-50');
      }
    });
  } else {
    const input = document.getElementById('write-input');
    if (input) {
      input.disabled = true;
      input.classList.add(isCorrect ? 'border-emerald-500' : 'border-rose-400');
      if (!isCorrect) input.classList.add('shake');
    }
  }

  const banner = document.getElementById('feedback-banner');
  const title = document.getElementById('feedback-title');
  const msg = document.getElementById('feedback-msg');
  const icon = document.getElementById('feedback-icon');
  const btn = document.getElementById('feedback-btn');
  const btnText = document.getElementById('feedback-btn-text');

  if (isCorrect) {
    playSound('correct');
    quiz.correctCount++;
    quiz.xpEarned += XP_PER_CORRECT;
    save.totalCorrect = (save.totalCorrect || 0) + 1;
    persist();
    banner.className = 'absolute bottom-0 inset-x-0 p-4 pb-6 z-40 border-t-2 shadow-2xl bg-emerald-100 border-emerald-600 text-emerald-950';
    icon.textContent = '🎉';
    title.textContent = 'Acertou em cheio!';
    msg.textContent = q.explanation;
    btn.className = 'w-full mt-3 py-3 rounded-xl bg-[#1b4332] text-white font-black text-sm shadow-md press flex items-center justify-center gap-2';
    btnText.textContent = 'Continuar';
    fireConfetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
  } else {
    playSound('wrong');
    quiz.mistakes++;
    if (!quiz.practice) loseLife();

   
    if (!q._retry) quiz.questions.push({ ...q, _retry: true });

    const correctText = isChoice
      ? q.options[q.correct]
      : (Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer);

    banner.className = 'absolute bottom-0 inset-x-0 p-4 pb-6 z-40 border-t-2 shadow-2xl bg-rose-100 border-rose-500 text-rose-950';
    icon.textContent = isTimeOut ? '⏰' : '😅';
    title.textContent = isTimeOut ? 'Tempo esgotado!' : 'Resposta incorreta';
    msg.textContent = `Resposta certa: ${correctText}. ${q.explanation}`;
    btn.className = 'w-full mt-3 py-3 rounded-xl bg-rose-600 text-white font-black text-sm shadow-md press flex items-center justify-center gap-2';
    btnText.textContent = (!quiz.practice && save.lives <= 0) ? 'Ver resultado' : 'Continuar';
  }

  
  const impactEl = document.getElementById('feedback-impact');
  if (q.impact) {
    impactEl.textContent = `🌍 Por que importa: ${q.impact}`;
    impactEl.classList.remove('hidden');
  } else {
    impactEl.classList.add('hidden');
  }

  renderHeader();
  banner.classList.remove('hidden');
  refreshIcons();
  btn.focus();
}

function hideFeedback() {
  const banner = document.getElementById('feedback-banner');
  if (banner) banner.classList.add('hidden');
}

function nextQuestion() {
  const quiz = session.quiz;
  if (!quiz) return;

  if (!quiz.practice && save.lives <= 0) {
    renderOutOfLives();
    return;
  }

  quiz.index++;
  if (quiz.index < quiz.questions.length) {
    renderQuestion();
    document.getElementById('app-viewport').scrollTop = 0;
  } else {
    renderQuizCompletion();
  }
}


/* ---------- Fim da lição ---------- */
function renderQuizCompletion() {
  const quiz = session.quiz;
  hideFeedback();
  playSound('win');
  fireConfetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });

  let bonus = 0;
  let extraLine = '';
  let title = 'Lição concluída!';

  if (quiz.kind === 'level') {
    const firstClear = !isLevelCompleted(quiz.id);
    bonus = firstClear ? XP_LEVEL_FIRST_CLEAR : XP_REPLAY_BONUS;
    if (firstClear) {
      save.completedLevels.push(quiz.id);
      const nextIndex = LEVELS.findIndex(l => l.id === quiz.id) + 1;
      if (nextIndex < LEVELS.length) {
        extraLine = `🔓 Nova fase liberada: ${LEVELS[nextIndex].title}`;
      } else {
        extraLine = '👑 Você terminou a trilha! O Chefão Final foi liberado nos Eventos.';
      }
    }
    title = 'Fase concluída!';
  } else if (quiz.kind === 'event') {
    const firstClear = !save.completedEvents.includes(quiz.id);
    bonus = firstClear ? XP_EVENT_FIRST_CLEAR : XP_REPLAY_BONUS;
    if (firstClear) save.completedEvents.push(quiz.id);
    title = 'Evento concluído!';
  } else if (quiz.kind === 'guide') {
    bonus = XP_REPLAY_BONUS;
    if (quiz.mistakes === 0 && save.lives < MAX_LIVES) {
      gainLife();
      extraLine = '❤️ Você acertou tudo de primeira e ganhou 1 vida!';
    }
    title = 'Teste concluído!';
  }

  const totalXp = quiz.xpEarned + bonus;
  const rankBefore = getRank(save.xp).current;
  save.xp += totalXp;
  const rankAfter = getRank(save.xp).current;
  const rankUp = rankAfter.xp !== rankBefore.xp;
  const streakUp = registerPlayToday();
  persist();
  renderHeader();

  const accuracy = Math.round((quiz.originalCount / (quiz.originalCount + quiz.mistakes)) * 100);
  const returnLabel = { learn: 'Voltar para a trilha', events: 'Voltar para os eventos', guide: 'Voltar para o guia' }[quiz.returnTab];

  document.getElementById('app-viewport').innerHTML = `
    <div class="p-6 text-center space-y-5 flex flex-col items-center justify-center min-h-full">
      <div class="text-7xl animate-bounce">🏆</div>
      <div>
        <h2 class="text-2xl font-black text-slate-900">${title}</h2>
        <p class="text-xs text-slate-500 mt-1">Você é um verdadeiro campeão da sustentabilidade!</p>
      </div>

      <div class="grid grid-cols-3 gap-2 w-full max-w-xs">
        <div class="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
          <span class="text-[10px] font-bold text-amber-700 block">XP ganho</span>
          <span class="text-lg font-black text-amber-900">+${totalXp}</span>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
          <span class="text-[10px] font-bold text-emerald-700 block">Precisão</span>
          <span class="text-lg font-black text-emerald-900">${accuracy}%</span>
        </div>
        <div class="bg-orange-50 border border-orange-200 p-3 rounded-2xl">
          <span class="text-[10px] font-bold text-orange-700 block">Ofensiva</span>
          <span class="text-lg font-black text-orange-900">${currentStreak()}d${streakUp ? ' 🔥' : ''}</span>
        </div>
      </div>

      ${extraLine ? `<p class="text-xs font-bold text-[#1b4332] bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 max-w-xs">${esc(extraLine)}</p>` : ''}

      ${rankUp ? `<p class="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 rounded-xl px-3 py-2 max-w-xs">🎖️ Novo título: ${rankAfter.icone} ${esc(rankAfter.titulo)}!</p>` : ''}

      <div class="w-full max-w-xs text-left">${factCard(randomItem(FATOS))}</div>

      <button onclick="switchTab('${quiz.returnTab}')" class="w-full max-w-xs py-3.5 bg-[#1b4332] hover:bg-[#081c15] text-white font-black text-sm rounded-2xl shadow-xl press">
        ${returnLabel}
      </button>
    </div>
  `;

  session.quiz = null;
}


/* ---------- Sem vidas ---------- */
function renderOutOfLives() {
  stopTimer();
  hideFeedback();
  const returnTab = session.quiz ? session.quiz.returnTab : session.currentTab;
  session.quiz = null;
  session.currentTab = returnTab;
  session.screen = 'other';
  document.getElementById('app-header').classList.remove('hidden');
  document.getElementById('app-nav').classList.add('hidden');
  renderHeader();

  document.getElementById('app-viewport').innerHTML = `
    <div class="p-6 text-center space-y-5 flex flex-col items-center justify-center min-h-full">
      <div class="text-7xl">💔</div>
      <div>
        <h2 class="text-2xl font-black text-slate-900">Suas vidas acabaram!</h2>
        <p class="text-xs text-slate-500 mt-1">Uma vida volta a cada ${LIFE_REGEN_MINUTES} minutos.</p>
      </div>
      <div class="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-3">
        <span class="text-[10px] font-bold text-rose-700 block">Próxima vida em</span>
        <span data-life-countdown class="text-2xl font-black text-rose-900">${formatCountdown(msToNextLife())}</span>
      </div>
      <p class="text-xs text-slate-600 max-w-xs">Enquanto isso, treine no <strong>Guia Lixo</strong>: os testes de lá não gastam vidas, e acertar tudo de primeira devolve 1 vida.</p>
      <div class="w-full max-w-xs space-y-2">
        <button onclick="switchTab('guide')" class="w-full py-3.5 bg-[#1b4332] text-white font-black text-sm rounded-2xl shadow-xl press">Abrir o Guia Lixo</button>
        <button onclick="switchTab('${returnTab}')" class="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold text-sm rounded-2xl press">Voltar</button>
      </div>
    </div>
  `;
}


/* =========================================================
   INÍCIO
   ========================================================= */
window.addEventListener('load', () => {
  refreshLives();
  if (save.isLoggedIn) switchTab('learn');
  else renderLoginView();
});
