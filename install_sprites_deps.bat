@echo off
REM Script de instalação rápida para sprite_processor.py
REM Este script instala todas as dependências necessárias

echo.
echo ================================================================================
echo   SPRITE PROCESSOR - Instalação de Dependências
echo ================================================================================
echo.

REM Verifica se pip existe
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python/pip nao encontrado!
    echo Certifique-se de ter Python 3.10+ instalado
    pause
    exit /b 1
)

echo [INFO] Atualizando pip...
python -m pip install --upgrade pip

echo.
echo [INFO] Instalando dependências...
REM Versão padrão (CPU)
python -m pip install -r requirements_sprites.txt

if %errorlevel% equ 0 (
    echo.
    echo ================================================================================
    echo   INSTALACAO CONCLUIDA COM SUCESSO!
    echo ================================================================================
    echo.
    echo [OK] Todas as dependencias foram instaladas
    echo.
    echo Testar com:
    echo   python sprite_processor.py --help
    echo.
    echo Para exemplos de uso, veja:
    echo   SPRITE_PROCESSOR_GUIDE.md
    echo.
) else (
    echo.
    echo [ERRO] Ocorreu um erro durante a instalacao
    echo.
    echo Tente manualmente com:
    echo   pip install rembg Pillow onnxruntime
    echo.
)

pause
