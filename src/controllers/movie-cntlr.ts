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

            if (_movie.released && _movie.released instanceof Date) {
                _movie.year = {
                    low: _movie.released.getFullYear(),
                    high: 0
                };
            }

            insertedId = await GenericDatabaseCls.insertDocument({
                collectionName: collectionName,
                keyName: keyName,
                document: _movie,
                createdBy: _userId
            });


        }
        else {
            throw "Movie data is mandatory!";
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
        else {
            throw "Movie data & id is mandatory!";
        }

        return updatedId;
    }

    static async getMoviesByText(_filter: Document): Promise<Document[]> {
        let movieList: Document[] = [];
        const collectionName = COLLECTIONS.MOVIES.collectionName;

        if (_filter && _filter.searchText) {

            const pipelineArr = [
                {
                    $search: {
                        index: COLLECTIONS.MOVIES.Indexes.INDEX_MOVIES_QUICK_TEXT_SEARCH,
                        compound: {
                            must: [
                                {
                                    range: {
                                        gt: 0,
                                        path: "statusCode",
                                    },
                                },
                                {
                                    text: {
                                        query: _filter.searchText,
                                        path: ["title", "tagline", "plot"],
                                    },
                                }
                            ],
                        },
                    },
                },
                {
                    $project: {
                        movieId: 1,
                        title: 1,
                        tagline: 1,
                        plot: 1,
                        url: 1,
                        released: 1,
                        duration: 1,
                        languages: 1,
                        countries: 1
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

    static async validateBasicFiltersSchema(_filter: Document): Promise<Document> {
        const schema = yup.object().shape({
            imdbRating: yup.number(),
            countries: yup.array().of(yup.string()).min(1),
            releaseYear: yup.number(),
            title: yup.string()
        });

        //@ts-ignore 
        _filter = await YupCls.validateSchema(_filter, schema);

        return _filter;
    }
    static buildBasicFiltersQuery(_filter: Document): Document[] {
        const compoundQueries: Document[] = [{
            range: {
                gt: 0,
                path: "statusCode",
            },
        }];

        if (_filter) {

            if (_filter.imdbRating >= 0) {
                compoundQueries.push({
                    range: {
                        gte: _filter.imdbRating,
                        path: "imdbRating",
                    },
                });
            }


            if (_filter.countries && _filter.countries.length) {
                compoundQueries.push({
                    text: {
                        query: _filter.countries,
                        path: "countries",
                    },
                });
            }

            if (_filter.releaseYear >= 0) {
                compoundQueries.push({
                    range: {
                        gte: _filter.releaseYear,
                        lte: _filter.releaseYear, //no eq in range
                        path: "year.low",
                    },
                });
            }

            if (_filter.title) {
                compoundQueries.push({
                    text: {
                        query: _filter.title,
                        path: "title",
                    },
                });
            }
        }

        return compoundQueries;
    }
    static async getMoviesByBasicFilters(_filter: Document): Promise<Document[]> {
        let movieList: Document[] = [];
        const collectionName = COLLECTIONS.MOVIES.collectionName;

        if (_filter && Object.keys(_filter).length) {
            _filter = await MovieController.validateBasicFiltersSchema(_filter);
            const compoundQueries = MovieController.buildBasicFiltersQuery(_filter);
            const pipelineArr = [
                {
                    $search: {
                        index: COLLECTIONS.MOVIES.Indexes.INDEX_MOVIES_BASIC_SEARCH,
                        compound: {
                            must: compoundQueries,
                        },
                    },
                },
                {
                    $project: {
                        movieId: 1,
                        title: 1,
                        tagline: 1,
                        plot: 1,
                        url: 1,
                        released: 1,
                        duration: 1,
                        languages: 1,
                        countries: 1
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
            throw "At least one key to filter is mandatory!";
        }

        return movieList;
    }
}

export {
    MovieController
};