# 📁 raw_sprites - Pasta de Sprites Brutos

Coloque suas imagens PNG/JPG brutos aqui para processar com `sprite_processor.py`.

## 📋 Como usar

### 1. Colocar imagens nesta pasta
```
raw_sprites/
  ├── enygma_normal.png
  ├── enygma_happy.png
  ├── maya_normal.png
  └── ...
```

### 2. Executar o processamento
```bash
python sprite_processor.py --input ./raw_sprites/
```

### 3. Resultado será salvo em
```
sprites_processed/
  ├── enygma_normal_sprite.png
  ├── enygma_happy_sprite.png
  ├── maya_normal_sprite.png
  └── ...
```

---

## 🎯 Estrutura recomendada

Você pode organizar por personagem:

```
raw_sprites/
  ├── enygma/
  │   ├── normal.png
  │   ├── happy.png
  │   ├── thinking.png
  │   └── ...
  └── maya/
      ├── normal.png
      ├── happy.png
      └── ...
```

Depois processe cada pasta:
```bash
python sprite_processor.py --input ./raw_sprites/enygma/
python sprite_processor.py --input ./raw_sprites/maya/
```

---

## 📸 Formatos suportados

✅ PNG  
✅ JPG  
✅ JPEG  
✅ WebP  

---

## ✨ Pronto!

Adicione suas imagens aqui e execute o script! 🚀
