#!/usr/bin/env bash

echo "Starting entry-point-db.sh and creating users and databases"

mongosh --authenticationDatabase admin -u root1 -p password1 app_db --eval "db.createUser({user: 'devUser', pwd: 'devUserPassword1', roles: [{role: 'readWrite', db: 'app_db'}]})"

echo "Finished entry-point-db.sh"