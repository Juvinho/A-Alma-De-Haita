# Sprite Processor - Guia de Uso

## 📋 Resumo

Script Python que automatiza o pipeline de preparação de sprites para Visual Novel em React/Next.js.

### ✨ O que resolve

**Problema**: Sprites renderizam com bug (cabeça flutuando separada do corpo)

**Causa**: 
- Fundo não é transparente
- Canvas não é padronizado
- Personagem não é ancorado na base

**Solução**: O script automatiza:
1. ✂️ Remoção de fundo com rembg (modelo otimizado para anime)
2. 📐 Redimensionamento mantendo proporção
3. 🎨 Criação de canvas transparente fixo (600x1080px padrão)
4. 📍 Posicionamento bottom-center do sprite

---

## 🚀 Instalação Rápida

### Opção 1: CPU (recomendado para começo)
```bash
pip install -r requirements_sprites.txt
```

### Opção 2: GPU (mais rápido, requer CUDA/ROCm)
```bash
pip install rembg[gpu] Pillow onnxruntime-gpu
```

### Verificar instalação
```bash
python sprite_processor.py --help
```

---

## 💻 Exemplos de Uso

### 1️⃣ Processar uma única imagem

```bash
python sprite_processor.py --input enygma_happy.png
```

**Saída:**
- `sprites_processed/enygma_happy_sprite.png` (600x1080, transparente)

---

### 2️⃣ Processar pasta inteira

```bash
python sprite_processor.py --input ./sprites_raw/
```

**Comportamento:**
- Encontra todas as imagens PNG, JPG, JPEG, WEBP
- Nomeia automaticamente: `character_expression_sprite.png`
- Cria `sprites_processed/` se não existir

---

### 3️⃣ Dividir sprite sheet e processar

```bash
python sprite_processor.py --input sheet.png --split 3x2
```

**Significado**: Divide em **3 colunas × 2 linhas** (6 sprites)

**Saída:**
```
sprites_processed/
  - character_normal_sprite.png
  - character_happy_sprite.png
  - character_thinking_sprite.png
  - character_sad_sprite.png
  - character_angry_sprite.png
  - character_surprised_sprite.png
```

---

### 4️⃣ Dividir com nomes customizados

```bash
python sprite_processor.py --input sheet.png --split 3x2 \
  --names "normal,happy,thinking,sad,angry,surprised"
```

---

### 5️⃣ Só recortar, sem processar fundo

```bash
python sprite_processor.py --input sheet.png --split 3x2 --no-process
```

Útil se:
- O sheet já tem fundo transparente
- Quer verificar os recortes antes de processar
- Precisa economizar tempo

---

### 6️⃣ Sobrescrever arquivos existentes

```bash
python sprite_processor.py --input ./raw_sprites/ --overwrite
```

---

### 7️⃣ Especificar pasta de saída

```bash
python sprite_processor.py --input sprite.png --output ./custom_sprites/
```

---

## 🎨 Integração no React/Next.js

### 1. Copiar sprites

```bash
# Depois de processar, copiar para a pasta pública
cp -r sprites_processed/* public/sprites/
```

### 2. Componente React

```tsx
interface SpriteProps {
  character: string;
  expression: string;
}

export function CharacterSprite({ character, expression }: SpriteProps) {
  return (
    <img
      className="sprite-character"
      src={`/sprites/${character}_${expression}_sprite.png`}
      alt={expression}
    />
  );
}
```

### 3. CSS

```css
.sprite-character {
  height: 80vh;
  object-fit: contain;
  object-position: bottom center;
  image-rendering: -webkit-optimize-contrast;  /* Pixelart nítido */
}
```

### 4. Uso

```tsx
<CharacterSprite character="enygma" expression="happy" />
<CharacterSprite character="maya" expression="thinking" />
```

---

## ⚙️ Configurações Editáveis

Edite no topo de `sprite_processor.py`:

```python
CANVAS_WIDTH = 600           # Largura do canvas
CANVAS_HEIGHT = 1080         # Altura do canvas
REMBG_MODEL = "isnet-anime"  # Modelo para remover fundo
OUTPUT_FOLDER = "sprites_processed"
SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
DEFAULT_NAMES = ["normal", "happy", "thinking", "sad", "angry", "surprised", "surprised_2", "crying", "smug"]
```

---

## 🎯 Nomes de Expressões Padrão

Quando processar um sprite sheet sem `--names`:

1. **normal** - Expressão neutra
2. **happy** - Alegre/sorridente
3. **thinking** - Pensativa
4. **sad** - Triste
5. **angry** - Brava
6. **surprised** - Surpresa
7. **surprised_2** - Surpresa alternativa
8. **crying** - Chorando
9. **smug** - Confiante/sarcástica

---

## 📊 Logs e Feedback

O script mostra no terminal:

```
⟳  Processando: sprite.png
✅  Salvo: character_happy_sprite.png (600x1080, transparente)
✂️  Recortado: expression_01.png (sprite sheet)
⚠️  Pulado: arquivo.png (já existe, use --overwrite)
❌  Erro: mensagem clara do problema

🔍 Encontradas 10 imagens

📊 RESUMO
✅ Processados: 9
⚠️  Pulados: 1
❌ Erros: 0
📁 Saída: sprites_processed/
```

---

## 🐛 Troubleshooting

### "rembg não está instalado"

```bash
pip install rembg Pillow onnxruntime
```

### Erro ao dividir sheet: "não é divisível"

Exemplo: Sheet 600x600 com `--split 3x2`
- 600 / 3 = 200 ✅ (divisível)
- 600 / 2 = 300 ✅ (divisível)

Exemplo que falha: Sheet 640x480 com `--split 3x2`
- 640 / 3 = 213.33... ❌ (não divisível)

**Solução**: Verificar dimensões exatas do sheet ou ajustar grid.

### "Já existe, use --overwrite"

```bash
python sprite_processor.py --input sprite.png --overwrite
```

### Processamento lento

- Primeira execução: rembg baixa modelo (~150MB)
- Use GPU se disponível: `pip install rembg[gpu] onnxruntime-gpu`
- Ou processe em lote de noite

---

## 📁 Estrutura de Saída

```
sprites_processed/
  ├── enygma_normal_sprite.png      (600x1080, PNG/RGBA)
  ├── enygma_happy_sprite.png       (600x1080, PNG/RGBA)
  ├── enygma_thinking_sprite.png    (600x1080, PNG/RGBA)
  ├── maya_normal_sprite.png        (600x1080, PNG/RGBA)
  └── maya_happy_sprite.png         (600x1080, PNG/RGBA)
```

Todas as imagens:
- Dimensão exata: 600×1080px
- Formato: PNG com canal alpha
- Fundo: Transparente
- Personagem: Ancorado na base (bottom-center)

---

## 🔄 Fluxo Completo de Uso

### Para personagem em pose única

```bash
# 1. Ter a imagem: my_character.png
# 2. Processar
python sprite_processor.py --input my_character.png

# 3. Resultado: sprites_processed/my_character_sprite.png
# 4. Copiar para projeto React
cp sprites_processed/my_character_sprite.png ../vn-game/public/sprites/

# 5. Usar no React
<img src="/sprites/my_character_sprite.png" alt="character" />
```

### Para personagem com múltiplas expressões

```bash
# 1. Ter as imagens: character_1.png, character_2.png, ...
# 2. Processar pasta
python sprite_processor.py --input ./raw_sprites/

# 3. Resultado: sprites_processed/character_normal_sprite.png, character_happy_sprite.png, ...
# 4. Usar no React
<img src={`/sprites/character_${expression}_sprite.png`} />
```

### Para sprite sheet

```bash
# 1. Ter sheet.png (ex: 600x1200 para 3x2)
# 2. Processar e dividir
python sprite_processor.py --input sheet.png --split 3x2

# 3. Resultado: character_normal_sprite.png, character_happy_sprite.png, ...
# 4. Usar como acima
```

---

## 📝 Licença e Créditos

- **rembg**: Remove fundo com IA (https://github.com/danielgatis/rembg)
- **Pillow**: Processamento de imagens (https://python-pillow.org/)
- **onnxruntime**: Inferência de modelos IA (https://onnxruntime.ai/)

---

## ✅ Checklist de Qualidade

Após processar, verifique:

- [ ] Canvas 600×1080px? (verificar propriedades)
- [ ] Fundo transparente? (ver em editor com fundo escuro)
- [ ] Personagem na base? (não flutuando)
- [ ] Bordas de cabelo/roupa preservadas? (modelo anime preserva)
- [ ] Nome do arquivo correto? (`character_expression_sprite.png`)
- [ ] Salvo em `sprites_processed/`?

---

## 🎮 Próximos Passos

1. ✅ Processar sprites brutos
2. ✅ Copiar para `public/sprites/` do projeto React
3. ✅ Criar componente `<CharacterSprite />`
4. ✅ Testar em navegador (abre dev tools → ver imagens carregando)
5. ✅ Integrar com sistema de diálogos visual novel
6. ✅ Adicionar transições entre expressões (CSS fade)

---

## 🚀 Dicas de Performance

- **Primeira run:** Lenta (baixa modelo IA ~150MB)
- **Runs seguintes:** Rápido (modelo em cache)
- **Lote grande:** Processe de noite ou em GPU
- **Sprites 1024+:** Reduza antes ou aumente timeout CPU

---

Pronto! Seus sprites estão prontos para o Visual Novel 🎬✨
