# GIAS Development Launcher
# Launches backend and frontend in separate PowerShell windows for concurrent development

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$NoReload
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Helper function to start in new window
function Start-InNewWindow {
    param(
        [string]$ScriptPath,
        [string]$WindowTitle,
        [string[]]$Arguments
    )
    
    $argString = if ($Arguments) { "-Args $($Arguments -join ',') " } else { "" }
    
    Start-Process -FilePath "pwsh" `
        -ArgumentList "-NoExit", "-Command", "& '$ScriptPath' $($Arguments -join ' ')" `
        -WindowStyle Normal
    
    Write-Host "✅ Started: $WindowTitle" -ForegroundColor Green
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   GIAS Development Launcher" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Launch Backend
if (-not $FrontendOnly) {
    Write-Host "🔧 Backend: FastAPI + Uvicorn on http://localhost:8000" -ForegroundColor Yellow
    $backendArgs = if ($NoReload) { "-NoReload" } else { "" }
    Start-InNewWindow -ScriptPath (Join-Path $ProjectRoot "start-backend.ps1") -WindowTitle "GIAS Backend" -Arguments @($backendArgs)
    Start-Sleep -Seconds 2
}

# Launch Frontend
if (-not $BackendOnly) {
    Write-Host "⚛️  Frontend: Next.js on http://localhost:3000" -ForegroundColor Yellow
    Start-InNewWindow -ScriptPath (Join-Path $ProjectRoot "start-frontend.ps1") -WindowTitle "GIAS Frontend"
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ Both services are starting in separate windows" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Usage: .\GiasDevLauncher.ps1 [-BackendOnly | -FrontendOnly] [-NoReload]" -ForegroundColor Cyan
