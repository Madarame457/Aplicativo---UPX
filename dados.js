/* =========================================================
   EcoQuest — DADOS DO APP
   ---------------------------------------------------------
   Este arquivo guarda todo o CONTEÚDO do app: criadores,
   inspirações, guia do lixo, fases e eventos.
   Para mudar textos ou perguntas, mexa só aqui.
   A lógica do app fica em app.js.
   ========================================================= */


/* ---------------------------------------------------------
   ✏️ CRIADORES — coloquem aqui os nomes e funções do grupo
   (aparece na aba "Criadores")
   O avatar é sorteado da lista AVATARES toda vez que a aba abre,
   e muda de novo quando você toca nele.
   --------------------------------------------------------- */
const CRIADORES = [
  { nome: "Arthur Ribeiro",  funcao: "Desenvolvedor" },
  { nome: "Gabriel Tonetto", funcao: "Desenvolvedor" },
  { nome: "Vito Graziosi",   funcao: "Desenvolvedor" }
];

// Avatares possíveis para os criadores (os mascotes e bichos do app)
const AVATARES = [
  "🦫", "🦝", "🦈", "🐊", "🐶", "🗿", "🥁", "🩰", "🌳", "🐢",
  "🐙", "🦉", "🐸", "🦊", "🐼", "🐝", "🦜", "🐳", "🌵", "🍄"
];

// Cores de fundo sorteadas junto com o avatar
const AVATAR_CORES = [
  "from-emerald-400 to-teal-600",
  "from-amber-300 to-orange-500",
  "from-sky-400 to-indigo-600",
  "from-pink-400 to-rose-600",
  "from-lime-300 to-green-600",
  "from-violet-400 to-purple-700"
];


/* ---------------------------------------------------------
   ✏️ INSPIRAÇÕES — o que inspirou o projeto
   (aparece na aba "Criadores")
   --------------------------------------------------------- */
const INSPIRACOES = [
  {
    titulo: "Duolingo",
    icone: "✨",
    texto: "Ofensiva diária, vidas que acabam quando você erra, perguntas repetidas até acertar e fases que vão sendo desbloqueadas."
  },
  {
    titulo: "Memes & cultura pop",
    icone: "🔥",
    texto: "Os memes virais (Chill Guy, Tung Tung Tung Sahur, Tralalero Tralala…) deixam as regras de reciclagem mais fáceis de lembrar."
  },
  {
    titulo: "Coleta seletiva (CONAMA 275/2001)",
    icone: "♻️",
    texto: "As cores das lixeiras seguem o padrão brasileiro da Resolução CONAMA nº 275."
  }
];


/* ---------------------------------------------------------
   MASCOTES — memes que aparecem nas perguntas
   --------------------------------------------------------- */
const M = {
  chillGuy:   { name: "Chill Guy",            avatar: "🐶☕", bg: "bg-amber-100 border-amber-300" },
  caseOh:     { name: "CaseOh",               avatar: "🍔🏋️", bg: "bg-red-100 border-red-300" },
  pedro:      { name: "Pedro Raccoon",        avatar: "🦝🎶", bg: "bg-purple-100 border-purple-300" },
  tungTung:   { name: "Tung Tung Tung Sahur", avatar: "🥁🪵", bg: "bg-orange-100 border-orange-300" },
  tralalero:  { name: "Tralalero Tralala",    avatar: "🦈👟", bg: "bg-sky-100 border-sky-300" },
  ballerina:  { name: "Ballerina Cappuccina", avatar: "🩰☕", bg: "bg-pink-100 border-pink-300" },
  bombardiro: { name: "Bombardiro Crocodilo", avatar: "🐊✈️", bg: "bg-lime-100 border-lime-300" },
  patapim:    { name: "Brr Brr Patapim",      avatar: "🌳👃", bg: "bg-green-100 border-green-300" },
  hawkTuah:   { name: "Hawk Tuah Girl",       avatar: "🗣️💨", bg: "bg-pink-100 border-pink-300" },
  capivara:   { name: "Capivara Mewing",      avatar: "🦫🤫", bg: "bg-teal-100 border-teal-300" },
  gigachad:   { name: "Gigachad",             avatar: "🗿✨", bg: "bg-slate-200 border-slate-400" },
  sideEye:    { name: "Bombastic Side Eye",   avatar: "👀😒", bg: "bg-indigo-100 border-indigo-300" },
  sixSeven:   { name: "Six Seven",            avatar: "6️⃣7️⃣", bg: "bg-yellow-100 border-yellow-300" }
};

/*
  Como escrever uma pergunta:
  - type: "choice"  → múltipla escolha (use 2 opções para verdadeiro/falso)
          "timer"   → múltipla escolha com cronômetro (timeLimit em segundos)
          "write"   → o jogador digita a resposta (correctAnswer: lista de respostas aceitas)
  - correct: posição da opção certa, começando do 0
  - Acentos e maiúsculas não importam nas respostas digitadas.
*/


/* ---------------------------------------------------------
   GUIA DO LIXO (aba "Guia Lixo")
   --------------------------------------------------------- */
const GUIDE_DATABASE = {
  papel: {
    title: "Papel e Papelão",
    colorName: "Azul",
    colorBg: "bg-blue-600",
    icon: "📄",
    degradation: "3 a 6 meses",
    prep: "Dobre ou desmonte as caixas para economizar espaço. O papel precisa estar SECO e sem restos de comida.",
    rules: [
      "✅ SIM: jornais, revistas, caixas de papelão, cadernos velhos, folhas de sulfite, embalagens longa vida (Tetra Pak) limpas.",
      "❌ NÃO: caixa de pizza engordurada, papel higiênico, guardanapo usado, fotografias, papel plastificado ou com fita adesiva."
    ],
    tip: "Uma única caixa engordurada pode estragar um lote inteiro de papel reciclável!",
    quiz: [
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "Sou só um cara tranquilo querendo descartar minha caixa de papelão limpa. Qual a cor da lixeira?" },
        question: "Qual é a cor oficial da lixeira de PAPEL?",
        options: ["Amarelo", "Azul", "Vermelho", "Verde"],
        correct: 1,
        explanation: "Papel é AZUL! Lembre-se: papel engordurado nunca entra aqui."
      },
      {
        type: "write",
        mascot: { ...M.caseOh, quote: "A caixa da minha pizza tá cheia de gordura. Vai no PAPEL ou no LIXO COMUM?" },
        question: "Digite para onde vai a caixa de pizza engordurada: \"papel\" ou \"lixo comum\"?",
        correctAnswer: ["lixo comum", "comum", "rejeito", "nao reciclavel"],
        explanation: "Papel engordurado não recicla. Vai no lixo comum (rejeito)! A parte limpa da tampa pode ser cortada e ir no azul."
      }
    ]
  },
  plastico: {
    title: "Plástico",
    colorName: "Vermelho",
    colorBg: "bg-red-600",
    icon: "🥤",
    degradation: "Mais de 400 anos",
    prep: "Dê uma enxaguada rápida para tirar restos de comida ou bebida. Amasse as garrafas PET.",
    rules: [
      "✅ SIM: garrafas PET, potes de margarina e iogurte, frascos de xampu e detergente, sacolas limpas, tampinhas.",
      "❌ NÃO: fraldas, cabos de panela, adesivos, embalagens muito engorduradas, esponjas de cozinha."
    ],
    tip: "Amassar as garrafas PET faz caber muito mais no caminhão da coleta.",
    quiz: [
      {
        type: "timer",
        timeLimit: 8,
        mascot: { ...M.pedro, quote: "PEDRO PEDRO PEDRO! RÁPIDO! Quanto tempo uma garrafa PET demora pra se decompor?!" },
        question: "PENSE RÁPIDO! Quanto tempo o plástico leva para se decompor?",
        options: ["10 anos", "50 anos", "Mais de 400 anos", "1 mês"],
        correct: 2,
        explanation: "O plástico pode levar mais de 400 anos! Por isso reciclar é tão importante."
      },
      {
        type: "choice",
        mascot: { ...M.tralalero, quote: "Tralalero tralala! Achei um pote de iogurte sujo no mar. O que fazer antes de reciclar?" },
        question: "O que fazer com um pote de iogurte antes de jogar no plástico?",
        options: ["Nada, joga do jeito que está", "Enxaguar rapidamente", "Queimar", "Encher de terra"],
        correct: 1,
        explanation: "Uma enxaguada rápida evita mau cheiro e não contamina os outros recicláveis."
      }
    ]
  },
  vidro: {
    title: "Vidro",
    colorName: "Verde",
    colorBg: "bg-emerald-600",
    icon: "🍾",
    degradation: "Indeterminado (milhares de anos)",
    prep: "Se estiver quebrado, embrulhe em jornal ou numa caixa de leite e escreva 'VIDRO QUEBRADO' para proteger os coletores!",
    rules: [
      "✅ SIM: garrafas de bebida, potes de azeitona e maionese, copos de requeijão, frascos de perfume vazios.",
      "❌ NÃO: espelhos, lâmpadas, travessas refratárias (tipo Pyrex), vidro de janela, cerâmica e louça."
    ],
    tip: "O vidro pode ser reciclado infinitas vezes sem perder qualidade!",
    quiz: [
      {
        type: "choice",
        mascot: { ...M.hawkTuah, quote: "Tuah! Cuidado com os cacos! Qual o jeito certo de descartar um copo quebrado?" },
        question: "Como descartar vidro quebrado com segurança?",
        options: [
          "Solto dentro da lixeira verde",
          "Embrulhado em papel ou caixa, avisando que é vidro quebrado",
          "Direto no saco de lixo orgânico",
          "Enterrado no jardim"
        ],
        correct: 1,
        explanation: "Sempre embrulhe o vidro quebrado para evitar acidentes com os trabalhadores da coleta!"
      },
      {
        type: "choice",
        mascot: { ...M.ballerina, quote: "Girando, girando… quebrei o espelho do camarim! Ele vai na lixeira verde?" },
        question: "Espelho quebrado vai na lixeira de vidro?",
        options: ["Sim, é vidro", "Não, espelho tem outra composição e vai no rejeito"],
        correct: 1,
        explanation: "Espelhos têm uma camada metálica e não são reciclados com o vidro comum. Embrulhe bem e descarte como rejeito."
      }
    ]
  },
  metal: {
    title: "Metal e Alumínio",
    colorName: "Amarelo",
    colorBg: "bg-amber-500",
    icon: "🥫",
    degradation: "100 a 500 anos",
    prep: "Tire o excesso de comida e amasse as latinhas.",
    rules: [
      "✅ SIM: latinhas de alumínio, latas de conserva (milho, ervilha), tampas de pote, panelas sem cabo.",
      "❌ NÃO: clipes e grampos misturados ao papel, esponja de aço, latas de tinta ou de produtos químicos."
    ],
    tip: "Reciclar alumínio gasta cerca de 95% menos energia do que fabricar alumínio novo!",
    quiz: [
      {
        type: "write",
        mascot: { ...M.gigachad, quote: "Um verdadeiro Chad amassa a latinha antes de reciclar. Qual a cor da lixeira de METAL?" },
        question: "Digite a COR da lixeira de METAL:",
        correctAnswer: ["amarelo", "amarela"],
        explanation: "A lixeira AMARELA é para metais e alumínio!"
      },
      {
        type: "choice",
        mascot: { ...M.bombardiro, quote: "Bombardiro Crocodilo sobrevoando! Lata de tinta vazia vai no amarelo?" },
        question: "Lata de tinta pode ir na lixeira de metal?",
        options: ["Sim, é de metal", "Não, tem resíduo químico e vai para ponto de coleta especial"],
        correct: 1,
        explanation: "Restos de tinta são perigosos. Latas de tinta e solvente vão para ecopontos, não para a coleta comum."
      }
    ]
  },
  organico: {
    title: "Orgânico",
    colorName: "Marrom",
    colorBg: "bg-amber-800",
    icon: "🍎",
    degradation: "2 semanas a 6 meses",
    prep: "Pode virar adubo na compostagem doméstica! Separe dos recicláveis para não sujá-los.",
    rules: [
      "✅ SIM: cascas de frutas, restos de legumes, borra de café, folhas secas, casca de ovo.",
      "❌ NÃO: plásticos, óleo de cozinha (leve a um ponto de coleta), remédios, fezes de animais com areia sintética."
    ],
    tip: "O lixo orgânico é cerca de metade de todo o lixo que vai para os aterros no Brasil!",
    quiz: [
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫🧏‍♂️ Mantenha a mandíbula firme e responda: o que a compostagem faz com o lixo orgânico?" },
        question: "Qual o maior benefício de compostar restos de alimentos?",
        options: [
          "Gera plástico biodegradável",
          "Vira adubo natural e reduz gases do efeito estufa",
          "Cria combustível de foguete",
          "Faz o lixo sumir sem deixar rastros"
        ],
        correct: 1,
        explanation: "Compostar transforma resíduos em adubo e evita que eles soltem gás metano nos aterros!"
      }
    ]
  },
  perigoso: {
    title: "Pilhas, Baterias e Eletrônicos",
    colorName: "Laranja",
    colorBg: "bg-orange-500",
    icon: "🔋",
    degradation: "Centenas de anos (contamina solo e água)",
    prep: "NUNCA misture com o lixo comum. Leve a supermercados, lojas de eletrônicos ou ecopontos com coletores de pilhas.",
    rules: [
      "✅ Leve ao ponto de coleta: pilhas, baterias de celular, celulares e notebooks velhos, fios, carregadores, lâmpadas fluorescentes.",
      "❌ NÃO: jogue em rios, terrenos baldios ou nas lixeiras comuns de recicláveis."
    ],
    tip: "Pilhas e baterias têm metais pesados (como chumbo, cádmio e mercúrio) que contaminam a terra e a água por muito tempo.",
    quiz: [
      {
        type: "timer",
        timeLimit: 10,
        mascot: { ...M.tungTung, quote: "TUNG TUNG TUNG SAHUR! Onde coloco as pilhas velhas da minha caixinha de som?!" },
        question: "CORRA! Qual é o destino certo de pilhas e eletrônicos?",
        options: [
          "Lixeira vermelha do plástico",
          "Pontos de coleta especiais (coletor de pilhas / ecoponto)",
          "Lixo da cozinha",
          "Queimar no quintal"
        ],
        correct: 1,
        explanation: "Pilhas têm metais pesados tóxicos e devem ir para coletores especiais!"
      },
      {
        type: "write",
        mascot: { ...M.patapim, quote: "Brr brr patapim! Qual é a cor da lixeira de resíduos PERIGOSOS?" },
        question: "Digite a cor da lixeira de resíduos perigosos:",
        correctAnswer: ["laranja"],
        explanation: "Pela CONAMA 275, resíduos perigosos usam a cor LARANJA."
      }
    ]
  },
  rejeito: {
    title: "Não Reciclável (Rejeito)",
    colorName: "Cinza",
    colorBg: "bg-slate-500",
    icon: "🧻",
    degradation: "Varia muito",
    prep: "É o que sobra quando não dá para reciclar nem compostar. Embale bem e coloque na coleta comum.",
    rules: [
      "✅ Vai aqui: papel higiênico, fraldas, absorventes, guardanapos sujos, esponjas, bitucas de cigarro, adesivos.",
      "❌ NÃO: coloque recicláveis limpos aqui — eles podem voltar a ser matéria-prima!"
    ],
    tip: "Quanto menos rejeito, melhor: separar direitinho os recicláveis diminui o lixo que vai para o aterro.",
    quiz: [
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Te olhando torto… você ia jogar papel higiênico usado no azul?" },
        question: "Papel higiênico usado é reciclável?",
        options: ["Sim, é papel", "Não, é rejeito"],
        correct: 1,
        explanation: "Papel higiênico, guardanapo sujo e fraldas são rejeitos e não entram na reciclagem."
      }
    ]
  }
};


/* ---------------------------------------------------------
   FASES DA TRILHA (aba "Aprender")
   As fases são desbloqueadas em ordem.
   Para adicionar uma fase nova, copie um bloco { ... } e
   cole no final da lista.
   --------------------------------------------------------- */
const LEVELS = [
  {
    id: "level_1",
    unit: { title: "Unidade 1 · Separar certo", subtitle: "As cores e o que vai em cada lixeira", emoji: "🗑️" },
    title: "Fase 1: Chill Guy e as Cores",
    icon: "🐶",
    color: "bg-emerald-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "Sou só um cara tranquilo tentando reciclar. Em qual lixeira vai essa caixinha de suco limpa?" },
        question: "Caixas de suco ou leite (longa vida) limpas e secas vão em qual lixeira?",
        options: ["Azul (Papel)", "Marrom (Orgânico)", "Cinza (Rejeito)", "Verde (Vidro)"],
        correct: 0,
        explanation: "A embalagem longa vida é feita principalmente de papel cartão e costuma ir com o papel, no AZUL!"
      },
      {
        type: "write",
        mascot: { ...M.caseOh, quote: "Terminei o lanche e sobrou o saquinho de papel LIMPO. Qual a cor da lixeira?" },
        question: "Digite a COR da lixeira do PAPEL limpo:",
        correctAnswer: ["azul"],
        explanation: "Papel limpo vai na lixeira AZUL!"
      },
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "Relaxa… só preciso saber onde vai essa garrafa de vidro." },
        question: "Qual a cor da lixeira de VIDRO?",
        options: ["Amarelo", "Verde", "Vermelho", "Azul"],
        correct: 1,
        explanation: "Vidro vai na lixeira VERDE!"
      },
      {
        type: "choice",
        mascot: { ...M.sixSeven, quote: "Six seven! Six seven! Verdadeiro ou falso: latinha de refri vai no AMARELO?" },
        question: "Verdadeiro ou falso: latinha de alumínio vai na lixeira amarela.",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explanation: "Verdadeiro! AMARELO é a cor do metal."
      },
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫 A capivara quer saber: e a casca de banana?" },
        question: "Qual a cor da lixeira de lixo ORGÂNICO?",
        options: ["Marrom", "Cinza", "Laranja", "Azul"],
        correct: 0,
        explanation: "Orgânico é MARROM!"
      }
    ]
  },
  {
    id: "level_2",
    title: "Fase 2: Modo Pense Rápido",
    icon: "⚡",
    color: "bg-amber-500",
    questions: [
      {
        type: "timer",
        timeLimit: 6,
        mascot: { ...M.pedro, quote: "PEDRO PEDRO PEDRO! RÁPIDO! Garrafa PET vai em qual cor?!" },
        question: "PENSE RÁPIDO! Qual a cor da lixeira do PLÁSTICO?",
        options: ["Verde", "Vermelho", "Amarelo", "Marrom"],
        correct: 1,
        explanation: "Plástico vai na lixeira VERMELHA!"
      },
      {
        type: "timer",
        timeLimit: 6,
        mascot: { ...M.tralalero, quote: "Tralalero! Frasco de xampu vazio, onde vai?" },
        question: "Frasco de xampu vazio vai em qual lixeira?",
        options: ["Cinza (Rejeito)", "Marrom (Orgânico)", "Vermelho (Plástico)", "Azul (Papel)"],
        correct: 2,
        explanation: "Frascos de xampu e detergente são plástico: VERMELHO!"
      },
      {
        type: "timer",
        timeLimit: 6,
        mascot: { ...M.bombardiro, quote: "Bombardiro passando! Tampinha de garrafa é reciclável?" },
        question: "A tampinha da garrafa PET é reciclável?",
        options: ["Sim", "Não"],
        correct: 0,
        explanation: "Sim! A tampinha também é plástico e pode ir no vermelho."
      },
      {
        type: "timer",
        timeLimit: 7,
        mascot: { ...M.ballerina, quote: "Um, dois, três… o que fazer com o pote de margarina antes de reciclar?" },
        question: "Antes de jogar um pote de margarina no plástico, você deve:",
        options: ["Enxaguar rapidamente", "Deixar cheio", "Encher de água e fechar", "Cortar em pedacinhos"],
        correct: 0,
        explanation: "Uma enxaguada rápida já basta para não contaminar os outros recicláveis."
      },
      {
        type: "write",
        mascot: { ...M.pedro, quote: "Última! Digita aí a cor do PLÁSTICO, rápido!" },
        question: "Digite a cor da lixeira do PLÁSTICO:",
        correctAnswer: ["vermelho", "vermelha"],
        explanation: "VERMELHO para o plástico!"
      }
    ]
  },
  {
    id: "level_3",
    title: "Fase 3: Mestre das Baterias",
    icon: "🔋",
    color: "bg-orange-500",
    questions: [
      {
        type: "timer",
        timeLimit: 8,
        mascot: { ...M.tungTung, quote: "TUNG TUNG TUNG! O que eu faço com a bateria velha do meu celular?!" },
        question: "Onde descartar pilhas e baterias velhas?",
        options: ["Lixo orgânico", "Coletor de pilhas / ecoponto", "Pia de casa", "Queimar no fogo"],
        correct: 1,
        explanation: "Baterias têm metais pesados e devem ir para coletores especiais!"
      },
      {
        type: "choice",
        mascot: { ...M.patapim, quote: "Brr brr patapim! Por que pilha não pode ir no lixo comum?" },
        question: "Por que pilhas NÃO podem ir no lixo comum?",
        options: [
          "Porque são pesadas demais",
          "Porque têm metais pesados que contaminam solo e água",
          "Porque podem ser comidas por animais",
          "Porque ocupam muito espaço"
        ],
        correct: 1,
        explanation: "Chumbo, cádmio e mercúrio vazam das pilhas e contaminam a terra e os rios."
      },
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Hm… você ia jogar essa lâmpada fluorescente no vidro, né?" },
        question: "Onde descartar uma lâmpada fluorescente queimada?",
        options: [
          "Lixeira verde do vidro",
          "Pontos de coleta em lojas ou ecopontos",
          "Lixo orgânico",
          "Quebrar e jogar no ralo"
        ],
        correct: 1,
        explanation: "Lâmpadas fluorescentes têm mercúrio. As lojas que vendem são obrigadas a recolher (logística reversa)."
      },
      {
        type: "choice",
        mascot: { ...M.sixSeven, quote: "Six seven… verdadeiro ou falso: celular velho vai no AMARELO do metal?" },
        question: "Verdadeiro ou falso: celular velho pode ir na lixeira amarela de metal.",
        options: ["Verdadeiro", "Falso"],
        correct: 1,
        explanation: "Falso! Eletrônicos vão para pontos de coleta de lixo eletrônico, nunca para a coleta comum."
      },
      {
        type: "write",
        mascot: { ...M.tungTung, quote: "TUNG TUNG! Digita a cor da lixeira de resíduo PERIGOSO!" },
        question: "Digite a cor da lixeira de resíduos perigosos:",
        correctAnswer: ["laranja"],
        explanation: "Resíduos perigosos usam a cor LARANJA."
      }
    ]
  },
  {
    id: "level_4",
    title: "Fase 4: Vidro Seguro com Hawk Tuah",
    icon: "🍾",
    color: "bg-pink-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.hawkTuah, quote: "Tuah! Cuidado com esses cacos! O que fazer antes de jogar vidro quebrado fora?" },
        question: "Como descartar cacos de vidro com segurança?",
        options: ["Soltos, sem proteção", "Embrulhados em jornal ou caixa, avisando 'vidro quebrado'", "Jogar na calçada", "Colocar numa garrafa PET aberta"],
        correct: 1,
        explanation: "Sempre embrulhe vidro quebrado para proteger quem faz a coleta!"
      },
      {
        type: "choice",
        mascot: { ...M.ballerina, quote: "Qual desses NÃO pode entrar na lixeira verde?" },
        question: "Qual destes NÃO vai na lixeira de vidro?",
        options: ["Garrafa de suco", "Pote de azeitona", "Espelho", "Copo de requeijão"],
        correct: 2,
        explanation: "Espelho tem camada metálica e não é reciclado junto com o vidro comum."
      },
      {
        type: "choice",
        mascot: { ...M.gigachad, quote: "Verdadeiro ou falso: o vidro pode ser reciclado infinitas vezes." },
        question: "Verdadeiro ou falso: o vidro pode ser reciclado infinitas vezes.",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explanation: "Verdadeiro! O vidro volta a ser vidro sem perder qualidade."
      },
      {
        type: "timer",
        timeLimit: 7,
        mascot: { ...M.hawkTuah, quote: "Rápido! Pote de maionese de vidro, que cor?!" },
        question: "PENSE RÁPIDO! Pote de maionese de vidro vai em:",
        options: ["Verde", "Azul", "Vermelho", "Cinza"],
        correct: 0,
        explanation: "Vidro é VERDE!"
      },
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "E a tampa de metal do pote de vidro? Fica junto?" },
        question: "O pote de vidro tem tampa de metal. O que fazer?",
        options: [
          "Jogar tudo junto no verde",
          "Separar: vidro no verde, tampa no amarelo",
          "Jogar tudo no orgânico",
          "Jogar a tampa no papel"
        ],
        correct: 1,
        explanation: "Separe! Vidro na verde e tampa de metal na amarela."
      }
    ]
  },
  {
    id: "level_5",
    title: "Fase 5: Compostagem com a Capivara",
    icon: "🦫",
    color: "bg-teal-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫🧏‍♂️ Foco. O que fazer com as cascas de banana e maçã?" },
        question: "Cascas de frutas e restos de legumes podem virar:",
        options: ["Plástico duro", "Adubo, pela compostagem", "Vidro transparente", "Gasolina"],
        correct: 1,
        explanation: "Restos de alimentos viram adubo na compostagem!"
      },
      {
        type: "choice",
        mascot: { ...M.patapim, quote: "Brr brr! Casca de ovo e borra de café podem ir na composteira?" },
        question: "Verdadeiro ou falso: casca de ovo e borra de café podem ir para a compostagem.",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explanation: "Verdadeiro! As duas são ótimas para a composteira."
      },
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Sabe o que o orgânico solta quando fica apodrecendo no aterro?" },
        question: "Qual gás o lixo orgânico solta quando apodrece no aterro?",
        options: ["Oxigênio", "Metano", "Hélio", "Nitrogênio"],
        correct: 1,
        explanation: "Metano, um gás que esquenta o planeta muito mais que o CO₂."
      },
      {
        type: "choice",
        mascot: { ...M.caseOh, quote: "Sobrou óleo de fritura… posso jogar na pia?" },
        question: "O que fazer com o óleo de cozinha usado?",
        options: [
          "Jogar na pia",
          "Guardar numa garrafa PET e levar a um ponto de coleta",
          "Jogar no vaso sanitário",
          "Jogar no jardim"
        ],
        correct: 1,
        explanation: "Óleo entope canos e polui a água. Guarde numa garrafa e leve a um ponto de coleta."
      },
      {
        type: "write",
        mascot: { ...M.capivara, quote: "🤫 Última: digita a cor da lixeira do ORGÂNICO." },
        question: "Digite a cor da lixeira de lixo ORGÂNICO:",
        correctAnswer: ["marrom"],
        explanation: "MARROM! Você é um mestre da compostagem."
      }
    ]
  },

  /* ===== UNIDADE 2 — POR QUE RECICLAR IMPORTA ===== */
  {
    id: "level_6",
    unit: { title: "Unidade 2 · Por que reciclar importa", subtitle: "O impacto do lixo no Brasil e no planeta", emoji: "🌍" },
    title: "Fase 6: Os 5 Rs da Sustentabilidade",
    icon: "🔁",
    color: "bg-lime-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "Relaxa, mas presta atenção: os 5 Rs são Repensar, Recusar, Reduzir, Reutilizar e Reciclar. Qual vem por ÚLTIMO?" },
        question: "Nos 5 Rs, qual atitude deve ser a ÚLTIMA opção?",
        options: ["Reduzir", "Reciclar", "Recusar", "Repensar"],
        correct: 1,
        explanation: "Reciclar é ótimo, mas é a última etapa. O melhor lixo é aquele que nem chega a existir!",
        impact: "Reciclar também gasta energia e água. Evitar o lixo poupa tudo isso."
      },
      {
        type: "choice",
        mascot: { ...M.ballerina, quote: "Vou ao mercado dançando com minha sacola de pano! Qual R eu estou praticando?" },
        question: "Levar a própria sacola ao mercado e dispensar a sacolinha plástica é:",
        options: ["Recusar", "Reciclar", "Reutilizar só o plástico", "Nenhum R"],
        correct: 0,
        explanation: "É RECUSAR: dizer não para o descartável que você nem precisa."
      },
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫 Transformei o pote de vidro de azeitona em porta-lápis. Qual R é esse?" },
        question: "Transformar um pote de vidro em porta-lápis é:",
        options: ["Reciclar", "Reutilizar", "Recusar", "Repensar"],
        correct: 1,
        explanation: "REUTILIZAR: dar um novo uso para o objeto sem precisar processá-lo de novo."
      },
      {
        type: "choice",
        mascot: { ...M.sixSeven, quote: "Six seven! Verdadeiro ou falso: comprar refil de sabonete líquido é reduzir o lixo?" },
        question: "Verdadeiro ou falso: comprar refil em vez de um frasco novo ajuda a REDUZIR o lixo.",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explanation: "Verdadeiro! O refil usa muito menos embalagem que um frasco novo."
      },
      {
        type: "write",
        mascot: { ...M.gigachad, quote: "Um Chad não joga fora o que ainda serve. Qual R é usar de novo um objeto?" },
        question: "Digite o R que significa usar de novo um objeto, dando outra função para ele:",
        correctAnswer: ["reutilizar", "reutilização", "reusar"],
        explanation: "REUTILIZAR!"
      }
    ]
  },
  {
    id: "level_7",
    title: "Fase 7: O Caminho do Lixo",
    icon: "🚛",
    color: "bg-sky-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.bombardiro, quote: "Bombardiro sobrevoando a cidade! O caminhão da coleta seletiva levou os recicláveis. Pra onde vão primeiro?" },
        question: "Depois da coleta seletiva, os recicláveis vão primeiro para:",
        options: ["Direto para o oceano", "Uma central de triagem, onde são separados", "A casa do vizinho", "Um forno para queimar tudo"],
        correct: 1,
        explanation: "Na triagem, os materiais são separados por tipo, prensados e vendidos para a indústria transformar em produtos novos."
      },
      {
        type: "choice",
        mascot: { ...M.tungTung, quote: "TUNG TUNG! Quem são os heróis que fazem grande parte da reciclagem no Brasil?!" },
        question: "Quem é responsável por boa parte do material reciclado no Brasil?",
        options: ["Robôs gigantes", "Os catadores e as cooperativas de reciclagem", "Só as prefeituras", "Ninguém, o lixo se separa sozinho"],
        correct: 1,
        explanation: "Os catadores e as cooperativas recolhem e separam grande parte do que é reciclado no país.",
        impact: "Separar o lixo direito deixa o trabalho deles mais seguro e aumenta a renda dessas famílias."
      },
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Olhando torto pro lixão… qual a diferença dele para um aterro sanitário?" },
        question: "Qual a diferença entre lixão e aterro sanitário?",
        options: [
          "Nenhuma, é tudo igual",
          "O aterro tem o solo protegido e trata o líquido do lixo; o lixão não tem proteção nenhuma",
          "O lixão é mais moderno",
          "O aterro fica no oceano"
        ],
        correct: 1,
        explanation: "No aterro sanitário o solo é impermeabilizado e o chorume é tratado. No lixão, tudo contamina a terra e a água."
      },
      {
        type: "timer",
        timeLimit: 8,
        mascot: { ...M.patapim, quote: "Brr brr patapim! Rápido: o lixo misturado chega na triagem todo sujo. O que acontece?" },
        question: "PENSE RÁPIDO! O que acontece com o reciclável que chega sujo de comida?",
        options: ["Muitas vezes é descartado e vira rejeito", "Fica mais valioso", "Vira ouro", "Nada muda"],
        correct: 0,
        explanation: "Material sujo perde valor e muitas vezes vai para o aterro. Por isso vale enxaguar!"
      },
      {
        type: "write",
        mascot: { ...M.caseOh, quote: "Sabe aquele líquido escuro e fedido que escorre do lixo? Como chama?" },
        question: "Digite o nome do líquido tóxico que escorre do lixo em decomposição:",
        correctAnswer: ["chorume"],
        explanation: "CHORUME! Ele contamina o solo e a água quando o lixo vai para lixões."
      }
    ]
  },
  {
    id: "level_8",
    title: "Fase 8: O Lixo do Brasil em Números",
    icon: "📊",
    color: "bg-indigo-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.pedro, quote: "PEDRO PEDRO! Chuta aí: quanto do lixo das cidades o Brasil recicla?" },
        question: "Mais ou menos quanto do lixo urbano o Brasil recicla?",
        options: ["Menos de 10%", "Cerca de 30%", "Cerca de 60%", "Quase 100%"],
        correct: 0,
        explanation: "Só cerca de 8,7% do lixo urbano foi para a reciclagem em 2024 (Panorama Abrema 2025).",
        impact: "Ainda tem MUITO espaço para melhorar, e começa na sua casa."
      },
      {
        type: "choice",
        mascot: { ...M.caseOh, quote: "Quanto lixo uma pessoa produz por dia no Brasil, em média?" },
        question: "Em média, quanto lixo cada brasileiro produz por dia?",
        options: ["50 gramas", "Pouco mais de 1 kg", "10 kg", "100 kg"],
        correct: 1,
        explanation: "Cerca de 1,24 kg por pessoa por dia, o que dá mais de 380 kg por ano (Panorama Abrema 2025)."
      },
      {
        type: "choice",
        mascot: { ...M.gigachad, quote: "O Brasil é CAMPEÃO em reciclar uma coisa. Qual?" },
        question: "O Brasil recicla quase 100% de qual material?",
        options: ["Isopor", "Latinhas de alumínio", "Bitucas de cigarro", "Fraldas"],
        correct: 1,
        explanation: "Em 2024, o Brasil reciclou 97,3% das latinhas de alumínio!",
        impact: "Isso acontece porque a latinha vale dinheiro e tem uma rede enorme de catadores. Dá pra fazer o mesmo com outros materiais."
      },
      {
        type: "timer",
        timeLimit: 8,
        mascot: { ...M.tungTung, quote: "TUNG TUNG! Quanto do lixo do Brasil ainda vai pra lugar errado, tipo lixão?!" },
        question: "PENSE RÁPIDO! Que parte do lixo brasileiro ainda tem destino inadequado (como lixões)?",
        options: ["Quase nada", "Cerca de 40%", "Exatamente 100%", "Só 1%"],
        correct: 1,
        explanation: "Cerca de 40% do lixo ainda vai para destinos inadequados, como lixões (Panorama Abrema 2025)."
      },
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫 Somando tudo, quanto lixo urbano o Brasil gerou em 2024?" },
        question: "Quanto lixo urbano o Brasil gerou em 2024?",
        options: ["Cerca de 8 mil toneladas", "Cerca de 81 milhões de toneladas", "Cerca de 1 tonelada", "Cerca de 1 trilhão de toneladas"],
        correct: 1,
        explanation: "Foram cerca de 81,6 milhões de toneladas em um ano!"
      }
    ]
  },
  {
    id: "level_9",
    title: "Fase 9: Oceanos e Microplástico",
    icon: "🌊",
    color: "bg-cyan-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.tralalero, quote: "Tralalero tralala! Eu moro no mar e tô vendo uns pedacinhos de plástico minúsculos. O que é isso?" },
        question: "O que é microplástico?",
        options: ["Um plástico muito resistente", "Pedacinhos de plástico menores que 5 mm", "Plástico feito de plantas", "Um tipo de alga"],
        correct: 1,
        explanation: "Microplásticos são fragmentos menores que 5 mm. Eles se espalham pela água, pelo solo e até pela comida.",
        impact: "O plástico não some: ele só vai quebrando em pedaços cada vez menores."
      },
      {
        type: "choice",
        mascot: { ...M.ballerina, quote: "Verdadeiro ou falso: tartarugas confundem sacolinhas plásticas com águas-vivas e comem." },
        question: "Verdadeiro ou falso: tartarugas marinhas podem confundir sacolas plásticas com águas-vivas.",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explanation: "Verdadeiro! Isso pode machucar ou matar o animal."
      },
      {
        type: "choice",
        mascot: { ...M.hawkTuah, quote: "Tuah! Qual desses é um dos lixos que mais aparece nas praias?" },
        question: "Qual destes está entre os lixos mais encontrados nas praias?",
        options: ["Bitucas de cigarro", "Pianos", "Geladeiras", "Livros"],
        correct: 0,
        explanation: "Bitucas de cigarro estão entre os itens mais recolhidos nas limpezas de praia. Elas têm plástico e substâncias tóxicas."
      },
      {
        type: "timer",
        timeLimit: 7,
        mascot: { ...M.bombardiro, quote: "Rápido! Como a maior parte do plástico chega no mar?" },
        question: "PENSE RÁPIDO! Como boa parte do lixo plástico chega ao mar?",
        options: ["Por rios, bueiros e lixo jogado na rua", "Cai do céu", "Os peixes trazem", "Só por navios"],
        correct: 0,
        explanation: "O lixo jogado na rua desce pelos bueiros e rios até chegar ao oceano."
      },
      {
        type: "write",
        mascot: { ...M.tralalero, quote: "Última! Como se chama o plástico em pedacinhos menores que 5 mm?" },
        question: "Digite o nome dos pedacinhos de plástico menores que 5 mm:",
        correctAnswer: ["microplastico", "microplasticos"],
        explanation: "MICROPLÁSTICO!"
      }
    ]
  },
  {
    id: "level_10",
    title: "Fase 10: Consumo Consciente",
    icon: "🛒",
    color: "bg-rose-600",
    questions: [
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "Tô no mercado, tranquilo. Qual dessas compras gera MENOS lixo?" },
        question: "Qual opção gera MENOS lixo?",
        options: ["Biscoitos embalados um por um", "Comprar a granel com seu próprio pote", "Garrafinhas de 200 ml", "Comprar e jogar fora"],
        correct: 1,
        explanation: "Comprar a granel com seu pote evita embalagens."
      },
      {
        type: "choice",
        mascot: { ...M.tungTung, quote: "TUNG TUNG! Meu fone quebrou. Qual a primeira coisa a pensar?" },
        question: "Seu fone quebrou. O que é melhor tentar primeiro?",
        options: ["Jogar no lixo comum", "Ver se dá para consertar", "Enterrar", "Jogar no rio"],
        correct: 1,
        explanation: "Consertar faz o objeto durar mais. Se não der, leve ao ponto de coleta de eletrônicos."
      },
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Hm… você sabe o que é logística reversa?" },
        question: "O que é logística reversa?",
        options: [
          "Dirigir de ré",
          "As empresas recebem de volta produtos como pilhas, pneus e eletrônicos para dar o destino certo",
          "Mandar o lixo para outro país",
          "Queimar o lixo ao contrário"
        ],
        correct: 1,
        explanation: "A Política Nacional de Resíduos Sólidos (Lei 12.305/2010) obriga fabricantes e lojas a receber de volta vários produtos usados."
      },
      {
        type: "choice",
        mascot: { ...M.sixSeven, quote: "Six seven! Garrafinha reutilizável ou garrafa descartável todo dia?" },
        question: "Verdadeiro ou falso: usar uma garrafinha reutilizável evita centenas de garrafas descartáveis por ano.",
        options: ["Verdadeiro", "Falso"],
        correct: 0,
        explanation: "Verdadeiro! Quem compra uma garrafinha por dia joga fora mais de 300 por ano."
      },
      {
        type: "write",
        mascot: { ...M.gigachad, quote: "Qual palavra significa comprar o pacotinho que recarrega a embalagem que você já tem?" },
        question: "Digite o nome da embalagem que recarrega a que você já tem (de sabonete, detergente…):",
        correctAnswer: ["refil", "refis"],
        explanation: "REFIL! Menos plástico, mesmo produto."
      }
    ]
  }
];


/* ---------------------------------------------------------
   EVENTOS (aba "Eventos")
   requiresAllLevels: true → só libera depois de terminar todas as fases
   --------------------------------------------------------- */
const EVENTS = [
  {
    id: "viral_memes",
    badge: "MEME ROYALE",
    title: "Gigachad e Bombastic Side Eye",
    subtitle: "Mostre que você é um Chad da reciclagem!",
    icon: "🗿",
    style: "from-[#081c15] to-[#1b4332] border-emerald-500/40",
    questions: [
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Estou te olhando torto porque você jogou sacola plástica no orgânico… Qual a lixeira certa?" },
        question: "Qual a cor da lixeira para sacolas e garrafas PET?",
        options: ["Verde", "Vermelho", "Azul", "Amarelo"],
        correct: 1,
        explanation: "Plástico vai SEMPRE na lixeira VERMELHA!"
      },
      {
        type: "write",
        mascot: { ...M.gigachad, quote: "Um verdadeiro campeão sabe a cor da lixeira de VIDRO." },
        question: "Digite a cor da lixeira de VIDRO:",
        correctAnswer: ["verde"],
        explanation: "VERDE é a cor do vidro!"
      },
      {
        type: "choice",
        mascot: { ...M.tralalero, quote: "Tralalero tralala! Qual desses é o mais demorado pra sumir da natureza?" },
        question: "Qual destes demora MAIS para se decompor?",
        options: ["Casca de banana", "Jornal", "Garrafa de vidro", "Folha seca"],
        correct: 2,
        explanation: "O vidro pode levar milhares de anos. Ainda bem que ele é 100% reciclável!"
      },
      {
        type: "choice",
        mascot: { ...M.sixSeven, quote: "Six seven! Guardanapo sujo de ketchup, vai no azul?" },
        question: "Guardanapo sujo vai em qual lixeira?",
        options: ["Azul (Papel)", "Cinza (Rejeito)", "Vermelho (Plástico)", "Verde (Vidro)"],
        correct: 1,
        explanation: "Papel sujo não recicla: vai no rejeito (cinza)."
      }
    ]
  },
  {
    id: "quick_think",
    badge: "PENSE RÁPIDO",
    title: "Blitz dos 5 Segundos!",
    subtitle: "Responda antes do cronômetro zerar!",
    icon: "⏱️",
    style: "from-amber-600 to-red-700 border-amber-400/40",
    questions: [
      {
        type: "timer",
        timeLimit: 5,
        mascot: { ...M.hawkTuah, quote: "VALENDO 5 SEGUNDOS! Papel higiênico usado vai no azul?!" },
        question: "Papel higiênico usado é reciclável?",
        options: ["SIM! É papel!", "NÃO! É rejeito!"],
        correct: 1,
        explanation: "Papel higiênico e fraldas são rejeitos e NUNCA entram na reciclagem!"
      },
      {
        type: "timer",
        timeLimit: 5,
        mascot: { ...M.pedro, quote: "RÁPIDO! Lata de refrigerante!" },
        question: "Lata de refrigerante vai em:",
        options: ["Amarelo", "Vermelho"],
        correct: 0,
        explanation: "Metal é AMARELO!"
      },
      {
        type: "timer",
        timeLimit: 5,
        mascot: { ...M.ballerina, quote: "Rapidinho! Espelho quebrado vai no verde?" },
        question: "Espelho vai na lixeira de vidro?",
        options: ["Sim", "Não"],
        correct: 1,
        explanation: "Não! Espelho não é reciclado com o vidro comum."
      },
      {
        type: "timer",
        timeLimit: 5,
        mascot: { ...M.tungTung, quote: "TUNG TUNG! Pilha no orgânico pode?!" },
        question: "Pilha pode ir no lixo orgânico?",
        options: ["Pode", "Nunca"],
        correct: 1,
        explanation: "Nunca! Pilha vai para o coletor especial."
      }
    ]
  },
  {
    id: "mito_verdade",
    badge: "MITO OU VERDADE",
    title: "Caçadores de Mitos do Lixo",
    subtitle: "Descubra o que é lenda e o que é fato!",
    icon: "🤔",
    style: "from-sky-600 to-indigo-700 border-sky-400/40",
    questions: [
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Tem gente que diz que precisa lavar o reciclável com detergente. Mito ou verdade?" },
        question: "É preciso lavar os recicláveis com detergente e esponja?",
        options: ["Verdade", "Mito"],
        correct: 1,
        explanation: "Mito! Basta uma enxaguada rápida para tirar o excesso. Dá pra usar até a água que sobrou da louça."
      },
      {
        type: "choice",
        mascot: { ...M.gigachad, quote: "Dizem que o vidro perde qualidade toda vez que é reciclado. Mito ou verdade?" },
        question: "O vidro perde qualidade a cada reciclagem?",
        options: ["Verdade", "Mito"],
        correct: 1,
        explanation: "Mito! O vidro pode ser reciclado infinitas vezes sem perder qualidade."
      },
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "E aquela de que reciclar alumínio economiza muita energia?" },
        question: "Reciclar alumínio economiza muita energia em comparação a fabricar do zero?",
        options: ["Verdade", "Mito"],
        correct: 0,
        explanation: "Verdade! A economia é de cerca de 95% da energia."
      },
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫 Separar o lixo em casa não adianta nada, porque é tudo misturado depois. Mito ou verdade?" },
        question: "Separar o lixo em casa não faz diferença?",
        options: ["Verdade", "Mito"],
        correct: 1,
        explanation: "Mito! O material separado e limpo é muito mais aproveitado e ajuda os catadores e as cooperativas.",
        impact: "Onde não há coleta seletiva, vale procurar um ecoponto ou uma cooperativa na sua cidade."
      },
      {
        type: "choice",
        mascot: { ...M.pedro, quote: "Plástico biodegradável pode ser jogado na natureza, que some rapidinho. Mito ou verdade?" },
        question: "Plástico 'biodegradável' pode ser jogado na natureza sem problema?",
        options: ["Verdade", "Mito"],
        correct: 1,
        explanation: "Mito! Muitos só se decompõem em condições especiais de compostagem industrial. Na natureza, continuam poluindo."
      }
    ]
  },
  {
    id: "separa_rapido",
    badge: "BLITZ RELÂMPAGO",
    title: "Separa Rápido: 4 Segundos!",
    subtitle: "Diga a lixeira certa antes do tempo acabar!",
    icon: "⚡",
    style: "from-yellow-500 to-orange-600 border-yellow-300/40",
    questions: [
      {
        type: "timer", timeLimit: 4,
        mascot: { ...M.pedro, quote: "PEDRO! Casca de banana!" },
        question: "Casca de banana:",
        options: ["Marrom", "Azul", "Vermelho"],
        correct: 0,
        explanation: "Orgânico: MARROM."
      },
      {
        type: "timer", timeLimit: 4,
        mascot: { ...M.pedro, quote: "PEDRO! Jornal velho!" },
        question: "Jornal velho e seco:",
        options: ["Verde", "Azul", "Amarelo"],
        correct: 1,
        explanation: "Papel: AZUL."
      },
      {
        type: "timer", timeLimit: 4,
        mascot: { ...M.pedro, quote: "PEDRO! Garrafa PET!" },
        question: "Garrafa PET:",
        options: ["Vermelho", "Marrom", "Verde"],
        correct: 0,
        explanation: "Plástico: VERMELHO."
      },
      {
        type: "timer", timeLimit: 4,
        mascot: { ...M.pedro, quote: "PEDRO! Lata de milho!" },
        question: "Lata de milho vazia:",
        options: ["Azul", "Cinza", "Amarelo"],
        correct: 2,
        explanation: "Metal: AMARELO."
      },
      {
        type: "timer", timeLimit: 4,
        mascot: { ...M.pedro, quote: "PEDRO! Pote de geleia de vidro!" },
        question: "Pote de geleia de vidro:",
        options: ["Verde", "Vermelho", "Marrom"],
        correct: 0,
        explanation: "Vidro: VERDE."
      },
      {
        type: "timer", timeLimit: 4,
        mascot: { ...M.pedro, quote: "PEDRO! Fralda usada!" },
        question: "Fralda usada:",
        options: ["Azul", "Cinza", "Vermelho"],
        correct: 1,
        explanation: "Rejeito: CINZA."
      }
    ]
  },
  {
    id: "brainrot_squad",
    badge: "BRAINROT SQUAD",
    title: "O Esquadrão Brainrot",
    subtitle: "Tralalero, Bombardiro e a turma testam você!",
    icon: "🦈",
    style: "from-fuchsia-600 to-purple-800 border-fuchsia-400/40",
    questions: [
      {
        type: "choice",
        mascot: { ...M.tralalero, quote: "Tralalero tralala! Achei uma rede de pesca na praia. Isso é perigoso pros bichos do mar?" },
        question: "Redes de pesca abandonadas no mar são perigosas?",
        options: ["Não, os peixes gostam", "Sim, prendem e machucam animais marinhos"],
        correct: 1,
        explanation: "Sim! Redes abandonadas prendem tartarugas, golfinhos e peixes."
      },
      {
        type: "choice",
        mascot: { ...M.bombardiro, quote: "Bombardiro Crocodilo bombardeando lixo no lugar certo! Onde vai o pneu velho?" },
        question: "Onde descartar um pneu velho?",
        options: ["Num terreno baldio", "Em borracharias ou pontos de coleta de pneus", "No rio", "Na lixeira azul"],
        correct: 1,
        explanation: "Pneus entram na logística reversa: lojas e borracharias recebem de volta. Largados, acumulam água e viram criadouro do mosquito da dengue!"
      },
      {
        type: "choice",
        mascot: { ...M.patapim, quote: "Brr brr patapim! Eu sou uma árvore. Reciclar papel ajuda as florestas?" },
        question: "Por que reciclar papel ajuda o meio ambiente?",
        options: ["Diminui a necessidade de matéria-prima nova, água e energia", "Não ajuda em nada", "Faz as árvores crescerem mais rápido", "Deixa o papel mais caro"],
        correct: 0,
        explanation: "Papel reciclado usa menos madeira, água e energia do que papel novo."
      },
      {
        type: "write",
        mascot: { ...M.tungTung, quote: "TUNG TUNG TUNG SAHUR! Digita onde levar pilha velha!" },
        question: "Digite o nome do local da prefeitura que recebe entulho, pilhas, eletrônicos e outros resíduos especiais:",
        correctAnswer: ["ecoponto", "ecopontos", "eco ponto"],
        explanation: "ECOPONTO! Muitas cidades têm um. Procure o mais perto de você."
      },
      {
        type: "choice",
        mascot: { ...M.ballerina, quote: "Ballerina Cappuccina terminou o cappuccino. A borra de café vai onde?" },
        question: "A borra de café vai para:",
        options: ["Azul (Papel)", "Marrom (Orgânico) ou composteira", "Vermelho (Plástico)", "Laranja (Perigoso)"],
        correct: 1,
        explanation: "Orgânico! E é ótima para a composteira e para as plantas."
      }
    ]
  },
  {
    id: "detetive",
    badge: "MODO DIFÍCIL",
    title: "Detetive do Lixo 🔎",
    subtitle: "Itens que enganam até os adultos!",
    icon: "🕵️",
    style: "from-slate-700 to-slate-900 border-slate-400/40",
    questions: [
      {
        type: "choice",
        mascot: { ...M.sideEye, quote: "Esse cupom fiscal brilhante do mercado… vai no papel?" },
        question: "Cupom fiscal (aquele papel térmico brilhante) vai em:",
        options: ["Azul (Papel)", "Cinza (Rejeito)"],
        correct: 1,
        explanation: "O papel térmico tem químicos que atrapalham a reciclagem. Vai no rejeito."
      },
      {
        type: "choice",
        mascot: { ...M.caseOh, quote: "Pacote de salgadinho, por dentro prateado. E agora?" },
        question: "Na maioria das cidades, o pacote de salgadinho metalizado vai para:",
        options: ["Amarelo (Metal)", "Rejeito, porque mistura plástico e alumínio e é difícil de reciclar"],
        correct: 1,
        explanation: "Ele parece metal, mas é plástico com uma película fina de alumínio. Poucos lugares reciclam: na dúvida, rejeito."
      },
      {
        type: "choice",
        mascot: { ...M.chillGuy, quote: "Caixa de ovo de papelão, limpinha. Onde vai?" },
        question: "Caixa de ovo de papelão limpa vai em:",
        options: ["Azul (Papel) ou composteira", "Laranja (Perigoso)", "Verde (Vidro)", "Vermelho (Plástico)"],
        correct: 0,
        explanation: "É papel! Vai no azul, e também pode ir para a composteira."
      },
      {
        type: "timer",
        timeLimit: 8,
        mascot: { ...M.hawkTuah, quote: "Tuah! Termômetro antigo de mercúrio quebrou! E agora?!" },
        question: "PENSE RÁPIDO! Termômetro de mercúrio quebrado:",
        options: ["Lixo comum", "Resíduo perigoso: embalar bem e levar a ponto de coleta", "Vidro verde", "Pia"],
        correct: 1,
        explanation: "Mercúrio é muito tóxico. Não toque, embale bem e leve a um ponto de coleta de resíduos perigosos."
      },
      {
        type: "choice",
        mascot: { ...M.gigachad, quote: "Copo descartável de plástico, limpo. Recicla?" },
        question: "Copo plástico descartável limpo vai em:",
        options: ["Vermelho (Plástico)", "Marrom (Orgânico)"],
        correct: 0,
        explanation: "É plástico e vai no vermelho. Mas melhor ainda é usar um copo reutilizável!"
      }
    ]
  },
  {
    id: "missao_planeta",
    badge: "MISSÃO PLANETA",
    title: "Por que reciclar? 🌍",
    subtitle: "O quiz sobre o impacto real da reciclagem.",
    icon: "🌎",
    style: "from-emerald-600 to-teal-800 border-emerald-300/40",
    questions: [
      {
        type: "choice",
        mascot: { ...M.capivara, quote: "🤫 Pense bem: qual destes NÃO é um benefício da reciclagem?" },
        question: "Qual destes NÃO é um benefício da reciclagem?",
        options: ["Economiza recursos naturais", "Gera trabalho e renda", "Diminui o lixo nos aterros", "Aumenta a poluição dos rios"],
        correct: 3,
        explanation: "A reciclagem DIMINUI a poluição. Todas as outras opções são benefícios reais."
      },
      {
        type: "choice",
        mascot: { ...M.tungTung, quote: "TUNG TUNG! Lixo parado em lixão atrai o quê?!" },
        question: "Lixo acumulado a céu aberto atrai:",
        options: ["Ratos, baratas e mosquitos que transmitem doenças", "Borboletas raras", "Turistas", "Nada"],
        correct: 0,
        explanation: "Lixões espalham doenças como leptospirose e dengue.",
        impact: "Descartar certo também é cuidar da saúde de toda a cidade."
      },
      {
        type: "choice",
        mascot: { ...M.patapim, quote: "Brr brr! O que a compostagem evita que vá para a atmosfera?" },
        question: "Compostar o lixo orgânico ajuda o clima porque:",
        options: ["Evita a produção de metano nos aterros", "Esfria o planeta na hora", "Produz plástico", "Aumenta a fumaça"],
        correct: 0,
        explanation: "O orgânico apodrecendo nos aterros solta metano, um gás que aquece muito o planeta."
      },
      {
        type: "choice",
        mascot: { ...M.sixSeven, quote: "Six seven! Uma latinha reciclada pode voltar pra prateleira em quanto tempo?" },
        question: "Uma latinha reciclada pode voltar ao mercado como lata nova em cerca de:",
        options: ["60 dias", "100 anos", "Nunca", "500 anos"],
        correct: 0,
        explanation: "O ciclo da latinha é rápido: em cerca de 2 meses ela pode estar de volta à prateleira."
      },
      {
        type: "write",
        mascot: { ...M.gigachad, quote: "Qual é a única coisa que precisa mudar para o mundo ter menos lixo? Dica: começa com 'h'." },
        question: "Complete: o planeta muda quando mudamos nossos ____ (dica: começa com H).",
        correctAnswer: ["habitos", "habito"],
        explanation: "HÁBITOS! Separar, reduzir e reutilizar todo dia faz a diferença. 💚"
      }
    ]
  },
  {
    id: "boss_final",
    badge: "CHEFÃO FINAL",
    title: "O Desafio Supremo",
    subtitle: "Libera quando você terminar todas as fases da trilha.",
    icon: "👑",
    style: "from-purple-700 to-indigo-900 border-purple-400/40",
    requiresAllLevels: true,
    questions: [
      {
        type: "timer",
        timeLimit: 6,
        mascot: { ...M.bombardiro, quote: "Bombardiro Crocodilo chegou pra cobrar! Caixa de pizza engordurada?!" },
        question: "Caixa de pizza engordurada vai em:",
        options: ["Azul (Papel)", "Cinza (Rejeito)", "Marrom (Orgânico)", "Vermelho (Plástico)"],
        correct: 1,
        explanation: "Papel engordurado não recicla: rejeito!"
      },
      {
        type: "choice",
        mascot: { ...M.gigachad, quote: "Só os verdadeiros sabem: qual cor é de resíduo PERIGOSO?" },
        question: "Qual é a cor de resíduos perigosos na coleta seletiva?",
        options: ["Roxo", "Laranja", "Cinza", "Preto"],
        correct: 1,
        explanation: "LARANJA. (O roxo, pela CONAMA 275, é para resíduo radioativo.)"
      },
      {
        type: "write",
        mascot: { ...M.capivara, quote: "🤫 Digite o nome do processo que transforma resto de comida em adubo." },
        question: "Como se chama o processo que transforma restos de comida em adubo?",
        correctAnswer: ["compostagem"],
        explanation: "COMPOSTAGEM!"
      },
      {
        type: "timer",
        timeLimit: 6,
        mascot: { ...M.tralalero, quote: "Última, valendo a coroa! Tampa de metal do pote de vidro vai em…?" },
        question: "Tampa de metal de um pote de vidro vai em:",
        options: ["Verde", "Amarelo", "Azul", "Cinza"],
        correct: 1,
        explanation: "Metal é AMARELO, mesmo vindo junto com o vidro!"
      }
    ]
  }
];


/* ---------------------------------------------------------
   POR QUE RECICLAR IMPORTA (aba "Impacto")
   Fontes: Panorama dos Resíduos Sólidos no Brasil 2025 (Abrema),
   dados de 2024; Abal/Abralatas (latas de alumínio, 2024).
   --------------------------------------------------------- */
const IMPACTO_STATS = [
  { valor: "81,6 mi", unidade: "toneladas", texto: "de lixo urbano gerado no Brasil em 2024", icone: "🏙️", cor: "from-slate-700 to-slate-900" },
  { valor: "8,7%",    unidade: "do lixo",   texto: "foi para a reciclagem. O resto foi enterrado ou largado", icone: "♻️", cor: "from-emerald-600 to-emerald-800" },
  { valor: "40%",     unidade: "do lixo",   texto: "ainda tem destino inadequado, como lixões", icone: "⚠️", cor: "from-rose-600 to-rose-800" },
  { valor: "1,24 kg", unidade: "por dia",   texto: "de lixo produzido por cada brasileiro, em média", icone: "🧍", cor: "from-amber-500 to-orange-700" },
  { valor: "97,3%",   unidade: "das latas", texto: "de alumínio foram recicladas: prova de que dá certo!", icone: "🥫", cor: "from-sky-600 to-indigo-700" }
];

const CINCO_RS = [
  { r: "Repensar",   icone: "🧠", texto: "Eu preciso mesmo disso? Pense antes de comprar." },
  { r: "Recusar",    icone: "✋", texto: "Diga não a canudos, sacolinhas e brindes descartáveis." },
  { r: "Reduzir",    icone: "📉", texto: "Prefira refil, produtos a granel e menos embalagem." },
  { r: "Reutilizar", icone: "🔁", texto: "Dê uma nova função para potes, vidros e roupas." },
  { r: "Reciclar",   icone: "♻️", texto: "O que sobrar, separe limpo na lixeira certa." }
];

const CAMINHO_DO_LIXO = [
  { icone: "🏠", titulo: "Você separa", texto: "Recicláveis limpos e secos, longe do orgânico." },
  { icone: "🚛", titulo: "Coleta seletiva", texto: "O caminhão, um ecoponto ou um catador recolhe." },
  { icone: "🧤", titulo: "Triagem", texto: "Catadores e cooperativas separam por material." },
  { icone: "🏭", titulo: "Indústria", texto: "O material é derretido, moído ou desfeito." },
  { icone: "🛍️", titulo: "Produto novo", texto: "Volta para a loja e o ciclo recomeça!" }
];

// Compromissos que o jogador pode assumir (ganha XP na primeira vez)
const COMPROMISSOS = [
  { id: "separar_casa", icone: "🗑️", texto: "Vou separar o lixo reciclável em casa" },
  { id: "sacola",       icone: "👜", texto: "Vou levar minha própria sacola às compras" },
  { id: "garrafinha",   icone: "🧴", texto: "Vou usar uma garrafinha reutilizável" },
  { id: "pilhas",       icone: "🔋", texto: "Vou levar pilhas e eletrônicos a um ponto de coleta" },
  { id: "oleo",         icone: "🍳", texto: "Não vou jogar óleo de cozinha na pia" },
  { id: "contar",       icone: "📣", texto: "Vou ensinar alguém a separar o lixo" }
];

// "Você sabia?" — um aparece sorteado na trilha e no fim de cada lição
const FATOS = [
  "Só cerca de 8,7% do lixo urbano do Brasil vai para a reciclagem.",
  "O Brasil reciclou 97,3% das latinhas de alumínio em 2024.",
  "Cada brasileiro produz, em média, 1,24 kg de lixo por dia.",
  "Cerca de 40% do lixo brasileiro ainda vai para lugares inadequados, como lixões.",
  "Reciclar alumínio gasta cerca de 95% menos energia do que produzir alumínio novo.",
  "O vidro pode ser reciclado infinitas vezes sem perder qualidade.",
  "O plástico pode levar mais de 400 anos para se decompor.",
  "Os catadores e as cooperativas recolhem grande parte de todo o material reciclado no Brasil.",
  "O lixo orgânico apodrecendo nos aterros solta metano, um gás que aquece o planeta.",
  "Uma latinha reciclada pode voltar à prateleira em cerca de 60 dias.",
  "Pneus largados acumulam água e viram criadouro do mosquito da dengue.",
  "Óleo de cozinha jogado na pia entope canos e polui rios."
];

// Títulos do jogador conforme o XP
const RANKS = [
  { xp: 0,    titulo: "Aprendiz do Lixo",       icone: "🌱" },
  { xp: 150,  titulo: "Separador Iniciante",    icone: "🗑️" },
  { xp: 400,  titulo: "Reciclador Esperto",     icone: "♻️" },
  { xp: 800,  titulo: "Defensor da Natureza",   icone: "🛡️" },
  { xp: 1300, titulo: "Herói da Coleta",        icone: "🦸" },
  { xp: 2000, titulo: "Guardião do Planeta",    icone: "🌍" }
];
