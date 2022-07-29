import { Seeder, path } from "../src/dependencies";

import { getServerConfig } from "../src/config/server-config";

import { LoggerCls } from "../src/utils/logger";

const SERVER_CONFIG = getServerConfig();

const seedDatabase = () => {
    const config = {
        database: SERVER_CONFIG.mongoDb.connectionUrl,
        dropCollections: true //drop collection before insert
    };

    const seeder = new Seeder(config);

    const resolvedPath = path.resolve(SERVER_CONFIG.seeder.collectionsPath);
    const collections = seeder.readCollectionsFromPath(resolvedPath);

    const promObj = seeder
        .import(collections)
        .then(() => {
            LoggerCls.info("seeding database is successful");
        })
        .catch(err => {
            LoggerCls.error("seeding database failed!", err);
        });

    return promObj;
};

export {
    seedDatabase
};




