#!/bin/bash

# Exit if any command fails
set -e

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y nginx
node -v
npm -v
