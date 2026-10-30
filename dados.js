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
   --------------------------------------------------------- */
const CRIADORES = [
  { nome: "Arthur Ribeiro",  funcao: "Desenvolvedor",  avatar: "👨‍💻", cor: "bg-emerald-100 border-emerald-300" },
  { nome: "Gabriel Tonetto", funcao: "Desenvolvedor",  avatar: "🧑‍🎨", cor: "bg-teal-100 border-teal-300" },
  { nome: "Vito Graziosi",   funcao: "Desenvolvedor",  avatar: "🧑‍🔬", cor: "bg-amber-100 border-amber-300" }
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
