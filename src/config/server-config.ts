const getServerConfig = () => {
    return {
        httpServer: {
            apiPrefix: "/api",
            port: process.env.PORT || 3000,
        }

    };
};


export {
    getServerConfig,
};

