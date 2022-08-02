# speed-mern-app-demo-backend

Speed your MERN app by REDIS

## Project setup

### (1) Config

Please create **.env file** at root and add appropriate "redis" and "mongodb" server connection string details

```js
//consider sample
PORT=3000
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/dbSpeedMernDemo?retryWrites=true&w=majority
REDIS_URL=127.0.0.1:6379
```

### (2) Install packages

```sh
npm install
```

### (3) Seed movies data to MongoDB

```sh
npm run data
```

### (4) Index data in MongoDB Atlas

- [Refer](./docs/indexing/mongodb-atlas.md)

### (5) Run project locally

```sh
npm start
```

## Documentation

### APIs

- [Insert Movie](./docs/api/01-insert-movie.md)
- [Update Movie](./docs/api/02-update-movie.md)
- [Get Movies by Text](./docs/api/03-get-movies-by-text.md)
- [Get Movies by Basic Filters](./docs/api/04-get-movies-by-basic-filters.md)

### Folder structure

- [Folder structure](./docs/folder-structure.md)
