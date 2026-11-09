# Mudanças do EcoQuest

Todas as mudanças importantes do projeto ficam registradas aqui.

## [Não lançado]

### Alterado

- Os 8 eventos ganharam nomes ligados ao conteúdo, no lugar dos nomes com memes:

  | Antes | Agora |
  | --- | --- |
  | Gigachad e Bombastic Side Eye | Revisão das Lixeiras |
  | Blitz dos 5 Segundos! | Recicla ou Não? 5 Segundos |
  | Caçadores de Mitos do Lixo | Mitos e Verdades da Reciclagem |
  | Separa Rápido: 4 Segundos! | Qual Lixeira? 4 Segundos |
  | O Esquadrão Brainrot | Resíduos Especiais e Ecopontos |
  | Detetive do Lixo | Itens que Confundem |
  | Por que reciclar? | Por que Reciclar? |
  | O Desafio Supremo | Desafio Final da Reciclagem |

- As etiquetas, descrições e ícones dos eventos também foram trocados para falar do conteúdo de cada um.
- O topo da aba Eventos virou "Eventos e Desafios", sem a frase sobre memes.
- O antigo "Chefão Final" agora se chama "Desafio Final" nos avisos do app e da versão web.

## [1.1.0] - 2026-11-08

### Alterado

- As 10 fases da trilha ganharam nomes ligados ao que cada uma ensina, no lugar dos nomes com memes:

  | Antes | Agora |
  | --- | --- |
  | Fase 1: Chill Guy e as Cores | Fase 1: As Cores da Coleta Seletiva |
  | Fase 2: Modo Pense Rápido | Fase 2: Plástico na Lixeira Certa |
  | Fase 3: Mestre das Baterias | Fase 3: Pilhas, Baterias e Eletrônicos |
  | Fase 4: Vidro Seguro com Hawk Tuah | Fase 4: Descarte Seguro do Vidro |
  | Fase 5: Compostagem com a Capivara | Fase 5: Orgânicos e Compostagem |
  | Fase 6: Os 5 Rs da Sustentabilidade | Fase 6: Repensar, Reduzir e Reutilizar |
  | Fase 7: O Caminho do Lixo | Fase 7: Para Onde Vai o Seu Lixo |
  | Fase 8: O Lixo do Brasil em Números | Fase 8: O Lixo no Brasil em Números |
  | Fase 9: Oceanos e Microplástico | Fase 9: Plástico nos Oceanos |
  | Fase 10: Consumo Consciente | Fase 10: Consumo Consciente no Dia a Dia |

- Os nomes novos aparecem no aplicativo e na versão web, porque os dois usam o mesmo `dados.js`.
- A versão do aplicativo passou para 1.1.0.

### Corrigido

- O arquivo .zip do release não traz mais a pasta `node_modules`. Ele caiu de cerca de 145 MB para menos de 1 MB, e não inclui mais os programas que o Windows bloqueava ao extrair. As dependências são instaladas com `npm install` (veja o README).

## [1.0.0] - 2026-11-05

Primeira versão do aplicativo de celular.

### Adicionado

- Aplicativo de celular feito com Expo / React Native (SDK 58), na pasta `aplicativo/`.
- Telas de cadastro, trilha de fases, eventos, guia do lixo, impacto, criadores, perguntas, resultado e vidas esgotadas.
- 10 fases em 2 unidades, 8 eventos e 7 testes do guia, com 100 perguntas no total.
- Vidas que recarregam com o tempo, XP, ofensiva de dias seguidos e títulos por XP.
- Sons de acerto, erro e vitória, vibração do celular e opção para desligar os sons.
- Progresso salvo no próprio celular.
- Ícone, tela de abertura e configuração para gerar o APK pelo EAS.
- O conteúdo (perguntas, guia, criadores) fica no `dados.js`, compartilhado com a versão web.
