import { yup } from "../dependencies";
import { IMovie } from "../models/movie-mdl";
import { COLLECTIONS } from "../config/server-config";

import { GenericDatabaseCls } from "../utils/mongodb/generic-database";

class MovieController {

    static async validateInsertMovieSchema(_movie: IMovie): Promise<IMovie> {
        const schema = yup.object().shape({
            title: yup.string().required(),
            tagline: yup.string().required(),
            plot: yup.string().required(),

            url: yup.string().url(),
            released: yup.date(),
            duration: yup.number(),

            languages: yup.array().of(yup.string()).min(1),
            countries: yup.array().of(yup.string()).min(1)

        });

        //@ts-ignore 
        //validate & remove unknown properties
        _movie = await schema
            .validate(_movie, {
                strict: false,
                stripUnknown: true
            })
            .catch((err) => {
                if (err) {
                    const trimmedError = {
                        name: err.name,
                        details: err.errors
                    };
                    throw trimmedError;
                }
            });

        //@ts-ignore
        _movie = schema.cast(_movie); //string to date/ number..etc safe type casting

        return _movie;
    }

    static async insertMovie(_movie: IMovie, _userId: string): Promise<string> {
        let insertedId = "";
        const collectionName = COLLECTIONS.MOVIES.collectionName;
        const keyName = COLLECTIONS.MOVIES.keyName;

        if (_movie) {
            _movie = await MovieController.validateInsertMovieSchema(_movie);

            insertedId = await GenericDatabaseCls.insertDocument({
                collectionName: collectionName,
                keyName: keyName,
                document: _movie,
                createdBy: _userId
            });


        }

        return insertedId;
    }
}

export {
    MovieController
};