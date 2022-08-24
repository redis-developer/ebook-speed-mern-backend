import { RedisEntity, RedisSchema } from "../../dependencies";
import { getRedisOm } from "../../utils/redis/redis-om-wrapper";

/*
An Entity is the class that holds you data when you work with it.
It is what you create, read, update, and delete.
*/
class MovieEntity extends RedisEntity {
}

/*
schema defines the fields on your entity, their types, and
how they are mapped internally to Redis.
Valid types are: string, number, boolean, string[], date, point, and text.
*/

const schema = new RedisSchema(MovieEntity, {
    movieId: { type: "string" },

    title: { type: "text" },
    tagline: { type: "text" },
    plot: { type: "text" },

    poster: { type: "string" },
    url: { type: "string" },
    released: { type: "date" },
    year_low: { type: "number" },
    duration: { type: "number" },

    languages: { type: "string[]" },
    countries: { type: "string[]" },

    imdbRating: { type: "number" },
});
/*
    Note :
    - Date can be set using not only a Date but also a String containing an ISO 8601 date *******
       or a Number with the UNIX epoch time in milliseconds.
    - string fields can only be matched on their whole value—no partial matches—and are best for keys
    - text fields are like string but have full-text search enabled on them and are optimized for human-readable text.
  */


/*
 A Repository is the main interface into Redis OM. It gives us the methods to read, write, and remove a specific Entity
 */

const getRepository = () => {
    const redisOmWrapperInst = getRedisOm();
    return redisOmWrapperInst.client?.fetchRepository(schema);
};

/*
we need to create an index or we won't be able to search.
Redis OM uses hash to see if index needs to be recreated or not 
*/

const createIndex = async () => {
    const repository = getRepository();
    if (repository) {
        await repository.createIndex();
    }
};

export {
    getRepository,
    createIndex
};