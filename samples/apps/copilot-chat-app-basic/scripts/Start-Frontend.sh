#!/bin/bash

# Initializes and runs the Copilot Chat frontend.

set -e

ScriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ScriptDir/../WebApp"
EnvFilePath="$ScriptDir/../WebApp/.env"


# Overwrite existing .env file
echo "REACT_APP_BACKEND_URI=https://localhost:40443/" > $EnvFilePath

# Build and run the frontend application
yarn install && yarn start
