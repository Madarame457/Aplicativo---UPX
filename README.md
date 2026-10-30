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
- **Avatares dos criadores:** `dados.js`, listas `AVATARES` e `AVATAR_CORES` (são sorteados toda vez que a aba abre).
- **Eventos:** `dados.js`, lista `EVENTS`.
- **Aba Impacto** (números do lixo, 5 Rs, caminho do reciclável, compromissos): `dados.js`, listas `IMPACTO_STATS`, `CINCO_RS`, `CAMINHO_DO_LIXO` e `COMPROMISSOS`.
- **"Você sabia?" e títulos do jogador:** `dados.js`, listas `FATOS` e `RANKS`.
- **Regras do jogo** (tempo para recarregar vidas, XP por acerto): começo do `app.js`.

## O que tem no app

- **Aprender:** 10 fases em 2 unidades ("Separar certo" e "Por que reciclar importa"), com 5 perguntas cada.
- **Eventos:** 8 desafios especiais, incluindo Mito ou Verdade, Detetive do Lixo e o Chefão Final.
- **Guia Lixo:** 7 categorias de lixo com regras e um teste rápido para cada uma.
- **Impacto:** os números do lixo no Brasil, o caminho do reciclável, os 5 Rs e uma lista de compromissos.
- **Criadores:** os integrantes do grupo, com avatares sorteados, e as inspirações do projeto.

Os dados da aba Impacto vêm do *Panorama dos Resíduos Sólidos no Brasil 2025* (Abrema, dados de 2024) e da Abal/Abralatas (latas de alumínio, 2024).

## Como o jogo funciona

- As fases são liberadas em ordem: termine uma para abrir a próxima.
- Seu título muda conforme o XP: de Aprendiz do Lixo até Guardião do Planeta.
- Cada erro custa 1 vida. As vidas voltam com o tempo (1 a cada 3 minutos).
- A pergunta errada volta no fim da lição, como no Duolingo.
- Os testes do **Guia Lixo** são treino: não gastam vidas, e acertar tudo de primeira devolve 1 vida.
- A ofensiva conta os dias seguidos em que você termina pelo menos uma lição.
- Ao terminar todas as fases, o evento **Chefão Final** é liberado.
- O progresso fica salvo no navegador do aparelho.
- As cores das lixeiras seguem a Resolução CONAMA nº 275/2001.
