@echo off
title Smart Campus - Frontend Client
echo ============================================
echo   Smart Campus Hub - Frontend (React/Vite)
echo ============================================
echo.
echo [*] Installing dependencies (if needed)...
cd /d "%~dp0client"
call npm install
echo.
echo [*] Starting React frontend on http://localhost:5173
echo.
call npm run dev
pause
