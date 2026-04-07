#!/usr/bin/env python3
"""Processa 117 sprites: remove fundo e padroniza"""

from PIL import Image
from pathlib import Path
import sys

CANVAS_WIDTH = 600
CANVAS_HEIGHT = 1080

def remove_background(img):
    """Remove fundo com rembg"""
    try:
        from rembg import remove
        result = remove(img, model_name="isnet-anime")
        if result.mode != "RGBA":
            result = result.convert("RGBA")
        return result
    except Exception as e:
        print(f"[ERR] Erro ao remover fundo: {e}")
        return img.convert("RGBA")

def expand_to_canvas(sprite, width=CANVAS_WIDTH, height=CANVAS_HEIGHT):
    """Expande sprite para canvas fixo"""
    if sprite.mode != "RGBA":
        sprite = sprite.convert("RGBA")

    sprite.thumbnail((width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    sprite_width, sprite_height = sprite.size
    x = (width - sprite_width) // 2
    y = height - sprite_height

    canvas.paste(sprite, (x, y), sprite)
    return canvas

def main():
    input_dir = Path(r"C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas\raw_sprites")
    output_dir = Path(r"C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas\sprites_processed_117")
    
    output_dir.mkdir(exist_ok=True)
    
    png_files = sorted(input_dir.glob("*.png"))
    
    print(f"Processando {len(png_files)} sprites...")
    print()
    
    processed = 0
    errors = 0
    
    for i, png_file in enumerate(png_files, 1):
        try:
            # Abre
            img = Image.open(png_file)
            
            # Remove fundo
            img = remove_background(img)
            
            # Expande
            img = expand_to_canvas(img)
            
            # Salva
            output_name = png_file.stem.replace("_01", "").replace("_02", "").replace("_03", "")
            # Pega o sufixo numérico
            if png_file.name.endswith("_01.png"):
                suffix = "_normal"
            elif png_file.name.endswith("_02.png"):
                suffix = "_happy"
            elif png_file.name.endswith("_03.png"):
                suffix = "_thinking"
            else:
                suffix = ""
            
            final_name = f"{output_name}{suffix}_sprite.png"
            output_path = output_dir / final_name
            
            img.save(output_path)
            
            print(f"[{i:3d}/117] OK: {final_name}")
            processed += 1
            
        except Exception as e:
            print(f"[{i:3d}/117] ERR: {png_file.name} - {e}")
            errors += 1
    
    print()
    print(f"Processamento concluido: {processed} sprites OK, {errors} erros")

if __name__ == "__main__":
    main()
