@echo off
echo Starting Electronic Journal...
where node >nul 2>nul || (echo Install Node.js from https://nodejs.org & pause & exit /b 1)

cd backend
if not exist node_modules (call npm install)
if not exist .env (copy .env.example .env)
if not exist prisma\dev.db (call npx prisma migrate deploy & call npm run seed)
start "Backend" cmd /k npm run dev

cd ..\frontend
if not exist node_modules (call npm install)
echo Frontend: http://localhost:5173  Backend: http://localhost:4000
call npm run dev
