#!/usr/bin/env python3
"""
Pós-processamento de sprites já divididos
Remove fundo, padroniza e prepara para React
"""

from PIL import Image
from pathlib import Path
import sys
from rembg import remove

# Configurações
CANVAS_WIDTH = 600
CANVAS_HEIGHT = 1080
REMBG_MODEL = "isnet-anime"

def remove_background(img: Image.Image) -> Image.Image:
    """Remove fundo com rembg"""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    
    try:
        result = remove(img, model_name=REMBG_MODEL)
        if result.mode != "RGBA":
            result = result.convert("RGBA")
        return result
    except TypeError:
        # Fallback
        result = remove(img)
        if result.mode != "RGBA":
            result = result.convert("RGBA")
        return result

def expand_to_canvas(sprite: Image.Image, width: int, height: int) -> Image.Image:
    """Expande para canvas com fundo transparente, posicionamento bottom-center"""
    if sprite.mode != "RGBA":
        sprite = sprite.convert("RGBA")
    
    sprite.thumbnail((width, height), Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    
    sprite_width, sprite_height = sprite.size
    x = (width - sprite_width) // 2
    y = height - sprite_height
    
    canvas.paste(sprite, (x, y), sprite)
    
    return canvas

def process_sprite(input_path, output_dir):
    """Processa um sprite individual"""
    try:
        print(f"  Processando: {input_path.name}")
        
        img = Image.open(input_path)
        
        # Remove fundo
        img = remove_background(img)
        
        # Expande canvas
        img = expand_to_canvas(img, CANVAS_WIDTH, CANVAS_HEIGHT)
        
        # Salva
        output_path = output_dir / input_path.name
        img.save(output_path, "PNG")
        
        print(f"    OK: {input_path.name}")
        return True
        
    except Exception as e:
        print(f"    ERRO: {e}")
        return False

def main():
    # Use raw strings e forward slashes para evitar problemas com acentuacao
    input_dir = Path(r"C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas\raw_sprites").resolve()
    output_dir = Path(r"C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas\public\sprites").resolve()
    
    print(f"Input:  {input_dir}")
    print(f"Output: {output_dir}\n")
    
    output_dir.mkdir(parents=True, exist_ok=True)
    
    sprites = sorted(input_dir.glob("*.png"))
    
    print(f"Encontrados {len(sprites)} sprites\n")
    
    success = 0
    errors = []
    for sprite_file in sprites:
        try:
            if process_sprite(sprite_file, output_dir):
                success += 1
            else:
                errors.append(sprite_file.name)
        except Exception as e:
            errors.append(f"{sprite_file.name}: {e}")
    
    print(f"\nConcluido: {success}/{len(sprites)} processados")
    if errors:
        print(f"Erros: {len(errors)}")
        for err in errors[:5]:
            print(f"  - {err}")

if __name__ == "__main__":
    main()
