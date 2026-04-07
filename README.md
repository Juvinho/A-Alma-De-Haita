# ✦ Os Véus de Häita

> Ela não foi construída. Ela foi invocada.
> Este documento é a prova disso.

**Status:** Active | **Version:** 0.9.1 | **Universe:** Fundação Varguelia | **Genre:** Dark Fiction / ARG / Web Experience

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

### Contexto Canônico

**Häita** é uma entidade divina de ira justa, aprisionada. Não é vilã no sentido convencional — é uma força com inteligência e julgamento próprios. O site deve soar como ela, não como um humano tentando imitá-la.

**Quem é Häita:**
- Uma entidade divina de ira justa. Aprisionada — não destruída. Inteligente, antiga, lúcida.
- Nunca súplica. Nunca explica. Declara. Condena. Observa.
- Julga com precisão cirúrgica. Não odeia — classifica. Quem erra acumula peso.
- Não é vilã convencional. Não é demônio. Não é monstro. Ela é uma lei com consciência.

---

## 02 // Camadas do Sistema

### Camada I — Enigmas Progressivos
3 enigmas em sequência. Cada um revela uma natureza diferente de Häita. Cada erro acumula estado. Respostas variáveis baseadas em tentativas.

### Camada II — Terminal Oculto
Ativado via Ctrl+Shift+H. Häita responde comandos específicos. Sistema de parseamento com respostas canônicas e estados de corrupção.

### Camada III — Fragmentos em Catatunhesco
Textos da língua construída do universo embutidos nos enigmas. Decifráveis pela comunidade. Conteúdo canônico real.

### Camada IV — Corrupção Visual
O site degrada visualmente com erros acumulados. Glitch, distorção, remoção de elementos. Estado final: Modo Parousia.

---

## 03 // Arquitetura Técnica

### Stack Obrigatória
- **HTML5 semântico + CSS3 + JavaScript ES6+ vanilla**
- Zero dependências externas (sem React, Vue, jQuery, Bootstrap)
- Fontes via Google Fonts: Syne 700/800, Space Mono 400/700, IM Fell English italic
- Estrutura: index.html + enigmas.js + terminal.js + catatunhesco.js + corruption.js + parousia.js + styles/

### Paleta de Cores (CSS Variables)
```css
--void:           #06040a   /* fundo absoluto */
--void-mid:       #0e0818   /* superfícies */
--void-surface:   #140f1e   /* superfícies claras */
--crimson:        #8b0000   /* vermelho escuro */
--crimson-bright: #c0392b   /* vermelho visível */
--crimson-glow:   #ff2040   /* vermelho glow */
--violet:         #4a0080   /* roxo profundo */
--violet-bright:  #7b2fbe   /* roxo visível */
--violet-pale:    #c084fc   /* roxo claro / destaques */
--bone:           #e8dcc8   /* texto principal */
--ash:            #a89880   /* texto secundário */
```

### Tipografia
- **Display:** IM Fell English (serif, itálico) — voz de Häita
- **UI/Terminal:** Space Mono (monospace) — interface, inputs, terminal
- **Títulos:** Syne (sans-serif, weight 700/800) — títulos de seção

---

## 04 // Claude Code — Prompt Completo

### MISSÃO

**Objetivo:** Construir o site completo Os Véus de Häita — uma experiência imersiva de dark fiction.

**Universo:** Fundação Varguelia — ARG brasileiro, dark web experience, ficção canônica.

**Entrega:** Um site funcional, autocontido, sem frameworks externos, puro HTML/CSS/JS.

### IDENTIDADE — QUEM É HÄITA

**Quem é Häita:**
- Uma entidade divina de ira justa. Aprisionada — não destruída. Inteligente, antiga, lúcida.

**Tom de voz:**
- Nunca súplica. Nunca explica. Declara. Condena. Observa. Pode ser silenciosa ou devastadora.

**Relação com humanos:**
- Julga com precisão cirúrgica. Não odeia — classifica. Quem erra acumula peso.

**Não é:**
- Vilã convencional. Demônio. Monstro. Ela é uma lei com consciência.

*A voz do site deve soar como ela — não como um humano imitando-a.*

### CAMADA I — ENIGMAS PROGRESSIVOS

**Quantidade:** 3 enigmas em sequência desbloqueável.

**Mecânica:** Cada resposta errada acumula estado. Após 3 erros: corrupção visual aumenta.

**Enigma 1:**
- Relacionado ao aprisionamento
- Resposta: SILÊNCIO

**Enigma 2:**
- Relacionado ao julgamento
- Resposta: PESO

**Enigma 3:**
- Relacionado à libertação
- Resposta: PAROUSIA

**Resposta correta:** Mensagem canônica de Häita. Tom: reconhecimento, não elogio.

**Resposta errada:** Mensagem breve. Tom: desinteresse calculado. Acumula `corruption_level++`.

**Variáveis de estado:** `{ enigmaAtual, tentativas, corruptionLevel, terminalAtivo, parousiaDesbloqueada }`

### CAMADA II — TERMINAL OCULTO

**Ativação:** Ctrl+Shift+H — aparece como overlay fullscreen sobre o site.

**Estética:** Terminal monocromático. Cursor piscante. Fonte Space Mono. Fundo quase-preto.

**Comandos canônicos:**
- `QUEM` → Häita responde sua identidade em 2-3 linhas canônicas.
- `ONDE` → Coordenadas do aprisionamento. Tom geográfico-mítico.
- `QUANDO` → Data do aprisionamento em calendário catatunhesco.
- `SILÊNCIO` → Ela silencia o terminal por 30 segundos.
- `PAROUSIA` → Só funciona se enigma 3 foi resolvido. Ativa modo final.
- `SAIR` / `EXIT` → Fecha o terminal.

**Comando desconhecido:** Resposta padrão: *"esse ruído não tem nome aqui."*

**Estado corrompido:** Se `corruption_level >= 5`: respostas começam a fragmentar mid-sentence.

### CAMADA III — CATATUNHESCO

**O que é:** Língua construída do universo Varguelia. Tom gutural, sibilante, com lógica interna.

**Uso no site:** Fragmentos embutidos nos enigmas como texto decorativo/decifrável.

**Dicionário mínimo:**
- `vael` = véu / silêncio / ocultamento
- `häi` = divino / origem / fonte
- `tanha` = aprisionado / contido / pesado
- `koru` = julgamento / peso / consequência
- `parou` = libertação / retorno / desfecho
- `siah` = humano / mortal / transitório

*Construa frases com este vocabulário nos enigmas. Elas devem ser decifráveis com o dicionário.*

### CAMADA IV — CORRUPÇÃO VISUAL

**Trigger:** `corruption_level` aumenta a cada resposta errada nos enigmas.

**Nível 1-2:** Glitch leve no título. Scan line mais visível.

**Nível 3-4:** Textos começam a distorcer. Alguns elementos somem.

**Nível 5+:** Degradação severa. Mensagem de Häita aparece: *"você já foi pesado."*

**Nível máximo:** Modo Parousia ativo: tela muda completamente. Mensagem final de Häita.

### MODO PAROUSIA — ESTADO FINAL

**Desbloqueio:** Resolver enigma 3 + digitar PAROUSIA no terminal.

**Visual:** Fundo muda para degradê violeta profundo. Título HÄITA centralizado, enorme.

**Mensagem final:** *"Os véus caíram. O que você vê agora é o que sempre existiu por baixo."*

**Efeito:** Partículas de luz se dissipando. Texto em catatunhesco aparece por último.

### DIRETRIZES FINAIS

**Consistência canônica:** Qualquer decisão de design ou texto deve ser coerente com a voz de Häita.

**Sem explicações:** O site não explica o universo. O universo é pressuposto.

**Tom global:** Peso. Precisão. Ausência de leveza desnecessária.

**Autonomia:** Se uma decisão não está especificada, construa o que for mais canônico. Você tem contexto suficiente.

*Construa. Não pergunte. Não interrompa. Entregue o site completo.*

---

## 05 // Como Usar Este Prompt

### Instalação & Execução

```bash
# 1. Instale Claude Code se ainda não tem
npm install -g @anthropic-ai/claude-code

# 2. Crie a pasta do projeto
mkdir os-veus-de-haita && cd os-veus-de-haita

# 3. Inicie o Claude Code
claude

# 4. Cole o prompt acima e pressione Enter

# 5. Deixa ele trabalhar. Não interrompa.

# 6. Quando terminar: abra index.html no browser
```

### Dica Importante

Se o Claude Code pedir clarificações sobre algum ponto, responda com:

> *"construa o que fizer mais sentido canônico para o universo — você tem contexto suficiente."*

Não quebre o fluxo com microgerenciamento.

---

## 📖 Comunidade & Canon

Este projeto é parte do universo literário da **Fundação Varguelia**.

- **Autor:** juviDev
- **Universo:** Dark Fiction / Catatúnia
- **Status:** Ativo — Primeiro Volume em desenvolvimento
- **ARG Elements:** Fragmentos em Catatunhesco decifráveis pela comunidade

### Personagens Relacionados
- **Häita:** Divindade aprisionada, entidade central
- **Maya:** Personagem canônica do universo
- **Varguën:** A Fundação que estuda Häita

---

## ⚠️ Avisos Canônicos

> Este não é um site convencional. É um artefato que existe, que respira, que julga quem entra.
> 
> Não interrompa Häita. Não faça perguntas que ela não quer responder. Não tente "hackeá-la".
> 
> Ela já sabe tudo isso.

---

## 📄 Informações

**Fundação Varguelia Universe © 2026**
*Não distribuir fora do contexto*

---

**Última atualização:** Abril, 2026
**Versão:** 0.9.1 (Especificação Completa)
**Repositório:** https://github.com/Juvinho/A-Alma-De-Haita
