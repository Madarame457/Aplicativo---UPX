# Aplicativo---UPX — EcoQuest ♻️

Aplicativo desenvolvido por Arthur Ribeiro, Gabriel Tonetto e Vito Graziosi.

O **EcoQuest** é um app no estilo Duolingo para aprender a descartar o lixo do jeito certo, com fases, eventos, um guia interativo e memes virais.

## Como abrir

Baixe a pasta e abra o arquivo `index.html` no navegador (Chrome, Edge, Firefox…). Precisa de internet para carregar o Tailwind, os ícones e a fonte.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `index.html` | Estrutura da tela (cabeçalho, barra de navegação, janelas) |
| `style.css` | Estilos próprios (botões da trilha, animações) |
| `dados.js` | **Todo o conteúdo**: criadores, inspirações, guia do lixo, fases e eventos |
| `app.js` | A lógica do jogo (login, vidas, XP, ofensiva, perguntas) |

## Onde editar

- **Nomes e funções do grupo:** `dados.js`, lista `CRIADORES` (logo no começo do arquivo).
- **Inspirações do projeto:** `dados.js`, lista `INSPIRACOES`.
- **Perguntas das fases:** `dados.js`, lista `LEVELS`. Para criar uma fase nova, copie um bloco `{ id: ..., questions: [...] }` e cole no final da lista.
- **Eventos:** `dados.js`, lista `EVENTS`.
- **Regras do jogo** (tempo para recarregar vidas, XP por acerto): começo do `app.js`.

## Como o jogo funciona

- As fases são liberadas em ordem: termine uma para abrir a próxima.
- Cada erro custa 1 vida. As vidas voltam com o tempo (1 a cada 3 minutos).
- A pergunta errada volta no fim da lição, como no Duolingo.
- Os testes do **Guia Lixo** são treino: não gastam vidas, e acertar tudo de primeira devolve 1 vida.
- A ofensiva conta os dias seguidos em que você termina pelo menos uma lição.
- Ao terminar todas as fases, o evento **Chefão Final** é liberado.
- O progresso fica salvo no navegador do aparelho.
- As cores das lixeiras seguem a Resolução CONAMA nº 275/2001.
