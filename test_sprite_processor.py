#!/usr/bin/env python3
"""
Script de teste interativo para sprite_processor.py
Use para validar a instalação e testar funcionalidades
"""

import sys
from pathlib import Path
import subprocess

def check_installation():
    """Verifica se todas as dependências estão instaladas"""
    print("\n" + "="*70)
    print("✓ VERIFICAÇÃO DE INSTALAÇÃO")
    print("="*70 + "\n")
    
    deps = {
        "Pillow": "PIL",
        "rembg": "rembg",
        "onnxruntime": "onnxruntime"
    }
    
    all_ok = True
    for package, import_name in deps.items():
        try:
            __import__(import_name)
            print(f"✅ {package}: OK")
        except ImportError:
            print(f"❌ {package}: NÃO INSTALADO")
            all_ok = False
    
    print()
    if not all_ok:
        print("❌ Instale as dependências com:")
        print("   pip install -r requirements_sprites.txt")
        return False
    
    print("✅ Todas as dependências estão instaladas!")
    return True


def test_command(description, cmd):
    """Executa um comando de teste"""
    print(f"\n{description}")
    print(f"$ {cmd}\n")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=False)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Erro: {e}")
        return False


def main():
    print("\n" + "="*70)
    print("🎬 SPRITE PROCESSOR - Teste de Instalação")
    print("="*70)
    
    # Check installation
    if not check_installation():
        sys.exit(1)
    
    print("\n" + "="*70)
    print("📋 TESTES DISPONÍVEIS")
    print("="*70)
    
    print("""
1. Ver ajuda (--help)
2. Testar com imagem de exemplo
3. Criar pasta de teste
4. Processar pasta de teste
5. Testar divisão de sprite sheet
9. Sair
    """)
    
    while True:
        choice = input("Escolha uma opção (1-9): ").strip()
        
        if choice == "1":
            test_command("Mostrando ajuda do script...", 
                        "python sprite_processor.py --help")
        
        elif choice == "2":
            print("\n⚠️  Para este teste, você precisa de uma imagem PNG")
            filename = input("Nome do arquivo (ex: test.png): ").strip()
            if Path(filename).exists():
                test_command(f"Processando {filename}...",
                            f"python sprite_processor.py --input {filename}")
            else:
                print(f"❌ Arquivo não encontrado: {filename}")
        
        elif choice == "3":
            print("\nCriando pasta de teste 'test_sprites'...")
            test_dir = Path("test_sprites")
            test_dir.mkdir(exist_ok=True)
            print(f"✅ Pasta criada: {test_dir}")
            print("   Adicione PNG/JPG nela e use a opção 4")
        
        elif choice == "4":
            test_dir = Path("test_sprites")
            if test_dir.exists():
                test_command("Processando pasta test_sprites/...",
                            "python sprite_processor.py --input test_sprites/")
            else:
                print("❌ Pasta 'test_sprites' não existe")
                print("   Use a opção 3 para criar")
        
        elif choice == "5":
            print("\n⚠️  Para este teste, você precisa de um sprite sheet")
            filename = input("Nome do arquivo (ex: sheet.png): ").strip()
            if Path(filename).exists():
                grid = input("Grid (ex: 3x2): ").strip()
                if "x" in grid:
                    test_command(f"Dividindo {filename} em {grid}...",
                                f"python sprite_processor.py --input {filename} --split {grid} --no-process")
                else:
                    print("❌ Formato inválido (use: COLSxROWS)")
            else:
                print(f"❌ Arquivo não encontrado: {filename}")
        
        elif choice == "9":
            print("\n👋 Até logo!\n")
            break
        
        else:
            print("❌ Opção inválida\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrompido pelo usuário\n")
        sys.exit(0)
