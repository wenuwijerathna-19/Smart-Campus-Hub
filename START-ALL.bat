@echo off
title Smart Campus Hub - Full Stack Launcher
echo ============================================
echo    Smart Campus Hub - Full Stack
echo Backend: http://localhost:8082
echo Frontend: http://localhost:5173
echo ============================================
echo.
echo [1] Starting Backend API in new window...
start "Smart Campus Backend" cmd /k "cd /d "%~dp0api" && mvnw.cmd spring-boot:run"

echo [2] Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak

echo [3] Starting Frontend in new window...
start "Smart Campus Frontend" cmd /k "cd /d "%~dp0client" && npm install && npm run dev"

echo.
echo ============================================
echo   Both servers started!
echo   Open: http://localhost:5173 in browser
echo ============================================
pause
