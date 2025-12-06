# Start Backend Script for Local Development
# Activates virtual environment, loads .env, and runs FastAPI dev server

param(
    [switch]$NoReload
)

# Define paths
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$VenvPath = Join-Path $ProjectRoot ".venv"
$BackendPath = Join-Path $ProjectRoot "apps\api"
$EnvFile = Join-Path $ProjectRoot ".env"

# Check if .env exists
if (-not (Test-Path $EnvFile)) {
    Write-Host "❌ .env file not found at $EnvFile" -ForegroundColor Red
    Write-Host "📋 Please create .env based on .env.example" -ForegroundColor Yellow
    exit 1
}

# Check if venv exists
if (-not (Test-Path (Join-Path $VenvPath "Scripts\Activate.ps1"))) {
    Write-Host "❌ Virtual environment not found. Creating venv..." -ForegroundColor Yellow
    python -m venv $VenvPath
    & (Join-Path $VenvPath "Scripts\Activate.ps1")
    pip install -r (Join-Path $BackendPath "requirements.txt") -q
}

# Activate venv
& (Join-Path $VenvPath "Scripts\Activate.ps1")

# Navigate to backend
Set-Location $BackendPath

# Run uvicorn
Write-Host "🚀 Starting FastAPI backend..." -ForegroundColor Green
Write-Host "📖 OpenAPI docs: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host "💚 Health check: http://localhost:8000/health" -ForegroundColor Cyan

if ($NoReload) {
    uvicorn main:app --host 127.0.0.1 --port 8000
} else {
    uvicorn main:app --reload --host 127.0.0.1 --port 8000
}
