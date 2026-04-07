#!/usr/bin/env python3
"""
SPLIT SPRITES - Detecta e divide sprite sheets em 3 partes
Processa automaticamente imagens que trazem 3 personagens lado a lado
"""

from PIL import Image
from pathlib import Path
import sys

def split_sprite_sheet(input_path, output_dir):
    """Detecta e divide sprite sheet em 3 partes (verticalmente empilhadas)"""
    
    img = Image.open(input_path)
    width, height = img.size
    ratio = height / width
    
    # Detecta como 3 sprites em vertical se altura/largura > 1.0 (altura > largura)
    if ratio > 1.0:  # Altura maior que largura
        print(f"[SHEET] Detectado sprite sheet VERTICAL: {input_path.name}")
        print(f"        Dimensoes: {width}x{height}, Ratio: {ratio:.2f}")
        
        # Divide em 3 linhas
        part_height = height // 3
        
        sprite_names = ['01', '02', '03']
        base_name = input_path.stem
        
        for i, name in enumerate(sprite_names):
            y1 = i * part_height
            y2 = y1 + part_height
            
            part = img.crop((0, y1, width, y2))
            
            output_name = f"{base_name}_{name}.png"
            output_path = output_dir / output_name
            
            part.save(output_path)
            print(f"        OK: {output_name} ({part.size})")
        
        return True
    else:
        return False

def main():
    input_dir = Path("C:\\Users\\Jnews\\Desktop\\Sprits VN\\Poses")
    output_dir = Path("C:\\Users\\Jnews\\Desktop\\Vìdeos Novos\\Enygmas\\raw_sprites")
    
    output_dir.mkdir(exist_ok=True)
    
    # Processa todas as PNGs
    png_files = sorted(input_dir.glob("*.png"))
    
    print(f"Encontradas {len(png_files)} imagens\n")
    
    split_count = 0
    for png_file in png_files:
        if split_sprite_sheet(png_file, output_dir):
            split_count += 1
    
    print(f"\nProcessamento concluido: {split_count} sprite sheets divididos em {split_count * 3} sprites")

if __name__ == "__main__":
    main()
