# Script de PowerShell para instalar Node.js
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Instalador de Node.js para Windows" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Verificar si ya está instalado
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js ya está instalado: $nodeVersion" -ForegroundColor Green
        Write-Host "✅ npm ya está disponible" -ForegroundColor Green
        Write-Host ""
        Write-Host "Puedes continuar con:" -ForegroundColor Yellow
        Write-Host "  npm install" -ForegroundColor Cyan
        Write-Host "  npm run demo" -ForegroundColor Cyan
        exit 0
    }
} catch {
    # Node.js no está instalado, continuar con la instalación
}

Write-Host "📥 Descargando Node.js..." -ForegroundColor Yellow

# URL de descarga de Node.js LTS
$nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

try {
    # Descargar el instalador
    Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Descarga completada" -ForegroundColor Green
    
    Write-Host "🔧 Instalando Node.js..." -ForegroundColor Yellow
    
    # Instalar Node.js
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", $installerPath, "/quiet", "/norestart" -Wait
    
    Write-Host "⏳ Esperando que termine la instalación..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Limpiar archivo temporal
    if (Test-Path $installerPath) {
        Remove-Item $installerPath -Force
    }
    
    Write-Host "🔄 Actualizando variables de entorno..." -ForegroundColor Yellow
    
    # Refrescar variables de entorno
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host "✅ Instalación completada!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Por favor, cierra y vuelve a abrir PowerShell para que los cambios surtan efecto." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Después de reiniciar PowerShell, ejecuta:" -ForegroundColor Cyan
    Write-Host "  node --version" -ForegroundColor White
    Write-Host "  npm --version" -ForegroundColor White
    Write-Host "  npm install" -ForegroundColor White
    Write-Host "  npm run demo" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Error durante la instalación: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternativa: Instala Node.js manualmente desde:" -ForegroundColor Yellow
    Write-Host "   https://nodejs.org/" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 