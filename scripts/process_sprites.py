#!/usr/bin/env python3
"""
Processa sprite sheets de VN:
1. Detecta dimensões e layout (2x2, 1x4, etc)
2. Recorta poses individuais
3. Remove fundo via flood fill
4. Salva em public/assets/vn/sprites/{character}/
"""

import os
import sys
from PIL import Image
from pathlib import Path

SPRITE_INPUT_DIR = Path("C:\\Users\\Jnews\\Desktop\\Sprits VN\\Poses")
SPRITE_OUTPUT_DIR = Path("public/assets/vn/sprites")
SPRITE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Criar subdirs para personagens
for char in ['maya', 'ella', 'marci']:
    (SPRITE_OUTPUT_DIR / char).mkdir(exist_ok=True)

def remove_bg_flood(img, tolerance=40):
    """Remove background via flood fill dos 4 cantos."""
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    pixels = img.load()
    w, h = img.size
    
    def get_color_dist(c1, c2):
        return sum(abs(a-b) for a, b in zip(c1[:3], c2[:3]))
    
    visited = set()
    def flood_fill(x, y, ref_color):
        stack = [(x, y)]
        while stack:
            x, y = stack.pop()
            if (x, y) in visited or not (0 <= x < w and 0 <= y < h):
                continue
            
            visited.add((x, y))
            current = pixels[x, y]
            
            if get_color_dist(current, ref_color) <= tolerance * 3:
                pixels[x, y] = (0, 0, 0, 0)
                stack.extend([(x+1,y), (x-1,y), (x,y+1), (x,y-1)])
    
    # Flood fill a partir dos 4 cantos
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]
    for cx, cy in corners:
        ref_color = pixels[cx, cy]
        flood_fill(cx, cy, ref_color)
    
    return img

def detect_grid(img_path):
    """Detecta layout do sheet (2x2, 1x4, 2x1, etc)."""
    img = Image.open(img_path)
    w, h = img.size
    
    # Assumir célula quadrada
    # Testar proporções comuns
    for cols in [1, 2, 3, 4]:
        for rows in [1, 2, 3, 4]:
            cell_w = w / cols
            cell_h = h / rows
            # Aceitar se proporção é aproximadamente quadrada
            ratio = cell_w / cell_h if cell_h > 0 else 0
            if 0.9 < ratio < 1.1:  # Razoavelmente quadrado
                return (cols, rows)
    
    # Default
    return (2, 2)

def process_sheet(input_path, output_dir, character, pose_names):
    """Processa um sprite sheet."""
    img = Image.open(input_path)
    w, h = img.size
    
    cols, rows = detect_grid(input_path)
    cell_w = w // cols
    cell_h = h // rows
    
    print(f"  Grid detectado: {cols}x{rows} ({cell_w}x{cell_h} pixels)")
    print(f"  Processando {len(pose_names)} poses...")
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for i, pose_name in enumerate(pose_names):
        if pose_name is None:
            continue
        
        col = i % cols
        row = i // cols
        
        if row >= rows:
            break
        
        box = (col * cell_w, row * cell_h, (col+1) * cell_w, (row+1) * cell_h)
        pose_img = img.crop(box)
        
        # Tentar remover fundo
        pose_img = remove_bg_flood(pose_img, tolerance=40)
        
        output_path = output_dir / f"{pose_name}.png"
        pose_img.save(output_path)
        print(f"    ✓ {pose_name}.png")

# ════════════════════════════════════════════════════════════════

# Processar manualmente os arquivos identificáveis
print("\n[SPRITES PROCESSADOS]")

print("\nOs arquivos em Poses/ têm nomes auto-gerados confusos.")
print("Para agora, listando todos os arquivos:")
print()

files = sorted(SPRITE_INPUT_DIR.glob("*.png"))
for i, f in enumerate(files[:55]):  # Mostrar primeiros 55
    img = Image.open(f)
    print(f"{i+1:2d}. {f.name:45s} [{img.width}x{img.height}]")

print(f"\nTotal: {len(files)} arquivos")
print("\n[PRÓXIMOS PASSOS]")
print("Uma vez que esses arquivos foram gerados por IA e seus nomes")
print("não indicam qual é Maya/Ella/Marci, recomenda-se:")
print("1. Revisar manualmente cada imagem")
print("2. Identificar qual é cada personagem")
print("3. Usar este script para recortar e processar após identificação")
print("\nArquivos salvos para revisão manual em: public/assets/vn/sprites/")
print("Por enquanto, copiar algumas poses de exemplo...")

# Como placeholder, vou copiar alguns arquivos sem processamento para referência
print("\n[COPIANDO PARA REFERÊNCIA]")

# Vou copiar alguns dos primeiros para cada personagem temporiamente
# Isso garante que pelo menos ALGO está lá durante o desenvolvimento
sample_files = files[:47]

# Agrupar roughly em 3 personagens (apenas para placeholder)
maya_files = sample_files[0:16]
ella_files = sample_files[16:32]
marci_files = sample_files[32:47]

def copy_and_process(file_list, char_name):
    char_dir = SPRITE_OUTPUT_DIR / char_name
    char_dir.mkdir(parents=True, exist_ok=True)
    
    for idx, fpath in enumerate(file_list):
        try:
            img = Image.open(fpath)
            # Remover fundo
            img = remove_bg_flood(img, tolerance=50)
            
            # Salvar com nome genérico
            output_name = f"pose-{idx+1:02d}.png"
            output_path = char_dir / output_name
            img.save(output_path)
            print(f"  {char_name}: {output_name}")
        except Exception as e:
            print(f"  ERRO ao processar {fpath.name}: {e}")

copy_and_process(maya_files, 'maya')
copy_and_process(ella_files, 'ella')
copy_and_process(marci_files, 'marci')

print("\n[AVISO]")
print("⚠ Os sprites foram divididos arbitrariamente entre personagens.")
print("⚠ Para nomes de poses específicos (neutral, happy, sad), etc.,")
print("  será necessário revisão manual e renomeação.")
print("✓ Build deve passar agora mesmo com placeholders genéricos.")
