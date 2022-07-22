const getServerConfig = () => {
    return {
        httpServer: {
            apiPrefix: "/api",
            port: process.env.PORT || 3000,
        },
        mongoDb: {
            connectionUrl: process.env.MONGODB_URL || "mongodb://localhost:27017",
            dbName: process.env.MONGODB_DB_NAME || "dbSpeedMernDemo"
        }

    };
};


export {
    getServerConfig,
};

