## Write through

- Refer [write-through](https://developer.redis.com/howtos/solutions/caching-architecture/write-through/) tutorial for details

### Docker compose

- start redis, postgres and adminer

```sh
docker compose up -d
```

### Create Table

Next, open your browser to [http://localhost:8080/?pgsql=postgres&username=root&db=example&ns=public&sql=](http://localhost:8080/?pgsql=postgres&username=root&db=example&ns=public&sql=). You will have to input the password (which is "password" in the example above), then you will be taken to a SQL command page. Run the following SQL command to create a table:

```sql title="users.sql"
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Run recipe

```sh
node wt-main.js
```

Note : Above command will take few minutes to set up Write through

### Insert data in to Redis

```
hset __{users:1} username john email john@gmail.com pwhash d1e8a70b5ccab1dc2f56bbf7e99f064a660c08e361a35751b9c483c88943d082 first John last Doe dob 1990-01-01 created_at 2023-04-20 updated_at 2023-04-20
```

### Verify data in Postgres

- open [select page in Adminer](http://localhost:8080/?pgsql=postgres&username=root&db=example&ns=public&select=users) to see the inserted data
