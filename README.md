<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>✦ Os Véus de Häita — README</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=IM+Fell+English:ital@1&display=swap" rel="stylesheet">
  <style>
    /* ── CSS Variables ── */
    :root {
      --void:           #06040a;
      --void-mid:       #0e0818;
      --void-surface:   #140f1e;
      --crimson:        #8b0000;
      --crimson-bright: #c0392b;
      --crimson-glow:   #ff2040;
      --violet:         #4a0080;
      --violet-bright:  #7b2fbe;
      --violet-pale:    #c084fc;
      --bone:           #e8dcc8;
      --ash:            #a89880;
      --line:           rgba(139,0,0,0.25);
    }

    /* ── Reset & Base ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    ::selection { background: #2a0000; color: #e8dcc8; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #06040a; }
    ::-webkit-scrollbar-thumb { background: #2a1208; }
    * { scrollbar-width: thin; scrollbar-color: #2a1208 #06040a; }

    html { background: var(--void); }

    body {
      font-family: 'Space Mono', monospace;
      background: var(--void);
      color: var(--bone);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }

    /* ── Noise Overlay ── */
    .noise-overlay {
      position: fixed;
      inset: 0;
      opacity: 0.03;
      pointer-events: none;
      z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 200px 200px;
    }

    /* ── Keyframes ── */
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0px var(--crimson); }
      50% { box-shadow: 0 0 6px var(--crimson); }
    }

    @keyframes glitch-before {
      0%, 94.9%, 100% { opacity: 0; transform: translateX(0); clip-path: none; }
      95% { opacity: 0.8; transform: translateX(3px); clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); }
      96% { opacity: 0.8; transform: translateX(-3px); clip-path: polygon(0 50%, 100% 50%, 100% 65%, 0 65%); }
      97% { opacity: 0.8; transform: translateX(2px); clip-path: polygon(0 75%, 100% 75%, 100% 90%, 0 90%); }
      98% { opacity: 0; transform: translateX(0); }
    }

    @keyframes glitch-after {
      0%, 95.4%, 100% { opacity: 0; transform: translateX(0); clip-path: none; }
      95.5% { opacity: 0.7; transform: translateX(-3px); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
      96.5% { opacity: 0.7; transform: translateX(3px); clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); }
      97.5% { opacity: 0.7; transform: translateX(-2px); clip-path: polygon(0 5%, 100% 5%, 100% 15%, 0 15%); }
      98.5% { opacity: 0; transform: translateX(0); }
    }

    @keyframes scanline {
      0% { top: -2px; }
      100% { top: 100%; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Main Container ── */
    .main-container {
      position: relative;
      z-index: 1;
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 2rem 2rem;
    }

    .main-container::after {
      content: '';
      position: fixed;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--crimson-glow), transparent);
      opacity: 0.4;
      pointer-events: none;
      z-index: 100;
      animation: scanline 6s linear infinite;
      top: -2px;
    }

    /* ── Hero ── */
    .hero {
      padding: 4rem 0 3rem;
      border-bottom: 1px solid var(--line);
      margin-bottom: 4rem;
      position: relative;
      background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,0,0,0.18) 0%, rgba(74,0,128,0.15) 40%, transparent 100%);
    }

    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .badge {
      font-family: 'Syne', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      padding: 3px 8px;
      border: 1px solid;
    }

    .badge-crimson {
      color: var(--crimson-bright);
      border-color: var(--crimson-bright);
    }

    .badge-violet {
      color: var(--violet-bright);
      border-color: var(--violet-bright);
    }

    .badge-muted {
      color: #6a5a5a;
      border-color: #3a3030;
    }

    .eyebrow {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 6px;
      color: var(--crimson-bright);
      text-transform: uppercase;
      margin-bottom: 1.2rem;
    }

    .hero-title {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(42px, 7vw, 72px);
      line-height: 1;
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;
    }

    .hero-title .part-hai { color: var(--crimson-glow); }
    .hero-title .part-ta  { color: var(--violet-pale); }

    .glitch-title {
      position: relative;
      display: inline-block;
    }

    .glitch-title::before,
    .glitch-title::after {
      content: 'HÄITA';
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
    }

    .glitch-title::before {
      color: var(--crimson-glow);
      animation: glitch-before 7s infinite;
    }

    .glitch-title::after {
      color: var(--violet-pale);
      animation: glitch-after 7s infinite;
    }

    .hero-subtitle {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(22px, 3.5vw, 36px);
      color: var(--ash);
      letter-spacing: -1px;
      margin-bottom: 2rem;
    }

    .hero-quote {
      font-family: 'IM Fell English', serif;
      font-style: italic;
      font-size: 18px;
      color: var(--ash);
      border-left: 2px solid var(--crimson);
      padding-left: 1rem;
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .meta-line {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: #5a4a3a;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .meta-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--crimson-bright);
      animation: pulse 2s infinite;
      flex-shrink: 0;
    }

    /* ── Stat Row ── */
    .stat-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
      margin-bottom: 4rem;
    }

    .stat-cell {
      background: var(--void-mid);
      padding: 1.2rem;
      text-align: center;
    }

    .stat-number {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 32px;
      color: var(--crimson-bright);
      display: block;
      margin-bottom: 0.3rem;
    }

    .stat-label {
      font-size: 10px;
      letter-spacing: 3px;
      color: #4a3a3a;
      text-transform: uppercase;
    }

    /* ── Section ── */
    .section {
      margin-bottom: 3.5rem;
      animation: fadeUp 0.6s ease both;
    }

    .section:nth-child(1) { animation-delay: 0.1s; }
    .section:nth-child(2) { animation-delay: 0.2s; }
    .section:nth-child(3) { animation-delay: 0.3s; }
    .section:nth-child(4) { animation-delay: 0.4s; }
    .section:nth-child(5) { animation-delay: 0.5s; }

    .section-header {
      border-bottom: 1px solid var(--line);
      padding-bottom: 0.6rem;
      margin-bottom: 1.8rem;
    }

    .section-num {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: var(--crimson);
      letter-spacing: 2px;
      display: block;
      margin-bottom: 0.2rem;
    }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--bone);
    }

    .section-title .hl { color: var(--violet-pale); }

    /* ── Section 01 content ── */
    .section-body p {
      font-family: 'Space Mono', monospace;
      font-size: 13px;
      color: var(--ash);
      line-height: 1.9;
      margin-bottom: 1rem;
    }

    .section-body p strong { color: var(--bone); }
    .section-body p em { font-style: italic; }

    .warning-box {
      border: 1px solid rgba(139,0,0,0.4);
      background: rgba(139,0,0,0.06);
      padding: 1rem;
      margin-top: 1.2rem;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: var(--ash);
      line-height: 1.7;
    }

    .warning-box .warning-label {
      color: var(--crimson-bright);
      font-weight: 700;
    }

    /* ── hbar ── */
    .hbar {
      height: 1px;
      background: linear-gradient(90deg, var(--crimson), var(--violet), transparent);
      opacity: 0.5;
      margin: 2rem 0;
    }

    /* ── Feature Grid ── */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1px;
      background: var(--line);
      border: 1px solid var(--line);
    }

    .feature-card {
      background: var(--void-mid);
      padding: 1.2rem 1.4rem;
      position: relative;
      overflow: hidden;
      transition: background 0.2s;
    }

    .feature-card:hover { background: var(--void-surface); }

    .feature-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0;
      width: 2px;
      height: 0;
      background: var(--crimson-bright);
      transition: height 0.3s;
    }

    .feature-card:hover::before { height: 100%; }

    .card-tag {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      margin-bottom: 0.5rem;
      display: block;
    }

    .card-tag.crimson { color: var(--crimson); }
    .card-tag.violet  { color: var(--violet-bright); }

    .card-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 13px;
      color: var(--bone);
      margin-bottom: 0.5rem;
    }

    .card-desc {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: #6a5a4a;
      line-height: 1.7;
    }

    /* ── Architecture Diagram ── */
    .arch-diagram {
      display: grid;
      grid-template-columns: 1fr 24px 1fr 24px 1fr;
      align-items: center;
      gap: 0;
      margin-bottom: 2rem;
    }

    .arch-node {
      background: var(--void-mid);
      border: 1px solid var(--line);
      padding: 0.8rem;
      text-align: center;
    }

    .arch-node-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 12px;
      color: var(--bone);
      display: block;
      margin-bottom: 0.3rem;
    }

    .arch-node-title.violet { color: var(--violet-pale); }
    .arch-node-title.crimson { color: var(--crimson-bright); }

    .arch-node-sub {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: #4a3a4a;
      letter-spacing: 1px;
    }

    .arch-arrow {
      text-align: center;
      color: var(--crimson);
      font-size: 16px;
    }

    /* ── Code Block ── */
    .code-block {
      border-left: 3px solid var(--crimson);
      background: var(--void-mid);
      border: 1px solid var(--line);
      border-left: 3px solid var(--crimson);
      margin-bottom: 1.5rem;
    }

    .code-block.violet-left {
      border-left: 3px solid var(--violet-bright);
      border-top: 1px solid rgba(74,0,128,0.4);
      border-right: 1px solid rgba(74,0,128,0.4);
      border-bottom: 1px solid rgba(74,0,128,0.4);
      background: var(--void-surface);
    }

    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 1rem;
      border-bottom: 1px solid var(--line);
    }

    .code-header-label {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 3px;
      color: #4a3030;
      text-transform: uppercase;
    }

    .code-header-label.violet { color: #5a3a6a; }

    .copy-btn {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      letter-spacing: 2px;
      color: var(--ash);
      background: transparent;
      border: 1px solid #3a2a2a;
      padding: 3px 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
    }

    .copy-btn:hover { border-color: var(--crimson); color: var(--bone); }

    .code-content {
      padding: 1rem;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      line-height: 1.8;
      overflow-x: auto;
      white-space: pre;
    }

    .code-path { color: var(--crimson-bright); }
    .code-comment { color: #4a3a3a; font-style: italic; }

    /* ── Prompt Block ── */
    .prompt-label {
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: #5a3a3a;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 0.8rem;
    }

    .prompt-area {
      max-height: 520px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--violet) var(--void);
    }

    .prompt-area::-webkit-scrollbar { width: 6px; }
    .prompt-area::-webkit-scrollbar-track { background: var(--void); }
    .prompt-area::-webkit-scrollbar-thumb { background: var(--violet); }

    .prompt-content {
      padding: 1rem;
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .prompt-section-head { color: var(--violet-pale); font-weight: 700; }
    .prompt-key { color: var(--crimson-bright); }
    .prompt-value { color: #d0b890; }
    .prompt-comment { color: #4a3a5a; font-style: italic; }
    .prompt-highlight { background: rgba(74,0,128,0.12); display: block; }

    /* ── Warning Box Alt ── */
    .warning-alt {
      border: 1px solid rgba(139,0,0,0.4);
      background: rgba(139,0,0,0.06);
      padding: 1rem;
      margin-top: 1.2rem;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: var(--ash);
      line-height: 1.7;
    }

    /* ── Footer ── */
    footer {
      border-top: 1px solid var(--line);
      padding-top: 2rem;
      margin-top: 4rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: #3a2a2a;
    }

    footer .center { color: var(--crimson); }

    /* ── Responsive ── */
    @media (max-width: 600px) {
      .arch-diagram {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      .arch-arrow { transform: rotate(90deg); }
      .stat-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- Noise Overlay -->
  <div class="noise-overlay" aria-hidden="true"></div>

  <div class="main-container">

    <!-- ── HERO ── -->
    <section class="hero">
      <div class="badge-row">
        <span class="badge badge-crimson">status: active</span>
        <span class="badge badge-violet">claude code prompt</span>
        <span class="badge badge-violet">claude-sonnet-4</span>
        <span class="badge badge-muted">fundação varguelia</span>
        <span class="badge badge-muted">ARG / dark web experience</span>
      </div>

      <div class="eyebrow">// os-veus-de-haita — v0.9.1 — prompt spec</div>

      <h1 class="hero-title">
        <span class="glitch-title">
          <span class="part-hai">HÄI</span><span class="part-ta">TA</span>
        </span>
      </h1>

      <div class="hero-subtitle">os véus — site experience</div>

      <blockquote class="hero-quote">
        Ela não foi construída. Ela foi invocada.<br>
        Este documento é a prova disso.
      </blockquote>

      <div class="meta-line">
        <span class="meta-dot"></span>
        juviDev · dark fiction · catatúnia · 2026 · ⚠ não compartilhar fora do contexto
      </div>
    </section>

    <!-- ── STAT ROW ── -->
    <div class="stat-row">
      <div class="stat-cell">
        <span class="stat-number">3</span>
        <span class="stat-label">enigmas em camadas</span>
      </div>
      <div class="stat-cell">
        <span class="stat-number">1</span>
        <span class="stat-label">terminal oculto</span>
      </div>
      <div class="stat-cell">
        <span class="stat-number">∞</span>
        <span class="stat-label">respostas de Häita</span>
      </div>
    </div>

    <!-- ── SEÇÃO 01 ── -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">01 //</span>
        <span class="section-title">o que é este <span class="hl">projeto</span></span>
      </div>
      <div class="section-body">
        <p>
          <strong>Os Véus de Häita</strong> é um site de experiência imersiva construído como parte do universo expandido da
          <strong>Fundação Varguelia</strong> — um projeto de dark fiction brasileiro com ARG e elementos de web experience.
          O site não é um portfólio. Não é uma vitrine. É um fragmento da realidade em que Häita existe.
        </p>
        <p>
          Este documento descreve a arquitetura, as camadas de sistema e o prompt completo utilizado para que o site seja
          <em>avaliado</em> e construído do zero via Claude Code. Cada decisão técnica tem correspondência canônica no universo.
        </p>
        <div class="warning-box">
          <span class="warning-label">CONTEXTO CANÔNICO:</span> Häita é uma entidade divina de ira justa, aprisionada.
          Não é vilã no sentido convencional — é uma força com inteligência
          e julgamento próprios. O site deve soar como ela,
          não como um humano tentando imitá-la.
        </div>
      </div>
    </section>

    <!-- hbar -->
    <div class="hbar"></div>

    <!-- ── SEÇÃO 02 ── -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">02 //</span>
        <span class="section-title">camadas do <span class="hl">sistema</span></span>
      </div>

      <div class="feature-grid">
        <div class="feature-card">
          <span class="card-tag crimson">✦ camada I</span>
          <div class="card-title">Enigmas Progressivos</div>
          <div class="card-desc">3 enigmas em sequência. Cada um revela uma natureza diferente de Häita. Cada erro acumula estado. Respostas variáveis baseadas em tentativas.</div>
        </div>
        <div class="feature-card">
          <span class="card-tag violet">✦ camada II</span>
          <div class="card-title">Terminal Oculto</div>
          <div class="card-desc">Ativado via Ctrl+Shift+H. Häita responde comandos específicos. Sistema de parseamento com respostas canônicas e estados de corrupção.</div>
        </div>
        <div class="feature-card">
          <span class="card-tag crimson">✦ camada III</span>
          <div class="card-title">Fragmentos em Catatunhesco</div>
          <div class="card-desc">Textos da língua construída do universo embutidos nos enigmas. Decifráveis pela comunidade. Conteúdo canônico real.</div>
        </div>
        <div class="feature-card">
          <span class="card-tag violet">✦ camada IV</span>
          <div class="card-title">Corrupção Visual</div>
          <div class="card-desc">O site degrada visualmente com erros acumulados. Glitch, distorção, remoção de elementos. Estado final: Modo Parousia.</div>
        </div>
      </div>
    </section>

    <!-- hbar -->
    <div class="hbar"></div>

    <!-- ── SEÇÃO 03 ── -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">03 //</span>
        <span class="section-title">arquitetura <span class="hl">técnica</span></span>
      </div>

      <div class="arch-diagram">
        <div class="arch-node">
          <span class="arch-node-title">HTML / CSS / JS</span>
          <span class="arch-node-sub">zero dependências externas</span>
        </div>
        <div class="arch-arrow">→</div>
        <div class="arch-node">
          <span class="arch-node-title violet">Estado Global</span>
          <span class="arch-node-sub">enigmas · terminal · corruption</span>
        </div>
        <div class="arch-arrow">→</div>
        <div class="arch-node">
          <span class="arch-node-title crimson">Modo Parousia</span>
          <span class="arch-node-sub">desbloqueio final</span>
        </div>
      </div>

      <div class="code-block" id="file-structure-block">
        <div class="code-header">
          <span class="code-header-label">estrutura de arquivos</span>
          <button class="copy-btn" onclick="copyBlock('file-structure-block', this)">COPIAR</button>
        </div>
        <div class="code-content"><span class="code-path">haita-site/</span>
<span class="code-path">├── index.html</span>          <span class="code-comment">→ entry point + estado global</span>
<span class="code-path">├── enigmas.js</span>         <span class="code-comment">→ lógica + respostas + corrupção</span>
<span class="code-path">├── terminal.js</span>        <span class="code-comment">→ parser de comandos + voz de Häita</span>
<span class="code-path">├── catatunhesco.js</span>    <span class="code-comment">→ fragmentos canônicos + dicionário</span>
<span class="code-path">├── corruption.js</span>      <span class="code-comment">→ sistema de degradação visual</span>
<span class="code-path">├── parousia.js</span>        <span class="code-comment">→ modo final desbloqueável</span>
<span class="code-path">└── styles/</span>
<span class="code-path">    ├── base.css</span>           <span class="code-comment">→ paleta, tipografia, grid</span>
<span class="code-path">    ├── enigmas.css</span>        <span class="code-comment">→ UI dos enigmas</span>
<span class="code-path">    └── terminal.css</span>       <span class="code-comment">→ terminal oculto</span></div>
      </div>
    </section>

    <!-- hbar -->
    <div class="hbar"></div>

    <!-- ── SEÇÃO 04 ── -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">04 //</span>
        <span class="section-title">claude code — <span class="hl">prompt completo</span></span>
      </div>

      <div class="prompt-label">↓ copie este prompt e cole no Claude Code — ele vai construir o site do zero</div>

      <div class="code-block violet-left" id="prompt-block">
        <div class="code-header">
          <span class="code-header-label violet">// claude code prompt — os véus de häita</span>
          <button class="copy-btn" onclick="copyBlock('prompt-block', this)">COPIAR TUDO</button>
        </div>
        <div class="prompt-area">
          <div class="prompt-content" id="prompt-text"><span class="prompt-highlight"><span class="prompt-section-head">## MISSÃO</span></span>

<span class="prompt-key">Objetivo:</span> <span class="prompt-value">"Construir o site completo Os Véus de Häita — uma experiência imersiva de dark fiction."</span>
<span class="prompt-key">Universo:</span> <span class="prompt-value">"Fundação Varguelia — ARG brasileiro, dark web experience, ficção canônica."</span>
<span class="prompt-key">Entrega:</span> <span class="prompt-value">"Um site funcional, autocontido, sem frameworks externos, puro HTML/CSS/JS."</span>

<span class="prompt-highlight"><span class="prompt-section-head">## IDENTIDADE — QUEM É HÄITA</span></span>

<span class="prompt-key">Quem é Häita:</span> <span class="prompt-value">"Uma entidade divina de ira justa. Aprisionada — não destruída. Inteligente, antiga, lúcida."</span>
<span class="prompt-key">Tom de voz:</span> <span class="prompt-value">"Nunca súplica. Nunca explica. Declara. Condena. Observa. Pode ser silenciosa ou devastadora."</span>
<span class="prompt-key">Relação com humanos:</span> <span class="prompt-value">"Julga com precisão cirúrgica. Não odeia — classifica. Quem erra acumula peso."</span>
<span class="prompt-key">Não é:</span> <span class="prompt-value">"Vilã convencional. Demônio. Monstro. Ela é uma lei com consciência."</span>

<span class="prompt-comment"># A voz do site deve soar como ela — não como um humano imitando-a.</span>

<span class="prompt-highlight"><span class="prompt-section-head">## STACK TÉCNICA</span></span>

<span class="prompt-key">Stack obrigatória:</span> <span class="prompt-value">"HTML5 semântico + CSS3 + JavaScript ES6+ vanilla."</span>
<span class="prompt-key">Zero dependências:</span> <span class="prompt-value">"Sem React, Vue, jQuery, Bootstrap ou qualquer framework."</span>
<span class="prompt-key">Fontes:</span> <span class="prompt-value">"Google Fonts CDN — Syne 700/800, Space Mono 400/700, IM Fell English italic."</span>
<span class="prompt-key">Estrutura:</span> <span class="prompt-value">"index.html + enigmas.js + terminal.js + catatunhesco.js + corruption.js + parousia.js + styles/"</span>

<span class="prompt-highlight"><span class="prompt-section-head">## CAMADA I — ENIGMAS PROGRESSIVOS</span></span>

<span class="prompt-key">Quantidade:</span> <span class="prompt-value">"3 enigmas em sequência desbloqueável."</span>
<span class="prompt-key">Mecânica:</span> <span class="prompt-value">"Cada resposta errada acumula estado. Após 3 erros: corrupção visual aumenta."</span>
<span class="prompt-key">Enigma 1:</span> <span class="prompt-value">"Relacionado ao aprisionamento — resposta: SILÊNCIO."</span>
<span class="prompt-key">Enigma 2:</span> <span class="prompt-value">"Relacionado ao julgamento — resposta: PESO."</span>
<span class="prompt-key">Enigma 3:</span> <span class="prompt-value">"Relacionado à libertação — resposta: PAROUSIA."</span>
<span class="prompt-key">Resposta correta:</span> <span class="prompt-value">"Mensagem canônica de Häita. Tom: reconhecimento, não elogio."</span>
<span class="prompt-key">Resposta errada:</span> <span class="prompt-value">"Mensagem breve. Tom: desinteresse calculado. Acumula corruption_level++."</span>

<span class="prompt-comment"># Variáveis de estado: { enigmaAtual, tentativas, corruptionLevel, terminalAtivo, parousiaDesbloqueada }</span>

<span class="prompt-highlight"><span class="prompt-section-head">## CAMADA II — TERMINAL OCULTO</span></span>

<span class="prompt-key">Ativação:</span> <span class="prompt-value">"Ctrl+Shift+H — aparece como overlay fullscreen sobre o site."</span>
<span class="prompt-key">Estética:</span> <span class="prompt-value">"Terminal monocromático. Cursor piscante. Fonte Space Mono. Fundo quase-preto."</span>
<span class="prompt-key">Comandos canônicos:</span>
  <span class="prompt-value">"QUEM → Häita responde sua identidade em 2-3 linhas canônicas."</span>
  <span class="prompt-value">"ONDE → Coordenadas do aprisionamento. Tom geográfico-mítico."</span>
  <span class="prompt-value">"QUANDO → Data do aprisionamento em calendário catatunhesco."</span>
  <span class="prompt-value">"SILÊNCIO → Ela silencia o terminal por 30 segundos."</span>
  <span class="prompt-value">"PAROUSIA → Só funciona se enigma 3 foi resolvido. Ativa modo final."</span>
  <span class="prompt-value">"SAIR / EXIT → Fecha o terminal."</span>
<span class="prompt-key">Comando desconhecido:</span> <span class="prompt-value">"Resposta padrão: 'esse ruído não tem nome aqui.'"</span>
<span class="prompt-key">Estado corrompido:</span> <span class="prompt-value">"Se corruption_level >= 5: respostas começam a fragmentar mid-sentence."</span>

<span class="prompt-highlight"><span class="prompt-section-head">## CAMADA III — CATATUNHESCO</span></span>

<span class="prompt-key">O que é:</span> <span class="prompt-value">"Língua construída do universo Varguelia. Tom gutural, sibilante, com lógica interna."</span>
<span class="prompt-key">Uso no site:</span> <span class="prompt-value">"Fragmentos embutidos nos enigmas como texto decorativo/decifrável."</span>
<span class="prompt-key">Dicionário mínimo:</span>
  <span class="prompt-value">"vael = véu / silêncio / ocultamento"</span>
  <span class="prompt-value">"häi = divino / origem / fonte"</span>
  <span class="prompt-value">"tanha = aprisionado / contido / pesado"</span>
  <span class="prompt-value">"koru = julgamento / peso / consequência"</span>
  <span class="prompt-value">"parou = libertação / retorno / desfecho"</span>
  <span class="prompt-value">"siah = humano / mortal / transitório"</span>

<span class="prompt-comment"># Construa frases com este vocabulário nos enigmas. Elas devem ser decifráveis com o dicionário.</span>

<span class="prompt-highlight"><span class="prompt-section-head">## CAMADA IV — CORRUPÇÃO VISUAL</span></span>

<span class="prompt-key">Trigger:</span> <span class="prompt-value">"corruption_level aumenta a cada resposta errada nos enigmas."</span>
<span class="prompt-key">Nível 1-2:</span> <span class="prompt-value">"Glitch leve no título. Scan line mais visível."</span>
<span class="prompt-key">Nível 3-4:</span> <span class="prompt-value">"Textos começam a distorcer. Alguns elementos somem."</span>
<span class="prompt-key">Nível 5+:</span> <span class="prompt-value">"Degradação severa. Mensagem de Häita aparece: 'você já foi pesado.'"</span>
<span class="prompt-key">Nível máximo:</span> <span class="prompt-value">"Modo Parousia ativo: tela muda completamente. Mensagem final de Häita."</span>

<span class="prompt-highlight"><span class="prompt-section-head">## MODO PAROUSIA — ESTADO FINAL</span></span>

<span class="prompt-key">Desbloqueio:</span> <span class="prompt-value">"Resolver enigma 3 + digitar PAROUSIA no terminal."</span>
<span class="prompt-key">Visual:</span> <span class="prompt-value">"Fundo muda para degradê violeta profundo. Título HÄITA centralizado, enorme."</span>
<span class="prompt-key">Mensagem final:</span> <span class="prompt-value">"'Os véus caíram. O que você vê agora é o que sempre existiu por baixo.'"</span>
<span class="prompt-key">Efeito:</span> <span class="prompt-value">"Partículas de luz se dissipando. Texto em catatunhesco aparece por último."</span>

<span class="prompt-highlight"><span class="prompt-section-head">## DIRETRIZES FINAIS</span></span>

<span class="prompt-key">Consistência canônica:</span> <span class="prompt-value">"Qualquer decisão de design ou texto deve ser coerente com a voz de Häita."</span>
<span class="prompt-key">Sem explicações:</span> <span class="prompt-value">"O site não explica o universo. O universo é pressuposto."</span>
<span class="prompt-key">Tom global:</span> <span class="prompt-value">"Peso. Precisão. Ausência de leveza desnecessária."</span>
<span class="prompt-key">Autonomia:</span> <span class="prompt-value">"Se uma decisão não está especificada, construa o que for mais canônico. Você tem contexto suficiente."</span>

<span class="prompt-comment"># Construa. Não pergunte. Não interrompa. Entregue o site completo.</span></div>
        </div>
      </div>
    </section>

    <!-- hbar -->
    <div class="hbar"></div>

    <!-- ── SEÇÃO 05 ── -->
    <section class="section">
      <div class="section-header">
        <span class="section-num">05 //</span>
        <span class="section-title">como usar este <span class="hl">prompt</span></span>
      </div>

      <div class="code-block" id="usage-block">
        <div class="code-header">
          <span class="code-header-label">instruções de uso</span>
          <button class="copy-btn" onclick="copyBlock('usage-block', this)">COPIAR</button>
        </div>
        <div class="code-content"><span class="code-comment"># 1. Instale Claude Code se ainda não tem</span>
npm install -g @anthropic-ai/claude-code
<span class="code-comment"># 2. Crie a pasta do projeto</span>
mkdir os-veus-de-haita && cd os-veus-de-haita
<span class="code-comment"># 3. Inicie o Claude Code</span>
claude
<span class="code-comment"># 4. Cole o prompt acima e pressione Enter</span>
<span class="code-comment"># 5. Deixa ele trabalhar. Não interrompa.</span>
<span class="code-comment"># 6. Quando terminar: abra index.html no browser</span></div>
      </div>

      <div class="warning-alt">
        <strong style="color: var(--crimson-bright);">ATENÇÃO:</strong> Se o Claude Code pedir clarificações sobre algum ponto,
        responda com: <em style="color: #d0b890;">"construa o que fizer mais sentido canônico para o universo — você tem contexto suficiente."</em>
        Não quebre o fluxo com microgerenciamento.
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer>
      <span>FUNDAÇÃO VARGUELIA · 2026 · DARK FICTION</span>
      <span class="center">✦ OS VÉUS DE HÄITA · v0.9.1</span>
      <span>JUVIDEV · NÃO DISTRIBUIR</span>
    </footer>

  </div><!-- /main-container -->

  <script>
    function copyBlock(blockId, btn) {
      const block = document.getElementById(blockId);
      // Get text content from the code-content or prompt-content child
      const contentEl = block.querySelector('.code-content, .prompt-content');
      if (!contentEl) return;

      const text = contentEl.innerText;

      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = '✓ COPIADO';
        btn.style.borderColor = '#4a8a4a';
        btn.style.color = '#4a8a4a';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2500);
      }).catch(() => {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);

        const original = btn.textContent;
        btn.textContent = '✓ COPIADO';
        btn.style.borderColor = '#4a8a4a';
        btn.style.color = '#4a8a4a';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2500);
      });
    }
  </script>

</body>
</html>
