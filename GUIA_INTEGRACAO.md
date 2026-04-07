"""
GUIA DE INTEGRAÇÃO - Sprite Processor no Projeto Enygmas
Visual Novel em React/Next.js

Este arquivo mostra como integrar completamente o sprite_processor.py
no pipeline de desenvolvimento do projeto.
"""

# ============================================================================
# 1. ESTRUTURA DE PASTAS RECOMENDADA
# ============================================================================

"""
Enygmas/
  ├── sprite_processor.py
  ├── requirements_sprites.txt
  ├── SPRITE_PROCESSOR_GUIDE.md
  ├── EXEMPLOS_PRATICOS.md
  ├── test_sprite_processor.py
  │
  ├── raw_assets/              ← Adicionar aqui
  │   ├── enygma/
  │   │   ├── normal.png
  │   │   ├── happy.png
  │   │   ├── thinking.png
  │   │   └── ...
  │   │
  │   ├── maya/
  │   │   ├── normal.png
  │   │   ├── happy.png
  │   │   └── ...
  │   │
  │   └── sheets/              ← Sprite sheets
  │       ├── character_1.png (3x2)
  │       └── character_2.png (4x3)
  │
  ├── sprites_processed/       ← Saída automática
  │   ├── enygma_normal_sprite.png
  │   ├── enygma_happy_sprite.png
  │   ├── maya_normal_sprite.png
  │   └── ...
  │
  ├── public/
  │   └── sprites/             ← COPIAR AQUI
  │       ├── enygma_normal_sprite.png
  │       ├── enygma_happy_sprite.png
  │       ├── maya_normal_sprite.png
  │       └── ...
  │
  ├── components/
  │   └── Sprite.tsx           ← Componente React
  │
  └── styles/
      └── sprite.css           ← Estilos
"""

# ============================================================================
# 2. WORKFLOW - PROCESSO COMPLETO
# ============================================================================

"""
PASSO 1: Organizar assets brutos
  - Colocar PNGs em raw_assets/enygma/, raw_assets/maya/, etc.
  - OU colocar sprite sheets em raw_assets/sheets/

PASSO 2: Processar
  # Processar todos os personagens
  python sprite_processor.py --input ./raw_assets/ --overwrite
  
  # Ou processar por personagem
  python sprite_processor.py --input ./raw_assets/enygma/ --output ./sprites_enygma/
  python sprite_processor.py --input ./raw_assets/maya/ --output ./sprites_maya/

PASSO 3: Copiar para public/
  # Windows (PowerShell)
  Copy-Item sprites_processed/* -Destination public/sprites/ -Force
  
  # Linux/macOS
  cp -r sprites_processed/* public/sprites/

PASSO 4: Usar no React
  <Sprite character="enygma" expression="happy" />

PASSO 5: Build e Deploy
  npm run build
  npm start  # ou deploy para produção
"""

# ============================================================================
# 3. COMPONENTE REACT - Sprite.tsx
# ============================================================================

"""
import { useState, useEffect } from 'react';
import Image from 'next/image';

export type SpriteExpression = 
  | 'normal' | 'happy' | 'thinking' | 'sad' 
  | 'angry' | 'surprised' | 'crying' | 'smug';

interface SpriteProps {
  character: string;
  expression?: SpriteExpression;
  animated?: boolean;
  duration?: number;
  className?: string;
}

/**
 * Exibe sprite processado com suporte a animação
 * 
 * Uso:
 *   <Sprite character="enygma" expression="happy" />
 *   <Sprite character="maya" animated duration={300} />
 */
export function Sprite({
  character,
  expression = 'normal',
  animated = false,
  duration = 300,
  className = '',
}: SpriteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const spritePath = `/sprites/${character}_${expression}_sprite.png`;

  useEffect(() => {
    // Preload image
    const img = new window.Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      console.warn(`Failed to load sprite: ${spritePath}`);
      setError(true);
    };
    img.src = spritePath;
  }, [spritePath]);

  if (error) {
    return (
      <div className="sprite-error">
        ⚠️ Sprite não encontrado: {spritePath}
      </div>
    );
  }

  return (
    <div
      className={`sprite-container ${animated ? 'sprite-animated' : ''} ${className}`}
      style={{
        '--animation-duration': `${duration}ms`,
      } as React.CSSProperties}
    >
      <img
        src={spritePath}
        alt={`${character} - ${expression}`}
        className={`sprite-image ${isLoading ? 'sprite-loading' : ''}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export default Sprite;
"""

# ============================================================================
# 4. CSS - sprite.css
# ============================================================================

"""
/* Base */
.sprite-container {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.sprite-image {
  max-height: 80vh;
  width: auto;
  object-fit: contain;
  object-position: bottom center;
  
  /* Pixel art rendering */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  
  /* Anti-alias para anime */
  @supports not (image-rendering: pixelated) {
    image-rendering: auto;
  }
}

/* Loading state */
.sprite-image.sprite-loading {
  opacity: 0;
  transition: opacity 200ms ease-in;
}

.sprite-image:not(.sprite-loading) {
  opacity: 1;
  transition: opacity 200ms ease-out;
}

/* Animação de transição entre expressões */
.sprite-animated {
  --animation-duration: 300ms;
}

.sprite-animated .sprite-image {
  animation: spriteTransition var(--animation-duration) ease-in-out;
}

@keyframes spriteTransition {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Erro */
.sprite-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80vh;
  background: rgba(255, 0, 0, 0.1);
  border: 2px dashed #ff4444;
  border-radius: 8px;
  color: #ff4444;
  font-family: monospace;
  font-size: 14px;
  padding: 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .sprite-container {
    height: 60vh;
  }

  .sprite-image {
    max-height: 60vh;
  }
}

@media (max-width: 480px) {
  .sprite-container {
    height: 50vh;
  }

  .sprite-image {
    max-height: 50vh;
  }
}
"""

# ============================================================================
# 5. EXEMPLO DE PÁGINA - page.tsx
# ============================================================================

"""
'use client';

import { useState } from 'react';
import Sprite from '@/components/Sprite';

type Expression = 'normal' | 'happy' | 'thinking' | 'sad' | 'angry' | 'surprised';

const EXPRESSIONS: Expression[] = ['normal', 'happy', 'thinking', 'sad', 'angry', 'surprised'];
const CHARACTERS = ['enygma', 'maya', 'haita'];

export default function Home() {
  const [character, setCharacter] = useState<string>('enygma');
  const [expression, setExpression] = useState<Expression>('normal');

  return (
    <main className="page-container">
      <Sprite 
        character={character} 
        expression={expression}
        animated
        duration={300}
      />

      <div className="controls">
        <div className="control-group">
          <label>Personagem:</label>
          <select value={character} onChange={(e) => setCharacter(e.target.value)}>
            {CHARACTERS.map((char) => (
              <option key={char} value={char}>
                {char.charAt(0).toUpperCase() + char.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Expressão:</label>
          <div className="expression-buttons">
            {EXPRESSIONS.map((expr) => (
              <button
                key={expr}
                onClick={() => setExpression(expr)}
                className={expression === expr ? 'active' : ''}
              >
                {expr}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
"""

# ============================================================================
# 6. INTEGRAÇÃO EM LAYOUT - layout.tsx
# ============================================================================

"""
import type { Metadata } from 'next';
import '@/styles/sprite.css';

export const metadata: Metadata = {
  title: 'Visual Novel - Enygmas',
  description: 'A mystical journey through the enigmas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
"""

# ============================================================================
# 7. SCRIPT DE AUTOMAÇÃO - process_sprites.sh (Linux/macOS)
# ============================================================================

"""
#!/bin/bash
# Script para processar sprites automaticamente

set -e  # Exit on error

echo "================================"
echo "Processing Sprites..."
echo "================================"

# Processar cada personagem
python sprite_processor.py --input ./raw_assets/ --output ./sprites_processed/ --overwrite

# Copiar para public/
echo ""
echo "Copying to public/sprites/..."
mkdir -p public/sprites
cp -r sprites_processed/* public/sprites/

# Resultado
echo ""
echo "================================"
echo "✅ Sprites processados!"
echo "📁 public/sprites/"
echo "================================"

# Contar arquivos
count=$(ls public/sprites/*.png 2>/dev/null | wc -l)
echo "📊 Total: $count sprites prontos"
"""

# ============================================================================
# 8. SCRIPT DE AUTOMAÇÃO - process_sprites.bat (Windows)
# ============================================================================

"""
@echo off
REM Script para processar sprites automaticamente

setlocal enabledelayedexpansion

echo ================================
echo Processing Sprites...
echo ================================

REM Processar sprites
python sprite_processor.py --input ./raw_assets/ --output ./sprites_processed/ --overwrite

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao processar sprites
    pause
    exit /b 1
)

echo.
echo Copying to public/sprites/...
if not exist public\sprites mkdir public\sprites
robocopy sprites_processed public\sprites /E /Y >nul

echo.
echo ================================
echo Sprites processados com sucesso!
echo ================================
echo.

REM Contar arquivos
for /f %%A in ('dir /b public\sprites\*.png 2^>nul ^| find /c /v ""') do set count=%%A
echo Total: !count! sprites prontos
echo.

pause
"""

# ============================================================================
# 9. INTEGRAÇÃO COM WORKFLOW - .github/workflows/build.yml
# ============================================================================

"""
name: Build & Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install sprite processor deps
        run: pip install -r requirements_sprites.txt

      - name: Process sprites
        run: |
          python sprite_processor.py --input ./raw_assets/ --output ./sprites_processed/ --overwrite
          mkdir -p public/sprites
          cp -r sprites_processed/* public/sprites/

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        run: npm run deploy
"""

# ============================================================================
# 10. TROUBLESHOOTING AVANÇADO
# ============================================================================

"""
PROBLEMA: Sprite com qualidade ruim / pixelado demais
SOLUÇÃO:
  - Verificar imagem original (aumentar resolução se possível)
  - Testar diferentes REMBG_MODEL (experimental: u2net, u2netp)
  - Usar interpolação LANCZOS (já está no script)

PROBLEMA: Fundo não foi removido completamente
SOLUÇÃO:
  - Imagem original tem fundo muito próximo da cor do sprite
  - Usar --no-process e editar manualmente
  - Tentar ferramenta diferente (não rembg)

PROBLEMA: Sprite muito pequeno dentro do canvas
SOLUÇÃO:
  - Aumentar CANVAS_HEIGHT / CANVAS_WIDTH no script
  - Usar imagem original maior
  - Não usar --no-process (deixe remover fundo)

PROBLEMA: Processamento muito lento
SOLUÇÃO:
  - Usar GPU: pip install rembg[gpu] onnxruntime-gpu
  - Usar --no-process se fundo já é transparente
  - Processar em lotes menores

PROBLEMA: Erro "CUDA out of memory"
SOLUÇÃO:
  - Voltar para CPU: pip uninstall onnxruntime-gpu
  - Pip install onnxruntime
  - Ou processe menos sprites por vez

PROBLEMA: Imagem com aspecto customizado não cabe bem
SOLUÇÃO:
  - Editar CANVAS_WIDTH e CANVAS_HEIGHT para seu aspecto
  - Exemplo para mobile: CANVAS_WIDTH = 540, CANVAS_HEIGHT = 800
"""

# ============================================================================
# 11. CHECKLIST PRÉ-DEPLOY
# ============================================================================

"""
✅ CHECKLIST PRÉ-PRODUCTION

[ ] Sprites processados com sucesso
[ ] Copiar sprites_processed/* → public/sprites/
[ ] Verificar public/sprites/ tem todos os sprites
[ ] Componente <Sprite /> criado
[ ] Estilos sprite.css importados
[ ] Testar em dev: npm run dev
[ ] Verificar imagens carregam (F12 → Network)
[ ] Testar transitions entre expressões
[ ] Testar responsive (redimensionar navegador)
[ ] Verificar nomes de arquivo correspondem ao código
[ ] Testar em mobile
[ ] Production build: npm run build
[ ] Deploy!

OBS: Se adicionar novo personagem:
  1. Adicionar PNGs em raw_assets/{character}/
  2. Executar sprite_processor.py
  3. Copiar para public/sprites/
  4. Usar no código: <Sprite character="{character}" />
"""

# ============================================================================
# 12. DICAS DE PERFORMANCE
# ============================================================================

"""
🚀 OTIMIZAÇÕES

1. Preload de imagens (React)
   - Use Image do next/image
   - Adicione priority para sprites principais

2. Lazy loading para sprites não-visíveis
   - Use intersection observer
   - Carregue sob demanda

3. CSS optimization
   - image-rendering: pixelated (para pixel art)
   - object-position: bottom center (evita scroll)
   - Use contain em vez de cover

4. Na CI/CD
   - Process sprites uma vez
   - Cache em public/sprites/
   - Não reprocessar em cada build

5. Imagemin (opcional)
   - Comprimir PNGs depois de processar
   - npm install --save-dev imagemin imagemin-pngquant
"""

# ============================================================================
# 13. REFERÊNCIA RÁPIDA DOS COMANDOS
# ============================================================================

"""
REFERÊNCIA RÁPIDA

# Instalar
pip install -r requirements_sprites.txt

# Processar tudo
python sprite_processor.py --input ./raw_assets/ --overwrite

# Processar um personagem
python sprite_processor.py --input ./raw_assets/enygma/

# Sprite sheet
python sprite_processor.py --input sheet.png --split 3x2

# Testar instalação
python test_sprite_processor.py

# Ver ajuda
python sprite_processor.py --help

# Copiar para React (Windows)
Copy-Item sprites_processed/* public/sprites/ -Force

# Copiar para React (Linux/macOS)
cp -r sprites_processed/* public/sprites/
"""

print("""
✨ Guia de Integração Completo! ✨

Próximos passos:
  1. Colocar PNGs em raw_assets/
  2. Executar: python sprite_processor.py --input ./raw_assets/
  3. Copiar sprites para public/sprites/
  4. Usar componente <Sprite character="..." expression="..." />
  5. Deploy!

Para dúvidas, veja:
  - SPRITE_PROCESSOR_GUIDE.md
  - EXEMPLOS_PRATICOS.md
  - sprite_processor.py (código comentado)
""")
