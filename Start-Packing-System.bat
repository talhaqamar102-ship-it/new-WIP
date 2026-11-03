@echo off
title Meridian Works MES
cd /d "%~dp0"
echo ========================================================
echo Starting Meridian Works MES on http://127.0.0.1:3000
echo ========================================================
curl -s -f http://127.0.0.1:3000/health >nul 2>&1
if %errorlevel%==0 (
  echo Server is already running on port 3000.
  start "" http://127.0.0.1:3000
  exit /b 0
)
call npm start
pause
