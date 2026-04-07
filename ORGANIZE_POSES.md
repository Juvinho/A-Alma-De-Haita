# 🎨 Organizando suas 42 Poses

Você tem **42 imagens de poses** diferentes já geradas com IA! 

## 📊 Análise da Pasta

```
Poses/
  ├── Dormir.png ........................ 1 imagem com nome claro
  ├── faça.png ......................... 1 imagem com nome genérico
  └── +40 imagens com nomes do Midjourney (timestamps)
```

---

## 🎯 Dois Caminhos Possíveis

### Opção 1: RÁPIDO (Usar como está)

```bash
# Processar todas as 42 como está
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses"

# Resultado:
# - dormir_sprite.png
# - faça_sprite.png
# - crie_essa_personagem_sprite.png
# - crie_mais_poses_sprite.png
# - etc... (42 no total)
```

**Vantagem:** Rápido!  
**Desvantagem:** Nomes meio bagunçados

---

### Opção 2: PROFISSIONAL (Renomear antes)

Primeiro, renomear com padrão sensato:

```
Poses/
  ├── kaguya_normal.png
  ├── kaguya_happy.png
  ├── kaguya_thinking.png
  ├── kaguya_sad.png
  ├── kaguya_angry.png
  ├── kaguya_surprised.png
  ├── kaguya_crying.png
  ├── kaguya_sleeping.png
  └── ... (outras poses)
```

Depois processar:

```bash
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses"

# Resultado:
# - kaguya_normal_sprite.png
# - kaguya_happy_sprite.png
# - kaguya_thinking_sprite.png
# - etc...
```

---

## 🤖 Script Python Para Renomear Automaticamente

Vou criar um script que renomeia as imagens de forma automaticamente:

```python
# rename_poses.py

import os
import re
from pathlib import Path

poses_folder = Path(r"C:\Users\Jnews\Desktop\Sprits VN\Poses")

# Mapeamento de nomes
pose_names = {
    "Dormir": "sleeping",
    "faça": "neutral",
    "Crie_essa_personagem": "pose_01",
    "Crie_mais_poses": "pose_02",
    "Crie_mais_posições": "pose_03",
    "Crie_mais_variações": "pose_04",
    "Crie_mais_posses": "pose_05",
    "Esse_aqui": "pose_06",
    "Lembrando": "pose_07",
    "Faça_essa_personagem": "pose_08",
    "Faça_mais_poses": "pose_09",
    "Faça_ela_agora": "pose_10",
    "Faça_novamente": "pose_11",
}

# Renomear
for i, file in enumerate(sorted(poses_folder.glob("*.png")), 1):
    # Encontra padrão no nome
    new_name = f"kaguya_pose_{i:02d}.png"
    
    # Renomeia
    new_path = poses_folder / new_name
    file.rename(new_path)
    print(f"✓ {file.name} → {new_name}")
```

---

## 🚀 Recomendação

### Use a Opção 1 POR ENQUANTO (Rápido):

```bash
# Na pasta do projeto Enygmas:
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses" --overwrite
```

Isso já processa os 42 e pronto!

---

## 📋 Depois, se quiser Organizar Melhor:

1. Renomear manualmente em grupos (expressões, poses, etc)
2. Reprocessar com nomes sensatos
3. Pronto!

---

## 💡 Seu Caso Específico

Analisando os nomes que você tem:

```
42 imagens com várias poses, gestos e expressões
```

**Opção Mais Rápida:**

```bash
# Process tudo
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses"

# Resultado: 42 sprites únicos processados + nomes baseados no arquivo

# Use na página de teste:
<Sprite character="dormir" expression="sprite" />
<Sprite character="faça" expression="sprite" />
# etc...
```

**Seria assim mesmo, já que cada arquivo é uma pose única.**

---

## ✨ Alternativa: Se Desejar Renomear Manualmente

Recomendo reorganizar em pastas:

```
Poses/
  ├── kaguya/
  │   ├── normal.png
  │   ├── happy.png
  │   ├── thinking.png
  │   ├── sad.png
  │   ├── angry.png
  │   ├── surprised.png
  │   ├── crying.png
  │   └── sleeping.png
  │
  └── [outro_personagem]/
      └── ...
```

Depois processar papel personagem:

```bash
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses\kaguya"
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses\[outro]"
```

---

## 🎯 Comece Aqui

```bash
# No PowerShell, na pasta do projeto:
cd "C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas"

# Processe tudo de uma vez
python sprite_processor.py --input "C:\Users\Jnews\Desktop\Sprits VN\Poses" --overwrite

# Pronto! Seus 42 sprites processados estão em sprites_processed/
```

**Quer que eu processe já?** 🚀
