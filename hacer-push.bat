@echo off
echo ========================================
echo    Push a GitHub - ChatBot
echo ========================================
echo.

echo Para hacer push a GitHub, necesitas un Token de Acceso Personal.
echo.
echo 1. Ve a: https://github.com/settings/tokens
echo 2. Haz clic en "Generate new token (classic)"
echo 3. Selecciona los permisos: repo, workflow
echo 4. Copia el token generado
echo.

set /p TOKEN="Pega tu token aquí: "

echo.
echo Haciendo push a GitHub...
git push https://%TOKEN%@github.com/boogiepop-135/ChatBot.git main

echo.
echo ========================================
echo    Push completado!
echo ========================================
echo.
echo Tu repositorio está en:
echo https://github.com/boogiepop-135/ChatBot.git
echo.
pause 