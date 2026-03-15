#!/bin/bash
set -e

echo "Updating packages..."
sudo apt update

echo "Installing Postgres, Redis, Python3-venv, and Nginx..."
sudo DEBIAN_FRONTEND=noninteractive apt-install -y postgresql postgresql-contrib redis-server python3.12-venv python3-pip nginx curl

echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
sudo npm install -g pm2

echo "Configuring PostgreSQL Database..."
sudo -u postgres psql -c "CREATE USER cafteria_user WITH PASSWORD 'cafteria_password';" || true
sudo -u postgres psql -c "CREATE DATABASE cafteriaflow OWNER cafteria_user;" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cafteriaflow TO cafteria_user;" || true

echo "Configuring Python Backend..."
cd ~/CafteriaFlow
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run initial DB tables creation
cat << 'EOF' > create_tables.py
from database import engine, Base
from models import Tenant, Order, Menu
import os
os.environ["DATABASE_URL"] = "postgresql://cafteria_user:cafteria_password@localhost/cafteriaflow"
Base.metadata.create_all(bind=engine)
print("Tables created.")
EOF
python create_tables.py

echo "Configuring Node.js Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Starting PM2 Ecosystem..."
export DATABASE_URL="postgresql://cafteria_user:cafteria_password@localhost/cafteriaflow"
export REDIS_URL="redis://localhost:6379/0"
# Set an empty nvidia limit key or valid one if user supplied
export NVIDIA_API_KEY="your-nvidia-api-key"

# Update ecosystem config for production paths (python virtualenv)
sed -i 's|"python3"|"./venv/bin/python"|' ecosystem.config.js

pm2 start ecosystem.config.js
pm2 save

echo "VPS Setup Complete!"
