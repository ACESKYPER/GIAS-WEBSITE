# Start Frontend Script for Local Development
# Installs dependencies and runs Next.js dev server

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$FrontendPath = Join-Path $ProjectRoot "apps\web"

# Navigate to frontend
Set-Location $FrontendPath

Write-Host "🚀 Starting Next.js frontend..." -ForegroundColor Green
Write-Host "📖 App: http://localhost:3000" -ForegroundColor Cyan

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start dev server
npm run dev
