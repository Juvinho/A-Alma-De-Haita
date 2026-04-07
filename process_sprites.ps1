#!/usr/bin/env pwsh

# Script para processar as poses da pasta Sprits VN

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "   PROCESSANDO SPRITES - Sprits VN Poses" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$INPUT_FOLDER = "C:\Users\Jnews\Desktop\Sprits VN\Poses"
$OUTPUT_FOLDER = "C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas\sprites_processed"
$PROJECT_FOLDER = "C:\Users\Jnews\Desktop\Vìdeos Novos\Enygmas"

Write-Host "[1/4] Verificando pasta de entrada..."
if (Test-Path $INPUT_FOLDER) {
    Write-Host "✓ Pasta encontrada: $INPUT_FOLDER" -ForegroundColor Green
} else {
    Write-Host "✗ Pasta não encontrada!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/4] Criando pasta de saída..."
if (-not (Test-Path $OUTPUT_FOLDER)) {
    New-Item -ItemType Directory -Path $OUTPUT_FOLDER -Force | Out-Null
}
Write-Host "✓ Pasta: $OUTPUT_FOLDER" -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Processando sprites..."
Write-Host ""

Set-Location -Path $PROJECT_FOLDER
& python sprite_processor.py --input $INPUT_FOLDER --output $OUTPUT_FOLDER --overwrite

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Erro ao processar!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/4] Copiando para public/sprites..."
$PUBLIC_SPRITES = "$PROJECT_FOLDER\public\sprites"
if (-not (Test-Path $PUBLIC_SPRITES)) {
    New-Item -ItemType Directory -Path $PUBLIC_SPRITES -Force | Out-Null
}
Copy-Item -Path "$OUTPUT_FOLDER\*" -Destination $PUBLIC_SPRITES -Force -Recurse

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "   ✓ PROCESSAMENTO CONCLUÍDO!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

$count = (Get-ChildItem -Path $OUTPUT_FOLDER -Filter "*.png" | Measure-Object).Count
Write-Host "Sprites processados: $count" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. npm run dev" -ForegroundColor White
Write-Host "   2. Abrir: http://localhost:3000/sprite-test" -ForegroundColor White
Write-Host "   3. Testar os sprites!" -ForegroundColor White
Write-Host ""
