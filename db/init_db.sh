#!/bin/bash

set -e

until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# run the command
if [ "$1" = 'init' ]; then
    psql -U $POSTGRES_USER -d $POSTGRES_DB -a -f /docker-entrypoint-initdb.d/init.sql
fi

exec "$@"
