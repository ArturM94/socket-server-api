#!/usr/bin/env bash
echo "restarting the Docker app container..."
docker-compose stop app
docker-compose kill app
docker-compose rm -f app
docker-compose up -d --build app
