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
};

