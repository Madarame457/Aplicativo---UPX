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


Os dados da aba Impacto vêm do *Panorama dos Resíduos Sólidos no Brasil 2025* (Abrema, dados de 2024) e da Abal/Abralatas (latas de alumínio, 2024).
