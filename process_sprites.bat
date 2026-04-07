@echo off
REM Script para processar as poses da pasta Sprits VN

echo.
echo ===============================================
echo   PROCESSANDO SPRITES - Sprits VN Poses
echo ===============================================
echo.

REM Define caminhos
set INPUT_FOLDER=C:\Users\Jnews\Desktop\Sprits VN\Poses
set OUTPUT_FOLDER=C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas\sprites_processed
set PROJECT_FOLDER=C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas

cd /d "%PROJECT_FOLDER%"

echo [1/4] Verificando pasta de entrada...
if exist "%INPUT_FOLDER%" (
    echo ✓ Pasta encontrada: %INPUT_FOLDER%
) else (
    echo ✗ Pasta não encontrada!
    exit /b 1
)

echo.
echo [2/4] Criando pasta de saída...
if not exist "%OUTPUT_FOLDER%" mkdir "%OUTPUT_FOLDER%"
echo ✓ Pasta: %OUTPUT_FOLDER%

echo.
echo [3/4] Processando sprites...
echo.
python sprite_processor.py --input "%INPUT_FOLDER%" --output "%OUTPUT_FOLDER%" --overwrite

if %errorlevel% neq 0 (
    echo.
    echo ✗ Erro ao processar!
    pause
    exit /b 1
)

echo.
echo [4/4] Copiando para public/sprites...
if not exist "%PROJECT_FOLDER%\public\sprites" mkdir "%PROJECT_FOLDER%\public\sprites"
robocopy "%OUTPUT_FOLDER%" "%PROJECT_FOLDER%\public\sprites" /E /Y >nul

echo.
echo ===============================================
echo   ✓ PROCESSAMENTO CONCLUÍDO!
echo ===============================================
echo.

REM Contar arquivos
for /f %%A in ('dir /b "%OUTPUT_FOLDER%\*.png" 2^>nul ^| find /c /v ""') do set count=%%A
echo Sprites processados: !count!
echo.
echo Próximos passos:
echo   1. npm run dev
echo   2. Abrir: http://localhost:3000/sprite-test
echo   3. Testar os sprites!
echo.

pause
