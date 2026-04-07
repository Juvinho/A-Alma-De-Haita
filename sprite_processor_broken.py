"""
SPRITE PROCESSOR - Automação de preparação de sprites para Visual Novel
Anime Edition com rembg

PROBLEMA RESOLVIDO:
Sprites renderizam com bug (cabeça flutuando separada do corpo) porque:
  1. Fundo não é transparente
  2. Canvas não é padronizado
  3. Personagem não é ancorado na base

SOLUÇÃO:
Este script automatiza:
  1. Remoção de fundo com rembg (modelo otimizado para anime)
  2. Redimensionamento mantendo proporção (LANCZOS)
  3. Criação de canvas transparente fixo (600x1080px padrão)
  4. Posicionamento bottom-center do sprite (resolve flutuação)

USO NO REACT/NEXT.JS:
  <img
    className="sprite-img"
    src={`/sprites/${character}_${expression}_sprite.png`}
    alt={expression}
  />

CSS recomendado:
  .sprite-img {
    height: 80vh;
    object-position: bottom center;
    object-fit: contain;
  }

INSTALAÇÃO:
  pip install rembg Pillow onnxruntime

  OU com GPU (mais rápido):
  pip install rembg[gpu] Pillow onnxruntime-gpu
"""

import argparse
import sys
from pathlib import Path
from typing import Optional, List, Dict, Tuple
from PIL import Image
import traceback

# ============================================================================
# CONFIGURAÇÕES EDITÁVEIS
# ============================================================================

CANVAS_WIDTH = 600
CANVAS_HEIGHT = 1080
REMBG_MODEL = "isnet-anime"  # Otimizado para arte 2D/anime
OUTPUT_FOLDER = "sprites_processed"
SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".webp"}
DEFAULT_NAMES = [
    "normal", "happy", "thinking", "sad",
    "angry", "surprised", "surprised_2", "crying", "smug"
]

# ============================================================================
# VERIFICAÇÃO DE DEPENDÊNCIAS
# ============================================================================

def check_dependencies():
    """Verifica se rembg está instalado. Se não, mostra instruções."""
    try:
        import rembg
    except ImportError:
        print("\n" + "="*70)
        print("❌ rembg não está instalado!")
        print("="*70)
        print("\nInstale com:")
        print("  pip install rembg Pillow onnxruntime")
        print("\nOu com GPU (mais rápido):")
        print("  pip install rembg[gpu] Pillow onnxruntime-gpu")
        print("\nOu tudo junto:")
        print("  pip install rembg[gpu_onnx] Pillow")
        print("="*70 + "\n")
        sys.exit(1)


# ============================================================================
# FUNÇÕES PRINCIPAIS
# ============================================================================

def remove_background(img: Image.Image, aggressive: bool = False) -> Image.Image:
    """
    Remove fundo da imagem usando rembg.

    Se a imagem já tem transparência (canal alpha com transparência),
    retorna sem modificar.

    Usa modelo 'isnet-anime' otimizado para arte 2D/anime.

    Args:
        img: PIL Image object
        aggressive: Se True, aplica pós-processamento para remover ruído alpha

    Returns:
        PIL Image com fundo removido (modo RGBA)
    """
    # Verifica se já tem transparência real
    if img.mode == "RGBA":
        # Me verifica se tem pixels com alpha < 255 (tem transparência)
        try:
            extrema = img.getextrema()
            if len(extrema) == 4 and extrema[3][0] < 255:
                # Já tem transparência, não reprocessar
                return img
        except:
            pass

    try:
        from rembg import remove

        # Remove fundo usando modelo anime
        # Versão nova do rembg usa apenas 'model_name' sem 'model_name' no kwargs
        result = remove(img, model_name=REMBG_MODEL)

        # Garante modo RGBA
        if result.mode != "RGBA":
            result = result.convert("RGBA")

        # Pós-processamento agressivo (limpa ruído de alpha)
        if aggressive:
            import numpy as np
            alpha = np.array(result.split()[3])
            # Define threshold para alpha (valores muito baixos = transparente)
            alpha = np.where(alpha > 127, 255, 0).astype(np.uint8)
            result.putalpha(Image.fromarray(alpha))

        return result

    except TypeError as e:
        # Se houver erro de tipo, tenta sem model_name
        try:
            from rembg import remove
            result = remove(img)
            if result.mode != "RGBA":
                result = result.convert("RGBA")
            return result
        except Exception as e2:
            print(f"❌ Erro ao remover fundo: {e2}")
            raise
    except Exception as e:
        print(f"❌ Erro ao remover fundo: {e}")
        raise


def expand_to_canvas(
    sprite: Image.Image,
    width: int,
    height: int
) -> Image.Image:
    """
    Expande sprite para canvas fixo com fundo transparente.

    Redimensiona mantendo proporção (LANCZOS) e posiciona
    em bottom-center (resolve bug de flutuação em CSS).

    Args:
        sprite: PIL Image (sprite a expandir)
        width: Largura do canvas
        height: Altura do canvas

    Returns:
        PIL Image RGBA do tamanho exato (width x height)
    """
    # Converter para RGBA se necessário
    if sprite.mode != "RGBA":
        sprite = sprite.convert("RGBA")

    # Redimensionar mantendo proporção (cabe no canvas)
    sprite.thumbnail((width, height), Image.Resampling.LANCZOS)

    # Criar canvas transparente
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))

    # Calcular posição: bottom-center
    # X: centralizado horizontalmente
    # Y: na base (bottom), topo do sprite fica em (height - sprite_height)
    sprite_width, sprite_height = sprite.size
    x = (width - sprite_width) // 2
    y = height - sprite_height

    # Colar sprite no canvas usando canal alpha
    canvas.paste(sprite, (x, y), sprite)

    return canvas


def split_sheet(
    path: Path,
    cols: int = 1,
    rows: int = 1
) -> List[Image.Image]:
    """
    Divide sprite sheet em grid de células.

    Leitura em ordem: esquerda->direita, cima->baixo.
    
    Detecta automaticamente se deve dividir em 3 colunas.

    Args:
        path: Caminho da imagem
        cols: Colunas (default 1)
        rows: Linhas (default 1)

    Returns:
        Lista de PIL Images (cada célula)
    """
    img = Image.open(path)
    width, height = img.size

    # DETECÇÃO AUTOMÁTICA: Se largura > 1.5x altura, provavelmente tem 3 sprites lado a lado
    aspect_ratio = width / height
    if aspect_ratio > 2.0 and cols == 1:  # Detecta 3 sprites lado a lado (aprox 3x de proporção)
        cols = 3
        rows = 1
        print(f"  🔍 Detectado: {cols}x{rows} sprite sheet (proporção {aspect_ratio:.2f})")

    cell_width = width // cols
    cell_height = height // rows

    sprites = []
    for row in range(rows):
        for col in range(cols):
            x1 = col * cell_width
            y1 = row * cell_height
            x2 = x1 + cell_width
            y2 = y1 + cell_height

            cell = img.crop((x1, y1, x2, y2))
            sprites.append(cell)

    return sprites

    Args:
        path: Caminho para o sprite sheet
        cols: Número de colunas
        rows: Número de linhas

    Returns:
        Lista de PIL Images (um por célula)

    Raises:
        ValueError: Se sheet não é divisível pelo grid
    """
    try:
        img = Image.open(path)

        # Dimensões de cada célula
        cell_width = img.width // cols
        cell_height = img.height // rows

        # Verifica se o sheet é divisível
        if img.width % cols != 0 or img.height % rows != 0:
            raise ValueError(
                f"Sheet {img.width}x{img.height} não é divisível por grid {cols}x{rows}\n"
                f"Dimensões esperadas: múltiplo de {cols}x{rows}"
            )

        sprites = []
        for row in range(rows):
            for col in range(cols):
                x1 = col * cell_width
                y1 = row * cell_height
                x2 = x1 + cell_width
                y2 = y1 + cell_height

                cell = img.crop((x1, y1, x2, y2))
                sprites.append(cell)

        return sprites

    except Exception as e:
        print(f"❌ Erro ao dividir sheet: {e}")
        raise


def get_character_name(input_path: Path) -> str:
    """
    Infere nome do personagem do arquivo.

    Remove sufixos comuns de expressão automaticamente.

    Exemplos:
      - "enygma_happy.png" -> "enygma"
      - "maya_normal.png" -> "maya"
      - "sprite.png" -> "sprite"

    Args:
        input_path: Path do arquivo

    Returns:
        Nome do personagem (lowercase, sem extensão)
    """
    name = input_path.stem  # Remove extensão

    # Remove sufixos comuns de expressão
    for suffix in DEFAULT_NAMES:
        if name.endswith(f"_{suffix}"):
            name = name[:-len(suffix) - 1]
            break

    return name.lower()


def normalize_name(text: str) -> str:
    """Normaliza texto para padrão de naming (lowercase, underscores)."""
    return text.lower().replace(" ", "_").replace("-", "_")


def process_single(
    input_path: Path,
    output_dir: Path,
    sprite_name: str,
    overwrite: bool = False,
    aggressive: bool = False,
    debug: bool = False,
) -> Optional[Path]:
    """
    Processa uma única imagem de sprite.

    1. Remove fundo (ou detecta transparência existente)
    2. Expande para canvas padrão (bottom-center)
    3. Salva como PNG

    Args:
        input_path: Caminho do arquivo original
        output_dir: Pasta onde salvar
        sprite_name: Nome do sprite (ex: "character_expression")
        overwrite: Se True, sobrescreve existentes
        aggressive: Se True, remove fundo mais agressivamente
        debug: Se True, salva versões intermediárias

    Returns:
        Path do arquivo salvo, ou None se pulado/erro
    """
    try:
        # Define nome do output
        output_name = f"{sprite_name}_sprite.png"
        output_path = output_dir / output_name

        # Verifica se já existe
        if output_path.exists() and not overwrite:
            print(f"⚠️  Pulado: {sprite_name} (já existe, use --overwrite)")
            return None

        # Abre imagem
        print(f"⟳  Processando: {input_path.name}")
        img = Image.open(input_path)
        original_size = img.size

        # Remove fundo (detecta transparência existente automaticamente)
        img = remove_background(img, aggressive=aggressive)

        # Debug: salva versão sem fundo
        if debug:
            debug_path = output_dir / f"_debug_{sprite_name}_no_bg.png"
            img.save(debug_path, "PNG")
            print(f"   🔍 Debug salvo: {debug_path.name}")

        # Expande para canvas padrão
        img = expand_to_canvas(img, CANVAS_WIDTH, CANVAS_HEIGHT)

        # Salva
        img.save(output_path, "PNG")
        print(
            f"✅  Salvo: {output_path.name} ({CANVAS_WIDTH}x{CANVAS_HEIGHT}, transparente)"
        )

        return output_path

    except Exception as e:
        print(f"❌  Erro em {input_path.name}: {str(e)}")
        return None


def process_batch(
    input_dir: Path,
    output_dir: Path,
    character_name: Optional[str] = None,
    overwrite: bool = False,
    aggressive: bool = False,
    debug: bool = False
) -> Dict[str, int]:
    """
    Processa todas as imagens de uma pasta.

    NOVO: Detecta automaticamente sprites sheets (3 sprites lado a lado)
    e os divide antes de processar.

    Para múltiplos sprites do mesmo personagem, associa nomes automaticamente.

    Args:
        input_dir: Pasta com imagens
        output_dir: Pasta de saída
        character_name: Nome do personagem (opcional, senão infere)
        overwrite: Se True, sobrescreve existentes
        aggressive: Se True, remove fundo mais agressivamente
        debug: Se True, salva versões intermediárias

    Returns:
        Dict com estatísticas: {"processed": int, "skipped": int, "errors": int}
    """
    stats = {"processed": 0, "skipped": 0, "errors": 0}

    # Lista arquivos suportados
    image_files = [
        f for f in input_dir.iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_EXTS
    ]

    if not image_files:
        print(f"❌ Nenhuma imagem encontrada em {input_dir}")
        return stats

    # Sort para garantir ordem consistente
    image_files.sort()

    print(f"\n🔍 Encontradas {len(image_files)} imagens\n")

    expr_index = 0

    for img_path in image_files:
        try:
            # Abre imagem para detectar se é sprite sheet
            img = Image.open(img_path)
            width, height = img.size
            aspect_ratio = width / height

            # DETECÇÃO: Se é sprite sheet (3 sprites lado a lado)
            is_sprite_sheet = aspect_ratio > 2.0  # Proporção indica múltiplos sprites horizontalmente
            
            if is_sprite_sheet:
                print(f"⟳  Detectado sprite sheet: {img_path.name} ({width}x{height}, proporção {aspect_ratio:.2f})")
                
                # Divide em 3 sprites
                sprites = split_sheet(img_path, cols=3, rows=1)
                print(f"   ✂️  Dividido em {len(sprites)} sprites")

                # Processa cada um
                for i, sprite_img in enumerate(sprites):
                    try:
                        # Nome do personagem
                        char = character_name or get_character_name(img_path)
                        
                        # Expressão (ciclando pela lista padrão)
                        expr = DEFAULT_NAMES[expr_index % len(DEFAULT_NAMES)]
                        sprite_name = f"{char}_{expr}"
                        expr_index += 1
                        
                        # Salva temporariamente para processar
                        temp_path = output_dir / f"_temp_{i}_{img_path.name}"
                        sprite_img.save(temp_path)

                        # Processa sprite individual
                        result = process_single(
                            temp_path,
                            output_dir,
                            sprite_name,
                            overwrite=overwrite,
                            aggressive=aggressive,
                            debug=debug
                        )

                        # Remove temp
                        temp_path.unlink(missing_ok=True)

                        if result:
                            stats["processed"] += 1
                        else:
                            stats["skipped"] += 1

                    except Exception as e:
                        print(f"   ❌ Erro ao processar parte {i}: {e}")
                        stats["errors"] += 1
                        temp_path.unlink(missing_ok=True)

            else:
                # Imagem normal (não é sprite sheet)
                char = character_name or get_character_name(img_path)
                expr = DEFAULT_NAMES[expr_index % len(DEFAULT_NAMES)]
                sprite_name = f"{char}_{expr}"
                expr_index += 1

                result = process_single(
                    img_path,
                    output_dir,
                    sprite_name,
                    overwrite=overwrite,
                    aggressive=aggressive,
                    debug=debug
                )

                if result:
                    stats["processed"] += 1
                else:
                    stats["skipped"] += 1

        except Exception as e:
            print(f"❌  Erro ao processar {img_path.name}: {str(e)}")
            traceback.print_exc()
            stats["errors"] += 1

    # Encontra todos os arquivos suportados
    image_files = []
    for ext in SUPPORTED_EXTS:
        image_files.extend(input_dir.glob(f"*{ext}"))
        image_files.extend(input_dir.glob(f"*{ext.upper()}"))

    # Remove duplicatas e ordena
    image_files = sorted(set(image_files))

    if not image_files:
        print(f"⚠️  Nenhuma imagem encontrada em {input_dir}")
        return stats

    print(f"\n🔍 Encontradas {len(image_files)} imagens\n")

    for idx, img_path in enumerate(image_files):
        # Infere nome do personagem
        char = character_name or get_character_name(img_path)
        char = normalize_name(char)

        # Associa expressão baseado na ordem
        if len(image_files) == 1:
            # Uma única imagem, usa só o nome do personagem
            sprite_name = char
        else:
            # Múltiplas imagens, associa com nomes de expressão
            expr = DEFAULT_NAMES[idx] if idx < len(DEFAULT_NAMES) else f"expr_{idx:02d}"
            sprite_name = f"{char}_{expr}"

        # Processa
        result = process_single(img_path, output_dir, sprite_name, overwrite)

        if result:
            stats["processed"] += 1
        elif output_path := output_dir / f"{sprite_name}_sprite.png":
            if output_path.exists():
                stats["skipped"] += 1
            else:
                stats["errors"] += 1

    return stats


# ============================================================================
# MAIN COM ARGPARSE
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Processa sprites para Visual Novel com detecção automática de sprite sheets",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        "--input", "-i",
        type=Path,
        required=True,
        help="Imagem, sprite sheet ou pasta a processar"
    )

    parser.add_argument(
        "--split", "-s",
        type=str,
        help="Dividir sprite sheet em grid (formato: COLSxROWS, ex: 3x2)"
    )

    parser.add_argument(
        "--names", "-n",
        type=str,
        help="Nomes das expressões separados por vírgula "
             "(ex: 'normal,happy,thinking,sad,angry,surprised')"
    )

    parser.add_argument(
        "--no-process",
        action="store_true",
        help="Só dividir sheet em células, sem processar fundo"
    )

    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Sobrescrever arquivos já existentes"
    )

    parser.add_argument(
        "--aggressive",
        action="store_true",
        help="Remove fundo mais agressivamente (reduz ruído alpha)"
    )

    parser.add_argument(
        "--debug",
        action="store_true",
        help="Salva versões intermediárias para debug"
    )

    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=Path(OUTPUT_FOLDER),
        help=f"Pasta de saída (padrão: {OUTPUT_FOLDER})"
    )

    args = parser.parse_args()

    # Verifica dependências
    check_dependencies()

    # Valida input
    if not args.input.exists():
        print(f"❌ Erro: {args.input} não existe!")
        sys.exit(1)

    # Cria output dir
    args.output.mkdir(exist_ok=True, parents=True)

    print("\n" + "="*70)
    print("✨ SPRITE PROCESSOR - Anime Edition")
    print("="*70 + "\n")

    try:
        # ===== MODO 1: Dividir sprite sheet =====
        if args.split:
            try:
                cols, rows = map(int, args.split.split("x"))
            except ValueError:
                print(f"❌ Erro: --split deve ser no formato COLSxROWS (ex: 3x2)")
                sys.exit(1)

            if not args.input.is_file():
                print(f"❌ Erro: --split requer um arquivo, não pasta")
                sys.exit(1)

            print(f"✂️  Dividindo sheet {args.input.name} em grid {cols}x{rows}...\n")

            try:
                sprites = split_sheet(args.input, cols, rows)
                print(f"✂️  Sheet dividido em {len(sprites)} células\n")

                # Parse nomes customizados
                if args.names:
                    names = [normalize_name(n.strip()) for n in args.names.split(",")]
                else:
                    names = DEFAULT_NAMES[:len(sprites)]

                char_name = normalize_name(get_character_name(args.input))

                # Se --no-process, só salva os recortes
                if args.no_process:
                    print(f"💾 Salvando recortes sem processamento...\n")
                    for idx, sprite in enumerate(sprites):
                        expr_name = names[idx] if idx < len(names) else f"expr_{idx:02d}"
                        output_path = args.output / f"{char_name}_{expr_name}_sprite.png"
                        sprite.save(output_path, "PNG")
                        print(f"✂️  Recorte salvo: {output_path.name}")

                    print(
                        f"\n✅ {len(sprites)} recortes salvos "
                        f"(sem processamento de fundo)\n"
                    )

                # Se não --no-process, processa cada recorte
                else:
                    print(f"⟳  Processando cada recorte...\n")
                    stats = {"processed": 0, "skipped": 0, "errors": 0}

                    for idx, sprite in enumerate(sprites):
                        expr_name = names[idx] if idx < len(names) else f"expr_{idx:02d}"
                        sprite_name = f"{char_name}_{expr_name}"

                        try:
                            print(f"⟳  Processando recorte: {expr_name}")

                            # Remove fundo se necessário
                            sprite = remove_background(sprite)

                            # Expande canvas
                            sprite = expand_to_canvas(sprite, CANVAS_WIDTH, CANVAS_HEIGHT)

                            output_path = args.output / f"{sprite_name}_sprite.png"
                            sprite.save(output_path, "PNG")
                            print(f"✅  Salvo: {output_path.name}\n")

                            stats["processed"] += 1

                        except Exception as e:
                            print(f"❌  Erro: {str(e)}\n")
                            stats["errors"] += 1

                    # Resumo
                    print("="*70)
                    print("📊 RESUMO")
                    print("="*70)
                    print(f"✅ Processados: {stats['processed']}")
                    print(f"❌ Erros: {stats['errors']}")
                    print(f"📁 Saída: {args.output}")
                    print("="*70 + "\n")

            except Exception as e:
                print(f"❌ Erro ao dividir sheet: {e}")
                sys.exit(1)

        # ===== MODO 2: Processar arquivo único =====
        elif args.input.is_file():
            if args.input.suffix.lower() not in SUPPORTED_EXTS:
                print(f"❌ Erro: extensão {args.input.suffix} não suportada")
                print(f"  Suportadas: {', '.join(sorted(SUPPORTED_EXTS))}")
                sys.exit(1)

            char_name = normalize_name(get_character_name(args.input))
            result = process_single(args.input, args.output, char_name, args.overwrite)

            if result:
                print(f"\n✅ Processamento concluído com sucesso!")
                print(f"📁 {result}\n")
            else:
                print(f"\n⚠️  Arquivo pulado (usar --overwrite?)\n")

        # ===== MODO 3: Processar pasta =====
        else:
            stats = process_batch(args.input, args.output, overwrite=args.overwrite)

            print("\n" + "="*70)
            print("📊 RESUMO DO PROCESSAMENTO")
            print("="*70)
            print(f"✅ Processados: {stats['processed']}")
            print(f"⚠️  Pulados: {stats['skipped']}")
            print(f"❌ Erros: {stats['errors']}")
            print(f"📁 Saída: {args.output}")
            print("="*70 + "\n")

    except KeyboardInterrupt:
        print("\n\n⚠️  Processamento interrompido pelo usuário\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro geral: {e}")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
