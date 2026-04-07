# 🔧 Troubleshooting - Sprites Mal Recortados

## ❌ Problemas Comuns e Soluções

---

## 1. **Sprite Cortado / Faltam Partes**

### Causa
- Canvas muito pequeno (600×1080)
- Sprite sheet não foi dividido corretamente

### Solução

#### A) Se for sprite sheet:
```bash
# ERRADO - processando sheet inteiro
python sprite_processor.py --input sheet.png

# CORRETO - dividir em grid primeiro
python sprite_processor.py --input sheet.png --split 3x2
# Ou --split 4x3, --split 2x2, conforme seu sheet
```

#### B) Se for sprite único muito grande:
```bash
# Aumentar canvas no sprite_processor.py
CANVAS_WIDTH = 800    # Era 600
CANVAS_HEIGHT = 1200  # Era 1080
```

---

## 2. **Fundo Não Remove / Cores Erradas**

### Causa
- Fundo similar à cor do sprite
- Modelo IA não conseguiu segmentar direito
- Imagem de baixa qualidade

### Solução

#### Use modo agressivo:
```bash
python sprite_processor.py --input sprite.png --aggressive
```

#### Ou edite manualmente:
1. Abra a imagem em Photoshop/GIMP
2. "Select by Color" no fundo
3. Delete → salve como PNG com transparência
4. Processe apenas com `--no-process`

```bash
# Se já tem fundo transparente
python sprite_processor.py --input sprite.png --no-process
```

---

## 3. **Debug Mode - Salvar Versões Intermediárias**

Se não sabe qual é o problema, use debug:

```bash
python sprite_processor.py --input sprite.png --debug
```

Isso vai salvar:
- `_debug_character_normal_no_bg.png` - Versão após remover fundo

Assim você vê exatamente qual foi o resultado de cada etapa!

---

## 🖼️ Workflow Correto para Seu Caso

### Tipo 1: **Sprite Sheet (como a imagem que você passou)**

A imagem que você mostrou é um **sprite sheet com 3 poses**.

```bash
# 1. Identificar grid
# Sua imagem tem: 1 coluna × 3 linhas (1x3)

# 2. Dividir e processar
python sprite_processor.py --input your_sheet.png --split 1x3 \
  --names "normal,thinking,upset"

# 3. Resultado:
# - character_normal_sprite.png
# - character_thinking_sprite.png
# - character_upset_sprite.png
```

---

### Tipo 2: **Múltiplas Imagens Soltas**

```bash
# Se tem:
# raw_sprites/
#   ├── kaguya_1.png
#   ├── kaguya_2.png
#   └── kaguya_3.png

python sprite_processor.py --input ./raw_sprites/

# Resultado:
# - kaguya_normal_sprite.png
# - kaguya_happy_sprite.png
# - kaguya_thinking_sprite.png
```

---

### Tipo 3: **Sprite Complexo com Fundo**

Se o fundo é complicado (gradiente, padrão):

```bash
# 1. Primeiro processa com debug
python sprite_processor.py --input sprite.png --debug --aggressive

# 2. Verifica _debug_sprite_no_bg.png

# 3. Se ficou bom, pronto!
# 4. Se ficou ruim, edita à mão em GIMP/Photoshop
```

---

## 📊 Tabela de Decisão

| Seu Caso | Comando |
|----------|---------|
| 1 sprite único | `python sprite_processor.py --input sprite.png` |
| Pasta com vários | `python sprite_processor.py --input ./folder/` |
| Sprite sheet 3×2 | `python sprite_processor.py --input sheet.png --split 3x2` |
| Sprite sheet com custom names | `... --split 3x2 --names "a,b,c,d,e,f"` |
| Fundo complicado | `... --aggressive` |
| Ver etapas intermediárias | `... --debug` |
| Já tem fundo transparente | `... --no-process` |
| Sobrescrever tudo | `... --overwrite` |

---

## 🎯 Seu Caso Específico (Imagem que passou)

Analisando a imagem que você enviou:

```
Personagem com 3 poses diferentes em uma única imagem
Sem fundo visível (ou fundo já transparente?)
Estilo: anime 2D

✅ Comando recomendado:

python sprite_processor.py --input seu_arquivo.png --split 1x3 \
  --names "normal,thinking,upset" --no-process

# --split 1x3 = 1 coluna, 3 linhas
# --names = nomes das 3 poses
# --no-process = não remove fundo (assume que já tem)
```

---

## 🔍 Debug Detalhado

Se ainda tiver problemas, faça:

```bash
# Passo 1: Processar com debug
python sprite_processor.py --input sprite.png --debug

# Passo 2: Abrir em editor
# Ver: _debug_sprite_no_bg.png

# Passo 3: Analisar
# - Se ficou bom: problema era só canvas
# - Se ficou ruim: problema é remoção de fundo

# Passo 4: Se ficou ruim, tente agressivo
python sprite_processor.py --input sprite.png --debug --aggressive
```

---

## 💡 Dicas Ouro

### ✅ Canvas muito pequeno?
```python
# sprite_processor.py, linha ~20
CANVAS_WIDTH = 800    # aumentar
CANVAS_HEIGHT = 1200
```

### ✅ Fundo não sai?
```bash
# Modo agressivo limpa ruído
python sprite_processor.py --input sprite.png --aggressive
```

### ✅ Sprite sheet não funciona?
```bash
# --split COLSxROWS
# 600×1200 sheet com 2 colunas × 3 linhas:
python sprite_processor.py --input sheet.png --split 2x3

# Verificar matemática:
# 600 / 2 = 300 (cada célula 300px largura) ✅
# 1200 / 3 = 400 (cada célula 400px altura) ✅
```

### ✅ Ver versão sem fundo?
```bash
# Salva _debug_* com fundo removido
python sprite_processor.py --input sprite.png --debug
```

---

## 🚀 Próximos Passos

1. **Identificar qual é seu caso** (sheet, múltiplas, únicas)
2. **Usar comando apropriado** (veja tabela acima)
3. **Se problemas → usar --debug** para ver etapas
4. **Se fundo ruim → tentar --aggressive**
5. **Se ainda errado → editar à mão**

---

## 📞 Se a Imagen Fica Muito Pequena:

```bash
# Aumentar APÓS processar:
# 1. Editar sprite_processor.py:

CANVAS_WIDTH = 1000    # Aumentar conforme necessário
CANVAS_HEIGHT = 1500

# 2. Reprocessar com --overwrite
python sprite_processor.py --input ./raw_sprites/ --overwrite
```

---

Qual é exatamente o problema com seu sprite? **Dica:** rode com `--debug` e me mostra!

```bash
python sprite_processor.py --input sua_imagem.png --debug
```

Aí você verá o resultado intermediário e podemos ver exatamente o que está errado! 🔍
