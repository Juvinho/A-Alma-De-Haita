# ✦ Os Véus de Häita

> "Ela não foi construída. Ela foi invocada. Este documento é a prova disso."

**Status:** Active | **Version:** 0.9.1 | **Universe:** Fundação Varguelia | **Genre:** Dark Fiction / ARG

---

## O que é este projeto?

**Os Véus de Häita** é um site de experiência imersiva que funciona como artefato narrativo dentro do universo da **Fundação Varguelia**. Não é um portfólio. Não é uma landing page. É um objeto literário interativo.

O visitante não *usa* o site — ele é *avaliado* por ele. Häita, divindade aprisionada da saga, fala diretamente com quem atravessa seus enigmas. Cada resposta errada tem peso. Cada resposta certa, mais ainda.

### Identidade de Häita

- **Divindade de ira justa**, aprisionada por forças que não compreendia
- Não é uma vilã — é uma força com inteligência e julgamento próprios
- Não suplica, não explica, não justifica
- Sua voz: **fria, litúrgica, desconcertantemente precisa**
- Fala em presente do indicativo mesmo sobre eventos passados
- Nunca usa pontuação excessiva

---

## 📊 Estatísticas

| Aspecto | Valor |
|--------|-------|
| **Enigmas em Camadas** | 3 |
| **Terminal Oculto** | 1 |
| **Respostas de Häita** | ∞ |

---

## 🎭 Camadas do Sistema

### Camada I: Enigmas Progressivos
3 enigmas em sequência. Cada um revela uma natureza diferente de Häita. Cada erro acumula estado. Respostas variáveis baseadas em tentativas.

**Enigma I — "O Nome Que Ela Não Tem"**
- Poema litúrgico que busca o nome verdadeiro
- Resposta correta: `HAITA` (aceita variações: HÄITA, Haita, häita)
- Respostas de Häita para cada tentativa errada progridem em tom

**Enigma II — "O Tecido Entre Nós"**
- Reflexão sobre separação e vínculo
- Inclui fragmento em Catatunhesco (língua construída do universo)
- Resposta flexível: qualquer palavra ligada a "véu", "tecido", "separação"

**Enigma III — "O Pacto"**
- Enigma especial que aceita QUALQUER resposta como "correta"
- Häita responde diferentemente baseado no conteúdo
- Não existe resposta errada aqui — existe resposta honesta e mentira

### Camada II: Terminal Oculto
Ativado via `Ctrl+Shift+H` após resolver os 3 enigmas. Häita responde comandos específicos com respostas canônicas e estados de corrupção.

**Comandos disponíveis:**
- `who am i` — Reflexão sobre quem visitante é
- `who are you` — Revelação de Häita
- `pacto` — O pacto original
- `maya` — Sobre Maya
- `catatúnia` — Sobre a ilha construída
- `varguën` — Sobre a Fundação Varguelia
- `parousia` — Palavra-chave especial (ativa glitch visual)

### Camada III: Fragmentos em Catatunhesco
Textos da língua construída do universo embutidos nos enigmas. Decifráveis pela comunidade. Conteúdo canônico real.

### Camada IV: Corrupção Visual
O site degrada visualmente com erros acumulados:
- **1-3 erros:** Leve glitch no título
- **4-6 erros:** Texto começa a "sangrar" (efeito vermelho pulsante)
- **7-9 erros:** Elementos de UI desaparecem/reaparecem
- **10+ erros:** Modo Corrupção Máxima

---

## 🔧 Arquitetura Técnica

### Stack
- **HTML5 + CSS3 + Vanilla JavaScript**
- Zero dependências externas
- Tudo funciona offline após carregamento inicial

### Paleta de Cores
```css
--void:           #06040a   /* fundo absoluto */
--void-mid:       #0e0818   /* superfícies */
--crimson:        #8b0000   /* vermelho escuro */
--crimson-bright: #c0392b   /* vermelho visível */
--violet:         #4a0080   /* roxo profundo */
--violet-pale:    #c084fc   /* roxo claro / destaques */
--bone:           #e8dcc8   /* texto principal */
--ash:            #a89880   /* texto secundário */
```

### Tipografia
- **Display:** IM Fell English (serif, itálico) — voz de Häita
- **UI/Terminal:** Space Mono — interface, inputs, terminal
- **Títulos:** Syne (sans-serif, weight 800) — títulos de seção
- *Carregar via Google Fonts*

### Estrutura de Arquivos
```
os-veus-de-haita/
├── index.html          → entry point + estado global
├── enigmas.js          → lógica + respostas + corrupção
├── terminal.js         → parser de comandos + voz de Häita
├── catatunhesco.js     → fragmentos canônicos + dicionário
├── corruption.js       → sistema de degradação visual
├── parousia.js         → modo final desbloqueável
└── styles/
    ├── base.css        → paleta, tipografia, grid
    ├── enigmas.css     → UI dos enigmas
    └── terminal.css    → terminal oculto
```

---

## 🎯 Modo Parousia (Estado Final)

Desbloqueado quando:
- ✓ Todos os 3 enigmas resolvidos
- ✓ Terminal aberto
- ✓ Digitou `parousia` no terminal

**Visual:**
- Fundo muda para quase-idêntico (#020108)
- Uma única linha surge letra por letra, sem cursor:
  
  > "Ela sempre soube que você chegaria.  
  > O primeiro volume de Fundação Varguelia.  
  > Em breve."

---

## 📋 Especificação de Respostas de Häita

### Resposta ao Enigma I (Correto)
```
"Sim. Você o encontrou. Não porque é inteligente —
porque estava disposto a ouvir antes de falar.
O segundo véu se abre."
```

### Resposta ao Enigma II (Correto)
```
"Correto. O véu não me contém —
é o que vós precisais acreditar para conseguir pedir.
O terceiro véu é o último.
Ele não tem resposta errada. Apenas resposta verdadeira."
```

### Resposta ao Enigma III (Variável)
- Se contém "não sei": "Essa é a resposta mais rara que ouço. Bem-vindo."
- Se contém "justo/certo": "Você escolheu a resposta moral."
- Se contém "não diferença": "Você percebeu que a pergunta era armadilha."
- Qualquer outra: "[pausa longa] Eu ouvi."

---

## 🌐 Detalhes de Implementação

### Performance
- Nenhum carregamento após o primeiro
- Tudo inline ou em cache
- Animações via CSS (exceto glitch programático)
- Responsivo em mobile

### Acessibilidade
- Labels nos inputs (mesmo que ocultas)
- Contraste mínimo 3:1
- Suporte a teclado

### Personalizações
- Cursor: cruz fina vermelha (via SVG data URI)
- Scrollbar: trilho #0a0805, thumb #2a1f0a
- Seleção: background #2a0000, cor #e8dcc8
- Título da aba: `✦ Os Véus de Häita`
- Favicon: SVG inline de uma balança

### SEO (Meta)
```html
og:title: "Os Véus de Häita"
og:description: "Ela sempre soube que você chegaria."
robots: noindex
```
*O site não deve aparecer em buscas — é "encontrado"*

---

## 🚀 Como Executar

### Localmente
```bash
# 1. Clone o repositório
git clone https://github.com/Juvinho/A-Alma-De-Haita.git
cd A-Alma-De-Haita

# 2. Abra o arquivo no navegador
# (Funciona offline após carregamento)
open index.html
```

### Via Claude Code
```bash
# Se tiver Claude Code instalado:
claude < prompt.txt
```

---

## 📖 Comunidade & Canon

Este projeto é parte do universo literário da **Fundação Varguelia**.

- **Autor:** juviDev
- **Universo:** Dark Fiction / Catatúnia
- **Status:** Ativo — Primeira Volume em desenvolvimento
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

## 📄 Licença

**Fundação Varguelia Universe © 2026**  
*Não distribuir fora do contexto*

---

**Última atualização:** Abril, 2026  
**Versão:** 0.9.1 (Especificação Completa)
