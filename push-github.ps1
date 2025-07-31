# Script de PowerShell para hacer push a GitHub
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Push a GitHub - ChatBot" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Para hacer push a GitHub, necesitas un Token de Acceso Personal." -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ve a: https://github.com/settings/tokens" -ForegroundColor Cyan
Write-Host "2. Haz clic en 'Generate new token (classic)'" -ForegroundColor Cyan
Write-Host "3. Selecciona los permisos: repo, workflow" -ForegroundColor Cyan
Write-Host "4. Copia el token generado" -ForegroundColor Cyan
Write-Host ""

$token = Read-Host "Pega tu token aquí" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

if ($tokenPlain -eq "") {
    Write-Host "❌ No se ingresó ningún token. Saliendo..." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Haciendo push a GitHub..." -ForegroundColor Yellow

try {
    $pushUrl = "https://$tokenPlain@github.com/boogiepop-135/ChatBot.git"
    git push $pushUrl main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Push completado exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Tu repositorio está en:" -ForegroundColor Cyan
        Write-Host "https://github.com/boogiepop-135/ChatBot.git" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 ¡Tu ChatBot Multiplataforma está ahora en GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ Error durante el push. Verifica tu token y conexión." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 