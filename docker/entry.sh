#!/bin/bash

CONTAINER_ALREADY_STARTED="CONTAINER_ALREADY_STARTED_PLACEHOLDER"
# Applies DB schema on first boot only,
# based on: https://stackoverflow.com/a/50638207
if [ ! -e /home/node/$CONTAINER_ALREADY_STARTED ]; then
    # Clear database and apply sample data on first boot
    npx prisma migrate reset --force --skip-generate

    touch /home/node/$CONTAINER_ALREADY_STARTED
fi

# Start NestJS
node /usr/src/app/dist/src/main.js
