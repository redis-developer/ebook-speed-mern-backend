# speed-mern-app-demo-backend

Speed your MERN app by REDIS

## Manage application

### Start application

```sh
# to start docker app
docker compose up -d
```

Note:

- Can view MongoDB data in MongoDB compass at URI "mongodb://localhost:27017"
- Can view Redis data in [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) at localhost with port 6379
- Can change above connection details or ports by the environment variables in .env file

When starting the backend app, it takes few minutes to perform following

- Seed the movie data to MongoDB
- Setup "Write behind strategy" for syncing between Redis and MongoDB
- Start the API server

### Other commands

```sh
# to stop docker app
docker compose down

# to stop & also delete volumes (mongodb & redis data)
docker compose down -v

# to rebuild all images & start
docker compose  up -d --build

# to rebuild image of specific service (after any code changes)
docker-compose build --no-cache <service_name>
# example
docker-compose build --no-cache movie_backend_service
```

## Documentation

### APIs

- [Insert Movie](./docs/api/01-insert-movie.md)
- [Update Movie](./docs/api/02-update-movie.md)
- [Get Movies by Text](./docs/api/03-get-movies-by-text.md)
- [Get Movies by Basic Filters](./docs/api/04-get-movies-by-basic-filters.md)
- [Get Masters by Category](./docs/api/05-get-masters-by-category.md)

### Folder structure

- [Folder structure](./docs/folder-structure.md)
