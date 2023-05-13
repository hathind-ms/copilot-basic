<#
.SYNOPSIS
Initializes and runs the Copilot Chat frontend.
#>

#Requires -Version 6


Join-Path "$PSScriptRoot" '..' 'WebApp' | Set-Location
$EnvFilePath = '.env'

# Overwrite existing .env file
Set-Content -Path $EnvFilePath -Value "REACT_APP_BACKEND_URI=https://localhost:40443/"

# Build and run the frontend application
yarn install
yarn start
