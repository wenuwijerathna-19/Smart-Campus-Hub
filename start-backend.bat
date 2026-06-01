@echo off
title Smart Campus - Backend API
echo ============================================
echo   Smart Campus Hub - Backend (Spring Boot)
echo ============================================
echo.
echo [*] Connecting to MongoDB Atlas...
echo [*] Starting Spring Boot API on port 8082...
echo.
cd /d "%~dp0api"
call mvnw.cmd spring-boot:run
pause
