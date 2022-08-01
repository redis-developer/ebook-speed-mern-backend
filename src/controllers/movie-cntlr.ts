import type {
    CstObjectIdType,
} from "../dependencies";

import { yup } from "../dependencies";
import { IMovie } from "../models/movie-mdl";
import { COLLECTIONS } from "../config/server-config";

import { GenericDatabaseCls } from "../utils/mongodb/generic-database";
import { YupCls } from "../utils/yup";

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
        _movie = await YupCls.validateSchema(_movie, schema);

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


    static async validateUpdateMovieSchema(_movie: IMovie): Promise<IMovie> {
        const schema = yup.object().shape({
            movieId: yup.string().required(),

            title: yup.string(),
            tagline: yup.string(),
            plot: yup.string(),

            url: yup.string().url(),
            released: yup.date(),
            duration: yup.number(),

            languages: yup.array().of(yup.string()).min(1),
            countries: yup.array().of(yup.string()).min(1)

        });

        //@ts-ignore 
        _movie = await YupCls.validateSchema(_movie, schema);

        return _movie;
    }

    static async updateMovie(_movie: IMovie, _userId: string): Promise<CstObjectIdType> {
        let updatedId: CstObjectIdType = "";
        const collectionName = COLLECTIONS.MOVIES.collectionName;
        const keyName = COLLECTIONS.MOVIES.keyName;

        if (_movie && _movie[keyName]) {
            const id = _movie[keyName];

            _movie = await MovieController.validateUpdateMovieSchema(_movie);

            updatedId = await GenericDatabaseCls.updateDocumentById({
                id: id,
                collectionName: collectionName,
                keyName: keyName,
                document: _movie,
                updatedBy: _userId,

                isReplaceFlatArray: true,
                flatArrayProps: {
                    languages: 1,
                    countries: 1
                }
            });


        }

        return updatedId;
    }
}

export {
    MovieController
};