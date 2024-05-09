FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
# EXPOSE 80
# EXPOSE 443
EXPOSE 7174

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SI Web API.csproj", "."]

RUN dotnet restore "SI Web API.csproj" --disable-parallel
COPY . .
RUN dotnet build "SI Web API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SI Web API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SI Web API.dll"]

