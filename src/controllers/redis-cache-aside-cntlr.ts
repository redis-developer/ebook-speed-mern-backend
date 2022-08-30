import type {
    Document
} from "../dependencies";

import { getServerConfig } from "../config/server-config";
import { getRedisOm } from "../utils/redis/redis-om-wrapper";
import { LoggerCls } from "../utils/logger";
import { CryptoCls } from "../utils/crypto";


class RedisCacheAsideController {

    static getHashKey(_filter: Document) {
        let retKey = "";

        if (_filter) {
            retKey = "CACHE_ASIDE_" + CryptoCls.hashString(JSON.stringify(_filter));
        }

        return retKey;
    }

    static setDataInRedis(_filter: Document, _data: Document[], isErrorAsync?: boolean): Promise<string | void> {

        let promObj: Promise<string | void> = new Promise((resolve, reject) => {
            const redisOmWrapperInst = getRedisOm();
            const SERVER_CONFIG = getServerConfig();

            if (_data && _data.length && _filter && redisOmWrapperInst
                && redisOmWrapperInst.nodeRedisClient) {
                const hashKey = RedisCacheAsideController.getHashKey(_filter);
                const dataStr = JSON.stringify(_data);

                const expirySec = SERVER_CONFIG.redis.cacheAsideExpiryInSeconds;
                redisOmWrapperInst.nodeRedisClient
                    .set(hashKey, dataStr, {
                        "EX": expirySec
                    }).then(() => {
                        resolve(hashKey);
                    })
                    .catch((err) => {
                        reject(err);
                    });

            }
            else {
                reject("Input params failed - RedisCacheAsideController.addDataToRedis()!");
            }
        });

        if (isErrorAsync) {
            promObj = promObj.catch((err) => {
                LoggerCls.error(err);
            });
        }
        return promObj;
    }

    static getDataFromRedis(_filter: Document): Promise<Document[]> {
        const promObj: Promise<Document[]> = new Promise((resolve, reject) => {
            const redisOmWrapperInst = getRedisOm();
            if (_filter && redisOmWrapperInst
                && redisOmWrapperInst.nodeRedisClient) {
                const hashKey = RedisCacheAsideController.getHashKey(_filter);
                const startNow = performance.now();
                redisOmWrapperInst.nodeRedisClient
                    .get(hashKey)
                    .then((data) => {
                        //--perf--
                        const endNow = performance.now();
                        const logData = {
                            collectionName: "CACHE_ASIDE_*",
                            filter: _filter,
                            stats: (endNow - startNow)
                        };
                        LoggerCls.info("RedisCacheAside perf-", logData);
                        //--perf ends--

                        const docArr = data ? JSON.parse(data) : [];
                        resolve(docArr);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
            else {
                reject("Input params failed - RedisCacheAsideController.getDataFromRedis()!");
            }

        });
        return promObj;
    }
}

export {
    RedisCacheAsideController
};