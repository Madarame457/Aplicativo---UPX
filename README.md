# Aplicativo---UPX — EcoQuest ♻️

Aplicativo desenvolvido por Arthur Ribeiro, Gabriel Tonetto e Vito Graziosi.

O **EcoQuest** é um app no estilo Duolingo para aprender a descartar o lixo do jeito certo, com fases, eventos, um guia interativo e memes virais.

O projeto tem duas versões que usam o **mesmo conteúdo** (o arquivo `dados.js`):

- **Aplicativo de celular** (pasta `aplicativo/`), feito com Expo / React Native. Não usa HTML.
- **Versão web** (`index.html`, `style.css`, `app.js`), que abre no navegador.

## Como rodar o aplicativo no celular

Você precisa do [Node.js](https://nodejs.org) (versão 22 LTS ou mais nova) no computador e do app **Expo Go** no celular (Play Store ou App Store).

1. Abra um terminal na pasta do projeto e entre na pasta do app:
   ```bash
   cd aplicativo
   ```
2. Instale as dependências (só na primeira vez):
   ```bash
   npm install
   ```
3. Inicie o app:
   ```bash
   npx expo start
   ```
4. Vai aparecer um QR code no terminal. No **Android**, abra o Expo Go e toque em "Scan QR code". No **iPhone**, aponte a câmera para o QR code.

O celular e o computador precisam estar na mesma rede Wi-Fi. Se não funcionar (por exemplo, na rede da faculdade), use `npx expo start --tunnel`.

Enquanto o `npx expo start` estiver rodando, qualquer mudança salva nos arquivos aparece no celular na hora.

### Gerar o arquivo de instalação (APK) para Android

Para instalar o app sem o Expo Go, dá para gerar um APK pelo EAS (serviço gratuito da Expo, precisa criar uma conta em expo.dev):

```bash
cd aplicativo
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

No final, o EAS mostra um link para baixar o APK.

## Como abrir a versão web

Abra o arquivo `index.html` no navegador (Chrome, Edge, Firefox…). Precisa de internet para carregar o Tailwind, os ícones e a fonte.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `dados.js` | **Todo o conteúdo**: criadores, inspirações, guia do lixo, fases e eventos. Usado pelo app e pela versão web |
| `aplicativo/App.js` | Liga as telas do app e cuida da navegação |
| `aplicativo/src/telas/` | Uma tela do app por arquivo (cadastro, trilha, perguntas, guia, impacto, criadores…) |
| `aplicativo/src/jogo.js` | As regras do jogo no app (vidas, XP, ofensiva, desbloqueio, respostas) |
| `aplicativo/src/componentes.js` | Peças usadas em várias telas (botões, cabeçalho, barra de abas, confete) |
| `aplicativo/src/tema.js` | Cores e fontes do app |
| `aplicativo/src/cores.js` | Traduz os nomes de cor do `dados.js` (ex.: `bg-amber-100`) para o app |
| `aplicativo/assets/` | Ícone, tela de abertura e sons |
| `index.html`, `style.css`, `app.js` | A versão web |

## Como o jogo funciona

- As fases são liberadas em ordem: termine uma para abrir a próxima.
- Seu título muda conforme o XP: de Aprendiz do Lixo até Guardião do Planeta.
- Cada erro custa 1 vida. As vidas voltam com o tempo (1 a cada 3 minutos).
- A pergunta errada volta no fim da lição, como no Duolingo.
- Os testes do **Guia Lixo** são treino: não gastam vidas, e acertar tudo de primeira devolve 1 vida.
- A ofensiva conta os dias seguidos em que você termina pelo menos uma lição.
- Ao terminar todas as fases, o evento **Chefão Final** é liberado.
- O progresso fica salvo no próprio celular (ou no navegador, na versão web).
- No app, os acertos e erros também vibram o celular, e os sons podem ser desligados na aba Criadores.
- As cores das lixeiras seguem a Resolução CONAMA nº 275/2001.


Os dados da aba Impacto vêm do *Panorama dos Resíduos Sólidos no Brasil 2025* (Abrema, dados de 2024) e da Abal/Abralatas (latas de alumínio, 2024).
