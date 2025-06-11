@echo off
echo Setting up React Native/Expo Docker environment...
echo.

echo 1. Creating shared network...
docker network create retro-games-network 2>nul
if %errorlevel% == 0 (
    echo ✓ Network created successfully
) else (
    echo ✓ Network already exists
)
echo.

echo 2. Building and starting the mobile app...
docker-compose up --build

echo.
echo Setup complete! 
echo - Scan the QR code with Expo Go app on your phone
echo - Or access the tunnel URL shown in the terminal
echo.
pause
