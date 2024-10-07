#!/bin/bash
ENV_FILE="./.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "The $ENV_FILE file is missing!"
  exit 1
fi

docker compose --env-file "$ENV_FILE" up postgres -d --build