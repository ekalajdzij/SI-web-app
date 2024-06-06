docker stop si-web-app_react_frontend_1
docker stop si-web-app_dotnet_backend_1
docker stop mysql-db

docker system prune -a --volumes

