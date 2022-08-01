const COLLECTIONS = {
    MOVIES: {
        collectionName: "movies",
        keyName: "movieId"
    }
};

const getServerConfig = () => {
    const dbName = process.env.MONGODB_DB_NAME || "dbSpeedMernDemo";

    return {
        httpServer: {
            apiPrefix: "/api",
            port: process.env.PORT || 3000,
        },
        mongoDb: {
            connectionUrl: process.env.MONGODB_URL || `mongodb://localhost:27017/${dbName}`,
            dbName: dbName
        },
        seeder: {
            collectionsPath: "./data/collections"
        },
        indexer: [{
            collectionName: COLLECTIONS.MOVIES.collectionName,
            indexName: "index_movie_id",
            indexKey: {
                "movieId": "string"
            }
        },
        {
            collectionName: COLLECTIONS.MOVIES.collectionName,
            indexName: "index_movies_quick_text_search",
            indexKey: { //only one text index per collection (MongoDB limitation)
                "title": "text",
                "tagline": "text",
                "plot": "text",
                "imdbVotes.low": 1 //for sort
            }
        },
        {
            collectionName: COLLECTIONS.MOVIES.collectionName,
            indexName: "index_movies_basic_search",
            indexKey: {
                "imdbRating": 1,
                "languages": 1, //only one array field can be indexed (MongoDB limitation)
                // "countries": 1,
                "year.low": 1,
                "title": 1,
                "imdbVotes.low": 1 //for sort
            }
        }
        ]
    };
};


export {
    getServerConfig,
    COLLECTIONS
};

