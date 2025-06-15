@echo off
echo === Frontend ve Backend Başlatılıyor ===

REM Frontend klasörüne geç
cd frontend

IF NOT EXIST "node_modules" (
    echo Node modülleri kuruluyor...
    npm install
)

start "Frontend" cmd /k "npm run dev"

REM Ana dizine dön
cd ..

REM Backend klasörüne geç
cd backend
start "Backend" cmd /k "dotnet run"

REM Tarayıcıda adresleri aç
timeout /t 5 >nul
start http://localhost:5173
start https://localhost:7183/swagger/index.html

echo === Tüm servisler başlatıldı ve tarayıcıda açıldı ===
pause
