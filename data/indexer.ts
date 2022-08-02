/**
//For MongoDB Community
import type { Document } from "../src/dependencies";
import type { NodeMongoWrapperCls } from "../src/utils/mongodb/node-mongo-wrapper";

import { getServerConfig } from "../src/config/server-config";

import { LoggerCls } from "../src/utils/logger";
import { setMongodb, getMongodb } from "../src/utils/mongodb/node-mongo-wrapper";


const SERVER_CONFIG = getServerConfig();

const createCollectionIndex = async (_collectionName: string, _indexName: string, _indexKey: Document, mongodbWrapperInst: NodeMongoWrapperCls) => {
    try {
        if (_collectionName && _indexName && _indexKey) {
            const db = mongodbWrapperInst.globalDB;
            if (db) {
                const collection = db.collection(_collectionName);
                const isIndexExist = await collection.indexExists(_indexName);
                if (isIndexExist) {
                    await collection.dropIndex(_indexName);
                }
                await collection.createIndex(_indexKey, { name: _indexName });
            }
        }
    }
    catch (err) {
        LoggerCls.error(`${_indexName} index creation failed!`, err);
    }

};

const createAllIndexes = async () => {
    await setMongodb(SERVER_CONFIG.mongoDb.connectionUrl, SERVER_CONFIG.mongoDb.dbName);
    const mongodbWrapperInst = getMongodb();

   
    const indexerDetails = SERVER_CONFIG.indexer;
    for (const detail of indexerDetails) {
        await createCollectionIndex(detail.collectionName, detail.indexName, detail.indexKey, mongodbWrapperInst);
    }
    LoggerCls.info("Indexing data is successful");

    mongodbWrapperInst.closeConnection();

};

export {
    createAllIndexes
};
 */

/**
    *  SERVER_CONFIG.indexer = [{
           collectionName: COLLECTIONS.MOVIES.collectionName,
           indexName: "index_movie_id",
           indexKey: {
               "movieId": 1
           }
       },
       {
           collectionName: COLLECTIONS.MOVIES.collectionName,
           indexName: "index_movies_quick_text_search",
           indexKey: { //only one text index per collection (MongoDB limitation)
               "statusCode": 1,
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
               "statusCode": 1,
               "imdbRating": 1,
               "languages": 1, //only one array field can be indexed (MongoDB limitation)
               // "countries": 1,
               "year.low": 1,
               "title": 1,
               "imdbVotes.low": 1 //for sort
           }
       }
       ]
    */