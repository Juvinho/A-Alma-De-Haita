# Exemplos Práticos - Sprite Processor

## Exemplo 1: Personagem Única (Studio Setup)

### Cenário
Você tem uma imagem `enygma_happy.png` do seu estúdio digitalmente e precisa transformá-la em sprite.

### Comando
```bash
python sprite_processor.py --input enygma_happy.png
```

### O que acontece
1. Detecta a imagem PNG
2. Remove o fundo (usa rembg com modelo anime)
3. Redimensiona mantendo proporção (cabe em 600×1080)
4. Posiciona na base (bottom-center)
5. Salva em `sprites_processed/enygma_happy_sprite.png`

### Terminal Output
```
⟳  Processando: enygma_happy.png
✅  Salvo: enygma_happy_sprite.png (600x1080, transparente)
✅ Processamento concluído com sucesso!
📁 sprites_processed/enygma_happy_sprite.png
```

### Resultado
- Arquivo: `sprites_processed/enygma_happy_sprite.png`
- Tamanho: 600×1080px
- Fundo: Transparente (PNG com alpha)
- Posição: Personagem ancorado na base

---

## Exemplo 2: Múltiplas Expressões (Pasta)

### Cenário
Você tem 6 expressões do mesmo personagem em pastas diferentes:

```
raw_sprites/
  ├── maya_1.png     (expressão normal)
  ├── maya_2.png     (expressão happy)
  ├── maya_3.png     (expressão thinking)
  ├── maya_4.png     (expressão sad)
  ├── maya_5.png     (expressão angry)
  └── maya_6.png     (expressão surprised)
```

### Comando
```bash
python sprite_processor.py --input ./raw_sprites/
```

### Terminal Output
```
🔍 Encontradas 6 imagens

⟳  Processando: maya_1.png
✅  Salvo: maya_normal_sprite.png (600x1080, transparente)

⟳  Processando: maya_2.png
✅  Salvo: maya_happy_sprite.png (600x1080, transparente)

⟳  Processando: maya_3.png
✅  Salvo: maya_thinking_sprite.png (600x1080, transparente)

⟳  Processando: maya_4.png
✅  Salvo: maya_sad_sprite.png (600x1080, transparente)

⟳  Processando: maya_5.png
✅  Salvo: maya_angry_sprite.png (600x1080, transparente)

⟳  Processando: maya_6.png
✅  Salvo: maya_surprised_sprite.png (600x1080, transparente)

======================================================================
📊 RESUMO DO PROCESSAMENTO
======================================================================
✅ Processados: 6
⚠️  Pulados: 0
❌ Erros: 0
📁 Saída: sprites_processed/
======================================================================
```

### Resultado
```
sprites_processed/
  ├── maya_normal_sprite.png
  ├── maya_happy_sprite.png
  ├── maya_thinking_sprite.png
  ├── maya_sad_sprite.png
  ├── maya_angry_sprite.png
  └── maya_surprised_sprite.png
```

### Uso no React
```tsx
const expressions = ["normal", "happy", "thinking", "sad", "angry", "surprised"];

function CharacterGallery() {
  return (
    <div>
      {expressions.map((expr) => (
        <img
          key={expr}
          src={`/sprites/maya_${expr}_sprite.png`}
          alt={expr}
        />
      ))}
    </div>
  );
}
```

---

## Exemplo 3: Sprite Sheet 3×2 (Game Art Asset)

### Cenário
Você tem um sprite sheet de 600×1200px com 6 expressões em grid 3 colunas × 2 linhas:

```
sheet.png (600 x 1200)
┌──────────────────────────┐
│ expr1 │ expr2 │ expr3   │  ← Linha 1 (altura 600px cada)
├──────────────────────────┤
│ expr4 │ expr5 │ expr6   │  ← Linha 2 (altura 600px cada)
└──────────────────────────┘
  200px   200px   200px
```

### Comando
```bash
python sprite_processor.py --input sheet.png --split 3x2
```

### Terminal Output
```
✂️  Dividindo sheet sheet.png em grid 3x2...

✂️  Sheet dividido em 6 células

⟳  Processando recorte: normal
✅  Salvo: sheet_normal_sprite.png

⟳  Processando recorte: happy
✅  Salvo: sheet_happy_sprite.png

⟳  Processando recorte: thinking
✅  Salvo: sheet_thinking_sprite.png

⟳  Processando recorte: sad
✅  Salvo: sheet_sad_sprite.png

⟳  Processando recorte: angry
✅  Salvo: sheet_angry_sprite.png

⟳  Processando recorte: surprised
✅  Salvo: sheet_surprised_sprite.png

======================================================================
📊 RESUMO
======================================================================
✅ Processados: 6
❌ Erros: 0
📁 Saída: sprites_processed/
======================================================================
```

### Resultado
```
sprites_processed/
  ├── sheet_normal_sprite.png
  ├── sheet_happy_sprite.png
  ├── sheet_thinking_sprite.png
  ├── sheet_sad_sprite.png
  ├── sheet_angry_sprite.png
  └── sheet_surprised_sprite.png
```

Cada um 600×1080px, mais a base de espaço transparente

---

## Exemplo 4: Sprite Sheet com Nomes Customizados

### Cenário
Seu sprite sheet tem poses específicas que não seguem os nomes padrão:

```bash
python sprite_processor.py --input character_sheet.png --split 3x2 \
  --names "standing,sitting,walking,running,jumping,falling"
```

### Resultado
```
sprites_processed/
  ├── character_sheet_standing_sprite.png
  ├── character_sheet_sitting_sprite.png
  ├── character_sheet_walking_sprite.png
  ├── character_sheet_running_sprite.png
  ├── character_sheet_jumping_sprite.png
  └── character_sheet_falling_sprite.png
```

### Uso no React
```tsx
interface PoseType = "standing" | "sitting" | "walking" | "running" | "jumping" | "falling";

function CharacterWithPose({ pose }: { pose: PoseType }) {
  return (
    <img
      src={`/sprites/character_sheet_${pose}_sprite.png`}
      alt={pose}
    />
  );
}
```

---

## Exemplo 5: Apenas Recortar (Sem Processar Fundo)

### Cenário
Seu sprite sheet já tem fundo transparente. Você só quer dividir em células sem reprocessar:

```bash
python sprite_processor.py --input sprite_sheet.png --split 4x3 --no-process
```

### Vantagem
- ⚡ Muito mais rápido (sem usar rembg/IA)
- 🎯 Útil se o sheet já é perfeito
- 🔍 Ótimo para preview antes de processar

### Terminal Output
```
✂️  Dividindo sheet sprite_sheet.png em grid 4x3...

✂️  Sheet dividido em 12 células

💾 Salvando recortes sem processamento...

✂️  Recorte salvo: sprite_sheet_normal_sprite.png
✂️  Recorte salvo: sprite_sheet_happy_sprite.png
...

✅ 12 recortes salvos (sem processamento de fundo)
```

---

## Exemplo 6: Sobrescrever Arquivos Existentes

### Cenário
Você já processou os sprites, mas quer reprocessá-los com melhores configurações:

```bash
python sprite_processor.py --input ./raw_sprites/ --overwrite
```

### Sem --overwrite (padrão)
```
⚠️  Pulado: maya_normal (já existe, use --overwrite)
```

### Com --overwrite
```
⟳  Processando: maya_normal.png
✅  Salvo: maya_normal_sprite.png (600x1080, transparente)  ← Sobrescrito
```

### Estatísticas
```
✅ Processados: 6  ← Todos reprocessados
⚠️  Pulados: 0
❌ Erros: 0
```

---

## Exemplo 7: Diferentes Canvas Sizes (Editar arquivo)

### Cenário
Você quer uma resolução diferente (ex: 800×1200 para mobile)

### Modificar `sprite_processor.py`
```python
# Linha ~20
CANVAS_WIDTH = 800    # Era 600
CANVAS_HEIGHT = 1200  # Era 1080
```

### Comando
```bash
python sprite_processor.py --input sprite.png
```

### Resultado
```
✅  Salvo: sprite_sprite.png (800x1200, transparente)  ← Nova resolução
```

---

## Exemplo 8: Pasta de Saída Customizada

### Cenário
Você quer processos separados para diferentes personagens:

```bash
# Personagem 1
python sprite_processor.py --input ./enygma_raw/ --output ./sprites_enygma/

# Personagem 2
python sprite_processor.py --input ./maya_raw/ --output ./sprites_maya/

# Personagem 3
python sprite_processor.py --input ./haita_raw/ --output ./sprites_haita/
```

### Resultado
```
sprites_enygma/
  ├── enygma_normal_sprite.png
  ├── enygma_happy_sprite.png
  └── ...

sprites_maya/
  ├── maya_normal_sprite.png
  ├── maya_happy_sprite.png
  └── ...

sprites_haita/
  ├── haita_normal_sprite.png
  ├── haita_happy_sprite.png
  └── ...
```

---

## Exemplo 9: Workflow Completo (Real-World)

### Setup Inicial
```bash
# Criar estrutura
mkdir -p raw_sprites sprites_processed public/sprites
cd raw_sprites

# Adicionar imagens aqui
```

### Processamento
```bash
# Processar all
python sprite_processor.py --input ./raw_sprites/ --output ./sprites_processed/
```

### Deploy
```bash
# Copiar para projeto Next.js
cp -r sprites_processed/* ../public/sprites/

# Ou no Windows
robocopy sprites_processed ..\public\sprites /E
```

### React Component
```tsx
// components/Sprite.tsx
interface SpriteProps {
  character: string;
  expression: string;
  className?: string;
}

export function Sprite({ character, expression, className = "" }: SpriteProps) {
  const src = `/sprites/${character}_${expression}_sprite.png`;

  return (
    <img
      className={`sprite-base ${className}`}
      src={src}
      alt={`${character} ${expression}`}
      onError={(e) => {
        console.warn(`Failed to load: ${src}`);
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
```

### CSS
```css
.sprite-base {
  height: 80vh;
  width: auto;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
}

@media (max-width: 768px) {
  .sprite-base {
    height: 60vh;
  }
}
```

### Uso
```tsx
<Sprite character="enygma" expression="happy" />
<Sprite character="maya" expression="thinking" className="sprite-lg" />
```

---

## Exemplo 10: Tratamento de Erros Comuns

### Erro: "Sheet não é divisível"
```python
# ERRADO
python sprite_processor.py --input 640x480_sheet.png --split 3x2
# ❌ 640 / 3 = 213.33... (não divisível)

# CORRETO
python sprite_processor.py --input 600x400_sheet.png --split 3x2
# ✅ 600 / 3 = 200 | 400 / 2 = 200
```

### Erro: "Arquivo não existe"
```bash
# Verificar caminho exato
ls sprite.png  # Linux/Mac
dir sprite.png  # Windows

# Ou usar path completo
python sprite_processor.py --input "C:\Users\seu_nome\Downloads\sprite.png"
```

### Erro: "Extensão não suportada"
```bash
# Suportadas: PNG, JPG, JPEG, WEBP
# ✅ Usar: sprite.png, sprite.jpg, sprite.webp
# ❌ Evitar: sprite.gif, sprite.bmp, sprite.svg
```

---

## Performance Tips

### Primeira Execução
- Rembg baixa modelo IA (~150MB)
- Primeira imagem: ~30-60 segundos
- Próximas: ~1-2 segundos cada (modelo em cache)

### Lotes Grandes
```bash
# Para 100+ imagens, melhor usar GPU
pip install rembg[gpu] onnxruntime-gpu

# Ou processar em lote menor
python sprite_processor.py --input ./batch_1/
python sprite_processor.py --input ./batch_2/
```

### Resolução das Imagens
```python
# Imagens 1024x1024+ processam mais lentamente
# Dica: reduzir antes se possível
# CANVAS_WIDTH = 600 aceita qualquer tamanho de entrada
```

---

Pronto! Esses exemplos cobrem 90% dos casos de uso realistas. 🎬✨
