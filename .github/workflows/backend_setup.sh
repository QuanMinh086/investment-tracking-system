#!/bin/bash

# Exit if any command fails
set -e

cat <<EOT > /home/ubuntu/backend/.env
PORT=8000
DB_HOST=localhost
DB_USER="${{ secrets.DB_USER }}"
DB_PASSWORD="${{ secrets.DB_PASSWORD }}"
DB_NAME="${{ secrets.DB_NAME }}"
DB_PORT=5432
JWT_SECRET="${{ secrets.JWT_SECRET }}"
EOT
