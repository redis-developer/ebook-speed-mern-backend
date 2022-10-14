import type { IMovie } from "../models/movie-mdl";
import { DB_ROW_STATUS } from "../utils/mongodb/generic-database.types";
import { ObjectId } from "../dependencies";
import * as MovieRepo from "../models/redis/movie-repo";


class RedisWriteBehindController {
    static async insertMovieToRedis(_movie: IMovie, _userId: string): Promise<IMovie> {
        const repository = MovieRepo.getRepository();

        if (_movie && Object.keys(_movie).length && repository) {

            _movie._id = (new ObjectId()).toString();
            _movie.movieId = _movie._id;
            _movie.createdOn = (new Date()).toISOString();
            _movie.createdBy = _userId;
            _movie.lastUpdatedOn = null;
            _movie.lastUpdatedBy = null;
            _movie.statusCode = DB_ROW_STATUS.ACTIVE;

            const entity = repository.createEntity(_movie);
            await repository.save(entity);
        }
        else {
            throw "Movie data is mandatory!";
        }

        return _movie;
    }
}

export {
    RedisWriteBehindController
};