@echo off
echo ========================================
echo    Instalador de Node.js para Windows
echo ========================================
echo.

echo Descargando Node.js...
powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile 'nodejs-installer.msi'}"

echo.
echo Instalando Node.js...
msiexec /i nodejs-installer.msi /quiet /norestart

echo.
echo Esperando que termine la instalacion...
timeout /t 30 /nobreak > nul

echo.
echo Verificando la instalacion...
node --version
npm --version

echo.
echo Limpiando archivos temporales...
del nodejs-installer.msi

echo.
echo ========================================
echo    Instalacion completada!
echo ========================================
echo.
echo Ahora puedes ejecutar:
echo   npm install
echo   npm start
echo.
pause 