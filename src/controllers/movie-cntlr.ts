import type {
    CstObjectIdType,
    Document
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

    static async getMoviesByText(_doc: Document): Promise<Document[]> {
        let movieList: Document[] = [];
        const collectionName = COLLECTIONS.MOVIES.collectionName;

        if (_doc && _doc.searchText) {

            const pipelineArr = [
                {
                    "$search": { //$search must be the first stage in a pipeline
                        "index": COLLECTIONS.MOVIES.Indexes.INDEX_MOVIES_QUICK_TEXT_SEARCH,
                        "text": {
                            "query": _doc.searchText,
                            "path": ["plot", "tagline", "title"], //The multi path option is for type string only.
                            // "path": {
                            //     "wildcard": "*"
                            // }
                        }
                    }
                },
                {
                    "$match": {
                        "statusCode": { $gt: 0 }
                    }
                },
                {
                    "$sort": {
                        "imdbVotes.low": -1
                    }
                },
                {
                    "$project": {
                        "movieId": 1,
                        "title": 1,
                        "tagline": 1,
                        "plot": 1,
                        "url": 1,
                        "released": 1,
                        "duration": 1,
                        "languages": 1,
                        "countries": 1
                    }
                }
            ];
            movieList = await GenericDatabaseCls.aggregate({
                collectionName: collectionName,
                pipelineArr: pipelineArr,
                isInitializePipelineArr: false
            });

        }
        else {
            throw "searchText is mandatory!";
        }

        return movieList;
    }
}

export {
    MovieController
};