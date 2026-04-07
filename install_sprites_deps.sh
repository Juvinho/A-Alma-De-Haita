#!/bin/bash

# Script de instalação rápida para sprite_processor.py
# Para Linux / macOS

echo ""
echo "================================================================================"
echo "  SPRITE PROCESSOR - Instalação de Dependências"
echo "================================================================================"
echo ""

# Verifica se pip3 existe
if ! command -v pip3 &> /dev/null; then
    echo "[ERRO] pip3 não encontrado!"
    echo "Certifique-se de ter Python 3.10+ instalado"
    echo ""
    echo "No macOS, instale com:"
    echo "  brew install python"
    echo ""
    echo "No Linux (Debian/Ubuntu):"
    echo "  sudo apt-get install python3 python3-pip"
    exit 1
fi

echo "[INFO] Atualizando pip..."
python3 -m pip install --upgrade pip

echo ""
echo "[INFO] Instalando dependências..."
echo ""

# Instala dependências base
python3 -m pip install -r requirements_sprites.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================================================"
    echo "  INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
    echo "================================================================================"
    echo ""
    echo "[OK] Todas as dependências foram instaladas"
    echo ""
    echo "Testar com:"
    echo "  python3 sprite_processor.py --help"
    echo ""
    echo "Para exemplos de uso, veja:"
    echo "  SPRITE_PROCESSOR_GUIDE.md"
    echo ""
else
    echo ""
    echo "[ERRO] Ocorreu um erro durante a instalação"
    echo ""
    echo "Tente manualmente com:"
    echo "  pip3 install rembg Pillow onnxruntime"
    echo ""
fi
