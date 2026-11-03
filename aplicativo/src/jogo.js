/* =========================================================
   Regras do jogo (sem tela nenhuma aqui, só a lógica)
   Todas as funções recebem o "save" atual e devolvem um novo,
   sem alterar o antigo.
   ========================================================= */
import { LEVELS, EVENTS, RANKS } from './conteudo';

/* ---------- Configurações ---------- */
export const MAX_VIDAS = 5;
export const MINUTOS_POR_VIDA = 3;       // 1 vida volta a cada 3 minutos
export const XP_POR_ACERTO = 10;
export const XP_FASE_PRIMEIRA_VEZ = 50;  // bônus ao terminar uma fase pela 1ª vez
export const XP_REPETIR = 10;            // bônus ao refazer algo já concluído
export const XP_EVENTO_PRIMEIRA_VEZ = 40;
export const XP_COMPROMISSO = 5;         // por compromisso assumido (só na 1ª vez)

const MS_POR_VIDA = MINUTOS_POR_VIDA * 60 * 1000;


/* ---------- Save ---------- */
export function saveInicial(agora = Date.now()) {
  return {
    logado: false,
    usuario: { nome: '', email: '' },
    xp: 0,
    ofensiva: 0,
    ultimoDiaJogado: null,       // 'AAAA-MM-DD'
    vidas: MAX_VIDAS,
    vidasAtualizadasEm: agora,
    fasesConcluidas: [],
    eventosConcluidos: [],
    totalAcertos: 0,
    compromissos: [],
    compromissosPremiados: [],
    som: true
  };
}

// Junta um save antigo com os campos novos (para não quebrar quem já jogava)
export function completarSave(salvo, agora = Date.now()) {
  const base = saveInicial(agora);
  if (!salvo || typeof salvo !== 'object') return base;
  return {
    ...base,
    ...salvo,
    usuario: { ...base.usuario, ...(salvo.usuario || {}) }
  };
}


/* ---------- Datas e ofensiva ---------- */
export function chaveDia(data) {
  const a = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${a}-${m}-${d}`;
}

function hoje(agora) {
  return chaveDia(new Date(agora));
}

function ontem(agora) {
  const d = new Date(agora);
  d.setDate(d.getDate() - 1);
  return chaveDia(d);
}

// Se o jogador pulou um dia, a ofensiva mostrada volta a 0
export function ofensivaAtual(save, agora = Date.now()) {
  if (save.ultimoDiaJogado === hoje(agora) || save.ultimoDiaJogado === ontem(agora)) {
    return save.ofensiva;
  }
  return 0;
}

// Chamado ao terminar uma lição
export function registrarJogoHoje(save, agora = Date.now()) {
  const dia = hoje(agora);
  if (save.ultimoDiaJogado === dia) return { save, subiu: false };
  const ofensiva = save.ultimoDiaJogado === ontem(agora) ? save.ofensiva + 1 : 1;
  return { save: { ...save, ofensiva, ultimoDiaJogado: dia }, subiu: true };
}


/* ---------- Vidas ---------- */
export function recarregarVidas(save, agora = Date.now()) {
  if (save.vidas >= MAX_VIDAS) {
    return save.vidas === MAX_VIDAS ? save : { ...save, vidas: MAX_VIDAS };
  }
  const ganhas = Math.floor((agora - save.vidasAtualizadasEm) / MS_POR_VIDA);
  if (ganhas <= 0) return save;
  const vidas = Math.min(MAX_VIDAS, save.vidas + ganhas);
  const vidasAtualizadasEm = vidas === MAX_VIDAS ? agora : save.vidasAtualizadasEm + ganhas * MS_POR_VIDA;
  return { ...save, vidas, vidasAtualizadasEm };
}

export function perderVida(save, agora = Date.now()) {
  return {
    ...save,
    vidas: Math.max(0, save.vidas - 1),
    vidasAtualizadasEm: save.vidas === MAX_VIDAS ? agora : save.vidasAtualizadasEm
  };
}

export function ganharVida(save, agora = Date.now()) {
  if (save.vidas >= MAX_VIDAS) return save;
  const vidas = save.vidas + 1;
  return { ...save, vidas, vidasAtualizadasEm: vidas === MAX_VIDAS ? agora : save.vidasAtualizadasEm };
}

export function msAteProximaVida(save, agora = Date.now()) {
  if (save.vidas >= MAX_VIDAS) return 0;
  return Math.max(0, MS_POR_VIDA - (agora - save.vidasAtualizadasEm));
}

export function formatarTempo(ms) {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}


/* ---------- Fases e eventos ---------- */
export function faseConcluida(save, id) {
  return save.fasesConcluidas.includes(id);
}

export function faseLiberada(save, indice) {
  return indice === 0 || faseConcluida(save, LEVELS[indice - 1].id);
}

export function todasFasesConcluidas(save) {
  return LEVELS.every((f) => faseConcluida(save, f.id));
}

export function eventoLiberado(save, evento) {
  return !evento.requiresAllLevels || todasFasesConcluidas(save);
}

export function indiceFaseAtual(save) {
  return LEVELS.findIndex((f, i) => faseLiberada(save, i) && !faseConcluida(save, f.id));
}


/* ---------- Títulos por XP ---------- */
export function titulo(xp) {
  let i = 0;
  RANKS.forEach((r, j) => { if (xp >= r.xp) i = j; });
  const atual = RANKS[i];
  const proximo = RANKS[i + 1] || null;
  const porcento = proximo ? Math.round(((xp - atual.xp) / (proximo.xp - atual.xp)) * 100) : 100;
  return { atual, proximo, porcento };
}


/* ---------- Respostas ---------- */
const ACENTOS = { á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', í: 'i', ì: 'i', î: 'i', ï: 'i', ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o', ú: 'u', ù: 'u', û: 'u', ü: 'u', ç: 'c', ñ: 'n' };
const PALAVRAS_EXTRAS = new Set(['a', 'o', 'as', 'os', 'no', 'na', 'nos', 'nas', 'e', 'de', 'do', 'da', 'lixeira', 'cor', 'vai']);

// "  Lixeira MARROM! " → "marrom"   |   "Compostagém" → "compostagem"
export function normalizarResposta(texto) {
  return String(texto)
    .toLowerCase()
    .replace(/[áàâãäéèêëíìîïóòôõöúùûüçñ]/g, (c) => ACENTOS[c])
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((p) => p && !PALAVRAS_EXTRAS.has(p))
    .join(' ');
}

export function ehMultiplaEscolha(pergunta) {
  return pergunta.type === 'choice' || pergunta.type === 'timer';
}

export function respostaCerta(pergunta) {
  if (ehMultiplaEscolha(pergunta)) return pergunta.options[pergunta.correct];
  return Array.isArray(pergunta.correctAnswer) ? pergunta.correctAnswer[0] : pergunta.correctAnswer;
}

export function conferirResposta(pergunta, { escolhida = null, digitada = '', tempoEsgotado = false }) {
  if (tempoEsgotado) return false;
  if (ehMultiplaEscolha(pergunta)) return escolhida === pergunta.correct;
  const aceitas = (Array.isArray(pergunta.correctAnswer) ? pergunta.correctAnswer : [pergunta.correctAnswer]).map(normalizarResposta);
  return aceitas.includes(normalizarResposta(digitada));
}


/* ---------- Fim da lição ---------- */
// licao = { tipo: 'level'|'event'|'guide', id, perguntasOriginais, erros, xpGanho }
export function concluirLicao(save, licao, agora = Date.now()) {
  let novo = { ...save };
  let bonus = 0;
  let mensagemExtra = '';
  let tituloTela = 'Lição concluída!';

  if (licao.tipo === 'level') {
    const primeiraVez = !faseConcluida(novo, licao.id);
    bonus = primeiraVez ? XP_FASE_PRIMEIRA_VEZ : XP_REPETIR;
    if (primeiraVez) {
      novo.fasesConcluidas = [...novo.fasesConcluidas, licao.id];
      const proxima = LEVELS.findIndex((f) => f.id === licao.id) + 1;
      mensagemExtra = proxima < LEVELS.length
        ? `🔓 Nova fase liberada: ${LEVELS[proxima].title}`
        : '👑 Você terminou a trilha! O Chefão Final foi liberado nos Eventos.';
    }
    tituloTela = 'Fase concluída!';
  } else if (licao.tipo === 'event') {
    const primeiraVez = !novo.eventosConcluidos.includes(licao.id);
    bonus = primeiraVez ? XP_EVENTO_PRIMEIRA_VEZ : XP_REPETIR;
    if (primeiraVez) novo.eventosConcluidos = [...novo.eventosConcluidos, licao.id];
    tituloTela = 'Evento concluído!';
  } else if (licao.tipo === 'guide') {
    bonus = XP_REPETIR;
    if (licao.erros === 0 && novo.vidas < MAX_VIDAS) {
      novo = ganharVida(novo, agora);
      mensagemExtra = '❤️ Você acertou tudo de primeira e ganhou 1 vida!';
    }
    tituloTela = 'Teste concluído!';
  }

  const xpTotal = licao.xpGanho + bonus;
  const tituloAntes = titulo(novo.xp).atual;
  novo.xp += xpTotal;
  const tituloDepois = titulo(novo.xp).atual;

  const ofensiva = registrarJogoHoje(novo, agora);
  novo = ofensiva.save;

  const precisao = Math.round((licao.perguntasOriginais / (licao.perguntasOriginais + licao.erros)) * 100);

  return {
    save: novo,
    resumo: {
      titulo: tituloTela,
      xpTotal,
      precisao,
      mensagemExtra,
      novoTitulo: tituloDepois.xp !== tituloAntes.xp ? tituloDepois : null,
      ofensiva: ofensivaAtual(novo, agora),
      ofensivaSubiu: ofensiva.subiu
    }
  };
}


/* ---------- Compromissos ---------- */
export function alternarCompromisso(save, id) {
  if (save.compromissos.includes(id)) {
    return { save: { ...save, compromissos: save.compromissos.filter((c) => c !== id) }, premiado: false };
  }
  const premiado = !save.compromissosPremiados.includes(id);
  return {
    save: {
      ...save,
      compromissos: [...save.compromissos, id],
      compromissosPremiados: premiado ? [...save.compromissosPremiados, id] : save.compromissosPremiados,
      xp: save.xp + (premiado ? XP_COMPROMISSO : 0)
    },
    premiado
  };
}


/* ---------- Atalhos ---------- */
export function buscarFase(id) {
  return LEVELS.find((f) => f.id === id);
}

export function buscarEvento(id) {
  return EVENTS.find((e) => e.id === id);
}
