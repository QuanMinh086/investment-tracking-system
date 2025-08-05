#!/bin/bash

# Exit if any command fails
set -e

cat <<EOT > /home/ubuntu/backend/.env
PORT=8000
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
DB_PORT=5432
JWT_SECRET=${JWT_SECRET}
EOT
