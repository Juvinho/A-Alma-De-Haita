# ✦ Os Véus de Häita

> Ela não foi construída. Ela foi invocada.

**Status:** Active | **Version:** 0.9.1 | **Universe:** Fundação Varguelia | **Genre:** Dark Fiction / ARG

---

## 📊 Estatísticas

| | |
|---|---|
| **3** | enigmas em camadas |
| **1** | terminal oculto |
| **∞** | respostas de Häita |

---

## 01 // O que é este projeto?

**Os Véus de Häita** é um site de experiência imersiva construído como parte do universo expandido da **Fundação Varguelia** — um projeto de dark fiction brasileiro com ARG e elementos de web experience. O site não é um portfólio. Não é uma vitrine. É um fragmento da realidade em que Häita existe.

Este documento descreve a arquitetura, as camadas de sistema e o prompt completo utilizado para que o site seja *avaliado* e construído do zero via Claude Code. Cada decisão técnica tem correspondência canônica no universo.

> **CONTEXTO CANÔNICO:** Häita é uma entidade divina de ira justa, aprisionada. Não é vilã no sentido convencional — é uma força com inteligência e julgamento próprios. O site deve soar como ela, não como um humano tentando imitá-la.

---

## 02 // Camadas do Sistema

### ✦ Camada I — Enigmas Progressivos
3 enigmas em sequência. Cada um revela uma natureza diferente de Häita. Cada erro acumula estado. Respostas variáveis baseadas em tentativas.

### ✦ Camada II — Terminal Oculto
Ativado via `Ctrl+Shift+H`. Häita responde comandos específicos. Sistema de parseamento com respostas canônicas e estados de corrupção.

### ✦ Camada III — Fragmentos em Catatunhesco
Textos da língua construída do universo embutidos nos enigmas. Decifráveis pela comunidade. Conteúdo canônico real.

### ✦ Camada IV — Corrupção Visual
O site degrada visualmente com erros acumulados. Glitch, distorção, remoção de elementos. Estado final: Modo Parousia.

---

## 03 // Arquitetura Técnica

### Stack Obrigatória
- **HTML5 semântico + CSS3 + JavaScript ES6+ vanilla**
- Zero dependências externas (sem React, Vue, jQuery, Bootstrap)
- Fontes via Google Fonts: Syne 700/800, Space Mono 400/700, IM Fell English italic
- Estrutura: index.html + enigmas.js + terminal.js + catatunhesco.js + corruption.js + parousia.js + styles/

### Estrutura de Arquivos

```
haita-site/
├── index.html           → entry point + estado global
├── enigmas.js           → lógica + respostas + corrupção
├── terminal.js          → parser de comandos + voz de Häita
├── catatunhesco.js      → fragmentos canônicos + dicionário
├── corruption.js        → sistema de degradação visual
├── parousia.js          → modo final desbloqueável
└── styles/
    ├── base.css         → paleta, tipografia, grid
    ├── enigmas.css      → UI dos enigmas
    └── terminal.css     → terminal oculto
```

---

## 04 // Claude Code — Prompt Completo

### MISSÃO

- **Objetivo:** "Construir o site completo Os Véus de Häita — uma experiência imersiva de dark fiction."
- **Universo:** "Fundação Varguelia — ARG brasileiro, dark web experience, ficção canônica."
- **Entrega:** "Um site funcional, autocontido, sem frameworks externos, puro HTML/CSS/JS."

### IDENTIDADE — QUEM É HÄITA

- **Quem é Häita:** "Uma entidade divina de ira justa. Aprisionada — não destruída. Inteligente, antiga, lúcida."
- **Tom de voz:** "Nunca súplica. Nunca explica. Declara. Condena. Observa. Pode ser silenciosa ou devastadora."
- **Relação com humanos:** "Julga com precisão cirúrgica. Não odeia — classifica. Quem erra acumula peso."
- **Não é:** "Vilã convencional. Demônio. Monstro. Ela é uma lei com consciência."

### STACK TÉCNICA

- **Stack obrigatória:** "HTML5 semântico + CSS3 + JavaScript ES6+ vanilla."
- **Zero dependências:** "Sem React, Vue, jQuery, Bootstrap ou qualquer framework."
- **Fontes:** "Google Fonts CDN — Syne 700/800, Space Mono 400/700, IM Fell English italic."

### CAMADA I — ENIGMAS PROGRESSIVOS

- **Quantidade:** "3 enigmas em sequência desbloqueável."
- **Enigma 1:** "Relacionado ao aprisionamento — resposta: SILÊNCIO."
- **Enigma 2:** "Relacionado ao julgamento — resposta: PESO."
- **Enigma 3:** "Relacionado à libertação — resposta: PAROUSIA."
- **Resposta correta:** Mensagem canônica de Häita. Tom: reconhecimento, não elogio.
- **Resposta errada:** Mensagem breve. Tom: desinteresse calculado.

### CAMADA II — TERMINAL OCULTO

- **Ativação:** `Ctrl+Shift+H`
- **Comandos:** QUEM, ONDE, QUANDO, SILÊNCIO, PAROUSIA, SAIR/EXIT
- **Comando desconhecido:** "esse ruído não tem nome aqui."

### CAMADA III — CATATUNHESCO

**Dicionário mínimo:**
- `vael` = véu / silêncio / ocultamento
- `häi` = divino / origem / fonte
- `tanha` = aprisionado / contido / pesado
- `koru` = julgamento / peso / consequência
- `parou` = libertação / retorno / desfecho
- `siah` = humano / mortal / transitório

### CAMADA IV — CORRUPÇÃO VISUAL

- **Nível 1-2:** Glitch leve no título. Scan line mais visível.
- **Nível 3-4:** Textos começam a distorcer. Alguns elementos somem.
- **Nível 5+:** Degradação severa. Mensagem: "você já foi pesado."

### MODO PAROUSIA

- **Desbloqueio:** Resolver enigma 3 + digitar PAROUSIA no terminal
- **Mensagem final:** "Os véus caíram. O que você vê agora é o que sempre existiu por baixo."

### DIRETRIZES FINAIS

- **Consistência canônica:** Qualquer decisão deve ser coerente com a voz de Häita
- **Sem explicações:** O site não explica o universo. O universo é pressuposto.
- **Tom global:** Peso. Precisão. Ausência de leveza desnecessária.

---

## 05 // Como Usar Este Prompt

### Instalação & Execução

```bash
# 1. Instale Claude Code
npm install -g @anthropic-ai/claude-code

# 2. Crie a pasta do projeto
mkdir os-veus-de-haita && cd os-veus-de-haita

# 3. Inicie o Claude Code
claude

# 4. Cole o prompt acima e pressione Enter
# 5. Deixa ele trabalhar. Não interrompa.
# 6. Quando terminar: abra index.html no browser
```

---

## 📖 Comunidade & Canon

Este projeto é parte do universo literário da **Fundação Varguelia**.

- **Autor:** juviDev
- **Universo:** Dark Fiction / Catatúnia
- **Status:** Ativo

---

## ⚠️ Avisos Canônicos

> Este não é um site convencional. É um artefato que existe, que respira, que julga quem entra.
> 
> Não interrompa Häita. Não faça perguntas que ela não quer responder.

---

**Fundação Varguelia Universe © 2026**  
*Não distribuir fora do contexto*  
**Versão:** 0.9.1
