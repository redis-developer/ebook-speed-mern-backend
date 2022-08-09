const COLLECTIONS = {
    MOVIES: {
        collectionName: "movies",
        keyName: "movieId",
        Indexes: { //docs/indexing/mongodb-atlas.md
            INDEX_MOVIES_QUICK_TEXT_SEARCH: "index_movies_quick_text_search",
            INDEX_MOVIES_BASIC_SEARCH: "index_movies_basic_search"
        }
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
        }
    };
};


export {
    getServerConfig,
    COLLECTIONS
};

