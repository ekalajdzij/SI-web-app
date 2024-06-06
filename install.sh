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

   # sudo systemctl status docker
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

# Manual run
#sudo docker run --name mysql-db -e MYSQL_DATABASE=baza -e MYSQL_ROOT_PASSWORD=password -d mysql:latest
#sleep 5
#sudo docker run -dp 5200:8080 --name back -e REACT_APP_BACKEND_URL=http://localhost:8080/  -e ASPNETCORE_ENVIRONMENT=Development -d si-web-app_dotnet_backend
#sudo docker run -dp 5173:5173 --name front -d si-web-app_react_frontend

echo "Images are built..."

sudo docker cp dbinit.sql mysql-db:dbinit.sql
sudo docker exec -u root mysql-db sh -c "mysql -u root -p password  baza < dbinit.sql"



