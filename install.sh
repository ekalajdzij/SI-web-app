#!/bin/bash
echo "Starting server setup"

echo "Checking for docker enviroment..."

if [ -x "$(command -v docker)" ]; then
    echo "Docker installed"    
else
    echo "Installing docker..."
    sudo apt-get update
    sudo apt-get install curl 
    sudo apt install apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install docker-ce -y

    sudo systemctl status docker
fi

if [ -x "$(command -v docker-compose)" ]; then
    echo "Docker-compose installed"    
else
    echo "Installing docker-compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
fi

sudo docker-compose build
sudo docker-compose up -d
echo "Images are built..."

sudo docker cp dbinit.sql si-web-app_mssql_1:dbinit.sql
sudo docker exec -u root si-web-app_mssql_1 sh -c "apt-get update && apt-get install sqlcmd && sqlcmd -S localhost -d master -U sa -P Admin123! -i dbinit.sql"


